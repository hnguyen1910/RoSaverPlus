chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !/https:\/\/.+roblox.com\/(?:bundles|catalog|game-pass)\/.+/g.test(tab.url)) return


    chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: false },
        files: ["js/default.js", "js/jquery-3.7.1.min.js", "rosaverplus-main.js"],
    })
})