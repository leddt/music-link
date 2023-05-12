import services from "./services.js";

const targetService = "youtubeMusic";

const domains = Object.entries(services)
    .filter(([key, _]) => key !== targetService)
    .map(([_, value]) => value.url);

const cache = {}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status !== "loading") return;
    if (!tab.url) return;
    
    if (!domains.find(x => tab.url.indexOf(x) == 0)) return;

    try {
        const data = await getLinks(tab.url);

        if (data.linksByPlatform[targetService]) {
            chrome.tabs.update(tabId, {
                url: data.linksByPlatform[targetService].url
            })
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

                return response.json();
            })
            .catch(() => delete cache[url]);
    }

    return cache[url]
}