import services from "./services.js";
import { getPreferences, setPreferredService, setOpenNativeApp, addIgnoredService, removeIgnoredService } from "./preferences.js";

const preferredServiceSelect = document.querySelector("#preferredService");
const ignoredServicesContainer = document.querySelector("#ignoredServices");
const nativeOptionsContainer = document.querySelector("#nativeOptions");
const nativeCheckbox = document.querySelector("#nativeCheckbox");

for (const [id, service] of Object.entries(services)) {
    const option = document.createElement("option");
    option.innerText = service.name;
    option.value = id;

    preferredServiceSelect.appendChild(option);

    const label = document.createElement("label");
    label.classList.add("flex", "gap-1", "text-xs");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `ignore-${id}`;
    checkbox.value = id;
    checkbox.addEventListener("change", handleIgnoredServiceChanged)
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(service.name));

    ignoredServicesContainer.appendChild(label);
}

preferredServiceSelect.addEventListener("change", (ev) => {
    const value = ev.target.value;
    setPreferredService(value);
    showNativeOptionsIfSupported(value);
});

nativeCheckbox.addEventListener("change", (ev) => {
    const value = ev.target.checked;
    setOpenNativeApp(value);
});

getPreferences().then(({ preferredService, openNativeApp, ignoredServices }) => {
    if (preferredService) {
        preferredServiceSelect.value = preferredService;
        showNativeOptionsIfSupported(preferredService);
    }

    nativeCheckbox.checked = openNativeApp;

    for (const service of ignoredServices) {
        const checkbox = document.querySelector(`#ignore-${service}`)
        if (checkbox) checkbox.checked = true;
    }
})

function handleIgnoredServiceChanged(ev) {
    if (ev.target.checked) {
        addIgnoredService(ev.target.value);
    } else {
        removeIgnoredService(ev.target.value);
    }
}

function showNativeOptionsIfSupported(serviceId) {
    const supportsNativeApp = services[serviceId].supportsNativeApp ?? false;
    nativeOptionsContainer.classList.toggle("hidden", !supportsNativeApp);
}