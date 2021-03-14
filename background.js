const color = '#1baefe'; // Nextcloud Color

chrome.action.setBadgeBackgroundColor({color});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.unreadCount) {
        updateBadgeUnreadCount(changes.unreadCount.newValue);
    }
});

chrome.runtime.onMessage.addListener(request => {
    updateBadgeUnreadCount(request.count);
});

chrome.storage.local.get('unreadCount', (data) => {
    updateBadgeUnreadCount(data.unreadCount);
});

chrome.storage.local.get('configuration', (data) => {
    const config = data.configuration;
    updateUnreadCount(config);
    setupAlarm(config);
});

function updateBadgeUnreadCount(count) {
    chrome.action.setBadgeText({text: count > 0 ? count.toString() : ''});
}

function addToCurrentUnreadCount(diff) {
    chrome.storage.local.get('unreadCount', (data) => {
        chrome.storage.local.set({'unreadCount': data.unreadCount + diff});
    });
}

function combineUnreadCount(data) {
    return data.feeds.map(x => x.unreadCount).reduce((a, b) => a + b);
}

async function fetchUnreadCount(config) {
    const request = new Request(config.host + 'apps/news/api/v1-2/feeds', {
        headers: {
            'Authorization': 'Basic ' + btoa(config.username + ':' + config.password),
            'Accept': 'application/json'
        }
    });

    response = await fetch(request);
    data = await response.json();

    return combineUnreadCount(data);
}

async function updateUnreadCount(config) {
    count = await fetchUnreadCount(config);
    chrome.storage.local.set({'unreadCount': count});
}

function setupAlarm(config) {
    chrome.alarms.create({periodInMinutes: 2.0});

    chrome.alarms.onAlarm.addListener(() => {
        updateUnreadCount(config);
    });
}