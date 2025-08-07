(async () => {
    let storageData = await chrome.storage.local.get()
    if (!storageData.totalSaved) storageData.totalSaved = 0
    if (!storageData.placeid) storageData.placeid = "none"
    if (typeof storageData.webBypass === "undefined") storageData.webBypass = true
    chrome.storage.local.set(storageData)

    $("#rs-current-placeid").text(storageData.placeid || "none")
    
    $("#rs-save").on("click", () => {
        if ($("#rs-placeid").val() === "") return

        storageData.placeid = parseInt($("#rs-placeid").val())
        $("#rs-current-placeid").text(storageData.placeid)
        chrome.storage.local.set(storageData)
        $(".status").css("display", "block").text("Changed place ID successfully! Please refresh the tab to apply changes. ")
    })

    $("#rs-reset").on("click", () => {
        chrome.storage.local.clear()
        $("#rs-current-placeid").text("none")
        $(".status").css("display", "block").text("Cleared storage successfully. ")
    })

    $("#rs-bypass").text(storageData.webBypass ? "✔️" : "❌")
    $("#rs-bypass").on("click", () => {
        storageData.webBypass = !storageData.webBypass;
        $("#rs-bypass").text(storageData.webBypass ? "✔️" : "❌")
        chrome.storage.local.set(storageData)
    });

})();