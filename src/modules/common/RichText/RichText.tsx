import { cn } from '@/utils/cn'
import { jsxConverters } from './jsxConverters'
import { richTextVariants, type RichTextProps } from './variants'
import { RichText as RichTextBase } from '@payloadcms/richtext-lexical/react'
import { typographyVariants } from '@/styles/typography'

export const RichText = ({ data, container, prose = {}, className, ...rest }: RichTextProps) => {
  if (!data) return

  return (
    <RichTextBase
      converters={jsxConverters}
      data={data}
      className={cn(
        richTextVariants({
          container,
        }),
        prose !== false && typographyVariants(prose || {}),
      )}
      {...rest}
    />
  )
}
