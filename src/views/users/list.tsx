'use client'

import { memo, useState } from 'react'

import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const fetchUsers = async (page: number, pageSize: number) => {
  const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) throw new Error('Failed to fetch users')

  return response.json()
}

const UserList = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => fetchUsers(page, pageSize)
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className='font-medium min-w-32'>{row.original.name}</div>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className='min-w-56'>
          <Badge variant='outline' className='text-muted-foreground px-1.5'>
            {row.original.email}
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className='min-w-36'>
          <Switch defaultChecked={!!row?.original?.status} />
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (row.original.createdAt ? dayjs(row.original.createdAt).format('MMM D, YYYY') : 'N/A')
    }
  ]

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } }
  })

  return (
    <div className='m-4 rounded-lg overflow-hidden border border-muted'>
      <Table>
        <TableHeader className='bg-muted sticky top-0 z-10'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Skeleton className='h-8 w-full' />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
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
      <div className='flex items-center justify-between p-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span>
          Page {page} of {data?.totalPages ?? 1}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setPage(prev => prev + 1)}
          disabled={page >= (data?.totalPages ?? 1) || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default memo(UserList)
