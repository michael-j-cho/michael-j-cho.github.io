import { Icon } from '@iconify/react'

// Optional: Keep a small map ONLY for icons you want to override manually.
// For example, if you want 'mdi:windows' to actually look like a Server icon.
import { Server } from 'lucide-react'

const customOverrides: { [key: string]: any } = {
  // 'mdi:windows': Server, // Uncomment if you prefer the Server icon for Windows
}

export function getIcon(iconName: string) {
  // 1. Check if we have a manual override for this specific string
  if (customOverrides[iconName]) {
    return customOverrides[iconName]
  }

  // 2. Otherwise, return a wrapper around the dynamic Iconify component
  // This works for 'mdi:arch', 'simple-icons:linux', 'lucide:box', etc. automatically.
  return (props: any) => <Icon icon={iconName} {...props} />
}
