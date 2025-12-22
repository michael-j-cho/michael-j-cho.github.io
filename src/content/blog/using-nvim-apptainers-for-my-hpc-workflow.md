---
title: Neovim (with all the plugins) on HPC clusters
description: I use Neovim btw... 😂 Here's my setup on high performance clusters — with all the bells and whistles.
date: Dec 22 2025
image: ../../assets/blog/using-nvim-apptainers-for-my-hpc-workflow/using-nvim-apptainers-for-my-hpc-workflow.png
authors:
  - michael
---
# Coding on a High Performance Cluster (HPC)

Finding the optimal setup for coding on any platform, operating system, and even computing domain has led me to switch to Neovim/Vim. A whole article can be written (and many have...) about the advantages and productivity boost that developers and coders obtain from Neovim, but in short, it's gamified my coding sessions, and the responsiveness and speed are unmatched. Most importantly, because Neovim runs in the terminal, I'm able to quickly setup my IDE of choice by installing its package and pulling my configs from a repo. 

However, with my foray into deep learning and leveraging GPU compute resources — I ran into a problem: HPC clusters like Purdue Anvil, Delta AI, and PACE Phoenix have enterprise operating systems that Neovim is not fully compatible with. Enter [Apptainer](https://apptainer.org/). 

```
Bootstrap: docker
From: ubuntu:24.04

%post
    # --- 1. System Dependencies ---
    export DEBIAN_FRONTEND=noninteractive
    
    # Install curl/ca-certificates first to set up repos
    apt-get update && apt-get install -y curl ca-certificates gnupg

    # --- 2. Set up Node.js 22 Repository ---
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

    # Update again and install base tools + Node.js 22
    # Added python3-venv (crucial for python dev)
    apt-get update && apt-get install -y \
        nodejs \
        python3-venv \
        wget \
        git \
        build-essential \
        unzip \
        tar \
        gzip \
        locales

    # Fix locale (critical for nvim icons/TUI)
    locale-gen en_US.UTF-8

    # --- 3. Install Neovim v0.11.5 ---
    NVIM_VER="v0.11.5"
    echo "Installing Neovim $NVIM_VER..."
    mkdir -p /opt/nvim
    curl -LO "https://github.com/neovim/neovim/releases/download/${NVIM_VER}/nvim-linux-x86_64.tar.gz"
    tar -C /opt/nvim -xzf nvim-linux-x86_64.tar.gz --strip-components=1
    rm nvim-linux-x86_64.tar.gz

    # --- 4. Install Ripgrep (rg) ---
    RG_VER="14.1.0"
    curl -LO "https://github.com/BurntSushi/ripgrep/releases/download/${RG_VER}/ripgrep_${RG_VER}-1_amd64.deb"
    dpkg -i ripgrep_${RG_VER}-1_amd64.deb
    rm ripgrep_${RG_VER}-1_amd64.deb

    # --- 5. Install fd (fd-find) ---
    apt-get install -y fd-find
    ln -s $(which fdfind) /usr/local/bin/fd

    # --- 6. Install Lazygit ---
    LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
    echo "Installing Lazygit v$LAZYGIT_VERSION..."
    curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
    tar xf lazygit.tar.gz lazygit
    install lazygit /usr/local/bin
    rm lazygit lazygit.tar.gz

    # --- 7. Install Tree-sitter CLI ---
    npm install -g tree-sitter-cli

    # --- 8. Install Ruff (Linter & Formatter) ---
    echo "Installing Ruff..."
    # 1. Get the latest tag (e.g., v0.8.2)
    RUFF_TAG=$(curl -s "https://api.github.com/repos/astral-sh/ruff/releases/latest" | grep -Po '"tag_name": "\K[^"]*')
    # 2. Download the official linux-gnu binary
    curl -LO "https://github.com/astral-sh/ruff/releases/download/${RUFF_TAG}/ruff-x86_64-unknown-linux-gnu.tar.gz"
    # 3. Extract and move to path
    tar -xzf ruff-x86_64-unknown-linux-gnu.tar.gz
    cp ruff-x86_64-unknown-linux-gnu/ruff /usr/local/bin/ruff
    # 4. Cleanup
    rm -rf ruff-x86_64-unknown-linux-gnu ruff-x86_64-unknown-linux-gnu.tar.gz

    # --- Cleanup ---
    apt-get clean
    rm -rf /var/lib/apt/lists/*

%environment
    export PATH=/opt/nvim/bin:$PATH
    export LC_ALL=en_US.UTF-8
    export LANG=en_US.UTF-8
    export XDG_CONFIG_HOME=$HOME/.config
    
    # FORCE INTERNAL COMPILERS
    export CC=/usr/bin/gcc
    export CXX=/usr/bin/g++
    
    # Unset host include paths
    unset CPATH
    unset C_INCLUDE_PATH
    unset CPLUS_INCLUDE_PATH
    unset OBJC_INCLUDE_PATH

%runscript
    exec /opt/nvim/bin/nvim "$@"

%labels
    Author User
    Version 1.2
    NeovimVersion v0.11.5
    NodeVersion v22.x
    RuffVersion Latest

```

