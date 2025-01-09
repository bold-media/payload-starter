import { cva, type VariantProps } from 'class-variance-authority'

export const typographyVariants = cva('prose prose-zinc dark:prose-invert', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type TypographyVariantProps = VariantProps<typeof typographyVariants>
