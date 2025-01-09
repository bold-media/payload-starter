import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentPropsWithRef } from 'react'
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import { TypographyVariantProps } from '@/styles/typography'

export const richTextVariants = cva(undefined, {
  variants: {
    container: {
      true: 'max-w-none content-grid',
      false: '',
    },
  },
  defaultVariants: {
    container: true,
  },
})

export interface RichTextProps
  extends ComponentPropsWithRef<'div'>,
    VariantProps<typeof richTextVariants> {
  data: SerializedEditorState<SerializedLexicalNode> | undefined | null
  prose?: TypographyVariantProps | false
}
