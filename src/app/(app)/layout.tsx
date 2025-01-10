import { getSettings } from '@/modules/common/data'
import { LivePreviewListener } from '@/modules/layout/LivePreviewListener'
import { generateMeta } from '@/utils/generateMeta'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import { ExitPreview } from '@/modules/layout/ExitPreview'
import { Montserrat } from 'next/font/google'
import { cn } from '@/utils/cn'

const montserrat = Montserrat({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { isEnabled: draft } = await draftMode()
  return (
    <html lang="ru">
      <body className={cn(montserrat.variable, 'relative bg-background font-sans antialiased')}>
        {draft && (
          <>
            <LivePreviewListener />
            <ExitPreview />
          </>
        )}
        {children}
      </body>
    </html>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings()

  if (!settings) {
    notFound()
  }
  return generateMeta({ meta: settings?.seo })
}

export default RootLayout
