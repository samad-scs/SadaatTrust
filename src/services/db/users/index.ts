export const fetchUsers = async (page: number, pageSize: number) => {
  const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) throw new Error('Failed to fetch users')

  return response.json()
}
