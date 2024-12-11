import { getSettings } from '@/modules/common/data'
import '@/styles/globals.css'
import { generateMeta } from '@/utils/generateMeta'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings();

  if (!settings) {
    notFound()
  }
  return generateMeta({meta: settings?.seo})
}