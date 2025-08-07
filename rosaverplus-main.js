function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {

            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

function makePurchase(rosaverPlaceID, productID, itemType, savedPrice, iswebBypass) {
    if (iswebBypass) {window.open(`roblox://placeId=${rosaverPlaceID}&launchData=${productID},${itemType},${savedPrice}`)}
    else {window.open(`https://www.roblox.com/games/start?placeId=${rosaverPlaceID}&launchData=${productID},${itemType},${savedPrice}`)}
    
};

(async () => {

    if ( $(".rosaver").length > 0 ) return;
    let storageData = await chrome.storage.local.get()
    let rosaverPlaceID = storageData.placeid

    let requireRobux = await waitForElm(".text-robux-lg")
    requireRobux = $(requireRobux).text().replace("Free","")

    let robuxContainer = $(".icon-robux-price-container")
    if (requireRobux === "") return

    let productID = window.location.toString().split("/")[4]
    let price = requireRobux.replace(",", "")
    let savedPrice

    let itemType
    if ($(".icon-limited-label").length > 0 || $(".icon-limited-unique-label").length > 0) {
        return
    } else if (window.location.href.indexOf("game-pass") > -1) {
        itemType = 2
    } else if (window.location.href.indexOf("bundles") > -1) {
        itemType = 3
    } else {
        itemType = 1
    }

    let rosaverSaving = $("<span>")
    .addClass("rosaver")
    .css({
        "font-size" : "16px",
        "opacity" : "0.85",
        "vertical-align" : "middle",
        "font-weight" : "500",
        "margin-left" : "4px"
    })
    .appendTo(robuxContainer)

    if (!storageData.placeid || rosaverPlaceID == "none") {
        rosaverSaving.html("(⚠ set placeid!)")
        return
    }
    
    if (itemType == 2) {
        savedPrice = Math.floor(price * 0.1)
    } else {
        savedPrice = Math.floor(price * 0.4)
    }

    rosaverSaving.html(`(💰${savedPrice})`)

    console.log("ROSAVER IS READY FOR USE!")

    $(document.body).on("click", () => {
        if ($(`.text-robux`).length > 0) {
            // $("#modal-dialog").css("width", "500")
            let confirmButton = $(".modal-button.btn-primary-md.btn-min-width").length > 0 ? $(".modal-button.btn-primary-md.btn-min-width") : $("#confirm-btn") //decline-btn confirm-btn

            if (!confirmButton) return
            if ($('.modal-button.btn-primary-md.btn-min-width').length == 2) return
            if ($('#confirm-btn').hasClass("rsaver")) return
            if (confirmButton.offsetParent()[0].toString() == "[object HTMLHtmlElement]") return

            let clone = confirmButton.clone()
            clone.css({
                "background-color": "#00b06f",
                "border-color": "#00b06f",
                "color": "#fff"
            })
            clone.addClass("rsaver")
            clone.html(`Save <span class="icon-robux-16x16 wait-for-i18n-format-render"></span> ${savedPrice}`)
            clone.prependTo(confirmButton.parent())
            // confirmButton.remove()
            clone.on("click", (e) => {
                e.preventDefault()
                //if (confirmButton.text() == "Buy Now") {
                    $("div[role='dialog']").remove()
                    makePurchase(rosaverPlaceID, productID, itemType, savedPrice, storageData.webBypass)
                //}
            })
        }
    });

})();