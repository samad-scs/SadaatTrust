'use client'

import { memo, useState } from 'react'

import { User } from '@prisma/client'
import { IconDotsVertical } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { PlusIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { deleteAdminUser, fetchUsersList } from '@/services/db/users'

import { showAlert } from '@utils/alert'

import AdminUserForm from './form'

const RowActions = ({ data, refetch }: { data: User; refetch: () => void }) => {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleDelete = async () => {
    showAlert({
      title: 'Are you sure?',
      text: `By clicking on "Yes, delete", you will delete the ${data?.name}`,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: 'red',
      showCancelButton: true
    }).then(async value => {
      if (value?.isConfirmed) {
        await deleteAdminUser(data?.id)
      }
    })
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} variant='destructive'>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AdminUserForm open={open} setOpen={setOpen} refetch={refetch} editData={data} />
    </>
  )
}

const UserList = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [openAddForm, setOpenAddForm] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => fetchUsersList(page, pageSize),
    retry: false
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
          <Switch disabled={row?.original?.isSuperAdmin} defaultChecked={!!row?.original?.status} />
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (row.original.createdAt ? dayjs(row.original.createdAt).format('MMM D, YYYY') : 'N/A')
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row: { original } }) => <RowActions data={original} refetch={refetch} />
    }
  ]

  console.log('data?.users :', data?.users)

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } }
  })

  return (
    <div className='space-y-3 m-4'>
      <div className='flex justify-between items-center'>
        <div />
        <div>
          <Button onClick={() => setOpenAddForm(true)}>
            <PlusIcon />
            Add User
          </Button>
        </div>
      </div>
      <div className='rounded-lg overflow-hidden border border-muted'>
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
      <AdminUserForm open={openAddForm} setOpen={setOpenAddForm} refetch={refetch} />
    </div>
  )
}

export default memo(UserList)
