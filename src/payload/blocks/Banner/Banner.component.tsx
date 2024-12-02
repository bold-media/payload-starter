import type { BannerBlock as BannerBlockProps } from '@payload-types'

import { cn } from '@/lib/utils'
import React from 'react'
import { RichText } from '@/modules/common/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-red-700 bg-red-300': style === 'error',
          'border-green-700 bg-green-300': style === 'success',
          'border-yellow-700 bg-yellow-300': style === 'warning',
        })}
      >
        <RichText content={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
