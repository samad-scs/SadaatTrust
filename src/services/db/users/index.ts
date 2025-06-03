import axios from 'axios'
import { toast } from 'sonner'

const eps = {
  list: '/api/v1/users',
  add: '/api/v1/users',
  view: '/api/v1/users/',
  update: '/api/v1/users/',
  updateStatus: '/api/v1/users/',
  deleteItem: '/api/v1/users/'
}

export const fetchUsersList = async (page: number, pageSize: number) => {
  const response = await fetch(`${eps?.list}?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) throw new Error('Failed to fetch users')

  return response.json()
}

export const createNewAdminUserAPI = async (body: any) => {
  try {
    const response = await axios.post(`${eps?.add}`, body)
    if (!response.data?.status) throw new Error('Failed to add users')

    toast.success(response?.data?.message || 'User created successfully')

    return response.data
  } catch {
    return null
  }
}

export const viewAdminUser = async (id: string) => {
  try {
    const response = await axios.get(eps?.view + id)
    if (!response.data?.status) throw new Error('Failed to get user')

    return response.data
  } catch {
    return null
  }
}

export const updateAdminUserAPI = async (id: string, body: any) => {
  try {
    const response = await axios.put(eps?.update + id, body)
    if (!response.data?.status) throw new Error(response.data?.message || 'Failed to update user')

    toast.success(response?.data?.message || 'User updated successfully')

    return response.data
  } catch (error: any) {
    toast.error(error || 'Failed to update user')

    return null
  }
}

export const updateAdminUserStatusAPI = async (id: string, status: boolean) => {
  try {
    const response = await axios.patch(eps?.updateStatus + id, { status })
    if (!response.data?.status) throw new Error(response.data?.message || 'Failed to update user status')

    toast.success(response?.data?.message || 'User status updated successfully')

    return response.data
  } catch (error: any) {
    toast.error(error || 'Failed to update user status')

    return null
  }
}

export const deleteAdminUser = async (id: string) => {
  try {
    const response = await axios.delete(eps?.deleteItem + id)
    if (!response.data?.status) throw new Error('Failed to delete user')

    toast.success(response?.data?.message || 'User deleted successfully')

    return response.data
  } catch {
    return null
  }
}
