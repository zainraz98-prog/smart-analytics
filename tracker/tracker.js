(function() {
    // UPDATED: Points to your live InfinityFree URL
    const API_URL = "http://swiftstats.infinityfreeapp.com/backend/log.php";
    
    const trackVisit = async () => {
        const payload = new URLSearchParams({
            url: window.location.href,
            referrer: document.referrer || 'Direct'
        });

        try {
            await fetch(API_URL, { // FIXED: Correctly uses API_URL
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: payload
            });
            console.log("SwiftStats: Analytics recorded.");
        } catch (error) {
            console.error("SwiftStats: Analytics sync failed.");
        }
    };

    // Track on load
    if (document.readyState === 'complete') {
        trackVisit();
    } else {
        window.addEventListener('load', trackVisit);
    }
})();