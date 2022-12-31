const myStyleElement = document.createElement("style");
const cssRuleElement = `span[class*="price"]{
color: transparent!important;
border-style: dotted;
border-color: #f23838;
}
`;
const cssRuleElementExtended = `span[class*="Price"]{
color: transparent!important;
border-style: dotted;
border-color: #f23838;
}
`;
const cssRulePricePerPiece = `span[class*="a-size-base a-color-secondary"]{
color: transparent!important;
border-style: dotted;
border-color: #f23838;
}
`;
const cssRuleSubscribeAndSaveDiscount = `div[class*="a-row a-size-base a-color-secondary"]{
color: transparent!important;
border-style: dotted;
border-color: #f23838;
}
`;

const cssRulePaymentOptions = `*[class*="payment-options-subtitle"]{
color: transparent!important;
border-style: dotted;
border-color: #f23838;
}
`;

let extensionEnabled = true;

const setEnabled = (boolean) => {
    extensionEnabled = boolean;
}

const overlayOn = () => {
    overlaySet('block');
}

const overlayOff = () => {
    overlaySet('none');
}

const overlaySet = (displayStyle) => {
    createOverlay();
    if (document.getElementById("hide-overlay")) {
        document.getElementById("hide-overlay").style.display = displayStyle;
    }
}

const hidePrice = () => {
    document.head.appendChild(myStyleElement);
    myStyleElement.sheet.insertRule(cssRuleElement, 0);
    myStyleElement.sheet.insertRule(cssRuleElementExtended, 1);
    myStyleElement.sheet.insertRule(cssRulePricePerPiece, 2);
    myStyleElement.sheet.insertRule(cssRuleSubscribeAndSaveDiscount, 3);
    myStyleElement.sheet.insertRule(cssRulePaymentOptions, 4);
}

const showPrice = () => {
    document.head.appendChild(myStyleElement);
    myStyleElement.sheet.deleteRule(0)
    myStyleElement.sheet.deleteRule(1)
    myStyleElement.sheet.deleteRule(2)
    myStyleElement.sheet.deleteRule(3)
    myStyleElement.sheet.deleteRule(4)
}

const createOverlay = () => {
    if (!document.getElementById("hide-overlay") && document.childNodes[1]) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "hide-overlay");
        document.childNodes[1].appendChild(newDiv)
    }
}

/**
 * Content to Background communication
 */
chrome.runtime.sendMessage({ provide_enabled: "extensionEnabled" }, function (response) {
    extensionEnabled = response.enabled;
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        setEnabled(request.enabled);

        if (request.enabled === true) {
            sendResponse({ setting: "enabled" });
            createOverlay();
            hidePrice();
        }
        else {
            sendResponse({ setting: "disabled" });
            overlayOff();
            showPrice();
        }
    });

/**
 * Extension hide/show
 */
createOverlay();

document.addEventListener('DOMContentLoaded', (event) => {
    if (extensionEnabled) {
        hidePrice();
        overlayOff();
    }
});

document.addEventListener('readystatechange', (event) => {
    if (extensionEnabled) {
        if (document.readyState !== 'complete') {
            overlayOn();
        }
    }
});


