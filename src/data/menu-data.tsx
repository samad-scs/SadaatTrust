import { IconDashboard, IconUser, IconUserShield } from '@tabler/icons-react'
import { type Icon } from '@tabler/icons-react'

import { routes } from '@/constants/route'

export interface MenuDataType {
  title: string
  url: string
  protected?: boolean
  icon: Icon
}

export const menuData: MenuDataType[] = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: IconDashboard
  },
  {
    title: 'Admin Users',
    url: routes.users,
    protected: true,
    icon: IconUserShield
  },
  {
    title: 'Beneficiary',
    url: routes.beneficiary,
    icon: IconUser
  }
]
