chrome.storage.local.get('configuration', (data) => {
    const config = data.configuration;
    updateUnreadCount(config);
    setupAlarm(config);
});

function combineUnreadCount(data) {
    return data.feeds.reduce((a, b) => a.unreadCount + b.unreadCount);
}

function fetchUnreadCount(config, callback) {
    const request = new Request(config.host + 'apps/news/api/v1-2/feeds', {
        headers: {
            'Authorization': 'Basic ' + btoa(config.username + ':' + config.password),
            'Accept': 'application/json'
        }
    });

    fetch(request)
        .then(response => response.json())
        .then(data => callback(combineUnreadCount(data)));
}

function updateUnreadCount(config) {
    fetchUnreadCount(config, (count) => chrome.action.setBadgeText({text: count.toString()}));
}

function setupAlarm(config) {
    chrome.alarms.create({periodInMinutes: 5.0});

    chrome.alarms.onAlarm.addListener(() => {
        updateUnreadCount(config);
    });
}