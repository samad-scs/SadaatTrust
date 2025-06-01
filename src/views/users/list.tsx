'use client'

import { memo } from 'react'

import { User } from '@prisma/client'
import { IconDotsVertical } from '@tabler/icons-react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const UserList = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'header',
      header: 'Header',
      cell: ({ row }) => {
        return row?.original?.name
      },
      enableHiding: false
    },
    {
      accessorKey: 'type',
      header: 'Section Type',
      cell: ({ row }) => (
        <div className='w-32'>
          <Badge variant='outline' className='text-muted-foreground px-1.5'>
            {row.original.email}
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Switch defaultChecked={!!row?.original?.name} />
    },

    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => row?.original?.createdAt
    },
    {
      id: 'actions',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
              size='icon'
            >
              <IconDotsVertical />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-32'>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const table = useReactTable({
    data: [] as User[],
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='m-4 rounded-lg overflow-hidden border border-muted'>
      <Table>
        <TableHeader className='bg-muted sticky top-0 z-10'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='**:data-[slot=table-cell]:first:w-8'>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default memo(UserList)
