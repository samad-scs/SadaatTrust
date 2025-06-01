import { IconDashboard, IconUsers } from '@tabler/icons-react'

import { routes } from '@/constants/route'

export const menuData = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: IconDashboard
  },
  {
    title: 'Users',
    url: routes.users,
    icon: IconUsers
  }
]
