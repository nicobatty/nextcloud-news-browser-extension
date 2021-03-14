document.addEventListener('readystatechange', event => {
    const feedElem = document.querySelector('.subscriptions-feed');
    if (feedElem) {
        const observer = new MutationObserver((event) => {
            const elem = event[0].target;
            const count = parseInt(elem.getAttribute('title'));
            console.log(count);
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage({count: count});
            }
        });

        const counterElem = feedElem.querySelector('.app-navigation-entry-utils-counter');
        observer.observe(counterElem, {attributes: true});
    }
});

