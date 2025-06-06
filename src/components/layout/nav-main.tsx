'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuDataType } from '@/data/menu-data'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

interface NavMainProps {
  items: MenuDataType[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const session = useSession()

  const itemFilter = (item: MenuDataType) => {
    if (item?.protected) {
      return session?.data?.user?.canViewData === true
    }

    return true
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items?.filter(itemFilter).map(item => (
            <SidebarMenuItem key={item.title}>
              <Link href={item?.url}>
                <SidebarMenuButton isActive={pathname?.startsWith(item?.url)} tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
