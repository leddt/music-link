import services from "./services.js";
import { getPreferences, setPreferredService, addIgnoredService, removeIgnoredService } from "./preferences.js";

const preferredServiceSelect = document.querySelector("#preferredService");
const ignoredServicesContainer = document.querySelector("#ignoredServices");

for (const [id, service] of Object.entries(services)) {
    const option = document.createElement("option");
    option.innerText = service.name;
    option.value = id;

    preferredServiceSelect.appendChild(option);

    const label = document.createElement("label");
    label.classList.add("flex", "gap-1");
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
});

getPreferences().then(({ preferredService, ignoredServices }) => {
    if (preferredService) {
        preferredServiceSelect.value = preferredService;
    }

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