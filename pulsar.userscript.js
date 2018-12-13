// ==UserScript==
// @name         PulsarMonkey
// @version      0.1.0
// @author       Murray C
// @match        https://pulsar.vr.world/*
// @match        http://pulsar-dev.onestopvr.com/*
// @match        http://pulsar-staging.onestopvr.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://raw.githubusercontent.com/javve/list.js/v1.5.0/dist/list.min.js
// ==/UserScript==

const rgbBorderGrey = "#ccc";
const rbgBackground = "#293742";
const CSS = [
    // Generic
    {
        s: ".no-shrink",
        r: "flex-shrink: 0;"
    },
    {
        s: ".one-shrink",
        r: "flex-shrink: 1;"
    },
    // Side menu
    {
        s: ".sidemenu",
        r: `
            background: ${rbgBackground};
            border-right: 1px solid ${rgbBorderGrey};
        
            position: fixed;
            z-index: 60;
            top: 0;
            bottom: 0;
            left: -260px;
            width: 250px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
            transition: left 0.1s;
            cursor: default;
            display: flex;
            flex-direction: column;
            padding: 3px;
        `
    },
    {
        s: ".sidemenu__toggle",
        r: `
            background: #546775;
            position: absolute;
            z-index: 60;
            top: 46px;
            left: -7px;
            width: 32px;
            height: 32px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
            cursor: pointer;
            transition: left 0.1s;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 3px 4px;
        `
    },
    {
        s: ".sidemenu__hotzone",
        r: `
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 1px;
        `
    },
    {
        s: ".sidemenu__burger",
        r: `
            background: #f0f0f0;
            height: 3px;
            box-shadow: inset 0 0 1px 0 #888;
        `
    },
    {
        s: ".sidemenu__toggle:hover .sidemenu",
        r: `
            left: 0;
	        transition: left 0.1s;
        `
    },
    {
        s: ".sidemenu__row ",
        r: `
            width: 100%;
	        display: flex;
	        justify-content: space-between;
	        align-items: center;
	        margin-bottom: 5px;
        `
    },
    {
        s: ".sidemenu__row--alt",
        r: `
        	width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 5px;
        `
    },
    {
        s: ".sidemenu__row--vert",
        r: `
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        `
    },
    {
        s: ".sidemenu__row__divider",
        r: `
            background: ${rgbBorderGrey};
            height: 1px;
            width: calc(100% - 16px);
            margin: 2px 8px 7px;
        `
    },
    {
        s: ".sidemenu__row__divider--heavy",
        r: `
            height: 1px;
            background: #aaa;
            width: calc(100% + 6px);
            margin: 2px -3px 7px;
        `
    },
    {
        s: ".sidemenu__row__label",
        r: `
            min-width: 46px;
	        flex-shrink: 0;
        `
    },
    {
        s: ".sidemenu__row__label--cb-label",
        r: `
        	font-weight: initial;
	        display: flex;
	        margin-bottom: 0;
	        justify-content: space-between;
	        width: 100%;
        `
    },
    {
        s: "input[type=checkbox].sidemenu__row__label__cb",
        r: `
            margin-right: 3px;
	        margin-left: 7px
        `
    },
    {
        s: ".sidemenu__ipt",
        r: `
            width: 100%;
	        margin-right: 7px;
        `
    },
    {
        s: ".sidemenu__row_title",
        r: `
            width: 100%;
	        font-weight: bold;
	        text-align: center;
        `
    }
];

function log (...args) {
    console.log("PULSAR_MONKEY", ...args)
}

function pTriggerConnectionOperation (id, operation) {
    return new Promise((resolve, reject) => {
        const r = new XMLHttpRequest();
        r.onload = function () {
            try {
                resolve(this.response);
            } catch (e) {
                reject(new Error(`Failed to process request response: ${e}`));
            }
        };
        r.onerror = (e) => reject(new Error(`Error during request: ${e}`));
        r.open("POST", `/api/pulsar/connection/${id}/${operation}`);
        r.send();
    });
}

window.addEventListener("load", () => {
    (function injectCss () {
        function addCss (sheet, selector, rules){
            const index = sheet.cssRules.length;
            try {
                if ("insertRule" in sheet) {
                    sheet.insertRule(selector + "{" + rules + "}", index);
                } else if ("addRule" in sheet) {
                    sheet.addRule(selector, rules, index);
                }
            } catch (e) {
                if ((!selector && selector.startsWith("-webkit-"))) {
                    console.error(e);
                    console.error(`Selector was "${selector}"; rules were "${rules}"`);
                }
            }
        }

        function addAllCss () {
            log("Injecting CSS...");
            const targetSheet =  [...window.document.styleSheets]
                .filter(it => it.href && (!it.href.startsWith("moz-extension") && !it.href.startsWith("chrome-extension")))
                .reverse()[0];

            CSS.forEach(r => addCss(targetSheet, r.s, r.r));
        }

        addAllCss();
    })();

    const $sideMenu = $(`
        <div class="sidemenu__toggle">
            <div class="sidemenu__hotzone"></div>
            <div class="sidemenu__burger"></div>
            <div class="sidemenu__burger"></div>
            <div class="sidemenu__burger"></div>
            <div class="sidemenu"></div>
        </div>
    `).appendTo($("body"));
    const $mnu = $sideMenu.find(".sidemenu");

    const renderDivider = ($menu, heavy) => $menu.append(`<hr class="sidemenu__row__divider ${heavy ? "sidemenu__row__divider--heavy" : ""}">`);

    $(`<div class="sidemenu__row"><div class="sidemenu__row_title">Re-trigger Connection upload</div></div>`).appendTo($mnu);

    const $wrpTriggerUpload = $(`<div class="sidemenu__row"/>`).appendTo($mnu);
    const $iptTriggerUpload = $(`<input class="bp3-input one-shrink sidemenu__ipt" type="number" placeholder="Connection DB ID">`).appendTo($wrpTriggerUpload);
    const $btnSourceAdd = $(`<button class="bp3-button no-shrink">Trigger</button>`)
        .appendTo($wrpTriggerUpload)
        .click(async () => {
            const iptVal = $iptTriggerUpload.val();
            if (!iptVal || !iptVal.trim() || isNaN(Number(iptVal))) {
                alert("Please enter a valid numerical ID.")
            } else {
                try {
                    await pTriggerConnectionOperation(Number(iptVal), "reupload");
                    alert("Successfully triggered!")
                } catch (e) {
                    console.error(e);
                    alert(`Failed to trigger UPLOAD; see the log for more details. Error was: ${e.message}`);
                }
            }
        });

    renderDivider($mnu);
});
