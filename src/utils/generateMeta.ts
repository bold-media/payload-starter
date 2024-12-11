import type { Metadata, ResolvedMetadata } from 'next';

import type { Media, Config} from '@payload-types';

import { mergeOpenGraph } from './mergeOpenGraph';
import { getServerSideURL } from './getURL';

type PayloadMetadata = {
    title?: string | null;
    description?: string | null;
    image?: Media | string | null | undefined
} | string | undefined;

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
    const serverUrl = getServerSideURL();

    let url;

    if (image && typeof image === 'object' && 'url' in image) {
        const ogUrl = image?.sizes?.og?.url

        url = ogUrl ? serverUrl + ogUrl : serverUrl + image?.url
    }

    return url
}

export const generateMeta = async (args: {
    meta: PayloadMetadata
    fallback?: ResolvedMetadata
    pathname?: string
}): Promise<Metadata> => {
    const { meta: data, fallback, pathname } = args;
    const seo = typeof(data) === "object" ? data : undefined;

    const ogImage = getImageURL(seo?.image)

    const title = seo?.title ? seo?.title : fallback?.title ? fallback?.title : process.env.NEXT_PUBLIC_APP_NAME || ''
    const description = seo?.description ? seo?.description : fallback?.description ? fallback?.description : "";
    return {
        description,
        openGraph: mergeOpenGraph({
            title,
            description,
            images: ogImage ? [{ url: ogImage }] : fallback?.openGraph?.images,
            url: pathname || undefined
        })
    }
}