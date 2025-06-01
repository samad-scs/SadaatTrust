'use client'

import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

import { IconDotsVertical, IconLogout, IconMoon, IconSun, IconUserCircle } from '@tabler/icons-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

import { getInitials } from '@utils/index'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {status === 'loading' ? (
          <Skeleton className='w-full h-12' />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg bg-primary'>
                  <AvatarImage alt={session?.user?.name} />
                  <AvatarFallback className='rounded-lg'>{getInitials(session?.user?.name || 'CN')}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{session?.user?.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>{session?.user?.email}</span>
                </div>
                <IconDotsVertical className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage alt={session?.user?.name} />
                    <AvatarFallback className='rounded-lg'>{getInitials(session?.user?.name || 'CN')}</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>{session?.user?.name}</span>
                    <span className='text-muted-foreground truncate text-xs'>{session?.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <IconUserCircle className='mr-2 h-4 w-4' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                      <IconMoon className='mr-2 h-4 w-4 dark:hidden' />
                      <IconSun className='mr-2 h-4 w-4 hidden dark:block' />
                      <span>Dark Mode</span>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={handleThemeToggle}
                      aria-label='Toggle dark mode'
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                <IconLogout className='mr-2 h-4 w-4' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
