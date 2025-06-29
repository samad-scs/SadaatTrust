import { useMemo } from 'react'

import Link from 'next/link'

import { IconGenderBigender, IconGenderFemale, IconGenderMale } from '@tabler/icons-react'
import { DotIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import { personAvatar } from '@/services/beneficiary/avatar-assign'

import { getInitials } from '@utils/index'

import { useBeneficiaryBasic } from './context'

const BeneficiaryHeader = () => {
  const { beneficiary } = useBeneficiaryBasic()

  const avatarImage = useMemo(() => {
    if (!beneficiary) return '/images/avatar/male-unmarried.jpg'

    return personAvatar(beneficiary)
  }, [beneficiary])

  const currentAge = useMemo(() => {
    if (!beneficiary?.age) return ''

    const age = beneficiary?.age

    const yearsGap = new Date().getFullYear() - new Date(beneficiary?.createdAt).getFullYear()

    return age + yearsGap
  }, [beneficiary?.age, beneficiary?.createdAt])

  return (
    <Card>
      <CardContent>
        <div className='flex lg:flex-row flex-col items-center lg:items-start gap-4'>
          {/* Profile Image */}
          <Avatar className='h-16 w-16 lg:h-28 lg:w-28 rounded-sm shadow-lg'>
            <AvatarImage alt={beneficiary?.name} src={avatarImage} />
            <AvatarFallback className='rounded-sm bg-accent'>{getInitials(beneficiary?.name || 'CN')}</AvatarFallback>
          </Avatar>

          <div className='flex-1 flex justify-between'>
            <div className='space-y-1 text-center lg:text-left lg:space-y-2'>
              <h2 className='font-semibold text-lg lg:text-2xl'>{beneficiary?.name}</h2>

              <div className='flex justify-center lg:justify-start items-center gap-1'>
                <UserIcon className='size-4 lg:size-5 shrink-0' />
                <p className='text-base lg:text-lg'>{currentAge}</p>
                <DotIcon />
                {beneficiary?.gender === 'male' ? (
                  <IconGenderMale className='size-4 lg:size-5 shrink-0' />
                ) : beneficiary?.gender === 'female' ? (
                  <IconGenderFemale className='size-4 lg:size-5 shrink-0' />
                ) : (
                  <IconGenderBigender className='size-4 lg:size-5 shrink-0' />
                )}
                <p className='text-base lg:text-lg capitalize'>{beneficiary?.gender}</p>
              </div>

              <div className='flex lg:flex-row flex-col items-center justify-center lg:justify-start gap-1'>
                <div className='flex items-center gap-1'>
                  <PhoneIcon className='size-4 lg:size-5 shrink-0' />
                  <Link href={`tel:${beneficiary?.mobile}`}>
                    <p className='text-base lg:text-lg'>{beneficiary?.mobile}</p>
                  </Link>
                  <DotIcon className='lg:hidden' />
                  <Badge className='text-xs rounded-full capitalize bg-accent lg:hidden'>
                    {beneficiary?.priorityLevel + ' Priority'}
                  </Badge>
                </div>

                <DotIcon className='hidden lg:block' />

                <div className='flex items-center gap-1 line-clamp-1'>
                  <MapPinIcon className='size-4 lg:size-5 shrink-0' />
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${beneficiary?.address}`}
                    target='_blank'
                  >
                    <p className='text-base lg:text-lg line-clamp-1'>{beneficiary?.address}</p>
                  </Link>
                </div>
              </div>
            </div>

            <div className='hidden lg:block'>
              <Badge className='text-sm rounded-full capitalize bg-accent'>
                {beneficiary?.priorityLevel + ' Priority'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BeneficiaryHeader
