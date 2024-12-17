import React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Spinner } from '../Spinner'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'text-sm font-medium transition-colors active-class',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4',
        lg: 'h-10 px-7',
        xl: 'h-11 px-10',
        icon: 'h-9 w-9',
      },
      radius: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      radius: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const getSpinnerVariant = (buttonVariant: ButtonProps['variant'] = 'default') => {
  switch (buttonVariant) {
    case 'outline':
    case 'ghost':
    case 'secondary':
    case 'link':
      return 'default' // Uses the primary color for these variants
    default:
      return 'white' // Uses white for filled variants (default, secondary, destructive)
  }
}

// Helper function to determine spinner size based on button size
const getSpinnerSize = (buttonSize: ButtonProps['size'] = 'default') => {
  switch (buttonSize) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'sm'
    case 'xl':
      return 'md'
    case 'icon':
      return 'sm'
    default:
      return 'sm'
  }
}

export const Button = ({
  className,
  variant,
  size,
  children,
  asChild = false,
  disabled,
  loading = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), {
        'disabled:pointer-events-none text-transparent relative select-none': loading,
        'disabled:pointer-events-none disabled:opacity-50': disabled && !loading,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={getSpinnerSize(size)} variant={getSpinnerVariant(variant)} />
        </div>
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}

Button.displayName = 'Button'
