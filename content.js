var searches = ["urgent", "calls", "paid", "need", "gift", "gifts", "cards", "card", "urgently"
, "response", "needed", "login", "expiring", "soon", "immediate", "immediately", "free", "detect"
, "pay", "job", "access", "expire", "friend", "lowest", "price", "serious", "action", "database"
, "winner", "refund", "files", "activate", "activated", "wage", "vital", "irregular", "docs", "invited"
, "account", "employment", "notice", "service", "bcourse", "employee", "phone", "information", "dirks"];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var totalPoints = 0;
        for (search of searches) {
            let re = new RegExp(search, 'gi')
            let matches = document.body.innerHTML.match(re);
            if (matches != null) {
                totalPoints = totalPoints + 1;
            }
        }
        sendResponse({count: totalPoints});
    }
);