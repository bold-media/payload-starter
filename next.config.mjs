import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    ppr: 'incremental',
    dynamicIO: true,
  },
}

export default withPayload(nextConfig)
