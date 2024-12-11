import type { Metadata } from 'next'
// import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
    type: "website",
    description: 'Website built with NextJS and PayloadCMS.',
    //no default og image
    // images: [
    //     {
    //         url: `${getServerSideURL()}/website-default-OG.webp`
    //     }
    // ]
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "NextJS Website by Boldmedia",
    title: process.env.NEXT_PUBLIC_APP_NAME || "NextJS Website by Boldmedia"
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
    return {
        ...defaultOpenGraph,
        ...og,
        images: og?.images ? og.images : defaultOpenGraph?.images ? defaultOpenGraph.images : undefined
    }
}