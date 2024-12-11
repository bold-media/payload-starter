import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import config from '@payload-config';

export const getSettings = cache(unstable_cache(async () => {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({slug: "settings"}).then((res) => res).catch(() => null);
    return settings
}, ['getSettings'], {tags: ["settings"]}))