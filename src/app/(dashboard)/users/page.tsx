import { routes } from '@/constants/route'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

import UserList from '@/views/users/list'

export const metadata = {
  title: 'Users | Sadaat Association'
}

const Page = () => {
  return (
    <>
      <BreadcrumbComponent data={[{ path: routes.users, title: 'Users' }]} />
      <UserList />
    </>
  )
}

export default Page
