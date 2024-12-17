import { cn } from '@/utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ReactElement } from 'react'

const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'text-inherit',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      success: 'text-emerald-500',
      destructive: 'text-destructive',
      warning: 'text-yellow-500',
    },
    size: {
      sm: 'size-4', // 16px
      md: 'size-5', // 20px
      lg: 'size-6', // 24px
      xl: 'size-8', // 32px
      '2xl': 'size-10', // 40px
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface BaseIconProps extends Omit<VariantProps<typeof iconVariants>, 'size'> {
  size?: IconSize
  className?: string
  muted?: boolean
}

type IconProps = BaseIconProps & {
  type?: 'lucide' | 'heroicons' | 'tabler'
  children: ReactElement
}

export const Icon = ({
  children,
  type = 'lucide',
  variant,
  size = 'md',
  className,
  muted = false,
}: IconProps) => {
  const sizeInPixels = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  }[size]

  const props = {
    className: cn(iconVariants({ variant, size }), muted && 'opacity-60', className),
    ...(type !== 'heroicons' && {
      size: sizeInPixels,
      strokeWidth: 1.5,
    }),
  }

  return React.cloneElement(children, props)
}

Icon.displayName = 'Icon'
