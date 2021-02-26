const form = document.getElementById('configuration');

function handleFormSubmit(event) {
    event.preventDefault();
    const data = new FormData(form);
    const config = Object.fromEntries(data);
    chrome.storage.local.set({'configuration': config});
}

function setElementIdValue(id, value) {
    elem = document.getElementById(id);
    elem.value = value;
}

chrome.storage.local.get('configuration', (data) => {
    for (const key in data.configuration) {
        setElementIdValue(key, data.configuration[key]);
    }
    form.addEventListener('submit', handleFormSubmit);
});
