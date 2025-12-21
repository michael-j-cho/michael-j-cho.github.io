import { useEffect } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

// Types for technologies
type Category = {
  text: string
  logo: string
}

type Technologies = {
  'Infrastructure & Operations': Category[]
  'Data Science & AI': Category[]
  'Software & Web Development': Category[]
}

// Technologies based on updated list
const technologies: Technologies = {
  'Infrastructure & Operations': [
    { text: 'Linux', logo: 'simple-icons:linux' },
    { text: 'Debian', logo: 'simple-icons:debian' },
    { text: 'Arch', logo: 'simple-icons:archlinux' },
    { text: 'Ubuntu', logo: 'simple-icons:ubuntu' },
    { text: 'Proxmox', logo: 'simple-icons:proxmox' },
    { text: 'Docker', logo: 'mdi:docker' },
    { text: 'Kubernetes', logo: 'mdi:kubernetes' },
    { text: 'Portainer', logo: 'simple-icons:portainer' },
    { text: 'Apptainer', logo: 'lucide:box' },
    { text: 'AWS', logo: 'simple-icons:amazonaws' },
    { text: 'EC2', logo: 'lucide:server' },
    { text: 'S3', logo: 'lucide:database' },
    { text: 'PfSense', logo: 'simple-icons:pfsense' },
    { text: 'OPNSense', logo: 'simple-icons:opnsense' },
    { text: 'Tailscale', logo: 'simple-icons:tailscale' },
    { text: 'Nginx', logo: 'simple-icons:nginx' },
    { text: 'Apache', logo: 'simple-icons:apache' },
    { text: 'Windows Server', logo: 'mdi:windows' },
  ],
  'Data Science & AI': [
    { text: 'Python', logo: 'simple-icons:python' },
    { text: 'PyTorch', logo: 'simple-icons:pytorch' },
    { text: 'Tensorflow', logo: 'simple-icons:tensorflow' },
    { text: 'Hugging Face', logo: 'simple-icons:huggingface' },
    { text: 'Pandas', logo: 'simple-icons:pandas' },
    { text: 'Polars', logo: 'simple-icons:polars' },
    { text: 'NumPy', logo: 'simple-icons:numpy' },
    { text: 'Spark', logo: 'simple-icons:apachespark' },
    { text: 'Dask', logo: 'simple-icons:dask' },
    { text: 'Slurm', logo: 'lucide:cpu' },
    { text: 'CUDA', logo: 'simple-icons:nvidia' },
    { text: 'Jupyter', logo: 'simple-icons:jupyter' },
    { text: 'MATLAB', logo: 'simple-icons:mathworks' },
    { text: 'Latex', logo: 'simple-icons:latex' },
  ],
  'Software & Web Development': [
    { text: 'TypeScript', logo: 'simple-icons:typescript' },
    { text: 'JavaScript', logo: 'simple-icons:javascript' },
    { text: 'Node.js', logo: 'simple-icons:nodedotjs' },
    { text: 'Astro', logo: 'simple-icons:astro' },
    { text: 'Tailwind', logo: 'simple-icons:tailwindcss' },
    { text: 'C++', logo: 'simple-icons:cplusplus' },
    { text: 'Java', logo: 'simple-icons:openjdk' },
    { text: 'MySQL', logo: 'simple-icons:mysql' },
    { text: 'Git', logo: 'mdi:git' },
    { text: 'Neovim', logo: 'simple-icons:neovim' },
    { text: 'VSCode', logo: 'simple-icons:visualstudiocode' },
    { text: 'Obsidian', logo: 'simple-icons:obsidian' },
    { text: 'Bash', logo: 'simple-icons:gnubash' },
    { text: 'Zsh', logo: 'lucide:terminal' },
  ],
}

const categories = Object.keys(technologies)
// We maintain the 3-group split for the 3 infinite scroll rows
const categoryGroups = [
  [categories[0]],
  [categories[1]],
  [categories[2]],
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
            duration={60000} // Slightly slower for readability with more items
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
                      data-tech-name={`${category}-${techIndex}`}
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
