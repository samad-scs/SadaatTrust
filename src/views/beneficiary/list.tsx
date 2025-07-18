'use client'

import { memo, useState } from 'react'

import Link from 'next/link'

import { Beneficiary, User } from '@prisma/client'
import { IconDotsVertical } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { EyeIcon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'

import { routes } from '@/constants/route'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { deleteBeneficiary, fetchBeneficiaryList } from '@/services/beneficiary'

import { showAlert } from '@utils/alert'

export type BeneficiaryWithCreator = Beneficiary & { creator: User | null }

const RowActions = ({ data, refetch }: { data: BeneficiaryWithCreator; refetch: () => void }) => {
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
        await deleteBeneficiary(data?.id).then(res => {
          if (res?.status) {
            toast.success(res?.message)
          } else {
            toast.error(res?.message)
          }
        })
        refetch()
      }
    })
  }

  return (
    <div className='min-w-20 flex justify-end'>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-44'>
          <Link href={routes.beneficiaryDetails + data?.id}>
            <DropdownMenuItem>
              <EyeIcon />
              View
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} variant='destructive'>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const BeneficiaryList = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['beneficiary', page, pageSize],
    queryFn: () => fetchBeneficiaryList({ page, pageSize }),
    retry: false
  })

  const columns: ColumnDef<BeneficiaryWithCreator>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='font-medium min-w-32'>
          <p className='w-min'>
            <Link className='w-min' href={routes.beneficiaryDetails + row.original?.id}>
              {row.original.name}
            </Link>
          </p>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className='min-w-32'>{row.original.earningMembers}</div>
    },
    {
      accessorKey: 'Created By',
      header: 'Created At',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <UserIcon className='size-5 shrink-0' />
          <div className='space-y-0.5'>
            <p className='font-semibold'>{row?.original?.creator?.name || 'Unknown'}</p>
            <p className='text-xs font-semibold'>
              {row.original.createdAt ? dayjs(row.original.createdAt).format('MMM D, YYYY') : 'N/A'}
            </p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row: { original } }) => <RowActions data={original} refetch={refetch} />
    }
  ]

  const table = useReactTable({
    data: data?.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } }
  })

  return (
    <div className='space-y-3 m-4'>
      <div className='flex justify-between items-center'>
        <div />
        <Link href={routes.beneficiaryCreate}>
          <Button>
            <PlusIcon />
            Add Beneficiary
          </Button>
        </Link>
      </div>
      <div className='rounded-lg overflow-hidden border border-muted bg-card'>
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
    </div>
  )
}

export default memo(BeneficiaryList)
