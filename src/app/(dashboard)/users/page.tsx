import { routes } from '@/constants/route'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

export const metadata = {
  title: 'Users | Sadaat Association'
}

const Page = () => {
  return (
    <>
      <BreadcrumbComponent data={[{ path: routes.users, title: 'Users' }]} />
    </>
  )
}

export default Page
