import services from "./services.js";
import { getPreferences } from "./preferences.js";

const cache = {}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status !== "loading") return;
    if (!tab.url) return;

    const { preferredService, openNativeApp, ignoredServices } = await getPreferences();

    const domains = Object.entries(services)
        .filter(([key, _]) => key !== preferredService)
        .filter(([key, _]) => !ignoredServices.includes(key))
        .map(([_, value]) => value.url);
    
    if (!domains.find(x => tab.url.indexOf(x) == 0)) return;

    try {
        const data = await getLinks(tab.url);
        const platform = data.linksByPlatform[preferredService];

        if (platform) {
            if (openNativeApp && platform.nativeAppUriDesktop) {
                chrome.tabs.update(tabId, {
                    url: platform.nativeAppUriDesktop
                });
            } else {
                chrome.tabs.update(tabId, {
                    url: platform.url
                });
            }
        }
    } catch {}
})

function getLinks(url) {
    if (!cache[url]) {
        console.log(`fetch ${url}`)
        cache[url] = fetch(`https://api.song.link/v1-alpha.1/links?url=${url}`)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error("Links request failed")
                }

                setTimeout(() => delete cache[url], 3600 * 1000)

                return response.json();
            })
            .catch(() => delete cache[url]);
    }

    return cache[url]
}