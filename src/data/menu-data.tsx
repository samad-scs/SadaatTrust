import { IconDashboard, IconUserShield } from '@tabler/icons-react'

import { routes } from '@/constants/route'

export const menuData = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: IconDashboard
  },
  {
    title: 'Admin Users',
    url: routes.users,
    icon: IconUserShield
  }
]
