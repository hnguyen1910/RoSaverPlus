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

function makePurchase(rosaverPlaceID, productID, itemType, savedRobux, iswebBypass) {
    if (iswebBypass) {window.open(`roblox://placeId=${rosaverPlaceID}&launchData=${productID},${itemType},${savedRobux}`)}
    else {window.open(`https://www.roblox.com/games/start?placeId=${rosaverPlaceID}&launchData=${productID},${itemType},${savedRobux}`)}
    
};

(async () => {

    if ( $(".rosaver").length > 0 ) return;
    let storageData = await chrome.storage.local.get()
    let rosaverPlaceID = storageData.placeid

    let spanRobux = await waitForElm(".text-robux-lg")
    let requiredRobux = $(spanRobux).text().replace("Free","")
    if (/[0-9]+(?:K|M|B)\+/g.test(requiredRobux)) requiredRobux = $(spanRobux).attr( "title" )

    requiredRobux = requiredRobux.replace(",", "")

    let robuxContainer = $(".icon-robux-price-container")
    if (requiredRobux === "") return

    let productID = window.location.toString().split("/")[4]
    let savedRobux

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
        savedRobux = Math.floor(requiredRobux * 0.1)
    } else {
        savedRobux = Math.floor(requiredRobux * 0.4)
    }

    rosaverSaving.html(`(💰${savedRobux})`)

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
            clone.html(`Save <span class="icon-robux-16x16 wait-for-i18n-format-render"></span> ${savedRobux}`)
            clone.prependTo(confirmButton.parent())
            // confirmButton.remove()
            clone.on("click", (e) => {
                e.preventDefault()
                //if (confirmButton.text() == "Buy Now") {
                    $("div[role='dialog']").remove()
                    makePurchase(rosaverPlaceID, productID, itemType, savedRobux, storageData.webBypass)
                //}
            })
        }
    });

})();