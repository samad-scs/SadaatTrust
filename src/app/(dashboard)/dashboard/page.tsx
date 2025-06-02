import { Metadata } from 'next'

import BreadcrumbComponent from '@/components/custom/breadcrumb'

export const metadata: Metadata = {
  title: 'Dashboard | Sadaat Association'
}

const Page = () => {
  return (
    <>
      <BreadcrumbComponent data={[]} />
    </>
  )
}

export default Page
