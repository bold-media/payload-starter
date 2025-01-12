import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { LexicalEditorProps } from '@payloadcms/richtext-lexical'

type Options = {
  admin?: LexicalEditorProps['admin']
  headings?: boolean | Array<'h1' | 'h2' | 'h3' | 'h4'>
  align?: boolean
}

export const textEditor = ({ admin, headings = true, align = true }: Options = {}) => {
  return lexicalEditor({
    admin,
    features({ rootFeatures }) {
      const filteredFeatures = rootFeatures.filter((feature) => {
        const featureName = feature?.key
        const featuresToRemove = [
          'unorderedList',
          'orderedList',
          'blockquote',
          'indent',
          'horizontalRule',
        ]

        if (headings === false) {
          return false
        }

        if (align === false) {
          return false
        }

        return !featuresToRemove.includes(featureName)
      })

      const customizedFeatures = filteredFeatures.map((feature) => {
        const featureName = feature?.key

        if (featureName === 'heading' && Array.isArray(headings)) {
          return HeadingFeature({
            enabledHeadingSizes: headings,
          })
        }

        return feature
      })

      return customizedFeatures
    },
  })
}
