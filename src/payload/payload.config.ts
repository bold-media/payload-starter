// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from 'payload/i18n/en'
import { ru } from 'payload/i18n/ru'

import { collections } from './collections'
import { User } from './collections/User'
import { messages } from './i18n'
import { plugins } from './plugins'
import { rootEditor } from './fields/lexical/rootEditor'
import { globals } from './globals'
import { migrations } from '@/migrations'
import { disableEnums } from './overrides/disableEnums'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: User.slug,
    dateFormat: 'PP p',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'en',
    translations: messages,
  },
  collections,
  globals,
  editor: rootEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    idType: 'uuid',
    prodMigrations: migrations,
    beforeSchemaInit: [disableEnums],
  }),
  sharp,
  plugins,
})
