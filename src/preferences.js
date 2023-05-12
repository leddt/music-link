
export async function getPreferences() {
    const { preferredService, ignoredServices } = await chrome.storage.sync.get(["preferredService", "ignoredServices"]);
    return { 
        preferredService: preferredService || "youtubeMusic", 
        ignoredServices: ignoredServices || ["soundcloud"]
    };
}

export async function setPreferredService(preferredService) {
    await chrome.storage.sync.set({ preferredService });
}

export async function addIgnoredService(service) {
    let { ignoredServices } = await chrome.storage.sync.get(["ignoredServices"]);
    
    if (!ignoredServices) ignoredServices = [];
    if (ignoredServices.indexOf(service) < 0) ignoredServices.push(service);

    await chrome.storage.sync.set({ ignoredServices });
}

export async function removeIgnoredService(service) {
    let { ignoredServices } = await chrome.storage.sync.get(["ignoredServices"]);

    if (!ignoredServices) ignoredServices = [];
    ignoredServices = ignoredServices.filter(x => x != service);

    await chrome.storage.sync.set({ ignoredServices });
}