'use client'

import * as React from 'react'

import Link from 'next/link'

import { webConfig } from '@/config'
import { IconChartBar, IconDashboard, IconFolder, IconListDetails, IconUsers } from '@tabler/icons-react'
import { HelpingHand } from 'lucide-react'

import { routes } from '@/constants/route'

import { NavMain } from '@/components/layout/nav-main'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Dashboard',
      url: routes.dashboard,
      icon: IconDashboard
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: IconListDetails
    },
    {
      title: 'Analytics',
      url: '#',
      icon: IconChartBar
    },
    {
      title: 'Projects',
      url: '#',
      icon: IconFolder
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <Link href={routes.dashboard}>
                <HelpingHand className='!size-5' />
                <span className='text-base font-semibold'>{webConfig.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
