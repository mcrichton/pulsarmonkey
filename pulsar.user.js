// ==UserScript==
// @name         PulsarMonkey
// @version      0.1.7
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
const rgbInfoBlue = "#137cbd";
const rgbSuccessGreen = "#0f9960";
const rgbErrorRed = "#db3737";
const rgbWarnYellow = "#d9822b";
const rbgNoStatusGrey = "#6b6b6b";
const CSS = [
    // "Copied" effect
    {
        s: ".copied-tip",
        r: "pointer-events: none; position: fixed; background: transparent; user-select: none; z-index: 100000; width: 80px; height: 24px; line-height: 24px;"
    },
    {
        s: ".copied-tip > span",
        r: "display: inline-block; width: 100%; text-align: center;"
    },
    // Bootstrap-alikes
    {
        s: ".col",
        r: "display: inline-block;"
    },
    {
        s: ".col-0-5",
        r: "width: 4.1667%;"
    },
    {
        s: ".col-0-7",
        r: "width: 5.8333%;"
    },
    {
        s: ".col-0-8",
        r: "width: 6.6666%;"
    },
    {
        s: ".col-1",
        r: "width: 8.333%;"
    },
    {
        s: ".col-1-8",
        r: "width: 15%;"
    },
    {
        s: ".col-1-9",
        r: "width: 15.833%;"
    },
    {
        s: ".col-2",
        r: "width: 16.666%;"
    },
    {
        s: ".col-3",
        r: "width: 25%;"
    },
    {
        s: ".col-4",
        r: "width: 33.333%;"
    },
    {
        s: ".col-5",
        r: "width: 41.667%;"
    },
    {
        s: ".col-6",
        r: "width: 50%;"
    },
    {
        s: ".col-7",
        r: "width: 58.333%;"
    },
    {
        s: ".col-8",
        r: "width: 66.667%;"
    },
    {
        s: ".col-9",
        r: "width: 75%;"
    },
    {
        s: ".col-10",
        r: "width: 83.333%;"
    },
    {
        s: ".col-11",
        r: "width: 91.667%;"
    },
    {
        s: ".col-12",
        r: "width: 100%;"
    },
    {
        s: ".mr-1",
        r: "margin-right: 0.25rem !important;"
    },
    {
        s: ".mr-2",
        r: "margin-right: 0.5rem !important;"
    },
    {
        s: ".ml-2",
        r: "margin-left: 0.5rem !important;"
    },
    {
        s: ".ml-3",
        r: "margin-left: 1rem !important;"
    },
    {
        s: ".ml-4",
        r: "margin-left: 1.5rem !important;"
    },
    {
        s: ".ml-5",
        r: "margin-left: 3rem !important;"
    },
    // Blueprint overrides
    {
        s: ".bp3-button--small",
        r: `
            line-height: 12px;
            min-height: 22px;
            min-width: 22px;
        `
    },
    {
        s: ".bp3-control--no-margin",
        r: `
            margin-bottom: 0;
        `
    },
    // Generic
    {
        s: ".hidden",
        r: "display: none !important;"
    },
    {
        s: ".can-copy",
        r: "cursor: copy;"
    },
    {
        s: ".help-subtle",
        r: "cursor: help;"
    },
    {
        s: ".no-shrink",
        r: "flex-shrink: 0;"
    },
    {
        s: ".one-shrink",
        r: "flex-shrink: 1;"
    },
    {
        s: ".text-align-center",
        r: "text-align: center"
    },
    {
        s: ".flex-inline-center",
        r: `
            display: inline-flex;
            justify-content: center;
            align-items: center;
        `
    },
    {
        s: ".flex-center",
        r: `
            display: inline-flex;
            justify-content: center;
            align-items: center;
        `
    },
    // Tenerife Overlay
    {
        s: ".tf__wrp_outer",
        r: `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            background: #00000080;
            width: 100vw;
            height: 100vh;
            display: flex;
        `
    },
    {
        s: ".tf__wrp, .tf_modal__wrp",
        r: `
            overflow-x: none;
            background: #293742;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: calc(100% - 20px);
            margin: 10px 90px;
            padding: 15px;
            box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.50);
        `
    },
    // - custom scrollbars
    {
        s: ".tf__wrp *::-webkit-scrollbar, .tf_modal__wrp *::-webkit-scrollbar",
        r: "width: 9px; height: 9px;"
    },
    {
        s: ".tf__wrp *::-webkit-scrollbar-track, .tf_modal__wrp *::-webkit-scrollbar-track",
        r: "background: transparent;"
    },
    {
        s: ".tf__wrp *::-webkit-scrollbar-thumb, .tf_modal__wrp *::-webkit-scrollbar-thumb",
        r: "background: #999;"
    },
    {
        s: ".tf__top_1",
        r: `
           width: 100%;
           flex-shrink: 0;
        `
    },
    {
        s: ".tf__top_2",
        r: `
            width: 100%;
            display: flex;
            flex-shrink: 0;
            margin-bottom: 0.5rem;
        `
    },
    {
        s: ".tf__list_wrp",
        r: `
            width: 100%;
            display: flex;
            flex-direction: column;
        `
    },
    {
        s: ".tf__search",
        r: `
            width: 100%;
        `
    },
    {
        s: ".tf__list_head",
        r: `
            width: 100%;
            flex-shrink: 0;
            margin-bottom: 2px;
            font-weight: bold;
            border-bottom: 1px solid #666;
        `
    },
    {
        s: ".tf__list",
        r: `
            width: 100%;
            overflow-y: auto;
            transform: translateZ(0);
        `
    },
    {
        s: ".tf__list_item",
        r: `
            width: 100%;
            padding: 1px 0;
            border-bottom: 1px solid #666;
            min-height: 25px;
            display: flex;
        `
    },
    {
        s: ".tf__list_item:hover",
        r: `
            background: #ffffff10;
        `
    },
    {
        s: ".tf__list_item--selected",
        r: `
            background: #ffffff10;
        `
    },
    {
        s: ".tf__list_item--selected:hover",
        r: `
            background: #ffffff28;
        `
    },
    {
        s: ".tf__item_controls",
        r: `
            display: inline-flex;
            align-items: center;
        `
    },
    {
        s: ".tf__wrp_item_pad",
        r: `
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
        `
    },
    {
        s: ".tf__item_pad",
        r: `
            width: 22px;
            height: 22px;
            flex-shrink: 0;
            margin-right: 0.125rem;
            display: inline-block;
            border-radius: 3px;
        `
    },
    {
        s: ".tf__item_pad--button",
        r: `
            cursor: pointer;
        `
    },
    {
        s: ".tf__item_pad--button:hover",
        r: `
            box-shadow: inset 0 0 0 100px #fff3;
        `
    },
    {
        s: ".tf__item_pad--button:active",
        r: `
            box-shadow: inset 0 0 0 100px #0003;
        `
    },
    {
        s: ".tf__item_pad--text",
        r: `
            text-align: center;
            line-height: 22px;
        `
    },
    {
        s: ".tf_modal__wrp_outer",
        r: `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10001;
            background: #00000080;
            width: 100vw;
            height: 100vh;
            display: flex;
        `
    },
    {
        s: ".tf_modal__code",
        r: `
            white-space: pre;
            overflow: auto;
            max-width: 100%;
            max-height: 100%;
            font-family: "Courier New", Courier, monospace;
        `
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

const HTML_TICK = "&#x2714;";
const HTML_TRASH = "&#x1f5d1;";
const HTML_BEVERAGE = "&#x2615;";
const HTML_FILM = "&#x1F39E;";

class MiscUtil {
    static showCopiedEffect ($ele, text = "Copied!") {
        const $temp = $(`<div class="copied-tip"><span>${text}</span></div>`);
        const top = $(window).scrollTop();
        const pos = $ele.offset();
        $temp
            .css({
                top: (pos.top - 17) - top,
                left: pos.left - 36 + ($ele.width() / 2)
            })
            .appendTo($(`body`)).animate(
            {
                top: "-=8",
                opacity: 0
            }, 250, () => {
                $temp.remove();
            }
        );
    }

    static copyText (text) {
        const $temp = $(`<textarea id="copy-temp" style="position: fixed; top: -1000px; left: -1000px; width: 1px; height: 1px;">${text}</textarea>`);
        $(`body`).append($temp);
        $temp.select();
        document.execCommand("Copy");
        $temp.remove();
    }
}

const API_ROOT = `https://${location.host}/api/`;

function log (...args) {
    console.log("PULSAR_MONKEY", ...args)
}

function pApiGet (path, isJson = true, api = "pulsar") {
    return new Promise((resolve, reject) => {
        const r = new XMLHttpRequest();
        r.onload = function () {
            try { resolve(isJson ? JSON.parse(this.response) : this.response); }
            catch (e) { reject(e); }
        };
        r.onerror = (e) => reject(e);
        r.open("GET", `${API_ROOT}${api}/${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`);
        if (isJson) r.setRequestHeader("Content-Type", "application/json");
        r.send();
    });
}

function pTriggerConnectionOperation (id, operation) {
    return new Promise((resolve, reject) => {
        const r = new XMLHttpRequest();
        r.onload = function () {
            try { resolve(this.response); }
            catch (e) { reject(new Error(`Failed to process request response: ${e}`)); }
        };
        r.onerror = (e) => reject(e);
        r.open("POST", `/api/pulsar/connection/${id}/${operation}`);
        r.setRequestHeader("Content-Type", "application/json");
        r.send();
    });
}

function pSetConnectionDeleted (id, isDeleted) {
    return new Promise((resolve, reject) => {
        const r = new XMLHttpRequest();
        r.onload = function () {
            try { resolve(this.response); }
            catch (e) { reject(new Error(`Failed to process request response: ${e}`)); }
        };
        r.onerror = (e) => reject(e);
        r.open("DELETE", `/api/pulsar/connection/${id}/`);
        r.setRequestHeader("Content-Type", "application/json");
        r.send(JSON.stringify({is_deleted: isDeleted}));
    });
}

function TenerifeOverlay () {
    this._$wrpList = null;
    this._list = null;

    this.doDestroy = () => {
        this._$wrpOuter.remove();
        TenerifeOverlay._active = null;
    };

    this.__confirmationDisabled = false;
    this._disableConfirmation = () => this.__confirmationDisabled = true;
    this._enableConfirmation = () => this.__confirmationDisabled = false;
    this._getConfirmation = (text = "Are you sure?") => {
        if (this.__confirmationDisabled) return true;
        if (this._$cbRequireConf.prop("checked")) return confirm(text);
        return true;
    };

    this.doCreate = async () => {
        if (TenerifeOverlay._active) return;
        TenerifeOverlay._active = this;

        const $wrpOuter = $(`<div class="tf__wrp_outer"/>`).appendTo($(`body`)).click(() => this.doDestroy());
        this._$wrpOuter = $wrpOuter;
        this._$wrp = $(`<div class="tf__wrp bp3-dark"/>`).appendTo($wrpOuter).click(evt => evt.stopPropagation());

        await this._loadPopulateList("2018-11-15", "", 43, 45);
    };

    this.__get$LoadingRow = () => $(`<div class="tf__list_item"><div class="col col-12 text-align-center"><i>Loading...</i></div></div>`);

    this.__get$Pad = (message, color, clazz, innerHtml = "") => $(`<div class="tf__item_pad tf__item_pad--button ${clazz} ${innerHtml ? "tf__item_pad--text" : ""}" style="background-color: ${color}" title="${message}">${innerHtml}</div>`);

    this.__get$Row = (c) => {
        const $row = $(`<div class="tf__list_item"/>`);

        const $wrpCb = $(`<label class="col col-0-5 flex-inline-center"/>`).appendTo($row);
        const $cbSel = $(`<input type="checkbox" class="tf__item_sel">`)
            .appendTo($wrpCb)
            .change(() => $row.toggleClass("tf__list_item--selected", $cbSel.prop("checked")));

        const $wrpCamId = $(`<div class="col col-0-5 text-align-center">${c.camera_id}</div>`)
            .appendTo($row);

        const captureIdNum = Number(c.capture_id) * 1000;
        const $wrpCaptureId = $(`<div class="col col-0-8 captureId can-copy text-align-center" ${isNaN(captureIdNum) ? "" : `title="${new Date(captureIdNum)}"`}>${c.capture_id}</div>`)
            .appendTo($row)
            .click(() => {
                MiscUtil.copyText(c.capture_id);
                MiscUtil.showCopiedEffect($wrpCaptureId);
            });

        const $wrpRefresh = $(`<div class="col col-0-5 text-align-center"/>`).appendTo($row);
        const $btnRefresh = $(`<button class="bp3-button bp3-button--small mr-2 tf__refresh" title="Refresh row">&#8635;</button>`)
            .appendTo($wrpRefresh)
            .click(async () => {
                const $loading = this.__get$LoadingRow();
                $row.replaceWith($loading);
                const connection = await pApiGet(`connection/${c.id}`);
                $loading.replaceWith(this.__get$Row(connection));
            });

        const $wrpUploadBe = $(`<div class="col col-1-8 tf__wrp_item_pad"/>`).appendTo($row);
        const [messageUploadBe, colorUploadBe] = TenerifeOverlay._getColorAndMessageUploadBe(c);
        const $dspUploadBe = $(`<div class="tf__item_pad" style="background-color: ${colorUploadBe}"/>`)
            .appendTo($wrpUploadBe);
        const $txtUploadBe = $(`<span>${messageUploadBe}</span>`).appendTo($wrpUploadBe);

        const $wrpUploadCp = $(`<div class="col col-1-8 tf__wrp_item_pad"/>`).appendTo($row);
        const [messageUploadCp, colorUploadCp] = TenerifeOverlay._getColorAndMessageGeneric(c, "Cloud upload", "last_upload_status");
        const $btnUploadCp = this.__get$Pad(`Trigger Cloud Processing UPLOAD`, colorUploadCp, "tf__upload_cp")
            .appendTo($wrpUploadCp)
            .click(() => this._getConfirmation(`Are you sure you want to trigger Cloud Processing's "UPLOAD" process?`) && pTriggerConnectionOperation(c.id, "reupload"));
        const $txtUploadCp = $(`<span>${messageUploadCp}</span>`).appendTo($wrpUploadCp);

        const $wrpPreview = $(`<div class="col col-1-8 tf__wrp_item_pad"/>`).appendTo($row);
        const [messagePreview, colorPreview] = TenerifeOverlay._getColorAndMessageGeneric(c, "Preview", "last_preview_status");
        const $btnPreview = this.__get$Pad(`Trigger PREVIEW`, colorPreview, "tf__preview", c.preview_executed ? HTML_TICK : "")
            .appendTo($wrpPreview)
            .click(async () => {
                if (this._getConfirmation(`Are you sure you want to trigger the "PREVIEW" process?`)) {
                    await pTriggerConnectionOperation(c.id, "preview");
                    $btnRefresh.click();
                }
            });
        const $txtPreview = $(`<span>${messagePreview}</span>`).appendTo($wrpPreview);

        const $wrpProcess = $(`<div class="col col-1-8 tf__wrp_item_pad"/>`).appendTo($row);
        const [messageProcessing, colorProcessing] = TenerifeOverlay._getColorAndMessageGeneric(c, "Processing", "last_processing_status");
        const $btnProcess = this.__get$Pad(`Trigger PROCESSING`, colorProcessing, "tf__process", c.processing_executed ? HTML_TICK : "")
            .appendTo($wrpProcess)
            .click(async () => {
                if (this._getConfirmation(`Are you sure you want to trigger the "PROCESSING" (extract + stitch) process?`)) {
                    await pTriggerConnectionOperation(c.id, "process");
                    $btnRefresh.click();
                }
            });
        const $txtProcess = $(`<span>${messageProcessing}</span>`).appendTo($wrpProcess);

        const $wrpPublish = $(`<div class="col col-1-8 tf__wrp_item_pad"/>`).appendTo($row);
        const [messagePublish, colorPublish] = TenerifeOverlay._getColorAndMessageGeneric(c, "Publishing", "last_publish_status");
        const $btnPublish = this.__get$Pad(`Trigger PUBLISH`, colorPublish, "tf__publish", c.publish_executed ? HTML_TICK : "")
            .appendTo($wrpPublish)
            .click(async () => {
                if (this._getConfirmation(`Are you sure you want to trigger the "PUBLISH" process?`)) {
                    await pTriggerConnectionOperation(c.id, "publish");
                    $btnRefresh.click();
                }
            });
        const $txtPublish = $(`<span>${messagePublish}</span>`).appendTo($wrpPublish);

        const $wrpQuickControls = $(`<div class="col col-0-7"/>`).appendTo($row);
        const $btnVideo = this.__get$Pad("View video", rbgNoStatusGrey, "", HTML_FILM)
            .appendTo($wrpQuickControls)
            .addClass("mr-1")
            .click(async () => {
                const $wrpModal = TenerifeOverlay._get$Modal();
                const doShow = (message) => $(`<div class="flex-center"><div data-usurp="0"/></div>`).css({width: "100%", height: "100%"}).usurp(message).appendTo($wrpModal);

                doShow(`<i>Loading...</i>`);
                const preview = await pApiGet(`camera/${c.camera_id}/connection/${c.id}/preview`, true, "google");
                $wrpModal.empty();
                if (preview.location) {
                    doShow(`<video width="320" height="240" controls src="${preview.location}" style="width: 100%; height: 100%;">`);
                } else {
                    doShow("No preview found. Click to close.");
                    $wrpModal.click(() => $wrpModal.parent().click())
                }

            });
        const $btnDbg = this.__get$Pad("View debug info", rbgNoStatusGrey, "", HTML_BEVERAGE)
            .appendTo($wrpQuickControls)
            .addClass("mr-1")
            .click(() => {
                const $wrpModal = TenerifeOverlay._get$Modal();
                $(`<div class="tf_modal__code">${JSON.stringify(c, null, 2)}</div>`).appendTo($wrpModal);
            });
        const $btnDelete = this.__get$Pad(`Mark record as deleted`, c.is_deleted ? rgbErrorRed : rbgNoStatusGrey, "", HTML_TRASH)
            .appendTo($wrpQuickControls)
            .click(async () => {
                if (this._getConfirmation(`Are you sure you want to set "is_deleted" status for this connection? This will not delete any data. This cannot be undone without direct database access.`)) {
                    await pSetConnectionDeleted(c.id, !c.is_deleted);
                    $btnRefresh.click();
                }
            });

        $(`<div class="hidden">
            <div class="uploadCpStatus">${c.last_upload_status}</div>
            <div class="previewStatus">${c.last_preview_status}</div>
            <div class="processStatus">${c.last_processing_status}</div>
            <div class="publishStatus">${c.last_publish_status}</div>
            <div class="connectionId">${c.id}</div>
        </div>`).appendTo($row);

        return $row;
    };

    this._loadPopulateList = async (minDate, maxDate, ...camIds) => {
        if (this._$wrpList) this._$wrpList.remove();
        this._list = null;

        const minDateStr = minDate;
        const maxDateStr = maxDate;
        minDate = minDate ? Date.parse(minDate) / 1000 : 0;
        maxDate = maxDate ? Date.parse(maxDate) / 1000 : Number.MAX_SAFE_INTEGER;

        const $iptIds = $(`<input class="bp3-input" placeholder="Camera database IDs (comma separated)" value="${camIds.join(",")}">`)
            .keydown((e) => {
                if (e.which === 13) $btnReloadList.click();
            });
        const $iptDateMin = $(`<input type="date" value="${minDateStr}">`);
        const $iptDateMax = $(`<input type="date" value="${maxDateStr}">`);
        const $btnReloadList = $(`<button class="bp3-button no-shrink ml-2">Repopulate List</button>`)
            .click(() => {
                const ids = $iptIds.val();
                const nums = ids.split(",").map(it => it.trim()).filter(Boolean).map(it => Number(it));
                if (nums.some(n => isNaN(n))) return alert("Invalid input!");
                this._loadPopulateList($iptDateMin.val(), $iptDateMax.val(), nums.join(","));
            });
        const [$wrpCbReqConf, $cbRequireConf] = TenerifeOverlay._get$Checkbox("Operations Require Confirmation");
        this._$cbRequireConf = $cbRequireConf.prop("checked", true);
        $wrpCbReqConf.addClass("ml-5").css({width: "15rem"});

        const $btnRefreshCaptures = $(`<button class="bp3-button no-shrink ml-4">Refresh All</button>`)
            .click(() => this._$wrpList.find(`.tf__refresh`).click());
        const _FAILED_STATUS = new Set(["FAILED", "LAUNCHFAIL"]);
        const $btnMassSel = $(`<button class="bp3-button no-shrink ml-4">Select all...</button>`)
            .click(() => {
                const v = Number($selMassSel.val());
                if (!v) return alert("Please choose a filter first");
                this._$wrpList.find(`.tf__item_sel`).prop("checked", false);
                const toSel = (() => {
                    const getSelection = (clazz, isNull, isFailed) => {
                        return this._$wrpList.find(`.tf__list_item`).filter((i, e) => {
                            const txt = $(e).find(`.${clazz}`).text();
                            return (isNull && txt === "null") || (isFailed && _FAILED_STATUS.has(txt));
                        });
                    };
                    switch (v) {
                        case 1: return getSelection("uploadCpStatus", true, true);
                        case 2: return getSelection("previewStatus", true, false);
                        case 3: return getSelection("previewStatus", false, true);
                        case 4: return getSelection("processStatus", true, false);
                        case 6: return getSelection("processStatus", false, true);
                        case 7: return getSelection("publishStatus", true, false);
                        case 8: return getSelection("publishStatus", false, true);
                    }
                })();
                toSel.find(`.tf__item_sel`).prop("checked", true);
            });
        const _MASS_SEL_OPTIONS = [
            "UPLOAD (CP) status: none/error",
            "PREVIEW status: none",
            "PREVIEW status: error",
            "PROCESS status: none",
            "PROCESS status: error",
            "PUBLISH status: none",
            "PUBLISH status: error",
        ];
        const $selMassSel = $(`<select class="no-shrink ml-2">
            <option disabled value="0">Choose a filter</option>
            ${_MASS_SEL_OPTIONS.map((it, i) => `<option value="${i + 1}">${it}</option>`).join("")}
        </select>`).val("0");
        const $btnMassTrigger = $(`<button class="bp3-button no-shrink ml-3">Mass-trigger...</button>`)
            .click(() => {
                const v = Number($selMassTrigger.val());
                if (!v) return alert("Please choose an operation first");
                const $allSel = this._$wrpList.find(`.tf__list_item`).filter((i, e) => $(e).find(`.tf__item_sel`).prop("checked"));
                if (!$allSel.length) return alert("Please select some captures first");
                const vText = _MASS_TRIGGER_OPTIONS[v - 1];
                if (confirm(`Are you sure you want to mass-trigger the ${vText} operation for ${$allSel.length} capture${$allSel.length.length === 1 ? "" : "s"}?`)) {
                    this._disableConfirmation();
                    switch (v) {
                        case 1: return $allSel.each((i, e) => $(e).find(`.tf__upload_cp`).click());
                        case 2: return $allSel.each((i, e) => $(e).find(`.tf__preview`).click());
                        case 3: return $allSel.each((i, e) => $(e).find(`.tf__process`).click());
                        case 4: return $allSel.each((i, e) => $(e).find(`.tf__publish`).click());
                    }
                    this._enableConfirmation();
                }
            });
        const _MASS_TRIGGER_OPTIONS = [
            "UPLOAD (CP)",
            "PREVIEW",
            "PROCESS",
            "PUBLISH",
        ];
        const $selMassTrigger = $(`<select class="no-shrink ml-2">
            <option disabled value="0">Choose an operation</option>
            ${_MASS_TRIGGER_OPTIONS.map((it, i) => `<option value="${i + 1}">${it}</option>`).join("")}
        </select>`).val("0");
        const $btnGetExport = $(`<button class="bp3-button no-shrink ml-4" title="Human-readable info about the currently-selected rows that you can copy-paste">Get Slack-able Summary</button>`)
            .click(async () => {
                const $allSel = this._$wrpList.find(`.tf__list_item`).filter((i, e) => $(e).find(`.tf__item_sel`).prop("checked"));
                if (!$allSel.length) return alert("Please select some captures first");

                MiscUtil.showCopiedEffect($btnGetExport, "Loading...");

                const connIds = $allSel.map((i, e) => Number($(e).find(`.connectionId`).text())).get();
                const connections = await Promise.all(connIds.map(id => pApiGet(`connection/${id}`)));

                const cameraIds = [...new Set(connections.map(it => it.camera_id))];
                const cameras = await Promise.all(cameraIds.map(id => pApiGet(`camera/${id}`)));
                const camerasIx = {};
                cameras.forEach(cam => camerasIx[cam.id] = cam);

                const toCopy = connections.sort((a, b) => a.camera_id - b.camera_id || Number(a.capture_id) - Number(b.capture_id)).map(c => `${camerasIx[c.camera_id].serial_number} (ID ${c.camera_id}) -- ${c.capture_id} (ID ${c.id})`).join("\n");

                prompt("Ctrl-C this, and paste into Slack", toCopy);
                MiscUtil.showCopiedEffect($btnGetExport);
            });

        const $cbAll = $(`<input type="checkbox">`)
            .change(() => {
                this._$wrpList.find(`.tf__item_sel`).prop("checked", $cbAll.prop("checked"));
            });

        this._$wrpList = $(`<div class="tf__list_wrp" id="tf_wrp_list">
            <div class="tf__top_2">
                <div data-usurp="0"/>
                <div class="flex-center ml-2 mr-2">Capture date from</div>
                <div data-usurp="1"/>
                <div class="flex-center  ml-2 mr-2">to</div>
                <div data-usurp="2"/>
                <div data-usurp="3"/>
                <div data-usurp="4"/>
            </div>
            <div class="tf__top_2">
                <input class="bp3-input search tf__search" placeholder="Search Capture ID...">
                <div data-usurp="5"/>
                <div data-usurp="6"/>
                <div data-usurp="7"/>
                <div data-usurp="8"/>
                <div data-usurp="9"/>
                <div data-usurp="10"/>
            </div>
            <div class="tf__list_head">
                <label class="col col-0-5 text-align-center"><div data-usurp="11"/></label>
                <div class="col col-0-5 text-align-center" title="Database ID">Cam</div>
                <div class="col col-0-8 text-align-center">Capture ID</div>
                <div class="col col-0-5 text-align-center"><!-- Refresh button --></div>
                <div class="col col-1-8 text-align-center">UPLOAD (BE)</div>
                <div class="col col-1-8 text-align-center">UPLOAD (CP)</div>
                <div class="col col-1-8 text-align-center">PREVIEW</div>
                <div class="col col-1-8 text-align-center">PROCESS</div>
                <div class="col col-1-8 text-align-center">PUBLISH</div>
            </div>
            <div class="list tf__list"/>
        </div>`).usurp($iptIds, $iptDateMin, $iptDateMax, $btnReloadList, $wrpCbReqConf, $btnRefreshCaptures, $btnMassSel, $selMassSel, $btnMassTrigger, $selMassTrigger, $btnGetExport, $cbAll).appendTo(this._$wrp);
        const $list = this._$wrpList.find(`.tf__list`);

        $list.append(this.__get$LoadingRow());

        const connections = await pApiGet(`connection?camera=${camIds.join(",")}&deleted=true`);
        $list.empty();

        connections.filter(it => {
            const numCapId = Number(it.capture_id);
            if (isNaN(numCapId)) return true;
            return numCapId >= minDate && numCapId <= maxDate;
        }).forEach(c => this.__get$Row(c).appendTo($list));

        setTimeout(() => {
            this._list = new List("tf_wrp_list", {
                valueNames: ["captureId", "uploadCpStatus", "previewStatus", "processStatus", "publishStatus", "connectionId"]
            });
        }, 5); // delay to allow list population
    }
}
TenerifeOverlay._active = null;
TenerifeOverlay._get$Checkbox = function (labelText) {
    const $cb = $(`<input type="checkbox">`);
    const $wrpCb = $(`
        <label class="bp3-control bp3-control--no-margin bp3-checkbox bp3-align-left">
        <div data-usurp="0"/>
        <span class="bp3-control-indicator"/>${labelText}</label>
    `).usurp($cb).css({marginBottom: 0});
    const $wrpOuterCb = $(`<div class="flex-center"/>`).append($wrpCb);
    return [$wrpOuterCb, $cb];
};
TenerifeOverlay._get$Modal = function () {
    const $wrpOuter = $(`<div class="tf_modal__wrp_outer"/>`)
        .appendTo($(`body`))
        .click(() => $wrpOuter.remove());
    const $wrpModal = $(`<div class="tf_modal__wrp"/>`)
        .appendTo($wrpOuter)
        .click(evt => evt.stopPropagation());
    return $wrpModal;
};
TenerifeOverlay._getColorAndMessageUploadBe = function (capture) {
    if (!capture.status) return ["(No status)", rbgNoStatusGrey];
    switch (capture.status) {
        case "UPLOADED": return ["Upload to backend succeeded", rgbSuccessGreen];
        case "FAILED": return ["Upload to backend failed", rgbErrorRed];
        case "UPLOADING": return ["Backend upload in progress", rgbInfoBlue];
        default: return [`Unknown status: "${capture.status}"`, rgbWarnYellow];
    }
};
TenerifeOverlay._getColorAndMessageGeneric = function (capture, processName, prop) {
    if (!capture[prop]) return ["(No status)", rbgNoStatusGrey];
    switch (capture[prop]) {
        case "SUCCEEDED": return [`${processName} succeeded`, rgbSuccessGreen];
        case "LAUNCHFAIL": return [`${processName} failed to launch`, rgbErrorRed];
        case "FAILED": return [`${processName} failed`, rgbErrorRed];
        case "LAUNCHED":
        case "RUNNING": return [`${processName} in progress`, rgbInfoBlue];
        default: return [`${processName} unknown status "${capture.status}"`, rgbWarnYellow];
    }
};

window.addEventListener("load", () => {
    $.fn.extend({
        /**
         * Takes a jQuery object and replaces elements with `data-usurp-<n>` with the nth position arg, e.g.
         * $(`<div><div>my <span>initial</span> html <div data-usurp="0"/> <div data-usurp="1"/></div>`)
         */
        usurp: function (...$toSwap) {
            $toSwap.forEach((ts, i) => {
                this.find(`[data-usurp="${i}"]`).replaceWith(ts);
            });
            return this;
        }
    });

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

    /*
    (function injectSideMenu () {
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
    })();
    */

    (new TenerifeOverlay()).doCreate();
});

window.addEventListener("keypress", evt => {
    if (evt.shiftKey && !evt.ctrlKey) {
        if (evt.key === "T") (new TenerifeOverlay()).doCreate();
    }
});
