import { useEffect } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

// Types for technologies
type Category = {
  text: string
  logo: string
}

type Technologies = {
  'Systems, Networking & Infrastructure': Category[]
  'Data Science, AI & Graphics': Category[]
  'Development, Languages & Tools': Category[]
}

const technologies: Technologies = {
  'Systems, Networking & Infrastructure': [
    { text: 'Linux', logo: 'simple-icons:linux' },
    { text: 'Debian', logo: 'simple-icons:debian' },
    { text: 'Arch', logo: 'simple-icons:archlinux' },
    { text: 'Ubuntu', logo: 'simple-icons:ubuntu' },
    { text: 'macOS', logo: 'simple-icons:macos' },
    { text: 'Windows', logo: 'mdi:windows' },
    { text: 'Windows Server', logo: 'mdi:microsoft-windows' },
    { text: 'Android', logo: 'simple-icons:android' },
    { text: 'iOS', logo: 'simple-icons:ios' },
    { text: 'Proxmox', logo: 'simple-icons:proxmox' },
    { text: 'Docker', logo: 'mdi:docker' },
    { text: 'Portainer', logo: 'simple-icons:portainer' },
    { text: 'Kubernetes', logo: 'mdi:kubernetes' },
    { text: 'Apptainer', logo: 'lucide:box' },
    { text: 'AWS', logo: 'simple-icons:amazonaws' },
    { text: 'EC2', logo: 'lucide:server' },
    { text: 'S3', logo: 'lucide:database' },
    { text: 'PfSense', logo: 'simple-icons:pfsense' },
    { text: 'OPNSense', logo: 'simple-icons:opnsense' },
    { text: 'Tailscale', logo: 'simple-icons:tailscale' },
    { text: 'RDP', logo: 'lucide:monitor-remote' },
    { text: 'VNC', logo: 'lucide:screen-share' },
    { text: 'Nginx', logo: 'simple-icons:nginx' },
    { text: 'Apache', logo: 'simple-icons:apache' },
  ],
  'Data Science, AI & Graphics': [
    { text: 'PyTorch', logo: 'simple-icons:pytorch' },
    { text: 'Tensorflow', logo: 'simple-icons:tensorflow' },
    { text: 'Hugging Face', logo: 'simple-icons:huggingface' },
    { text: 'Flower', logo: 'lucide:flower-2' },
    { text: 'OpenCV', logo: 'simple-icons:opencv' },
    { text: 'OpenGL', logo: 'simple-icons:opengl' },
    { text: 'CUDA', logo: 'simple-icons:nvidia' },
    { text: 'Spark', logo: 'simple-icons:apachespark' },
    { text: 'Dask', logo: 'simple-icons:dask' },
    { text: 'Pandas', logo: 'simple-icons:pandas' },
    { text: 'Polars', logo: 'simple-icons:polars' },
    { text: 'Numpy', logo: 'simple-icons:numpy' },
    { text: 'Numba', logo: 'simple-icons:python' }, // Fallback to python logo
    { text: 'MATLAB', logo: 'simple-icons:mathworks' },
    { text: 'Jupyter', logo: 'simple-icons:jupyter' },
    { text: 'Slurm', logo: 'lucide:cpu' },
    { text: 'HPC', logo: 'lucide:layers' },
    { text: 'Elastic', logo: 'simple-icons:elasticsearch' },
  ],
  'Development, Languages & Tools': [
    { text: 'Python', logo: 'simple-icons:python' },
    { text: 'TypeScript', logo: 'simple-icons:typescript' },
    { text: 'JavaScript', logo: 'simple-icons:javascript' },
    { text: 'Node.js', logo: 'simple-icons:nodedotjs' },
    { text: 'C++', logo: 'simple-icons:cplusplus' },
    { text: 'Java', logo: 'simple-icons:openjdk' },
    { text: 'Lua', logo: 'simple-icons:lua' },
    { text: 'HTML', logo: 'simple-icons:html5' },
    { text: 'CSS', logo: 'simple-icons:css3' },
    { text: 'Tailwind', logo: 'simple-icons:tailwindcss' },
    { text: 'Astro', logo: 'simple-icons:astro' },
    { text: 'MySQL', logo: 'simple-icons:mysql' },
    { text: 'Git', logo: 'mdi:git' },
    { text: 'Neovim', logo: 'simple-icons:neovim' },
    { text: 'VSCode', logo: 'simple-icons:visualstudiocode' },
    { text: 'Tmux', logo: 'simple-icons:tmux' },
    { text: 'Zsh', logo: 'lucide:terminal' },
    { text: 'Fish', logo: 'lucide:shell' },
    { text: 'Bash', logo: 'simple-icons:gnubash' },
    { text: 'Obsidian', logo: 'simple-icons:obsidian' },
    { text: 'Latex', logo: 'simple-icons:latex' },
    { text: 'Overleaf', logo: 'simple-icons:overleaf' },
  ],
}

const categories = Object.keys(technologies)
const categoryGroups = [
  [categories[0]], // Systems row (Longest)
  [categories[1]], // Data row
  [categories[2]], // Dev row
]

const Skills: React.FC = () => {
  useEffect(() => {
    document.querySelectorAll('.tech-badge').forEach((badge) => {
      badge.classList.add('tech-badge-visible')
    })
  }, [])

  return (
    <div className="z-30 mt-12 flex w-full flex-col max-w-[calc(100vw-5rem)] mx-auto lg:max-w-full">
      <div className="space-y-4">
        {categoryGroups.map((group, groupIndex) => (
          <InfiniteScroll
            key={groupIndex}
            // Logic: Longer rows move slightly faster to keep things dynamic
            duration={groupIndex === 0 ? 80000 : 60000}
            direction={groupIndex % 2 === 0 ? 'normal' : 'reverse'}
            showFade={true}
            className="flex flex-row justify-center"
          >
            {group.flatMap((category) =>
              technologies[category as keyof Technologies].map(
                (tech: Category, techIndex: number) => {
                  const IconComponent = getIcon(tech.logo)
                  return (
                    <div
                      key={`${category}-${techIndex}`}
                      className="tech-badge repo-card border-border bg-card text-muted-foreground mr-5 flex items-center gap-3 rounded-full border p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                    >
                      <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-full p-2 text-lg shadow-inner">
                        <IconComponent className="tech-icon text-primary" />
                      </span>
                      <span className="text-foreground font-medium whitespace-nowrap">
                        {tech.text}
                      </span>
                    </div>
                  )
                },
              ),
            )}
          </InfiniteScroll>
        ))}
      </div>
    </div>
  )
}

export default Skills
