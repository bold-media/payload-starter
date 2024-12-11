import { canUseDOM } from "./canUseDOM";

  //coolify flips FQDN and URL. To account for it being fixed in the future, we will check for both
  const COOLIFY_URL = process.env.COOLIFY_URL;
  const COOLIFY_FQDN = process.env.COOLIFY_FQDN;


const getCoolifyURL = ( url: string, fqdn: string) => {
    return url.startsWith('http') ? url : fqdn?.startsWith('http') ? fqdn : undefined;
}

export const getServerSideURL = () => {
    let url = process.env.NEXT_PUBLIC_APP_URL;

  

    if (!url && COOLIFY_FQDN && COOLIFY_URL) {
        url = getCoolifyURL(COOLIFY_URL, COOLIFY_FQDN)
    }

    if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    }
    
    if (!url) {
        url = 'http://localhost:3000'
    }

    return url
}

export const getClientSideURL = () => {
    if (canUseDOM) {
        const protocol = window.location.protocol;
        const domain = window.location.hostname;
        const port = window.location.port;

        return `${protocol}//${domain}${port ? `:${port}` : ''}`
    }

    if (COOLIFY_URL && COOLIFY_FQDN) {
        return getCoolifyURL(COOLIFY_URL, COOLIFY_FQDN)
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    }

    return process.env.NEXT_PUBLIC_APP_URL || ""
}