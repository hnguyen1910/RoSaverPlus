// Default data
(async () => {

    let storageData = await chrome.storage.local.get()
    if (!storageData.placeid) storageData.placeid = "none"
    if (typeof storageData.webBypass === "undefined") storageData.webBypass = true

    chrome.storage.local.set(storageData)

})()