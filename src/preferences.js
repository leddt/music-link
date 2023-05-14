const defaultPreferredService = "youtubeMusic";
const defaultIgnoredServices = ["soundcloud"];

export async function getPreferences() {
    const { preferredService, ignoredServices } = await chrome.storage.sync.get(["preferredService", "ignoredServices"]);
    return { 
        preferredService: preferredService || defaultPreferredService, 
        ignoredServices: ignoredServices || defaultIgnoredServices
    };
}

export async function setPreferredService(preferredService) {
    await chrome.storage.sync.set({ preferredService });
}

export async function addIgnoredService(service) {
    let { ignoredServices } = await chrome.storage.sync.get(["ignoredServices"]);
    
    if (!ignoredServices) ignoredServices = defaultIgnoredServices;
    if (ignoredServices.indexOf(service) < 0) ignoredServices.push(service);

    await chrome.storage.sync.set({ ignoredServices });
}

export async function removeIgnoredService(service) {
    let { ignoredServices } = await chrome.storage.sync.get(["ignoredServices"]);

    if (!ignoredServices) ignoredServices = defaultIgnoredServices;
    ignoredServices = ignoredServices.filter(x => x != service);

    await chrome.storage.sync.set({ ignoredServices });
}