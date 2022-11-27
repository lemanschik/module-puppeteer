import NodeWebSocket from 'ws';
import * as childProcess from 'child_process';
import { exec as exec$1 } from 'child_process';
import extractZip from 'extract-zip';
import * as fs$1 from 'fs';
import fs__default, { existsSync, readdirSync, createReadStream, createWriteStream, accessSync } from 'fs';
import { mkdir, unlink, chmod, readdir, mkdtemp } from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import createHttpsProxyAgent from 'https-proxy-agent';
import * as os from 'os';
import os__default, { tmpdir } from 'os';
import * as path from 'path';
import path__default, { join } from 'path';
import { getProxyForUrl } from 'proxy-from-env';
import removeFolder from 'rimraf';
import tar from 'tar-fs';
import bzip from 'unbzip2-stream';
import * as URL$1 from 'url';
import * as util from 'util';
import { promisify } from 'util';
import * as readline from 'readline';

function mitt_es(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i&&i.push(e)||n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&i.splice(i.indexOf(e)>>>0,1);},emit:function(t,e){(n.get(t)||[]).slice().map(function(n){n(e);}),(n.get("*")||[]).slice().map(function(n){n(t,e);});}}}

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The EventEmitter class that many Puppeteer classes extend.
 *
 * @remarks
 *
 * This allows you to listen to events that Puppeteer classes fire and act
 * accordingly. Therefore you'll mostly use {@link EventEmitter.on | on} and
 * {@link EventEmitter.off | off} to bind
 * and unbind to event listeners.
 *
 * @public
 */
class EventEmitter {
    /**
     * @internal
     */
    constructor() {
        this.eventsMap = new Map();
        this.emitter = mitt_es(this.eventsMap);
    }
    /**
     * Bind an event listener to fire when an event occurs.
     * @param event - the event type you'd like to listen to. Can be a string or symbol.
     * @param handler - the function to be called when the event occurs.
     * @returns `this` to enable you to chain method calls.
     */
    on(event, handler) {
        this.emitter.on(event, handler);
        return this;
    }
    /**
     * Remove an event listener from firing.
     * @param event - the event type you'd like to stop listening to.
     * @param handler - the function that should be removed.
     * @returns `this` to enable you to chain method calls.
     */
    off(event, handler) {
        this.emitter.off(event, handler);
        return this;
    }
    /**
     * Remove an event listener.
     * @deprecated please use {@link EventEmitter.off} instead.
     */
    removeListener(event, handler) {
        this.off(event, handler);
        return this;
    }
    /**
     * Add an event listener.
     * @deprecated please use {@link EventEmitter.on} instead.
     */
    addListener(event, handler) {
        this.on(event, handler);
        return this;
    }
    /**
     * Emit an event and call any associated listeners.
     *
     * @param event - the event you'd like to emit
     * @param eventData - any data you'd like to emit with the event
     * @returns `true` if there are any listeners, `false` if there are not.
     */
    emit(event, eventData) {
        this.emitter.emit(event, eventData);
        return this.eventListenersCount(event) > 0;
    }
    /**
     * Like `on` but the listener will only be fired once and then it will be removed.
     * @param event - the event you'd like to listen to
     * @param handler - the handler function to run when the event occurs
     * @returns `this` to enable you to chain method calls.
     */
    once(event, handler) {
        const onceHandler = eventData => {
            handler(eventData);
            this.off(event, onceHandler);
        };
        return this.on(event, onceHandler);
    }
    /**
     * Gets the number of listeners for a given event.
     *
     * @param event - the event to get the listener count for
     * @returns the number of listeners bound to the given event
     */
    listenerCount(event) {
        return this.eventListenersCount(event);
    }
    /**
     * Removes all listeners. If given an event argument, it will remove only
     * listeners for that event.
     * @param event - the event to remove listeners for.
     * @returns `this` to enable you to chain method calls.
     */
    removeAllListeners(event) {
        if (event) {
            this.eventsMap.delete(event);
        }
        else {
            this.eventsMap.clear();
        }
        return this;
    }
    eventListenersCount(event) {
        var _a;
        return ((_a = this.eventsMap.get(event)) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const WEB_PERMISSION_TO_PROTOCOL_PERMISSION = new Map([
    ['geolocation', 'geolocation'],
    ['midi', 'midi'],
    ['notifications', 'notifications'],
    // TODO: push isn't a valid type?
    // ['push', 'push'],
    ['camera', 'videoCapture'],
    ['microphone', 'audioCapture'],
    ['background-sync', 'backgroundSync'],
    ['ambient-light-sensor', 'sensors'],
    ['accelerometer', 'sensors'],
    ['gyroscope', 'sensors'],
    ['magnetometer', 'sensors'],
    ['accessibility-events', 'accessibilityEvents'],
    ['clipboard-read', 'clipboardReadWrite'],
    ['clipboard-write', 'clipboardReadWrite'],
    ['payment-handler', 'paymentHandler'],
    ['persistent-storage', 'durableStorage'],
    ['idle-detection', 'idleDetection'],
    // chrome-specific permissions we have.
    ['midi-sysex', 'midiSysex'],
]);
/**
 * A Browser is created when Puppeteer connects to a Chromium instance, either through
 * {@link PuppeteerNode.launch} or {@link Puppeteer.connect}.
 *
 * @remarks
 *
 * The Browser class extends from Puppeteer's {@link EventEmitter} class and will
 * emit various events which are documented in the {@link BrowserEmittedEvents} enum.
 *
 * @example
 * An example of using a {@link Browser} to create a {@link Page}:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   await browser.close();
 * })();
 * ```
 *
 * @example
 * An example of disconnecting from and reconnecting to a {@link Browser}:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   // Store the endpoint to be able to reconnect to Chromium
 *   const browserWSEndpoint = browser.wsEndpoint();
 *   // Disconnect puppeteer from Chromium
 *   browser.disconnect();
 *
 *   // Use the endpoint to reestablish a connection
 *   const browser2 = await puppeteer.connect({browserWSEndpoint});
 *   // Close Chromium
 *   await browser2.close();
 * })();
 * ```
 *
 * @public
 */
let Browser$1 = class Browser extends EventEmitter {
    /**
     * @internal
     */
    constructor() {
        super();
    }
    /**
     * @internal
     */
    _attach() {
        throw new Error('Not implemented');
    }
    /**
     * @internal
     */
    _detach() {
        throw new Error('Not implemented');
    }
    /**
     * @internal
     */
    get _targets() {
        throw new Error('Not implemented');
    }
    /**
     * The spawned browser process. Returns `null` if the browser instance was created with
     * {@link Puppeteer.connect}.
     */
    process() {
        throw new Error('Not implemented');
    }
    /**
     * @internal
     */
    _getIsPageTargetCallback() {
        throw new Error('Not implemented');
    }
    createIncognitoBrowserContext() {
        throw new Error('Not implemented');
    }
    /**
     * Returns an array of all open browser contexts. In a newly created browser, this will
     * return a single instance of {@link BrowserContext}.
     */
    browserContexts() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the default browser context. The default browser context cannot be closed.
     */
    defaultBrowserContext() {
        throw new Error('Not implemented');
    }
    _disposeContext() {
        throw new Error('Not implemented');
    }
    /**
     * The browser websocket endpoint which can be used as an argument to
     * {@link Puppeteer.connect}.
     *
     * @returns The Browser websocket url.
     *
     * @remarks
     *
     * The format is `ws://${host}:${port}/devtools/browser/<id>`.
     *
     * You can find the `webSocketDebuggerUrl` from `http://${host}:${port}/json/version`.
     * Learn more about the
     * {@link https://chromedevtools.github.io/devtools-protocol | devtools protocol} and
     * the {@link
     * https://chromedevtools.github.io/devtools-protocol/#how-do-i-access-the-browser-target
     * | browser endpoint}.
     */
    wsEndpoint() {
        throw new Error('Not implemented');
    }
    /**
     * Promise which resolves to a new {@link Page} object. The Page is created in
     * a default browser context.
     */
    newPage() {
        throw new Error('Not implemented');
    }
    _createPageInContext() {
        throw new Error('Not implemented');
    }
    /**
     * All active targets inside the Browser. In case of multiple browser contexts, returns
     * an array with all the targets in all browser contexts.
     */
    targets() {
        throw new Error('Not implemented');
    }
    /**
     * The target associated with the browser.
     */
    target() {
        throw new Error('Not implemented');
    }
    waitForTarget() {
        throw new Error('Not implemented');
    }
    /**
     * An array of all open pages inside the Browser.
     *
     * @remarks
     *
     * In case of multiple browser contexts, returns an array with all the pages in all
     * browser contexts. Non-visible pages, such as `"background_page"`, will not be listed
     * here. You can find them using {@link Target.page}.
     */
    pages() {
        throw new Error('Not implemented');
    }
    /**
     * A string representing the browser name and version.
     *
     * @remarks
     *
     * For headless Chromium, this is similar to `HeadlessChrome/61.0.3153.0`. For
     * non-headless, this is similar to `Chrome/61.0.3153.0`.
     *
     * The format of browser.version() might change with future releases of Chromium.
     */
    version() {
        throw new Error('Not implemented');
    }
    /**
     * The browser's original user agent. Pages can override the browser user agent with
     * {@link Page.setUserAgent}.
     */
    userAgent() {
        throw new Error('Not implemented');
    }
    /**
     * Closes Chromium and all of its pages (if any were opened). The {@link Browser} object
     * itself is considered to be disposed and cannot be used anymore.
     */
    close() {
        throw new Error('Not implemented');
    }
    /**
     * Disconnects Puppeteer from the browser, but leaves the Chromium process running.
     * After calling `disconnect`, the {@link Browser} object is considered disposed and
     * cannot be used anymore.
     */
    disconnect() {
        throw new Error('Not implemented');
    }
    /**
     * Indicates that the browser is connected.
     */
    isConnected() {
        throw new Error('Not implemented');
    }
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * BrowserContexts provide a way to operate multiple independent browser
 * sessions. When a browser is launched, it has a single BrowserContext used by
 * default. The method {@link Browser.newPage | Browser.newPage} creates a page
 * in the default browser context.
 *
 * @remarks
 *
 * The Browser class extends from Puppeteer's {@link EventEmitter} class and
 * will emit various events which are documented in the
 * {@link BrowserContextEmittedEvents} enum.
 *
 * If a page opens another page, e.g. with a `window.open` call, the popup will
 * belong to the parent page's browser context.
 *
 * Puppeteer allows creation of "incognito" browser contexts with
 * {@link Browser.createIncognitoBrowserContext | Browser.createIncognitoBrowserContext}
 * method. "Incognito" browser contexts don't write any browsing data to disk.
 *
 * @example
 *
 * ```ts
 * // Create a new incognito browser context
 * const context = await browser.createIncognitoBrowserContext();
 * // Create a new page inside context.
 * const page = await context.newPage();
 * // ... do stuff with page ...
 * await page.goto('https://example.com');
 * // Dispose context once it's no longer needed.
 * await context.close();
 * ```
 *
 * @public
 */
let BrowserContext$1 = class BrowserContext extends EventEmitter {
    /**
     * @internal
     */
    constructor() {
        super();
    }
    /**
     * An array of all active targets inside the browser context.
     */
    targets() {
        throw new Error('Not implemented');
    }
    waitForTarget() {
        throw new Error('Not implemented');
    }
    /**
     * An array of all pages inside the browser context.
     *
     * @returns Promise which resolves to an array of all open pages.
     * Non visible pages, such as `"background_page"`, will not be listed here.
     * You can find them using {@link Target.page | the target page}.
     */
    pages() {
        throw new Error('Not implemented');
    }
    /**
     * Returns whether BrowserContext is incognito.
     * The default browser context is the only non-incognito browser context.
     *
     * @remarks
     * The default browser context cannot be closed.
     */
    isIncognito() {
        throw new Error('Not implemented');
    }
    overridePermissions() {
        throw new Error('Not implemented');
    }
    /**
     * Clears all permission overrides for the browser context.
     *
     * @example
     *
     * ```ts
     * const context = browser.defaultBrowserContext();
     * context.overridePermissions('https://example.com', ['clipboard-read']);
     * // do stuff ..
     * context.clearPermissionOverrides();
     * ```
     */
    clearPermissionOverrides() {
        throw new Error('Not implemented');
    }
    /**
     * Creates a new page in the browser context.
     */
    newPage() {
        throw new Error('Not implemented');
    }
    /**
     * The browser this browser context belongs to.
     */
    browser() {
        throw new Error('Not implemented');
    }
    /**
     * Closes the browser context. All the targets that belong to the browser context
     * will be closed.
     *
     * @remarks
     * Only incognito browser contexts can be closed.
     */
    close() {
        throw new Error('Not implemented');
    }
    get id() {
        return undefined;
    }
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldGet$J = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Page_handlerMap;
/**
 * Page provides methods to interact with a single tab or
 * {@link https://developer.chrome.com/extensions/background_pages | extension background page}
 * in Chromium.
 *
 * :::note
 *
 * One Browser instance might have multiple Page instances.
 *
 * :::
 *
 * @example
 * This example creates a page, navigates it to a URL, and then saves a screenshot:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   await page.screenshot({path: 'screenshot.png'});
 *   await browser.close();
 * })();
 * ```
 *
 * The Page class extends from Puppeteer's {@link EventEmitter} class and will
 * emit various events which are documented in the {@link PageEmittedEvents} enum.
 *
 * @example
 * This example logs a message for a single page `load` event:
 *
 * ```ts
 * page.once('load', () => console.log('Page loaded!'));
 * ```
 *
 * To unsubscribe from events use the {@link Page.off} method:
 *
 * ```ts
 * function logRequest(interceptedRequest) {
 *   console.log('A request was made:', interceptedRequest.url());
 * }
 * page.on('request', logRequest);
 * // Sometime later...
 * page.off('request', logRequest);
 * ```
 *
 * @public
 */
let Page$1 = class Page extends EventEmitter {
    /**
     * @internal
     */
    constructor() {
        super();
        _Page_handlerMap.set(this, new WeakMap());
    }
    /**
     * @returns `true` if drag events are being intercepted, `false` otherwise.
     */
    isDragInterceptionEnabled() {
        throw new Error('Not implemented');
    }
    /**
     * @returns `true` if the page has JavaScript enabled, `false` otherwise.
     */
    isJavaScriptEnabled() {
        throw new Error('Not implemented');
    }
    /**
     * Listen to page events.
     *
     * :::note
     *
     * This method exists to define event typings and handle proper wireup of
     * cooperative request interception. Actual event listening and dispatching is
     * delegated to {@link EventEmitter}.
     *
     * :::
     */
    on(eventName, handler) {
        if (eventName === 'request') {
            const wrap = __classPrivateFieldGet$J(this, _Page_handlerMap, "f").get(handler) ||
                ((event) => {
                    event.enqueueInterceptAction(() => {
                        return handler(event);
                    });
                });
            __classPrivateFieldGet$J(this, _Page_handlerMap, "f").set(handler, wrap);
            return super.on(eventName, wrap);
        }
        return super.on(eventName, handler);
    }
    once(eventName, handler) {
        // Note: this method only exists to define the types; we delegate the impl
        // to EventEmitter.
        return super.once(eventName, handler);
    }
    off(eventName, handler) {
        if (eventName === 'request') {
            handler = __classPrivateFieldGet$J(this, _Page_handlerMap, "f").get(handler) || handler;
        }
        return super.off(eventName, handler);
    }
    waitForFileChooser() {
        throw new Error('Not implemented');
    }
    async setGeolocation() {
        throw new Error('Not implemented');
    }
    /**
     * @returns A target this page was created from.
     */
    target() {
        throw new Error('Not implemented');
    }
    /**
     * Get the browser the page belongs to.
     */
    browser() {
        throw new Error('Not implemented');
    }
    /**
     * Get the browser context that the page belongs to.
     */
    browserContext() {
        throw new Error('Not implemented');
    }
    /**
     * @returns The page's main frame.
     *
     * @remarks
     * Page is guaranteed to have a main frame which persists during navigations.
     */
    mainFrame() {
        throw new Error('Not implemented');
    }
    get keyboard() {
        throw new Error('Not implemented');
    }
    get touchscreen() {
        throw new Error('Not implemented');
    }
    get coverage() {
        throw new Error('Not implemented');
    }
    get tracing() {
        throw new Error('Not implemented');
    }
    get accessibility() {
        throw new Error('Not implemented');
    }
    /**
     * @returns An array of all frames attached to the page.
     */
    frames() {
        throw new Error('Not implemented');
    }
    /**
     * @returns all of the dedicated {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API |
     * WebWorkers} associated with the page.
     *
     * @remarks
     * This does not contain ServiceWorkers
     */
    workers() {
        throw new Error('Not implemented');
    }
    async setRequestInterception() {
        throw new Error('Not implemented');
    }
    async setDragInterception() {
        throw new Error('Not implemented');
    }
    setOfflineMode() {
        throw new Error('Not implemented');
    }
    emulateNetworkConditions() {
        throw new Error('Not implemented');
    }
    setDefaultNavigationTimeout() {
        throw new Error('Not implemented');
    }
    setDefaultTimeout() {
        throw new Error('Not implemented');
    }
    /**
     * @returns Maximum time in milliseconds.
     */
    getDefaultTimeout() {
        throw new Error('Not implemented');
    }
    async $() {
        throw new Error('Not implemented');
    }
    async $$() {
        throw new Error('Not implemented');
    }
    async evaluateHandle() {
        throw new Error('Not implemented');
    }
    async queryObjects() {
        throw new Error('Not implemented');
    }
    async $eval() {
        throw new Error('Not implemented');
    }
    async $$eval() {
        throw new Error('Not implemented');
    }
    async $x() {
        throw new Error('Not implemented');
    }
    async cookies() {
        throw new Error('Not implemented');
    }
    async deleteCookie() {
        throw new Error('Not implemented');
    }
    async setCookie() {
        throw new Error('Not implemented');
    }
    async addScriptTag() {
        throw new Error('Not implemented');
    }
    async addStyleTag() {
        throw new Error('Not implemented');
    }
    async exposeFunction() {
        throw new Error('Not implemented');
    }
    async authenticate() {
        throw new Error('Not implemented');
    }
    async setExtraHTTPHeaders() {
        throw new Error('Not implemented');
    }
    async setUserAgent() {
        throw new Error('Not implemented');
    }
    /**
     * @returns Object containing metrics as key/value pairs.
     *
     * - `Timestamp` : The timestamp when the metrics sample was taken.
     *
     * - `Documents` : Number of documents in the page.
     *
     * - `Frames` : Number of frames in the page.
     *
     * - `JSEventListeners` : Number of events in the page.
     *
     * - `Nodes` : Number of DOM nodes in the page.
     *
     * - `LayoutCount` : Total number of full or partial page layout.
     *
     * - `RecalcStyleCount` : Total number of page style recalculations.
     *
     * - `LayoutDuration` : Combined durations of all page layouts.
     *
     * - `RecalcStyleDuration` : Combined duration of all page style
     *   recalculations.
     *
     * - `ScriptDuration` : Combined duration of JavaScript execution.
     *
     * - `TaskDuration` : Combined duration of all tasks performed by the browser.
     *
     * - `JSHeapUsedSize` : Used JavaScript heap size.
     *
     * - `JSHeapTotalSize` : Total JavaScript heap size.
     *
     * @remarks
     * All timestamps are in monotonic time: monotonically increasing time
     * in seconds since an arbitrary point in the past.
     */
    async metrics() {
        throw new Error('Not implemented');
    }
    /**
     *
     * @returns
     * @remarks Shortcut for
     * {@link Frame.url | page.mainFrame().url()}.
     */
    url() {
        throw new Error('Not implemented');
    }
    async content() {
        throw new Error('Not implemented');
    }
    async setContent() {
        throw new Error('Not implemented');
    }
    async goto() {
        throw new Error('Not implemented');
    }
    async reload() {
        throw new Error('Not implemented');
    }
    async waitForNavigation() {
        throw new Error('Not implemented');
    }
    async waitForRequest() {
        throw new Error('Not implemented');
    }
    async waitForResponse() {
        throw new Error('Not implemented');
    }
    async waitForNetworkIdle() {
        throw new Error('Not implemented');
    }
    async waitForFrame() {
        throw new Error('Not implemented');
    }
    async goBack() {
        throw new Error('Not implemented');
    }
    async goForward() {
        throw new Error('Not implemented');
    }
    /**
     * Brings page to front (activates tab).
     */
    async bringToFront() {
        throw new Error('Not implemented');
    }
    /**
     * Emulates a given device's metrics and user agent.
     *
     * To aid emulation, Puppeteer provides a list of known devices that can be
     * via {@link KnownDevices}.
     *
     * @remarks
     * This method is a shortcut for calling two methods:
     * {@link Page.setUserAgent} and {@link Page.setViewport}.
     *
     * @remarks
     * This method will resize the page. A lot of websites don't expect phones to
     * change size, so you should emulate before navigating to the page.
     *
     * @example
     *
     * ```ts
     * import {KnownDevices} from 'puppeteer';
     * const iPhone = KnownDevices['iPhone 6'];
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.emulate(iPhone);
     *   await page.goto('https://www.google.com');
     *   // other actions...
     *   await browser.close();
     * })();
     * ```
     */
    async emulate(device) {
        await Promise.all([
            this.setUserAgent(device.userAgent),
            this.setViewport(device.viewport),
        ]);
    }
    async setJavaScriptEnabled() {
        throw new Error('Not implemented');
    }
    async setBypassCSP() {
        throw new Error('Not implemented');
    }
    async emulateMediaType() {
        throw new Error('Not implemented');
    }
    async emulateCPUThrottling() {
        throw new Error('Not implemented');
    }
    async emulateMediaFeatures() {
        throw new Error('Not implemented');
    }
    async emulateTimezone() {
        throw new Error('Not implemented');
    }
    async emulateIdleState() {
        throw new Error('Not implemented');
    }
    async emulateVisionDeficiency() {
        throw new Error('Not implemented');
    }
    async setViewport() {
        throw new Error('Not implemented');
    }
    /**
     * @returns
     *
     * - `width`: page's width in pixels
     *
     * - `height`: page's height in pixels
     *
     * - `deviceScaleFactor`: Specify device scale factor (can be though of as
     *   dpr). Defaults to `1`.
     *
     * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
     *   to `false`.
     *
     * - `hasTouch`: Specifies if viewport supports touch events. Defaults to
     *   `false`.
     *
     * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to
     *   `false`.
     */
    viewport() {
        throw new Error('Not implemented');
    }
    async evaluate() {
        throw new Error('Not implemented');
    }
    async evaluateOnNewDocument() {
        throw new Error('Not implemented');
    }
    async setCacheEnabled() {
        throw new Error('Not implemented');
    }
    async screenshot() {
        throw new Error('Not implemented');
    }
    async createPDFStream() {
        throw new Error('Not implemented');
    }
    async pdf() {
        throw new Error('Not implemented');
    }
    /**
     * @returns The page's title
     * @remarks
     * Shortcut for {@link Frame.title | page.mainFrame().title()}.
     */
    async title() {
        throw new Error('Not implemented');
    }
    async close() {
        throw new Error('Not implemented');
    }
    /**
     * Indicates that the page has been closed.
     * @returns
     */
    isClosed() {
        throw new Error('Not implemented');
    }
    get mouse() {
        throw new Error('Not implemented');
    }
    click() {
        throw new Error('Not implemented');
    }
    focus() {
        throw new Error('Not implemented');
    }
    hover() {
        throw new Error('Not implemented');
    }
    select() {
        throw new Error('Not implemented');
    }
    tap() {
        throw new Error('Not implemented');
    }
    type() {
        throw new Error('Not implemented');
    }
    waitForTimeout() {
        throw new Error('Not implemented');
    }
    async waitForSelector() {
        throw new Error('Not implemented');
    }
    waitForXPath() {
        throw new Error('Not implemented');
    }
    waitForFunction() {
        throw new Error('Not implemented');
    }
};
_Page_handlerMap = new WeakMap();
/**
 * @internal
 */
const supportedMetrics$1 = new Set([
    'Timestamp',
    'Documents',
    'Frames',
    'JSEventListeners',
    'Nodes',
    'LayoutCount',
    'RecalcStyleCount',
    'LayoutDuration',
    'RecalcStyleDuration',
    'ScriptDuration',
    'TaskDuration',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
]);
/**
 * @internal
 */
const unitToPixels$1 = {
    px: 1,
    in: 96,
    cm: 37.8,
    mm: 3.78,
};

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$F = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$I = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Accessibility_client, _AXNode_instances, _AXNode_richlyEditable, _AXNode_editable, _AXNode_focusable, _AXNode_hidden, _AXNode_name, _AXNode_role, _AXNode_ignored, _AXNode_cachedHasFocusableChild, _AXNode_isPlainTextField, _AXNode_isTextOnlyObject, _AXNode_hasFocusableChild;
/**
 * The Accessibility class provides methods for inspecting Chromium's
 * accessibility tree. The accessibility tree is used by assistive technology
 * such as {@link https://en.wikipedia.org/wiki/Screen_reader | screen readers} or
 * {@link https://en.wikipedia.org/wiki/Switch_access | switches}.
 *
 * @remarks
 *
 * Accessibility is a very platform-specific thing. On different platforms,
 * there are different screen readers that might have wildly different output.
 *
 * Blink - Chrome's rendering engine - has a concept of "accessibility tree",
 * which is then translated into different platform-specific APIs. Accessibility
 * namespace gives users access to the Blink Accessibility Tree.
 *
 * Most of the accessibility tree gets filtered out when converting from Blink
 * AX Tree to Platform-specific AX-Tree or by assistive technologies themselves.
 * By default, Puppeteer tries to approximate this filtering, exposing only
 * the "interesting" nodes of the tree.
 *
 * @public
 */
class Accessibility {
    /**
     * @internal
     */
    constructor(client) {
        _Accessibility_client.set(this, void 0);
        __classPrivateFieldSet$F(this, _Accessibility_client, client, "f");
    }
    /**
     * Captures the current state of the accessibility tree.
     * The returned object represents the root accessible node of the page.
     *
     * @remarks
     *
     * **NOTE** The Chromium accessibility tree contains nodes that go unused on
     * most platforms and by most screen readers. Puppeteer will discard them as
     * well for an easier to process tree, unless `interestingOnly` is set to
     * `false`.
     *
     * @example
     * An example of dumping the entire accessibility tree:
     *
     * ```ts
     * const snapshot = await page.accessibility.snapshot();
     * console.log(snapshot);
     * ```
     *
     * @example
     * An example of logging the focused node's name:
     *
     * ```ts
     * const snapshot = await page.accessibility.snapshot();
     * const node = findFocusedNode(snapshot);
     * console.log(node && node.name);
     *
     * function findFocusedNode(node) {
     *   if (node.focused) return node;
     *   for (const child of node.children || []) {
     *     const foundNode = findFocusedNode(child);
     *     return foundNode;
     *   }
     *   return null;
     * }
     * ```
     *
     * @returns An AXNode object representing the snapshot.
     */
    async snapshot(options = {}) {
        var _a, _b;
        const { interestingOnly = true, root = null } = options;
        const { nodes } = await __classPrivateFieldGet$I(this, _Accessibility_client, "f").send('Accessibility.getFullAXTree');
        let backendNodeId;
        if (root) {
            const { node } = await __classPrivateFieldGet$I(this, _Accessibility_client, "f").send('DOM.describeNode', {
                objectId: root.remoteObject().objectId,
            });
            backendNodeId = node.backendNodeId;
        }
        const defaultRoot = AXNode.createTree(nodes);
        let needle = defaultRoot;
        if (backendNodeId) {
            needle = defaultRoot.find(node => {
                return node.payload.backendDOMNodeId === backendNodeId;
            });
            if (!needle) {
                return null;
            }
        }
        if (!interestingOnly) {
            return (_a = this.serializeTree(needle)[0]) !== null && _a !== void 0 ? _a : null;
        }
        const interestingNodes = new Set();
        this.collectInterestingNodes(interestingNodes, defaultRoot, false);
        if (!interestingNodes.has(needle)) {
            return null;
        }
        return (_b = this.serializeTree(needle, interestingNodes)[0]) !== null && _b !== void 0 ? _b : null;
    }
    serializeTree(node, interestingNodes) {
        const children = [];
        for (const child of node.children) {
            children.push(...this.serializeTree(child, interestingNodes));
        }
        if (interestingNodes && !interestingNodes.has(node)) {
            return children;
        }
        const serializedNode = node.serialize();
        if (children.length) {
            serializedNode.children = children;
        }
        return [serializedNode];
    }
    collectInterestingNodes(collection, node, insideControl) {
        if (node.isInteresting(insideControl)) {
            collection.add(node);
        }
        if (node.isLeafNode()) {
            return;
        }
        insideControl = insideControl || node.isControl();
        for (const child of node.children) {
            this.collectInterestingNodes(collection, child, insideControl);
        }
    }
}
_Accessibility_client = new WeakMap();
class AXNode {
    constructor(payload) {
        _AXNode_instances.add(this);
        this.children = [];
        _AXNode_richlyEditable.set(this, false);
        _AXNode_editable.set(this, false);
        _AXNode_focusable.set(this, false);
        _AXNode_hidden.set(this, false);
        _AXNode_name.set(this, void 0);
        _AXNode_role.set(this, void 0);
        _AXNode_ignored.set(this, void 0);
        _AXNode_cachedHasFocusableChild.set(this, void 0);
        this.payload = payload;
        __classPrivateFieldSet$F(this, _AXNode_name, this.payload.name ? this.payload.name.value : '', "f");
        __classPrivateFieldSet$F(this, _AXNode_role, this.payload.role ? this.payload.role.value : 'Unknown', "f");
        __classPrivateFieldSet$F(this, _AXNode_ignored, this.payload.ignored, "f");
        for (const property of this.payload.properties || []) {
            if (property.name === 'editable') {
                __classPrivateFieldSet$F(this, _AXNode_richlyEditable, property.value.value === 'richtext', "f");
                __classPrivateFieldSet$F(this, _AXNode_editable, true, "f");
            }
            if (property.name === 'focusable') {
                __classPrivateFieldSet$F(this, _AXNode_focusable, property.value.value, "f");
            }
            if (property.name === 'hidden') {
                __classPrivateFieldSet$F(this, _AXNode_hidden, property.value.value, "f");
            }
        }
    }
    find(predicate) {
        if (predicate(this)) {
            return this;
        }
        for (const child of this.children) {
            const result = child.find(predicate);
            if (result) {
                return result;
            }
        }
        return null;
    }
    isLeafNode() {
        if (!this.children.length) {
            return true;
        }
        // These types of objects may have children that we use as internal
        // implementation details, but we want to expose them as leaves to platform
        // accessibility APIs because screen readers might be confused if they find
        // any children.
        if (__classPrivateFieldGet$I(this, _AXNode_instances, "m", _AXNode_isPlainTextField).call(this) || __classPrivateFieldGet$I(this, _AXNode_instances, "m", _AXNode_isTextOnlyObject).call(this)) {
            return true;
        }
        // Roles whose children are only presentational according to the ARIA and
        // HTML5 Specs should be hidden from screen readers.
        // (Note that whilst ARIA buttons can have only presentational children, HTML5
        // buttons are allowed to have content.)
        switch (__classPrivateFieldGet$I(this, _AXNode_role, "f")) {
            case 'doc-cover':
            case 'graphics-symbol':
            case 'img':
            case 'Meter':
            case 'scrollbar':
            case 'slider':
            case 'separator':
            case 'progressbar':
                return true;
        }
        // Here and below: Android heuristics
        if (__classPrivateFieldGet$I(this, _AXNode_instances, "m", _AXNode_hasFocusableChild).call(this)) {
            return false;
        }
        if (__classPrivateFieldGet$I(this, _AXNode_focusable, "f") && __classPrivateFieldGet$I(this, _AXNode_name, "f")) {
            return true;
        }
        if (__classPrivateFieldGet$I(this, _AXNode_role, "f") === 'heading' && __classPrivateFieldGet$I(this, _AXNode_name, "f")) {
            return true;
        }
        return false;
    }
    isControl() {
        switch (__classPrivateFieldGet$I(this, _AXNode_role, "f")) {
            case 'button':
            case 'checkbox':
            case 'ColorWell':
            case 'combobox':
            case 'DisclosureTriangle':
            case 'listbox':
            case 'menu':
            case 'menubar':
            case 'menuitem':
            case 'menuitemcheckbox':
            case 'menuitemradio':
            case 'radio':
            case 'scrollbar':
            case 'searchbox':
            case 'slider':
            case 'spinbutton':
            case 'switch':
            case 'tab':
            case 'textbox':
            case 'tree':
            case 'treeitem':
                return true;
            default:
                return false;
        }
    }
    isInteresting(insideControl) {
        const role = __classPrivateFieldGet$I(this, _AXNode_role, "f");
        if (role === 'Ignored' || __classPrivateFieldGet$I(this, _AXNode_hidden, "f") || __classPrivateFieldGet$I(this, _AXNode_ignored, "f")) {
            return false;
        }
        if (__classPrivateFieldGet$I(this, _AXNode_focusable, "f") || __classPrivateFieldGet$I(this, _AXNode_richlyEditable, "f")) {
            return true;
        }
        // If it's not focusable but has a control role, then it's interesting.
        if (this.isControl()) {
            return true;
        }
        // A non focusable child of a control is not interesting
        if (insideControl) {
            return false;
        }
        return this.isLeafNode() && !!__classPrivateFieldGet$I(this, _AXNode_name, "f");
    }
    serialize() {
        const properties = new Map();
        for (const property of this.payload.properties || []) {
            properties.set(property.name.toLowerCase(), property.value.value);
        }
        if (this.payload.name) {
            properties.set('name', this.payload.name.value);
        }
        if (this.payload.value) {
            properties.set('value', this.payload.value.value);
        }
        if (this.payload.description) {
            properties.set('description', this.payload.description.value);
        }
        const node = {
            role: __classPrivateFieldGet$I(this, _AXNode_role, "f"),
        };
        const userStringProperties = [
            'name',
            'value',
            'description',
            'keyshortcuts',
            'roledescription',
            'valuetext',
        ];
        const getUserStringPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const userStringProperty of userStringProperties) {
            if (!properties.has(userStringProperty)) {
                continue;
            }
            node[userStringProperty] = getUserStringPropertyValue(userStringProperty);
        }
        const booleanProperties = [
            'disabled',
            'expanded',
            'focused',
            'modal',
            'multiline',
            'multiselectable',
            'readonly',
            'required',
            'selected',
        ];
        const getBooleanPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const booleanProperty of booleanProperties) {
            // RootWebArea's treat focus differently than other nodes. They report whether
            // their frame  has focus, not whether focus is specifically on the root
            // node.
            if (booleanProperty === 'focused' && __classPrivateFieldGet$I(this, _AXNode_role, "f") === 'RootWebArea') {
                continue;
            }
            const value = getBooleanPropertyValue(booleanProperty);
            if (!value) {
                continue;
            }
            node[booleanProperty] = getBooleanPropertyValue(booleanProperty);
        }
        const tristateProperties = ['checked', 'pressed'];
        for (const tristateProperty of tristateProperties) {
            if (!properties.has(tristateProperty)) {
                continue;
            }
            const value = properties.get(tristateProperty);
            node[tristateProperty] =
                value === 'mixed' ? 'mixed' : value === 'true' ? true : false;
        }
        const numericalProperties = [
            'level',
            'valuemax',
            'valuemin',
        ];
        const getNumericalPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const numericalProperty of numericalProperties) {
            if (!properties.has(numericalProperty)) {
                continue;
            }
            node[numericalProperty] = getNumericalPropertyValue(numericalProperty);
        }
        const tokenProperties = [
            'autocomplete',
            'haspopup',
            'invalid',
            'orientation',
        ];
        const getTokenPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const tokenProperty of tokenProperties) {
            const value = getTokenPropertyValue(tokenProperty);
            if (!value || value === 'false') {
                continue;
            }
            node[tokenProperty] = getTokenPropertyValue(tokenProperty);
        }
        return node;
    }
    static createTree(payloads) {
        const nodeById = new Map();
        for (const payload of payloads) {
            nodeById.set(payload.nodeId, new AXNode(payload));
        }
        for (const node of nodeById.values()) {
            for (const childId of node.payload.childIds || []) {
                node.children.push(nodeById.get(childId));
            }
        }
        return nodeById.values().next().value;
    }
}
_AXNode_richlyEditable = new WeakMap(), _AXNode_editable = new WeakMap(), _AXNode_focusable = new WeakMap(), _AXNode_hidden = new WeakMap(), _AXNode_name = new WeakMap(), _AXNode_role = new WeakMap(), _AXNode_ignored = new WeakMap(), _AXNode_cachedHasFocusableChild = new WeakMap(), _AXNode_instances = new WeakSet(), _AXNode_isPlainTextField = function _AXNode_isPlainTextField() {
    if (__classPrivateFieldGet$I(this, _AXNode_richlyEditable, "f")) {
        return false;
    }
    if (__classPrivateFieldGet$I(this, _AXNode_editable, "f")) {
        return true;
    }
    return __classPrivateFieldGet$I(this, _AXNode_role, "f") === 'textbox' || __classPrivateFieldGet$I(this, _AXNode_role, "f") === 'searchbox';
}, _AXNode_isTextOnlyObject = function _AXNode_isTextOnlyObject() {
    const role = __classPrivateFieldGet$I(this, _AXNode_role, "f");
    return role === 'LineBreak' || role === 'text' || role === 'InlineTextBox';
}, _AXNode_hasFocusableChild = function _AXNode_hasFocusableChild() {
    if (__classPrivateFieldGet$I(this, _AXNode_cachedHasFocusableChild, "f") === undefined) {
        __classPrivateFieldSet$F(this, _AXNode_cachedHasFocusableChild, false, "f");
        for (const child of this.children) {
            if (__classPrivateFieldGet$I(child, _AXNode_focusable, "f") || __classPrivateFieldGet$I(child, _AXNode_instances, "m", _AXNode_hasFocusableChild).call(child)) {
                __classPrivateFieldSet$F(this, _AXNode_cachedHasFocusableChild, true, "f");
                break;
            }
        }
    }
    return __classPrivateFieldGet$I(this, _AXNode_cachedHasFocusableChild, "f");
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Asserts that the given value is truthy.
 * @param value - some conditional statement
 * @param message - the error message to throw if the value is not truthy.
 *
 * @internal
 */
const assert = (value, message) => {
    if (!value) {
        throw new Error(message);
    }
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A unique key for {@link IsolatedWorldChart} to denote the default world.
 * Execution contexts are automatically created in the default world.
 *
 * @internal
 */
const MAIN_WORLD = Symbol('mainWorld');
/**
 * A unique key for {@link IsolatedWorldChart} to denote the puppeteer world.
 * This world contains all puppeteer-internal bindings/code.
 *
 * @internal
 */
const PUPPETEER_WORLD = Symbol('puppeteerWorld');

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function queryAXTree(client, element, accessibleName, role) {
    const { nodes } = await client.send('Accessibility.queryAXTree', {
        objectId: element.remoteObject().objectId,
        accessibleName,
        role,
    });
    const filteredNodes = nodes.filter((node) => {
        return !node.role || node.role.value !== 'StaticText';
    });
    return filteredNodes;
}
const normalizeValue = (value) => {
    return value.replace(/ +/g, ' ').trim();
};
const knownAttributes = new Set(['name', 'role']);
const attributeRegexp = /\[\s*(?<attribute>\w+)\s*=\s*(?<quote>"|')(?<value>\\.|.*?(?=\k<quote>))\k<quote>\s*\]/g;
function isKnownAttribute(attribute) {
    return knownAttributes.has(attribute);
}
/**
 * The selectors consist of an accessible name to query for and optionally
 * further aria attributes on the form `[<attribute>=<value>]`.
 * Currently, we only support the `name` and `role` attribute.
 * The following examples showcase how the syntax works wrt. querying:
 *
 * - 'title[role="heading"]' queries for elements with name 'title' and role 'heading'.
 * - '[role="img"]' queries for elements with role 'img' and any name.
 * - 'label' queries for elements with name 'label' and any role.
 * - '[name=""][role="button"]' queries for elements with no name and role 'button'.
 */
function parseAriaSelector(selector) {
    const queryOptions = {};
    const defaultName = selector.replace(attributeRegexp, (_, attribute, _quote, value) => {
        attribute = attribute.trim();
        assert(isKnownAttribute(attribute), `Unknown aria attribute "${attribute}" in selector`);
        queryOptions[attribute] = normalizeValue(value);
        return '';
    });
    if (defaultName && !queryOptions.name) {
        queryOptions.name = normalizeValue(defaultName);
    }
    return queryOptions;
}
const queryOneId = async (element, selector) => {
    const { name, role } = parseAriaSelector(selector);
    const res = await queryAXTree(element.client, element, name, role);
    if (!res[0] || !res[0].backendDOMNodeId) {
        return null;
    }
    return res[0].backendDOMNodeId;
};
const queryOne = async (element, selector) => {
    const id = await queryOneId(element, selector);
    if (!id) {
        return null;
    }
    return (await element.frame.worlds[MAIN_WORLD].adoptBackendNode(id));
};
const waitFor = async (elementOrFrame, selector, options) => {
    let frame;
    let element;
    if ('isOOPFrame' in elementOrFrame) {
        frame = elementOrFrame;
    }
    else {
        frame = elementOrFrame.frame;
        element = await frame.worlds[PUPPETEER_WORLD].adoptHandle(elementOrFrame);
    }
    const ariaQuerySelector = async (selector) => {
        const id = await queryOneId(element || (await frame.worlds[PUPPETEER_WORLD].document()), selector);
        if (!id) {
            return null;
        }
        return (await frame.worlds[PUPPETEER_WORLD].adoptBackendNode(id));
    };
    const result = await frame.worlds[PUPPETEER_WORLD]._waitForSelectorInPage((_, selector) => {
        return globalThis.ariaQuerySelector(selector);
    }, element, selector, options, new Map([['ariaQuerySelector', ariaQuerySelector]]));
    if (element) {
        await element.dispose();
    }
    const handle = result === null || result === void 0 ? void 0 : result.asElement();
    if (!handle) {
        await (result === null || result === void 0 ? void 0 : result.dispose());
        return null;
    }
    return handle.frame.worlds[MAIN_WORLD].transferHandle(handle);
};
const queryAll = async (element, selector) => {
    const exeCtx = element.executionContext();
    const { name, role } = parseAriaSelector(selector);
    const res = await queryAXTree(exeCtx._client, element, name, role);
    const world = exeCtx._world;
    return Promise.all(res.map(axNode => {
        return world.adoptBackendNode(axNode.backendDOMNodeId);
    }));
};
/**
 * @internal
 */
const ariaHandler = {
    queryOne,
    waitFor,
    queryAll,
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const isNode = !!(typeof process !== 'undefined' && process.version);
/**
 * @internal
 */
const DEFERRED_PROMISE_DEBUG_TIMEOUT = typeof process !== 'undefined' &&
    typeof process.env['PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT'] !== 'undefined'
    ? Number(process.env['PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT'])
    : -1;

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
let debugModule = null;
/**
 * @internal
 */
async function importDebug() {
    if (!debugModule) {
        debugModule = (await import('debug')).default;
    }
    return debugModule;
}
/**
 * A debug function that can be used in any environment.
 *
 * @remarks
 * If used in Node, it falls back to the
 * {@link https://www.npmjs.com/package/debug | debug module}. In the browser it
 * uses `console.log`.
 *
 * In Node, use the `DEBUG` environment variable to control logging:
 *
 * ```
 * DEBUG=* // logs all channels
 * DEBUG=foo // logs the `foo` channel
 * DEBUG=foo* // logs any channels starting with `foo`
 * ```
 *
 * In the browser, set `window.__PUPPETEER_DEBUG` to a string:
 *
 * ```
 * window.__PUPPETEER_DEBUG='*'; // logs all channels
 * window.__PUPPETEER_DEBUG='foo'; // logs the `foo` channel
 * window.__PUPPETEER_DEBUG='foo*'; // logs any channels starting with `foo`
 * ```
 *
 * @example
 *
 * ```
 * const log = debug('Page');
 *
 * log('new page created')
 * // logs "Page: new page created"
 * ```
 *
 * @param prefix - this will be prefixed to each log.
 * @returns a function that can be called to log to that debug channel.
 *
 * @internal
 */
const debug = (prefix) => {
    if (isNode) {
        return async (...logArgs) => {
            (await importDebug())(prefix)(logArgs);
        };
    }
    return (...logArgs) => {
        const debugLevel = globalThis.__PUPPETEER_DEBUG;
        if (!debugLevel) {
            return;
        }
        const everythingShouldBeLogged = debugLevel === '*';
        const prefixMatchesDebugLevel = everythingShouldBeLogged ||
            /**
             * If the debug level is `foo*`, that means we match any prefix that
             * starts with `foo`. If the level is `foo`, we match only the prefix
             * `foo`.
             */
            (debugLevel.endsWith('*')
                ? prefix.startsWith(debugLevel)
                : prefix === debugLevel);
        if (!prefixMatchesDebugLevel) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`${prefix}:`, ...logArgs);
    };
};

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$E = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$H = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ProtocolError_code, _ProtocolError_originalMessage;
/**
 * @deprecated Do not use.
 *
 * @public
 */
class CustomError extends Error {
    /**
     * @internal
     */
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * TimeoutError is emitted whenever certain operations are terminated due to
 * timeout.
 *
 * @remarks
 * Example operations are {@link Page.waitForSelector | page.waitForSelector} or
 * {@link PuppeteerNode.launch | puppeteer.launch}.
 *
 * @public
 */
class TimeoutError extends CustomError {
}
/**
 * ProtocolError is emitted whenever there is an error from the protocol.
 *
 * @public
 */
class ProtocolError extends CustomError {
    constructor() {
        super(...arguments);
        _ProtocolError_code.set(this, void 0);
        _ProtocolError_originalMessage.set(this, '');
    }
    /**
     * @internal
     */
    set code(code) {
        __classPrivateFieldSet$E(this, _ProtocolError_code, code, "f");
    }
    /**
     * @public
     */
    get code() {
        return __classPrivateFieldGet$H(this, _ProtocolError_code, "f");
    }
    /**
     * @internal
     */
    set originalMessage(originalMessage) {
        __classPrivateFieldSet$E(this, _ProtocolError_originalMessage, originalMessage, "f");
    }
    /**
     * @public
     */
    get originalMessage() {
        return __classPrivateFieldGet$H(this, _ProtocolError_originalMessage, "f");
    }
}
_ProtocolError_code = new WeakMap(), _ProtocolError_originalMessage = new WeakMap();
/**
 * @deprecated Import error classes directly.
 *
 * Puppeteer methods might throw errors if they are unable to fulfill a request.
 * For example, `page.waitForSelector(selector[, options])` might fail if the
 * selector doesn't match any nodes during the given timeframe.
 *
 * For certain types of errors Puppeteer uses specific error classes. These
 * classes are available via `puppeteer.errors`.
 *
 * @example
 * An example of handling a timeout error:
 *
 * ```ts
 * try {
 *   await page.waitForSelector('.foo');
 * } catch (e) {
 *   if (e instanceof TimeoutError) {
 *     // Do something if this is a timeout.
 *   }
 * }
 * ```
 *
 * @public
 */
const errors = Object.freeze({
    TimeoutError,
    ProtocolError,
});

var __classPrivateFieldSet$D = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$G = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Connection_instances$1, _Connection_url, _Connection_transport$1, _Connection_delay$1, _Connection_lastId$1, _Connection_sessions, _Connection_closed$1, _Connection_callbacks$1, _Connection_manuallyAttached, _Connection_onClose$1, _CDPSessionImpl_sessionId, _CDPSessionImpl_targetType, _CDPSessionImpl_callbacks, _CDPSessionImpl_connection;
const debugProtocolSend$1 = debug('puppeteer:protocol:SEND ►');
const debugProtocolReceive$1 = debug('puppeteer:protocol:RECV ◀');
/**
 * Internal events that the Connection class emits.
 *
 * @internal
 */
const ConnectionEmittedEvents = {
    Disconnected: Symbol('Connection.Disconnected'),
};
/**
 * @public
 */
let Connection$1 = class Connection extends EventEmitter {
    constructor(url, transport, delay = 0) {
        super();
        _Connection_instances$1.add(this);
        _Connection_url.set(this, void 0);
        _Connection_transport$1.set(this, void 0);
        _Connection_delay$1.set(this, void 0);
        _Connection_lastId$1.set(this, 0);
        _Connection_sessions.set(this, new Map());
        _Connection_closed$1.set(this, false);
        _Connection_callbacks$1.set(this, new Map());
        _Connection_manuallyAttached.set(this, new Set());
        __classPrivateFieldSet$D(this, _Connection_url, url, "f");
        __classPrivateFieldSet$D(this, _Connection_delay$1, delay, "f");
        __classPrivateFieldSet$D(this, _Connection_transport$1, transport, "f");
        __classPrivateFieldGet$G(this, _Connection_transport$1, "f").onmessage = this.onMessage.bind(this);
        __classPrivateFieldGet$G(this, _Connection_transport$1, "f").onclose = __classPrivateFieldGet$G(this, _Connection_instances$1, "m", _Connection_onClose$1).bind(this);
    }
    static fromSession(session) {
        return session.connection();
    }
    /**
     * @internal
     */
    get _closed() {
        return __classPrivateFieldGet$G(this, _Connection_closed$1, "f");
    }
    /**
     * @internal
     */
    get _sessions() {
        return __classPrivateFieldGet$G(this, _Connection_sessions, "f");
    }
    /**
     * @param sessionId - The session id
     * @returns The current CDP session if it exists
     */
    session(sessionId) {
        return __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(sessionId) || null;
    }
    url() {
        return __classPrivateFieldGet$G(this, _Connection_url, "f");
    }
    send(method, ...paramArgs) {
        // There is only ever 1 param arg passed, but the Protocol defines it as an
        // array of 0 or 1 items See this comment:
        // https://github.com/ChromeDevTools/devtools-protocol/pull/113#issuecomment-412603285
        // which explains why the protocol defines the params this way for better
        // type-inference.
        // So now we check if there are any params or not and deal with them accordingly.
        const params = paramArgs.length ? paramArgs[0] : undefined;
        const id = this._rawSend({ method, params });
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet$G(this, _Connection_callbacks$1, "f").set(id, {
                resolve,
                reject,
                error: new ProtocolError(),
                method,
            });
        });
    }
    /**
     * @internal
     */
    _rawSend(message) {
        var _a;
        const id = __classPrivateFieldSet$D(this, _Connection_lastId$1, (_a = __classPrivateFieldGet$G(this, _Connection_lastId$1, "f"), ++_a), "f");
        const stringifiedMessage = JSON.stringify(Object.assign({}, message, { id }));
        debugProtocolSend$1(stringifiedMessage);
        __classPrivateFieldGet$G(this, _Connection_transport$1, "f").send(stringifiedMessage);
        return id;
    }
    /**
     * @internal
     */
    async onMessage(message) {
        if (__classPrivateFieldGet$G(this, _Connection_delay$1, "f")) {
            await new Promise(f => {
                return setTimeout(f, __classPrivateFieldGet$G(this, _Connection_delay$1, "f"));
            });
        }
        debugProtocolReceive$1(message);
        const object = JSON.parse(message);
        if (object.method === 'Target.attachedToTarget') {
            const sessionId = object.params.sessionId;
            const session = new CDPSessionImpl(this, object.params.targetInfo.type, sessionId);
            __classPrivateFieldGet$G(this, _Connection_sessions, "f").set(sessionId, session);
            this.emit('sessionattached', session);
            const parentSession = __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(object.sessionId);
            if (parentSession) {
                parentSession.emit('sessionattached', session);
            }
        }
        else if (object.method === 'Target.detachedFromTarget') {
            const session = __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(object.params.sessionId);
            if (session) {
                session._onClosed();
                __classPrivateFieldGet$G(this, _Connection_sessions, "f").delete(object.params.sessionId);
                this.emit('sessiondetached', session);
                const parentSession = __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(object.sessionId);
                if (parentSession) {
                    parentSession.emit('sessiondetached', session);
                }
            }
        }
        if (object.sessionId) {
            const session = __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(object.sessionId);
            if (session) {
                session._onMessage(object);
            }
        }
        else if (object.id) {
            const callback = __classPrivateFieldGet$G(this, _Connection_callbacks$1, "f").get(object.id);
            // Callbacks could be all rejected if someone has called `.dispose()`.
            if (callback) {
                __classPrivateFieldGet$G(this, _Connection_callbacks$1, "f").delete(object.id);
                if (object.error) {
                    callback.reject(createProtocolError$1(callback.error, callback.method, object));
                }
                else {
                    callback.resolve(object.result);
                }
            }
        }
        else {
            this.emit(object.method, object.params);
        }
    }
    dispose() {
        __classPrivateFieldGet$G(this, _Connection_instances$1, "m", _Connection_onClose$1).call(this);
        __classPrivateFieldGet$G(this, _Connection_transport$1, "f").close();
    }
    /**
     * @internal
     */
    isAutoAttached(targetId) {
        return !__classPrivateFieldGet$G(this, _Connection_manuallyAttached, "f").has(targetId);
    }
    /**
     * @internal
     */
    async _createSession(targetInfo, isAutoAttachEmulated = true) {
        if (!isAutoAttachEmulated) {
            __classPrivateFieldGet$G(this, _Connection_manuallyAttached, "f").add(targetInfo.targetId);
        }
        const { sessionId } = await this.send('Target.attachToTarget', {
            targetId: targetInfo.targetId,
            flatten: true,
        });
        __classPrivateFieldGet$G(this, _Connection_manuallyAttached, "f").delete(targetInfo.targetId);
        const session = __classPrivateFieldGet$G(this, _Connection_sessions, "f").get(sessionId);
        if (!session) {
            throw new Error('CDPSession creation failed.');
        }
        return session;
    }
    /**
     * @param targetInfo - The target info
     * @returns The CDP session that is created
     */
    async createSession(targetInfo) {
        return await this._createSession(targetInfo, false);
    }
};
_Connection_url = new WeakMap(), _Connection_transport$1 = new WeakMap(), _Connection_delay$1 = new WeakMap(), _Connection_lastId$1 = new WeakMap(), _Connection_sessions = new WeakMap(), _Connection_closed$1 = new WeakMap(), _Connection_callbacks$1 = new WeakMap(), _Connection_manuallyAttached = new WeakMap(), _Connection_instances$1 = new WeakSet(), _Connection_onClose$1 = function _Connection_onClose() {
    if (__classPrivateFieldGet$G(this, _Connection_closed$1, "f")) {
        return;
    }
    __classPrivateFieldSet$D(this, _Connection_closed$1, true, "f");
    __classPrivateFieldGet$G(this, _Connection_transport$1, "f").onmessage = undefined;
    __classPrivateFieldGet$G(this, _Connection_transport$1, "f").onclose = undefined;
    for (const callback of __classPrivateFieldGet$G(this, _Connection_callbacks$1, "f").values()) {
        callback.reject(rewriteError$2(callback.error, `Protocol error (${callback.method}): Target closed.`));
    }
    __classPrivateFieldGet$G(this, _Connection_callbacks$1, "f").clear();
    for (const session of __classPrivateFieldGet$G(this, _Connection_sessions, "f").values()) {
        session._onClosed();
    }
    __classPrivateFieldGet$G(this, _Connection_sessions, "f").clear();
    this.emit(ConnectionEmittedEvents.Disconnected);
};
/**
 * Internal events that the CDPSession class emits.
 *
 * @internal
 */
const CDPSessionEmittedEvents = {
    Disconnected: Symbol('CDPSession.Disconnected'),
};
/**
 * The `CDPSession` instances are used to talk raw Chrome Devtools Protocol.
 *
 * @remarks
 *
 * Protocol methods can be called with {@link CDPSession.send} method and protocol
 * events can be subscribed to with `CDPSession.on` method.
 *
 * Useful links: {@link https://chromedevtools.github.io/devtools-protocol/ | DevTools Protocol Viewer}
 * and {@link https://github.com/aslushnikov/getting-started-with-cdp/blob/HEAD/README.md | Getting Started with DevTools Protocol}.
 *
 * @example
 *
 * ```ts
 * const client = await page.target().createCDPSession();
 * await client.send('Animation.enable');
 * client.on('Animation.animationCreated', () =>
 *   console.log('Animation created!')
 * );
 * const response = await client.send('Animation.getPlaybackRate');
 * console.log('playback rate is ' + response.playbackRate);
 * await client.send('Animation.setPlaybackRate', {
 *   playbackRate: response.playbackRate / 2,
 * });
 * ```
 *
 * @public
 */
class CDPSession extends EventEmitter {
    /**
     * @internal
     */
    constructor() {
        super();
    }
    connection() {
        throw new Error('Not implemented');
    }
    send() {
        throw new Error('Not implemented');
    }
    /**
     * Detaches the cdpSession from the target. Once detached, the cdpSession object
     * won't emit any events and can't be used to send messages.
     */
    async detach() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the session's id.
     */
    id() {
        throw new Error('Not implemented');
    }
}
/**
 * @internal
 */
class CDPSessionImpl extends CDPSession {
    /**
     * @internal
     */
    constructor(connection, targetType, sessionId) {
        super();
        _CDPSessionImpl_sessionId.set(this, void 0);
        _CDPSessionImpl_targetType.set(this, void 0);
        _CDPSessionImpl_callbacks.set(this, new Map());
        _CDPSessionImpl_connection.set(this, void 0);
        __classPrivateFieldSet$D(this, _CDPSessionImpl_connection, connection, "f");
        __classPrivateFieldSet$D(this, _CDPSessionImpl_targetType, targetType, "f");
        __classPrivateFieldSet$D(this, _CDPSessionImpl_sessionId, sessionId, "f");
    }
    connection() {
        return __classPrivateFieldGet$G(this, _CDPSessionImpl_connection, "f");
    }
    send(method, ...paramArgs) {
        if (!__classPrivateFieldGet$G(this, _CDPSessionImpl_connection, "f")) {
            return Promise.reject(new Error(`Protocol error (${method}): Session closed. Most likely the ${__classPrivateFieldGet$G(this, _CDPSessionImpl_targetType, "f")} has been closed.`));
        }
        // See the comment in Connection#send explaining why we do this.
        const params = paramArgs.length ? paramArgs[0] : undefined;
        const id = __classPrivateFieldGet$G(this, _CDPSessionImpl_connection, "f")._rawSend({
            sessionId: __classPrivateFieldGet$G(this, _CDPSessionImpl_sessionId, "f"),
            method,
            params,
        });
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet$G(this, _CDPSessionImpl_callbacks, "f").set(id, {
                resolve,
                reject,
                error: new ProtocolError(),
                method,
            });
        });
    }
    /**
     * @internal
     */
    _onMessage(object) {
        const callback = object.id ? __classPrivateFieldGet$G(this, _CDPSessionImpl_callbacks, "f").get(object.id) : undefined;
        if (object.id && callback) {
            __classPrivateFieldGet$G(this, _CDPSessionImpl_callbacks, "f").delete(object.id);
            if (object.error) {
                callback.reject(createProtocolError$1(callback.error, callback.method, object));
            }
            else {
                callback.resolve(object.result);
            }
        }
        else {
            assert(!object.id);
            this.emit(object.method, object.params);
        }
    }
    /**
     * Detaches the cdpSession from the target. Once detached, the cdpSession object
     * won't emit any events and can't be used to send messages.
     */
    async detach() {
        if (!__classPrivateFieldGet$G(this, _CDPSessionImpl_connection, "f")) {
            throw new Error(`Session already detached. Most likely the ${__classPrivateFieldGet$G(this, _CDPSessionImpl_targetType, "f")} has been closed.`);
        }
        await __classPrivateFieldGet$G(this, _CDPSessionImpl_connection, "f").send('Target.detachFromTarget', {
            sessionId: __classPrivateFieldGet$G(this, _CDPSessionImpl_sessionId, "f"),
        });
    }
    /**
     * @internal
     */
    _onClosed() {
        for (const callback of __classPrivateFieldGet$G(this, _CDPSessionImpl_callbacks, "f").values()) {
            callback.reject(rewriteError$2(callback.error, `Protocol error (${callback.method}): Target closed.`));
        }
        __classPrivateFieldGet$G(this, _CDPSessionImpl_callbacks, "f").clear();
        __classPrivateFieldSet$D(this, _CDPSessionImpl_connection, undefined, "f");
        this.emit(CDPSessionEmittedEvents.Disconnected);
    }
    /**
     * Returns the session's id.
     */
    id() {
        return __classPrivateFieldGet$G(this, _CDPSessionImpl_sessionId, "f");
    }
}
_CDPSessionImpl_sessionId = new WeakMap(), _CDPSessionImpl_targetType = new WeakMap(), _CDPSessionImpl_callbacks = new WeakMap(), _CDPSessionImpl_connection = new WeakMap();
function createProtocolError$1(error, method, object) {
    let message = `Protocol error (${method}): ${object.error.message}`;
    if ('data' in object.error) {
        message += ` ${object.error.data}`;
    }
    return rewriteError$2(error, message, object.error.message);
}
function rewriteError$2(error, message, originalMessage) {
    error.message = message;
    error.originalMessage = originalMessage !== null && originalMessage !== void 0 ? originalMessage : error.originalMessage;
    return error;
}
/**
 * @internal
 */
function isTargetClosedError(err) {
    return (err.message.includes('Target closed') ||
        err.message.includes('Session closed'));
}

/**
 * @internal
 */
/**
 * @internal
 */
function isErrorLike(obj) {
    return (typeof obj === 'object' && obj !== null && 'name' in obj && 'message' in obj);
}
/**
 * @internal
 */
function isErrnoException(obj) {
    return (isErrorLike(obj) &&
        ('errno' in obj || 'code' in obj || 'path' in obj || 'syscall' in obj));
}

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$C = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$F = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JSHandle_disposed, _JSHandle_context, _JSHandle_remoteObject;
/**
 * Represents a reference to a JavaScript object. Instances can be created using
 * {@link Page.evaluateHandle}.
 *
 * Handles prevent the referenced JavaScript object from being garbage-collected
 * unless the handle is purposely {@link JSHandle.dispose | disposed}. JSHandles
 * are auto-disposed when their associated frame is navigated away or the parent
 * context gets destroyed.
 *
 * Handles can be used as arguments for any evaluation function such as
 * {@link Page.$eval}, {@link Page.evaluate}, and {@link Page.evaluateHandle}.
 * They are resolved to their referenced object.
 *
 * @example
 *
 * ```ts
 * const windowHandle = await page.evaluateHandle(() => window);
 * ```
 *
 * @public
 */
class JSHandle {
    /**
     * @internal
     */
    constructor(context, remoteObject) {
        _JSHandle_disposed.set(this, false);
        _JSHandle_context.set(this, void 0);
        _JSHandle_remoteObject.set(this, void 0);
        __classPrivateFieldSet$C(this, _JSHandle_context, context, "f");
        __classPrivateFieldSet$C(this, _JSHandle_remoteObject, remoteObject, "f");
    }
    /**
     * @internal
     */
    get client() {
        return __classPrivateFieldGet$F(this, _JSHandle_context, "f")._client;
    }
    /**
     * @internal
     */
    get disposed() {
        return __classPrivateFieldGet$F(this, _JSHandle_disposed, "f");
    }
    /**
     * @internal
     */
    executionContext() {
        return __classPrivateFieldGet$F(this, _JSHandle_context, "f");
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     *
     * @see {@link ExecutionContext.evaluate} for more details.
     */
    async evaluate(pageFunction, ...args) {
        return await this.executionContext().evaluate(pageFunction, this, ...args);
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     *
     * @see {@link ExecutionContext.evaluateHandle} for more details.
     */
    async evaluateHandle(pageFunction, ...args) {
        return await this.executionContext().evaluateHandle(pageFunction, this, ...args);
    }
    async getProperty(propertyName) {
        return this.evaluateHandle((object, propertyName) => {
            return object[propertyName];
        }, propertyName);
    }
    /**
     * Gets a map of handles representing the properties of the current handle.
     *
     * @example
     *
     * ```ts
     * const listHandle = await page.evaluateHandle(() => document.body.children);
     * const properties = await listHandle.getProperties();
     * const children = [];
     * for (const property of properties.values()) {
     *   const element = property.asElement();
     *   if (element) {
     *     children.push(element);
     *   }
     * }
     * children; // holds elementHandles to all children of document.body
     * ```
     */
    async getProperties() {
        assert(__classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").objectId);
        // We use Runtime.getProperties rather than iterative building because the
        // iterative approach might create a distorted snapshot.
        const response = await this.client.send('Runtime.getProperties', {
            objectId: __classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").objectId,
            ownProperties: true,
        });
        const result = new Map();
        for (const property of response.result) {
            if (!property.enumerable || !property.value) {
                continue;
            }
            result.set(property.name, createJSHandle(__classPrivateFieldGet$F(this, _JSHandle_context, "f"), property.value));
        }
        return result;
    }
    /**
     * @returns A vanilla object representing the serializable portions of the
     * referenced object.
     * @throws Throws if the object cannot be serialized due to circularity.
     *
     * @remarks
     * If the object has a `toJSON` function, it **will not** be called.
     */
    async jsonValue() {
        if (!__classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").objectId) {
            return valueFromRemoteObject(__classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f"));
        }
        const value = await this.evaluate(object => {
            return object;
        });
        if (value === undefined) {
            throw new Error('Could not serialize referenced object');
        }
        return value;
    }
    /**
     * @returns Either `null` or the handle itself if the handle is an
     * instance of {@link ElementHandle}.
     */
    asElement() {
        return null;
    }
    /**
     * Releases the object referenced by the handle for garbage collection.
     */
    async dispose() {
        if (__classPrivateFieldGet$F(this, _JSHandle_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet$C(this, _JSHandle_disposed, true, "f");
        await releaseObject(this.client, __classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f"));
    }
    /**
     * Returns a string representation of the JSHandle.
     *
     * @remarks
     * Useful during debugging.
     */
    toString() {
        if (!__classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").objectId) {
            return 'JSHandle:' + valueFromRemoteObject(__classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f"));
        }
        const type = __classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").subtype || __classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f").type;
        return 'JSHandle@' + type;
    }
    /**
     * Provides access to the
     * [Protocol.Runtime.RemoteObject](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObject)
     * backing this handle.
     */
    remoteObject() {
        return __classPrivateFieldGet$F(this, _JSHandle_remoteObject, "f");
    }
}
_JSHandle_disposed = new WeakMap(), _JSHandle_context = new WeakMap(), _JSHandle_remoteObject = new WeakMap();

/**
 * CommonJS JavaScript code that provides the puppeteer utilities. See the
 * [README](https://github.com/puppeteer/puppeteer/blob/main/src/injected/README.md)
 * for injection for more information.
 *
 * @internal
 */
const source = "\"use strict\";\nvar __defProp = Object.defineProperty;\nvar __getOwnPropDesc = Object.getOwnPropertyDescriptor;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __export = (target, all) => {\n  for (var name in all)\n    __defProp(target, name, { get: all[name], enumerable: true });\n};\nvar __copyProps = (to, from, except, desc) => {\n  if (from && typeof from === \"object\" || typeof from === \"function\") {\n    for (let key of __getOwnPropNames(from))\n      if (!__hasOwnProp.call(to, key) && key !== except)\n        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });\n  }\n  return to;\n};\nvar __toCommonJS = (mod) => __copyProps(__defProp({}, \"__esModule\", { value: true }), mod);\n\n// src/injected/injected.ts\nvar injected_exports = {};\n__export(injected_exports, {\n  default: () => injected_default\n});\nmodule.exports = __toCommonJS(injected_exports);\n\n// src/common/Errors.ts\nvar CustomError = class extends Error {\n  constructor(message) {\n    super(message);\n    this.name = this.constructor.name;\n    Error.captureStackTrace(this, this.constructor);\n  }\n};\nvar TimeoutError = class extends CustomError {\n};\nvar ProtocolError = class extends CustomError {\n  #code;\n  #originalMessage = \"\";\n  set code(code) {\n    this.#code = code;\n  }\n  get code() {\n    return this.#code;\n  }\n  set originalMessage(originalMessage) {\n    this.#originalMessage = originalMessage;\n  }\n  get originalMessage() {\n    return this.#originalMessage;\n  }\n};\nvar errors = Object.freeze({\n  TimeoutError,\n  ProtocolError\n});\n\n// src/util/DeferredPromise.ts\nfunction createDeferredPromise(opts) {\n  let isResolved = false;\n  let isRejected = false;\n  let resolver;\n  let rejector;\n  const taskPromise = new Promise((resolve, reject) => {\n    resolver = resolve;\n    rejector = reject;\n  });\n  const timeoutId = opts && opts.timeout > 0 ? setTimeout(() => {\n    isRejected = true;\n    rejector(new TimeoutError(opts.message));\n  }, opts.timeout) : void 0;\n  return Object.assign(taskPromise, {\n    resolved: () => {\n      return isResolved;\n    },\n    finished: () => {\n      return isResolved || isRejected;\n    },\n    resolve: (value) => {\n      if (timeoutId) {\n        clearTimeout(timeoutId);\n      }\n      isResolved = true;\n      resolver(value);\n    },\n    reject: (err) => {\n      clearTimeout(timeoutId);\n      isRejected = true;\n      rejector(err);\n    }\n  });\n}\n\n// src/util/assert.ts\nvar assert = (value, message) => {\n  if (!value) {\n    throw new Error(message);\n  }\n};\n\n// src/injected/Poller.ts\nvar MutationPoller = class {\n  #fn;\n  #root;\n  #observer;\n  #promise;\n  constructor(fn, root) {\n    this.#fn = fn;\n    this.#root = root;\n  }\n  async start() {\n    const promise = this.#promise = createDeferredPromise();\n    const result = await this.#fn();\n    if (result) {\n      promise.resolve(result);\n      return;\n    }\n    this.#observer = new MutationObserver(async () => {\n      const result2 = await this.#fn();\n      if (!result2) {\n        return;\n      }\n      promise.resolve(result2);\n      await this.stop();\n    });\n    this.#observer.observe(this.#root, {\n      childList: true,\n      subtree: true,\n      attributes: true\n    });\n  }\n  async stop() {\n    assert(this.#promise, \"Polling never started.\");\n    if (!this.#promise.finished()) {\n      this.#promise.reject(new Error(\"Polling stopped\"));\n    }\n    if (this.#observer) {\n      this.#observer.disconnect();\n      this.#observer = void 0;\n    }\n  }\n  result() {\n    assert(this.#promise, \"Polling never started.\");\n    return this.#promise;\n  }\n};\nvar RAFPoller = class {\n  #fn;\n  #promise;\n  constructor(fn) {\n    this.#fn = fn;\n  }\n  async start() {\n    const promise = this.#promise = createDeferredPromise();\n    const result = await this.#fn();\n    if (result) {\n      promise.resolve(result);\n      return;\n    }\n    const poll = async () => {\n      if (promise.finished()) {\n        return;\n      }\n      const result2 = await this.#fn();\n      if (!result2) {\n        window.requestAnimationFrame(poll);\n        return;\n      }\n      promise.resolve(result2);\n      await this.stop();\n    };\n    window.requestAnimationFrame(poll);\n  }\n  async stop() {\n    assert(this.#promise, \"Polling never started.\");\n    if (!this.#promise.finished()) {\n      this.#promise.reject(new Error(\"Polling stopped\"));\n    }\n  }\n  result() {\n    assert(this.#promise, \"Polling never started.\");\n    return this.#promise;\n  }\n};\nvar IntervalPoller = class {\n  #fn;\n  #ms;\n  #interval;\n  #promise;\n  constructor(fn, ms) {\n    this.#fn = fn;\n    this.#ms = ms;\n  }\n  async start() {\n    const promise = this.#promise = createDeferredPromise();\n    const result = await this.#fn();\n    if (result) {\n      promise.resolve(result);\n      return;\n    }\n    this.#interval = setInterval(async () => {\n      const result2 = await this.#fn();\n      if (!result2) {\n        return;\n      }\n      promise.resolve(result2);\n      await this.stop();\n    }, this.#ms);\n  }\n  async stop() {\n    assert(this.#promise, \"Polling never started.\");\n    if (!this.#promise.finished()) {\n      this.#promise.reject(new Error(\"Polling stopped\"));\n    }\n    if (this.#interval) {\n      clearInterval(this.#interval);\n      this.#interval = void 0;\n    }\n  }\n  result() {\n    assert(this.#promise, \"Polling never started.\");\n    return this.#promise;\n  }\n};\n\n// src/injected/TextContent.ts\nvar TRIVIAL_VALUE_INPUT_TYPES = /* @__PURE__ */ new Set([\"checkbox\", \"image\", \"radio\"]);\nvar isNonTrivialValueNode = (node) => {\n  if (node instanceof HTMLSelectElement) {\n    return true;\n  }\n  if (node instanceof HTMLTextAreaElement) {\n    return true;\n  }\n  if (node instanceof HTMLInputElement && !TRIVIAL_VALUE_INPUT_TYPES.has(node.type)) {\n    return true;\n  }\n  return false;\n};\nvar UNSUITABLE_NODE_NAMES = /* @__PURE__ */ new Set([\"SCRIPT\", \"STYLE\"]);\nvar isSuitableNodeForTextMatching = (node) => {\n  return !UNSUITABLE_NODE_NAMES.has(node.nodeName) && !document.head?.contains(node);\n};\nvar textContentCache = /* @__PURE__ */ new WeakMap();\nvar eraseFromCache = (node) => {\n  while (node) {\n    textContentCache.delete(node);\n    if (node instanceof ShadowRoot) {\n      node = node.host;\n    } else {\n      node = node.parentNode;\n    }\n  }\n};\nvar observedNodes = /* @__PURE__ */ new WeakSet();\nvar textChangeObserver = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    eraseFromCache(mutation.target);\n  }\n});\nvar createTextContent = (root) => {\n  let value = textContentCache.get(root);\n  if (value) {\n    return value;\n  }\n  value = { full: \"\", immediate: [] };\n  if (!isSuitableNodeForTextMatching(root)) {\n    return value;\n  }\n  let currentImmediate = \"\";\n  if (isNonTrivialValueNode(root)) {\n    value.full = root.value;\n    value.immediate.push(root.value);\n    root.addEventListener(\n      \"input\",\n      (event) => {\n        eraseFromCache(event.target);\n      },\n      { once: true, capture: true }\n    );\n  } else {\n    for (let child = root.firstChild; child; child = child.nextSibling) {\n      if (child.nodeType === Node.TEXT_NODE) {\n        value.full += child.nodeValue ?? \"\";\n        currentImmediate += child.nodeValue ?? \"\";\n        continue;\n      }\n      if (currentImmediate) {\n        value.immediate.push(currentImmediate);\n      }\n      currentImmediate = \"\";\n      if (child.nodeType === Node.ELEMENT_NODE) {\n        value.full += createTextContent(child).full;\n      }\n    }\n    if (currentImmediate) {\n      value.immediate.push(currentImmediate);\n    }\n    if (root instanceof Element && root.shadowRoot) {\n      value.full += createTextContent(root.shadowRoot).full;\n    }\n    if (!observedNodes.has(root)) {\n      textChangeObserver.observe(root, {\n        childList: true,\n        characterData: true\n      });\n      observedNodes.add(root);\n    }\n  }\n  textContentCache.set(root, value);\n  return value;\n};\n\n// src/injected/TextQuerySelector.ts\nvar TextQuerySelector_exports = {};\n__export(TextQuerySelector_exports, {\n  textQuerySelector: () => textQuerySelector,\n  textQuerySelectorAll: () => textQuerySelectorAll\n});\nvar textQuerySelector = (root, selector) => {\n  for (const node of root.childNodes) {\n    if (node instanceof Element && isSuitableNodeForTextMatching(node)) {\n      let matchedNode;\n      if (node.shadowRoot) {\n        matchedNode = textQuerySelector(node.shadowRoot, selector);\n      } else {\n        matchedNode = textQuerySelector(node, selector);\n      }\n      if (matchedNode) {\n        return matchedNode;\n      }\n    }\n  }\n  if (root instanceof Element) {\n    const textContent = createTextContent(root);\n    if (textContent.full.includes(selector)) {\n      return root;\n    }\n  }\n  return null;\n};\nvar textQuerySelectorAll = (root, selector) => {\n  let results = [];\n  for (const node of root.childNodes) {\n    if (node instanceof Element) {\n      let matchedNodes;\n      if (node.shadowRoot) {\n        matchedNodes = textQuerySelectorAll(node.shadowRoot, selector);\n      } else {\n        matchedNodes = textQuerySelectorAll(node, selector);\n      }\n      results = results.concat(matchedNodes);\n    }\n  }\n  if (results.length > 0) {\n    return results;\n  }\n  if (root instanceof Element) {\n    const textContent = createTextContent(root);\n    if (textContent.full.includes(selector)) {\n      return [root];\n    }\n  }\n  return [];\n};\n\n// src/injected/XPathQuerySelector.ts\nvar XPathQuerySelector_exports = {};\n__export(XPathQuerySelector_exports, {\n  xpathQuerySelector: () => xpathQuerySelector,\n  xpathQuerySelectorAll: () => xpathQuerySelectorAll\n});\nvar xpathQuerySelector = (root, selector) => {\n  const doc = root.ownerDocument || document;\n  const result = doc.evaluate(\n    selector,\n    root,\n    null,\n    XPathResult.FIRST_ORDERED_NODE_TYPE\n  );\n  return result.singleNodeValue;\n};\nvar xpathQuerySelectorAll = (root, selector) => {\n  const doc = root.ownerDocument || document;\n  const iterator = doc.evaluate(\n    selector,\n    root,\n    null,\n    XPathResult.ORDERED_NODE_ITERATOR_TYPE\n  );\n  const array = [];\n  let item;\n  while (item = iterator.iterateNext()) {\n    array.push(item);\n  }\n  return array;\n};\n\n// src/injected/PierceQuerySelector.ts\nvar PierceQuerySelector_exports = {};\n__export(PierceQuerySelector_exports, {\n  pierceQuerySelector: () => pierceQuerySelector,\n  pierceQuerySelectorAll: () => pierceQuerySelectorAll\n});\nvar pierceQuerySelector = (root, selector) => {\n  let found = null;\n  const search = (root2) => {\n    const iter = document.createTreeWalker(root2, NodeFilter.SHOW_ELEMENT);\n    do {\n      const currentNode = iter.currentNode;\n      if (currentNode.shadowRoot) {\n        search(currentNode.shadowRoot);\n      }\n      if (currentNode instanceof ShadowRoot) {\n        continue;\n      }\n      if (currentNode !== root2 && !found && currentNode.matches(selector)) {\n        found = currentNode;\n      }\n    } while (!found && iter.nextNode());\n  };\n  if (root instanceof Document) {\n    root = root.documentElement;\n  }\n  search(root);\n  return found;\n};\nvar pierceQuerySelectorAll = (element, selector) => {\n  const result = [];\n  const collect = (root) => {\n    const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);\n    do {\n      const currentNode = iter.currentNode;\n      if (currentNode.shadowRoot) {\n        collect(currentNode.shadowRoot);\n      }\n      if (currentNode instanceof ShadowRoot) {\n        continue;\n      }\n      if (currentNode !== root && currentNode.matches(selector)) {\n        result.push(currentNode);\n      }\n    } while (iter.nextNode());\n  };\n  if (element instanceof Document) {\n    element = element.documentElement;\n  }\n  collect(element);\n  return result;\n};\n\n// src/injected/util.ts\nvar util_exports = {};\n__export(util_exports, {\n  checkVisibility: () => checkVisibility,\n  createFunction: () => createFunction\n});\nvar createdFunctions = /* @__PURE__ */ new Map();\nvar createFunction = (functionValue) => {\n  let fn = createdFunctions.get(functionValue);\n  if (fn) {\n    return fn;\n  }\n  fn = new Function(`return ${functionValue}`)();\n  createdFunctions.set(functionValue, fn);\n  return fn;\n};\nvar HIDDEN_VISIBILITY_VALUES = [\"hidden\", \"collapse\"];\nvar checkVisibility = (node, visible) => {\n  if (!node) {\n    return visible === false;\n  }\n  if (visible === void 0) {\n    return node;\n  }\n  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;\n  const style = window.getComputedStyle(element);\n  const isVisible = style && !HIDDEN_VISIBILITY_VALUES.includes(style.visibility) && !isBoundingBoxEmpty(element);\n  return visible === isVisible ? node : false;\n};\nfunction isBoundingBoxEmpty(element) {\n  const rect = element.getBoundingClientRect();\n  return rect.width === 0 || rect.height === 0;\n}\n\n// src/injected/injected.ts\nvar PuppeteerUtil = Object.freeze({\n  ...util_exports,\n  ...TextQuerySelector_exports,\n  ...XPathQuerySelector_exports,\n  ...PierceQuerySelector_exports,\n  createDeferredPromise,\n  createTextContent,\n  IntervalPoller,\n  isSuitableNodeForTextMatching,\n  MutationPoller,\n  RAFPoller\n});\nvar injected_default = PuppeteerUtil;\n";

/**
 * Creates and returns a promise along with the resolve/reject functions.
 *
 * If the promise has not been resolved/rejected within the `timeout` period,
 * the promise gets rejected with a timeout error. `timeout` has to be greater than 0 or
 * it is ignored.
 *
 * @internal
 */
function createDeferredPromise(opts) {
    let isResolved = false;
    let isRejected = false;
    let resolver;
    let rejector;
    const taskPromise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    });
    const timeoutId = opts && opts.timeout > 0
        ? setTimeout(() => {
            isRejected = true;
            rejector(new TimeoutError(opts.message));
        }, opts.timeout)
        : undefined;
    return Object.assign(taskPromise, {
        resolved: () => {
            return isResolved;
        },
        finished: () => {
            return isResolved || isRejected;
        },
        resolve: (value) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            isResolved = true;
            resolver(value);
        },
        reject: (err) => {
            clearTimeout(timeoutId);
            isRejected = true;
            rejector(err);
        },
    });
}

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$B = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$E = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LazyArg_get;
/**
 * @internal
 */
class LazyArg {
    constructor(get) {
        _LazyArg_get.set(this, void 0);
        __classPrivateFieldSet$B(this, _LazyArg_get, get, "f");
    }
    get() {
        return __classPrivateFieldGet$E(this, _LazyArg_get, "f").call(this);
    }
}
_LazyArg_get = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldGet$D = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExecutionContext_instances, _ExecutionContext_evaluate;
/**
 * @public
 */
const EVALUATION_SCRIPT_URL = 'pptr://__puppeteer_evaluation_script__';
const SOURCE_URL_REGEX = /^[\040\t]*\/\/[@#] sourceURL=\s*(\S*?)\s*$/m;
/**
 * Represents a context for JavaScript execution.
 *
 * @example
 * A {@link Page} can have several execution contexts:
 *
 * - Each {@link Frame} of a {@link Page | page} has a "default" execution
 *   context that is always created after frame is attached to DOM. This context
 *   is returned by the {@link Frame.executionContext} method.
 * - Each {@link https://developer.chrome.com/extensions | Chrome extensions}
 *   creates additional execution contexts to isolate their code.
 *
 * @remarks
 * By definition, each context is isolated from one another, however they are
 * all able to manipulate non-JavaScript resources (such as DOM).
 *
 * @remarks
 * Besides pages, execution contexts can be found in
 * {@link WebWorker | workers}.
 *
 * @internal
 */
class ExecutionContext {
    /**
     * @internal
     */
    constructor(client, contextPayload, world) {
        _ExecutionContext_instances.add(this);
        this._client = client;
        this._world = world;
        this._contextId = contextPayload.id;
        this._contextName = contextPayload.name;
    }
    /**
     * Evaluates the given function.
     *
     * @example
     *
     * ```ts
     * const executionContext = await page.mainFrame().executionContext();
     * const result = await executionContext.evaluate(() => Promise.resolve(8 * 7))* ;
     * console.log(result); // prints "56"
     * ```
     *
     * @example
     * A string can also be passed in instead of a function:
     *
     * ```ts
     * console.log(await executionContext.evaluate('1 + 2')); // prints "3"
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const oneHandle = await executionContext.evaluateHandle(() => 1);
     * const twoHandle = await executionContext.evaluateHandle(() => 2);
     * const result = await executionContext.evaluate(
     *   (a, b) => a + b,
     *   oneHandle,
     *   twoHandle
     * );
     * await oneHandle.dispose();
     * await twoHandle.dispose();
     * console.log(result); // prints '3'.
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns The result of evaluating the function. If the result is an object,
     * a vanilla object containing the serializable properties of the result is
     * returned.
     */
    async evaluate(pageFunction, ...args) {
        return await __classPrivateFieldGet$D(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, true, pageFunction, ...args);
    }
    /**
     * Evaluates the given function.
     *
     * Unlike {@link ExecutionContext.evaluate | evaluate}, this method returns a
     * handle to the result of the function.
     *
     * This method may be better suited if the object cannot be serialized (e.g.
     * `Map`) and requires further manipulation.
     *
     * @example
     *
     * ```ts
     * const context = await page.mainFrame().executionContext();
     * const handle: JSHandle<typeof globalThis> = await context.evaluateHandle(
     *   () => Promise.resolve(self)
     * );
     * ```
     *
     * @example
     * A string can also be passed in instead of a function.
     *
     * ```ts
     * const handle: JSHandle<number> = await context.evaluateHandle('1 + 2');
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const bodyHandle: ElementHandle<HTMLBodyElement> =
     *   await context.evaluateHandle(() => {
     *     return document.body;
     *   });
     * const stringHandle: JSHandle<string> = await context.evaluateHandle(
     *   body => body.innerHTML,
     *   body
     * );
     * console.log(await stringHandle.jsonValue()); // prints body's innerHTML
     * // Always dispose your garbage! :)
     * await bodyHandle.dispose();
     * await stringHandle.dispose();
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns A {@link JSHandle | handle} to the result of evaluating the
     * function. If the result is a `Node`, then this will return an
     * {@link ElementHandle | element handle}.
     */
    async evaluateHandle(pageFunction, ...args) {
        return __classPrivateFieldGet$D(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, false, pageFunction, ...args);
    }
}
_ExecutionContext_instances = new WeakSet(), _ExecutionContext_evaluate = async function _ExecutionContext_evaluate(returnByValue, pageFunction, ...args) {
    const suffix = `//# sourceURL=${EVALUATION_SCRIPT_URL}`;
    if (isString(pageFunction)) {
        const contextId = this._contextId;
        const expression = pageFunction;
        const expressionWithSourceUrl = SOURCE_URL_REGEX.test(expression)
            ? expression
            : expression + '\n' + suffix;
        const { exceptionDetails, result: remoteObject } = await this._client
            .send('Runtime.evaluate', {
            expression: expressionWithSourceUrl,
            contextId,
            returnByValue,
            awaitPromise: true,
            userGesture: true,
        })
            .catch(rewriteError$1);
        if (exceptionDetails) {
            throw new Error('Evaluation failed: ' + getExceptionMessage(exceptionDetails));
        }
        return returnByValue
            ? valueFromRemoteObject(remoteObject)
            : createJSHandle(this, remoteObject);
    }
    let functionText = pageFunction.toString();
    try {
        new Function('(' + functionText + ')');
    }
    catch (error) {
        // This means we might have a function shorthand. Try another
        // time prefixing 'function '.
        if (functionText.startsWith('async ')) {
            functionText =
                'async function ' + functionText.substring('async '.length);
        }
        else {
            functionText = 'function ' + functionText;
        }
        try {
            new Function('(' + functionText + ')');
        }
        catch (error) {
            // We tried hard to serialize, but there's a weird beast here.
            throw new Error('Passed function is not well-serializable!');
        }
    }
    let callFunctionOnPromise;
    try {
        callFunctionOnPromise = this._client.send('Runtime.callFunctionOn', {
            functionDeclaration: functionText + '\n' + suffix + '\n',
            executionContextId: this._contextId,
            arguments: await Promise.all(args.map(convertArgument.bind(this))),
            returnByValue,
            awaitPromise: true,
            userGesture: true,
        });
    }
    catch (error) {
        if (error instanceof TypeError &&
            error.message.startsWith('Converting circular structure to JSON')) {
            error.message += ' Recursive objects are not allowed.';
        }
        throw error;
    }
    const { exceptionDetails, result: remoteObject } = await callFunctionOnPromise.catch(rewriteError$1);
    if (exceptionDetails) {
        throw new Error('Evaluation failed: ' + getExceptionMessage(exceptionDetails));
    }
    return returnByValue
        ? valueFromRemoteObject(remoteObject)
        : createJSHandle(this, remoteObject);
    async function convertArgument(arg) {
        if (arg instanceof LazyArg) {
            arg = await arg.get();
        }
        if (typeof arg === 'bigint') {
            // eslint-disable-line valid-typeof
            return { unserializableValue: `${arg.toString()}n` };
        }
        if (Object.is(arg, -0)) {
            return { unserializableValue: '-0' };
        }
        if (Object.is(arg, Infinity)) {
            return { unserializableValue: 'Infinity' };
        }
        if (Object.is(arg, -Infinity)) {
            return { unserializableValue: '-Infinity' };
        }
        if (Object.is(arg, NaN)) {
            return { unserializableValue: 'NaN' };
        }
        const objectHandle = arg && arg instanceof JSHandle ? arg : null;
        if (objectHandle) {
            if (objectHandle.executionContext() !== this) {
                throw new Error('JSHandles can be evaluated only in the context they were created!');
            }
            if (objectHandle.disposed) {
                throw new Error('JSHandle is disposed!');
            }
            if (objectHandle.remoteObject().unserializableValue) {
                return {
                    unserializableValue: objectHandle.remoteObject().unserializableValue,
                };
            }
            if (!objectHandle.remoteObject().objectId) {
                return { value: objectHandle.remoteObject().value };
            }
            return { objectId: objectHandle.remoteObject().objectId };
        }
        return { value: arg };
    }
};
const rewriteError$1 = (error) => {
    if (error.message.includes('Object reference chain is too long')) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.includes("Object couldn't be returned by value")) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.endsWith('Cannot find context with specified id') ||
        error.message.endsWith('Inspected target navigated or closed')) {
        throw new Error('Execution context was destroyed, most likely because of a navigation.');
    }
    throw error;
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldGet$C = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$A = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FrameTree_frames, _FrameTree_parentIds, _FrameTree_childIds, _FrameTree_mainFrame, _FrameTree_waitRequests;
/**
 * Keeps track of the page frame tree and it's is managed by
 * {@link FrameManager}. FrameTree uses frame IDs to reference frame and it
 * means that referenced frames might not be in the tree anymore. Thus, the tree
 * structure is eventually consistent.
 * @internal
 */
class FrameTree {
    constructor() {
        _FrameTree_frames.set(this, new Map());
        // frameID -> parentFrameID
        _FrameTree_parentIds.set(this, new Map());
        // frameID -> childFrameIDs
        _FrameTree_childIds.set(this, new Map());
        _FrameTree_mainFrame.set(this, void 0);
        _FrameTree_waitRequests.set(this, new Map());
    }
    getMainFrame() {
        return __classPrivateFieldGet$C(this, _FrameTree_mainFrame, "f");
    }
    getById(frameId) {
        return __classPrivateFieldGet$C(this, _FrameTree_frames, "f").get(frameId);
    }
    /**
     * Returns a promise that is resolved once the frame with
     * the given ID is added to the tree.
     */
    waitForFrame(frameId) {
        const frame = this.getById(frameId);
        if (frame) {
            return Promise.resolve(frame);
        }
        const deferred = createDeferredPromise();
        const callbacks = __classPrivateFieldGet$C(this, _FrameTree_waitRequests, "f").get(frameId) || new Set();
        callbacks.add(deferred);
        return deferred;
    }
    frames() {
        return Array.from(__classPrivateFieldGet$C(this, _FrameTree_frames, "f").values());
    }
    addFrame(frame) {
        var _a;
        __classPrivateFieldGet$C(this, _FrameTree_frames, "f").set(frame._id, frame);
        if (frame._parentId) {
            __classPrivateFieldGet$C(this, _FrameTree_parentIds, "f").set(frame._id, frame._parentId);
            if (!__classPrivateFieldGet$C(this, _FrameTree_childIds, "f").has(frame._parentId)) {
                __classPrivateFieldGet$C(this, _FrameTree_childIds, "f").set(frame._parentId, new Set());
            }
            __classPrivateFieldGet$C(this, _FrameTree_childIds, "f").get(frame._parentId).add(frame._id);
        }
        else {
            __classPrivateFieldSet$A(this, _FrameTree_mainFrame, frame, "f");
        }
        (_a = __classPrivateFieldGet$C(this, _FrameTree_waitRequests, "f").get(frame._id)) === null || _a === void 0 ? void 0 : _a.forEach(request => {
            return request.resolve(frame);
        });
    }
    removeFrame(frame) {
        var _a;
        __classPrivateFieldGet$C(this, _FrameTree_frames, "f").delete(frame._id);
        __classPrivateFieldGet$C(this, _FrameTree_parentIds, "f").delete(frame._id);
        if (frame._parentId) {
            (_a = __classPrivateFieldGet$C(this, _FrameTree_childIds, "f").get(frame._parentId)) === null || _a === void 0 ? void 0 : _a.delete(frame._id);
        }
        else {
            __classPrivateFieldSet$A(this, _FrameTree_mainFrame, undefined, "f");
        }
    }
    childFrames(frameId) {
        const childIds = __classPrivateFieldGet$C(this, _FrameTree_childIds, "f").get(frameId);
        if (!childIds) {
            return [];
        }
        return Array.from(childIds)
            .map(id => {
            return this.getById(id);
        })
            .filter((frame) => {
            return frame !== undefined;
        });
    }
    parentFrame(frameId) {
        const parentId = __classPrivateFieldGet$C(this, _FrameTree_parentIds, "f").get(frameId);
        return parentId ? this.getById(parentId) : undefined;
    }
}
_FrameTree_frames = new WeakMap(), _FrameTree_parentIds = new WeakMap(), _FrameTree_childIds = new WeakMap(), _FrameTree_mainFrame = new WeakMap(), _FrameTree_waitRequests = new WeakMap();

var __classPrivateFieldSet$z = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$B = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTTPRequest_instances, _HTTPRequest_client, _HTTPRequest_isNavigationRequest, _HTTPRequest_allowInterception, _HTTPRequest_interceptionHandled, _HTTPRequest_url, _HTTPRequest_resourceType, _HTTPRequest_method, _HTTPRequest_postData, _HTTPRequest_headers, _HTTPRequest_frame, _HTTPRequest_continueRequestOverrides, _HTTPRequest_responseForRequest, _HTTPRequest_abortErrorReason, _HTTPRequest_interceptResolutionState, _HTTPRequest_interceptHandlers, _HTTPRequest_initiator, _HTTPRequest_continue, _HTTPRequest_respond, _HTTPRequest_abort;
/**
 * The default cooperative request interception resolution priority
 *
 * @public
 */
const DEFAULT_INTERCEPT_RESOLUTION_PRIORITY = 0;
/**
 * Represents an HTTP request sent by a page.
 * @remarks
 *
 * Whenever the page sends a request, such as for a network resource, the
 * following events are emitted by Puppeteer's `page`:
 *
 * - `request`: emitted when the request is issued by the page.
 * - `requestfinished` - emitted when the response body is downloaded and the
 *   request is complete.
 *
 * If request fails at some point, then instead of `requestfinished` event the
 * `requestfailed` event is emitted.
 *
 * All of these events provide an instance of `HTTPRequest` representing the
 * request that occurred:
 *
 * ```
 * page.on('request', request => ...)
 * ```
 *
 * NOTE: HTTP Error responses, such as 404 or 503, are still successful
 * responses from HTTP standpoint, so request will complete with
 * `requestfinished` event.
 *
 * If request gets a 'redirect' response, the request is successfully finished
 * with the `requestfinished` event, and a new request is issued to a
 * redirected url.
 *
 * @public
 */
class HTTPRequest {
    /**
     * @internal
     */
    constructor(client, frame, interceptionId, allowInterception, event, redirectChain) {
        _HTTPRequest_instances.add(this);
        /**
         * @internal
         */
        this._failureText = null;
        /**
         * @internal
         */
        this._response = null;
        /**
         * @internal
         */
        this._fromMemoryCache = false;
        _HTTPRequest_client.set(this, void 0);
        _HTTPRequest_isNavigationRequest.set(this, void 0);
        _HTTPRequest_allowInterception.set(this, void 0);
        _HTTPRequest_interceptionHandled.set(this, false);
        _HTTPRequest_url.set(this, void 0);
        _HTTPRequest_resourceType.set(this, void 0);
        _HTTPRequest_method.set(this, void 0);
        _HTTPRequest_postData.set(this, void 0);
        _HTTPRequest_headers.set(this, {});
        _HTTPRequest_frame.set(this, void 0);
        _HTTPRequest_continueRequestOverrides.set(this, void 0);
        _HTTPRequest_responseForRequest.set(this, null);
        _HTTPRequest_abortErrorReason.set(this, null);
        _HTTPRequest_interceptResolutionState.set(this, {
            action: InterceptResolutionAction.None,
        });
        _HTTPRequest_interceptHandlers.set(this, void 0);
        _HTTPRequest_initiator.set(this, void 0);
        __classPrivateFieldSet$z(this, _HTTPRequest_client, client, "f");
        this._requestId = event.requestId;
        __classPrivateFieldSet$z(this, _HTTPRequest_isNavigationRequest, event.requestId === event.loaderId && event.type === 'Document', "f");
        this._interceptionId = interceptionId;
        __classPrivateFieldSet$z(this, _HTTPRequest_allowInterception, allowInterception, "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_url, event.request.url, "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_resourceType, (event.type || 'other').toLowerCase(), "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_method, event.request.method, "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_postData, event.request.postData, "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_frame, frame, "f");
        this._redirectChain = redirectChain;
        __classPrivateFieldSet$z(this, _HTTPRequest_continueRequestOverrides, {}, "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_interceptHandlers, [], "f");
        __classPrivateFieldSet$z(this, _HTTPRequest_initiator, event.initiator, "f");
        for (const [key, value] of Object.entries(event.request.headers)) {
            __classPrivateFieldGet$B(this, _HTTPRequest_headers, "f")[key.toLowerCase()] = value;
        }
    }
    /**
     * Warning! Using this client can break Puppeteer. Use with caution.
     *
     * @experimental
     */
    get client() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_client, "f");
    }
    /**
     * @returns the URL of the request
     */
    url() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_url, "f");
    }
    /**
     * @returns the `ContinueRequestOverrides` that will be used
     * if the interception is allowed to continue (ie, `abort()` and
     * `respond()` aren't called).
     */
    continueRequestOverrides() {
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$B(this, _HTTPRequest_continueRequestOverrides, "f");
    }
    /**
     * @returns The `ResponseForRequest` that gets used if the
     * interception is allowed to respond (ie, `abort()` is not called).
     */
    responseForRequest() {
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$B(this, _HTTPRequest_responseForRequest, "f");
    }
    /**
     * @returns the most recent reason for aborting the request
     */
    abortErrorReason() {
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$B(this, _HTTPRequest_abortErrorReason, "f");
    }
    /**
     * @returns An InterceptResolutionState object describing the current resolution
     * action and priority.
     *
     * InterceptResolutionState contains:
     * action: InterceptResolutionAction
     * priority?: number
     *
     * InterceptResolutionAction is one of: `abort`, `respond`, `continue`,
     * `disabled`, `none`, or `already-handled`.
     */
    interceptResolutionState() {
        if (!__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f")) {
            return { action: InterceptResolutionAction.Disabled };
        }
        if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptionHandled, "f")) {
            return { action: InterceptResolutionAction.AlreadyHandled };
        }
        return { ...__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f") };
    }
    /**
     * @returns `true` if the intercept resolution has already been handled,
     * `false` otherwise.
     */
    isInterceptResolutionHandled() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_interceptionHandled, "f");
    }
    /**
     * Adds an async request handler to the processing queue.
     * Deferred handlers are not guaranteed to execute in any particular order,
     * but they are guaranteed to resolve before the request interception
     * is finalized.
     */
    enqueueInterceptAction(pendingHandler) {
        __classPrivateFieldGet$B(this, _HTTPRequest_interceptHandlers, "f").push(pendingHandler);
    }
    /**
     * Awaits pending interception handlers and then decides how to fulfill
     * the request interception.
     */
    async finalizeInterceptions() {
        await __classPrivateFieldGet$B(this, _HTTPRequest_interceptHandlers, "f").reduce((promiseChain, interceptAction) => {
            return promiseChain.then(interceptAction);
        }, Promise.resolve());
        const { action } = this.interceptResolutionState();
        switch (action) {
            case 'abort':
                return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_abort).call(this, __classPrivateFieldGet$B(this, _HTTPRequest_abortErrorReason, "f"));
            case 'respond':
                if (__classPrivateFieldGet$B(this, _HTTPRequest_responseForRequest, "f") === null) {
                    throw new Error('Response is missing for the interception');
                }
                return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_respond).call(this, __classPrivateFieldGet$B(this, _HTTPRequest_responseForRequest, "f"));
            case 'continue':
                return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_continue).call(this, __classPrivateFieldGet$B(this, _HTTPRequest_continueRequestOverrides, "f"));
        }
    }
    /**
     * Contains the request's resource type as it was perceived by the rendering
     * engine.
     */
    resourceType() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_resourceType, "f");
    }
    /**
     * @returns the method used (`GET`, `POST`, etc.)
     */
    method() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_method, "f");
    }
    /**
     * @returns the request's post body, if any.
     */
    postData() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_postData, "f");
    }
    /**
     * @returns an object with HTTP headers associated with the request. All
     * header names are lower-case.
     */
    headers() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_headers, "f");
    }
    /**
     * @returns A matching `HTTPResponse` object, or null if the response has not
     * been received yet.
     */
    response() {
        return this._response;
    }
    /**
     * @returns the frame that initiated the request, or null if navigating to
     * error pages.
     */
    frame() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_frame, "f");
    }
    /**
     * @returns true if the request is the driver of the current frame's navigation.
     */
    isNavigationRequest() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_isNavigationRequest, "f");
    }
    /**
     * @returns the initiator of the request.
     */
    initiator() {
        return __classPrivateFieldGet$B(this, _HTTPRequest_initiator, "f");
    }
    /**
     * A `redirectChain` is a chain of requests initiated to fetch a resource.
     * @remarks
     *
     * `redirectChain` is shared between all the requests of the same chain.
     *
     * For example, if the website `http://example.com` has a single redirect to
     * `https://example.com`, then the chain will contain one request:
     *
     * ```ts
     * const response = await page.goto('http://example.com');
     * const chain = response.request().redirectChain();
     * console.log(chain.length); // 1
     * console.log(chain[0].url()); // 'http://example.com'
     * ```
     *
     * If the website `https://google.com` has no redirects, then the chain will be empty:
     *
     * ```ts
     * const response = await page.goto('https://google.com');
     * const chain = response.request().redirectChain();
     * console.log(chain.length); // 0
     * ```
     *
     * @returns the chain of requests - if a server responds with at least a
     * single redirect, this chain will contain all requests that were redirected.
     */
    redirectChain() {
        return this._redirectChain.slice();
    }
    /**
     * Access information about the request's failure.
     *
     * @remarks
     *
     * @example
     *
     * Example of logging all failed requests:
     *
     * ```ts
     * page.on('requestfailed', request => {
     *   console.log(request.url() + ' ' + request.failure().errorText);
     * });
     * ```
     *
     * @returns `null` unless the request failed. If the request fails this can
     * return an object with `errorText` containing a human-readable error
     * message, e.g. `net::ERR_FAILED`. It is not guaranteed that there will be
     * failure text if the request fails.
     */
    failure() {
        if (!this._failureText) {
            return null;
        }
        return {
            errorText: this._failureText,
        };
    }
    /**
     * Continues request with optional request overrides.
     *
     * @remarks
     *
     * To use this, request
     * interception should be enabled with {@link Page.setRequestInterception}.
     *
     * Exception is immediately thrown if the request interception is not enabled.
     *
     * @example
     *
     * ```ts
     * await page.setRequestInterception(true);
     * page.on('request', request => {
     *   // Override headers
     *   const headers = Object.assign({}, request.headers(), {
     *     foo: 'bar', // set "foo" header
     *     origin: undefined, // remove "origin" header
     *   });
     *   request.continue({headers});
     * });
     * ```
     *
     * @param overrides - optional overrides to apply to the request.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async continue(overrides = {}, priority) {
        // Request interception is not supported for data: urls.
        if (__classPrivateFieldGet$B(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$B(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_continue).call(this, overrides);
        }
        __classPrivateFieldSet$z(this, _HTTPRequest_continueRequestOverrides, overrides, "f");
        if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority > __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$z(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Continue,
                priority,
            }, "f");
            return;
        }
        if (priority === __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").action === 'abort' ||
                __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").action === 'respond') {
                return;
            }
            __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").action =
                InterceptResolutionAction.Continue;
        }
        return;
    }
    /**
     * Fulfills a request with the given response.
     *
     * @remarks
     *
     * To use this, request
     * interception should be enabled with {@link Page.setRequestInterception}.
     *
     * Exception is immediately thrown if the request interception is not enabled.
     *
     * @example
     * An example of fulfilling all requests with 404 responses:
     *
     * ```ts
     * await page.setRequestInterception(true);
     * page.on('request', request => {
     *   request.respond({
     *     status: 404,
     *     contentType: 'text/plain',
     *     body: 'Not Found!',
     *   });
     * });
     * ```
     *
     * NOTE: Mocking responses for dataURL requests is not supported.
     * Calling `request.respond` for a dataURL request is a noop.
     *
     * @param response - the response to fulfill the request with.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async respond(response, priority) {
        // Mocking responses for dataURL requests is not currently supported.
        if (__classPrivateFieldGet$B(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$B(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_respond).call(this, response);
        }
        __classPrivateFieldSet$z(this, _HTTPRequest_responseForRequest, response, "f");
        if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority > __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$z(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Respond,
                priority,
            }, "f");
            return;
        }
        if (priority === __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").action === 'abort') {
                return;
            }
            __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").action = InterceptResolutionAction.Respond;
        }
    }
    /**
     * Aborts a request.
     *
     * @remarks
     * To use this, request interception should be enabled with
     * {@link Page.setRequestInterception}. If it is not enabled, this method will
     * throw an exception immediately.
     *
     * @param errorCode - optional error code to provide.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async abort(errorCode = 'failed', priority) {
        // Request interception is not supported for data: urls.
        if (__classPrivateFieldGet$B(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        const errorReason = errorReasons[errorCode];
        assert(errorReason, 'Unknown error code: ' + errorCode);
        assert(__classPrivateFieldGet$B(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$B(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$B(this, _HTTPRequest_instances, "m", _HTTPRequest_abort).call(this, errorReason);
        }
        __classPrivateFieldSet$z(this, _HTTPRequest_abortErrorReason, errorReason, "f");
        if (__classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority >= __classPrivateFieldGet$B(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$z(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Abort,
                priority,
            }, "f");
            return;
        }
    }
}
_HTTPRequest_client = new WeakMap(), _HTTPRequest_isNavigationRequest = new WeakMap(), _HTTPRequest_allowInterception = new WeakMap(), _HTTPRequest_interceptionHandled = new WeakMap(), _HTTPRequest_url = new WeakMap(), _HTTPRequest_resourceType = new WeakMap(), _HTTPRequest_method = new WeakMap(), _HTTPRequest_postData = new WeakMap(), _HTTPRequest_headers = new WeakMap(), _HTTPRequest_frame = new WeakMap(), _HTTPRequest_continueRequestOverrides = new WeakMap(), _HTTPRequest_responseForRequest = new WeakMap(), _HTTPRequest_abortErrorReason = new WeakMap(), _HTTPRequest_interceptResolutionState = new WeakMap(), _HTTPRequest_interceptHandlers = new WeakMap(), _HTTPRequest_initiator = new WeakMap(), _HTTPRequest_instances = new WeakSet(), _HTTPRequest_continue = async function _HTTPRequest_continue(overrides = {}) {
    const { url, method, postData, headers } = overrides;
    __classPrivateFieldSet$z(this, _HTTPRequest_interceptionHandled, true, "f");
    const postDataBinaryBase64 = postData
        ? Buffer.from(postData).toString('base64')
        : undefined;
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.continueRequest');
    }
    await __classPrivateFieldGet$B(this, _HTTPRequest_client, "f")
        .send('Fetch.continueRequest', {
        requestId: this._interceptionId,
        url,
        method,
        postData: postDataBinaryBase64,
        headers: headers ? headersArray(headers) : undefined,
    })
        .catch(error => {
        __classPrivateFieldSet$z(this, _HTTPRequest_interceptionHandled, false, "f");
        return handleError(error);
    });
}, _HTTPRequest_respond = async function _HTTPRequest_respond(response) {
    __classPrivateFieldSet$z(this, _HTTPRequest_interceptionHandled, true, "f");
    const responseBody = response.body && isString(response.body)
        ? Buffer.from(response.body)
        : response.body || null;
    const responseHeaders = {};
    if (response.headers) {
        for (const header of Object.keys(response.headers)) {
            const value = response.headers[header];
            responseHeaders[header.toLowerCase()] = Array.isArray(value)
                ? value.map(item => {
                    return String(item);
                })
                : String(value);
        }
    }
    if (response.contentType) {
        responseHeaders['content-type'] = response.contentType;
    }
    if (responseBody && !('content-length' in responseHeaders)) {
        responseHeaders['content-length'] = String(Buffer.byteLength(responseBody));
    }
    const status = response.status || 200;
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.fulfillRequest');
    }
    await __classPrivateFieldGet$B(this, _HTTPRequest_client, "f")
        .send('Fetch.fulfillRequest', {
        requestId: this._interceptionId,
        responseCode: status,
        responsePhrase: STATUS_TEXTS[status],
        responseHeaders: headersArray(responseHeaders),
        body: responseBody ? responseBody.toString('base64') : undefined,
    })
        .catch(error => {
        __classPrivateFieldSet$z(this, _HTTPRequest_interceptionHandled, false, "f");
        return handleError(error);
    });
}, _HTTPRequest_abort = async function _HTTPRequest_abort(errorReason) {
    __classPrivateFieldSet$z(this, _HTTPRequest_interceptionHandled, true, "f");
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.failRequest');
    }
    await __classPrivateFieldGet$B(this, _HTTPRequest_client, "f")
        .send('Fetch.failRequest', {
        requestId: this._interceptionId,
        errorReason: errorReason || 'Failed',
    })
        .catch(handleError);
};
/**
 * @public
 */
var InterceptResolutionAction;
(function (InterceptResolutionAction) {
    InterceptResolutionAction["Abort"] = "abort";
    InterceptResolutionAction["Respond"] = "respond";
    InterceptResolutionAction["Continue"] = "continue";
    InterceptResolutionAction["Disabled"] = "disabled";
    InterceptResolutionAction["None"] = "none";
    InterceptResolutionAction["AlreadyHandled"] = "already-handled";
})(InterceptResolutionAction || (InterceptResolutionAction = {}));
const errorReasons = {
    aborted: 'Aborted',
    accessdenied: 'AccessDenied',
    addressunreachable: 'AddressUnreachable',
    blockedbyclient: 'BlockedByClient',
    blockedbyresponse: 'BlockedByResponse',
    connectionaborted: 'ConnectionAborted',
    connectionclosed: 'ConnectionClosed',
    connectionfailed: 'ConnectionFailed',
    connectionrefused: 'ConnectionRefused',
    connectionreset: 'ConnectionReset',
    internetdisconnected: 'InternetDisconnected',
    namenotresolved: 'NameNotResolved',
    timedout: 'TimedOut',
    failed: 'Failed',
};
function headersArray(headers) {
    const result = [];
    for (const name in headers) {
        const value = headers[name];
        if (!Object.is(value, undefined)) {
            const values = Array.isArray(value) ? value : [value];
            result.push(...values.map(value => {
                return { name, value: value + '' };
            }));
        }
    }
    return result;
}
async function handleError(error) {
    if (['Invalid header'].includes(error.originalMessage)) {
        throw error;
    }
    // In certain cases, protocol will return error if the request was
    // already canceled or the page was closed. We should tolerate these
    // errors.
    debugError(error);
}
// List taken from
// https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
// with extra 306 and 418 codes.
const STATUS_TEXTS = {
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '226': 'IM Used',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Switch Proxy',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Payload Too Large',
    '414': 'URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': "I'm a teapot",
    '421': 'Misdirected Request',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Too Early',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '451': 'Unavailable For Legal Reasons',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '508': 'Loop Detected',
    '510': 'Not Extended',
    '511': 'Network Authentication Required',
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$y = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$A = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SecurityDetails_subjectName, _SecurityDetails_issuer, _SecurityDetails_validFrom, _SecurityDetails_validTo, _SecurityDetails_protocol, _SecurityDetails_sanList;
/**
 * The SecurityDetails class represents the security details of a
 * response that was received over a secure connection.
 *
 * @public
 */
class SecurityDetails {
    /**
     * @internal
     */
    constructor(securityPayload) {
        _SecurityDetails_subjectName.set(this, void 0);
        _SecurityDetails_issuer.set(this, void 0);
        _SecurityDetails_validFrom.set(this, void 0);
        _SecurityDetails_validTo.set(this, void 0);
        _SecurityDetails_protocol.set(this, void 0);
        _SecurityDetails_sanList.set(this, void 0);
        __classPrivateFieldSet$y(this, _SecurityDetails_subjectName, securityPayload.subjectName, "f");
        __classPrivateFieldSet$y(this, _SecurityDetails_issuer, securityPayload.issuer, "f");
        __classPrivateFieldSet$y(this, _SecurityDetails_validFrom, securityPayload.validFrom, "f");
        __classPrivateFieldSet$y(this, _SecurityDetails_validTo, securityPayload.validTo, "f");
        __classPrivateFieldSet$y(this, _SecurityDetails_protocol, securityPayload.protocol, "f");
        __classPrivateFieldSet$y(this, _SecurityDetails_sanList, securityPayload.sanList, "f");
    }
    /**
     * @returns The name of the issuer of the certificate.
     */
    issuer() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_issuer, "f");
    }
    /**
     * @returns {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
     * marking the start of the certificate's validity.
     */
    validFrom() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_validFrom, "f");
    }
    /**
     * @returns {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
     * marking the end of the certificate's validity.
     */
    validTo() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_validTo, "f");
    }
    /**
     * @returns The security protocol being used, e.g. "TLS 1.2".
     */
    protocol() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_protocol, "f");
    }
    /**
     * @returns The name of the subject to which the certificate was issued.
     */
    subjectName() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_subjectName, "f");
    }
    /**
     * @returns The list of {@link https://en.wikipedia.org/wiki/Subject_Alternative_Name | subject alternative names (SANs)} of the certificate.
     */
    subjectAlternativeNames() {
        return __classPrivateFieldGet$A(this, _SecurityDetails_sanList, "f");
    }
}
_SecurityDetails_subjectName = new WeakMap(), _SecurityDetails_issuer = new WeakMap(), _SecurityDetails_validFrom = new WeakMap(), _SecurityDetails_validTo = new WeakMap(), _SecurityDetails_protocol = new WeakMap(), _SecurityDetails_sanList = new WeakMap();

var __classPrivateFieldSet$x = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$z = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTTPResponse_instances, _HTTPResponse_client, _HTTPResponse_request, _HTTPResponse_contentPromise, _HTTPResponse_bodyLoadedPromise, _HTTPResponse_bodyLoadedPromiseFulfill, _HTTPResponse_remoteAddress, _HTTPResponse_status, _HTTPResponse_statusText, _HTTPResponse_url, _HTTPResponse_fromDiskCache, _HTTPResponse_fromServiceWorker, _HTTPResponse_headers, _HTTPResponse_securityDetails, _HTTPResponse_timing, _HTTPResponse_parseStatusTextFromExtrInfo;
/**
 * The HTTPResponse class represents responses which are received by the
 * {@link Page} class.
 *
 * @public
 */
class HTTPResponse {
    /**
     * @internal
     */
    constructor(client, request, responsePayload, extraInfo) {
        _HTTPResponse_instances.add(this);
        _HTTPResponse_client.set(this, void 0);
        _HTTPResponse_request.set(this, void 0);
        _HTTPResponse_contentPromise.set(this, null);
        _HTTPResponse_bodyLoadedPromise.set(this, void 0);
        _HTTPResponse_bodyLoadedPromiseFulfill.set(this, () => { });
        _HTTPResponse_remoteAddress.set(this, void 0);
        _HTTPResponse_status.set(this, void 0);
        _HTTPResponse_statusText.set(this, void 0);
        _HTTPResponse_url.set(this, void 0);
        _HTTPResponse_fromDiskCache.set(this, void 0);
        _HTTPResponse_fromServiceWorker.set(this, void 0);
        _HTTPResponse_headers.set(this, {});
        _HTTPResponse_securityDetails.set(this, void 0);
        _HTTPResponse_timing.set(this, void 0);
        __classPrivateFieldSet$x(this, _HTTPResponse_client, client, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_request, request, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_bodyLoadedPromise, new Promise(fulfill => {
            __classPrivateFieldSet$x(this, _HTTPResponse_bodyLoadedPromiseFulfill, fulfill, "f");
        }), "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_remoteAddress, {
            ip: responsePayload.remoteIPAddress,
            port: responsePayload.remotePort,
        }, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_statusText, __classPrivateFieldGet$z(this, _HTTPResponse_instances, "m", _HTTPResponse_parseStatusTextFromExtrInfo).call(this, extraInfo) ||
            responsePayload.statusText, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_url, request.url(), "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_fromDiskCache, !!responsePayload.fromDiskCache, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_fromServiceWorker, !!responsePayload.fromServiceWorker, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_status, extraInfo ? extraInfo.statusCode : responsePayload.status, "f");
        const headers = extraInfo ? extraInfo.headers : responsePayload.headers;
        for (const [key, value] of Object.entries(headers)) {
            __classPrivateFieldGet$z(this, _HTTPResponse_headers, "f")[key.toLowerCase()] = value;
        }
        __classPrivateFieldSet$x(this, _HTTPResponse_securityDetails, responsePayload.securityDetails
            ? new SecurityDetails(responsePayload.securityDetails)
            : null, "f");
        __classPrivateFieldSet$x(this, _HTTPResponse_timing, responsePayload.timing || null, "f");
    }
    /**
     * @internal
     */
    _resolveBody(err) {
        if (err) {
            return __classPrivateFieldGet$z(this, _HTTPResponse_bodyLoadedPromiseFulfill, "f").call(this, err);
        }
        return __classPrivateFieldGet$z(this, _HTTPResponse_bodyLoadedPromiseFulfill, "f").call(this);
    }
    /**
     * @returns The IP address and port number used to connect to the remote
     * server.
     */
    remoteAddress() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_remoteAddress, "f");
    }
    /**
     * @returns The URL of the response.
     */
    url() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_url, "f");
    }
    /**
     * @returns True if the response was successful (status in the range 200-299).
     */
    ok() {
        // TODO: document === 0 case?
        return __classPrivateFieldGet$z(this, _HTTPResponse_status, "f") === 0 || (__classPrivateFieldGet$z(this, _HTTPResponse_status, "f") >= 200 && __classPrivateFieldGet$z(this, _HTTPResponse_status, "f") <= 299);
    }
    /**
     * @returns The status code of the response (e.g., 200 for a success).
     */
    status() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_status, "f");
    }
    /**
     * @returns The status text of the response (e.g. usually an "OK" for a
     * success).
     */
    statusText() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_statusText, "f");
    }
    /**
     * @returns An object with HTTP headers associated with the response. All
     * header names are lower-case.
     */
    headers() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_headers, "f");
    }
    /**
     * @returns {@link SecurityDetails} if the response was received over the
     * secure connection, or `null` otherwise.
     */
    securityDetails() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_securityDetails, "f");
    }
    /**
     * @returns Timing information related to the response.
     */
    timing() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_timing, "f");
    }
    /**
     * @returns Promise which resolves to a buffer with response body.
     */
    buffer() {
        if (!__classPrivateFieldGet$z(this, _HTTPResponse_contentPromise, "f")) {
            __classPrivateFieldSet$x(this, _HTTPResponse_contentPromise, __classPrivateFieldGet$z(this, _HTTPResponse_bodyLoadedPromise, "f").then(async (error) => {
                if (error) {
                    throw error;
                }
                try {
                    const response = await __classPrivateFieldGet$z(this, _HTTPResponse_client, "f").send('Network.getResponseBody', {
                        requestId: __classPrivateFieldGet$z(this, _HTTPResponse_request, "f")._requestId,
                    });
                    return Buffer.from(response.body, response.base64Encoded ? 'base64' : 'utf8');
                }
                catch (error) {
                    if (error instanceof ProtocolError &&
                        error.originalMessage === 'No resource with given identifier found') {
                        throw new ProtocolError('Could not load body for this request. This might happen if the request is a preflight request.');
                    }
                    throw error;
                }
            }), "f");
        }
        return __classPrivateFieldGet$z(this, _HTTPResponse_contentPromise, "f");
    }
    /**
     * @returns Promise which resolves to a text representation of response body.
     */
    async text() {
        const content = await this.buffer();
        return content.toString('utf8');
    }
    /**
     *
     * @returns Promise which resolves to a JSON representation of response body.
     *
     * @remarks
     *
     * This method will throw if the response body is not parsable via
     * `JSON.parse`.
     */
    async json() {
        const content = await this.text();
        return JSON.parse(content);
    }
    /**
     * @returns A matching {@link HTTPRequest} object.
     */
    request() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_request, "f");
    }
    /**
     * @returns True if the response was served from either the browser's disk
     * cache or memory cache.
     */
    fromCache() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_fromDiskCache, "f") || __classPrivateFieldGet$z(this, _HTTPResponse_request, "f")._fromMemoryCache;
    }
    /**
     * @returns True if the response was served by a service worker.
     */
    fromServiceWorker() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_fromServiceWorker, "f");
    }
    /**
     * @returns A {@link Frame} that initiated this response, or `null` if
     * navigating to error pages.
     */
    frame() {
        return __classPrivateFieldGet$z(this, _HTTPResponse_request, "f").frame();
    }
}
_HTTPResponse_client = new WeakMap(), _HTTPResponse_request = new WeakMap(), _HTTPResponse_contentPromise = new WeakMap(), _HTTPResponse_bodyLoadedPromise = new WeakMap(), _HTTPResponse_bodyLoadedPromiseFulfill = new WeakMap(), _HTTPResponse_remoteAddress = new WeakMap(), _HTTPResponse_status = new WeakMap(), _HTTPResponse_statusText = new WeakMap(), _HTTPResponse_url = new WeakMap(), _HTTPResponse_fromDiskCache = new WeakMap(), _HTTPResponse_fromServiceWorker = new WeakMap(), _HTTPResponse_headers = new WeakMap(), _HTTPResponse_securityDetails = new WeakMap(), _HTTPResponse_timing = new WeakMap(), _HTTPResponse_instances = new WeakSet(), _HTTPResponse_parseStatusTextFromExtrInfo = function _HTTPResponse_parseStatusTextFromExtrInfo(extraInfo) {
    if (!extraInfo || !extraInfo.headersText) {
        return;
    }
    const firstLine = extraInfo.headersText.split('\r', 1)[0];
    if (!firstLine) {
        return;
    }
    const match = firstLine.match(/[^ ]* [^ ]* (.*)/);
    if (!match) {
        return;
    }
    const statusText = match[1];
    if (!statusText) {
        return;
    }
    return statusText;
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldGet$y = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NetworkEventManager_requestWillBeSentMap, _NetworkEventManager_requestPausedMap, _NetworkEventManager_httpRequestsMap, _NetworkEventManager_responseReceivedExtraInfoMap, _NetworkEventManager_queuedRedirectInfoMap, _NetworkEventManager_queuedEventGroupMap;
/**
 * Helper class to track network events by request ID
 *
 * @internal
 */
class NetworkEventManager {
    constructor() {
        /**
         * There are four possible orders of events:
         * A. `_onRequestWillBeSent`
         * B. `_onRequestWillBeSent`, `_onRequestPaused`
         * C. `_onRequestPaused`, `_onRequestWillBeSent`
         * D. `_onRequestPaused`, `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, `_onRequestPaused`
         * (see crbug.com/1196004)
         *
         * For `_onRequest` we need the event from `_onRequestWillBeSent` and
         * optionally the `interceptionId` from `_onRequestPaused`.
         *
         * If request interception is disabled, call `_onRequest` once per call to
         * `_onRequestWillBeSent`.
         * If request interception is enabled, call `_onRequest` once per call to
         * `_onRequestPaused` (once per `interceptionId`).
         *
         * Events are stored to allow for subsequent events to call `_onRequest`.
         *
         * Note that (chains of) redirect requests have the same `requestId` (!) as
         * the original request. We have to anticipate series of events like these:
         * A. `_onRequestWillBeSent`,
         * `_onRequestWillBeSent`, ...
         * B. `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, ...
         * C. `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestPaused`, `_onRequestWillBeSent`, ...
         * D. `_onRequestPaused`, `_onRequestWillBeSent`,
         * `_onRequestPaused`, `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, `_onRequestPaused`, ...
         * (see crbug.com/1196004)
         */
        _NetworkEventManager_requestWillBeSentMap.set(this, new Map());
        _NetworkEventManager_requestPausedMap.set(this, new Map());
        _NetworkEventManager_httpRequestsMap.set(this, new Map());
        /*
         * The below maps are used to reconcile Network.responseReceivedExtraInfo
         * events with their corresponding request. Each response and redirect
         * response gets an ExtraInfo event, and we don't know which will come first.
         * This means that we have to store a Response or an ExtraInfo for each
         * response, and emit the event when we get both of them. In addition, to
         * handle redirects, we have to make them Arrays to represent the chain of
         * events.
         */
        _NetworkEventManager_responseReceivedExtraInfoMap.set(this, new Map());
        _NetworkEventManager_queuedRedirectInfoMap.set(this, new Map());
        _NetworkEventManager_queuedEventGroupMap.set(this, new Map());
    }
    forget(networkRequestId) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestWillBeSentMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestPausedMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$y(this, _NetworkEventManager_queuedEventGroupMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$y(this, _NetworkEventManager_queuedRedirectInfoMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$y(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").delete(networkRequestId);
    }
    responseExtraInfo(networkRequestId) {
        if (!__classPrivateFieldGet$y(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").has(networkRequestId)) {
            __classPrivateFieldGet$y(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").set(networkRequestId, []);
        }
        return __classPrivateFieldGet$y(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").get(networkRequestId);
    }
    queuedRedirectInfo(fetchRequestId) {
        if (!__classPrivateFieldGet$y(this, _NetworkEventManager_queuedRedirectInfoMap, "f").has(fetchRequestId)) {
            __classPrivateFieldGet$y(this, _NetworkEventManager_queuedRedirectInfoMap, "f").set(fetchRequestId, []);
        }
        return __classPrivateFieldGet$y(this, _NetworkEventManager_queuedRedirectInfoMap, "f").get(fetchRequestId);
    }
    queueRedirectInfo(fetchRequestId, redirectInfo) {
        this.queuedRedirectInfo(fetchRequestId).push(redirectInfo);
    }
    takeQueuedRedirectInfo(fetchRequestId) {
        return this.queuedRedirectInfo(fetchRequestId).shift();
    }
    numRequestsInProgress() {
        return [...__classPrivateFieldGet$y(this, _NetworkEventManager_httpRequestsMap, "f")].filter(([, request]) => {
            return !request.response();
        }).length;
    }
    storeRequestWillBeSent(networkRequestId, event) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestWillBeSentMap, "f").set(networkRequestId, event);
    }
    getRequestWillBeSent(networkRequestId) {
        return __classPrivateFieldGet$y(this, _NetworkEventManager_requestWillBeSentMap, "f").get(networkRequestId);
    }
    forgetRequestWillBeSent(networkRequestId) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestWillBeSentMap, "f").delete(networkRequestId);
    }
    getRequestPaused(networkRequestId) {
        return __classPrivateFieldGet$y(this, _NetworkEventManager_requestPausedMap, "f").get(networkRequestId);
    }
    forgetRequestPaused(networkRequestId) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestPausedMap, "f").delete(networkRequestId);
    }
    storeRequestPaused(networkRequestId, event) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_requestPausedMap, "f").set(networkRequestId, event);
    }
    getRequest(networkRequestId) {
        return __classPrivateFieldGet$y(this, _NetworkEventManager_httpRequestsMap, "f").get(networkRequestId);
    }
    storeRequest(networkRequestId, request) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_httpRequestsMap, "f").set(networkRequestId, request);
    }
    forgetRequest(networkRequestId) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_httpRequestsMap, "f").delete(networkRequestId);
    }
    getQueuedEventGroup(networkRequestId) {
        return __classPrivateFieldGet$y(this, _NetworkEventManager_queuedEventGroupMap, "f").get(networkRequestId);
    }
    queueEventGroup(networkRequestId, event) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_queuedEventGroupMap, "f").set(networkRequestId, event);
    }
    forgetQueuedEventGroup(networkRequestId) {
        __classPrivateFieldGet$y(this, _NetworkEventManager_queuedEventGroupMap, "f").delete(networkRequestId);
    }
}
_NetworkEventManager_requestWillBeSentMap = new WeakMap(), _NetworkEventManager_requestPausedMap = new WeakMap(), _NetworkEventManager_httpRequestsMap = new WeakMap(), _NetworkEventManager_responseReceivedExtraInfoMap = new WeakMap(), _NetworkEventManager_queuedRedirectInfoMap = new WeakMap(), _NetworkEventManager_queuedEventGroupMap = new WeakMap();

/**
 * Creates and returns a deferred promise using DEFERRED_PROMISE_DEBUG_TIMEOUT
 * if it's specified or a normal deferred promise otherwise.
 *
 * @internal
 */
function createDebuggableDeferredPromise(message) {
    if (DEFERRED_PROMISE_DEBUG_TIMEOUT > 0) {
        return createDeferredPromise({
            message,
            timeout: DEFERRED_PROMISE_DEBUG_TIMEOUT,
        });
    }
    return createDeferredPromise();
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$w = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$x = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NetworkManager_instances, _NetworkManager_client, _NetworkManager_ignoreHTTPSErrors, _NetworkManager_frameManager, _NetworkManager_networkEventManager, _NetworkManager_extraHTTPHeaders, _NetworkManager_credentials, _NetworkManager_attemptedAuthentications, _NetworkManager_userRequestInterceptionEnabled, _NetworkManager_protocolRequestInterceptionEnabled, _NetworkManager_userCacheDisabled, _NetworkManager_emulatedNetworkConditions, _NetworkManager_deferredInitPromise, _NetworkManager_updateNetworkConditions, _NetworkManager_updateProtocolRequestInterception, _NetworkManager_cacheDisabled, _NetworkManager_updateProtocolCacheDisabled, _NetworkManager_onRequestWillBeSent, _NetworkManager_onAuthRequired, _NetworkManager_onRequestPaused, _NetworkManager_patchRequestEventHeaders, _NetworkManager_onRequest, _NetworkManager_onRequestServedFromCache, _NetworkManager_handleRequestRedirect, _NetworkManager_emitResponseEvent, _NetworkManager_onResponseReceived, _NetworkManager_onResponseReceivedExtraInfo, _NetworkManager_forgetRequest, _NetworkManager_onLoadingFinished, _NetworkManager_emitLoadingFinished, _NetworkManager_onLoadingFailed, _NetworkManager_emitLoadingFailed;
/**
 * We use symbols to prevent any external parties listening to these events.
 * They are internal to Puppeteer.
 *
 * @internal
 */
const NetworkManagerEmittedEvents = {
    Request: Symbol('NetworkManager.Request'),
    RequestServedFromCache: Symbol('NetworkManager.RequestServedFromCache'),
    Response: Symbol('NetworkManager.Response'),
    RequestFailed: Symbol('NetworkManager.RequestFailed'),
    RequestFinished: Symbol('NetworkManager.RequestFinished'),
};
/**
 * @internal
 */
class NetworkManager extends EventEmitter {
    constructor(client, ignoreHTTPSErrors, frameManager) {
        super();
        _NetworkManager_instances.add(this);
        _NetworkManager_client.set(this, void 0);
        _NetworkManager_ignoreHTTPSErrors.set(this, void 0);
        _NetworkManager_frameManager.set(this, void 0);
        _NetworkManager_networkEventManager.set(this, new NetworkEventManager());
        _NetworkManager_extraHTTPHeaders.set(this, {});
        _NetworkManager_credentials.set(this, void 0);
        _NetworkManager_attemptedAuthentications.set(this, new Set());
        _NetworkManager_userRequestInterceptionEnabled.set(this, false);
        _NetworkManager_protocolRequestInterceptionEnabled.set(this, false);
        _NetworkManager_userCacheDisabled.set(this, false);
        _NetworkManager_emulatedNetworkConditions.set(this, {
            offline: false,
            upload: -1,
            download: -1,
            latency: 0,
        });
        _NetworkManager_deferredInitPromise.set(this, void 0);
        __classPrivateFieldSet$w(this, _NetworkManager_client, client, "f");
        __classPrivateFieldSet$w(this, _NetworkManager_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$w(this, _NetworkManager_frameManager, frameManager, "f");
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Fetch.requestPaused', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequestPaused).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Fetch.authRequired', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onAuthRequired).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.requestWillBeSent', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequestWillBeSent).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.requestServedFromCache', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequestServedFromCache).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.responseReceived', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceived).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.loadingFinished', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFinished).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.loadingFailed', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFailed).bind(this));
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f").on('Network.responseReceivedExtraInfo', __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceivedExtraInfo).bind(this));
    }
    /**
     * Initialize calls should avoid async dependencies between CDP calls as those
     * might not resolve until after the target is resumed causing a deadlock.
     */
    initialize() {
        if (__classPrivateFieldGet$x(this, _NetworkManager_deferredInitPromise, "f")) {
            return __classPrivateFieldGet$x(this, _NetworkManager_deferredInitPromise, "f");
        }
        __classPrivateFieldSet$w(this, _NetworkManager_deferredInitPromise, createDebuggableDeferredPromise('NetworkManager initialization timed out'), "f");
        const init = Promise.all([
            __classPrivateFieldGet$x(this, _NetworkManager_ignoreHTTPSErrors, "f")
                ? __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Security.setIgnoreCertificateErrors', {
                    ignore: true,
                })
                : null,
            __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Network.enable'),
        ]);
        const deferredInitPromise = __classPrivateFieldGet$x(this, _NetworkManager_deferredInitPromise, "f");
        init
            .then(() => {
            deferredInitPromise.resolve();
        })
            .catch(err => {
            deferredInitPromise.reject(err);
        });
        return __classPrivateFieldGet$x(this, _NetworkManager_deferredInitPromise, "f");
    }
    async authenticate(credentials) {
        __classPrivateFieldSet$w(this, _NetworkManager_credentials, credentials, "f");
        await __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolRequestInterception).call(this);
    }
    async setExtraHTTPHeaders(extraHTTPHeaders) {
        __classPrivateFieldSet$w(this, _NetworkManager_extraHTTPHeaders, {}, "f");
        for (const key of Object.keys(extraHTTPHeaders)) {
            const value = extraHTTPHeaders[key];
            assert(isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
            __classPrivateFieldGet$x(this, _NetworkManager_extraHTTPHeaders, "f")[key.toLowerCase()] = value;
        }
        await __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Network.setExtraHTTPHeaders', {
            headers: __classPrivateFieldGet$x(this, _NetworkManager_extraHTTPHeaders, "f"),
        });
    }
    extraHTTPHeaders() {
        return Object.assign({}, __classPrivateFieldGet$x(this, _NetworkManager_extraHTTPHeaders, "f"));
    }
    numRequestsInProgress() {
        return __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").numRequestsInProgress();
    }
    async setOfflineMode(value) {
        __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").offline = value;
        await __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateNetworkConditions).call(this);
    }
    async emulateNetworkConditions(networkConditions) {
        __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").upload = networkConditions
            ? networkConditions.upload
            : -1;
        __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").download = networkConditions
            ? networkConditions.download
            : -1;
        __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").latency = networkConditions
            ? networkConditions.latency
            : 0;
        await __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateNetworkConditions).call(this);
    }
    async setUserAgent(userAgent, userAgentMetadata) {
        await __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Network.setUserAgentOverride', {
            userAgent: userAgent,
            userAgentMetadata: userAgentMetadata,
        });
    }
    async setCacheEnabled(enabled) {
        __classPrivateFieldSet$w(this, _NetworkManager_userCacheDisabled, !enabled, "f");
        await __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this);
    }
    async setRequestInterception(value) {
        __classPrivateFieldSet$w(this, _NetworkManager_userRequestInterceptionEnabled, value, "f");
        await __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolRequestInterception).call(this);
    }
}
_NetworkManager_client = new WeakMap(), _NetworkManager_ignoreHTTPSErrors = new WeakMap(), _NetworkManager_frameManager = new WeakMap(), _NetworkManager_networkEventManager = new WeakMap(), _NetworkManager_extraHTTPHeaders = new WeakMap(), _NetworkManager_credentials = new WeakMap(), _NetworkManager_attemptedAuthentications = new WeakMap(), _NetworkManager_userRequestInterceptionEnabled = new WeakMap(), _NetworkManager_protocolRequestInterceptionEnabled = new WeakMap(), _NetworkManager_userCacheDisabled = new WeakMap(), _NetworkManager_emulatedNetworkConditions = new WeakMap(), _NetworkManager_deferredInitPromise = new WeakMap(), _NetworkManager_instances = new WeakSet(), _NetworkManager_updateNetworkConditions = async function _NetworkManager_updateNetworkConditions() {
    await __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Network.emulateNetworkConditions', {
        offline: __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").offline,
        latency: __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").latency,
        uploadThroughput: __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").upload,
        downloadThroughput: __classPrivateFieldGet$x(this, _NetworkManager_emulatedNetworkConditions, "f").download,
    });
}, _NetworkManager_updateProtocolRequestInterception = async function _NetworkManager_updateProtocolRequestInterception() {
    const enabled = __classPrivateFieldGet$x(this, _NetworkManager_userRequestInterceptionEnabled, "f") || !!__classPrivateFieldGet$x(this, _NetworkManager_credentials, "f");
    if (enabled === __classPrivateFieldGet$x(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
        return;
    }
    __classPrivateFieldSet$w(this, _NetworkManager_protocolRequestInterceptionEnabled, enabled, "f");
    if (enabled) {
        await Promise.all([
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this),
            __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Fetch.enable', {
                handleAuthRequests: true,
                patterns: [{ urlPattern: '*' }],
            }),
        ]);
    }
    else {
        await Promise.all([
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this),
            __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Fetch.disable'),
        ]);
    }
}, _NetworkManager_cacheDisabled = function _NetworkManager_cacheDisabled() {
    return __classPrivateFieldGet$x(this, _NetworkManager_userCacheDisabled, "f");
}, _NetworkManager_updateProtocolCacheDisabled = async function _NetworkManager_updateProtocolCacheDisabled() {
    await __classPrivateFieldGet$x(this, _NetworkManager_client, "f").send('Network.setCacheDisabled', {
        cacheDisabled: __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_cacheDisabled).call(this),
    });
}, _NetworkManager_onRequestWillBeSent = function _NetworkManager_onRequestWillBeSent(event) {
    // Request interception doesn't happen for data URLs with Network Service.
    if (__classPrivateFieldGet$x(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        !event.request.url.startsWith('data:')) {
        const { requestId: networkRequestId } = event;
        __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").storeRequestWillBeSent(networkRequestId, event);
        /**
         * CDP may have sent a Fetch.requestPaused event already. Check for it.
         */
        const requestPausedEvent = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequestPaused(networkRequestId);
        if (requestPausedEvent) {
            const { requestId: fetchRequestId } = requestPausedEvent;
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, event, requestPausedEvent);
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, event, fetchRequestId);
            __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").forgetRequestPaused(networkRequestId);
        }
        return;
    }
    __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, event, undefined);
}, _NetworkManager_onAuthRequired = function _NetworkManager_onAuthRequired(event) {
    let response = 'Default';
    if (__classPrivateFieldGet$x(this, _NetworkManager_attemptedAuthentications, "f").has(event.requestId)) {
        response = 'CancelAuth';
    }
    else if (__classPrivateFieldGet$x(this, _NetworkManager_credentials, "f")) {
        response = 'ProvideCredentials';
        __classPrivateFieldGet$x(this, _NetworkManager_attemptedAuthentications, "f").add(event.requestId);
    }
    const { username, password } = __classPrivateFieldGet$x(this, _NetworkManager_credentials, "f") || {
        username: undefined,
        password: undefined,
    };
    __classPrivateFieldGet$x(this, _NetworkManager_client, "f")
        .send('Fetch.continueWithAuth', {
        requestId: event.requestId,
        authChallengeResponse: { response, username, password },
    })
        .catch(debugError);
}, _NetworkManager_onRequestPaused = function _NetworkManager_onRequestPaused(event) {
    if (!__classPrivateFieldGet$x(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        __classPrivateFieldGet$x(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
        __classPrivateFieldGet$x(this, _NetworkManager_client, "f")
            .send('Fetch.continueRequest', {
            requestId: event.requestId,
        })
            .catch(debugError);
    }
    const { networkId: networkRequestId, requestId: fetchRequestId } = event;
    if (!networkRequestId) {
        return;
    }
    const requestWillBeSentEvent = (() => {
        const requestWillBeSentEvent = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequestWillBeSent(networkRequestId);
        // redirect requests have the same `requestId`,
        if (requestWillBeSentEvent &&
            (requestWillBeSentEvent.request.url !== event.request.url ||
                requestWillBeSentEvent.request.method !== event.request.method)) {
            __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").forgetRequestWillBeSent(networkRequestId);
            return;
        }
        return requestWillBeSentEvent;
    })();
    if (requestWillBeSentEvent) {
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, requestWillBeSentEvent, event);
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, requestWillBeSentEvent, fetchRequestId);
    }
    else {
        __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").storeRequestPaused(networkRequestId, event);
    }
}, _NetworkManager_patchRequestEventHeaders = function _NetworkManager_patchRequestEventHeaders(requestWillBeSentEvent, requestPausedEvent) {
    requestWillBeSentEvent.request.headers = {
        ...requestWillBeSentEvent.request.headers,
        // includes extra headers, like: Accept, Origin
        ...requestPausedEvent.request.headers,
    };
}, _NetworkManager_onRequest = function _NetworkManager_onRequest(event, fetchRequestId) {
    let redirectChain = [];
    if (event.redirectResponse) {
        // We want to emit a response and requestfinished for the
        // redirectResponse, but we can't do so unless we have a
        // responseExtraInfo ready to pair it up with. If we don't have any
        // responseExtraInfos saved in our queue, they we have to wait until
        // the next one to emit response and requestfinished, *and* we should
        // also wait to emit this Request too because it should come after the
        // response/requestfinished.
        let redirectResponseExtraInfo = null;
        if (event.redirectHasExtraInfo) {
            redirectResponseExtraInfo = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f")
                .responseExtraInfo(event.requestId)
                .shift();
            if (!redirectResponseExtraInfo) {
                __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").queueRedirectInfo(event.requestId, {
                    event,
                    fetchRequestId,
                });
                return;
            }
        }
        const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
        // If we connect late to the target, we could have missed the
        // requestWillBeSent event.
        if (request) {
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_handleRequestRedirect).call(this, request, event.redirectResponse, redirectResponseExtraInfo);
            redirectChain = request._redirectChain;
        }
    }
    const frame = event.frameId
        ? __classPrivateFieldGet$x(this, _NetworkManager_frameManager, "f").frame(event.frameId)
        : null;
    const request = new HTTPRequest(__classPrivateFieldGet$x(this, _NetworkManager_client, "f"), frame, fetchRequestId, __classPrivateFieldGet$x(this, _NetworkManager_userRequestInterceptionEnabled, "f"), event, redirectChain);
    __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").storeRequest(event.requestId, request);
    this.emit(NetworkManagerEmittedEvents.Request, request);
    request.finalizeInterceptions();
}, _NetworkManager_onRequestServedFromCache = function _NetworkManager_onRequestServedFromCache(event) {
    const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    if (request) {
        request._fromMemoryCache = true;
    }
    this.emit(NetworkManagerEmittedEvents.RequestServedFromCache, request);
}, _NetworkManager_handleRequestRedirect = function _NetworkManager_handleRequestRedirect(request, responsePayload, extraInfo) {
    const response = new HTTPResponse(__classPrivateFieldGet$x(this, _NetworkManager_client, "f"), request, responsePayload, extraInfo);
    request._response = response;
    request._redirectChain.push(request);
    response._resolveBody(new Error('Response body is unavailable for redirect responses'));
    __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, false);
    this.emit(NetworkManagerEmittedEvents.Response, response);
    this.emit(NetworkManagerEmittedEvents.RequestFinished, request);
}, _NetworkManager_emitResponseEvent = function _NetworkManager_emitResponseEvent(responseReceived, extraInfo) {
    const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(responseReceived.requestId);
    // FileUpload sends a response without a matching request.
    if (!request) {
        return;
    }
    const extraInfos = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(responseReceived.requestId);
    if (extraInfos.length) {
        debugError(new Error('Unexpected extraInfo events for request ' +
            responseReceived.requestId));
    }
    const response = new HTTPResponse(__classPrivateFieldGet$x(this, _NetworkManager_client, "f"), request, responseReceived.response, extraInfo);
    request._response = response;
    this.emit(NetworkManagerEmittedEvents.Response, response);
}, _NetworkManager_onResponseReceived = function _NetworkManager_onResponseReceived(event) {
    const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    let extraInfo = null;
    if (request && !request._fromMemoryCache && event.hasExtraInfo) {
        extraInfo = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f")
            .responseExtraInfo(event.requestId)
            .shift();
        if (!extraInfo) {
            // Wait until we get the corresponding ExtraInfo event.
            __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").queueEventGroup(event.requestId, {
                responseReceivedEvent: event,
            });
            return;
        }
    }
    __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, event, extraInfo);
}, _NetworkManager_onResponseReceivedExtraInfo = function _NetworkManager_onResponseReceivedExtraInfo(event) {
    // We may have skipped a redirect response/request pair due to waiting for
    // this ExtraInfo event. If so, continue that work now that we have the
    // request.
    const redirectInfo = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").takeQueuedRedirectInfo(event.requestId);
    if (redirectInfo) {
        __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, redirectInfo.event, redirectInfo.fetchRequestId);
        return;
    }
    // We may have skipped response and loading events because we didn't have
    // this ExtraInfo event yet. If so, emit those events now.
    const queuedEvents = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").forgetQueuedEventGroup(event.requestId);
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, queuedEvents.responseReceivedEvent, event);
        if (queuedEvents.loadingFinishedEvent) {
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, queuedEvents.loadingFinishedEvent);
        }
        if (queuedEvents.loadingFailedEvent) {
            __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, queuedEvents.loadingFailedEvent);
        }
        return;
    }
    // Wait until we get another event that can use this ExtraInfo event.
    __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
}, _NetworkManager_forgetRequest = function _NetworkManager_forgetRequest(request, events) {
    const requestId = request._requestId;
    const interceptionId = request._interceptionId;
    __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").forgetRequest(requestId);
    interceptionId !== undefined &&
        __classPrivateFieldGet$x(this, _NetworkManager_attemptedAuthentications, "f").delete(interceptionId);
    if (events) {
        __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").forget(requestId);
    }
}, _NetworkManager_onLoadingFinished = function _NetworkManager_onLoadingFinished(event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFinishedEvent = event;
    }
    else {
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, event);
    }
}, _NetworkManager_emitLoadingFinished = function _NetworkManager_emitLoadingFinished(event) {
    var _a;
    const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    // Under certain conditions we never get the Network.responseReceived
    // event from protocol. @see https://crbug.com/883475
    if (request.response()) {
        (_a = request.response()) === null || _a === void 0 ? void 0 : _a._resolveBody(null);
    }
    __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEmittedEvents.RequestFinished, request);
}, _NetworkManager_onLoadingFailed = function _NetworkManager_onLoadingFailed(event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFailedEvent = event;
    }
    else {
        __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, event);
    }
}, _NetworkManager_emitLoadingFailed = function _NetworkManager_emitLoadingFailed(event) {
    const request = __classPrivateFieldGet$x(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    request._failureText = event.errorText;
    const response = request.response();
    if (response) {
        response._resolveBody(null);
    }
    __classPrivateFieldGet$x(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEmittedEvents.RequestFailed, request);
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$v = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$w = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FrameManager_instances, _FrameManager_page, _FrameManager_networkManager, _FrameManager_timeoutSettings, _FrameManager_contextIdToContext, _FrameManager_isolatedWorlds, _FrameManager_client, _FrameManager_onLifecycleEvent, _FrameManager_onFrameStartedLoading, _FrameManager_onFrameStoppedLoading, _FrameManager_handleFrameTree, _FrameManager_onFrameAttached, _FrameManager_onFrameNavigated, _FrameManager_createIsolatedWorld, _FrameManager_onFrameNavigatedWithinDocument, _FrameManager_onFrameDetached, _FrameManager_onExecutionContextCreated, _FrameManager_onExecutionContextDestroyed, _FrameManager_onExecutionContextsCleared, _FrameManager_removeFramesRecursively;
const UTILITY_WORLD_NAME = '__puppeteer_utility_world__';
/**
 * We use symbols to prevent external parties listening to these events.
 * They are internal to Puppeteer.
 *
 * @internal
 */
const FrameManagerEmittedEvents = {
    FrameAttached: Symbol('FrameManager.FrameAttached'),
    FrameNavigated: Symbol('FrameManager.FrameNavigated'),
    FrameDetached: Symbol('FrameManager.FrameDetached'),
    FrameSwapped: Symbol('FrameManager.FrameSwapped'),
    LifecycleEvent: Symbol('FrameManager.LifecycleEvent'),
    FrameNavigatedWithinDocument: Symbol('FrameManager.FrameNavigatedWithinDocument'),
    ExecutionContextCreated: Symbol('FrameManager.ExecutionContextCreated'),
    ExecutionContextDestroyed: Symbol('FrameManager.ExecutionContextDestroyed'),
};
/**
 * A frame manager manages the frames for a given {@link Page | page}.
 *
 * @internal
 */
class FrameManager extends EventEmitter {
    constructor(client, page, ignoreHTTPSErrors, timeoutSettings) {
        super();
        _FrameManager_instances.add(this);
        _FrameManager_page.set(this, void 0);
        _FrameManager_networkManager.set(this, void 0);
        _FrameManager_timeoutSettings.set(this, void 0);
        _FrameManager_contextIdToContext.set(this, new Map());
        _FrameManager_isolatedWorlds.set(this, new Set());
        _FrameManager_client.set(this, void 0);
        /**
         * @internal
         */
        this._frameTree = new FrameTree();
        __classPrivateFieldSet$v(this, _FrameManager_client, client, "f");
        __classPrivateFieldSet$v(this, _FrameManager_page, page, "f");
        __classPrivateFieldSet$v(this, _FrameManager_networkManager, new NetworkManager(client, ignoreHTTPSErrors, this), "f");
        __classPrivateFieldSet$v(this, _FrameManager_timeoutSettings, timeoutSettings, "f");
        this.setupEventListeners(__classPrivateFieldGet$w(this, _FrameManager_client, "f"));
    }
    get timeoutSettings() {
        return __classPrivateFieldGet$w(this, _FrameManager_timeoutSettings, "f");
    }
    get networkManager() {
        return __classPrivateFieldGet$w(this, _FrameManager_networkManager, "f");
    }
    get client() {
        return __classPrivateFieldGet$w(this, _FrameManager_client, "f");
    }
    setupEventListeners(session) {
        session.on('Page.frameAttached', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameAttached).call(this, session, event.frameId, event.parentFrameId);
        });
        session.on('Page.frameNavigated', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigated).call(this, event.frame);
        });
        session.on('Page.navigatedWithinDocument', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigatedWithinDocument).call(this, event.frameId, event.url);
        });
        session.on('Page.frameDetached', (event) => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameDetached).call(this, event.frameId, event.reason);
        });
        session.on('Page.frameStartedLoading', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameStartedLoading).call(this, event.frameId);
        });
        session.on('Page.frameStoppedLoading', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameStoppedLoading).call(this, event.frameId);
        });
        session.on('Runtime.executionContextCreated', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextCreated).call(this, event.context, session);
        });
        session.on('Runtime.executionContextDestroyed', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextDestroyed).call(this, event.executionContextId, session);
        });
        session.on('Runtime.executionContextsCleared', () => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextsCleared).call(this, session);
        });
        session.on('Page.lifecycleEvent', event => {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onLifecycleEvent).call(this, event);
        });
    }
    async initialize(client = __classPrivateFieldGet$w(this, _FrameManager_client, "f")) {
        try {
            const result = await Promise.all([
                client.send('Page.enable'),
                client.send('Page.getFrameTree'),
            ]);
            const { frameTree } = result[1];
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_handleFrameTree).call(this, client, frameTree);
            await Promise.all([
                client.send('Page.setLifecycleEventsEnabled', { enabled: true }),
                client.send('Runtime.enable').then(() => {
                    return __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_createIsolatedWorld).call(this, client, UTILITY_WORLD_NAME);
                }),
                // TODO: Network manager is not aware of OOP iframes yet.
                client === __classPrivateFieldGet$w(this, _FrameManager_client, "f")
                    ? __classPrivateFieldGet$w(this, _FrameManager_networkManager, "f").initialize()
                    : Promise.resolve(),
            ]);
        }
        catch (error) {
            // The target might have been closed before the initialization finished.
            if (isErrorLike(error) && isTargetClosedError(error)) {
                return;
            }
            throw error;
        }
    }
    executionContextById(contextId, session = __classPrivateFieldGet$w(this, _FrameManager_client, "f")) {
        const key = `${session.id()}:${contextId}`;
        const context = __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").get(key);
        assert(context, 'INTERNAL ERROR: missing context with id = ' + contextId);
        return context;
    }
    page() {
        return __classPrivateFieldGet$w(this, _FrameManager_page, "f");
    }
    mainFrame() {
        const mainFrame = this._frameTree.getMainFrame();
        assert(mainFrame, 'Requesting main frame too early!');
        return mainFrame;
    }
    frames() {
        return Array.from(this._frameTree.frames());
    }
    frame(frameId) {
        return this._frameTree.getById(frameId) || null;
    }
    onAttachedToTarget(target) {
        if (target._getTargetInfo().type !== 'iframe') {
            return;
        }
        const frame = this.frame(target._getTargetInfo().targetId);
        if (frame) {
            frame.updateClient(target._session());
        }
        this.setupEventListeners(target._session());
        this.initialize(target._session());
    }
    onDetachedFromTarget(target) {
        const frame = this.frame(target._targetId);
        if (frame && frame.isOOPFrame()) {
            // When an OOP iframe is removed from the page, it
            // will only get a Target.detachedFromTarget event.
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, frame);
        }
    }
}
_FrameManager_page = new WeakMap(), _FrameManager_networkManager = new WeakMap(), _FrameManager_timeoutSettings = new WeakMap(), _FrameManager_contextIdToContext = new WeakMap(), _FrameManager_isolatedWorlds = new WeakMap(), _FrameManager_client = new WeakMap(), _FrameManager_instances = new WeakSet(), _FrameManager_onLifecycleEvent = function _FrameManager_onLifecycleEvent(event) {
    const frame = this.frame(event.frameId);
    if (!frame) {
        return;
    }
    frame._onLifecycleEvent(event.loaderId, event.name);
    this.emit(FrameManagerEmittedEvents.LifecycleEvent, frame);
}, _FrameManager_onFrameStartedLoading = function _FrameManager_onFrameStartedLoading(frameId) {
    const frame = this.frame(frameId);
    if (!frame) {
        return;
    }
    frame._onLoadingStarted();
}, _FrameManager_onFrameStoppedLoading = function _FrameManager_onFrameStoppedLoading(frameId) {
    const frame = this.frame(frameId);
    if (!frame) {
        return;
    }
    frame._onLoadingStopped();
    this.emit(FrameManagerEmittedEvents.LifecycleEvent, frame);
}, _FrameManager_handleFrameTree = function _FrameManager_handleFrameTree(session, frameTree) {
    if (frameTree.frame.parentId) {
        __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameAttached).call(this, session, frameTree.frame.id, frameTree.frame.parentId);
    }
    __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigated).call(this, frameTree.frame);
    if (!frameTree.childFrames) {
        return;
    }
    for (const child of frameTree.childFrames) {
        __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_handleFrameTree).call(this, session, child);
    }
}, _FrameManager_onFrameAttached = function _FrameManager_onFrameAttached(session, frameId, parentFrameId) {
    let frame = this.frame(frameId);
    if (frame) {
        if (session && frame.isOOPFrame()) {
            // If an OOP iframes becomes a normal iframe again
            // it is first attached to the parent page before
            // the target is removed.
            frame.updateClient(session);
        }
        return;
    }
    frame = new Frame(this, frameId, parentFrameId, session);
    this._frameTree.addFrame(frame);
    this.emit(FrameManagerEmittedEvents.FrameAttached, frame);
}, _FrameManager_onFrameNavigated = async function _FrameManager_onFrameNavigated(framePayload) {
    const frameId = framePayload.id;
    const isMainFrame = !framePayload.parentId;
    let frame = this._frameTree.getById(frameId);
    // Detach all child frames first.
    if (frame) {
        for (const child of frame.childFrames()) {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, child);
        }
    }
    // Update or create main frame.
    if (isMainFrame) {
        if (frame) {
            // Update frame id to retain frame identity on cross-process navigation.
            this._frameTree.removeFrame(frame);
            frame._id = frameId;
        }
        else {
            // Initial main frame navigation.
            frame = new Frame(this, frameId, undefined, __classPrivateFieldGet$w(this, _FrameManager_client, "f"));
        }
        this._frameTree.addFrame(frame);
    }
    frame = await this._frameTree.waitForFrame(frameId);
    frame._navigated(framePayload);
    this.emit(FrameManagerEmittedEvents.FrameNavigated, frame);
}, _FrameManager_createIsolatedWorld = async function _FrameManager_createIsolatedWorld(session, name) {
    const key = `${session.id()}:${name}`;
    if (__classPrivateFieldGet$w(this, _FrameManager_isolatedWorlds, "f").has(key)) {
        return;
    }
    await session.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `//# sourceURL=${EVALUATION_SCRIPT_URL}`,
        worldName: name,
    });
    await Promise.all(this.frames()
        .filter(frame => {
        return frame._client() === session;
    })
        .map(frame => {
        // Frames might be removed before we send this, so we don't want to
        // throw an error.
        return session
            .send('Page.createIsolatedWorld', {
            frameId: frame._id,
            worldName: name,
            grantUniveralAccess: true,
        })
            .catch(debugError);
    }));
    __classPrivateFieldGet$w(this, _FrameManager_isolatedWorlds, "f").add(key);
}, _FrameManager_onFrameNavigatedWithinDocument = function _FrameManager_onFrameNavigatedWithinDocument(frameId, url) {
    const frame = this.frame(frameId);
    if (!frame) {
        return;
    }
    frame._navigatedWithinDocument(url);
    this.emit(FrameManagerEmittedEvents.FrameNavigatedWithinDocument, frame);
    this.emit(FrameManagerEmittedEvents.FrameNavigated, frame);
}, _FrameManager_onFrameDetached = function _FrameManager_onFrameDetached(frameId, reason) {
    const frame = this.frame(frameId);
    if (reason === 'remove') {
        // Only remove the frame if the reason for the detached event is
        // an actual removement of the frame.
        // For frames that become OOP iframes, the reason would be 'swap'.
        if (frame) {
            __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, frame);
        }
    }
    else if (reason === 'swap') {
        this.emit(FrameManagerEmittedEvents.FrameSwapped, frame);
    }
}, _FrameManager_onExecutionContextCreated = function _FrameManager_onExecutionContextCreated(contextPayload, session) {
    const auxData = contextPayload.auxData;
    const frameId = auxData && auxData.frameId;
    const frame = typeof frameId === 'string' ? this.frame(frameId) : undefined;
    let world;
    if (frame) {
        // Only care about execution contexts created for the current session.
        if (frame._client() !== session) {
            return;
        }
        if (contextPayload.auxData && !!contextPayload.auxData['isDefault']) {
            world = frame.worlds[MAIN_WORLD];
        }
        else if (contextPayload.name === UTILITY_WORLD_NAME &&
            !frame.worlds[PUPPETEER_WORLD].hasContext()) {
            // In case of multiple sessions to the same target, there's a race between
            // connections so we might end up creating multiple isolated worlds.
            // We can use either.
            world = frame.worlds[PUPPETEER_WORLD];
        }
    }
    const context = new ExecutionContext((frame === null || frame === void 0 ? void 0 : frame._client()) || __classPrivateFieldGet$w(this, _FrameManager_client, "f"), contextPayload, world);
    if (world) {
        world.setContext(context);
    }
    const key = `${session.id()}:${contextPayload.id}`;
    __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").set(key, context);
}, _FrameManager_onExecutionContextDestroyed = function _FrameManager_onExecutionContextDestroyed(executionContextId, session) {
    const key = `${session.id()}:${executionContextId}`;
    const context = __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").get(key);
    if (!context) {
        return;
    }
    __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").delete(key);
    if (context._world) {
        context._world.clearContext();
    }
}, _FrameManager_onExecutionContextsCleared = function _FrameManager_onExecutionContextsCleared(session) {
    for (const [key, context] of __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").entries()) {
        // Make sure to only clear execution contexts that belong
        // to the current session.
        if (context._client !== session) {
            continue;
        }
        if (context._world) {
            context._world.clearContext();
        }
        __classPrivateFieldGet$w(this, _FrameManager_contextIdToContext, "f").delete(key);
    }
}, _FrameManager_removeFramesRecursively = function _FrameManager_removeFramesRecursively(frame) {
    for (const child of frame.childFrames()) {
        __classPrivateFieldGet$w(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, child);
    }
    frame._detach();
    this._frameTree.removeFrame(frame);
    this.emit(FrameManagerEmittedEvents.FrameDetached, frame);
};

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$u = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$v = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LifecycleWatcher_instances, _LifecycleWatcher_expectedLifecycle, _LifecycleWatcher_frameManager, _LifecycleWatcher_frame, _LifecycleWatcher_timeout, _LifecycleWatcher_navigationRequest, _LifecycleWatcher_eventListeners, _LifecycleWatcher_initialLoaderId, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, _LifecycleWatcher_sameDocumentNavigationPromise, _LifecycleWatcher_lifecycleCallback, _LifecycleWatcher_lifecyclePromise, _LifecycleWatcher_newDocumentNavigationCompleteCallback, _LifecycleWatcher_newDocumentNavigationPromise, _LifecycleWatcher_terminationCallback, _LifecycleWatcher_terminationPromise, _LifecycleWatcher_timeoutPromise, _LifecycleWatcher_maximumTimer, _LifecycleWatcher_hasSameDocumentNavigation, _LifecycleWatcher_swapped, _LifecycleWatcher_navigationResponseReceived, _LifecycleWatcher_onRequest, _LifecycleWatcher_onRequestFailed, _LifecycleWatcher_onResponse, _LifecycleWatcher_onFrameDetached, _LifecycleWatcher_terminate, _LifecycleWatcher_createTimeoutPromise, _LifecycleWatcher_navigatedWithinDocument, _LifecycleWatcher_navigated, _LifecycleWatcher_frameSwapped, _LifecycleWatcher_checkLifecycleComplete;
const puppeteerToProtocolLifecycle = new Map([
    ['load', 'load'],
    ['domcontentloaded', 'DOMContentLoaded'],
    ['networkidle0', 'networkIdle'],
    ['networkidle2', 'networkAlmostIdle'],
]);
const noop = () => { };
/**
 * @internal
 */
class LifecycleWatcher {
    constructor(frameManager, frame, waitUntil, timeout) {
        _LifecycleWatcher_instances.add(this);
        _LifecycleWatcher_expectedLifecycle.set(this, void 0);
        _LifecycleWatcher_frameManager.set(this, void 0);
        _LifecycleWatcher_frame.set(this, void 0);
        _LifecycleWatcher_timeout.set(this, void 0);
        _LifecycleWatcher_navigationRequest.set(this, null);
        _LifecycleWatcher_eventListeners.set(this, void 0);
        _LifecycleWatcher_initialLoaderId.set(this, void 0);
        _LifecycleWatcher_sameDocumentNavigationCompleteCallback.set(this, noop);
        _LifecycleWatcher_sameDocumentNavigationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$u(this, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, fulfill, "f");
        }));
        _LifecycleWatcher_lifecycleCallback.set(this, noop);
        _LifecycleWatcher_lifecyclePromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$u(this, _LifecycleWatcher_lifecycleCallback, fulfill, "f");
        }));
        _LifecycleWatcher_newDocumentNavigationCompleteCallback.set(this, noop);
        _LifecycleWatcher_newDocumentNavigationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$u(this, _LifecycleWatcher_newDocumentNavigationCompleteCallback, fulfill, "f");
        }));
        _LifecycleWatcher_terminationCallback.set(this, noop);
        _LifecycleWatcher_terminationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$u(this, _LifecycleWatcher_terminationCallback, fulfill, "f");
        }));
        _LifecycleWatcher_timeoutPromise.set(this, void 0);
        _LifecycleWatcher_maximumTimer.set(this, void 0);
        _LifecycleWatcher_hasSameDocumentNavigation.set(this, void 0);
        _LifecycleWatcher_swapped.set(this, void 0);
        _LifecycleWatcher_navigationResponseReceived.set(this, void 0);
        if (Array.isArray(waitUntil)) {
            waitUntil = waitUntil.slice();
        }
        else if (typeof waitUntil === 'string') {
            waitUntil = [waitUntil];
        }
        __classPrivateFieldSet$u(this, _LifecycleWatcher_initialLoaderId, frame._loaderId, "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_expectedLifecycle, waitUntil.map(value => {
            const protocolEvent = puppeteerToProtocolLifecycle.get(value);
            assert(protocolEvent, 'Unknown value for options.waitUntil: ' + value);
            return protocolEvent;
        }), "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_frameManager, frameManager, "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_frame, frame, "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_timeout, timeout, "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_eventListeners, [
            addEventListener(frameManager.client, CDPSessionEmittedEvents.Disconnected, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_terminate).bind(this, new Error('Navigation failed because browser has disconnected!'))),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.LifecycleEvent, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigatedWithinDocument, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigatedWithinDocument).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigated, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigated).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameSwapped, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_frameSwapped).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameDetached, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onFrameDetached).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Request, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onRequest).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Response, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onResponse).bind(this)),
            addEventListener(__classPrivateFieldGet$v(this, _LifecycleWatcher_frameManager, "f").networkManager, NetworkManagerEmittedEvents.RequestFailed, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onRequestFailed).bind(this)),
        ], "f");
        __classPrivateFieldSet$u(this, _LifecycleWatcher_timeoutPromise, __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_createTimeoutPromise).call(this), "f");
        __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
    }
    async navigationResponse() {
        var _a;
        // Continue with a possibly null response.
        await ((_a = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _a === void 0 ? void 0 : _a.catch(() => { }));
        return __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationRequest, "f") ? __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationRequest, "f").response() : null;
    }
    sameDocumentNavigationPromise() {
        return __classPrivateFieldGet$v(this, _LifecycleWatcher_sameDocumentNavigationPromise, "f");
    }
    newDocumentNavigationPromise() {
        return __classPrivateFieldGet$v(this, _LifecycleWatcher_newDocumentNavigationPromise, "f");
    }
    lifecyclePromise() {
        return __classPrivateFieldGet$v(this, _LifecycleWatcher_lifecyclePromise, "f");
    }
    timeoutOrTerminationPromise() {
        return Promise.race([__classPrivateFieldGet$v(this, _LifecycleWatcher_timeoutPromise, "f"), __classPrivateFieldGet$v(this, _LifecycleWatcher_terminationPromise, "f")]);
    }
    dispose() {
        removeEventListeners(__classPrivateFieldGet$v(this, _LifecycleWatcher_eventListeners, "f"));
        __classPrivateFieldGet$v(this, _LifecycleWatcher_maximumTimer, "f") !== undefined && clearTimeout(__classPrivateFieldGet$v(this, _LifecycleWatcher_maximumTimer, "f"));
    }
}
_LifecycleWatcher_expectedLifecycle = new WeakMap(), _LifecycleWatcher_frameManager = new WeakMap(), _LifecycleWatcher_frame = new WeakMap(), _LifecycleWatcher_timeout = new WeakMap(), _LifecycleWatcher_navigationRequest = new WeakMap(), _LifecycleWatcher_eventListeners = new WeakMap(), _LifecycleWatcher_initialLoaderId = new WeakMap(), _LifecycleWatcher_sameDocumentNavigationCompleteCallback = new WeakMap(), _LifecycleWatcher_sameDocumentNavigationPromise = new WeakMap(), _LifecycleWatcher_lifecycleCallback = new WeakMap(), _LifecycleWatcher_lifecyclePromise = new WeakMap(), _LifecycleWatcher_newDocumentNavigationCompleteCallback = new WeakMap(), _LifecycleWatcher_newDocumentNavigationPromise = new WeakMap(), _LifecycleWatcher_terminationCallback = new WeakMap(), _LifecycleWatcher_terminationPromise = new WeakMap(), _LifecycleWatcher_timeoutPromise = new WeakMap(), _LifecycleWatcher_maximumTimer = new WeakMap(), _LifecycleWatcher_hasSameDocumentNavigation = new WeakMap(), _LifecycleWatcher_swapped = new WeakMap(), _LifecycleWatcher_navigationResponseReceived = new WeakMap(), _LifecycleWatcher_instances = new WeakSet(), _LifecycleWatcher_onRequest = function _LifecycleWatcher_onRequest(request) {
    var _a, _b;
    if (request.frame() !== __classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f") || !request.isNavigationRequest()) {
        return;
    }
    __classPrivateFieldSet$u(this, _LifecycleWatcher_navigationRequest, request, "f");
    // Resolve previous navigation response in case there are multiple
    // navigation requests reported by the backend. This generally should not
    // happen by it looks like it's possible.
    (_a = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _a === void 0 ? void 0 : _a.resolve();
    __classPrivateFieldSet$u(this, _LifecycleWatcher_navigationResponseReceived, createDeferredPromise(), "f");
    if (request.response() !== null) {
        (_b = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _b === void 0 ? void 0 : _b.resolve();
    }
}, _LifecycleWatcher_onRequestFailed = function _LifecycleWatcher_onRequestFailed(request) {
    var _a, _b;
    if (((_a = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationRequest, "f")) === null || _a === void 0 ? void 0 : _a._requestId) !== request._requestId) {
        return;
    }
    (_b = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _b === void 0 ? void 0 : _b.resolve();
}, _LifecycleWatcher_onResponse = function _LifecycleWatcher_onResponse(response) {
    var _a, _b;
    if (((_a = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationRequest, "f")) === null || _a === void 0 ? void 0 : _a._requestId) !== response.request()._requestId) {
        return;
    }
    (_b = __classPrivateFieldGet$v(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _b === void 0 ? void 0 : _b.resolve();
}, _LifecycleWatcher_onFrameDetached = function _LifecycleWatcher_onFrameDetached(frame) {
    if (__classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f") === frame) {
        __classPrivateFieldGet$v(this, _LifecycleWatcher_terminationCallback, "f").call(null, new Error('Navigating frame was detached'));
        return;
    }
    __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_terminate = function _LifecycleWatcher_terminate(error) {
    __classPrivateFieldGet$v(this, _LifecycleWatcher_terminationCallback, "f").call(null, error);
}, _LifecycleWatcher_createTimeoutPromise = async function _LifecycleWatcher_createTimeoutPromise() {
    if (!__classPrivateFieldGet$v(this, _LifecycleWatcher_timeout, "f")) {
        return new Promise(noop);
    }
    const errorMessage = 'Navigation timeout of ' + __classPrivateFieldGet$v(this, _LifecycleWatcher_timeout, "f") + ' ms exceeded';
    await new Promise(fulfill => {
        return (__classPrivateFieldSet$u(this, _LifecycleWatcher_maximumTimer, setTimeout(fulfill, __classPrivateFieldGet$v(this, _LifecycleWatcher_timeout, "f")), "f"));
    });
    return new TimeoutError(errorMessage);
}, _LifecycleWatcher_navigatedWithinDocument = function _LifecycleWatcher_navigatedWithinDocument(frame) {
    if (frame !== __classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldSet$u(this, _LifecycleWatcher_hasSameDocumentNavigation, true, "f");
    __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_navigated = function _LifecycleWatcher_navigated(frame) {
    if (frame !== __classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_frameSwapped = function _LifecycleWatcher_frameSwapped(frame) {
    if (frame !== __classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldSet$u(this, _LifecycleWatcher_swapped, true, "f");
    __classPrivateFieldGet$v(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_checkLifecycleComplete = function _LifecycleWatcher_checkLifecycleComplete() {
    // We expect navigation to commit.
    if (!checkLifecycle(__classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f"), __classPrivateFieldGet$v(this, _LifecycleWatcher_expectedLifecycle, "f"))) {
        return;
    }
    __classPrivateFieldGet$v(this, _LifecycleWatcher_lifecycleCallback, "f").call(this);
    if (__classPrivateFieldGet$v(this, _LifecycleWatcher_hasSameDocumentNavigation, "f")) {
        __classPrivateFieldGet$v(this, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, "f").call(this);
    }
    if (__classPrivateFieldGet$v(this, _LifecycleWatcher_swapped, "f") || __classPrivateFieldGet$v(this, _LifecycleWatcher_frame, "f")._loaderId !== __classPrivateFieldGet$v(this, _LifecycleWatcher_initialLoaderId, "f")) {
        __classPrivateFieldGet$v(this, _LifecycleWatcher_newDocumentNavigationCompleteCallback, "f").call(this);
    }
    function checkLifecycle(frame, expectedLifecycle) {
        for (const event of expectedLifecycle) {
            if (!frame._lifecycleEvents.has(event)) {
                return false;
            }
        }
        for (const child of frame.childFrames()) {
            if (child._hasStartedLoading &&
                !checkLifecycle(child, expectedLifecycle)) {
                return false;
            }
        }
        return true;
    }
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$t = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$u = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WaitTask_world, _WaitTask_bindings, _WaitTask_polling, _WaitTask_root, _WaitTask_fn, _WaitTask_args, _WaitTask_timeout, _WaitTask_result, _WaitTask_poller, _TaskManager_tasks;
/**
 * @internal
 */
class WaitTask {
    constructor(world, options, fn, ...args) {
        var _a;
        _WaitTask_world.set(this, void 0);
        _WaitTask_bindings.set(this, void 0);
        _WaitTask_polling.set(this, void 0);
        _WaitTask_root.set(this, void 0);
        _WaitTask_fn.set(this, void 0);
        _WaitTask_args.set(this, void 0);
        _WaitTask_timeout.set(this, void 0);
        _WaitTask_result.set(this, createDeferredPromise());
        _WaitTask_poller.set(this, void 0);
        __classPrivateFieldSet$t(this, _WaitTask_world, world, "f");
        __classPrivateFieldSet$t(this, _WaitTask_bindings, (_a = options.bindings) !== null && _a !== void 0 ? _a : new Map(), "f");
        __classPrivateFieldSet$t(this, _WaitTask_polling, options.polling, "f");
        __classPrivateFieldSet$t(this, _WaitTask_root, options.root, "f");
        switch (typeof fn) {
            case 'string':
                __classPrivateFieldSet$t(this, _WaitTask_fn, `() => {return (${fn});}`, "f");
                break;
            default:
                __classPrivateFieldSet$t(this, _WaitTask_fn, fn.toString(), "f");
                break;
        }
        __classPrivateFieldSet$t(this, _WaitTask_args, args, "f");
        __classPrivateFieldGet$u(this, _WaitTask_world, "f").taskManager.add(this);
        if (options.timeout) {
            __classPrivateFieldSet$t(this, _WaitTask_timeout, setTimeout(() => {
                this.terminate(new TimeoutError(`Waiting failed: ${options.timeout}ms exceeded`));
            }, options.timeout), "f");
        }
        if (__classPrivateFieldGet$u(this, _WaitTask_bindings, "f").size !== 0) {
            for (const [name, fn] of __classPrivateFieldGet$u(this, _WaitTask_bindings, "f")) {
                __classPrivateFieldGet$u(this, _WaitTask_world, "f")._boundFunctions.set(name, fn);
            }
        }
        this.rerun();
    }
    get result() {
        return __classPrivateFieldGet$u(this, _WaitTask_result, "f");
    }
    async rerun() {
        try {
            if (__classPrivateFieldGet$u(this, _WaitTask_bindings, "f").size !== 0) {
                const context = await __classPrivateFieldGet$u(this, _WaitTask_world, "f").executionContext();
                await Promise.all([...__classPrivateFieldGet$u(this, _WaitTask_bindings, "f")].map(async ([name]) => {
                    return await __classPrivateFieldGet$u(this, _WaitTask_world, "f")._addBindingToContext(context, name);
                }));
            }
            switch (__classPrivateFieldGet$u(this, _WaitTask_polling, "f")) {
                case 'raf':
                    __classPrivateFieldSet$t(this, _WaitTask_poller, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").evaluateHandle(({ RAFPoller, createFunction }, fn, ...args) => {
                        const fun = createFunction(fn);
                        return new RAFPoller(() => {
                            return fun(...args);
                        });
                    }, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").puppeteerUtil, __classPrivateFieldGet$u(this, _WaitTask_fn, "f"), ...__classPrivateFieldGet$u(this, _WaitTask_args, "f")), "f");
                    break;
                case 'mutation':
                    __classPrivateFieldSet$t(this, _WaitTask_poller, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").evaluateHandle(({ MutationPoller, createFunction }, root, fn, ...args) => {
                        const fun = createFunction(fn);
                        return new MutationPoller(() => {
                            return fun(...args);
                        }, root || document);
                    }, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").puppeteerUtil, __classPrivateFieldGet$u(this, _WaitTask_root, "f"), __classPrivateFieldGet$u(this, _WaitTask_fn, "f"), ...__classPrivateFieldGet$u(this, _WaitTask_args, "f")), "f");
                    break;
                default:
                    __classPrivateFieldSet$t(this, _WaitTask_poller, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").evaluateHandle(({ IntervalPoller, createFunction }, ms, fn, ...args) => {
                        const fun = createFunction(fn);
                        return new IntervalPoller(() => {
                            return fun(...args);
                        }, ms);
                    }, await __classPrivateFieldGet$u(this, _WaitTask_world, "f").puppeteerUtil, __classPrivateFieldGet$u(this, _WaitTask_polling, "f"), __classPrivateFieldGet$u(this, _WaitTask_fn, "f"), ...__classPrivateFieldGet$u(this, _WaitTask_args, "f")), "f");
                    break;
            }
            await __classPrivateFieldGet$u(this, _WaitTask_poller, "f").evaluate(poller => {
                poller.start();
            });
            const result = await __classPrivateFieldGet$u(this, _WaitTask_poller, "f").evaluateHandle(poller => {
                return poller.result();
            });
            __classPrivateFieldGet$u(this, _WaitTask_result, "f").resolve(result);
            await this.terminate();
        }
        catch (error) {
            const badError = this.getBadError(error);
            if (badError) {
                await this.terminate(badError);
            }
        }
    }
    async terminate(error) {
        __classPrivateFieldGet$u(this, _WaitTask_world, "f").taskManager.delete(this);
        if (__classPrivateFieldGet$u(this, _WaitTask_timeout, "f")) {
            clearTimeout(__classPrivateFieldGet$u(this, _WaitTask_timeout, "f"));
        }
        if (error && !__classPrivateFieldGet$u(this, _WaitTask_result, "f").finished()) {
            __classPrivateFieldGet$u(this, _WaitTask_result, "f").reject(error);
        }
        if (__classPrivateFieldGet$u(this, _WaitTask_poller, "f")) {
            try {
                await __classPrivateFieldGet$u(this, _WaitTask_poller, "f").evaluateHandle(async (poller) => {
                    await poller.stop();
                });
                if (__classPrivateFieldGet$u(this, _WaitTask_poller, "f")) {
                    await __classPrivateFieldGet$u(this, _WaitTask_poller, "f").dispose();
                    __classPrivateFieldSet$t(this, _WaitTask_poller, undefined, "f");
                }
            }
            catch {
                // Ignore errors since they most likely come from low-level cleanup.
            }
        }
    }
    /**
     * Not all errors lead to termination. They usually imply we need to rerun the task.
     */
    getBadError(error) {
        if (error instanceof Error) {
            // When frame is detached the task should have been terminated by the IsolatedWorld.
            // This can fail if we were adding this task while the frame was detached,
            // so we terminate here instead.
            if (error.message.includes('Execution context is not available in detached frame')) {
                return new Error('Waiting failed: Frame detached');
            }
            // When the page is navigated, the promise is rejected.
            // We will try again in the new execution context.
            if (error.message.includes('Execution context was destroyed')) {
                return;
            }
            // We could have tried to evaluate in a context which was already
            // destroyed.
            if (error.message.includes('Cannot find context with specified id')) {
                return;
            }
        }
        return error;
    }
}
_WaitTask_world = new WeakMap(), _WaitTask_bindings = new WeakMap(), _WaitTask_polling = new WeakMap(), _WaitTask_root = new WeakMap(), _WaitTask_fn = new WeakMap(), _WaitTask_args = new WeakMap(), _WaitTask_timeout = new WeakMap(), _WaitTask_result = new WeakMap(), _WaitTask_poller = new WeakMap();
/**
 * @internal
 */
class TaskManager {
    constructor() {
        _TaskManager_tasks.set(this, new Set());
    }
    add(task) {
        __classPrivateFieldGet$u(this, _TaskManager_tasks, "f").add(task);
    }
    delete(task) {
        __classPrivateFieldGet$u(this, _TaskManager_tasks, "f").delete(task);
    }
    terminateAll(error) {
        for (const task of __classPrivateFieldGet$u(this, _TaskManager_tasks, "f")) {
            task.terminate(error);
        }
        __classPrivateFieldGet$u(this, _TaskManager_tasks, "f").clear();
    }
    async rerunAll() {
        await Promise.all([...__classPrivateFieldGet$u(this, _TaskManager_tasks, "f")].map(task => {
            return task.rerun();
        }));
    }
}
_TaskManager_tasks = new WeakMap();

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$s = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$t = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _IsolatedWorld_instances, _a, _IsolatedWorld_frame, _IsolatedWorld_document, _IsolatedWorld_context, _IsolatedWorld_detached, _IsolatedWorld_ctxBindings, _IsolatedWorld_boundFunctions, _IsolatedWorld_taskManager, _IsolatedWorld_puppeteerUtil, _IsolatedWorld_bindingIdentifier, _IsolatedWorld_client_get, _IsolatedWorld_frameManager_get, _IsolatedWorld_timeoutSettings_get, _IsolatedWorld_injectPuppeteerUtil, _IsolatedWorld_settingUpBinding, _IsolatedWorld_onBindingCalled;
/**
 * @internal
 */
class IsolatedWorld {
    constructor(frame) {
        _IsolatedWorld_instances.add(this);
        _IsolatedWorld_frame.set(this, void 0);
        _IsolatedWorld_document.set(this, void 0);
        _IsolatedWorld_context.set(this, createDeferredPromise());
        _IsolatedWorld_detached.set(this, false);
        // Set of bindings that have been registered in the current context.
        _IsolatedWorld_ctxBindings.set(this, new Set());
        // Contains mapping from functions that should be bound to Puppeteer functions.
        _IsolatedWorld_boundFunctions.set(this, new Map());
        _IsolatedWorld_taskManager.set(this, new TaskManager());
        _IsolatedWorld_puppeteerUtil.set(this, createDeferredPromise());
        // If multiple waitFor are set up asynchronously, we need to wait for the
        // first one to set up the binding in the page before running the others.
        _IsolatedWorld_settingUpBinding.set(this, null);
        _IsolatedWorld_onBindingCalled.set(this, async (event) => {
            let payload;
            if (!this.hasContext()) {
                return;
            }
            const context = await this.executionContext();
            try {
                payload = JSON.parse(event.payload);
            }
            catch {
                // The binding was either called by something in the page or it was
                // called before our wrapper was initialized.
                return;
            }
            const { type, name, seq, args } = payload;
            if (type !== 'internal' ||
                !__classPrivateFieldGet$t(this, _IsolatedWorld_ctxBindings, "f").has(__classPrivateFieldGet$t(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId))) {
                return;
            }
            if (context._contextId !== event.executionContextId) {
                return;
            }
            try {
                const fn = this._boundFunctions.get(name);
                if (!fn) {
                    throw new Error(`Bound function $name is not found`);
                }
                const result = await fn(...args);
                await context.evaluate((name, seq, result) => {
                    // @ts-expect-error Code is evaluated in a different context.
                    const callbacks = self[name].callbacks;
                    callbacks.get(seq).resolve(result);
                    callbacks.delete(seq);
                }, name, seq, result);
            }
            catch (error) {
                // The WaitTask may already have been resolved by timing out, or the
                // exection context may have been destroyed.
                // In both caes, the promises above are rejected with a protocol error.
                // We can safely ignores these, as the WaitTask is re-installed in
                // the next execution context if needed.
                if (error.message.includes('Protocol error')) {
                    return;
                }
                debugError(error);
            }
        });
        // Keep own reference to client because it might differ from the FrameManager's
        // client for OOP iframes.
        __classPrivateFieldSet$s(this, _IsolatedWorld_frame, frame, "f");
        __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).on('Runtime.bindingCalled', __classPrivateFieldGet$t(this, _IsolatedWorld_onBindingCalled, "f"));
    }
    get puppeteerUtil() {
        return __classPrivateFieldGet$t(this, _IsolatedWorld_puppeteerUtil, "f");
    }
    get taskManager() {
        return __classPrivateFieldGet$t(this, _IsolatedWorld_taskManager, "f");
    }
    get _boundFunctions() {
        return __classPrivateFieldGet$t(this, _IsolatedWorld_boundFunctions, "f");
    }
    frame() {
        return __classPrivateFieldGet$t(this, _IsolatedWorld_frame, "f");
    }
    clearContext() {
        __classPrivateFieldSet$s(this, _IsolatedWorld_document, undefined, "f");
        __classPrivateFieldSet$s(this, _IsolatedWorld_puppeteerUtil, createDeferredPromise(), "f");
        __classPrivateFieldSet$s(this, _IsolatedWorld_context, createDeferredPromise(), "f");
    }
    setContext(context) {
        __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "m", _IsolatedWorld_injectPuppeteerUtil).call(this, context);
        __classPrivateFieldGet$t(this, _IsolatedWorld_ctxBindings, "f").clear();
        __classPrivateFieldGet$t(this, _IsolatedWorld_context, "f").resolve(context);
    }
    hasContext() {
        return __classPrivateFieldGet$t(this, _IsolatedWorld_context, "f").resolved();
    }
    _detach() {
        __classPrivateFieldSet$s(this, _IsolatedWorld_detached, true, "f");
        __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).off('Runtime.bindingCalled', __classPrivateFieldGet$t(this, _IsolatedWorld_onBindingCalled, "f"));
        __classPrivateFieldGet$t(this, _IsolatedWorld_taskManager, "f").terminateAll(new Error('waitForFunction failed: frame got detached.'));
    }
    executionContext() {
        if (__classPrivateFieldGet$t(this, _IsolatedWorld_detached, "f")) {
            throw new Error(`Execution context is not available in detached frame "${__classPrivateFieldGet$t(this, _IsolatedWorld_frame, "f").url()}" (are you trying to evaluate?)`);
        }
        if (__classPrivateFieldGet$t(this, _IsolatedWorld_context, "f") === null) {
            throw new Error(`Execution content promise is missing`);
        }
        return __classPrivateFieldGet$t(this, _IsolatedWorld_context, "f");
    }
    async evaluateHandle(pageFunction, ...args) {
        const context = await this.executionContext();
        return context.evaluateHandle(pageFunction, ...args);
    }
    async evaluate(pageFunction, ...args) {
        const context = await this.executionContext();
        return context.evaluate(pageFunction, ...args);
    }
    async $(selector) {
        const document = await this.document();
        return document.$(selector);
    }
    async $$(selector) {
        const document = await this.document();
        return document.$$(selector);
    }
    async document() {
        if (__classPrivateFieldGet$t(this, _IsolatedWorld_document, "f")) {
            return __classPrivateFieldGet$t(this, _IsolatedWorld_document, "f");
        }
        const context = await this.executionContext();
        __classPrivateFieldSet$s(this, _IsolatedWorld_document, await context.evaluateHandle(() => {
            return document;
        }), "f");
        return __classPrivateFieldGet$t(this, _IsolatedWorld_document, "f");
    }
    async $x(expression) {
        const document = await this.document();
        return document.$x(expression);
    }
    async $eval(selector, pageFunction, ...args) {
        const document = await this.document();
        return document.$eval(selector, pageFunction, ...args);
    }
    async $$eval(selector, pageFunction, ...args) {
        const document = await this.document();
        return document.$$eval(selector, pageFunction, ...args);
    }
    async content() {
        return await this.evaluate(() => {
            let retVal = '';
            if (document.doctype) {
                retVal = new XMLSerializer().serializeToString(document.doctype);
            }
            if (document.documentElement) {
                retVal += document.documentElement.outerHTML;
            }
            return retVal;
        });
    }
    async setContent(html, options = {}) {
        const { waitUntil = ['load'], timeout = __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).navigationTimeout(), } = options;
        // We rely upon the fact that document.open() will reset frame lifecycle with "init"
        // lifecycle event. @see https://crrev.com/608658
        await this.evaluate(html => {
            document.open();
            document.write(html);
            document.close();
        }, html);
        const watcher = new LifecycleWatcher(__classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_frameManager_get), __classPrivateFieldGet$t(this, _IsolatedWorld_frame, "f"), waitUntil, timeout);
        const error = await Promise.race([
            watcher.timeoutOrTerminationPromise(),
            watcher.lifecyclePromise(),
        ]);
        watcher.dispose();
        if (error) {
            throw error;
        }
    }
    async click(selector, options) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.click(options);
        await handle.dispose();
    }
    async focus(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.focus();
        await handle.dispose();
    }
    async hover(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.hover();
        await handle.dispose();
    }
    async select(selector, ...values) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        const result = await handle.select(...values);
        await handle.dispose();
        return result;
    }
    async tap(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.tap();
        await handle.dispose();
    }
    async type(selector, text, options) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.type(text, options);
        await handle.dispose();
    }
    async _addBindingToContext(context, name) {
        // Previous operation added the binding so we are done.
        if (__classPrivateFieldGet$t(this, _IsolatedWorld_ctxBindings, "f").has(__classPrivateFieldGet$t(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId))) {
            return;
        }
        // Wait for other operation to finish
        if (__classPrivateFieldGet$t(this, _IsolatedWorld_settingUpBinding, "f")) {
            await __classPrivateFieldGet$t(this, _IsolatedWorld_settingUpBinding, "f");
            return this._addBindingToContext(context, name);
        }
        const bind = async (name) => {
            const expression = pageBindingInitString('internal', name);
            try {
                // TODO: In theory, it would be enough to call this just once
                await context._client.send('Runtime.addBinding', {
                    name,
                    executionContextName: context._contextName,
                });
                await context.evaluate(expression);
            }
            catch (error) {
                // We could have tried to evaluate in a context which was already
                // destroyed. This happens, for example, if the page is navigated while
                // we are trying to add the binding
                if (error instanceof Error) {
                    // Destroyed context.
                    if (error.message.includes('Execution context was destroyed')) {
                        return;
                    }
                    // Missing context.
                    if (error.message.includes('Cannot find context with specified id')) {
                        return;
                    }
                }
                debugError(error);
                return;
            }
            __classPrivateFieldGet$t(this, _IsolatedWorld_ctxBindings, "f").add(__classPrivateFieldGet$t(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId));
        };
        __classPrivateFieldSet$s(this, _IsolatedWorld_settingUpBinding, bind(name), "f");
        await __classPrivateFieldGet$t(this, _IsolatedWorld_settingUpBinding, "f");
        __classPrivateFieldSet$s(this, _IsolatedWorld_settingUpBinding, null, "f");
    }
    async _waitForSelectorInPage(queryOne, root, selector, options, bindings = new Map()) {
        const { visible: waitForVisible = false, hidden: waitForHidden = false, timeout = __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).timeout(), } = options;
        try {
            const handle = await this.waitForFunction(async (PuppeteerUtil, query, selector, root, visible) => {
                if (!PuppeteerUtil) {
                    return;
                }
                const node = (await PuppeteerUtil.createFunction(query)(root || document, selector, PuppeteerUtil));
                return PuppeteerUtil.checkVisibility(node, visible);
            }, {
                bindings,
                polling: waitForVisible || waitForHidden ? 'raf' : 'mutation',
                root,
                timeout,
            }, new LazyArg(async () => {
                try {
                    // In case CDP fails.
                    return await this.puppeteerUtil;
                }
                catch {
                    return undefined;
                }
            }), queryOne.toString(), selector, root, waitForVisible ? true : waitForHidden ? false : undefined);
            const elementHandle = handle.asElement();
            if (!elementHandle) {
                await handle.dispose();
                return null;
            }
            return elementHandle;
        }
        catch (error) {
            if (!isErrorLike(error)) {
                throw error;
            }
            error.message = `Waiting for selector \`${selector}\` failed: ${error.message}`;
            throw error;
        }
    }
    waitForFunction(pageFunction, options = {}, ...args) {
        const { polling = 'raf', timeout = __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).timeout(), bindings, root, } = options;
        if (typeof polling === 'number' && polling < 0) {
            throw new Error('Cannot poll with non-positive interval');
        }
        const waitTask = new WaitTask(this, {
            bindings,
            polling,
            root,
            timeout,
        }, pageFunction, ...args);
        return waitTask.result;
    }
    async title() {
        return this.evaluate(() => {
            return document.title;
        });
    }
    async adoptBackendNode(backendNodeId) {
        const executionContext = await this.executionContext();
        const { object } = await __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).send('DOM.resolveNode', {
            backendNodeId: backendNodeId,
            executionContextId: executionContext._contextId,
        });
        return createJSHandle(executionContext, object);
    }
    async adoptHandle(handle) {
        const executionContext = await this.executionContext();
        assert(handle.executionContext() !== executionContext, 'Cannot adopt handle that already belongs to this execution context');
        const nodeInfo = await __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).send('DOM.describeNode', {
            objectId: handle.remoteObject().objectId,
        });
        return (await this.adoptBackendNode(nodeInfo.node.backendNodeId));
    }
    async transferHandle(handle) {
        const result = await this.adoptHandle(handle);
        await handle.dispose();
        return result;
    }
}
_a = IsolatedWorld, _IsolatedWorld_frame = new WeakMap(), _IsolatedWorld_document = new WeakMap(), _IsolatedWorld_context = new WeakMap(), _IsolatedWorld_detached = new WeakMap(), _IsolatedWorld_ctxBindings = new WeakMap(), _IsolatedWorld_boundFunctions = new WeakMap(), _IsolatedWorld_taskManager = new WeakMap(), _IsolatedWorld_puppeteerUtil = new WeakMap(), _IsolatedWorld_settingUpBinding = new WeakMap(), _IsolatedWorld_onBindingCalled = new WeakMap(), _IsolatedWorld_instances = new WeakSet(), _IsolatedWorld_client_get = function _IsolatedWorld_client_get() {
    return __classPrivateFieldGet$t(this, _IsolatedWorld_frame, "f")._client();
}, _IsolatedWorld_frameManager_get = function _IsolatedWorld_frameManager_get() {
    return __classPrivateFieldGet$t(this, _IsolatedWorld_frame, "f")._frameManager;
}, _IsolatedWorld_timeoutSettings_get = function _IsolatedWorld_timeoutSettings_get() {
    return __classPrivateFieldGet$t(this, _IsolatedWorld_instances, "a", _IsolatedWorld_frameManager_get).timeoutSettings;
}, _IsolatedWorld_injectPuppeteerUtil = async function _IsolatedWorld_injectPuppeteerUtil(context) {
    try {
        __classPrivateFieldGet$t(this, _IsolatedWorld_puppeteerUtil, "f").resolve((await context.evaluateHandle(`(() => {
              const module = {};
              ${source}
              return module.exports.default;
            })()`)));
        __classPrivateFieldGet$t(this, _IsolatedWorld_taskManager, "f").rerunAll();
    }
    catch (error) {
        debugError(error);
    }
};
_IsolatedWorld_bindingIdentifier = { value: (name, contextId) => {
        return `${name}_${contextId}`;
    } };

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$r = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$s = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Frame_url, _Frame_detached, _Frame_client;
/**
 * Represents a DOM frame.
 *
 * To understand frames, you can think of frames as `<iframe>` elements. Just
 * like iframes, frames can be nested, and when JavaScript is executed in a
 * frame, the JavaScript does not effect frames inside the ambient frame the
 * JavaScript executes in.
 *
 * @example
 * At any point in time, {@link Page | pages} expose their current frame
 * tree via the {@link Page.mainFrame} and {@link Frame.childFrames} methods.
 *
 * @example
 * An example of dumping frame tree:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://www.google.com/chrome/browser/canary.html');
 *   dumpFrameTree(page.mainFrame(), '');
 *   await browser.close();
 *
 *   function dumpFrameTree(frame, indent) {
 *     console.log(indent + frame.url());
 *     for (const child of frame.childFrames()) {
 *       dumpFrameTree(child, indent + '  ');
 *     }
 *   }
 * })();
 * ```
 *
 * @example
 * An example of getting text from an iframe element:
 *
 * ```ts
 * const frame = page.frames().find(frame => frame.name() === 'myframe');
 * const text = await frame.$eval('.selector', element => element.textContent);
 * console.log(text);
 * ```
 *
 * @remarks
 * Frame lifecycles are controlled by three events that are all dispatched on
 * the parent {@link Frame.page | page}:
 *
 * - {@link PageEmittedEvents.FrameAttached}
 * - {@link PageEmittedEvents.FrameNavigated}
 * - {@link PageEmittedEvents.FrameDetached}
 *
 * @public
 */
class Frame {
    /**
     * @internal
     */
    constructor(frameManager, frameId, parentFrameId, client) {
        _Frame_url.set(this, '');
        _Frame_detached.set(this, false);
        _Frame_client.set(this, void 0);
        /**
         * @internal
         */
        this._loaderId = '';
        /**
         * @internal
         */
        this._hasStartedLoading = false;
        /**
         * @internal
         */
        this._lifecycleEvents = new Set();
        this._frameManager = frameManager;
        __classPrivateFieldSet$r(this, _Frame_url, '', "f");
        this._id = frameId;
        this._parentId = parentFrameId;
        __classPrivateFieldSet$r(this, _Frame_detached, false, "f");
        this._loaderId = '';
        this.updateClient(client);
    }
    /**
     * @internal
     */
    updateClient(client) {
        __classPrivateFieldSet$r(this, _Frame_client, client, "f");
        this.worlds = {
            [MAIN_WORLD]: new IsolatedWorld(this),
            [PUPPETEER_WORLD]: new IsolatedWorld(this),
        };
    }
    /**
     * @returns The page associated with the frame.
     */
    page() {
        return this._frameManager.page();
    }
    /**
     * @returns `true` if the frame is an out-of-process (OOP) frame. Otherwise,
     * `false`.
     */
    isOOPFrame() {
        return __classPrivateFieldGet$s(this, _Frame_client, "f") !== this._frameManager.client;
    }
    /**
     * Navigates a frame to the given url.
     *
     * @remarks
     * Navigation to `about:blank` or navigation to the same URL with a different
     * hash will succeed and return `null`.
     *
     * :::warning
     *
     * Headless mode doesn't support navigation to a PDF document. See the {@link
     * https://bugs.chromium.org/p/chromium/issues/detail?id=761295 | upstream
     * issue}.
     *
     * :::
     *
     * @param url - the URL to navigate the frame to. This should include the
     * scheme, e.g. `https://`.
     * @param options - navigation options. `waitUntil` is useful to define when
     * the navigation should be considered successful - see the docs for
     * {@link PuppeteerLifeCycleEvent} for more details.
     *
     * @returns A promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @throws This method will throw an error if:
     *
     * - there's an SSL error (e.g. in case of self-signed certificates).
     * - target URL is invalid.
     * - the `timeout` is exceeded during navigation.
     * - the remote server does not respond or is unreachable.
     * - the main resource failed to load.
     *
     * This method will not throw an error when any valid HTTP status code is
     * returned by the remote server, including 404 "Not Found" and 500 "Internal
     * Server Error". The status code for such responses can be retrieved by
     * calling {@link HTTPResponse.status}.
     */
    async goto(url, options = {}) {
        const { referer = this._frameManager.networkManager.extraHTTPHeaders()['referer'], waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
        let ensureNewDocumentNavigation = false;
        const watcher = new LifecycleWatcher(this._frameManager, this, waitUntil, timeout);
        let error = await Promise.race([
            navigate(__classPrivateFieldGet$s(this, _Frame_client, "f"), url, referer, this._id),
            watcher.timeoutOrTerminationPromise(),
        ]);
        if (!error) {
            error = await Promise.race([
                watcher.timeoutOrTerminationPromise(),
                ensureNewDocumentNavigation
                    ? watcher.newDocumentNavigationPromise()
                    : watcher.sameDocumentNavigationPromise(),
            ]);
        }
        try {
            if (error) {
                throw error;
            }
            return await watcher.navigationResponse();
        }
        finally {
            watcher.dispose();
        }
        async function navigate(client, url, referrer, frameId) {
            try {
                const response = await client.send('Page.navigate', {
                    url,
                    referrer,
                    frameId,
                });
                ensureNewDocumentNavigation = !!response.loaderId;
                return response.errorText
                    ? new Error(`${response.errorText} at ${url}`)
                    : null;
            }
            catch (error) {
                if (isErrorLike(error)) {
                    return error;
                }
                throw error;
            }
        }
    }
    /**
     * Waits for the frame to navigate. It is useful for when you run code which
     * will indirectly cause the frame to navigate.
     *
     * Usage of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
     * to change the URL is considered a navigation.
     *
     * @example
     *
     * ```ts
     * const [response] = await Promise.all([
     *   // The navigation promise resolves after navigation has finished
     *   frame.waitForNavigation(),
     *   // Clicking the link will indirectly cause a navigation
     *   frame.click('a.my-link'),
     * ]);
     * ```
     *
     * @param options - options to configure when the navigation is consided
     * finished.
     * @returns a promise that resolves when the frame navigates to a new URL.
     */
    async waitForNavigation(options = {}) {
        const { waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
        const watcher = new LifecycleWatcher(this._frameManager, this, waitUntil, timeout);
        const error = await Promise.race([
            watcher.timeoutOrTerminationPromise(),
            watcher.sameDocumentNavigationPromise(),
            watcher.newDocumentNavigationPromise(),
        ]);
        try {
            if (error) {
                throw error;
            }
            return await watcher.navigationResponse();
        }
        finally {
            watcher.dispose();
        }
    }
    /**
     * @internal
     */
    _client() {
        return __classPrivateFieldGet$s(this, _Frame_client, "f");
    }
    /**
     * @internal
     */
    executionContext() {
        return this.worlds[MAIN_WORLD].executionContext();
    }
    /**
     * Behaves identically to {@link Page.evaluateHandle} except it's run within
     * the context of this frame.
     *
     * @see {@link Page.evaluateHandle} for details.
     */
    async evaluateHandle(pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].evaluateHandle(pageFunction, ...args);
    }
    /**
     * Behaves identically to {@link Page.evaluate} except it's run within the
     * the context of this frame.
     *
     * @see {@link Page.evaluate} for details.
     */
    async evaluate(pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].evaluate(pageFunction, ...args);
    }
    /**
     * Queries the frame for an element matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
        return this.worlds[MAIN_WORLD].$(selector);
    }
    /**
     * Queries the frame for all elements matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector) {
        return this.worlds[MAIN_WORLD].$$(selector);
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const searchValue = await frame.$eval('#search', el => el.value);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * The first element matching the selector will be passed to the function as
     * its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].$eval(selector, pageFunction, ...args);
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```js
     * const divsCounts = await frame.$$eval('div', divs => divs.length);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * An array of elements matching the given selector will be passed to the
     * function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].$$eval(selector, pageFunction, ...args);
    }
    /**
     * @deprecated Use {@link Frame.$$} with the `xpath` prefix.
     *
     * Example: `await frame.$$('xpath/' + xpathExpression)`
     *
     * This method evaluates the given XPath expression and returns the results.
     * If `xpath` starts with `//` instead of `.//`, the dot will be appended
     * automatically.
     * @param expression - the XPath expression to evaluate.
     */
    async $x(expression) {
        return this.worlds[MAIN_WORLD].$x(expression);
    }
    /**
     * Waits for an element matching the given selector to appear in the frame.
     *
     * This method works across navigations.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.waitFor, 'Query handler does not support waiting');
        return (await queryHandler.waitFor(this, updatedSelector, options));
    }
    /**
     * @deprecated Use {@link Frame.waitForSelector} with the `xpath` prefix.
     *
     * Example: `await frame.waitForSelector('xpath/' + xpathExpression)`
     *
     * The method evaluates the XPath expression relative to the Frame.
     * If `xpath` starts with `//` instead of `.//`, the dot will be appended
     * automatically.
     *
     * Wait for the `xpath` to appear in page. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the xpath doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * For a code example, see the example for {@link Frame.waitForSelector}. That
     * function behaves identically other than taking a CSS selector rather than
     * an XPath.
     *
     * @param xpath - the XPath expression to wait for.
     * @param options - options to configure the visiblity of the element and how
     * long to wait before timing out.
     */
    async waitForXPath(xpath, options = {}) {
        if (xpath.startsWith('//')) {
            xpath = `.${xpath}`;
        }
        return this.waitForSelector(`xpath/${xpath}`, options);
    }
    /**
     * @example
     * The `waitForFunction` can be used to observe viewport size change:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     * .  const browser = await puppeteer.launch();
     * .  const page = await browser.newPage();
     * .  const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
     * .  page.setViewport({width: 50, height: 50});
     * .  await watchDog;
     * .  await browser.close();
     * })();
     * ```
     *
     * To pass arguments from Node.js to the predicate of `page.waitForFunction` function:
     *
     * ```ts
     * const selector = '.foo';
     * await frame.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {}, // empty options object
     *   selector
     * );
     * ```
     *
     * @param pageFunction - the function to evaluate in the frame context.
     * @param options - options to configure the polling method and timeout.
     * @param args - arguments to pass to the `pageFunction`.
     * @returns the promise which resolve when the `pageFunction` returns a truthy value.
     */
    waitForFunction(pageFunction, options = {}, ...args) {
        return this.worlds[MAIN_WORLD].waitForFunction(pageFunction, options, ...args);
    }
    /**
     * @returns The full HTML contents of the frame, including the DOCTYPE.
     */
    async content() {
        return this.worlds[PUPPETEER_WORLD].content();
    }
    /**
     * Set the content of the frame.
     *
     * @param html - HTML markup to assign to the page.
     * @param options - Options to configure how long before timing out and at
     * what point to consider the content setting successful.
     */
    async setContent(html, options = {}) {
        return this.worlds[PUPPETEER_WORLD].setContent(html, options);
    }
    /**
     * @returns The frame's `name` attribute as specified in the tag.
     *
     * @remarks
     * If the name is empty, it returns the `id` attribute instead.
     *
     * @remarks
     * This value is calculated once when the frame is created, and will not
     * update if the attribute is changed later.
     */
    name() {
        return this._name || '';
    }
    /**
     * @returns The frame's URL.
     */
    url() {
        return __classPrivateFieldGet$s(this, _Frame_url, "f");
    }
    /**
     * @returns The parent frame, if any. Detached and main frames return `null`.
     */
    parentFrame() {
        return this._frameManager._frameTree.parentFrame(this._id) || null;
    }
    /**
     * @returns An array of child frames.
     */
    childFrames() {
        return this._frameManager._frameTree.childFrames(this._id);
    }
    /**
     * @returns `true` if the frame has been detached. Otherwise, `false`.
     */
    isDetached() {
        return __classPrivateFieldGet$s(this, _Frame_detached, "f");
    }
    /**
     * Adds a `<script>` tag into the page with the desired url or content.
     *
     * @param options - Options for the script.
     * @returns An {@link ElementHandle | element handle} to the injected
     * `<script>` element.
     */
    async addScriptTag(options) {
        let { content = '', type } = options;
        const { path } = options;
        if (+!!options.url + +!!path + +!!content !== 1) {
            throw new Error('Exactly one of `url`, `path`, or `content` must be specified.');
        }
        if (path) {
            let fs;
            try {
                fs = (await import('fs')).promises;
            }
            catch (error) {
                if (error instanceof TypeError) {
                    throw new Error('Can only pass a file path in a Node-like environment.');
                }
                throw error;
            }
            content = await fs.readFile(path, 'utf8');
            content += `//# sourceURL=${path.replace(/\n/g, '')}`;
        }
        type = type !== null && type !== void 0 ? type : 'text/javascript';
        return this.worlds[MAIN_WORLD].transferHandle(await this.worlds[PUPPETEER_WORLD].evaluateHandle(async ({ createDeferredPromise }, { url, id, type, content }) => {
            const promise = createDeferredPromise();
            const script = document.createElement('script');
            script.type = type;
            script.text = content;
            if (url) {
                script.src = url;
                script.addEventListener('load', () => {
                    return promise.resolve();
                }, { once: true });
                script.addEventListener('error', event => {
                    var _a;
                    promise.reject(new Error((_a = event.message) !== null && _a !== void 0 ? _a : 'Could not load script'));
                }, { once: true });
            }
            else {
                promise.resolve();
            }
            if (id) {
                script.id = id;
            }
            document.head.appendChild(script);
            await promise;
            return script;
        }, await this.worlds[PUPPETEER_WORLD].puppeteerUtil, { ...options, type, content }));
    }
    async addStyleTag(options) {
        let { content = '' } = options;
        const { path } = options;
        if (+!!options.url + +!!path + +!!content !== 1) {
            throw new Error('Exactly one of `url`, `path`, or `content` must be specified.');
        }
        if (path) {
            let fs;
            try {
                fs = (await importFS()).promises;
            }
            catch (error) {
                if (error instanceof TypeError) {
                    throw new Error('Can only pass a file path in a Node-like environment.');
                }
                throw error;
            }
            content = await fs.readFile(path, 'utf8');
            content += '/*# sourceURL=' + path.replace(/\n/g, '') + '*/';
            options.content = content;
        }
        return this.worlds[MAIN_WORLD].transferHandle(await this.worlds[PUPPETEER_WORLD].evaluateHandle(async ({ createDeferredPromise }, { url, content }) => {
            const promise = createDeferredPromise();
            let element;
            if (!url) {
                element = document.createElement('style');
                element.appendChild(document.createTextNode(content));
            }
            else {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                element = link;
            }
            element.addEventListener('load', () => {
                promise.resolve();
            }, { once: true });
            element.addEventListener('error', event => {
                var _a;
                promise.reject(new Error((_a = event.message) !== null && _a !== void 0 ? _a : 'Could not load style'));
            }, { once: true });
            document.head.appendChild(element);
            await promise;
            return element;
        }, await this.worlds[PUPPETEER_WORLD].puppeteerUtil, options));
    }
    /**
     * Clicks the first element found that matches `selector`.
     *
     * @remarks
     * If `click()` triggers a navigation event and there's a separate
     * `page.waitForNavigation()` promise to be resolved, you may end up with a
     * race condition that yields unexpected results. The correct pattern for
     * click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   frame.click(selector, clickOptions),
     * ]);
     * ```
     *
     * @param selector - The selector to query for.
     */
    async click(selector, options = {}) {
        return this.worlds[PUPPETEER_WORLD].click(selector, options);
    }
    /**
     * Focuses the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async focus(selector) {
        return this.worlds[PUPPETEER_WORLD].focus(selector);
    }
    /**
     * Hovers the pointer over the center of the first element that matches the
     * `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async hover(selector) {
        return this.worlds[PUPPETEER_WORLD].hover(selector);
    }
    /**
     * Selects a set of value on the first `<select>` element that matches the
     * `selector`.
     *
     * @example
     *
     * ```ts
     * frame.select('select#colors', 'blue'); // single selection
     * frame.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector - The selector to query for.
     * @param values - The array of values to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     * @returns the list of values that were successfully selected.
     * @throws Throws if there's no `<select>` matching `selector`.
     */
    select(selector, ...values) {
        return this.worlds[PUPPETEER_WORLD].select(selector, ...values);
    }
    /**
     * Taps the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async tap(selector) {
        return this.worlds[PUPPETEER_WORLD].tap(selector);
    }
    /**
     * Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character
     * in the text.
     *
     * @remarks
     * To press a special key, like `Control` or `ArrowDown`, use
     * {@link Keyboard.press}.
     *
     * @example
     *
     * ```ts
     * await frame.type('#mytextarea', 'Hello'); // Types instantly
     * await frame.type('#mytextarea', 'World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @param selector - the selector for the element to type into. If there are
     * multiple the first will be used.
     * @param text - text to type into the element
     * @param options - takes one option, `delay`, which sets the time to wait
     * between key presses in milliseconds. Defaults to `0`.
     */
    async type(selector, text, options) {
        return this.worlds[PUPPETEER_WORLD].type(selector, text, options);
    }
    /**
     * @deprecated Replace with `new Promise(r => setTimeout(r, milliseconds));`.
     *
     * Causes your script to wait for the given number of milliseconds.
     *
     * @remarks
     * It's generally recommended to not wait for a number of seconds, but instead
     * use {@link Frame.waitForSelector}, {@link Frame.waitForXPath} or
     * {@link Frame.waitForFunction} to wait for exactly the conditions you want.
     *
     * @example
     *
     * Wait for 1 second:
     *
     * ```ts
     * await frame.waitForTimeout(1000);
     * ```
     *
     * @param milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    /**
     * @returns the frame's title.
     */
    async title() {
        return this.worlds[PUPPETEER_WORLD].title();
    }
    /**
     * @internal
     */
    _navigated(framePayload) {
        this._name = framePayload.name;
        __classPrivateFieldSet$r(this, _Frame_url, `${framePayload.url}${framePayload.urlFragment || ''}`, "f");
    }
    /**
     * @internal
     */
    _navigatedWithinDocument(url) {
        __classPrivateFieldSet$r(this, _Frame_url, url, "f");
    }
    /**
     * @internal
     */
    _onLifecycleEvent(loaderId, name) {
        if (name === 'init') {
            this._loaderId = loaderId;
            this._lifecycleEvents.clear();
        }
        this._lifecycleEvents.add(name);
    }
    /**
     * @internal
     */
    _onLoadingStopped() {
        this._lifecycleEvents.add('DOMContentLoaded');
        this._lifecycleEvents.add('load');
    }
    /**
     * @internal
     */
    _onLoadingStarted() {
        this._hasStartedLoading = true;
    }
    /**
     * @internal
     */
    _detach() {
        __classPrivateFieldSet$r(this, _Frame_detached, true, "f");
        this.worlds[MAIN_WORLD]._detach();
        this.worlds[PUPPETEER_WORLD]._detach();
    }
}
_Frame_url = new WeakMap(), _Frame_detached = new WeakMap(), _Frame_client = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function createPuppeteerQueryHandler(handler) {
    const internalHandler = {};
    if (handler.queryOne) {
        const queryOne = handler.queryOne;
        internalHandler.queryOne = async (element, selector) => {
            const jsHandle = await element.evaluateHandle(queryOne, selector, await element.executionContext()._world.puppeteerUtil);
            const elementHandle = jsHandle.asElement();
            if (elementHandle) {
                return elementHandle;
            }
            await jsHandle.dispose();
            return null;
        };
        internalHandler.waitFor = async (elementOrFrame, selector, options) => {
            let frame;
            let element;
            if (elementOrFrame instanceof Frame) {
                frame = elementOrFrame;
            }
            else {
                frame = elementOrFrame.frame;
                element = await frame.worlds[PUPPETEER_WORLD].adoptHandle(elementOrFrame);
            }
            const result = await frame.worlds[PUPPETEER_WORLD]._waitForSelectorInPage(queryOne, element, selector, options);
            if (element) {
                await element.dispose();
            }
            if (!result) {
                return null;
            }
            if (!(result instanceof ElementHandle)) {
                await result.dispose();
                return null;
            }
            return frame.worlds[MAIN_WORLD].transferHandle(result);
        };
    }
    if (handler.queryAll) {
        const queryAll = handler.queryAll;
        internalHandler.queryAll = async (element, selector) => {
            const jsHandle = await element.evaluateHandle(queryAll, selector, await element.executionContext()._world.puppeteerUtil);
            const properties = await jsHandle.getProperties();
            await jsHandle.dispose();
            const result = [];
            for (const property of properties.values()) {
                const elementHandle = property.asElement();
                if (elementHandle) {
                    result.push(elementHandle);
                }
            }
            return result;
        };
    }
    return internalHandler;
}
const defaultHandler = createPuppeteerQueryHandler({
    queryOne: (element, selector) => {
        if (!('querySelector' in element)) {
            throw new Error(`Could not invoke \`querySelector\` on node of type ${element.nodeName}.`);
        }
        return element.querySelector(selector);
    },
    queryAll: (element, selector) => {
        if (!('querySelectorAll' in element)) {
            throw new Error(`Could not invoke \`querySelectorAll\` on node of type ${element.nodeName}.`);
        }
        return [
            ...element.querySelectorAll(selector),
        ];
    },
});
const pierceHandler = createPuppeteerQueryHandler({
    queryOne: (element, selector, { pierceQuerySelector }) => {
        return pierceQuerySelector(element, selector);
    },
    queryAll: (element, selector, { pierceQuerySelectorAll }) => {
        return pierceQuerySelectorAll(element, selector);
    },
});
const xpathHandler = createPuppeteerQueryHandler({
    queryOne: (element, selector, { xpathQuerySelector }) => {
        return xpathQuerySelector(element, selector);
    },
    queryAll: (element, selector, { xpathQuerySelectorAll }) => {
        return xpathQuerySelectorAll(element, selector);
    },
});
const textQueryHandler = createPuppeteerQueryHandler({
    queryOne: (element, selector, { textQuerySelector }) => {
        return textQuerySelector(element, selector);
    },
    queryAll: (element, selector, { textQuerySelectorAll }) => {
        return textQuerySelectorAll(element, selector);
    },
});
const INTERNAL_QUERY_HANDLERS = new Map([
    ['aria', { handler: ariaHandler }],
    ['pierce', { handler: pierceHandler }],
    ['xpath', { handler: xpathHandler }],
    ['text', { handler: textQueryHandler }],
]);
const QUERY_HANDLERS = new Map();
/**
 * @deprecated Import {@link Puppeteer} and use the static method
 * {@link Puppeteer.registerCustomQueryHandler}
 *
 * @public
 */
function registerCustomQueryHandler(name, handler) {
    if (INTERNAL_QUERY_HANDLERS.has(name)) {
        throw new Error(`A query handler named "${name}" already exists`);
    }
    if (QUERY_HANDLERS.has(name)) {
        throw new Error(`A custom query handler named "${name}" already exists`);
    }
    const isValidName = /^[a-zA-Z]+$/.test(name);
    if (!isValidName) {
        throw new Error(`Custom query handler names may only contain [a-zA-Z]`);
    }
    QUERY_HANDLERS.set(name, { handler: createPuppeteerQueryHandler(handler) });
}
/**
 * @deprecated Import {@link Puppeteer} and use the static method
 * {@link Puppeteer.unregisterCustomQueryHandler}
 *
 * @public
 */
function unregisterCustomQueryHandler(name) {
    QUERY_HANDLERS.delete(name);
}
/**
 * @deprecated Import {@link Puppeteer} and use the static method
 * {@link Puppeteer.customQueryHandlerNames}
 *
 * @public
 */
function customQueryHandlerNames() {
    return [...QUERY_HANDLERS.keys()];
}
/**
 * @deprecated Import {@link Puppeteer} and use the static method
 * {@link Puppeteer.clearCustomQueryHandlers}
 *
 * @public
 */
function clearCustomQueryHandlers() {
    QUERY_HANDLERS.clear();
}
const CUSTOM_QUERY_SEPARATORS = ['=', '/'];
/**
 * @internal
 */
function getQueryHandlerAndSelector(selector) {
    for (const handlerMap of [QUERY_HANDLERS, INTERNAL_QUERY_HANDLERS]) {
        for (const [name, { handler: queryHandler, transformSelector },] of handlerMap) {
            for (const separator of CUSTOM_QUERY_SEPARATORS) {
                const prefix = `${name}${separator}`;
                if (selector.startsWith(prefix)) {
                    selector = selector.slice(prefix.length);
                    if (transformSelector) {
                        selector = transformSelector(selector);
                    }
                    return { updatedSelector: selector, queryHandler };
                }
            }
        }
    }
    return { updatedSelector: selector, queryHandler: defaultHandler };
}

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$q = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$r = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ElementHandle_instances, _ElementHandle_frame, _ElementHandle_frameManager_get, _ElementHandle_page_get, _ElementHandle_scrollIntoViewIfNeeded, _ElementHandle_getOOPIFOffsets, _ElementHandle_getBoxModel, _ElementHandle_fromProtocolQuad, _ElementHandle_intersectQuadWithViewport;
const applyOffsetsToQuad = (quad, offsetX, offsetY) => {
    return quad.map(part => {
        return { x: part.x + offsetX, y: part.y + offsetY };
    });
};
/**
 * ElementHandle represents an in-page DOM element.
 *
 * @remarks
 * ElementHandles can be created with the {@link Page.$} method.
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   const hrefElement = await page.$('a');
 *   await hrefElement.click();
 *   // ...
 * })();
 * ```
 *
 * ElementHandle prevents the DOM element from being garbage-collected unless the
 * handle is {@link JSHandle.dispose | disposed}. ElementHandles are auto-disposed
 * when their origin frame gets navigated.
 *
 * ElementHandle instances can be used as arguments in {@link Page.$eval} and
 * {@link Page.evaluate} methods.
 *
 * If you're using TypeScript, ElementHandle takes a generic argument that
 * denotes the type of element the handle is holding within. For example, if you
 * have a handle to a `<select>` element, you can type it as
 * `ElementHandle<HTMLSelectElement>` and you get some nicer type checks.
 *
 * @public
 */
class ElementHandle extends JSHandle {
    /**
     * @internal
     */
    constructor(context, remoteObject, frame) {
        super(context, remoteObject);
        _ElementHandle_instances.add(this);
        _ElementHandle_frame.set(this, void 0);
        __classPrivateFieldSet$q(this, _ElementHandle_frame, frame, "f");
    }
    get frame() {
        return __classPrivateFieldGet$r(this, _ElementHandle_frame, "f");
    }
    /**
     * Queries the current element for an element matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryOne, 'Cannot handle queries for a single element with the given selector');
        return (await queryHandler.queryOne(this, updatedSelector));
    }
    /**
     * Queries the current element for all elements matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryAll, 'Cannot handle queries for a multiple element with the given selector');
        return (await queryHandler.queryAll(this, updatedSelector));
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const tweetHandle = await page.$('.tweet');
     * expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe(
     *   '100'
     * );
     * expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe(
     *   '10'
     * );
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in this element's page's
     * context. The first element matching the selector will be passed in as the
     * first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
        const elementHandle = await this.$(selector);
        if (!elementHandle) {
            throw new Error(`Error: failed to find element matching selector "${selector}"`);
        }
        const result = await elementHandle.evaluate(pageFunction, ...args);
        await elementHandle.dispose();
        return result;
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     * HTML:
     *
     * ```html
     * <div class="feed">
     *   <div class="tweet">Hello!</div>
     *   <div class="tweet">Hi!</div>
     * </div>
     * ```
     *
     * JavaScript:
     *
     * ```js
     * const feedHandle = await page.$('.feed');
     * expect(
     *   await feedHandle.$$eval('.tweet', nodes => nodes.map(n => n.innerText))
     * ).toEqual(['Hello!', 'Hi!']);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the element's page's
     * context. An array of elements matching the given selector will be passed to
     * the function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryAll, 'Cannot handle queries for a multiple element with the given selector');
        const handles = (await queryHandler.queryAll(this, updatedSelector));
        const elements = await this.evaluateHandle((_, ...elements) => {
            return elements;
        }, ...handles);
        const [result] = await Promise.all([
            elements.evaluate(pageFunction, ...args),
            ...handles.map(handle => {
                return handle.dispose();
            }),
        ]);
        await elements.dispose();
        return result;
    }
    /**
     * @deprecated Use {@link ElementHandle.$$} with the `xpath` prefix.
     *
     * Example: `await elementHandle.$$('xpath/' + xpathExpression)`
     *
     * The method evaluates the XPath expression relative to the elementHandle.
     * If `xpath` starts with `//` instead of `.//`, the dot will be appended
     * automatically.
     *
     * If there are no such elements, the method will resolve to an empty array.
     * @param expression - Expression to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate | evaluate}
     */
    async $x(expression) {
        if (expression.startsWith('//')) {
            expression = `.${expression}`;
        }
        return this.$$(`xpath/${expression}`);
    }
    /**
     * Wait for an element matching the given selector to appear in the current
     * element.
     *
     * Unlike {@link Frame.waitForSelector}, this method does not work across
     * navigations or if the element is detached from DOM.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.waitFor, 'Query handler does not support waiting');
        return (await queryHandler.waitFor(this, updatedSelector, options));
    }
    /**
     * @deprecated Use {@link ElementHandle.waitForSelector} with the `xpath`
     * prefix.
     *
     * Example: `await elementHandle.waitForSelector('xpath/' + xpathExpression)`
     *
     * The method evaluates the XPath expression relative to the elementHandle.
     *
     * Wait for the `xpath` within the element. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the `xpath` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * If `xpath` starts with `//` instead of `.//`, the dot will be appended
     * automatically.
     *
     * This method works across navigation.
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForXPath('//img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param xpath - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/XPath | xpath} of an
     * element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by xpath string is
     * added to DOM. Resolves to `null` if waiting for `hidden: true` and xpath is
     * not found in DOM.
     * @remarks
     * The optional Argument `options` have properties:
     *
     * - `visible`: A boolean to wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: A boolean wait for element to not be found in the DOM or to be
     *   hidden, i.e. have `display: none` or `visibility: hidden` CSS properties.
     *   Defaults to `false`.
     *
     * - `timeout`: A number which is maximum time to wait for in milliseconds.
     *   Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The
     *   default value can be changed by using the {@link Page.setDefaultTimeout}
     *   method.
     */
    async waitForXPath(xpath, options = {}) {
        if (xpath.startsWith('//')) {
            xpath = `.${xpath}`;
        }
        return this.waitForSelector(`xpath/${xpath}`, options);
    }
    asElement() {
        return this;
    }
    /**
     * Resolves to the content frame for element handles referencing
     * iframe nodes, or null otherwise
     */
    async contentFrame() {
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: this.remoteObject().objectId,
        });
        if (typeof nodeInfo.node.frameId !== 'string') {
            return null;
        }
        return __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_frameManager_get).frame(nodeInfo.node.frameId);
    }
    /**
     * Returns the middle point within an element unless a specific offset is provided.
     */
    async clickablePoint(offset) {
        const [result, layoutMetrics] = await Promise.all([
            this.client
                .send('DOM.getContentQuads', {
                objectId: this.remoteObject().objectId,
            })
                .catch(debugError),
            __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get)._client().send('Page.getLayoutMetrics'),
        ]);
        if (!result || !result.quads.length) {
            throw new Error('Node is either not clickable or not an HTMLElement');
        }
        // Filter out quads that have too small area to click into.
        // Fallback to `layoutViewport` in case of using Firefox.
        const { clientWidth, clientHeight } = layoutMetrics.cssLayoutViewport || layoutMetrics.layoutViewport;
        const { offsetX, offsetY } = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$r(this, _ElementHandle_frame, "f"));
        const quads = result.quads
            .map(quad => {
            return __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, quad);
        })
            .map(quad => {
            return applyOffsetsToQuad(quad, offsetX, offsetY);
        })
            .map(quad => {
            return __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_intersectQuadWithViewport).call(this, quad, clientWidth, clientHeight);
        })
            .filter(quad => {
            return computeQuadArea(quad) > 1;
        });
        if (!quads.length) {
            throw new Error('Node is either not clickable or not an HTMLElement');
        }
        const quad = quads[0];
        if (offset) {
            // Return the point of the first quad identified by offset.
            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;
            for (const point of quad) {
                if (point.x < minX) {
                    minX = point.x;
                }
                if (point.y < minY) {
                    minY = point.y;
                }
            }
            if (minX !== Number.MAX_SAFE_INTEGER &&
                minY !== Number.MAX_SAFE_INTEGER) {
                return {
                    x: minX + offset.x,
                    y: minY + offset.y,
                };
            }
        }
        // Return the middle point of the first quad.
        let x = 0;
        let y = 0;
        for (const point of quad) {
            x += point.x;
            y += point.y;
        }
        return {
            x: x / 4,
            y: y / 4,
        };
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to hover over the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async hover() {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.move(x, y);
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to click in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async click(options = {}) {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint(options.offset);
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.click(x, y, options);
    }
    /**
     * This method creates and captures a dragevent from the element.
     */
    async drag(target) {
        assert(__classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).isDragInterceptionEnabled(), 'Drag Interception is not enabled!');
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const start = await this.clickablePoint();
        return await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.drag(start, target);
    }
    /**
     * This method creates a `dragenter` event on the element.
     */
    async dragEnter(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const target = await this.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragEnter(target, data);
    }
    /**
     * This method creates a `dragover` event on the element.
     */
    async dragOver(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const target = await this.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragOver(target, data);
    }
    /**
     * This method triggers a drop on the element.
     */
    async drop(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const destination = await this.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.drop(destination, data);
    }
    /**
     * This method triggers a dragenter, dragover, and drop on the element.
     */
    async dragAndDrop(target, options) {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const startPoint = await this.clickablePoint();
        const targetPoint = await target.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragAndDrop(startPoint, targetPoint, options);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * handle.select('blue'); // single selection
     * handle.select('red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     */
    async select(...values) {
        for (const value of values) {
            assert(isString(value), 'Values must be strings. Found value "' +
                value +
                '" of type "' +
                typeof value +
                '"');
        }
        return this.evaluate((element, vals) => {
            const values = new Set(vals);
            if (!(element instanceof HTMLSelectElement)) {
                throw new Error('Element is not a <select> element.');
            }
            const selectedValues = new Set();
            if (!element.multiple) {
                for (const option of element.options) {
                    option.selected = false;
                }
                for (const option of element.options) {
                    if (values.has(option.value)) {
                        option.selected = true;
                        selectedValues.add(option.value);
                        break;
                    }
                }
            }
            else {
                for (const option of element.options) {
                    option.selected = values.has(option.value);
                    if (option.selected) {
                        selectedValues.add(option.value);
                    }
                }
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return [...selectedValues.values()];
        }, values);
    }
    /**
     * This method expects `elementHandle` to point to an
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | input element}.
     *
     * @param filePaths - Sets the value of the file input to these paths.
     * If a path is relative, then it is resolved against the
     * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
     * Note for locals script connecting to remote chrome environments,
     * paths must be absolute.
     */
    async uploadFile(...filePaths) {
        const isMultiple = await this.evaluate(element => {
            return element.multiple;
        });
        assert(filePaths.length <= 1 || isMultiple, 'Multiple file uploads only work with <input type=file multiple>');
        // Locate all files and confirm that they exist.
        let path;
        try {
            path = await import('path');
        }
        catch (error) {
            if (error instanceof TypeError) {
                throw new Error(`JSHandle#uploadFile can only be used in Node-like environments.`);
            }
            throw error;
        }
        const files = filePaths.map(filePath => {
            if (path.win32.isAbsolute(filePath) || path.posix.isAbsolute(filePath)) {
                return filePath;
            }
            else {
                return path.resolve(filePath);
            }
        });
        const { objectId } = this.remoteObject();
        const { node } = await this.client.send('DOM.describeNode', { objectId });
        const { backendNodeId } = node;
        /*  The zero-length array is a special case, it seems that
             DOM.setFileInputFiles does not actually update the files in that case,
             so the solution is to eval the element value to a new FileList directly.
         */
        if (files.length === 0) {
            await this.evaluate(element => {
                element.files = new DataTransfer().files;
                // Dispatch events for this case because it should behave akin to a user action.
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
        else {
            await this.client.send('DOM.setFileInputFiles', {
                objectId,
                files,
                backendNodeId,
            });
        }
    }
    /**
     * This method scrolls element into view if needed, and then uses
     * {@link Touchscreen.tap} to tap in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async tap() {
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).touchscreen.tap(x, y);
    }
    /**
     * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
     */
    async focus() {
        await this.evaluate(element => {
            if (!(element instanceof HTMLElement)) {
                throw new Error('Cannot focus non-HTMLElement');
            }
            return element.focus();
        });
    }
    /**
     * Focuses the element, and then sends a `keydown`, `keypress`/`input`, and
     * `keyup` event for each character in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`,
     * use {@link ElementHandle.press}.
     *
     * @example
     *
     * ```ts
     * await elementHandle.type('Hello'); // Types instantly
     * await elementHandle.type('World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @example
     * An example of typing into a text field and then submitting the form:
     *
     * ```ts
     * const elementHandle = await page.$('input');
     * await elementHandle.type('some text');
     * await elementHandle.press('Enter');
     * ```
     */
    async type(text, options) {
        await this.focus();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).keyboard.type(text, options);
    }
    /**
     * Focuses the element, and then uses {@link Keyboard.down} and {@link Keyboard.up}.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also be generated.
     * The `text` option can be specified to force an input event to be generated.
     *
     * **NOTE** Modifier keys DO affect `elementHandle.press`. Holding down `Shift`
     * will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     */
    async press(key, options) {
        await this.focus();
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).keyboard.press(key, options);
    }
    /**
     * This method returns the bounding box of the element (relative to the main frame),
     * or `null` if the element is not visible.
     */
    async boundingBox() {
        const result = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_getBoxModel).call(this);
        if (!result) {
            return null;
        }
        const { offsetX, offsetY } = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$r(this, _ElementHandle_frame, "f"));
        const quad = result.model.border;
        const x = Math.min(quad[0], quad[2], quad[4], quad[6]);
        const y = Math.min(quad[1], quad[3], quad[5], quad[7]);
        const width = Math.max(quad[0], quad[2], quad[4], quad[6]) - x;
        const height = Math.max(quad[1], quad[3], quad[5], quad[7]) - y;
        return { x: x + offsetX, y: y + offsetY, width, height };
    }
    /**
     * This method returns boxes of the element, or `null` if the element is not visible.
     *
     * @remarks
     *
     * Boxes are represented as an array of points;
     * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
     */
    async boxModel() {
        const result = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_getBoxModel).call(this);
        if (!result) {
            return null;
        }
        const { offsetX, offsetY } = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$r(this, _ElementHandle_frame, "f"));
        const { content, padding, border, margin, width, height } = result.model;
        return {
            content: applyOffsetsToQuad(__classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, content), offsetX, offsetY),
            padding: applyOffsetsToQuad(__classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, padding), offsetX, offsetY),
            border: applyOffsetsToQuad(__classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, border), offsetX, offsetY),
            margin: applyOffsetsToQuad(__classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, margin), offsetX, offsetY),
            width,
            height,
        };
    }
    /**
     * This method scrolls element into view if needed, and then uses
     * {@link Page.screenshot} to take a screenshot of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async screenshot(options = {}) {
        let needsViewportReset = false;
        let boundingBox = await this.boundingBox();
        assert(boundingBox, 'Node is either not visible or not an HTMLElement');
        const viewport = __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).viewport();
        if (viewport &&
            (boundingBox.width > viewport.width ||
                boundingBox.height > viewport.height)) {
            const newViewport = {
                width: Math.max(viewport.width, Math.ceil(boundingBox.width)),
                height: Math.max(viewport.height, Math.ceil(boundingBox.height)),
            };
            await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).setViewport(Object.assign({}, viewport, newViewport));
            needsViewportReset = true;
        }
        await __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        boundingBox = await this.boundingBox();
        assert(boundingBox, 'Node is either not visible or not an HTMLElement');
        assert(boundingBox.width !== 0, 'Node has 0 width.');
        assert(boundingBox.height !== 0, 'Node has 0 height.');
        const layoutMetrics = await this.client.send('Page.getLayoutMetrics');
        // Fallback to `layoutViewport` in case of using Firefox.
        const { pageX, pageY } = layoutMetrics.cssVisualViewport || layoutMetrics.layoutViewport;
        const clip = Object.assign({}, boundingBox);
        clip.x += pageX;
        clip.y += pageY;
        const imageData = await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).screenshot(Object.assign({}, {
            clip,
        }, options));
        if (needsViewportReset && viewport) {
            await __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).setViewport(viewport);
        }
        return imageData;
    }
    /**
     * Resolves to true if the element is visible in the current viewport.
     */
    async isIntersectingViewport(options) {
        const { threshold = 0 } = options !== null && options !== void 0 ? options : {};
        return await this.evaluate(async (element, threshold) => {
            const visibleRatio = await new Promise(resolve => {
                const observer = new IntersectionObserver(entries => {
                    resolve(entries[0].intersectionRatio);
                    observer.disconnect();
                });
                observer.observe(element);
            });
            return threshold === 1 ? visibleRatio === 1 : visibleRatio > threshold;
        }, threshold);
    }
}
_ElementHandle_frame = new WeakMap(), _ElementHandle_instances = new WeakSet(), _ElementHandle_frameManager_get = function _ElementHandle_frameManager_get() {
    return __classPrivateFieldGet$r(this, _ElementHandle_frame, "f")._frameManager;
}, _ElementHandle_page_get = function _ElementHandle_page_get() {
    return __classPrivateFieldGet$r(this, _ElementHandle_frame, "f").page();
}, _ElementHandle_scrollIntoViewIfNeeded = async function _ElementHandle_scrollIntoViewIfNeeded() {
    const error = await this.evaluate(async (element) => {
        if (!element.isConnected) {
            return 'Node is detached from document';
        }
        if (element.nodeType !== Node.ELEMENT_NODE) {
            return 'Node is not of type HTMLElement';
        }
        return;
    });
    if (error) {
        throw new Error(error);
    }
    try {
        await this.client.send('DOM.scrollIntoViewIfNeeded', {
            objectId: this.remoteObject().objectId,
        });
    }
    catch (_err) {
        // Fallback to Element.scrollIntoView if DOM.scrollIntoViewIfNeeded is not supported
        await this.evaluate(async (element, pageJavascriptEnabled) => {
            const visibleRatio = async () => {
                return await new Promise(resolve => {
                    const observer = new IntersectionObserver(entries => {
                        resolve(entries[0].intersectionRatio);
                        observer.disconnect();
                    });
                    observer.observe(element);
                });
            };
            if (!pageJavascriptEnabled || (await visibleRatio()) !== 1.0) {
                element.scrollIntoView({
                    block: 'center',
                    inline: 'center',
                    // @ts-expect-error Chrome still supports behavior: instant but
                    // it's not in the spec so TS shouts We don't want to make this
                    // breaking change in Puppeteer yet so we'll ignore the line.
                    behavior: 'instant',
                });
            }
        }, __classPrivateFieldGet$r(this, _ElementHandle_instances, "a", _ElementHandle_page_get).isJavaScriptEnabled());
    }
}, _ElementHandle_getOOPIFOffsets = async function _ElementHandle_getOOPIFOffsets(frame) {
    let offsetX = 0;
    let offsetY = 0;
    let currentFrame = frame;
    while (currentFrame && currentFrame.parentFrame()) {
        const parent = currentFrame.parentFrame();
        if (!currentFrame.isOOPFrame() || !parent) {
            currentFrame = parent;
            continue;
        }
        const { backendNodeId } = await parent._client().send('DOM.getFrameOwner', {
            frameId: currentFrame._id,
        });
        const result = await parent._client().send('DOM.getBoxModel', {
            backendNodeId: backendNodeId,
        });
        if (!result) {
            break;
        }
        const contentBoxQuad = result.model.content;
        const topLeftCorner = __classPrivateFieldGet$r(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, contentBoxQuad)[0];
        offsetX += topLeftCorner.x;
        offsetY += topLeftCorner.y;
        currentFrame = parent;
    }
    return { offsetX, offsetY };
}, _ElementHandle_getBoxModel = function _ElementHandle_getBoxModel() {
    const params = {
        objectId: this.remoteObject().objectId,
    };
    return this.client.send('DOM.getBoxModel', params).catch(error => {
        return debugError(error);
    });
}, _ElementHandle_fromProtocolQuad = function _ElementHandle_fromProtocolQuad(quad) {
    return [
        { x: quad[0], y: quad[1] },
        { x: quad[2], y: quad[3] },
        { x: quad[4], y: quad[5] },
        { x: quad[6], y: quad[7] },
    ];
}, _ElementHandle_intersectQuadWithViewport = function _ElementHandle_intersectQuadWithViewport(quad, width, height) {
    return quad.map(point => {
        return {
            x: Math.min(Math.max(point.x, 0), width),
            y: Math.min(Math.max(point.y, 0), height),
        };
    });
};
function computeQuadArea(quad) {
    /* Compute sum of all directed areas of adjacent triangles
       https://en.wikipedia.org/wiki/Polygon#Simple_polygons
     */
    let area = 0;
    for (let i = 0; i < quad.length; ++i) {
        const p1 = quad[i];
        const p2 = quad[(i + 1) % quad.length];
        area += (p1.x * p2.y - p2.x * p1.y) / 2;
    }
    return Math.abs(area);
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const debugError = debug('puppeteer:error');
/**
 * @internal
 */
function getExceptionMessage(exceptionDetails) {
    if (exceptionDetails.exception) {
        return (exceptionDetails.exception.description || exceptionDetails.exception.value);
    }
    let message = exceptionDetails.text;
    if (exceptionDetails.stackTrace) {
        for (const callframe of exceptionDetails.stackTrace.callFrames) {
            const location = callframe.url +
                ':' +
                callframe.lineNumber +
                ':' +
                callframe.columnNumber;
            const functionName = callframe.functionName || '<anonymous>';
            message += `\n    at ${functionName} (${location})`;
        }
    }
    return message;
}
/**
 * @internal
 */
function valueFromRemoteObject(remoteObject) {
    assert(!remoteObject.objectId, 'Cannot extract value when objectId is given');
    if (remoteObject.unserializableValue) {
        if (remoteObject.type === 'bigint' && typeof BigInt !== 'undefined') {
            return BigInt(remoteObject.unserializableValue.replace('n', ''));
        }
        switch (remoteObject.unserializableValue) {
            case '-0':
                return -0;
            case 'NaN':
                return NaN;
            case 'Infinity':
                return Infinity;
            case '-Infinity':
                return -Infinity;
            default:
                throw new Error('Unsupported unserializable value: ' +
                    remoteObject.unserializableValue);
        }
    }
    return remoteObject.value;
}
/**
 * @internal
 */
async function releaseObject(client, remoteObject) {
    if (!remoteObject.objectId) {
        return;
    }
    await client
        .send('Runtime.releaseObject', { objectId: remoteObject.objectId })
        .catch(error => {
        // Exceptions might happen in case of a page been navigated or closed.
        // Swallow these since they are harmless and we don't leak anything in this case.
        debugError(error);
    });
}
/**
 * @internal
 */
function addEventListener(emitter, eventName, handler) {
    emitter.on(eventName, handler);
    return { emitter, eventName, handler };
}
/**
 * @internal
 */
function removeEventListeners(listeners) {
    for (const listener of listeners) {
        listener.emitter.removeListener(listener.eventName, listener.handler);
    }
    listeners.length = 0;
}
/**
 * @internal
 */
const isString = (obj) => {
    return typeof obj === 'string' || obj instanceof String;
};
/**
 * @internal
 */
const isNumber = (obj) => {
    return typeof obj === 'number' || obj instanceof Number;
};
/**
 * @internal
 */
async function waitForEvent(emitter, eventName, predicate, timeout, abortPromise) {
    let eventTimeout;
    let resolveCallback;
    let rejectCallback;
    const promise = new Promise((resolve, reject) => {
        resolveCallback = resolve;
        rejectCallback = reject;
    });
    const listener = addEventListener(emitter, eventName, async (event) => {
        if (!(await predicate(event))) {
            return;
        }
        resolveCallback(event);
    });
    if (timeout) {
        eventTimeout = setTimeout(() => {
            rejectCallback(new TimeoutError('Timeout exceeded while waiting for event'));
        }, timeout);
    }
    function cleanup() {
        removeEventListeners([listener]);
        clearTimeout(eventTimeout);
    }
    const result = await Promise.race([promise, abortPromise]).then(r => {
        cleanup();
        return r;
    }, error => {
        cleanup();
        throw error;
    });
    if (isErrorLike(result)) {
        throw result;
    }
    return result;
}
/**
 * @internal
 */
function createJSHandle(context, remoteObject) {
    if (remoteObject.subtype === 'node' && context._world) {
        return new ElementHandle(context, remoteObject, context._world.frame());
    }
    return new JSHandle(context, remoteObject);
}
/**
 * @internal
 */
function evaluationString(fun, ...args) {
    if (isString(fun)) {
        assert(args.length === 0, 'Cannot evaluate a string with arguments');
        return fun;
    }
    function serializeArgument(arg) {
        if (Object.is(arg, undefined)) {
            return 'undefined';
        }
        return JSON.stringify(arg);
    }
    return `(${fun})(${args.map(serializeArgument).join(',')})`;
}
/**
 * @internal
 */
function pageBindingInitString(type, name) {
    function addPageBinding(type, name) {
        // This is the CDP binding.
        // @ts-expect-error: In a different context.
        const callCDP = self[name];
        // We replace the CDP binding with a Puppeteer binding.
        Object.assign(self, {
            [name](...args) {
                var _a, _b;
                // This is the Puppeteer binding.
                // @ts-expect-error: In a different context.
                const callPuppeteer = self[name];
                (_a = callPuppeteer.callbacks) !== null && _a !== void 0 ? _a : (callPuppeteer.callbacks = new Map());
                const seq = ((_b = callPuppeteer.lastSeq) !== null && _b !== void 0 ? _b : 0) + 1;
                callPuppeteer.lastSeq = seq;
                callCDP(JSON.stringify({ type, name, seq, args }));
                return new Promise((resolve, reject) => {
                    callPuppeteer.callbacks.set(seq, { resolve, reject });
                });
            },
        });
    }
    return evaluationString(addPageBinding, type, name);
}
/**
 * @internal
 */
function pageBindingDeliverResultString(name, seq, result) {
    function deliverResult(name, seq, result) {
        window[name].callbacks.get(seq).resolve(result);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverResult, name, seq, result);
}
/**
 * @internal
 */
function pageBindingDeliverErrorString(name, seq, message, stack) {
    function deliverError(name, seq, message, stack) {
        const error = new Error(message);
        error.stack = stack;
        window[name].callbacks.get(seq).reject(error);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverError, name, seq, message, stack);
}
/**
 * @internal
 */
function pageBindingDeliverErrorValueString(name, seq, value) {
    function deliverErrorValue(name, seq, value) {
        window[name].callbacks.get(seq).reject(value);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverErrorValue, name, seq, value);
}
/**
 * @internal
 */
async function waitWithTimeout(promise, taskName, timeout) {
    let reject;
    const timeoutError = new TimeoutError(`waiting for ${taskName} failed: timeout ${timeout}ms exceeded`);
    const timeoutPromise = new Promise((_res, rej) => {
        return (reject = rej);
    });
    let timeoutTimer = null;
    if (timeout) {
        timeoutTimer = setTimeout(() => {
            return reject(timeoutError);
        }, timeout);
    }
    try {
        return await Promise.race([promise, timeoutPromise]);
    }
    finally {
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
    }
}
/**
 * @internal
 */
let fs = null;
/**
 * @internal
 */
async function importFS() {
    if (!fs) {
        fs = await import('fs');
    }
    return fs;
}
/**
 * @internal
 */
async function getReadableAsBuffer(readable, path) {
    const buffers = [];
    if (path) {
        let fs;
        try {
            fs = (await importFS()).promises;
        }
        catch (error) {
            if (error instanceof TypeError) {
                throw new Error('Cannot write to a path outside of a Node-like environment.');
            }
            throw error;
        }
        const fileHandle = await fs.open(path, 'w+');
        for await (const chunk of readable) {
            buffers.push(chunk);
            await fileHandle.writeFile(chunk);
        }
        await fileHandle.close();
    }
    else {
        for await (const chunk of readable) {
            buffers.push(chunk);
        }
    }
    try {
        return Buffer.concat(buffers);
    }
    catch (error) {
        return null;
    }
}
/**
 * @internal
 */
async function getReadableFromProtocolStream(client, handle) {
    // TODO: Once Node 18 becomes the lowest supported version, we can migrate to
    // ReadableStream.
    if (!isNode) {
        throw new Error('Cannot create a stream outside of Node.js environment.');
    }
    const { Readable } = await import('stream');
    let eof = false;
    return new Readable({
        async read(size) {
            if (eof) {
                return;
            }
            const response = await client.send('IO.read', { handle, size });
            this.push(response.data, response.base64Encoded ? 'base64' : undefined);
            if (response.eof) {
                eof = true;
                await client.send('IO.close', { handle });
                this.push(null);
            }
        },
    });
}

var __classPrivateFieldSet$p = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$q = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WebWorker_executionContext, _WebWorker_client, _WebWorker_url;
/**
 * This class represents a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | WebWorker}.
 *
 * @remarks
 * The events `workercreated` and `workerdestroyed` are emitted on the page
 * object to signal the worker lifecycle.
 *
 * @example
 *
 * ```ts
 * page.on('workercreated', worker =>
 *   console.log('Worker created: ' + worker.url())
 * );
 * page.on('workerdestroyed', worker =>
 *   console.log('Worker destroyed: ' + worker.url())
 * );
 *
 * console.log('Current workers:');
 * for (const worker of page.workers()) {
 *   console.log('  ' + worker.url());
 * }
 * ```
 *
 * @public
 */
class WebWorker extends EventEmitter {
    /**
     * @internal
     */
    constructor(client, url, consoleAPICalled, exceptionThrown) {
        super();
        _WebWorker_executionContext.set(this, createDeferredPromise());
        _WebWorker_client.set(this, void 0);
        _WebWorker_url.set(this, void 0);
        __classPrivateFieldSet$p(this, _WebWorker_client, client, "f");
        __classPrivateFieldSet$p(this, _WebWorker_url, url, "f");
        __classPrivateFieldGet$q(this, _WebWorker_client, "f").once('Runtime.executionContextCreated', async (event) => {
            const context = new ExecutionContext(client, event.context);
            __classPrivateFieldGet$q(this, _WebWorker_executionContext, "f").resolve(context);
        });
        __classPrivateFieldGet$q(this, _WebWorker_client, "f").on('Runtime.consoleAPICalled', async (event) => {
            const context = await __classPrivateFieldGet$q(this, _WebWorker_executionContext, "f");
            return consoleAPICalled(event.type, event.args.map((object) => {
                return new JSHandle(context, object);
            }), event.stackTrace);
        });
        __classPrivateFieldGet$q(this, _WebWorker_client, "f").on('Runtime.exceptionThrown', exception => {
            return exceptionThrown(exception.exceptionDetails);
        });
        // This might fail if the target is closed before we receive all execution contexts.
        __classPrivateFieldGet$q(this, _WebWorker_client, "f").send('Runtime.enable').catch(debugError);
    }
    /**
     * @internal
     */
    async executionContext() {
        return __classPrivateFieldGet$q(this, _WebWorker_executionContext, "f");
    }
    /**
     * @returns The URL of this web worker.
     */
    url() {
        return __classPrivateFieldGet$q(this, _WebWorker_url, "f");
    }
    /**
     * If the function passed to the `worker.evaluate` returns a Promise, then
     * `worker.evaluate` would wait for the promise to resolve and return its
     * value. If the function passed to the `worker.evaluate` returns a
     * non-serializable value, then `worker.evaluate` resolves to `undefined`.
     * DevTools Protocol also supports transferring some additional values that
     * are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`, and
     * bigint literals.
     * Shortcut for `await worker.executionContext()).evaluate(pageFunction, ...args)`.
     *
     * @param pageFunction - Function to be evaluated in the worker context.
     * @param args - Arguments to pass to `pageFunction`.
     * @returns Promise which resolves to the return value of `pageFunction`.
     */
    async evaluate(pageFunction, ...args) {
        const context = await __classPrivateFieldGet$q(this, _WebWorker_executionContext, "f");
        return context.evaluate(pageFunction, ...args);
    }
    /**
     * The only difference between `worker.evaluate` and `worker.evaluateHandle`
     * is that `worker.evaluateHandle` returns in-page object (JSHandle). If the
     * function passed to the `worker.evaluateHandle` returns a `Promise`, then
     * `worker.evaluateHandle` would wait for the promise to resolve and return
     * its value. Shortcut for
     * `await worker.executionContext()).evaluateHandle(pageFunction, ...args)`
     *
     * @param pageFunction - Function to be evaluated in the page context.
     * @param args - Arguments to pass to `pageFunction`.
     * @returns Promise which resolves to the return value of `pageFunction`.
     */
    async evaluateHandle(pageFunction, ...args) {
        const context = await __classPrivateFieldGet$q(this, _WebWorker_executionContext, "f");
        return context.evaluateHandle(pageFunction, ...args);
    }
}
_WebWorker_executionContext = new WeakMap(), _WebWorker_client = new WeakMap(), _WebWorker_url = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$o = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$p = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConsoleMessage_type, _ConsoleMessage_text, _ConsoleMessage_args, _ConsoleMessage_stackTraceLocations;
/**
 * ConsoleMessage objects are dispatched by page via the 'console' event.
 * @public
 */
class ConsoleMessage {
    /**
     * @public
     */
    constructor(type, text, args, stackTraceLocations) {
        _ConsoleMessage_type.set(this, void 0);
        _ConsoleMessage_text.set(this, void 0);
        _ConsoleMessage_args.set(this, void 0);
        _ConsoleMessage_stackTraceLocations.set(this, void 0);
        __classPrivateFieldSet$o(this, _ConsoleMessage_type, type, "f");
        __classPrivateFieldSet$o(this, _ConsoleMessage_text, text, "f");
        __classPrivateFieldSet$o(this, _ConsoleMessage_args, args, "f");
        __classPrivateFieldSet$o(this, _ConsoleMessage_stackTraceLocations, stackTraceLocations, "f");
    }
    /**
     * @returns The type of the console message.
     */
    type() {
        return __classPrivateFieldGet$p(this, _ConsoleMessage_type, "f");
    }
    /**
     * @returns The text of the console message.
     */
    text() {
        return __classPrivateFieldGet$p(this, _ConsoleMessage_text, "f");
    }
    /**
     * @returns An array of arguments passed to the console.
     */
    args() {
        return __classPrivateFieldGet$p(this, _ConsoleMessage_args, "f");
    }
    /**
     * @returns The location of the console message.
     */
    location() {
        var _a;
        return (_a = __classPrivateFieldGet$p(this, _ConsoleMessage_stackTraceLocations, "f")[0]) !== null && _a !== void 0 ? _a : {};
    }
    /**
     * @returns The array of locations on the stack of the console message.
     */
    stackTrace() {
        return __classPrivateFieldGet$p(this, _ConsoleMessage_stackTraceLocations, "f");
    }
}
_ConsoleMessage_type = new WeakMap(), _ConsoleMessage_text = new WeakMap(), _ConsoleMessage_args = new WeakMap(), _ConsoleMessage_stackTraceLocations = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$n = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$o = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Coverage_jsCoverage, _Coverage_cssCoverage, _JSCoverage_instances, _JSCoverage_client, _JSCoverage_enabled, _JSCoverage_scriptURLs, _JSCoverage_scriptSources, _JSCoverage_eventListeners, _JSCoverage_resetOnNavigation, _JSCoverage_reportAnonymousScripts, _JSCoverage_includeRawScriptCoverage, _JSCoverage_onExecutionContextsCleared, _JSCoverage_onScriptParsed, _CSSCoverage_instances, _CSSCoverage_client, _CSSCoverage_enabled, _CSSCoverage_stylesheetURLs, _CSSCoverage_stylesheetSources, _CSSCoverage_eventListeners, _CSSCoverage_resetOnNavigation, _CSSCoverage_onExecutionContextsCleared, _CSSCoverage_onStyleSheet;
/**
 * The Coverage class provides methods to gathers information about parts of
 * JavaScript and CSS that were used by the page.
 *
 * @remarks
 * To output coverage in a form consumable by {@link https://github.com/istanbuljs | Istanbul},
 * see {@link https://github.com/istanbuljs/puppeteer-to-istanbul | puppeteer-to-istanbul}.
 *
 * @example
 * An example of using JavaScript and CSS coverage to get percentage of initially
 * executed code:
 *
 * ```ts
 * // Enable both JavaScript and CSS coverage
 * await Promise.all([
 *   page.coverage.startJSCoverage(),
 *   page.coverage.startCSSCoverage(),
 * ]);
 * // Navigate to page
 * await page.goto('https://example.com');
 * // Disable both JavaScript and CSS coverage
 * const [jsCoverage, cssCoverage] = await Promise.all([
 *   page.coverage.stopJSCoverage(),
 *   page.coverage.stopCSSCoverage(),
 * ]);
 * let totalBytes = 0;
 * let usedBytes = 0;
 * const coverage = [...jsCoverage, ...cssCoverage];
 * for (const entry of coverage) {
 *   totalBytes += entry.text.length;
 *   for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
 * }
 * console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
 * ```
 *
 * @public
 */
class Coverage {
    constructor(client) {
        _Coverage_jsCoverage.set(this, void 0);
        _Coverage_cssCoverage.set(this, void 0);
        __classPrivateFieldSet$n(this, _Coverage_jsCoverage, new JSCoverage(client), "f");
        __classPrivateFieldSet$n(this, _Coverage_cssCoverage, new CSSCoverage(client), "f");
    }
    /**
     * @param options - Set of configurable options for coverage defaults to
     * `resetOnNavigation : true, reportAnonymousScripts : false,`
     * `includeRawScriptCoverage : false, useBlockCoverage : true`
     * @returns Promise that resolves when coverage is started.
     *
     * @remarks
     * Anonymous scripts are ones that don't have an associated url. These are
     * scripts that are dynamically created on the page using `eval` or
     * `new Function`. If `reportAnonymousScripts` is set to `true`, anonymous
     * scripts URL will start with `debugger://VM` (unless a magic //# sourceURL
     * comment is present, in which case that will the be URL).
     */
    async startJSCoverage(options = {}) {
        return await __classPrivateFieldGet$o(this, _Coverage_jsCoverage, "f").start(options);
    }
    /**
     * @returns Promise that resolves to the array of coverage reports for
     * all scripts.
     *
     * @remarks
     * JavaScript Coverage doesn't include anonymous scripts by default.
     * However, scripts with sourceURLs are reported.
     */
    async stopJSCoverage() {
        return await __classPrivateFieldGet$o(this, _Coverage_jsCoverage, "f").stop();
    }
    /**
     * @param options - Set of configurable options for coverage, defaults to
     * `resetOnNavigation : true`
     * @returns Promise that resolves when coverage is started.
     */
    async startCSSCoverage(options = {}) {
        return await __classPrivateFieldGet$o(this, _Coverage_cssCoverage, "f").start(options);
    }
    /**
     * @returns Promise that resolves to the array of coverage reports
     * for all stylesheets.
     * @remarks
     * CSS Coverage doesn't include dynamically injected style tags
     * without sourceURLs.
     */
    async stopCSSCoverage() {
        return await __classPrivateFieldGet$o(this, _Coverage_cssCoverage, "f").stop();
    }
}
_Coverage_jsCoverage = new WeakMap(), _Coverage_cssCoverage = new WeakMap();
/**
 * @public
 */
class JSCoverage {
    constructor(client) {
        _JSCoverage_instances.add(this);
        _JSCoverage_client.set(this, void 0);
        _JSCoverage_enabled.set(this, false);
        _JSCoverage_scriptURLs.set(this, new Map());
        _JSCoverage_scriptSources.set(this, new Map());
        _JSCoverage_eventListeners.set(this, []);
        _JSCoverage_resetOnNavigation.set(this, false);
        _JSCoverage_reportAnonymousScripts.set(this, false);
        _JSCoverage_includeRawScriptCoverage.set(this, false);
        __classPrivateFieldSet$n(this, _JSCoverage_client, client, "f");
    }
    async start(options = {}) {
        assert(!__classPrivateFieldGet$o(this, _JSCoverage_enabled, "f"), 'JSCoverage is already enabled');
        const { resetOnNavigation = true, reportAnonymousScripts = false, includeRawScriptCoverage = false, useBlockCoverage = true, } = options;
        __classPrivateFieldSet$n(this, _JSCoverage_resetOnNavigation, resetOnNavigation, "f");
        __classPrivateFieldSet$n(this, _JSCoverage_reportAnonymousScripts, reportAnonymousScripts, "f");
        __classPrivateFieldSet$n(this, _JSCoverage_includeRawScriptCoverage, includeRawScriptCoverage, "f");
        __classPrivateFieldSet$n(this, _JSCoverage_enabled, true, "f");
        __classPrivateFieldGet$o(this, _JSCoverage_scriptURLs, "f").clear();
        __classPrivateFieldGet$o(this, _JSCoverage_scriptSources, "f").clear();
        __classPrivateFieldSet$n(this, _JSCoverage_eventListeners, [
            addEventListener(__classPrivateFieldGet$o(this, _JSCoverage_client, "f"), 'Debugger.scriptParsed', __classPrivateFieldGet$o(this, _JSCoverage_instances, "m", _JSCoverage_onScriptParsed).bind(this)),
            addEventListener(__classPrivateFieldGet$o(this, _JSCoverage_client, "f"), 'Runtime.executionContextsCleared', __classPrivateFieldGet$o(this, _JSCoverage_instances, "m", _JSCoverage_onExecutionContextsCleared).bind(this)),
        ], "f");
        await Promise.all([
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Profiler.enable'),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Profiler.startPreciseCoverage', {
                callCount: __classPrivateFieldGet$o(this, _JSCoverage_includeRawScriptCoverage, "f"),
                detailed: useBlockCoverage,
            }),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Debugger.enable'),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Debugger.setSkipAllPauses', { skip: true }),
        ]);
    }
    async stop() {
        assert(__classPrivateFieldGet$o(this, _JSCoverage_enabled, "f"), 'JSCoverage is not enabled');
        __classPrivateFieldSet$n(this, _JSCoverage_enabled, false, "f");
        const result = await Promise.all([
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Profiler.takePreciseCoverage'),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Profiler.stopPreciseCoverage'),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Profiler.disable'),
            __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Debugger.disable'),
        ]);
        removeEventListeners(__classPrivateFieldGet$o(this, _JSCoverage_eventListeners, "f"));
        const coverage = [];
        const profileResponse = result[0];
        for (const entry of profileResponse.result) {
            let url = __classPrivateFieldGet$o(this, _JSCoverage_scriptURLs, "f").get(entry.scriptId);
            if (!url && __classPrivateFieldGet$o(this, _JSCoverage_reportAnonymousScripts, "f")) {
                url = 'debugger://VM' + entry.scriptId;
            }
            const text = __classPrivateFieldGet$o(this, _JSCoverage_scriptSources, "f").get(entry.scriptId);
            if (text === undefined || url === undefined) {
                continue;
            }
            const flattenRanges = [];
            for (const func of entry.functions) {
                flattenRanges.push(...func.ranges);
            }
            const ranges = convertToDisjointRanges(flattenRanges);
            if (!__classPrivateFieldGet$o(this, _JSCoverage_includeRawScriptCoverage, "f")) {
                coverage.push({ url, ranges, text });
            }
            else {
                coverage.push({ url, ranges, text, rawScriptCoverage: entry });
            }
        }
        return coverage;
    }
}
_JSCoverage_client = new WeakMap(), _JSCoverage_enabled = new WeakMap(), _JSCoverage_scriptURLs = new WeakMap(), _JSCoverage_scriptSources = new WeakMap(), _JSCoverage_eventListeners = new WeakMap(), _JSCoverage_resetOnNavigation = new WeakMap(), _JSCoverage_reportAnonymousScripts = new WeakMap(), _JSCoverage_includeRawScriptCoverage = new WeakMap(), _JSCoverage_instances = new WeakSet(), _JSCoverage_onExecutionContextsCleared = function _JSCoverage_onExecutionContextsCleared() {
    if (!__classPrivateFieldGet$o(this, _JSCoverage_resetOnNavigation, "f")) {
        return;
    }
    __classPrivateFieldGet$o(this, _JSCoverage_scriptURLs, "f").clear();
    __classPrivateFieldGet$o(this, _JSCoverage_scriptSources, "f").clear();
}, _JSCoverage_onScriptParsed = async function _JSCoverage_onScriptParsed(event) {
    // Ignore puppeteer-injected scripts
    if (event.url === EVALUATION_SCRIPT_URL) {
        return;
    }
    // Ignore other anonymous scripts unless the reportAnonymousScripts option is true.
    if (!event.url && !__classPrivateFieldGet$o(this, _JSCoverage_reportAnonymousScripts, "f")) {
        return;
    }
    try {
        const response = await __classPrivateFieldGet$o(this, _JSCoverage_client, "f").send('Debugger.getScriptSource', {
            scriptId: event.scriptId,
        });
        __classPrivateFieldGet$o(this, _JSCoverage_scriptURLs, "f").set(event.scriptId, event.url);
        __classPrivateFieldGet$o(this, _JSCoverage_scriptSources, "f").set(event.scriptId, response.scriptSource);
    }
    catch (error) {
        // This might happen if the page has already navigated away.
        debugError(error);
    }
};
/**
 * @public
 */
class CSSCoverage {
    constructor(client) {
        _CSSCoverage_instances.add(this);
        _CSSCoverage_client.set(this, void 0);
        _CSSCoverage_enabled.set(this, false);
        _CSSCoverage_stylesheetURLs.set(this, new Map());
        _CSSCoverage_stylesheetSources.set(this, new Map());
        _CSSCoverage_eventListeners.set(this, []);
        _CSSCoverage_resetOnNavigation.set(this, false);
        __classPrivateFieldSet$n(this, _CSSCoverage_client, client, "f");
    }
    async start(options = {}) {
        assert(!__classPrivateFieldGet$o(this, _CSSCoverage_enabled, "f"), 'CSSCoverage is already enabled');
        const { resetOnNavigation = true } = options;
        __classPrivateFieldSet$n(this, _CSSCoverage_resetOnNavigation, resetOnNavigation, "f");
        __classPrivateFieldSet$n(this, _CSSCoverage_enabled, true, "f");
        __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetURLs, "f").clear();
        __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetSources, "f").clear();
        __classPrivateFieldSet$n(this, _CSSCoverage_eventListeners, [
            addEventListener(__classPrivateFieldGet$o(this, _CSSCoverage_client, "f"), 'CSS.styleSheetAdded', __classPrivateFieldGet$o(this, _CSSCoverage_instances, "m", _CSSCoverage_onStyleSheet).bind(this)),
            addEventListener(__classPrivateFieldGet$o(this, _CSSCoverage_client, "f"), 'Runtime.executionContextsCleared', __classPrivateFieldGet$o(this, _CSSCoverage_instances, "m", _CSSCoverage_onExecutionContextsCleared).bind(this)),
        ], "f");
        await Promise.all([
            __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('DOM.enable'),
            __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('CSS.enable'),
            __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('CSS.startRuleUsageTracking'),
        ]);
    }
    async stop() {
        assert(__classPrivateFieldGet$o(this, _CSSCoverage_enabled, "f"), 'CSSCoverage is not enabled');
        __classPrivateFieldSet$n(this, _CSSCoverage_enabled, false, "f");
        const ruleTrackingResponse = await __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('CSS.stopRuleUsageTracking');
        await Promise.all([
            __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('CSS.disable'),
            __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('DOM.disable'),
        ]);
        removeEventListeners(__classPrivateFieldGet$o(this, _CSSCoverage_eventListeners, "f"));
        // aggregate by styleSheetId
        const styleSheetIdToCoverage = new Map();
        for (const entry of ruleTrackingResponse.ruleUsage) {
            let ranges = styleSheetIdToCoverage.get(entry.styleSheetId);
            if (!ranges) {
                ranges = [];
                styleSheetIdToCoverage.set(entry.styleSheetId, ranges);
            }
            ranges.push({
                startOffset: entry.startOffset,
                endOffset: entry.endOffset,
                count: entry.used ? 1 : 0,
            });
        }
        const coverage = [];
        for (const styleSheetId of __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetURLs, "f").keys()) {
            const url = __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetURLs, "f").get(styleSheetId);
            assert(typeof url !== 'undefined', `Stylesheet URL is undefined (styleSheetId=${styleSheetId})`);
            const text = __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetSources, "f").get(styleSheetId);
            assert(typeof text !== 'undefined', `Stylesheet text is undefined (styleSheetId=${styleSheetId})`);
            const ranges = convertToDisjointRanges(styleSheetIdToCoverage.get(styleSheetId) || []);
            coverage.push({ url, ranges, text });
        }
        return coverage;
    }
}
_CSSCoverage_client = new WeakMap(), _CSSCoverage_enabled = new WeakMap(), _CSSCoverage_stylesheetURLs = new WeakMap(), _CSSCoverage_stylesheetSources = new WeakMap(), _CSSCoverage_eventListeners = new WeakMap(), _CSSCoverage_resetOnNavigation = new WeakMap(), _CSSCoverage_instances = new WeakSet(), _CSSCoverage_onExecutionContextsCleared = function _CSSCoverage_onExecutionContextsCleared() {
    if (!__classPrivateFieldGet$o(this, _CSSCoverage_resetOnNavigation, "f")) {
        return;
    }
    __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetURLs, "f").clear();
    __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetSources, "f").clear();
}, _CSSCoverage_onStyleSheet = async function _CSSCoverage_onStyleSheet(event) {
    const header = event.header;
    // Ignore anonymous scripts
    if (!header.sourceURL) {
        return;
    }
    try {
        const response = await __classPrivateFieldGet$o(this, _CSSCoverage_client, "f").send('CSS.getStyleSheetText', {
            styleSheetId: header.styleSheetId,
        });
        __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetURLs, "f").set(header.styleSheetId, header.sourceURL);
        __classPrivateFieldGet$o(this, _CSSCoverage_stylesheetSources, "f").set(header.styleSheetId, response.text);
    }
    catch (error) {
        // This might happen if the page has already navigated away.
        debugError(error);
    }
};
function convertToDisjointRanges(nestedRanges) {
    const points = [];
    for (const range of nestedRanges) {
        points.push({ offset: range.startOffset, type: 0, range });
        points.push({ offset: range.endOffset, type: 1, range });
    }
    // Sort points to form a valid parenthesis sequence.
    points.sort((a, b) => {
        // Sort with increasing offsets.
        if (a.offset !== b.offset) {
            return a.offset - b.offset;
        }
        // All "end" points should go before "start" points.
        if (a.type !== b.type) {
            return b.type - a.type;
        }
        const aLength = a.range.endOffset - a.range.startOffset;
        const bLength = b.range.endOffset - b.range.startOffset;
        // For two "start" points, the one with longer range goes first.
        if (a.type === 0) {
            return bLength - aLength;
        }
        // For two "end" points, the one with shorter range goes first.
        return aLength - bLength;
    });
    const hitCountStack = [];
    const results = [];
    let lastOffset = 0;
    // Run scanning line to intersect all ranges.
    for (const point of points) {
        if (hitCountStack.length &&
            lastOffset < point.offset &&
            hitCountStack[hitCountStack.length - 1] > 0) {
            const lastResult = results[results.length - 1];
            if (lastResult && lastResult.end === lastOffset) {
                lastResult.end = point.offset;
            }
            else {
                results.push({ start: lastOffset, end: point.offset });
            }
        }
        lastOffset = point.offset;
        if (point.type === 0) {
            hitCountStack.push(point.range.count);
        }
        else {
            hitCountStack.pop();
        }
    }
    // Filter out empty ranges.
    return results.filter(range => {
        return range.end - range.start > 0;
    });
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$m = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$n = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Dialog_client, _Dialog_type, _Dialog_message, _Dialog_defaultValue, _Dialog_handled;
/**
 * Dialog instances are dispatched by the {@link Page} via the `dialog` event.
 *
 * @remarks
 *
 * @example
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   page.on('dialog', async dialog => {
 *     console.log(dialog.message());
 *     await dialog.dismiss();
 *     await browser.close();
 *   });
 *   page.evaluate(() => alert('1'));
 * })();
 * ```
 *
 * @public
 */
class Dialog {
    /**
     * @internal
     */
    constructor(client, type, message, defaultValue = '') {
        _Dialog_client.set(this, void 0);
        _Dialog_type.set(this, void 0);
        _Dialog_message.set(this, void 0);
        _Dialog_defaultValue.set(this, void 0);
        _Dialog_handled.set(this, false);
        __classPrivateFieldSet$m(this, _Dialog_client, client, "f");
        __classPrivateFieldSet$m(this, _Dialog_type, type, "f");
        __classPrivateFieldSet$m(this, _Dialog_message, message, "f");
        __classPrivateFieldSet$m(this, _Dialog_defaultValue, defaultValue, "f");
    }
    /**
     * @returns The type of the dialog.
     */
    type() {
        return __classPrivateFieldGet$n(this, _Dialog_type, "f");
    }
    /**
     * @returns The message displayed in the dialog.
     */
    message() {
        return __classPrivateFieldGet$n(this, _Dialog_message, "f");
    }
    /**
     * @returns The default value of the prompt, or an empty string if the dialog
     * is not a `prompt`.
     */
    defaultValue() {
        return __classPrivateFieldGet$n(this, _Dialog_defaultValue, "f");
    }
    /**
     * @param promptText - optional text that will be entered in the dialog
     * prompt. Has no effect if the dialog's type is not `prompt`.
     *
     * @returns A promise that resolves when the dialog has been accepted.
     */
    async accept(promptText) {
        assert(!__classPrivateFieldGet$n(this, _Dialog_handled, "f"), 'Cannot accept dialog which is already handled!');
        __classPrivateFieldSet$m(this, _Dialog_handled, true, "f");
        await __classPrivateFieldGet$n(this, _Dialog_client, "f").send('Page.handleJavaScriptDialog', {
            accept: true,
            promptText: promptText,
        });
    }
    /**
     * @returns A promise which will resolve once the dialog has been dismissed
     */
    async dismiss() {
        assert(!__classPrivateFieldGet$n(this, _Dialog_handled, "f"), 'Cannot dismiss dialog which is already handled!');
        __classPrivateFieldSet$m(this, _Dialog_handled, true, "f");
        await __classPrivateFieldGet$n(this, _Dialog_client, "f").send('Page.handleJavaScriptDialog', {
            accept: false,
        });
    }
}
_Dialog_client = new WeakMap(), _Dialog_type = new WeakMap(), _Dialog_message = new WeakMap(), _Dialog_defaultValue = new WeakMap(), _Dialog_handled = new WeakMap();

var __classPrivateFieldSet$l = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$m = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EmulationManager_client, _EmulationManager_emulatingMobile, _EmulationManager_hasTouch;
/**
 * @internal
 */
class EmulationManager {
    constructor(client) {
        _EmulationManager_client.set(this, void 0);
        _EmulationManager_emulatingMobile.set(this, false);
        _EmulationManager_hasTouch.set(this, false);
        __classPrivateFieldSet$l(this, _EmulationManager_client, client, "f");
    }
    async emulateViewport(viewport) {
        const mobile = viewport.isMobile || false;
        const width = viewport.width;
        const height = viewport.height;
        const deviceScaleFactor = viewport.deviceScaleFactor || 1;
        const screenOrientation = viewport.isLandscape
            ? { angle: 90, type: 'landscapePrimary' }
            : { angle: 0, type: 'portraitPrimary' };
        const hasTouch = viewport.hasTouch || false;
        await Promise.all([
            __classPrivateFieldGet$m(this, _EmulationManager_client, "f").send('Emulation.setDeviceMetricsOverride', {
                mobile,
                width,
                height,
                deviceScaleFactor,
                screenOrientation,
            }),
            __classPrivateFieldGet$m(this, _EmulationManager_client, "f").send('Emulation.setTouchEmulationEnabled', {
                enabled: hasTouch,
            }),
        ]);
        const reloadNeeded = __classPrivateFieldGet$m(this, _EmulationManager_emulatingMobile, "f") !== mobile || __classPrivateFieldGet$m(this, _EmulationManager_hasTouch, "f") !== hasTouch;
        __classPrivateFieldSet$l(this, _EmulationManager_emulatingMobile, mobile, "f");
        __classPrivateFieldSet$l(this, _EmulationManager_hasTouch, hasTouch, "f");
        return reloadNeeded;
    }
}
_EmulationManager_client = new WeakMap(), _EmulationManager_emulatingMobile = new WeakMap(), _EmulationManager_hasTouch = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$k = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$l = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FileChooser_element, _FileChooser_multiple, _FileChooser_handled;
/**
 * File choosers let you react to the page requesting for a file.
 *
 * @remarks
 * `FileChooser` instances are returned via the {@link Page.waitForFileChooser} method.
 *
 * In browsers, only one file chooser can be opened at a time.
 * All file choosers must be accepted or canceled. Not doing so will prevent
 * subsequent file choosers from appearing.
 *
 * @example
 *
 * ```ts
 * const [fileChooser] = await Promise.all([
 *   page.waitForFileChooser(),
 *   page.click('#upload-file-button'), // some button that triggers file selection
 * ]);
 * await fileChooser.accept(['/tmp/myfile.pdf']);
 * ```
 *
 * @public
 */
class FileChooser {
    /**
     * @internal
     */
    constructor(element, event) {
        _FileChooser_element.set(this, void 0);
        _FileChooser_multiple.set(this, void 0);
        _FileChooser_handled.set(this, false);
        __classPrivateFieldSet$k(this, _FileChooser_element, element, "f");
        __classPrivateFieldSet$k(this, _FileChooser_multiple, event.mode !== 'selectSingle', "f");
    }
    /**
     * Whether file chooser allow for
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-multiple | multiple}
     * file selection.
     */
    isMultiple() {
        return __classPrivateFieldGet$l(this, _FileChooser_multiple, "f");
    }
    /**
     * Accept the file chooser request with given paths.
     *
     * @param filePaths - If some of the `filePaths` are relative paths, then
     * they are resolved relative to the
     * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
     */
    async accept(filePaths) {
        assert(!__classPrivateFieldGet$l(this, _FileChooser_handled, "f"), 'Cannot accept FileChooser which is already handled!');
        __classPrivateFieldSet$k(this, _FileChooser_handled, true, "f");
        await __classPrivateFieldGet$l(this, _FileChooser_element, "f").uploadFile(...filePaths);
    }
    /**
     * Closes the file chooser without selecting any files.
     */
    cancel() {
        assert(!__classPrivateFieldGet$l(this, _FileChooser_handled, "f"), 'Cannot cancel FileChooser which is already handled!');
        __classPrivateFieldSet$k(this, _FileChooser_handled, true, "f");
    }
}
_FileChooser_element = new WeakMap(), _FileChooser_multiple = new WeakMap(), _FileChooser_handled = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const _keyDefinitions = {
    '0': { keyCode: 48, key: '0', code: 'Digit0' },
    '1': { keyCode: 49, key: '1', code: 'Digit1' },
    '2': { keyCode: 50, key: '2', code: 'Digit2' },
    '3': { keyCode: 51, key: '3', code: 'Digit3' },
    '4': { keyCode: 52, key: '4', code: 'Digit4' },
    '5': { keyCode: 53, key: '5', code: 'Digit5' },
    '6': { keyCode: 54, key: '6', code: 'Digit6' },
    '7': { keyCode: 55, key: '7', code: 'Digit7' },
    '8': { keyCode: 56, key: '8', code: 'Digit8' },
    '9': { keyCode: 57, key: '9', code: 'Digit9' },
    Power: { key: 'Power', code: 'Power' },
    Eject: { key: 'Eject', code: 'Eject' },
    Abort: { keyCode: 3, code: 'Abort', key: 'Cancel' },
    Help: { keyCode: 6, code: 'Help', key: 'Help' },
    Backspace: { keyCode: 8, code: 'Backspace', key: 'Backspace' },
    Tab: { keyCode: 9, code: 'Tab', key: 'Tab' },
    Numpad5: {
        keyCode: 12,
        shiftKeyCode: 101,
        key: 'Clear',
        code: 'Numpad5',
        shiftKey: '5',
        location: 3,
    },
    NumpadEnter: {
        keyCode: 13,
        code: 'NumpadEnter',
        key: 'Enter',
        text: '\r',
        location: 3,
    },
    Enter: { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    '\r': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    '\n': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    ShiftLeft: { keyCode: 16, code: 'ShiftLeft', key: 'Shift', location: 1 },
    ShiftRight: { keyCode: 16, code: 'ShiftRight', key: 'Shift', location: 2 },
    ControlLeft: {
        keyCode: 17,
        code: 'ControlLeft',
        key: 'Control',
        location: 1,
    },
    ControlRight: {
        keyCode: 17,
        code: 'ControlRight',
        key: 'Control',
        location: 2,
    },
    AltLeft: { keyCode: 18, code: 'AltLeft', key: 'Alt', location: 1 },
    AltRight: { keyCode: 18, code: 'AltRight', key: 'Alt', location: 2 },
    Pause: { keyCode: 19, code: 'Pause', key: 'Pause' },
    CapsLock: { keyCode: 20, code: 'CapsLock', key: 'CapsLock' },
    Escape: { keyCode: 27, code: 'Escape', key: 'Escape' },
    Convert: { keyCode: 28, code: 'Convert', key: 'Convert' },
    NonConvert: { keyCode: 29, code: 'NonConvert', key: 'NonConvert' },
    Space: { keyCode: 32, code: 'Space', key: ' ' },
    Numpad9: {
        keyCode: 33,
        shiftKeyCode: 105,
        key: 'PageUp',
        code: 'Numpad9',
        shiftKey: '9',
        location: 3,
    },
    PageUp: { keyCode: 33, code: 'PageUp', key: 'PageUp' },
    Numpad3: {
        keyCode: 34,
        shiftKeyCode: 99,
        key: 'PageDown',
        code: 'Numpad3',
        shiftKey: '3',
        location: 3,
    },
    PageDown: { keyCode: 34, code: 'PageDown', key: 'PageDown' },
    End: { keyCode: 35, code: 'End', key: 'End' },
    Numpad1: {
        keyCode: 35,
        shiftKeyCode: 97,
        key: 'End',
        code: 'Numpad1',
        shiftKey: '1',
        location: 3,
    },
    Home: { keyCode: 36, code: 'Home', key: 'Home' },
    Numpad7: {
        keyCode: 36,
        shiftKeyCode: 103,
        key: 'Home',
        code: 'Numpad7',
        shiftKey: '7',
        location: 3,
    },
    ArrowLeft: { keyCode: 37, code: 'ArrowLeft', key: 'ArrowLeft' },
    Numpad4: {
        keyCode: 37,
        shiftKeyCode: 100,
        key: 'ArrowLeft',
        code: 'Numpad4',
        shiftKey: '4',
        location: 3,
    },
    Numpad8: {
        keyCode: 38,
        shiftKeyCode: 104,
        key: 'ArrowUp',
        code: 'Numpad8',
        shiftKey: '8',
        location: 3,
    },
    ArrowUp: { keyCode: 38, code: 'ArrowUp', key: 'ArrowUp' },
    ArrowRight: { keyCode: 39, code: 'ArrowRight', key: 'ArrowRight' },
    Numpad6: {
        keyCode: 39,
        shiftKeyCode: 102,
        key: 'ArrowRight',
        code: 'Numpad6',
        shiftKey: '6',
        location: 3,
    },
    Numpad2: {
        keyCode: 40,
        shiftKeyCode: 98,
        key: 'ArrowDown',
        code: 'Numpad2',
        shiftKey: '2',
        location: 3,
    },
    ArrowDown: { keyCode: 40, code: 'ArrowDown', key: 'ArrowDown' },
    Select: { keyCode: 41, code: 'Select', key: 'Select' },
    Open: { keyCode: 43, code: 'Open', key: 'Execute' },
    PrintScreen: { keyCode: 44, code: 'PrintScreen', key: 'PrintScreen' },
    Insert: { keyCode: 45, code: 'Insert', key: 'Insert' },
    Numpad0: {
        keyCode: 45,
        shiftKeyCode: 96,
        key: 'Insert',
        code: 'Numpad0',
        shiftKey: '0',
        location: 3,
    },
    Delete: { keyCode: 46, code: 'Delete', key: 'Delete' },
    NumpadDecimal: {
        keyCode: 46,
        shiftKeyCode: 110,
        code: 'NumpadDecimal',
        key: '\u0000',
        shiftKey: '.',
        location: 3,
    },
    Digit0: { keyCode: 48, code: 'Digit0', shiftKey: ')', key: '0' },
    Digit1: { keyCode: 49, code: 'Digit1', shiftKey: '!', key: '1' },
    Digit2: { keyCode: 50, code: 'Digit2', shiftKey: '@', key: '2' },
    Digit3: { keyCode: 51, code: 'Digit3', shiftKey: '#', key: '3' },
    Digit4: { keyCode: 52, code: 'Digit4', shiftKey: '$', key: '4' },
    Digit5: { keyCode: 53, code: 'Digit5', shiftKey: '%', key: '5' },
    Digit6: { keyCode: 54, code: 'Digit6', shiftKey: '^', key: '6' },
    Digit7: { keyCode: 55, code: 'Digit7', shiftKey: '&', key: '7' },
    Digit8: { keyCode: 56, code: 'Digit8', shiftKey: '*', key: '8' },
    Digit9: { keyCode: 57, code: 'Digit9', shiftKey: '(', key: '9' },
    KeyA: { keyCode: 65, code: 'KeyA', shiftKey: 'A', key: 'a' },
    KeyB: { keyCode: 66, code: 'KeyB', shiftKey: 'B', key: 'b' },
    KeyC: { keyCode: 67, code: 'KeyC', shiftKey: 'C', key: 'c' },
    KeyD: { keyCode: 68, code: 'KeyD', shiftKey: 'D', key: 'd' },
    KeyE: { keyCode: 69, code: 'KeyE', shiftKey: 'E', key: 'e' },
    KeyF: { keyCode: 70, code: 'KeyF', shiftKey: 'F', key: 'f' },
    KeyG: { keyCode: 71, code: 'KeyG', shiftKey: 'G', key: 'g' },
    KeyH: { keyCode: 72, code: 'KeyH', shiftKey: 'H', key: 'h' },
    KeyI: { keyCode: 73, code: 'KeyI', shiftKey: 'I', key: 'i' },
    KeyJ: { keyCode: 74, code: 'KeyJ', shiftKey: 'J', key: 'j' },
    KeyK: { keyCode: 75, code: 'KeyK', shiftKey: 'K', key: 'k' },
    KeyL: { keyCode: 76, code: 'KeyL', shiftKey: 'L', key: 'l' },
    KeyM: { keyCode: 77, code: 'KeyM', shiftKey: 'M', key: 'm' },
    KeyN: { keyCode: 78, code: 'KeyN', shiftKey: 'N', key: 'n' },
    KeyO: { keyCode: 79, code: 'KeyO', shiftKey: 'O', key: 'o' },
    KeyP: { keyCode: 80, code: 'KeyP', shiftKey: 'P', key: 'p' },
    KeyQ: { keyCode: 81, code: 'KeyQ', shiftKey: 'Q', key: 'q' },
    KeyR: { keyCode: 82, code: 'KeyR', shiftKey: 'R', key: 'r' },
    KeyS: { keyCode: 83, code: 'KeyS', shiftKey: 'S', key: 's' },
    KeyT: { keyCode: 84, code: 'KeyT', shiftKey: 'T', key: 't' },
    KeyU: { keyCode: 85, code: 'KeyU', shiftKey: 'U', key: 'u' },
    KeyV: { keyCode: 86, code: 'KeyV', shiftKey: 'V', key: 'v' },
    KeyW: { keyCode: 87, code: 'KeyW', shiftKey: 'W', key: 'w' },
    KeyX: { keyCode: 88, code: 'KeyX', shiftKey: 'X', key: 'x' },
    KeyY: { keyCode: 89, code: 'KeyY', shiftKey: 'Y', key: 'y' },
    KeyZ: { keyCode: 90, code: 'KeyZ', shiftKey: 'Z', key: 'z' },
    MetaLeft: { keyCode: 91, code: 'MetaLeft', key: 'Meta', location: 1 },
    MetaRight: { keyCode: 92, code: 'MetaRight', key: 'Meta', location: 2 },
    ContextMenu: { keyCode: 93, code: 'ContextMenu', key: 'ContextMenu' },
    NumpadMultiply: {
        keyCode: 106,
        code: 'NumpadMultiply',
        key: '*',
        location: 3,
    },
    NumpadAdd: { keyCode: 107, code: 'NumpadAdd', key: '+', location: 3 },
    NumpadSubtract: {
        keyCode: 109,
        code: 'NumpadSubtract',
        key: '-',
        location: 3,
    },
    NumpadDivide: { keyCode: 111, code: 'NumpadDivide', key: '/', location: 3 },
    F1: { keyCode: 112, code: 'F1', key: 'F1' },
    F2: { keyCode: 113, code: 'F2', key: 'F2' },
    F3: { keyCode: 114, code: 'F3', key: 'F3' },
    F4: { keyCode: 115, code: 'F4', key: 'F4' },
    F5: { keyCode: 116, code: 'F5', key: 'F5' },
    F6: { keyCode: 117, code: 'F6', key: 'F6' },
    F7: { keyCode: 118, code: 'F7', key: 'F7' },
    F8: { keyCode: 119, code: 'F8', key: 'F8' },
    F9: { keyCode: 120, code: 'F9', key: 'F9' },
    F10: { keyCode: 121, code: 'F10', key: 'F10' },
    F11: { keyCode: 122, code: 'F11', key: 'F11' },
    F12: { keyCode: 123, code: 'F12', key: 'F12' },
    F13: { keyCode: 124, code: 'F13', key: 'F13' },
    F14: { keyCode: 125, code: 'F14', key: 'F14' },
    F15: { keyCode: 126, code: 'F15', key: 'F15' },
    F16: { keyCode: 127, code: 'F16', key: 'F16' },
    F17: { keyCode: 128, code: 'F17', key: 'F17' },
    F18: { keyCode: 129, code: 'F18', key: 'F18' },
    F19: { keyCode: 130, code: 'F19', key: 'F19' },
    F20: { keyCode: 131, code: 'F20', key: 'F20' },
    F21: { keyCode: 132, code: 'F21', key: 'F21' },
    F22: { keyCode: 133, code: 'F22', key: 'F22' },
    F23: { keyCode: 134, code: 'F23', key: 'F23' },
    F24: { keyCode: 135, code: 'F24', key: 'F24' },
    NumLock: { keyCode: 144, code: 'NumLock', key: 'NumLock' },
    ScrollLock: { keyCode: 145, code: 'ScrollLock', key: 'ScrollLock' },
    AudioVolumeMute: {
        keyCode: 173,
        code: 'AudioVolumeMute',
        key: 'AudioVolumeMute',
    },
    AudioVolumeDown: {
        keyCode: 174,
        code: 'AudioVolumeDown',
        key: 'AudioVolumeDown',
    },
    AudioVolumeUp: { keyCode: 175, code: 'AudioVolumeUp', key: 'AudioVolumeUp' },
    MediaTrackNext: {
        keyCode: 176,
        code: 'MediaTrackNext',
        key: 'MediaTrackNext',
    },
    MediaTrackPrevious: {
        keyCode: 177,
        code: 'MediaTrackPrevious',
        key: 'MediaTrackPrevious',
    },
    MediaStop: { keyCode: 178, code: 'MediaStop', key: 'MediaStop' },
    MediaPlayPause: {
        keyCode: 179,
        code: 'MediaPlayPause',
        key: 'MediaPlayPause',
    },
    Semicolon: { keyCode: 186, code: 'Semicolon', shiftKey: ':', key: ';' },
    Equal: { keyCode: 187, code: 'Equal', shiftKey: '+', key: '=' },
    NumpadEqual: { keyCode: 187, code: 'NumpadEqual', key: '=', location: 3 },
    Comma: { keyCode: 188, code: 'Comma', shiftKey: '<', key: ',' },
    Minus: { keyCode: 189, code: 'Minus', shiftKey: '_', key: '-' },
    Period: { keyCode: 190, code: 'Period', shiftKey: '>', key: '.' },
    Slash: { keyCode: 191, code: 'Slash', shiftKey: '?', key: '/' },
    Backquote: { keyCode: 192, code: 'Backquote', shiftKey: '~', key: '`' },
    BracketLeft: { keyCode: 219, code: 'BracketLeft', shiftKey: '{', key: '[' },
    Backslash: { keyCode: 220, code: 'Backslash', shiftKey: '|', key: '\\' },
    BracketRight: { keyCode: 221, code: 'BracketRight', shiftKey: '}', key: ']' },
    Quote: { keyCode: 222, code: 'Quote', shiftKey: '"', key: "'" },
    AltGraph: { keyCode: 225, code: 'AltGraph', key: 'AltGraph' },
    Props: { keyCode: 247, code: 'Props', key: 'CrSel' },
    Cancel: { keyCode: 3, key: 'Cancel', code: 'Abort' },
    Clear: { keyCode: 12, key: 'Clear', code: 'Numpad5', location: 3 },
    Shift: { keyCode: 16, key: 'Shift', code: 'ShiftLeft', location: 1 },
    Control: { keyCode: 17, key: 'Control', code: 'ControlLeft', location: 1 },
    Alt: { keyCode: 18, key: 'Alt', code: 'AltLeft', location: 1 },
    Accept: { keyCode: 30, key: 'Accept' },
    ModeChange: { keyCode: 31, key: 'ModeChange' },
    ' ': { keyCode: 32, key: ' ', code: 'Space' },
    Print: { keyCode: 42, key: 'Print' },
    Execute: { keyCode: 43, key: 'Execute', code: 'Open' },
    '\u0000': { keyCode: 46, key: '\u0000', code: 'NumpadDecimal', location: 3 },
    a: { keyCode: 65, key: 'a', code: 'KeyA' },
    b: { keyCode: 66, key: 'b', code: 'KeyB' },
    c: { keyCode: 67, key: 'c', code: 'KeyC' },
    d: { keyCode: 68, key: 'd', code: 'KeyD' },
    e: { keyCode: 69, key: 'e', code: 'KeyE' },
    f: { keyCode: 70, key: 'f', code: 'KeyF' },
    g: { keyCode: 71, key: 'g', code: 'KeyG' },
    h: { keyCode: 72, key: 'h', code: 'KeyH' },
    i: { keyCode: 73, key: 'i', code: 'KeyI' },
    j: { keyCode: 74, key: 'j', code: 'KeyJ' },
    k: { keyCode: 75, key: 'k', code: 'KeyK' },
    l: { keyCode: 76, key: 'l', code: 'KeyL' },
    m: { keyCode: 77, key: 'm', code: 'KeyM' },
    n: { keyCode: 78, key: 'n', code: 'KeyN' },
    o: { keyCode: 79, key: 'o', code: 'KeyO' },
    p: { keyCode: 80, key: 'p', code: 'KeyP' },
    q: { keyCode: 81, key: 'q', code: 'KeyQ' },
    r: { keyCode: 82, key: 'r', code: 'KeyR' },
    s: { keyCode: 83, key: 's', code: 'KeyS' },
    t: { keyCode: 84, key: 't', code: 'KeyT' },
    u: { keyCode: 85, key: 'u', code: 'KeyU' },
    v: { keyCode: 86, key: 'v', code: 'KeyV' },
    w: { keyCode: 87, key: 'w', code: 'KeyW' },
    x: { keyCode: 88, key: 'x', code: 'KeyX' },
    y: { keyCode: 89, key: 'y', code: 'KeyY' },
    z: { keyCode: 90, key: 'z', code: 'KeyZ' },
    Meta: { keyCode: 91, key: 'Meta', code: 'MetaLeft', location: 1 },
    '*': { keyCode: 106, key: '*', code: 'NumpadMultiply', location: 3 },
    '+': { keyCode: 107, key: '+', code: 'NumpadAdd', location: 3 },
    '-': { keyCode: 109, key: '-', code: 'NumpadSubtract', location: 3 },
    '/': { keyCode: 111, key: '/', code: 'NumpadDivide', location: 3 },
    ';': { keyCode: 186, key: ';', code: 'Semicolon' },
    '=': { keyCode: 187, key: '=', code: 'Equal' },
    ',': { keyCode: 188, key: ',', code: 'Comma' },
    '.': { keyCode: 190, key: '.', code: 'Period' },
    '`': { keyCode: 192, key: '`', code: 'Backquote' },
    '[': { keyCode: 219, key: '[', code: 'BracketLeft' },
    '\\': { keyCode: 220, key: '\\', code: 'Backslash' },
    ']': { keyCode: 221, key: ']', code: 'BracketRight' },
    "'": { keyCode: 222, key: "'", code: 'Quote' },
    Attn: { keyCode: 246, key: 'Attn' },
    CrSel: { keyCode: 247, key: 'CrSel', code: 'Props' },
    ExSel: { keyCode: 248, key: 'ExSel' },
    EraseEof: { keyCode: 249, key: 'EraseEof' },
    Play: { keyCode: 250, key: 'Play' },
    ZoomOut: { keyCode: 251, key: 'ZoomOut' },
    ')': { keyCode: 48, key: ')', code: 'Digit0' },
    '!': { keyCode: 49, key: '!', code: 'Digit1' },
    '@': { keyCode: 50, key: '@', code: 'Digit2' },
    '#': { keyCode: 51, key: '#', code: 'Digit3' },
    $: { keyCode: 52, key: '$', code: 'Digit4' },
    '%': { keyCode: 53, key: '%', code: 'Digit5' },
    '^': { keyCode: 54, key: '^', code: 'Digit6' },
    '&': { keyCode: 55, key: '&', code: 'Digit7' },
    '(': { keyCode: 57, key: '(', code: 'Digit9' },
    A: { keyCode: 65, key: 'A', code: 'KeyA' },
    B: { keyCode: 66, key: 'B', code: 'KeyB' },
    C: { keyCode: 67, key: 'C', code: 'KeyC' },
    D: { keyCode: 68, key: 'D', code: 'KeyD' },
    E: { keyCode: 69, key: 'E', code: 'KeyE' },
    F: { keyCode: 70, key: 'F', code: 'KeyF' },
    G: { keyCode: 71, key: 'G', code: 'KeyG' },
    H: { keyCode: 72, key: 'H', code: 'KeyH' },
    I: { keyCode: 73, key: 'I', code: 'KeyI' },
    J: { keyCode: 74, key: 'J', code: 'KeyJ' },
    K: { keyCode: 75, key: 'K', code: 'KeyK' },
    L: { keyCode: 76, key: 'L', code: 'KeyL' },
    M: { keyCode: 77, key: 'M', code: 'KeyM' },
    N: { keyCode: 78, key: 'N', code: 'KeyN' },
    O: { keyCode: 79, key: 'O', code: 'KeyO' },
    P: { keyCode: 80, key: 'P', code: 'KeyP' },
    Q: { keyCode: 81, key: 'Q', code: 'KeyQ' },
    R: { keyCode: 82, key: 'R', code: 'KeyR' },
    S: { keyCode: 83, key: 'S', code: 'KeyS' },
    T: { keyCode: 84, key: 'T', code: 'KeyT' },
    U: { keyCode: 85, key: 'U', code: 'KeyU' },
    V: { keyCode: 86, key: 'V', code: 'KeyV' },
    W: { keyCode: 87, key: 'W', code: 'KeyW' },
    X: { keyCode: 88, key: 'X', code: 'KeyX' },
    Y: { keyCode: 89, key: 'Y', code: 'KeyY' },
    Z: { keyCode: 90, key: 'Z', code: 'KeyZ' },
    ':': { keyCode: 186, key: ':', code: 'Semicolon' },
    '<': { keyCode: 188, key: '<', code: 'Comma' },
    _: { keyCode: 189, key: '_', code: 'Minus' },
    '>': { keyCode: 190, key: '>', code: 'Period' },
    '?': { keyCode: 191, key: '?', code: 'Slash' },
    '~': { keyCode: 192, key: '~', code: 'Backquote' },
    '{': { keyCode: 219, key: '{', code: 'BracketLeft' },
    '|': { keyCode: 220, key: '|', code: 'Backslash' },
    '}': { keyCode: 221, key: '}', code: 'BracketRight' },
    '"': { keyCode: 222, key: '"', code: 'Quote' },
    SoftLeft: { key: 'SoftLeft', code: 'SoftLeft', location: 4 },
    SoftRight: { key: 'SoftRight', code: 'SoftRight', location: 4 },
    Camera: { keyCode: 44, key: 'Camera', code: 'Camera', location: 4 },
    Call: { key: 'Call', code: 'Call', location: 4 },
    EndCall: { keyCode: 95, key: 'EndCall', code: 'EndCall', location: 4 },
    VolumeDown: {
        keyCode: 182,
        key: 'VolumeDown',
        code: 'VolumeDown',
        location: 4,
    },
    VolumeUp: { keyCode: 183, key: 'VolumeUp', code: 'VolumeUp', location: 4 },
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$j = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$k = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Keyboard_instances, _Keyboard_client, _Keyboard_pressedKeys, _Keyboard_modifierBit, _Keyboard_keyDescriptionForString, _Mouse_client, _Mouse_keyboard, _Mouse_x, _Mouse_y, _Mouse_button, _Touchscreen_client, _Touchscreen_keyboard;
/**
 * Keyboard provides an api for managing a virtual keyboard.
 * The high level api is {@link Keyboard."type"},
 * which takes raw characters and generates proper keydown, keypress/input,
 * and keyup events on your page.
 *
 * @remarks
 * For finer control, you can use {@link Keyboard.down},
 * {@link Keyboard.up}, and {@link Keyboard.sendCharacter}
 * to manually fire events as if they were generated from a real keyboard.
 *
 * On macOS, keyboard shortcuts like `⌘ A` -\> Select All do not work.
 * See {@link https://github.com/puppeteer/puppeteer/issues/1313 | #1313}.
 *
 * @example
 * An example of holding down `Shift` in order to select and delete some text:
 *
 * ```ts
 * await page.keyboard.type('Hello World!');
 * await page.keyboard.press('ArrowLeft');
 *
 * await page.keyboard.down('Shift');
 * for (let i = 0; i < ' World'.length; i++)
 *   await page.keyboard.press('ArrowLeft');
 * await page.keyboard.up('Shift');
 *
 * await page.keyboard.press('Backspace');
 * // Result text will end up saying 'Hello!'
 * ```
 *
 * @example
 * An example of pressing `A`
 *
 * ```ts
 * await page.keyboard.down('Shift');
 * await page.keyboard.press('KeyA');
 * await page.keyboard.up('Shift');
 * ```
 *
 * @public
 */
class Keyboard {
    /**
     * @internal
     */
    constructor(client) {
        _Keyboard_instances.add(this);
        _Keyboard_client.set(this, void 0);
        _Keyboard_pressedKeys.set(this, new Set());
        /**
         * @internal
         */
        this._modifiers = 0;
        __classPrivateFieldSet$j(this, _Keyboard_client, client, "f");
    }
    /**
     * Dispatches a `keydown` event.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also generated.
     * The `text` option can be specified to force an input event to be generated.
     * If `key` is a modifier key, `Shift`, `Meta`, `Control`, or `Alt`,
     * subsequent key presses will be sent with that modifier active.
     * To release the modifier key, use {@link Keyboard.up}.
     *
     * After the key is pressed once, subsequent calls to
     * {@link Keyboard.down} will have
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat | repeat}
     * set to true. To release the key, use {@link Keyboard.up}.
     *
     * Modifier keys DO influence {@link Keyboard.down}.
     * Holding down `Shift` will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     *
     * @param options - An object of options. Accepts text which, if specified,
     * generates an input event with this text.
     */
    async down(key, options = { text: undefined }) {
        const description = __classPrivateFieldGet$k(this, _Keyboard_instances, "m", _Keyboard_keyDescriptionForString).call(this, key);
        const autoRepeat = __classPrivateFieldGet$k(this, _Keyboard_pressedKeys, "f").has(description.code);
        __classPrivateFieldGet$k(this, _Keyboard_pressedKeys, "f").add(description.code);
        this._modifiers |= __classPrivateFieldGet$k(this, _Keyboard_instances, "m", _Keyboard_modifierBit).call(this, description.key);
        const text = options.text === undefined ? description.text : options.text;
        await __classPrivateFieldGet$k(this, _Keyboard_client, "f").send('Input.dispatchKeyEvent', {
            type: text ? 'keyDown' : 'rawKeyDown',
            modifiers: this._modifiers,
            windowsVirtualKeyCode: description.keyCode,
            code: description.code,
            key: description.key,
            text: text,
            unmodifiedText: text,
            autoRepeat,
            location: description.location,
            isKeypad: description.location === 3,
        });
    }
    /**
     * Dispatches a `keyup` event.
     *
     * @param key - Name of key to release, such as `ArrowLeft`.
     * See {@link KeyInput | KeyInput}
     * for a list of all key names.
     */
    async up(key) {
        const description = __classPrivateFieldGet$k(this, _Keyboard_instances, "m", _Keyboard_keyDescriptionForString).call(this, key);
        this._modifiers &= ~__classPrivateFieldGet$k(this, _Keyboard_instances, "m", _Keyboard_modifierBit).call(this, description.key);
        __classPrivateFieldGet$k(this, _Keyboard_pressedKeys, "f").delete(description.code);
        await __classPrivateFieldGet$k(this, _Keyboard_client, "f").send('Input.dispatchKeyEvent', {
            type: 'keyUp',
            modifiers: this._modifiers,
            key: description.key,
            windowsVirtualKeyCode: description.keyCode,
            code: description.code,
            location: description.location,
        });
    }
    /**
     * Dispatches a `keypress` and `input` event.
     * This does not send a `keydown` or `keyup` event.
     *
     * @remarks
     * Modifier keys DO NOT effect {@link Keyboard.sendCharacter | Keyboard.sendCharacter}.
     * Holding down `Shift` will not type the text in upper case.
     *
     * @example
     *
     * ```ts
     * page.keyboard.sendCharacter('嗨');
     * ```
     *
     * @param char - Character to send into the page.
     */
    async sendCharacter(char) {
        await __classPrivateFieldGet$k(this, _Keyboard_client, "f").send('Input.insertText', { text: char });
    }
    charIsKey(char) {
        return !!_keyDefinitions[char];
    }
    /**
     * Sends a `keydown`, `keypress`/`input`,
     * and `keyup` event for each character in the text.
     *
     * @remarks
     * To press a special key, like `Control` or `ArrowDown`,
     * use {@link Keyboard.press}.
     *
     * Modifier keys DO NOT effect `keyboard.type`.
     * Holding down `Shift` will not type the text in upper case.
     *
     * @example
     *
     * ```ts
     * await page.keyboard.type('Hello'); // Types instantly
     * await page.keyboard.type('World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @param text - A text to type into a focused element.
     * @param options - An object of options. Accepts delay which,
     * if specified, is the time to wait between `keydown` and `keyup` in milliseconds.
     * Defaults to 0.
     */
    async type(text, options = {}) {
        const delay = options.delay || undefined;
        for (const char of text) {
            if (this.charIsKey(char)) {
                await this.press(char, { delay });
            }
            else {
                if (delay) {
                    await new Promise(f => {
                        return setTimeout(f, delay);
                    });
                }
                await this.sendCharacter(char);
            }
        }
    }
    /**
     * Shortcut for {@link Keyboard.down}
     * and {@link Keyboard.up}.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also generated.
     * The `text` option can be specified to force an input event to be generated.
     *
     * Modifier keys DO effect {@link Keyboard.press}.
     * Holding down `Shift` will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     *
     * @param options - An object of options. Accepts text which, if specified,
     * generates an input event with this text. Accepts delay which,
     * if specified, is the time to wait between `keydown` and `keyup` in milliseconds.
     * Defaults to 0.
     */
    async press(key, options = {}) {
        const { delay = null } = options;
        await this.down(key, options);
        if (delay) {
            await new Promise(f => {
                return setTimeout(f, options.delay);
            });
        }
        await this.up(key);
    }
}
_Keyboard_client = new WeakMap(), _Keyboard_pressedKeys = new WeakMap(), _Keyboard_instances = new WeakSet(), _Keyboard_modifierBit = function _Keyboard_modifierBit(key) {
    if (key === 'Alt') {
        return 1;
    }
    if (key === 'Control') {
        return 2;
    }
    if (key === 'Meta') {
        return 4;
    }
    if (key === 'Shift') {
        return 8;
    }
    return 0;
}, _Keyboard_keyDescriptionForString = function _Keyboard_keyDescriptionForString(keyString) {
    const shift = this._modifiers & 8;
    const description = {
        key: '',
        keyCode: 0,
        code: '',
        text: '',
        location: 0,
    };
    const definition = _keyDefinitions[keyString];
    assert(definition, `Unknown key: "${keyString}"`);
    if (definition.key) {
        description.key = definition.key;
    }
    if (shift && definition.shiftKey) {
        description.key = definition.shiftKey;
    }
    if (definition.keyCode) {
        description.keyCode = definition.keyCode;
    }
    if (shift && definition.shiftKeyCode) {
        description.keyCode = definition.shiftKeyCode;
    }
    if (definition.code) {
        description.code = definition.code;
    }
    if (definition.location) {
        description.location = definition.location;
    }
    if (description.key.length === 1) {
        description.text = description.key;
    }
    if (definition.text) {
        description.text = definition.text;
    }
    if (shift && definition.shiftText) {
        description.text = definition.shiftText;
    }
    // if any modifiers besides shift are pressed, no text should be sent
    if (this._modifiers & ~8) {
        description.text = '';
    }
    return description;
};
/**
 * The Mouse class operates in main-frame CSS pixels
 * relative to the top-left corner of the viewport.
 * @remarks
 * Every `page` object has its own Mouse, accessible with [`page.mouse`](#pagemouse).
 *
 * @example
 *
 * ```ts
 * // Using ‘page.mouse’ to trace a 100x100 square.
 * await page.mouse.move(0, 0);
 * await page.mouse.down();
 * await page.mouse.move(0, 100);
 * await page.mouse.move(100, 100);
 * await page.mouse.move(100, 0);
 * await page.mouse.move(0, 0);
 * await page.mouse.up();
 * ```
 *
 * **Note**: The mouse events trigger synthetic `MouseEvent`s.
 * This means that it does not fully replicate the functionality of what a normal user
 * would be able to do with their mouse.
 *
 * For example, dragging and selecting text is not possible using `page.mouse`.
 * Instead, you can use the {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/getSelection | `DocumentOrShadowRoot.getSelection()`} functionality implemented in the platform.
 *
 * @example
 * For example, if you want to select all content between nodes:
 *
 * ```ts
 * await page.evaluate(
 *   (from, to) => {
 *     const selection = from.getRootNode().getSelection();
 *     const range = document.createRange();
 *     range.setStartBefore(from);
 *     range.setEndAfter(to);
 *     selection.removeAllRanges();
 *     selection.addRange(range);
 *   },
 *   fromJSHandle,
 *   toJSHandle
 * );
 * ```
 *
 * If you then would want to copy-paste your selection, you can use the clipboard api:
 *
 * ```ts
 * // The clipboard api does not allow you to copy, unless the tab is focused.
 * await page.bringToFront();
 * await page.evaluate(() => {
 *   // Copy the selected content to the clipboard
 *   document.execCommand('copy');
 *   // Obtain the content of the clipboard as a string
 *   return navigator.clipboard.readText();
 * });
 * ```
 *
 * **Note**: If you want access to the clipboard API,
 * you have to give it permission to do so:
 *
 * ```ts
 * await browser
 *   .defaultBrowserContext()
 *   .overridePermissions('<your origin>', [
 *     'clipboard-read',
 *     'clipboard-write',
 *   ]);
 * ```
 *
 * @public
 */
class Mouse {
    /**
     * @internal
     */
    constructor(client, keyboard) {
        _Mouse_client.set(this, void 0);
        _Mouse_keyboard.set(this, void 0);
        _Mouse_x.set(this, 0);
        _Mouse_y.set(this, 0);
        _Mouse_button.set(this, 'none');
        __classPrivateFieldSet$j(this, _Mouse_client, client, "f");
        __classPrivateFieldSet$j(this, _Mouse_keyboard, keyboard, "f");
    }
    /**
     * Dispatches a `mousemove` event.
     * @param x - Horizontal position of the mouse.
     * @param y - Vertical position of the mouse.
     * @param options - Optional object. If specified, the `steps` property
     * sends intermediate `mousemove` events when set to `1` (default).
     */
    async move(x, y, options = {}) {
        const { steps = 1 } = options;
        const fromX = __classPrivateFieldGet$k(this, _Mouse_x, "f"), fromY = __classPrivateFieldGet$k(this, _Mouse_y, "f");
        __classPrivateFieldSet$j(this, _Mouse_x, x, "f");
        __classPrivateFieldSet$j(this, _Mouse_y, y, "f");
        for (let i = 1; i <= steps; i++) {
            await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
                type: 'mouseMoved',
                button: __classPrivateFieldGet$k(this, _Mouse_button, "f"),
                x: fromX + (__classPrivateFieldGet$k(this, _Mouse_x, "f") - fromX) * (i / steps),
                y: fromY + (__classPrivateFieldGet$k(this, _Mouse_y, "f") - fromY) * (i / steps),
                modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            });
        }
    }
    /**
     * Shortcut for `mouse.move`, `mouse.down` and `mouse.up`.
     * @param x - Horizontal position of the mouse.
     * @param y - Vertical position of the mouse.
     * @param options - Optional `MouseOptions`.
     */
    async click(x, y, options = {}) {
        const { delay = null } = options;
        if (delay !== null) {
            await this.move(x, y);
            await this.down(options);
            await new Promise(f => {
                return setTimeout(f, delay);
            });
            await this.up(options);
        }
        else {
            await this.move(x, y);
            await this.down(options);
            await this.up(options);
        }
    }
    /**
     * Dispatches a `mousedown` event.
     * @param options - Optional `MouseOptions`.
     */
    async down(options = {}) {
        const { button = 'left', clickCount = 1 } = options;
        __classPrivateFieldSet$j(this, _Mouse_button, button, "f");
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            button,
            x: __classPrivateFieldGet$k(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$k(this, _Mouse_y, "f"),
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            clickCount,
        });
    }
    /**
     * Dispatches a `mouseup` event.
     * @param options - Optional `MouseOptions`.
     */
    async up(options = {}) {
        const { button = 'left', clickCount = 1 } = options;
        __classPrivateFieldSet$j(this, _Mouse_button, 'none', "f");
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            button,
            x: __classPrivateFieldGet$k(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$k(this, _Mouse_y, "f"),
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            clickCount,
        });
    }
    /**
     * Dispatches a `mousewheel` event.
     * @param options - Optional: `MouseWheelOptions`.
     *
     * @example
     * An example of zooming into an element:
     *
     * ```ts
     * await page.goto(
     *   'https://mdn.mozillademos.org/en-US/docs/Web/API/Element/wheel_event$samples/Scaling_an_element_via_the_wheel?revision=1587366'
     * );
     *
     * const elem = await page.$('div');
     * const boundingBox = await elem.boundingBox();
     * await page.mouse.move(
     *   boundingBox.x + boundingBox.width / 2,
     *   boundingBox.y + boundingBox.height / 2
     * );
     *
     * await page.mouse.wheel({deltaY: -100});
     * ```
     */
    async wheel(options = {}) {
        const { deltaX = 0, deltaY = 0 } = options;
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: __classPrivateFieldGet$k(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$k(this, _Mouse_y, "f"),
            deltaX,
            deltaY,
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            pointerType: 'mouse',
        });
    }
    /**
     * Dispatches a `drag` event.
     * @param start - starting point for drag
     * @param target - point to drag to
     */
    async drag(start, target) {
        const promise = new Promise(resolve => {
            __classPrivateFieldGet$k(this, _Mouse_client, "f").once('Input.dragIntercepted', event => {
                return resolve(event.data);
            });
        });
        await this.move(start.x, start.y);
        await this.down();
        await this.move(target.x, target.y);
        return promise;
    }
    /**
     * Dispatches a `dragenter` event.
     * @param target - point for emitting `dragenter` event
     * @param data - drag data containing items and operations mask
     */
    async dragEnter(target, data) {
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'dragEnter',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Dispatches a `dragover` event.
     * @param target - point for emitting `dragover` event
     * @param data - drag data containing items and operations mask
     */
    async dragOver(target, data) {
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'dragOver',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Performs a dragenter, dragover, and drop in sequence.
     * @param target - point to drop on
     * @param data - drag data containing items and operations mask
     */
    async drop(target, data) {
        await __classPrivateFieldGet$k(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'drop',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$k(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Performs a drag, dragenter, dragover, and drop in sequence.
     * @param start - point to drag from
     * @param target - point to drop on
     * @param options - An object of options. Accepts delay which,
     * if specified, is the time to wait between `dragover` and `drop` in milliseconds.
     * Defaults to 0.
     */
    async dragAndDrop(start, target, options = {}) {
        const { delay = null } = options;
        const data = await this.drag(start, target);
        await this.dragEnter(target, data);
        await this.dragOver(target, data);
        if (delay) {
            await new Promise(resolve => {
                return setTimeout(resolve, delay);
            });
        }
        await this.drop(target, data);
        await this.up();
    }
}
_Mouse_client = new WeakMap(), _Mouse_keyboard = new WeakMap(), _Mouse_x = new WeakMap(), _Mouse_y = new WeakMap(), _Mouse_button = new WeakMap();
/**
 * The Touchscreen class exposes touchscreen events.
 * @public
 */
class Touchscreen {
    /**
     * @internal
     */
    constructor(client, keyboard) {
        _Touchscreen_client.set(this, void 0);
        _Touchscreen_keyboard.set(this, void 0);
        __classPrivateFieldSet$j(this, _Touchscreen_client, client, "f");
        __classPrivateFieldSet$j(this, _Touchscreen_keyboard, keyboard, "f");
    }
    /**
     * Dispatches a `touchstart` and `touchend` event.
     * @param x - Horizontal position of the tap.
     * @param y - Vertical position of the tap.
     */
    async tap(x, y) {
        const touchPoints = [{ x: Math.round(x), y: Math.round(y) }];
        await __classPrivateFieldGet$k(this, _Touchscreen_client, "f").send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints,
            modifiers: __classPrivateFieldGet$k(this, _Touchscreen_keyboard, "f")._modifiers,
        });
        await __classPrivateFieldGet$k(this, _Touchscreen_client, "f").send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: [],
            modifiers: __classPrivateFieldGet$k(this, _Touchscreen_keyboard, "f")._modifiers,
        });
    }
}
_Touchscreen_client = new WeakMap(), _Touchscreen_keyboard = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const _paperFormats = {
    letter: { width: 8.5, height: 11 },
    legal: { width: 8.5, height: 14 },
    tabloid: { width: 11, height: 17 },
    ledger: { width: 17, height: 11 },
    a0: { width: 33.1, height: 46.8 },
    a1: { width: 23.4, height: 33.1 },
    a2: { width: 16.54, height: 23.4 },
    a3: { width: 11.7, height: 16.54 },
    a4: { width: 8.27, height: 11.7 },
    a5: { width: 5.83, height: 8.27 },
    a6: { width: 4.13, height: 5.83 },
};

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$i = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$j = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TimeoutSettings_defaultTimeout, _TimeoutSettings_defaultNavigationTimeout;
const DEFAULT_TIMEOUT = 30000;
/**
 * @internal
 */
class TimeoutSettings {
    constructor() {
        _TimeoutSettings_defaultTimeout.set(this, void 0);
        _TimeoutSettings_defaultNavigationTimeout.set(this, void 0);
        __classPrivateFieldSet$i(this, _TimeoutSettings_defaultTimeout, null, "f");
        __classPrivateFieldSet$i(this, _TimeoutSettings_defaultNavigationTimeout, null, "f");
    }
    setDefaultTimeout(timeout) {
        __classPrivateFieldSet$i(this, _TimeoutSettings_defaultTimeout, timeout, "f");
    }
    setDefaultNavigationTimeout(timeout) {
        __classPrivateFieldSet$i(this, _TimeoutSettings_defaultNavigationTimeout, timeout, "f");
    }
    navigationTimeout() {
        if (__classPrivateFieldGet$j(this, _TimeoutSettings_defaultNavigationTimeout, "f") !== null) {
            return __classPrivateFieldGet$j(this, _TimeoutSettings_defaultNavigationTimeout, "f");
        }
        if (__classPrivateFieldGet$j(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet$j(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
    timeout() {
        if (__classPrivateFieldGet$j(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet$j(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
}
_TimeoutSettings_defaultTimeout = new WeakMap(), _TimeoutSettings_defaultNavigationTimeout = new WeakMap();

var __classPrivateFieldSet$h = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$i = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Tracing_client, _Tracing_recording, _Tracing_path;
/**
 * The Tracing class exposes the tracing audit interface.
 * @remarks
 * You can use `tracing.start` and `tracing.stop` to create a trace file
 * which can be opened in Chrome DevTools or {@link https://chromedevtools.github.io/timeline-viewer/ | timeline viewer}.
 *
 * @example
 *
 * ```ts
 * await page.tracing.start({path: 'trace.json'});
 * await page.goto('https://www.google.com');
 * await page.tracing.stop();
 * ```
 *
 * @public
 */
class Tracing {
    /**
     * @internal
     */
    constructor(client) {
        _Tracing_client.set(this, void 0);
        _Tracing_recording.set(this, false);
        _Tracing_path.set(this, void 0);
        __classPrivateFieldSet$h(this, _Tracing_client, client, "f");
    }
    /**
     * Starts a trace for the current page.
     * @remarks
     * Only one trace can be active at a time per browser.
     *
     * @param options - Optional `TracingOptions`.
     */
    async start(options = {}) {
        assert(!__classPrivateFieldGet$i(this, _Tracing_recording, "f"), 'Cannot start recording trace while already recording trace.');
        const defaultCategories = [
            '-*',
            'devtools.timeline',
            'v8.execute',
            'disabled-by-default-devtools.timeline',
            'disabled-by-default-devtools.timeline.frame',
            'toplevel',
            'blink.console',
            'blink.user_timing',
            'latencyInfo',
            'disabled-by-default-devtools.timeline.stack',
            'disabled-by-default-v8.cpu_profiler',
        ];
        const { path, screenshots = false, categories = defaultCategories } = options;
        if (screenshots) {
            categories.push('disabled-by-default-devtools.screenshot');
        }
        const excludedCategories = categories
            .filter(cat => {
            return cat.startsWith('-');
        })
            .map(cat => {
            return cat.slice(1);
        });
        const includedCategories = categories.filter(cat => {
            return !cat.startsWith('-');
        });
        __classPrivateFieldSet$h(this, _Tracing_path, path, "f");
        __classPrivateFieldSet$h(this, _Tracing_recording, true, "f");
        await __classPrivateFieldGet$i(this, _Tracing_client, "f").send('Tracing.start', {
            transferMode: 'ReturnAsStream',
            traceConfig: {
                excludedCategories,
                includedCategories,
            },
        });
    }
    /**
     * Stops a trace started with the `start` method.
     * @returns Promise which resolves to buffer with trace data.
     */
    async stop() {
        let resolve;
        let reject;
        const contentPromise = new Promise((x, y) => {
            resolve = x;
            reject = y;
        });
        __classPrivateFieldGet$i(this, _Tracing_client, "f").once('Tracing.tracingComplete', async (event) => {
            try {
                const readable = await getReadableFromProtocolStream(__classPrivateFieldGet$i(this, _Tracing_client, "f"), event.stream);
                const buffer = await getReadableAsBuffer(readable, __classPrivateFieldGet$i(this, _Tracing_path, "f"));
                resolve(buffer !== null && buffer !== void 0 ? buffer : undefined);
            }
            catch (error) {
                if (isErrorLike(error)) {
                    reject(error);
                }
                else {
                    reject(new Error(`Unknown error: ${error}`));
                }
            }
        });
        await __classPrivateFieldGet$i(this, _Tracing_client, "f").send('Tracing.end');
        __classPrivateFieldSet$h(this, _Tracing_recording, false, "f");
        return contentPromise;
    }
}
_Tracing_client = new WeakMap(), _Tracing_recording = new WeakMap(), _Tracing_path = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$g = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$h = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CDPPage_instances, _CDPPage_closed, _CDPPage_client, _CDPPage_target, _CDPPage_keyboard, _CDPPage_mouse, _CDPPage_timeoutSettings, _CDPPage_touchscreen, _CDPPage_accessibility, _CDPPage_frameManager, _CDPPage_emulationManager, _CDPPage_tracing, _CDPPage_pageBindings, _CDPPage_coverage, _CDPPage_javascriptEnabled, _CDPPage_viewport, _CDPPage_screenshotTaskQueue, _CDPPage_workers, _CDPPage_fileChooserPromises, _CDPPage_disconnectPromise, _CDPPage_userDragInterceptionEnabled, _CDPPage_onDetachedFromTarget, _CDPPage_onAttachedToTarget, _CDPPage_initialize, _CDPPage_onFileChooser, _CDPPage_onTargetCrashed, _CDPPage_onLogEntryAdded, _CDPPage_emitMetrics, _CDPPage_buildMetricsObject, _CDPPage_handleException, _CDPPage_onConsoleAPI, _CDPPage_onBindingCalled, _CDPPage_addConsoleMessage, _CDPPage_onDialog, _CDPPage_resetDefaultBackgroundColor, _CDPPage_setTransparentBackgroundColor, _CDPPage_sessionClosePromise, _CDPPage_go, _CDPPage_screenshotTask;
/**
 * @internal
 */
class CDPPage extends Page$1 {
    /**
     * @internal
     */
    constructor(client, target, ignoreHTTPSErrors, screenshotTaskQueue) {
        super();
        _CDPPage_instances.add(this);
        _CDPPage_closed.set(this, false);
        _CDPPage_client.set(this, void 0);
        _CDPPage_target.set(this, void 0);
        _CDPPage_keyboard.set(this, void 0);
        _CDPPage_mouse.set(this, void 0);
        _CDPPage_timeoutSettings.set(this, new TimeoutSettings());
        _CDPPage_touchscreen.set(this, void 0);
        _CDPPage_accessibility.set(this, void 0);
        _CDPPage_frameManager.set(this, void 0);
        _CDPPage_emulationManager.set(this, void 0);
        _CDPPage_tracing.set(this, void 0);
        _CDPPage_pageBindings.set(this, new Map());
        _CDPPage_coverage.set(this, void 0);
        _CDPPage_javascriptEnabled.set(this, true);
        _CDPPage_viewport.set(this, void 0);
        _CDPPage_screenshotTaskQueue.set(this, void 0);
        _CDPPage_workers.set(this, new Map());
        _CDPPage_fileChooserPromises.set(this, new Set());
        _CDPPage_disconnectPromise.set(this, void 0);
        _CDPPage_userDragInterceptionEnabled.set(this, false);
        _CDPPage_onDetachedFromTarget.set(this, (target) => {
            var _a;
            const sessionId = (_a = target._session()) === null || _a === void 0 ? void 0 : _a.id();
            __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").onDetachedFromTarget(target);
            const worker = __classPrivateFieldGet$h(this, _CDPPage_workers, "f").get(sessionId);
            if (!worker) {
                return;
            }
            __classPrivateFieldGet$h(this, _CDPPage_workers, "f").delete(sessionId);
            this.emit("workerdestroyed" /* PageEmittedEvents.WorkerDestroyed */, worker);
        });
        _CDPPage_onAttachedToTarget.set(this, async (createdTarget) => {
            __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").onAttachedToTarget(createdTarget);
            if (createdTarget._getTargetInfo().type === 'worker') {
                const session = createdTarget._session();
                assert(session);
                const worker = new WebWorker(session, createdTarget.url(), __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_addConsoleMessage).bind(this), __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_handleException).bind(this));
                __classPrivateFieldGet$h(this, _CDPPage_workers, "f").set(session.id(), worker);
                this.emit("workercreated" /* PageEmittedEvents.WorkerCreated */, worker);
            }
            if (createdTarget._session()) {
                __classPrivateFieldGet$h(this, _CDPPage_target, "f")
                    ._targetManager()
                    .addTargetInterceptor(createdTarget._session(), __classPrivateFieldGet$h(this, _CDPPage_onAttachedToTarget, "f"));
            }
        });
        __classPrivateFieldSet$g(this, _CDPPage_client, client, "f");
        __classPrivateFieldSet$g(this, _CDPPage_target, target, "f");
        __classPrivateFieldSet$g(this, _CDPPage_keyboard, new Keyboard(client), "f");
        __classPrivateFieldSet$g(this, _CDPPage_mouse, new Mouse(client, __classPrivateFieldGet$h(this, _CDPPage_keyboard, "f")), "f");
        __classPrivateFieldSet$g(this, _CDPPage_touchscreen, new Touchscreen(client, __classPrivateFieldGet$h(this, _CDPPage_keyboard, "f")), "f");
        __classPrivateFieldSet$g(this, _CDPPage_accessibility, new Accessibility(client), "f");
        __classPrivateFieldSet$g(this, _CDPPage_frameManager, new FrameManager(client, this, ignoreHTTPSErrors, __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f")), "f");
        __classPrivateFieldSet$g(this, _CDPPage_emulationManager, new EmulationManager(client), "f");
        __classPrivateFieldSet$g(this, _CDPPage_tracing, new Tracing(client), "f");
        __classPrivateFieldSet$g(this, _CDPPage_coverage, new Coverage(client), "f");
        __classPrivateFieldSet$g(this, _CDPPage_screenshotTaskQueue, screenshotTaskQueue, "f");
        __classPrivateFieldSet$g(this, _CDPPage_viewport, null, "f");
        __classPrivateFieldGet$h(this, _CDPPage_target, "f")
            ._targetManager()
            .addTargetInterceptor(__classPrivateFieldGet$h(this, _CDPPage_client, "f"), __classPrivateFieldGet$h(this, _CDPPage_onAttachedToTarget, "f"));
        __classPrivateFieldGet$h(this, _CDPPage_target, "f")
            ._targetManager()
            .on("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$h(this, _CDPPage_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").on(FrameManagerEmittedEvents.FrameAttached, event => {
            return this.emit("frameattached" /* PageEmittedEvents.FrameAttached */, event);
        });
        __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").on(FrameManagerEmittedEvents.FrameDetached, event => {
            return this.emit("framedetached" /* PageEmittedEvents.FrameDetached */, event);
        });
        __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").on(FrameManagerEmittedEvents.FrameNavigated, event => {
            return this.emit("framenavigated" /* PageEmittedEvents.FrameNavigated */, event);
        });
        const networkManager = __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager;
        networkManager.on(NetworkManagerEmittedEvents.Request, event => {
            return this.emit("request" /* PageEmittedEvents.Request */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestServedFromCache, event => {
            return this.emit("requestservedfromcache" /* PageEmittedEvents.RequestServedFromCache */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.Response, event => {
            return this.emit("response" /* PageEmittedEvents.Response */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestFailed, event => {
            return this.emit("requestfailed" /* PageEmittedEvents.RequestFailed */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestFinished, event => {
            return this.emit("requestfinished" /* PageEmittedEvents.RequestFinished */, event);
        });
        client.on('Page.domContentEventFired', () => {
            return this.emit("domcontentloaded" /* PageEmittedEvents.DOMContentLoaded */);
        });
        client.on('Page.loadEventFired', () => {
            return this.emit("load" /* PageEmittedEvents.Load */);
        });
        client.on('Runtime.consoleAPICalled', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onConsoleAPI).call(this, event);
        });
        client.on('Runtime.bindingCalled', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onBindingCalled).call(this, event);
        });
        client.on('Page.javascriptDialogOpening', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onDialog).call(this, event);
        });
        client.on('Runtime.exceptionThrown', exception => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_handleException).call(this, exception.exceptionDetails);
        });
        client.on('Inspector.targetCrashed', () => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onTargetCrashed).call(this);
        });
        client.on('Performance.metrics', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_emitMetrics).call(this, event);
        });
        client.on('Log.entryAdded', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onLogEntryAdded).call(this, event);
        });
        client.on('Page.fileChooserOpened', event => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_onFileChooser).call(this, event);
        });
        __classPrivateFieldGet$h(this, _CDPPage_target, "f")._isClosedPromise.then(() => {
            __classPrivateFieldGet$h(this, _CDPPage_target, "f")
                ._targetManager()
                .removeTargetInterceptor(__classPrivateFieldGet$h(this, _CDPPage_client, "f"), __classPrivateFieldGet$h(this, _CDPPage_onAttachedToTarget, "f"));
            __classPrivateFieldGet$h(this, _CDPPage_target, "f")
                ._targetManager()
                .off("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$h(this, _CDPPage_onDetachedFromTarget, "f"));
            this.emit("close" /* PageEmittedEvents.Close */);
            __classPrivateFieldSet$g(this, _CDPPage_closed, true, "f");
        });
    }
    /**
     * @internal
     */
    static async _create(client, target, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue) {
        const page = new CDPPage(client, target, ignoreHTTPSErrors, screenshotTaskQueue);
        await __classPrivateFieldGet$h(page, _CDPPage_instances, "m", _CDPPage_initialize).call(page);
        if (defaultViewport) {
            try {
                await page.setViewport(defaultViewport);
            }
            catch (err) {
                if (isErrorLike(err) && isTargetClosedError(err)) {
                    debugError(err);
                }
                else {
                    throw err;
                }
            }
        }
        return page;
    }
    /**
     * @returns `true` if drag events are being intercepted, `false` otherwise.
     */
    isDragInterceptionEnabled() {
        return __classPrivateFieldGet$h(this, _CDPPage_userDragInterceptionEnabled, "f");
    }
    /**
     * @returns `true` if the page has JavaScript enabled, `false` otherwise.
     */
    isJavaScriptEnabled() {
        return __classPrivateFieldGet$h(this, _CDPPage_javascriptEnabled, "f");
    }
    /**
     * This method is typically coupled with an action that triggers file
     * choosing.
     *
     * :::caution
     *
     * This must be called before the file chooser is launched. It will not return
     * a currently active file chooser.
     *
     * :::
     *
     * @remarks
     * In non-headless Chromium, this method results in the native file picker
     * dialog `not showing up` for the user.
     *
     * @example
     * The following example clicks a button that issues a file chooser
     * and then responds with `/tmp/myfile.pdf` as if a user has selected this file.
     *
     * ```ts
     * const [fileChooser] = await Promise.all([
     *   page.waitForFileChooser(),
     *   page.click('#upload-file-button'),
     *   // some button that triggers file selection
     * ]);
     * await fileChooser.accept(['/tmp/myfile.pdf']);
     * ```
     */
    waitForFileChooser(options = {}) {
        const needsEnable = __classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f").size === 0;
        const { timeout = __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout() } = options;
        const promise = createDeferredPromise({
            message: `Waiting for \`FileChooser\` failed: ${timeout}ms exceeded`,
            timeout,
        });
        __classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f").add(promise);
        let enablePromise;
        if (needsEnable) {
            enablePromise = __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.setInterceptFileChooserDialog', {
                enabled: true,
            });
        }
        return Promise.all([promise, enablePromise])
            .then(([result]) => {
            return result;
        })
            .catch(error => {
            __classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f").delete(promise);
            throw error;
        });
    }
    /**
     * Sets the page's geolocation.
     *
     * @remarks
     * Consider using {@link BrowserContext.overridePermissions} to grant
     * permissions for the page to read its geolocation.
     *
     * @example
     *
     * ```ts
     * await page.setGeolocation({latitude: 59.95, longitude: 30.31667});
     * ```
     */
    async setGeolocation(options) {
        const { longitude, latitude, accuracy = 0 } = options;
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
        }
        if (accuracy < 0) {
            throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
        }
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setGeolocationOverride', {
            longitude,
            latitude,
            accuracy,
        });
    }
    /**
     * @returns A target this page was created from.
     */
    target() {
        return __classPrivateFieldGet$h(this, _CDPPage_target, "f");
    }
    /**
     * @internal
     */
    _client() {
        return __classPrivateFieldGet$h(this, _CDPPage_client, "f");
    }
    /**
     * Get the browser the page belongs to.
     */
    browser() {
        return __classPrivateFieldGet$h(this, _CDPPage_target, "f").browser();
    }
    /**
     * Get the browser context that the page belongs to.
     */
    browserContext() {
        return __classPrivateFieldGet$h(this, _CDPPage_target, "f").browserContext();
    }
    /**
     * @returns The page's main frame.
     *
     * @remarks
     * Page is guaranteed to have a main frame which persists during navigations.
     */
    mainFrame() {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame();
    }
    get keyboard() {
        return __classPrivateFieldGet$h(this, _CDPPage_keyboard, "f");
    }
    get touchscreen() {
        return __classPrivateFieldGet$h(this, _CDPPage_touchscreen, "f");
    }
    get coverage() {
        return __classPrivateFieldGet$h(this, _CDPPage_coverage, "f");
    }
    get tracing() {
        return __classPrivateFieldGet$h(this, _CDPPage_tracing, "f");
    }
    get accessibility() {
        return __classPrivateFieldGet$h(this, _CDPPage_accessibility, "f");
    }
    /**
     * @returns An array of all frames attached to the page.
     */
    frames() {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").frames();
    }
    /**
     * @returns all of the dedicated {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API |
     * WebWorkers} associated with the page.
     *
     * @remarks
     * This does not contain ServiceWorkers
     */
    workers() {
        return Array.from(__classPrivateFieldGet$h(this, _CDPPage_workers, "f").values());
    }
    /**
     * Activating request interception enables {@link HTTPRequest.abort},
     * {@link HTTPRequest.continue} and {@link HTTPRequest.respond} methods. This
     * provides the capability to modify network requests that are made by a page.
     *
     * Once request interception is enabled, every request will stall unless it's
     * continued, responded or aborted; or completed using the browser cache.
     *
     * Enabling request interception disables page caching.
     *
     * See the
     * {@link https://pptr.dev/next/guides/request-interception|Request interception guide}
     * for more details.
     *
     * @example
     * An example of a naïve request interceptor that aborts all image requests:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.setRequestInterception(true);
     *   page.on('request', interceptedRequest => {
     *     if (
     *       interceptedRequest.url().endsWith('.png') ||
     *       interceptedRequest.url().endsWith('.jpg')
     *     )
     *       interceptedRequest.abort();
     *     else interceptedRequest.continue();
     *   });
     *   await page.goto('https://example.com');
     *   await browser.close();
     * })();
     * ```
     *
     * @param value - Whether to enable request interception.
     */
    async setRequestInterception(value) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.setRequestInterception(value);
    }
    /**
     * @param enabled - Whether to enable drag interception.
     *
     * @remarks
     * Activating drag interception enables the `Input.drag`,
     * methods This provides the capability to capture drag events emitted
     * on the page, which can then be used to simulate drag-and-drop.
     */
    async setDragInterception(enabled) {
        __classPrivateFieldSet$g(this, _CDPPage_userDragInterceptionEnabled, enabled, "f");
        return __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Input.setInterceptDrags', { enabled });
    }
    setOfflineMode(enabled) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.setOfflineMode(enabled);
    }
    emulateNetworkConditions(networkConditions) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.emulateNetworkConditions(networkConditions);
    }
    /**
     * This setting will change the default maximum navigation time for the
     * following methods and related shortcuts:
     *
     * - {@link Page.goBack | page.goBack(options)}
     *
     * - {@link Page.goForward | page.goForward(options)}
     *
     * - {@link Page.goto | page.goto(url,options)}
     *
     * - {@link Page.reload | page.reload(options)}
     *
     * - {@link Page.setContent | page.setContent(html,options)}
     *
     * - {@link Page.waitForNavigation | page.waitForNavigation(options)}
     *   @param timeout - Maximum navigation time in milliseconds.
     */
    setDefaultNavigationTimeout(timeout) {
        __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").setDefaultNavigationTimeout(timeout);
    }
    /**
     * @param timeout - Maximum time in milliseconds.
     */
    setDefaultTimeout(timeout) {
        __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").setDefaultTimeout(timeout);
    }
    /**
     * @returns Maximum time in milliseconds.
     */
    getDefaultTimeout() {
        return __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout();
    }
    /**
     * Runs `document.querySelector` within the page. If no element matches the
     * selector, the return value resolves to `null`.
     *
     * @param selector - A `selector` to query page for
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query page for.
     */
    async $(selector) {
        return this.mainFrame().$(selector);
    }
    /**
     * The method runs `document.querySelectorAll` within the page. If no elements
     * match the selector, the return value resolves to `[]`.
     * @remarks
     * Shortcut for {@link Frame.$$ | Page.mainFrame().$$(selector) }.
     * @param selector - A `selector` to query page for
     */
    async $$(selector) {
        return this.mainFrame().$$(selector);
    }
    /**
     * @remarks
     *
     * The only difference between {@link Page.evaluate | page.evaluate} and
     * `page.evaluateHandle` is that `evaluateHandle` will return the value
     * wrapped in an in-page object.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluateHandle('document');
     * ```
     *
     * @example
     * {@link JSHandle} instances can be passed as arguments to the `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluateHandle(() => document.body);
     * const resultHandle = await page.evaluateHandle(
     *   body => body.innerHTML,
     *   aHandle
     * );
     * console.log(await resultHandle.jsonValue());
     * await resultHandle.dispose();
     * ```
     *
     * Most of the time this function returns a {@link JSHandle},
     * but if `pageFunction` returns a reference to an element,
     * you instead get an {@link ElementHandle} back:
     *
     * @example
     *
     * ```ts
     * const button = await page.evaluateHandle(() =>
     *   document.querySelector('button')
     * );
     * // can call `click` because `button` is an `ElementHandle`
     * await button.click();
     * ```
     *
     * The TypeScript definitions assume that `evaluateHandle` returns
     * a `JSHandle`, but if you know it's going to return an
     * `ElementHandle`, pass it as the generic argument:
     *
     * ```ts
     * const button = await page.evaluateHandle<ElementHandle>(...);
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     */
    async evaluateHandle(pageFunction, ...args) {
        const context = await this.mainFrame().executionContext();
        return context.evaluateHandle(pageFunction, ...args);
    }
    /**
     * This method iterates the JavaScript heap and finds all objects with the
     * given prototype.
     *
     * @example
     *
     * ```ts
     * // Create a Map object
     * await page.evaluate(() => (window.map = new Map()));
     * // Get a handle to the Map object prototype
     * const mapPrototype = await page.evaluateHandle(() => Map.prototype);
     * // Query all map instances into an array
     * const mapInstances = await page.queryObjects(mapPrototype);
     * // Count amount of map objects in heap
     * const count = await page.evaluate(maps => maps.length, mapInstances);
     * await mapInstances.dispose();
     * await mapPrototype.dispose();
     * ```
     *
     * @param prototypeHandle - a handle to the object prototype.
     * @returns Promise which resolves to a handle to an array of objects with
     * this prototype.
     */
    async queryObjects(prototypeHandle) {
        const context = await this.mainFrame().executionContext();
        assert(!prototypeHandle.disposed, 'Prototype JSHandle is disposed!');
        const remoteObject = prototypeHandle.remoteObject();
        assert(remoteObject.objectId, 'Prototype JSHandle must not be referencing primitive value');
        const response = await context._client.send('Runtime.queryObjects', {
            prototypeObjectId: remoteObject.objectId,
        });
        return createJSHandle(context, response.objects);
    }
    /**
     * This method runs `document.querySelector` within the page and passes the
     * result as the first argument to the `pageFunction`.
     *
     * @remarks
     *
     * If no element is found matching `selector`, the method will throw an error.
     *
     * If `pageFunction` returns a promise `$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * const searchValue = await page.$eval('#search', el => el.value);
     * const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
     * const html = await page.$eval('.main-container', el => el.outerHTML);
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * const searchValue = await page.$eval(
     *   '#search',
     *   (el: HTMLInputElement) => el.value
     * );
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$eval`:
     *
     * @example
     *
     * ```ts
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const searchValue = await page.$eval<string>(
     *   '#search',
     *   (el: HTMLInputElement) => el.value
     * );
     * ```
     *
     * @param selector - the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of `document.querySelector(selector)` as its
     * first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $eval(selector, pageFunction, ...args) {
        return this.mainFrame().$eval(selector, pageFunction, ...args);
    }
    /**
     * This method runs `Array.from(document.querySelectorAll(selector))` within
     * the page and passes the result as the first argument to the `pageFunction`.
     *
     * @remarks
     * If `pageFunction` returns a promise `$$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * // get the amount of divs on the page
     * const divCount = await page.$$eval('div', divs => divs.length);
     *
     * // get the text content of all the `.options` elements:
     * const options = await page.$$eval('div > span.options', options => {
     *   return options.map(option => option.textContent);
     * });
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element[]`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * await page.$$eval('input', (elements: HTMLInputElement[]) => {
     *   return elements.map(e => e.value);
     * });
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$$eval`:
     *
     * @example
     *
     * ```ts
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const allInputValues = await page.$$eval<string[]>(
     *   'input',
     *   (elements: HTMLInputElement[]) => elements.map(e => e.textContent)
     * );
     * ```
     *
     * @param selector - the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of
     * `Array.from(document.querySelectorAll(selector))` as its first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $$eval(selector, pageFunction, ...args) {
        return this.mainFrame().$$eval(selector, pageFunction, ...args);
    }
    /**
     * The method evaluates the XPath expression relative to the page document as
     * its context node. If there are no such elements, the method resolves to an
     * empty array.
     *
     * @remarks
     * Shortcut for {@link Frame.$x | Page.mainFrame().$x(expression) }.
     *
     * @param expression - Expression to evaluate
     */
    async $x(expression) {
        return this.mainFrame().$x(expression);
    }
    /**
     * If no URLs are specified, this method returns cookies for the current page
     * URL. If URLs are specified, only cookies for those URLs are returned.
     */
    async cookies(...urls) {
        const originalCookies = (await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Network.getCookies', {
            urls: urls.length ? urls : [this.url()],
        })).cookies;
        const unsupportedCookieAttributes = ['priority'];
        const filterUnsupportedAttributes = (cookie) => {
            for (const attr of unsupportedCookieAttributes) {
                delete cookie[attr];
            }
            return cookie;
        };
        return originalCookies.map(filterUnsupportedAttributes);
    }
    async deleteCookie(...cookies) {
        const pageURL = this.url();
        for (const cookie of cookies) {
            const item = Object.assign({}, cookie);
            if (!cookie.url && pageURL.startsWith('http')) {
                item.url = pageURL;
            }
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Network.deleteCookies', item);
        }
    }
    /**
     * @example
     *
     * ```ts
     * await page.setCookie(cookieObject1, cookieObject2);
     * ```
     */
    async setCookie(...cookies) {
        const pageURL = this.url();
        const startsWithHTTP = pageURL.startsWith('http');
        const items = cookies.map(cookie => {
            const item = Object.assign({}, cookie);
            if (!item.url && startsWithHTTP) {
                item.url = pageURL;
            }
            assert(item.url !== 'about:blank', `Blank page can not have cookie "${item.name}"`);
            assert(!String.prototype.startsWith.call(item.url || '', 'data:'), `Data URL page can not have cookie "${item.name}"`);
            return item;
        });
        await this.deleteCookie(...items);
        if (items.length) {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Network.setCookies', { cookies: items });
        }
    }
    /**
     * Adds a `<script>` tag into the page with the desired URL or content.
     *
     * @remarks
     * Shortcut for
     * {@link Frame.addScriptTag | page.mainFrame().addScriptTag(options)}.
     *
     * @param options - Options for the script.
     * @returns An {@link ElementHandle | element handle} to the injected
     * `<script>` element.
     */
    async addScriptTag(options) {
        return this.mainFrame().addScriptTag(options);
    }
    async addStyleTag(options) {
        return this.mainFrame().addStyleTag(options);
    }
    /**
     * The method adds a function called `name` on the page's `window` object.
     * When called, the function executes `puppeteerFunction` in node.js and
     * returns a `Promise` which resolves to the return value of
     * `puppeteerFunction`.
     *
     * If the puppeteerFunction returns a `Promise`, it will be awaited.
     *
     * :::note
     *
     * Functions installed via `page.exposeFunction` survive navigations.
     *
     * :::note
     *
     * @example
     * An example of adding an `md5` function into the page:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const crypto = require('crypto');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   page.on('console', msg => console.log(msg.text()));
     *   await page.exposeFunction('md5', text =>
     *     crypto.createHash('md5').update(text).digest('hex')
     *   );
     *   await page.evaluate(async () => {
     *     // use window.md5 to compute hashes
     *     const myString = 'PUPPETEER';
     *     const myHash = await window.md5(myString);
     *     console.log(`md5 of ${myString} is ${myHash}`);
     *   });
     *   await browser.close();
     * })();
     * ```
     *
     * @example
     * An example of adding a `window.readfile` function into the page:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const fs = require('fs');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   page.on('console', msg => console.log(msg.text()));
     *   await page.exposeFunction('readfile', async filePath => {
     *     return new Promise((resolve, reject) => {
     *       fs.readFile(filePath, 'utf8', (err, text) => {
     *         if (err) reject(err);
     *         else resolve(text);
     *       });
     *     });
     *   });
     *   await page.evaluate(async () => {
     *     // use window.readfile to read contents of a file
     *     const content = await window.readfile('/etc/hosts');
     *     console.log(content);
     *   });
     *   await browser.close();
     * })();
     * ```
     *
     * @param name - Name of the function on the window object
     * @param pptrFunction - Callback function which will be called in Puppeteer's
     * context.
     */
    async exposeFunction(name, pptrFunction) {
        if (__classPrivateFieldGet$h(this, _CDPPage_pageBindings, "f").has(name)) {
            throw new Error(`Failed to add page binding with name ${name}: window['${name}'] already exists!`);
        }
        let exposedFunction;
        switch (typeof pptrFunction) {
            case 'function':
                exposedFunction = pptrFunction;
                break;
            default:
                exposedFunction = pptrFunction.default;
                break;
        }
        __classPrivateFieldGet$h(this, _CDPPage_pageBindings, "f").set(name, exposedFunction);
        const expression = pageBindingInitString('exposedFun', name);
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Runtime.addBinding', { name: name });
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.addScriptToEvaluateOnNewDocument', {
            source: expression,
        });
        await Promise.all(this.frames().map(frame => {
            return frame.evaluate(expression).catch(debugError);
        }));
    }
    /**
     * Provide credentials for `HTTP authentication`.
     *
     * @remarks
     * To disable authentication, pass `null`.
     */
    async authenticate(credentials) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.authenticate(credentials);
    }
    /**
     * The extra HTTP headers will be sent with every request the page initiates.
     *
     * :::tip
     *
     * All HTTP header names are lowercased. (HTTP headers are
     * case-insensitive, so this shouldn’t impact your server code.)
     *
     * :::
     *
     * :::note
     *
     * page.setExtraHTTPHeaders does not guarantee the order of headers in
     * the outgoing requests.
     *
     * :::
     *
     * @param headers - An object containing additional HTTP headers to be sent
     * with every request. All header values must be strings.
     */
    async setExtraHTTPHeaders(headers) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.setExtraHTTPHeaders(headers);
    }
    /**
     * @param userAgent - Specific user agent to use in this page
     * @param userAgentData - Specific user agent client hint data to use in this
     * page
     * @returns Promise which resolves when the user agent is set.
     */
    async setUserAgent(userAgent, userAgentMetadata) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.setUserAgent(userAgent, userAgentMetadata);
    }
    /**
     * @returns Object containing metrics as key/value pairs.
     *
     * - `Timestamp` : The timestamp when the metrics sample was taken.
     *
     * - `Documents` : Number of documents in the page.
     *
     * - `Frames` : Number of frames in the page.
     *
     * - `JSEventListeners` : Number of events in the page.
     *
     * - `Nodes` : Number of DOM nodes in the page.
     *
     * - `LayoutCount` : Total number of full or partial page layout.
     *
     * - `RecalcStyleCount` : Total number of page style recalculations.
     *
     * - `LayoutDuration` : Combined durations of all page layouts.
     *
     * - `RecalcStyleDuration` : Combined duration of all page style
     *   recalculations.
     *
     * - `ScriptDuration` : Combined duration of JavaScript execution.
     *
     * - `TaskDuration` : Combined duration of all tasks performed by the browser.
     *
     * - `JSHeapUsedSize` : Used JavaScript heap size.
     *
     * - `JSHeapTotalSize` : Total JavaScript heap size.
     *
     * @remarks
     * All timestamps are in monotonic time: monotonically increasing time
     * in seconds since an arbitrary point in the past.
     */
    async metrics() {
        const response = await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Performance.getMetrics');
        return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_buildMetricsObject).call(this, response.metrics);
    }
    /**
     *
     * @returns
     * @remarks Shortcut for
     * {@link Frame.url | page.mainFrame().url()}.
     */
    url() {
        return this.mainFrame().url();
    }
    async content() {
        return await __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame().content();
    }
    /**
     * @param html - HTML markup to assign to the page.
     * @param options - Parameters that has some properties.
     * @remarks
     * The parameter `options` might have the following options.
     *
     * - `timeout` : Maximum time in milliseconds for resources to load, defaults
     *   to 30 seconds, pass `0` to disable timeout. The default value can be
     *   changed by using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider setting markup succeeded, defaults to
     *   `load`. Given an array of event strings, setting content is considered
     *   to be successful after all events have been fired. Events can be
     *   either:<br/>
     * - `load` : consider setting content to be finished when the `load` event
     *   is fired.<br/>
     * - `domcontentloaded` : consider setting content to be finished when the
     *   `DOMContentLoaded` event is fired.<br/>
     * - `networkidle0` : consider setting content to be finished when there are
     *   no more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider setting content to be finished when there are
     *   no more than 2 network connections for at least `500` ms.
     */
    async setContent(html, options = {}) {
        await __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame().setContent(html, options);
    }
    /**
     * @param url - URL to navigate page to. The URL should include scheme, e.g.
     * `https://`
     * @param options - Navigation Parameter
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`:When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     *
     * - `referer` : Referer header value. If provided it will take preference
     *   over the referer header value set by
     *   {@link Page.setExtraHTTPHeaders |page.setExtraHTTPHeaders()}.
     *
     * `page.goto` will throw an error if:
     *
     * - there's an SSL error (e.g. in case of self-signed certificates).
     * - target URL is invalid.
     * - the timeout is exceeded during navigation.
     * - the remote server does not respond or is unreachable.
     * - the main resource failed to load.
     *
     * `page.goto` will not throw an error when any valid HTTP status code is
     * returned by the remote server, including 404 "Not Found" and 500
     * "Internal Server Error". The status code for such responses can be
     * retrieved by calling response.status().
     *
     * NOTE: `page.goto` either throws an error or returns a main resource
     * response. The only exceptions are navigation to about:blank or navigation
     * to the same URL with a different hash, which would succeed and return null.
     *
     * NOTE: Headless mode doesn't support navigation to a PDF document. See the
     * {@link https://bugs.chromium.org/p/chromium/issues/detail?id=761295 |
     * upstream issue}.
     *
     * Shortcut for {@link Frame.goto | page.mainFrame().goto(url, options)}.
     */
    async goto(url, options = {}) {
        return await __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame().goto(url, options);
    }
    /**
     * @param options - Navigation parameters which might have the following
     * properties:
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async reload(options) {
        const result = await Promise.all([
            this.waitForNavigation(options),
            __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.reload'),
        ]);
        return result[0];
    }
    /**
     * Waits for the page to navigate to a new URL or to reload. It is useful when
     * you run code that will indirectly cause the page to navigate.
     *
     * @example
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(), // The promise resolves after navigation has finished
     *   page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
     * ]);
     * ```
     *
     * @remarks
     * Usage of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
     * to change the URL is considered a navigation.
     *
     * @param options - Navigation parameters which might have the following
     * properties:
     * @returns A `Promise` which resolves to the main resource response.
     *
     * - In case of multiple redirects, the navigation will resolve with the
     *   response of the last redirect.
     * - In case of navigation to a different anchor or navigation due to History
     *   API usage, the navigation will resolve with `null`.
     */
    async waitForNavigation(options = {}) {
        return await __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame().waitForNavigation(options);
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched response
     * @example
     *
     * ```ts
     * const firstResponse = await page.waitForResponse(
     *   'https://example.com/resource'
     * );
     * const finalResponse = await page.waitForResponse(
     *   response =>
     *     response.url() === 'https://example.com' && response.status() === 200
     * );
     * const finalResponse = await page.waitForResponse(async response => {
     *   return (await response.text()).includes('<html>');
     * });
     * return finalResponse.ok();
     * ```
     *
     * @remarks
     * Optional Waiting Parameters have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds, pass
     *   `0` to disable the timeout. The default value can be changed by using the
     *   {@link Page.setDefaultTimeout} method.
     */
    async waitForRequest(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout() } = options;
        return waitForEvent(__classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Request, async (request) => {
            if (isString(urlOrPredicate)) {
                return urlOrPredicate === request.url();
            }
            if (typeof urlOrPredicate === 'function') {
                return !!(await urlOrPredicate(request));
            }
            return false;
        }, timeout, __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_sessionClosePromise).call(this));
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched response.
     * @example
     *
     * ```ts
     * const firstResponse = await page.waitForResponse(
     *   'https://example.com/resource'
     * );
     * const finalResponse = await page.waitForResponse(
     *   response =>
     *     response.url() === 'https://example.com' && response.status() === 200
     * );
     * const finalResponse = await page.waitForResponse(async response => {
     *   return (await response.text()).includes('<html>');
     * });
     * return finalResponse.ok();
     * ```
     *
     * @remarks
     * Optional Parameter have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
     *   pass `0` to disable the timeout. The default value can be changed by using
     *   the {@link Page.setDefaultTimeout} method.
     */
    async waitForResponse(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout() } = options;
        return waitForEvent(__classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Response, async (response) => {
            if (isString(urlOrPredicate)) {
                return urlOrPredicate === response.url();
            }
            if (typeof urlOrPredicate === 'function') {
                return !!(await urlOrPredicate(response));
            }
            return false;
        }, timeout, __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_sessionClosePromise).call(this));
    }
    /**
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when network is idle
     */
    async waitForNetworkIdle(options = {}) {
        const { idleTime = 500, timeout = __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout() } = options;
        const networkManager = __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager;
        let idleResolveCallback;
        const idlePromise = new Promise(resolve => {
            idleResolveCallback = resolve;
        });
        let abortRejectCallback;
        const abortPromise = new Promise((_, reject) => {
            abortRejectCallback = reject;
        });
        let idleTimer;
        const onIdle = () => {
            return idleResolveCallback();
        };
        const cleanup = () => {
            idleTimer && clearTimeout(idleTimer);
            abortRejectCallback(new Error('abort'));
        };
        const evaluate = () => {
            idleTimer && clearTimeout(idleTimer);
            if (networkManager.numRequestsInProgress() === 0) {
                idleTimer = setTimeout(onIdle, idleTime);
            }
        };
        evaluate();
        const eventHandler = () => {
            evaluate();
            return false;
        };
        const listenToEvent = (event) => {
            return waitForEvent(networkManager, event, eventHandler, timeout, abortPromise);
        };
        const eventPromises = [
            listenToEvent(NetworkManagerEmittedEvents.Request),
            listenToEvent(NetworkManagerEmittedEvents.Response),
        ];
        await Promise.race([
            idlePromise,
            ...eventPromises,
            __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_sessionClosePromise).call(this),
        ]).then(r => {
            cleanup();
            return r;
        }, error => {
            cleanup();
            throw error;
        });
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched frame.
     * @example
     *
     * ```ts
     * const frame = await page.waitForFrame(async frame => {
     *   return frame.name() === 'Test';
     * });
     * ```
     *
     * @remarks
     * Optional Parameter have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
     *   pass `0` to disable the timeout. The default value can be changed by using
     *   the {@link Page.setDefaultTimeout} method.
     */
    async waitForFrame(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$h(this, _CDPPage_timeoutSettings, "f").timeout() } = options;
        let predicate;
        if (isString(urlOrPredicate)) {
            predicate = (frame) => {
                return Promise.resolve(urlOrPredicate === frame.url());
            };
        }
        else {
            predicate = (frame) => {
                const value = urlOrPredicate(frame);
                if (typeof value === 'boolean') {
                    return Promise.resolve(value);
                }
                return value;
            };
        }
        const eventRace = Promise.race([
            waitForEvent(__classPrivateFieldGet$h(this, _CDPPage_frameManager, "f"), FrameManagerEmittedEvents.FrameAttached, predicate, timeout, __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_sessionClosePromise).call(this)),
            waitForEvent(__classPrivateFieldGet$h(this, _CDPPage_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigated, predicate, timeout, __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_sessionClosePromise).call(this)),
            ...this.frames().map(async (frame) => {
                if (await predicate(frame)) {
                    return frame;
                }
                return await eventRace;
            }),
        ]);
        return eventRace;
    }
    /**
     * This method navigate to the previous page in history.
     * @param options - Navigation parameters
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect. If can not go back, resolves to `null`.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil` : When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async goBack(options = {}) {
        return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_go).call(this, -1, options);
    }
    /**
     * This method navigate to the next page in history.
     * @param options - Navigation Parameter
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect. If can not go forward, resolves to `null`.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async goForward(options = {}) {
        return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_go).call(this, +1, options);
    }
    /**
     * Brings page to front (activates tab).
     */
    async bringToFront() {
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.bringToFront');
    }
    /**
     * @param enabled - Whether or not to enable JavaScript on the page.
     * @returns
     * @remarks
     * NOTE: changing this value won't affect scripts that have already been run.
     * It will take full effect on the next navigation.
     */
    async setJavaScriptEnabled(enabled) {
        if (__classPrivateFieldGet$h(this, _CDPPage_javascriptEnabled, "f") === enabled) {
            return;
        }
        __classPrivateFieldSet$g(this, _CDPPage_javascriptEnabled, enabled, "f");
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setScriptExecutionDisabled', {
            value: !enabled,
        });
    }
    /**
     * Toggles bypassing page's Content-Security-Policy.
     * @param enabled - sets bypassing of page's Content-Security-Policy.
     * @remarks
     * NOTE: CSP bypassing happens at the moment of CSP initialization rather than
     * evaluation. Usually, this means that `page.setBypassCSP` should be called
     * before navigating to the domain.
     */
    async setBypassCSP(enabled) {
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.setBypassCSP', { enabled });
    }
    /**
     * @param type - Changes the CSS media type of the page. The only allowed
     * values are `screen`, `print` and `null`. Passing `null` disables CSS media
     * emulation.
     * @example
     *
     * ```ts
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → true
     * await page.evaluate(() => matchMedia('print').matches);
     * // → false
     *
     * await page.emulateMediaType('print');
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → false
     * await page.evaluate(() => matchMedia('print').matches);
     * // → true
     *
     * await page.emulateMediaType(null);
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → true
     * await page.evaluate(() => matchMedia('print').matches);
     * // → false
     * ```
     */
    async emulateMediaType(type) {
        assert(type === 'screen' ||
            type === 'print' ||
            (type !== null && type !== void 0 ? type : undefined) === undefined, 'Unsupported media type: ' + type);
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setEmulatedMedia', {
            media: type || '',
        });
    }
    /**
     * Enables CPU throttling to emulate slow CPUs.
     * @param factor - slowdown factor (1 is no throttle, 2 is 2x slowdown, etc).
     */
    async emulateCPUThrottling(factor) {
        assert(factor === null || factor >= 1, 'Throttling rate should be greater or equal to 1');
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setCPUThrottlingRate', {
            rate: factor !== null ? factor : 1,
        });
    }
    /**
     * @param features - `<?Array<Object>>` Given an array of media feature
     * objects, emulates CSS media features on the page. Each media feature object
     * must have the following properties:
     * @example
     *
     * ```ts
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-color-scheme', value: 'dark'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: dark)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: light)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-reduced-motion', value: 'reduce'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: reduce)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: no-preference)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-color-scheme', value: 'dark'},
     *   {name: 'prefers-reduced-motion', value: 'reduce'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: dark)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: light)').matches
     * );
     * // → false
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: reduce)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: no-preference)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([{name: 'color-gamut', value: 'p3'}]);
     * await page.evaluate(() => matchMedia('(color-gamut: srgb)').matches);
     * // → true
     * await page.evaluate(() => matchMedia('(color-gamut: p3)').matches);
     * // → true
     * await page.evaluate(() => matchMedia('(color-gamut: rec2020)').matches);
     * // → false
     * ```
     */
    async emulateMediaFeatures(features) {
        if (!features) {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setEmulatedMedia', {});
        }
        if (Array.isArray(features)) {
            for (const mediaFeature of features) {
                const name = mediaFeature.name;
                assert(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(name), 'Unsupported media feature: ' + name);
            }
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setEmulatedMedia', {
                features: features,
            });
        }
    }
    /**
     * @param timezoneId - Changes the timezone of the page. See
     * {@link https://source.chromium.org/chromium/chromium/deps/icu.git/+/faee8bc70570192d82d2978a71e2a615788597d1:source/data/misc/metaZones.txt | ICU’s metaZones.txt}
     * for a list of supported timezone IDs. Passing
     * `null` disables timezone emulation.
     */
    async emulateTimezone(timezoneId) {
        try {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setTimezoneOverride', {
                timezoneId: timezoneId || '',
            });
        }
        catch (error) {
            if (isErrorLike(error) && error.message.includes('Invalid timezone')) {
                throw new Error(`Invalid timezone ID: ${timezoneId}`);
            }
            throw error;
        }
    }
    /**
     * Emulates the idle state.
     * If no arguments set, clears idle state emulation.
     *
     * @example
     *
     * ```ts
     * // set idle emulation
     * await page.emulateIdleState({isUserActive: true, isScreenUnlocked: false});
     *
     * // do some checks here
     * ...
     *
     * // clear idle emulation
     * await page.emulateIdleState();
     * ```
     *
     * @param overrides - Mock idle state. If not set, clears idle overrides
     */
    async emulateIdleState(overrides) {
        if (overrides) {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setIdleOverride', {
                isUserActive: overrides.isUserActive,
                isScreenUnlocked: overrides.isScreenUnlocked,
            });
        }
        else {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.clearIdleOverride');
        }
    }
    /**
     * Simulates the given vision deficiency on the page.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.goto('https://v8.dev/blog/10-years');
     *
     *   await page.emulateVisionDeficiency('achromatopsia');
     *   await page.screenshot({path: 'achromatopsia.png'});
     *
     *   await page.emulateVisionDeficiency('deuteranopia');
     *   await page.screenshot({path: 'deuteranopia.png'});
     *
     *   await page.emulateVisionDeficiency('blurredVision');
     *   await page.screenshot({path: 'blurred-vision.png'});
     *
     *   await browser.close();
     * })();
     * ```
     *
     * @param type - the type of deficiency to simulate, or `'none'` to reset.
     */
    async emulateVisionDeficiency(type) {
        const visionDeficiencies = new Set([
            'none',
            'achromatopsia',
            'blurredVision',
            'deuteranopia',
            'protanopia',
            'tritanopia',
        ]);
        try {
            assert(!type || visionDeficiencies.has(type), `Unsupported vision deficiency: ${type}`);
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setEmulatedVisionDeficiency', {
                type: type || 'none',
            });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * `page.setViewport` will resize the page. A lot of websites don't expect
     * phones to change size, so you should set the viewport before navigating to
     * the page.
     *
     * In the case of multiple pages in a single browser, each page can have its
     * own viewport size.
     * @example
     *
     * ```ts
     * const page = await browser.newPage();
     * await page.setViewport({
     *   width: 640,
     *   height: 480,
     *   deviceScaleFactor: 1,
     * });
     * await page.goto('https://example.com');
     * ```
     *
     * @param viewport -
     * @remarks
     * Argument viewport have following properties:
     *
     * - `width`: page width in pixels. required
     *
     * - `height`: page height in pixels. required
     *
     * - `deviceScaleFactor`: Specify device scale factor (can be thought of as
     *   DPR). Defaults to `1`.
     *
     * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
     *   to `false`.
     *
     * - `hasTouch`: Specifies if viewport supports touch events. Defaults to `false`
     *
     * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to false.
     *
     * NOTE: in certain cases, setting viewport will reload the page in order to
     * set the isMobile or hasTouch properties.
     */
    async setViewport(viewport) {
        const needsReload = await __classPrivateFieldGet$h(this, _CDPPage_emulationManager, "f").emulateViewport(viewport);
        __classPrivateFieldSet$g(this, _CDPPage_viewport, viewport, "f");
        if (needsReload) {
            await this.reload();
        }
    }
    /**
     * @returns
     *
     * - `width`: page's width in pixels
     *
     * - `height`: page's height in pixels
     *
     * - `deviceScaleFactor`: Specify device scale factor (can be though of as
     *   dpr). Defaults to `1`.
     *
     * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
     *   to `false`.
     *
     * - `hasTouch`: Specifies if viewport supports touch events. Defaults to
     *   `false`.
     *
     * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to
     *   `false`.
     */
    viewport() {
        return __classPrivateFieldGet$h(this, _CDPPage_viewport, "f");
    }
    /**
     * Evaluates a function in the page's context and returns the result.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * @example
     *
     * ```ts
     * const result = await frame.evaluate(() => {
     *   return Promise.resolve(8 * 7);
     * });
     * console.log(result); // prints "56"
     * ```
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluate('1 + 2');
     * ```
     *
     * To get the best TypeScript experience, you should pass in as the
     * generic the type of `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluate(() => 2);
     * ```
     *
     * @example
     *
     * {@link ElementHandle} instances (including {@link JSHandle}s) can be passed
     * as arguments to the `pageFunction`:
     *
     * ```ts
     * const bodyHandle = await page.$('body');
     * const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     * await bodyHandle.dispose();
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     *
     * @returns the return value of `pageFunction`.
     */
    async evaluate(pageFunction, ...args) {
        return __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").mainFrame().evaluate(pageFunction, ...args);
    }
    /**
     * Adds a function which would be invoked in one of the following scenarios:
     *
     * - whenever the page is navigated
     *
     * - whenever the child frame is attached or navigated. In this case, the
     *   function is invoked in the context of the newly attached frame.
     *
     * The function is invoked after the document was created but before any of
     * its scripts were run. This is useful to amend the JavaScript environment,
     * e.g. to seed `Math.random`.
     * @param pageFunction - Function to be evaluated in browser context
     * @param args - Arguments to pass to `pageFunction`
     * @example
     * An example of overriding the navigator.languages property before the page loads:
     *
     * ```ts
     * // preload.js
     *
     * // overwrite the `languages` property to use a custom getter
     * Object.defineProperty(navigator, 'languages', {
     *   get: function () {
     *     return ['en-US', 'en', 'bn'];
     *   },
     * });
     *
     * // In your puppeteer script, assuming the preload.js file is
     * // in same folder of our script.
     * const preloadFile = fs.readFileSync('./preload.js', 'utf8');
     * await page.evaluateOnNewDocument(preloadFile);
     * ```
     */
    async evaluateOnNewDocument(pageFunction, ...args) {
        const source = evaluationString(pageFunction, ...args);
        await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.addScriptToEvaluateOnNewDocument', {
            source,
        });
    }
    /**
     * Toggles ignoring cache for each request based on the enabled state. By
     * default, caching is enabled.
     * @param enabled - sets the `enabled` state of cache
     */
    async setCacheEnabled(enabled = true) {
        await __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").networkManager.setCacheEnabled(enabled);
    }
    /**
     * @remarks
     * Options object which might have the following properties:
     *
     * - `path` : The file path to save the image to. The screenshot type
     *   will be inferred from file extension. If `path` is a relative path, then
     *   it is resolved relative to
     *   {@link https://nodejs.org/api/process.html#process_process_cwd
     *   | current working directory}.
     *   If no path is provided, the image won't be saved to the disk.
     *
     * - `type` : Specify screenshot type, can be either `jpeg` or `png`.
     *   Defaults to 'png'.
     *
     * - `quality` : The quality of the image, between 0-100. Not
     *   applicable to `png` images.
     *
     * - `fullPage` : When true, takes a screenshot of the full
     *   scrollable page. Defaults to `false`.
     *
     * - `clip` : An object which specifies clipping region of the page.
     *   Should have the following fields:<br/>
     * - `x` : x-coordinate of top-left corner of clip area.<br/>
     * - `y` : y-coordinate of top-left corner of clip area.<br/>
     * - `width` : width of clipping area.<br/>
     * - `height` : height of clipping area.
     *
     * - `omitBackground` : Hides default white background and allows
     *   capturing screenshots with transparency. Defaults to `false`.
     *
     * - `encoding` : The encoding of the image, can be either base64 or
     *   binary. Defaults to `binary`.
     *
     * - `captureBeyondViewport` : When true, captures screenshot
     *   {@link https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot
     *   | beyond the viewport}. When false, falls back to old behaviour,
     *   and cuts the screenshot by the viewport size. Defaults to `true`.
     *
     * - `fromSurface` : When true, captures screenshot
     *   {@link https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot
     *   | from the surface rather than the view}. When false, works only in
     *   headful mode and ignores page viewport (but not browser window's
     *   bounds). Defaults to `true`.
     *
     * NOTE: Screenshots take at least 1/6 second on OS X. See
     * {@link https://crbug.com/741689} for discussion.
     * @returns Promise which resolves to buffer or a base64 string (depending on
     * the value of `encoding`) with captured screenshot.
     */
    async screenshot(options = {}) {
        let screenshotType = "png" /* Protocol.Page.CaptureScreenshotRequestFormat.Png */;
        // options.type takes precedence over inferring the type from options.path
        // because it may be a 0-length file with no extension created beforehand
        // (i.e. as a temp file).
        if (options.type) {
            screenshotType =
                options.type;
        }
        else if (options.path) {
            const filePath = options.path;
            const extension = filePath
                .slice(filePath.lastIndexOf('.') + 1)
                .toLowerCase();
            switch (extension) {
                case 'png':
                    screenshotType = "png" /* Protocol.Page.CaptureScreenshotRequestFormat.Png */;
                    break;
                case 'jpeg':
                case 'jpg':
                    screenshotType = "jpeg" /* Protocol.Page.CaptureScreenshotRequestFormat.Jpeg */;
                    break;
                case 'webp':
                    screenshotType = "webp" /* Protocol.Page.CaptureScreenshotRequestFormat.Webp */;
                    break;
                default:
                    throw new Error(`Unsupported screenshot type for extension \`.${extension}\``);
            }
        }
        if (options.quality) {
            assert(screenshotType === "jpeg" /* Protocol.Page.CaptureScreenshotRequestFormat.Jpeg */ ||
                screenshotType === "webp" /* Protocol.Page.CaptureScreenshotRequestFormat.Webp */, 'options.quality is unsupported for the ' +
                screenshotType +
                ' screenshots');
            assert(typeof options.quality === 'number', 'Expected options.quality to be a number but found ' +
                typeof options.quality);
            assert(Number.isInteger(options.quality), 'Expected options.quality to be an integer');
            assert(options.quality >= 0 && options.quality <= 100, 'Expected options.quality to be between 0 and 100 (inclusive), got ' +
                options.quality);
        }
        assert(!options.clip || !options.fullPage, 'options.clip and options.fullPage are exclusive');
        if (options.clip) {
            assert(typeof options.clip.x === 'number', 'Expected options.clip.x to be a number but found ' +
                typeof options.clip.x);
            assert(typeof options.clip.y === 'number', 'Expected options.clip.y to be a number but found ' +
                typeof options.clip.y);
            assert(typeof options.clip.width === 'number', 'Expected options.clip.width to be a number but found ' +
                typeof options.clip.width);
            assert(typeof options.clip.height === 'number', 'Expected options.clip.height to be a number but found ' +
                typeof options.clip.height);
            assert(options.clip.width !== 0, 'Expected options.clip.width not to be 0.');
            assert(options.clip.height !== 0, 'Expected options.clip.height not to be 0.');
        }
        return __classPrivateFieldGet$h(this, _CDPPage_screenshotTaskQueue, "f").postTask(() => {
            return __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_screenshotTask).call(this, screenshotType, options);
        });
    }
    /**
     * Generates a PDF of the page with the `print` CSS media type.
     * @remarks
     *
     * NOTE: PDF generation is only supported in Chrome headless mode.
     *
     * To generate a PDF with the `screen` media type, call
     * {@link Page.emulateMediaType | `page.emulateMediaType('screen')`} before
     * calling `page.pdf()`.
     *
     * By default, `page.pdf()` generates a pdf with modified colors for printing.
     * Use the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust | `-webkit-print-color-adjust`}
     * property to force rendering of exact colors.
     *
     * @param options - options for generating the PDF.
     */
    async createPDFStream(options = {}) {
        const { scale = 1, displayHeaderFooter = false, headerTemplate = '', footerTemplate = '', printBackground = false, landscape = false, pageRanges = '', preferCSSPageSize = false, margin = {}, omitBackground = false, timeout = 30000, } = options;
        let paperWidth = 8.5;
        let paperHeight = 11;
        if (options.format) {
            const format = _paperFormats[options.format.toLowerCase()];
            assert(format, 'Unknown paper format: ' + options.format);
            paperWidth = format.width;
            paperHeight = format.height;
        }
        else {
            paperWidth = convertPrintParameterToInches(options.width) || paperWidth;
            paperHeight =
                convertPrintParameterToInches(options.height) || paperHeight;
        }
        const marginTop = convertPrintParameterToInches(margin.top) || 0;
        const marginLeft = convertPrintParameterToInches(margin.left) || 0;
        const marginBottom = convertPrintParameterToInches(margin.bottom) || 0;
        const marginRight = convertPrintParameterToInches(margin.right) || 0;
        if (omitBackground) {
            await __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_setTransparentBackgroundColor).call(this);
        }
        const printCommandPromise = __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.printToPDF', {
            transferMode: 'ReturnAsStream',
            landscape,
            displayHeaderFooter,
            headerTemplate,
            footerTemplate,
            printBackground,
            scale,
            paperWidth,
            paperHeight,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            pageRanges,
            preferCSSPageSize,
        });
        const result = await waitWithTimeout(printCommandPromise, 'Page.printToPDF', timeout);
        if (omitBackground) {
            await __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_resetDefaultBackgroundColor).call(this);
        }
        assert(result.stream, '`stream` is missing from `Page.printToPDF');
        return getReadableFromProtocolStream(__classPrivateFieldGet$h(this, _CDPPage_client, "f"), result.stream);
    }
    /**
     * @param options -
     * @returns
     */
    async pdf(options = {}) {
        const { path = undefined } = options;
        const readable = await this.createPDFStream(options);
        const buffer = await getReadableAsBuffer(readable, path);
        assert(buffer, 'Could not create buffer');
        return buffer;
    }
    /**
     * @returns The page's title
     * @remarks
     * Shortcut for {@link Frame.title | page.mainFrame().title()}.
     */
    async title() {
        return this.mainFrame().title();
    }
    async close(options = { runBeforeUnload: undefined }) {
        const connection = __classPrivateFieldGet$h(this, _CDPPage_client, "f").connection();
        assert(connection, 'Protocol error: Connection closed. Most likely the page has been closed.');
        const runBeforeUnload = !!options.runBeforeUnload;
        if (runBeforeUnload) {
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.close');
        }
        else {
            await connection.send('Target.closeTarget', {
                targetId: __classPrivateFieldGet$h(this, _CDPPage_target, "f")._targetId,
            });
            await __classPrivateFieldGet$h(this, _CDPPage_target, "f")._isClosedPromise;
        }
    }
    /**
     * Indicates that the page has been closed.
     * @returns
     */
    isClosed() {
        return __classPrivateFieldGet$h(this, _CDPPage_closed, "f");
    }
    get mouse() {
        return __classPrivateFieldGet$h(this, _CDPPage_mouse, "f");
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse} to click in the center of the
     * element. If there's no element matching `selector`, the method throws an
     * error.
     * @remarks Bear in mind that if `click()` triggers a navigation event and
     * there's a separate `page.waitForNavigation()` promise to be resolved, you
     * may end up with a race condition that yields unexpected results. The
     * correct pattern for click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   page.click(selector, clickOptions),
     * ]);
     * ```
     *
     * Shortcut for {@link Frame.click | page.mainFrame().click(selector[, options]) }.
     * @param selector - A `selector` to search for element to click. If there are
     * multiple elements satisfying the `selector`, the first will be clicked
     * @param options - `Object`
     * @returns Promise which resolves when the element matching `selector` is
     * successfully clicked. The Promise will be rejected if there is no element
     * matching `selector`.
     */
    click(selector, options = {}) {
        return this.mainFrame().click(selector, options);
    }
    /**
     * This method fetches an element with `selector` and focuses it. If there's no
     * element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector }
     * of an element to focus. If there are multiple elements satisfying the
     * selector, the first will be focused.
     * @returns Promise which resolves when the element matching selector is
     * successfully focused. The promise will be rejected if there is no element
     * matching selector.
     * @remarks
     * Shortcut for {@link Frame.focus | page.mainFrame().focus(selector)}.
     */
    focus(selector) {
        return this.mainFrame().focus(selector);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse} to hover over the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to search for element to hover. If there are multiple elements satisfying
     * the selector, the first will be hovered.
     * @returns Promise which resolves when the element matching `selector` is
     * successfully hovered. Promise gets rejected if there's no element matching
     * `selector`.
     * @remarks
     * Shortcut for {@link Page.hover | page.mainFrame().hover(selector)}.
     */
    hover(selector) {
        return this.mainFrame().hover(selector);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * page.select('select#colors', 'blue'); // single selection
     * page.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
     * to query the page for
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first one
     * is taken into account.
     * @returns
     *
     * @remarks
     * Shortcut for {@link Frame.select | page.mainFrame().select()}
     */
    select(selector, ...values) {
        return this.mainFrame().select(selector, ...values);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.touchscreen} to tap in the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
     * to search for element to tap. If there are multiple elements satisfying the
     * selector, the first will be tapped.
     * @returns
     * @remarks
     * Shortcut for {@link Frame.tap | page.mainFrame().tap(selector)}.
     */
    tap(selector) {
        return this.mainFrame().tap(selector);
    }
    /**
     * Sends a `keydown`, `keypress/input`, and `keyup` event for each character
     * in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`, use {@link Keyboard.press}.
     * @example
     *
     * ```ts
     * await page.type('#mytextarea', 'Hello');
     * // Types instantly
     * await page.type('#mytextarea', 'World', {delay: 100});
     * // Types slower, like a user
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * of an element to type into. If there are multiple elements satisfying the
     * selector, the first will be used.
     * @param text - A text to type into a focused element.
     * @param options - have property `delay` which is the Time to wait between
     * key presses in milliseconds. Defaults to `0`.
     * @returns
     * @remarks
     */
    type(selector, text, options) {
        return this.mainFrame().type(selector, text, options);
    }
    /**
     * @deprecated Replace with `new Promise(r => setTimeout(r, milliseconds));`.
     *
     * Causes your script to wait for the given number of milliseconds.
     *
     * @remarks
     * It's generally recommended to not wait for a number of seconds, but instead
     * use {@link Frame.waitForSelector}, {@link Frame.waitForXPath} or
     * {@link Frame.waitForFunction} to wait for exactly the conditions you want.
     *
     * @example
     *
     * Wait for 1 second:
     *
     * ```ts
     * await page.waitForTimeout(1000);
     * ```
     *
     * @param milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds) {
        return this.mainFrame().waitForTimeout(milliseconds);
    }
    /**
     * Wait for the `selector` to appear in page. If at the moment of calling the
     * method the `selector` already exists, the method will return immediately. If
     * the `selector` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * This method works across navigations:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * of an element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by selector string
     * is added to DOM. Resolves to `null` if waiting for hidden: `true` and
     * selector is not found in DOM.
     * @remarks
     * The optional Parameter in Arguments `options` are :
     *
     * - `Visible`: A boolean wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: Wait for element to not be found in the DOM or to be hidden,
     *   i.e. have `display: none` or `visibility: hidden` CSS properties. Defaults to
     *   `false`.
     *
     * - `timeout`: maximum time to wait for in milliseconds. Defaults to `30000`
     *   (30 seconds). Pass `0` to disable timeout. The default value can be changed
     *   by using the {@link Page.setDefaultTimeout} method.
     */
    async waitForSelector(selector, options = {}) {
        return await this.mainFrame().waitForSelector(selector, options);
    }
    /**
     * Wait for the `xpath` to appear in page. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the `xpath` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * This method works across navigation
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForXPath('//img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param xpath - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/XPath | xpath} of an
     * element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by xpath string is
     * added to DOM. Resolves to `null` if waiting for `hidden: true` and xpath is
     * not found in DOM.
     * @remarks
     * The optional Argument `options` have properties:
     *
     * - `visible`: A boolean to wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: A boolean wait for element to not be found in the DOM or to be
     *   hidden, i.e. have `display: none` or `visibility: hidden` CSS properties.
     *   Defaults to `false`.
     *
     * - `timeout`: A number which is maximum time to wait for in milliseconds.
     *   Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
     *   value can be changed by using the {@link Page.setDefaultTimeout} method.
     */
    waitForXPath(xpath, options = {}) {
        return this.mainFrame().waitForXPath(xpath, options);
    }
    /**
     * Waits for a function to finish evaluating in the page's context.
     *
     * @example
     * The {@link Page.waitForFunction} can be used to observe viewport size change:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   const watchDog = page.waitForFunction('window.innerWidth < 100');
     *   await page.setViewport({width: 50, height: 50});
     *   await watchDog;
     *   await browser.close();
     * })();
     * ```
     *
     * @example
     * To pass arguments from node.js to the predicate of
     * {@link Page.waitForFunction} function:
     *
     * ```ts
     * const selector = '.foo';
     * await page.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {},
     *   selector
     * );
     * ```
     *
     * @example
     * The predicate of {@link Page.waitForFunction} can be asynchronous too:
     *
     * ```ts
     * const username = 'github-username';
     * await page.waitForFunction(
     *   async username => {
     *     const githubResponse = await fetch(
     *       `https://api.github.com/users/${username}`
     *     );
     *     const githubUser = await githubResponse.json();
     *     // show the avatar
     *     const img = document.createElement('img');
     *     img.src = githubUser.avatar_url;
     *     // wait 3 seconds
     *     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
     *     img.remove();
     *   },
     *   {},
     *   username
     * );
     * ```
     *
     * @param pageFunction - Function to be evaluated in browser context
     * @param options - Options for configuring waiting behavior.
     */
    waitForFunction(pageFunction, options = {}, ...args) {
        return this.mainFrame().waitForFunction(pageFunction, options, ...args);
    }
}
_CDPPage_closed = new WeakMap(), _CDPPage_client = new WeakMap(), _CDPPage_target = new WeakMap(), _CDPPage_keyboard = new WeakMap(), _CDPPage_mouse = new WeakMap(), _CDPPage_timeoutSettings = new WeakMap(), _CDPPage_touchscreen = new WeakMap(), _CDPPage_accessibility = new WeakMap(), _CDPPage_frameManager = new WeakMap(), _CDPPage_emulationManager = new WeakMap(), _CDPPage_tracing = new WeakMap(), _CDPPage_pageBindings = new WeakMap(), _CDPPage_coverage = new WeakMap(), _CDPPage_javascriptEnabled = new WeakMap(), _CDPPage_viewport = new WeakMap(), _CDPPage_screenshotTaskQueue = new WeakMap(), _CDPPage_workers = new WeakMap(), _CDPPage_fileChooserPromises = new WeakMap(), _CDPPage_disconnectPromise = new WeakMap(), _CDPPage_userDragInterceptionEnabled = new WeakMap(), _CDPPage_onDetachedFromTarget = new WeakMap(), _CDPPage_onAttachedToTarget = new WeakMap(), _CDPPage_instances = new WeakSet(), _CDPPage_initialize = async function _CDPPage_initialize() {
    try {
        await Promise.all([
            __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").initialize(),
            __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Performance.enable'),
            __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Log.enable'),
        ]);
    }
    catch (err) {
        if (isErrorLike(err) && isTargetClosedError(err)) {
            debugError(err);
        }
        else {
            throw err;
        }
    }
}, _CDPPage_onFileChooser = async function _CDPPage_onFileChooser(event) {
    if (!__classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f").size) {
        return;
    }
    const frame = __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").frame(event.frameId);
    assert(frame, 'This should never happen.');
    // This is guaranteed to be an HTMLInputElement handle by the event.
    const handle = (await frame.worlds[MAIN_WORLD].adoptBackendNode(event.backendNodeId));
    const fileChooser = new FileChooser(handle, event);
    for (const promise of __classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f")) {
        promise.resolve(fileChooser);
    }
    __classPrivateFieldGet$h(this, _CDPPage_fileChooserPromises, "f").clear();
}, _CDPPage_onTargetCrashed = function _CDPPage_onTargetCrashed() {
    this.emit('error', new Error('Page crashed!'));
}, _CDPPage_onLogEntryAdded = function _CDPPage_onLogEntryAdded(event) {
    const { level, text, args, source, url, lineNumber } = event.entry;
    if (args) {
        args.map(arg => {
            return releaseObject(__classPrivateFieldGet$h(this, _CDPPage_client, "f"), arg);
        });
    }
    if (source !== 'worker') {
        this.emit("console" /* PageEmittedEvents.Console */, new ConsoleMessage(level, text, [], [{ url, lineNumber }]));
    }
}, _CDPPage_emitMetrics = function _CDPPage_emitMetrics(event) {
    this.emit("metrics" /* PageEmittedEvents.Metrics */, {
        title: event.title,
        metrics: __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_buildMetricsObject).call(this, event.metrics),
    });
}, _CDPPage_buildMetricsObject = function _CDPPage_buildMetricsObject(metrics) {
    const result = {};
    for (const metric of metrics || []) {
        if (supportedMetrics.has(metric.name)) {
            result[metric.name] = metric.value;
        }
    }
    return result;
}, _CDPPage_handleException = function _CDPPage_handleException(exceptionDetails) {
    const message = getExceptionMessage(exceptionDetails);
    const err = new Error(message);
    err.stack = ''; // Don't report clientside error with a node stack attached
    this.emit("pageerror" /* PageEmittedEvents.PageError */, err);
}, _CDPPage_onConsoleAPI = async function _CDPPage_onConsoleAPI(event) {
    if (event.executionContextId === 0) {
        // DevTools protocol stores the last 1000 console messages. These
        // messages are always reported even for removed execution contexts. In
        // this case, they are marked with executionContextId = 0 and are
        // reported upon enabling Runtime agent.
        //
        // Ignore these messages since:
        // - there's no execution context we can use to operate with message
        //   arguments
        // - these messages are reported before Puppeteer clients can subscribe
        //   to the 'console'
        //   page event.
        //
        // @see https://github.com/puppeteer/puppeteer/issues/3865
        return;
    }
    const context = __classPrivateFieldGet$h(this, _CDPPage_frameManager, "f").executionContextById(event.executionContextId, __classPrivateFieldGet$h(this, _CDPPage_client, "f"));
    const values = event.args.map(arg => {
        return createJSHandle(context, arg);
    });
    __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_addConsoleMessage).call(this, event.type, values, event.stackTrace);
}, _CDPPage_onBindingCalled = async function _CDPPage_onBindingCalled(event) {
    let payload;
    try {
        payload = JSON.parse(event.payload);
    }
    catch {
        // The binding was either called by something in the page or it was
        // called before our wrapper was initialized.
        return;
    }
    const { type, name, seq, args } = payload;
    if (type !== 'exposedFun' || !__classPrivateFieldGet$h(this, _CDPPage_pageBindings, "f").has(name)) {
        return;
    }
    let expression = null;
    try {
        const pageBinding = __classPrivateFieldGet$h(this, _CDPPage_pageBindings, "f").get(name);
        assert(pageBinding);
        const result = await pageBinding(...args);
        expression = pageBindingDeliverResultString(name, seq, result);
    }
    catch (error) {
        if (isErrorLike(error)) {
            expression = pageBindingDeliverErrorString(name, seq, error.message, error.stack);
        }
        else {
            expression = pageBindingDeliverErrorValueString(name, seq, error);
        }
    }
    __classPrivateFieldGet$h(this, _CDPPage_client, "f")
        .send('Runtime.evaluate', {
        expression,
        contextId: event.executionContextId,
    })
        .catch(debugError);
}, _CDPPage_addConsoleMessage = function _CDPPage_addConsoleMessage(eventType, args, stackTrace) {
    if (!this.listenerCount("console" /* PageEmittedEvents.Console */)) {
        args.forEach(arg => {
            return arg.dispose();
        });
        return;
    }
    const textTokens = [];
    for (const arg of args) {
        const remoteObject = arg.remoteObject();
        if (remoteObject.objectId) {
            textTokens.push(arg.toString());
        }
        else {
            textTokens.push(valueFromRemoteObject(remoteObject));
        }
    }
    const stackTraceLocations = [];
    if (stackTrace) {
        for (const callFrame of stackTrace.callFrames) {
            stackTraceLocations.push({
                url: callFrame.url,
                lineNumber: callFrame.lineNumber,
                columnNumber: callFrame.columnNumber,
            });
        }
    }
    const message = new ConsoleMessage(eventType, textTokens.join(' '), args, stackTraceLocations);
    this.emit("console" /* PageEmittedEvents.Console */, message);
}, _CDPPage_onDialog = function _CDPPage_onDialog(event) {
    let dialogType = null;
    const validDialogTypes = new Set([
        'alert',
        'confirm',
        'prompt',
        'beforeunload',
    ]);
    if (validDialogTypes.has(event.type)) {
        dialogType = event.type;
    }
    assert(dialogType, 'Unknown javascript dialog type: ' + event.type);
    const dialog = new Dialog(__classPrivateFieldGet$h(this, _CDPPage_client, "f"), dialogType, event.message, event.defaultPrompt);
    this.emit("dialog" /* PageEmittedEvents.Dialog */, dialog);
}, _CDPPage_resetDefaultBackgroundColor = 
/**
 * Resets default white background
 */
async function _CDPPage_resetDefaultBackgroundColor() {
    await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setDefaultBackgroundColorOverride');
}, _CDPPage_setTransparentBackgroundColor = 
/**
 * Hides default white background
 */
async function _CDPPage_setTransparentBackgroundColor() {
    await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setDefaultBackgroundColorOverride', {
        color: { r: 0, g: 0, b: 0, a: 0 },
    });
}, _CDPPage_sessionClosePromise = function _CDPPage_sessionClosePromise() {
    if (!__classPrivateFieldGet$h(this, _CDPPage_disconnectPromise, "f")) {
        __classPrivateFieldSet$g(this, _CDPPage_disconnectPromise, new Promise(fulfill => {
            return __classPrivateFieldGet$h(this, _CDPPage_client, "f").once(CDPSessionEmittedEvents.Disconnected, () => {
                return fulfill(new Error('Target closed'));
            });
        }), "f");
    }
    return __classPrivateFieldGet$h(this, _CDPPage_disconnectPromise, "f");
}, _CDPPage_go = async function _CDPPage_go(delta, options) {
    const history = await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.getNavigationHistory');
    const entry = history.entries[history.currentIndex + delta];
    if (!entry) {
        return null;
    }
    const result = await Promise.all([
        this.waitForNavigation(options),
        __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.navigateToHistoryEntry', { entryId: entry.id }),
    ]);
    return result[0];
}, _CDPPage_screenshotTask = async function _CDPPage_screenshotTask(format, options = {}) {
    var _a, _b;
    await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Target.activateTarget', {
        targetId: __classPrivateFieldGet$h(this, _CDPPage_target, "f")._targetId,
    });
    let clip = options.clip ? processClip(options.clip) : undefined;
    let captureBeyondViewport = (_a = options.captureBeyondViewport) !== null && _a !== void 0 ? _a : true;
    const fromSurface = options.fromSurface;
    if (options.fullPage) {
        const metrics = await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.getLayoutMetrics');
        // Fallback to `contentSize` in case of using Firefox.
        const { width, height } = metrics.cssContentSize || metrics.contentSize;
        // Overwrite clip for full page.
        clip = undefined;
        if (!captureBeyondViewport) {
            const { isMobile = false, deviceScaleFactor = 1, isLandscape = false, } = __classPrivateFieldGet$h(this, _CDPPage_viewport, "f") || {};
            const screenOrientation = isLandscape
                ? { angle: 90, type: 'landscapePrimary' }
                : { angle: 0, type: 'portraitPrimary' };
            await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Emulation.setDeviceMetricsOverride', {
                mobile: isMobile,
                width,
                height,
                deviceScaleFactor,
                screenOrientation,
            });
        }
    }
    else if (!clip) {
        captureBeyondViewport = false;
    }
    const shouldSetDefaultBackground = options.omitBackground && (format === 'png' || format === 'webp');
    if (shouldSetDefaultBackground) {
        await __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_setTransparentBackgroundColor).call(this);
    }
    const result = await __classPrivateFieldGet$h(this, _CDPPage_client, "f").send('Page.captureScreenshot', {
        format,
        quality: options.quality,
        clip: clip && {
            ...clip,
            scale: (_b = clip.scale) !== null && _b !== void 0 ? _b : 1,
        },
        captureBeyondViewport,
        fromSurface,
    });
    if (shouldSetDefaultBackground) {
        await __classPrivateFieldGet$h(this, _CDPPage_instances, "m", _CDPPage_resetDefaultBackgroundColor).call(this);
    }
    if (options.fullPage && __classPrivateFieldGet$h(this, _CDPPage_viewport, "f")) {
        await this.setViewport(__classPrivateFieldGet$h(this, _CDPPage_viewport, "f"));
    }
    const buffer = options.encoding === 'base64'
        ? result.data
        : Buffer.from(result.data, 'base64');
    if (options.path) {
        try {
            const fs = (await importFS()).promises;
            await fs.writeFile(options.path, buffer);
        }
        catch (error) {
            if (error instanceof TypeError) {
                throw new Error('Screenshots can only be written to a file path in a Node-like environment.');
            }
            throw error;
        }
    }
    return buffer;
    function processClip(clip) {
        const x = Math.round(clip.x);
        const y = Math.round(clip.y);
        const width = Math.round(clip.width + clip.x - x);
        const height = Math.round(clip.height + clip.y - y);
        return { x, y, width, height, scale: clip.scale };
    }
};
const supportedMetrics = new Set([
    'Timestamp',
    'Documents',
    'Frames',
    'JSEventListeners',
    'Nodes',
    'LayoutCount',
    'RecalcStyleCount',
    'LayoutDuration',
    'RecalcStyleDuration',
    'ScriptDuration',
    'TaskDuration',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
]);
const unitToPixels = {
    px: 1,
    in: 96,
    cm: 37.8,
    mm: 3.78,
};
function convertPrintParameterToInches(parameter) {
    if (typeof parameter === 'undefined') {
        return undefined;
    }
    let pixels;
    if (isNumber(parameter)) {
        // Treat numbers as pixel values to be aligned with phantom's paperSize.
        pixels = parameter;
    }
    else if (isString(parameter)) {
        const text = parameter;
        let unit = text.substring(text.length - 2).toLowerCase();
        let valueText = '';
        if (unit in unitToPixels) {
            valueText = text.substring(0, text.length - 2);
        }
        else {
            // In case of unknown unit try to parse the whole parameter as number of pixels.
            // This is consistent with phantom's paperSize behavior.
            unit = 'px';
            valueText = text;
        }
        const value = Number(valueText);
        assert(!isNaN(value), 'Failed to parse parameter value: ' + text);
        pixels = value * unitToPixels[unit];
    }
    else {
        throw new Error('page.pdf() Cannot handle parameter type: ' + typeof parameter);
    }
    return pixels / 96;
}

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$f = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$g = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Target_browserContext, _Target_session, _Target_targetInfo, _Target_sessionFactory, _Target_ignoreHTTPSErrors, _Target_defaultViewport, _Target_pagePromise, _Target_workerPromise, _Target_screenshotTaskQueue, _Target_targetManager;
/**
 * @public
 */
class Target {
    /**
     * @internal
     */
    constructor(targetInfo, session, browserContext, targetManager, sessionFactory, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue, isPageTargetCallback) {
        _Target_browserContext.set(this, void 0);
        _Target_session.set(this, void 0);
        _Target_targetInfo.set(this, void 0);
        _Target_sessionFactory.set(this, void 0);
        _Target_ignoreHTTPSErrors.set(this, void 0);
        _Target_defaultViewport.set(this, void 0);
        _Target_pagePromise.set(this, void 0);
        _Target_workerPromise.set(this, void 0);
        _Target_screenshotTaskQueue.set(this, void 0);
        _Target_targetManager.set(this, void 0);
        __classPrivateFieldSet$f(this, _Target_session, session, "f");
        __classPrivateFieldSet$f(this, _Target_targetManager, targetManager, "f");
        __classPrivateFieldSet$f(this, _Target_targetInfo, targetInfo, "f");
        __classPrivateFieldSet$f(this, _Target_browserContext, browserContext, "f");
        this._targetId = targetInfo.targetId;
        __classPrivateFieldSet$f(this, _Target_sessionFactory, sessionFactory, "f");
        __classPrivateFieldSet$f(this, _Target_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$f(this, _Target_defaultViewport, defaultViewport !== null && defaultViewport !== void 0 ? defaultViewport : undefined, "f");
        __classPrivateFieldSet$f(this, _Target_screenshotTaskQueue, screenshotTaskQueue, "f");
        this._isPageTargetCallback = isPageTargetCallback;
        this._initializedPromise = new Promise(fulfill => {
            return (this._initializedCallback = fulfill);
        }).then(async (success) => {
            if (!success) {
                return false;
            }
            const opener = this.opener();
            if (!opener || !__classPrivateFieldGet$g(opener, _Target_pagePromise, "f") || this.type() !== 'page') {
                return true;
            }
            const openerPage = await __classPrivateFieldGet$g(opener, _Target_pagePromise, "f");
            if (!openerPage.listenerCount("popup" /* PageEmittedEvents.Popup */)) {
                return true;
            }
            const popupPage = await this.page();
            openerPage.emit("popup" /* PageEmittedEvents.Popup */, popupPage);
            return true;
        });
        this._isClosedPromise = new Promise(fulfill => {
            return (this._closedCallback = fulfill);
        });
        this._isInitialized =
            !this._isPageTargetCallback(__classPrivateFieldGet$g(this, _Target_targetInfo, "f")) ||
                __classPrivateFieldGet$g(this, _Target_targetInfo, "f").url !== '';
        if (this._isInitialized) {
            this._initializedCallback(true);
        }
    }
    /**
     * @internal
     */
    _session() {
        return __classPrivateFieldGet$g(this, _Target_session, "f");
    }
    /**
     * Creates a Chrome Devtools Protocol session attached to the target.
     */
    createCDPSession() {
        return __classPrivateFieldGet$g(this, _Target_sessionFactory, "f").call(this, false);
    }
    /**
     * @internal
     */
    _targetManager() {
        return __classPrivateFieldGet$g(this, _Target_targetManager, "f");
    }
    /**
     * @internal
     */
    _getTargetInfo() {
        return __classPrivateFieldGet$g(this, _Target_targetInfo, "f");
    }
    /**
     * If the target is not of type `"page"` or `"background_page"`, returns `null`.
     */
    async page() {
        var _a;
        if (this._isPageTargetCallback(__classPrivateFieldGet$g(this, _Target_targetInfo, "f")) && !__classPrivateFieldGet$g(this, _Target_pagePromise, "f")) {
            __classPrivateFieldSet$f(this, _Target_pagePromise, (__classPrivateFieldGet$g(this, _Target_session, "f")
                ? Promise.resolve(__classPrivateFieldGet$g(this, _Target_session, "f"))
                : __classPrivateFieldGet$g(this, _Target_sessionFactory, "f").call(this, true)).then(client => {
                var _a;
                return CDPPage._create(client, this, __classPrivateFieldGet$g(this, _Target_ignoreHTTPSErrors, "f"), (_a = __classPrivateFieldGet$g(this, _Target_defaultViewport, "f")) !== null && _a !== void 0 ? _a : null, __classPrivateFieldGet$g(this, _Target_screenshotTaskQueue, "f"));
            }), "f");
        }
        return (_a = (await __classPrivateFieldGet$g(this, _Target_pagePromise, "f"))) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * If the target is not of type `"service_worker"` or `"shared_worker"`, returns `null`.
     */
    async worker() {
        if (__classPrivateFieldGet$g(this, _Target_targetInfo, "f").type !== 'service_worker' &&
            __classPrivateFieldGet$g(this, _Target_targetInfo, "f").type !== 'shared_worker') {
            return null;
        }
        if (!__classPrivateFieldGet$g(this, _Target_workerPromise, "f")) {
            // TODO(einbinder): Make workers send their console logs.
            __classPrivateFieldSet$f(this, _Target_workerPromise, (__classPrivateFieldGet$g(this, _Target_session, "f")
                ? Promise.resolve(__classPrivateFieldGet$g(this, _Target_session, "f"))
                : __classPrivateFieldGet$g(this, _Target_sessionFactory, "f").call(this, false)).then(client => {
                return new WebWorker(client, __classPrivateFieldGet$g(this, _Target_targetInfo, "f").url, () => { } /* consoleAPICalled */, () => { } /* exceptionThrown */);
            }), "f");
        }
        return __classPrivateFieldGet$g(this, _Target_workerPromise, "f");
    }
    url() {
        return __classPrivateFieldGet$g(this, _Target_targetInfo, "f").url;
    }
    /**
     * Identifies what kind of target this is.
     *
     * @remarks
     *
     * See {@link https://developer.chrome.com/extensions/background_pages | docs} for more info about background pages.
     */
    type() {
        const type = __classPrivateFieldGet$g(this, _Target_targetInfo, "f").type;
        if (type === 'page' ||
            type === 'background_page' ||
            type === 'service_worker' ||
            type === 'shared_worker' ||
            type === 'browser' ||
            type === 'webview') {
            return type;
        }
        return 'other';
    }
    /**
     * Get the browser the target belongs to.
     */
    browser() {
        return __classPrivateFieldGet$g(this, _Target_browserContext, "f").browser();
    }
    /**
     * Get the browser context the target belongs to.
     */
    browserContext() {
        return __classPrivateFieldGet$g(this, _Target_browserContext, "f");
    }
    /**
     * Get the target that opened this target. Top-level targets return `null`.
     */
    opener() {
        const { openerId } = __classPrivateFieldGet$g(this, _Target_targetInfo, "f");
        if (!openerId) {
            return;
        }
        return this.browser()._targets.get(openerId);
    }
    /**
     * @internal
     */
    _targetInfoChanged(targetInfo) {
        __classPrivateFieldSet$f(this, _Target_targetInfo, targetInfo, "f");
        if (!this._isInitialized &&
            (!this._isPageTargetCallback(__classPrivateFieldGet$g(this, _Target_targetInfo, "f")) ||
                __classPrivateFieldGet$g(this, _Target_targetInfo, "f").url !== '')) {
            this._isInitialized = true;
            this._initializedCallback(true);
            return;
        }
    }
}
_Target_browserContext = new WeakMap(), _Target_session = new WeakMap(), _Target_targetInfo = new WeakMap(), _Target_sessionFactory = new WeakMap(), _Target_ignoreHTTPSErrors = new WeakMap(), _Target_defaultViewport = new WeakMap(), _Target_pagePromise = new WeakMap(), _Target_workerPromise = new WeakMap(), _Target_screenshotTaskQueue = new WeakMap(), _Target_targetManager = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$e = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$f = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TaskQueue_chain;
/**
 * @internal
 */
class TaskQueue {
    constructor() {
        _TaskQueue_chain.set(this, void 0);
        __classPrivateFieldSet$e(this, _TaskQueue_chain, Promise.resolve(), "f");
    }
    postTask(task) {
        const result = __classPrivateFieldGet$f(this, _TaskQueue_chain, "f").then(task);
        __classPrivateFieldSet$e(this, _TaskQueue_chain, result.then(() => {
            return undefined;
        }, () => {
            return undefined;
        }), "f");
        return result;
    }
}
_TaskQueue_chain = new WeakMap();

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$d = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$e = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChromeTargetManager_instances, _ChromeTargetManager_connection, _ChromeTargetManager_discoveredTargetsByTargetId, _ChromeTargetManager_attachedTargetsByTargetId, _ChromeTargetManager_attachedTargetsBySessionId, _ChromeTargetManager_ignoredTargets, _ChromeTargetManager_targetFilterCallback, _ChromeTargetManager_targetFactory, _ChromeTargetManager_targetInterceptors, _ChromeTargetManager_attachedToTargetListenersBySession, _ChromeTargetManager_detachedFromTargetListenersBySession, _ChromeTargetManager_initializeCallback, _ChromeTargetManager_initializePromise, _ChromeTargetManager_targetsIdsForInit, _ChromeTargetManager_storeExistingTargetsForInit, _ChromeTargetManager_setupAttachmentListeners, _ChromeTargetManager_removeAttachmentListeners, _ChromeTargetManager_onSessionDetached, _ChromeTargetManager_onTargetCreated, _ChromeTargetManager_onTargetDestroyed, _ChromeTargetManager_onTargetInfoChanged, _ChromeTargetManager_onAttachedToTarget, _ChromeTargetManager_finishInitializationIfReady, _ChromeTargetManager_onDetachedFromTarget;
/**
 * ChromeTargetManager uses the CDP's auto-attach mechanism to intercept
 * new targets and allow the rest of Puppeteer to configure listeners while
 * the target is paused.
 *
 * @internal
 */
class ChromeTargetManager extends EventEmitter {
    constructor(connection, targetFactory, targetFilterCallback) {
        super();
        _ChromeTargetManager_instances.add(this);
        _ChromeTargetManager_connection.set(this, void 0);
        /**
         * Keeps track of the following events: 'Target.targetCreated',
         * 'Target.targetDestroyed', 'Target.targetInfoChanged'.
         *
         * A target becomes discovered when 'Target.targetCreated' is received.
         * A target is removed from this map once 'Target.targetDestroyed' is
         * received.
         *
         * `targetFilterCallback` has no effect on this map.
         */
        _ChromeTargetManager_discoveredTargetsByTargetId.set(this, new Map());
        /**
         * A target is added to this map once ChromeTargetManager has created
         * a Target and attached at least once to it.
         */
        _ChromeTargetManager_attachedTargetsByTargetId.set(this, new Map());
        /**
         *
         * Tracks which sessions attach to which target.
         */
        _ChromeTargetManager_attachedTargetsBySessionId.set(this, new Map());
        /**
         * If a target was filtered out by `targetFilterCallback`, we still receive
         * events about it from CDP, but we don't forward them to the rest of Puppeteer.
         */
        _ChromeTargetManager_ignoredTargets.set(this, new Set());
        _ChromeTargetManager_targetFilterCallback.set(this, void 0);
        _ChromeTargetManager_targetFactory.set(this, void 0);
        _ChromeTargetManager_targetInterceptors.set(this, new WeakMap());
        _ChromeTargetManager_attachedToTargetListenersBySession.set(this, new WeakMap());
        _ChromeTargetManager_detachedFromTargetListenersBySession.set(this, new WeakMap());
        _ChromeTargetManager_initializeCallback.set(this, () => { });
        _ChromeTargetManager_initializePromise.set(this, new Promise(resolve => {
            __classPrivateFieldSet$d(this, _ChromeTargetManager_initializeCallback, resolve, "f");
        }));
        _ChromeTargetManager_targetsIdsForInit.set(this, new Set());
        _ChromeTargetManager_storeExistingTargetsForInit.set(this, () => {
            for (const [targetId, targetInfo,] of __classPrivateFieldGet$e(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").entries()) {
                if ((!__classPrivateFieldGet$e(this, _ChromeTargetManager_targetFilterCallback, "f") ||
                    __classPrivateFieldGet$e(this, _ChromeTargetManager_targetFilterCallback, "f").call(this, targetInfo)) &&
                    targetInfo.type !== 'browser') {
                    __classPrivateFieldGet$e(this, _ChromeTargetManager_targetsIdsForInit, "f").add(targetId);
                }
            }
        });
        _ChromeTargetManager_onSessionDetached.set(this, (session) => {
            __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_removeAttachmentListeners).call(this, session);
            __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").delete(session);
        });
        _ChromeTargetManager_onTargetCreated.set(this, async (event) => {
            __classPrivateFieldGet$e(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            this.emit("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, event.targetInfo);
            // The connection is already attached to the browser target implicitly,
            // therefore, no new CDPSession is created and we have special handling
            // here.
            if (event.targetInfo.type === 'browser' && event.targetInfo.attached) {
                if (__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet$e(this, _ChromeTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
            }
        });
        _ChromeTargetManager_onTargetDestroyed.set(this, (event) => {
            const targetInfo = __classPrivateFieldGet$e(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").get(event.targetId);
            __classPrivateFieldGet$e(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").delete(event.targetId);
            __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, event.targetId);
            if ((targetInfo === null || targetInfo === void 0 ? void 0 : targetInfo.type) === 'service_worker' &&
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetId)) {
                // Special case for service workers: report TargetGone event when
                // the worker is destroyed.
                const target = __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(event.targetId);
                this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").delete(event.targetId);
            }
        });
        _ChromeTargetManager_onTargetInfoChanged.set(this, (event) => {
            __classPrivateFieldGet$e(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            if (__classPrivateFieldGet$e(this, _ChromeTargetManager_ignoredTargets, "f").has(event.targetInfo.targetId) ||
                !__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId) ||
                !event.targetInfo.attached) {
                return;
            }
            const target = __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(event.targetInfo.targetId);
            this.emit("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, {
                target: target,
                targetInfo: event.targetInfo,
            });
        });
        _ChromeTargetManager_onAttachedToTarget.set(this, async (parentSession, event) => {
            const targetInfo = event.targetInfo;
            const session = __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").session(event.sessionId);
            if (!session) {
                throw new Error(`Session ${event.sessionId} was not created.`);
            }
            const silentDetach = async () => {
                await session.send('Runtime.runIfWaitingForDebugger').catch(debugError);
                // We don't use `session.detach()` because that dispatches all commands on
                // the connection instead of the parent session.
                await parentSession
                    .send('Target.detachFromTarget', {
                    sessionId: session.id(),
                })
                    .catch(debugError);
            };
            if (!__classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").isAutoAttached(targetInfo.targetId)) {
                return;
            }
            // Special case for service workers: being attached to service workers will
            // prevent them from ever being destroyed. Therefore, we silently detach
            // from service workers unless the connection was manually created via
            // `page.worker()`. To determine this, we use
            // `this.#connection.isAutoAttached(targetInfo.targetId)`. In the future, we
            // should determine if a target is auto-attached or not with the help of
            // CDP.
            if (targetInfo.type === 'service_worker' &&
                __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").isAutoAttached(targetInfo.targetId)) {
                __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                if (__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet$e(this, _ChromeTargetManager_targetFactory, "f").call(this, targetInfo);
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
                return;
            }
            if (__classPrivateFieldGet$e(this, _ChromeTargetManager_targetFilterCallback, "f") && !__classPrivateFieldGet$e(this, _ChromeTargetManager_targetFilterCallback, "f").call(this, targetInfo)) {
                __classPrivateFieldGet$e(this, _ChromeTargetManager_ignoredTargets, "f").add(targetInfo.targetId);
                __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                return;
            }
            const existingTarget = __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId);
            const target = existingTarget
                ? __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId)
                : __classPrivateFieldGet$e(this, _ChromeTargetManager_targetFactory, "f").call(this, targetInfo, session);
            __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_setupAttachmentListeners).call(this, session);
            if (existingTarget) {
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").set(session.id(), __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId));
            }
            else {
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").set(session.id(), target);
            }
            for (const interceptor of __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").get(parentSession) ||
                []) {
                if (!(parentSession instanceof Connection$1)) {
                    // Sanity check: if parent session is not a connection, it should be
                    // present in #attachedTargetsBySessionId.
                    assert(__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").has(parentSession.id()));
                }
                await interceptor(target, parentSession instanceof Connection$1
                    ? null
                    : __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").get(parentSession.id()));
            }
            __classPrivateFieldGet$e(this, _ChromeTargetManager_targetsIdsForInit, "f").delete(target._targetId);
            if (!existingTarget) {
                this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
            }
            __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this);
            // TODO: the browser might be shutting down here. What do we do with the
            // error?
            await Promise.all([
                session.send('Target.setAutoAttach', {
                    waitForDebuggerOnStart: true,
                    flatten: true,
                    autoAttach: true,
                }),
                session.send('Runtime.runIfWaitingForDebugger'),
            ]).catch(debugError);
        });
        _ChromeTargetManager_onDetachedFromTarget.set(this, (_parentSession, event) => {
            const target = __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").get(event.sessionId);
            __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").delete(event.sessionId);
            if (!target) {
                return;
            }
            __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").delete(target._targetId);
            this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
        });
        __classPrivateFieldSet$d(this, _ChromeTargetManager_connection, connection, "f");
        __classPrivateFieldSet$d(this, _ChromeTargetManager_targetFilterCallback, targetFilterCallback, "f");
        __classPrivateFieldSet$d(this, _ChromeTargetManager_targetFactory, targetFactory, "f");
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").on('Target.targetCreated', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").on('Target.targetDestroyed', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").on('Target.targetInfoChanged', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").on('sessiondetached', __classPrivateFieldGet$e(this, _ChromeTargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_setupAttachmentListeners).call(this, __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f"));
        // TODO: remove `as any` once the protocol definitions are updated with the
        // next Chromium roll.
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f")
            .send('Target.setDiscoverTargets', {
            discover: true,
            filter: [{ type: 'tab', exclude: true }, {}],
        })
            .then(__classPrivateFieldGet$e(this, _ChromeTargetManager_storeExistingTargetsForInit, "f"))
            .catch(debugError);
    }
    async initialize() {
        await __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").send('Target.setAutoAttach', {
            waitForDebuggerOnStart: true,
            flatten: true,
            autoAttach: true,
        });
        __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this);
        await __classPrivateFieldGet$e(this, _ChromeTargetManager_initializePromise, "f");
    }
    dispose() {
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").off('Target.targetCreated', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").off('Target.targetDestroyed', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").off('Target.targetInfoChanged', __classPrivateFieldGet$e(this, _ChromeTargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f").off('sessiondetached', __classPrivateFieldGet$e(this, _ChromeTargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_removeAttachmentListeners).call(this, __classPrivateFieldGet$e(this, _ChromeTargetManager_connection, "f"));
    }
    getAvailableTargets() {
        return __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedTargetsByTargetId, "f");
    }
    addTargetInterceptor(session, interceptor) {
        const interceptors = __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").get(session) || [];
        interceptors.push(interceptor);
        __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").set(session, interceptors);
    }
    removeTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").get(client) || [];
        __classPrivateFieldGet$e(this, _ChromeTargetManager_targetInterceptors, "f").set(client, interceptors.filter(currentInterceptor => {
            return currentInterceptor !== interceptor;
        }));
    }
}
_ChromeTargetManager_connection = new WeakMap(), _ChromeTargetManager_discoveredTargetsByTargetId = new WeakMap(), _ChromeTargetManager_attachedTargetsByTargetId = new WeakMap(), _ChromeTargetManager_attachedTargetsBySessionId = new WeakMap(), _ChromeTargetManager_ignoredTargets = new WeakMap(), _ChromeTargetManager_targetFilterCallback = new WeakMap(), _ChromeTargetManager_targetFactory = new WeakMap(), _ChromeTargetManager_targetInterceptors = new WeakMap(), _ChromeTargetManager_attachedToTargetListenersBySession = new WeakMap(), _ChromeTargetManager_detachedFromTargetListenersBySession = new WeakMap(), _ChromeTargetManager_initializeCallback = new WeakMap(), _ChromeTargetManager_initializePromise = new WeakMap(), _ChromeTargetManager_targetsIdsForInit = new WeakMap(), _ChromeTargetManager_storeExistingTargetsForInit = new WeakMap(), _ChromeTargetManager_onSessionDetached = new WeakMap(), _ChromeTargetManager_onTargetCreated = new WeakMap(), _ChromeTargetManager_onTargetDestroyed = new WeakMap(), _ChromeTargetManager_onTargetInfoChanged = new WeakMap(), _ChromeTargetManager_onAttachedToTarget = new WeakMap(), _ChromeTargetManager_onDetachedFromTarget = new WeakMap(), _ChromeTargetManager_instances = new WeakSet(), _ChromeTargetManager_setupAttachmentListeners = function _ChromeTargetManager_setupAttachmentListeners(session) {
    const listener = (event) => {
        return __classPrivateFieldGet$e(this, _ChromeTargetManager_onAttachedToTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").set(session, listener);
    session.on('Target.attachedToTarget', listener);
    const detachedListener = (event) => {
        return __classPrivateFieldGet$e(this, _ChromeTargetManager_onDetachedFromTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet$e(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet$e(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").set(session, detachedListener);
    session.on('Target.detachedFromTarget', detachedListener);
}, _ChromeTargetManager_removeAttachmentListeners = function _ChromeTargetManager_removeAttachmentListeners(session) {
    if (__classPrivateFieldGet$e(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").has(session)) {
        session.off('Target.attachedToTarget', __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").get(session));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").delete(session);
    }
    if (__classPrivateFieldGet$e(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").has(session)) {
        session.off('Target.detachedFromTarget', __classPrivateFieldGet$e(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").get(session));
        __classPrivateFieldGet$e(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").delete(session);
    }
}, _ChromeTargetManager_finishInitializationIfReady = function _ChromeTargetManager_finishInitializationIfReady(targetId) {
    targetId !== undefined && __classPrivateFieldGet$e(this, _ChromeTargetManager_targetsIdsForInit, "f").delete(targetId);
    if (__classPrivateFieldGet$e(this, _ChromeTargetManager_targetsIdsForInit, "f").size === 0) {
        __classPrivateFieldGet$e(this, _ChromeTargetManager_initializeCallback, "f").call(this);
    }
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$c = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$d = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FirefoxTargetManager_instances, _FirefoxTargetManager_connection, _FirefoxTargetManager_discoveredTargetsByTargetId, _FirefoxTargetManager_availableTargetsByTargetId, _FirefoxTargetManager_availableTargetsBySessionId, _FirefoxTargetManager_ignoredTargets, _FirefoxTargetManager_targetFilterCallback, _FirefoxTargetManager_targetFactory, _FirefoxTargetManager_targetInterceptors, _FirefoxTargetManager_attachedToTargetListenersBySession, _FirefoxTargetManager_initializeCallback, _FirefoxTargetManager_initializePromise, _FirefoxTargetManager_targetsIdsForInit, _FirefoxTargetManager_onSessionDetached, _FirefoxTargetManager_onTargetCreated, _FirefoxTargetManager_onTargetDestroyed, _FirefoxTargetManager_onAttachedToTarget, _FirefoxTargetManager_finishInitializationIfReady;
/**
 * FirefoxTargetManager implements target management using
 * `Target.setDiscoverTargets` without using auto-attach. It, therefore, creates
 * targets that lazily establish their CDP sessions.
 *
 * Although the approach is potentially flaky, there is no other way for Firefox
 * because Firefox's CDP implementation does not support auto-attach.
 *
 * Firefox does not support targetInfoChanged and detachedFromTarget events:
 *
 * - https://bugzilla.mozilla.org/show_bug.cgi?id=1610855
 * - https://bugzilla.mozilla.org/show_bug.cgi?id=1636979
 *   @internal
 */
class FirefoxTargetManager extends EventEmitter {
    constructor(connection, targetFactory, targetFilterCallback) {
        super();
        _FirefoxTargetManager_instances.add(this);
        _FirefoxTargetManager_connection.set(this, void 0);
        /**
         * Keeps track of the following events: 'Target.targetCreated',
         * 'Target.targetDestroyed'.
         *
         * A target becomes discovered when 'Target.targetCreated' is received.
         * A target is removed from this map once 'Target.targetDestroyed' is
         * received.
         *
         * `targetFilterCallback` has no effect on this map.
         */
        _FirefoxTargetManager_discoveredTargetsByTargetId.set(this, new Map());
        /**
         * Keeps track of targets that were created via 'Target.targetCreated'
         * and which one are not filtered out by `targetFilterCallback`.
         *
         * The target is removed from here once it's been destroyed.
         */
        _FirefoxTargetManager_availableTargetsByTargetId.set(this, new Map());
        /**
         * Tracks which sessions attach to which target.
         */
        _FirefoxTargetManager_availableTargetsBySessionId.set(this, new Map());
        /**
         * If a target was filtered out by `targetFilterCallback`, we still receive
         * events about it from CDP, but we don't forward them to the rest of Puppeteer.
         */
        _FirefoxTargetManager_ignoredTargets.set(this, new Set());
        _FirefoxTargetManager_targetFilterCallback.set(this, void 0);
        _FirefoxTargetManager_targetFactory.set(this, void 0);
        _FirefoxTargetManager_targetInterceptors.set(this, new WeakMap());
        _FirefoxTargetManager_attachedToTargetListenersBySession.set(this, new WeakMap());
        _FirefoxTargetManager_initializeCallback.set(this, () => { });
        _FirefoxTargetManager_initializePromise.set(this, new Promise(resolve => {
            __classPrivateFieldSet$c(this, _FirefoxTargetManager_initializeCallback, resolve, "f");
        }));
        _FirefoxTargetManager_targetsIdsForInit.set(this, new Set());
        _FirefoxTargetManager_onSessionDetached.set(this, (session) => {
            this.removeSessionListeners(session);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").delete(session);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").delete(session.id());
        });
        _FirefoxTargetManager_onTargetCreated.set(this, async (event) => {
            if (__classPrivateFieldGet$d(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").has(event.targetInfo.targetId)) {
                return;
            }
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            if (event.targetInfo.type === 'browser' && event.targetInfo.attached) {
                const target = __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
                __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
                __classPrivateFieldGet$d(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, target._targetId);
                return;
            }
            if (__classPrivateFieldGet$d(this, _FirefoxTargetManager_targetFilterCallback, "f") &&
                !__classPrivateFieldGet$d(this, _FirefoxTargetManager_targetFilterCallback, "f").call(this, event.targetInfo)) {
                __classPrivateFieldGet$d(this, _FirefoxTargetManager_ignoredTargets, "f").add(event.targetInfo.targetId);
                __classPrivateFieldGet$d(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, event.targetInfo.targetId);
                return;
            }
            const target = __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
            this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, target._targetId);
        });
        _FirefoxTargetManager_onTargetDestroyed.set(this, (event) => {
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").delete(event.targetId);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, event.targetId);
            const target = __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(event.targetId);
            if (target) {
                this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
                __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").delete(event.targetId);
            }
        });
        _FirefoxTargetManager_onAttachedToTarget.set(this, async (parentSession, event) => {
            const targetInfo = event.targetInfo;
            const session = __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").session(event.sessionId);
            if (!session) {
                throw new Error(`Session ${event.sessionId} was not created.`);
            }
            const target = __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(targetInfo.targetId);
            assert(target, `Target ${targetInfo.targetId} is missing`);
            this.setupAttachmentListeners(session);
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").set(session.id(), __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(targetInfo.targetId));
            for (const hook of __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").get(parentSession) || []) {
                if (!(parentSession instanceof Connection$1)) {
                    assert(__classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").has(parentSession.id()));
                }
                await hook(target, parentSession instanceof Connection$1
                    ? null
                    : __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").get(parentSession.id()));
            }
        });
        __classPrivateFieldSet$c(this, _FirefoxTargetManager_connection, connection, "f");
        __classPrivateFieldSet$c(this, _FirefoxTargetManager_targetFilterCallback, targetFilterCallback, "f");
        __classPrivateFieldSet$c(this, _FirefoxTargetManager_targetFactory, targetFactory, "f");
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").on('Target.targetCreated', __classPrivateFieldGet$d(this, _FirefoxTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").on('Target.targetDestroyed', __classPrivateFieldGet$d(this, _FirefoxTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").on('sessiondetached', __classPrivateFieldGet$d(this, _FirefoxTargetManager_onSessionDetached, "f"));
        this.setupAttachmentListeners(__classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f"));
    }
    addTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").get(client) || [];
        interceptors.push(interceptor);
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").set(client, interceptors);
    }
    removeTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").get(client) || [];
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetInterceptors, "f").set(client, interceptors.filter(currentInterceptor => {
            return currentInterceptor !== interceptor;
        }));
    }
    setupAttachmentListeners(session) {
        const listener = (event) => {
            return __classPrivateFieldGet$d(this, _FirefoxTargetManager_onAttachedToTarget, "f").call(this, session, event);
        };
        assert(!__classPrivateFieldGet$d(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").has(session));
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").set(session, listener);
        session.on('Target.attachedToTarget', listener);
    }
    removeSessionListeners(session) {
        if (__classPrivateFieldGet$d(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").has(session)) {
            session.off('Target.attachedToTarget', __classPrivateFieldGet$d(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").get(session));
            __classPrivateFieldGet$d(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").delete(session);
        }
    }
    getAvailableTargets() {
        return __classPrivateFieldGet$d(this, _FirefoxTargetManager_availableTargetsByTargetId, "f");
    }
    dispose() {
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").off('Target.targetCreated', __classPrivateFieldGet$d(this, _FirefoxTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").off('Target.targetDestroyed', __classPrivateFieldGet$d(this, _FirefoxTargetManager_onTargetDestroyed, "f"));
    }
    async initialize() {
        await __classPrivateFieldGet$d(this, _FirefoxTargetManager_connection, "f").send('Target.setDiscoverTargets', { discover: true });
        __classPrivateFieldSet$c(this, _FirefoxTargetManager_targetsIdsForInit, new Set(__classPrivateFieldGet$d(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").keys()), "f");
        await __classPrivateFieldGet$d(this, _FirefoxTargetManager_initializePromise, "f");
    }
}
_FirefoxTargetManager_connection = new WeakMap(), _FirefoxTargetManager_discoveredTargetsByTargetId = new WeakMap(), _FirefoxTargetManager_availableTargetsByTargetId = new WeakMap(), _FirefoxTargetManager_availableTargetsBySessionId = new WeakMap(), _FirefoxTargetManager_ignoredTargets = new WeakMap(), _FirefoxTargetManager_targetFilterCallback = new WeakMap(), _FirefoxTargetManager_targetFactory = new WeakMap(), _FirefoxTargetManager_targetInterceptors = new WeakMap(), _FirefoxTargetManager_attachedToTargetListenersBySession = new WeakMap(), _FirefoxTargetManager_initializeCallback = new WeakMap(), _FirefoxTargetManager_initializePromise = new WeakMap(), _FirefoxTargetManager_targetsIdsForInit = new WeakMap(), _FirefoxTargetManager_onSessionDetached = new WeakMap(), _FirefoxTargetManager_onTargetCreated = new WeakMap(), _FirefoxTargetManager_onTargetDestroyed = new WeakMap(), _FirefoxTargetManager_onAttachedToTarget = new WeakMap(), _FirefoxTargetManager_instances = new WeakSet(), _FirefoxTargetManager_finishInitializationIfReady = function _FirefoxTargetManager_finishInitializationIfReady(targetId) {
    __classPrivateFieldGet$d(this, _FirefoxTargetManager_targetsIdsForInit, "f").delete(targetId);
    if (__classPrivateFieldGet$d(this, _FirefoxTargetManager_targetsIdsForInit, "f").size === 0) {
        __classPrivateFieldGet$d(this, _FirefoxTargetManager_initializeCallback, "f").call(this);
    }
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$b = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$c = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CDPBrowser_instances, _CDPBrowser_ignoreHTTPSErrors, _CDPBrowser_defaultViewport, _CDPBrowser_process, _CDPBrowser_connection, _CDPBrowser_closeCallback, _CDPBrowser_targetFilterCallback, _CDPBrowser_isPageTargetCallback, _CDPBrowser_defaultContext, _CDPBrowser_contexts, _CDPBrowser_screenshotTaskQueue, _CDPBrowser_targetManager, _CDPBrowser_emitDisconnected, _CDPBrowser_setIsPageTargetCallback, _CDPBrowser_createTarget, _CDPBrowser_onAttachedToTarget, _CDPBrowser_onDetachedFromTarget, _CDPBrowser_onTargetChanged, _CDPBrowser_onTargetDiscovered, _CDPBrowser_getVersion, _CDPBrowserContext_connection, _CDPBrowserContext_browser, _CDPBrowserContext_id;
/**
 * @internal
 */
class CDPBrowser extends Browser$1 {
    /**
     * @internal
     */
    constructor(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback) {
        super();
        _CDPBrowser_instances.add(this);
        _CDPBrowser_ignoreHTTPSErrors.set(this, void 0);
        _CDPBrowser_defaultViewport.set(this, void 0);
        _CDPBrowser_process.set(this, void 0);
        _CDPBrowser_connection.set(this, void 0);
        _CDPBrowser_closeCallback.set(this, void 0);
        _CDPBrowser_targetFilterCallback.set(this, void 0);
        _CDPBrowser_isPageTargetCallback.set(this, void 0);
        _CDPBrowser_defaultContext.set(this, void 0);
        _CDPBrowser_contexts.set(this, void 0);
        _CDPBrowser_screenshotTaskQueue.set(this, void 0);
        _CDPBrowser_targetManager.set(this, void 0);
        _CDPBrowser_emitDisconnected.set(this, () => {
            this.emit("disconnected" /* BrowserEmittedEvents.Disconnected */);
        });
        _CDPBrowser_createTarget.set(this, (targetInfo, session) => {
            var _a;
            const { browserContextId } = targetInfo;
            const context = browserContextId && __classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").has(browserContextId)
                ? __classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").get(browserContextId)
                : __classPrivateFieldGet$c(this, _CDPBrowser_defaultContext, "f");
            if (!context) {
                throw new Error('Missing browser context');
            }
            return new Target(targetInfo, session, context, __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f"), (isAutoAttachEmulated) => {
                return __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f")._createSession(targetInfo, isAutoAttachEmulated);
            }, __classPrivateFieldGet$c(this, _CDPBrowser_ignoreHTTPSErrors, "f"), (_a = __classPrivateFieldGet$c(this, _CDPBrowser_defaultViewport, "f")) !== null && _a !== void 0 ? _a : null, __classPrivateFieldGet$c(this, _CDPBrowser_screenshotTaskQueue, "f"), __classPrivateFieldGet$c(this, _CDPBrowser_isPageTargetCallback, "f"));
        });
        _CDPBrowser_onAttachedToTarget.set(this, async (target) => {
            if (await target._initializedPromise) {
                this.emit("targetcreated" /* BrowserEmittedEvents.TargetCreated */, target);
                target
                    .browserContext()
                    .emit("targetcreated" /* BrowserContextEmittedEvents.TargetCreated */, target);
            }
        });
        _CDPBrowser_onDetachedFromTarget.set(this, async (target) => {
            target._initializedCallback(false);
            target._closedCallback();
            if (await target._initializedPromise) {
                this.emit("targetdestroyed" /* BrowserEmittedEvents.TargetDestroyed */, target);
                target
                    .browserContext()
                    .emit("targetdestroyed" /* BrowserContextEmittedEvents.TargetDestroyed */, target);
            }
        });
        _CDPBrowser_onTargetChanged.set(this, ({ target, targetInfo, }) => {
            const previousURL = target.url();
            const wasInitialized = target._isInitialized;
            target._targetInfoChanged(targetInfo);
            if (wasInitialized && previousURL !== target.url()) {
                this.emit("targetchanged" /* BrowserEmittedEvents.TargetChanged */, target);
                target
                    .browserContext()
                    .emit("targetchanged" /* BrowserContextEmittedEvents.TargetChanged */, target);
            }
        });
        _CDPBrowser_onTargetDiscovered.set(this, (targetInfo) => {
            this.emit('targetdiscovered', targetInfo);
        });
        product = product || 'chrome';
        __classPrivateFieldSet$b(this, _CDPBrowser_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_defaultViewport, defaultViewport, "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_process, process, "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_screenshotTaskQueue, new TaskQueue(), "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_connection, connection, "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_closeCallback, closeCallback || function () { }, "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_targetFilterCallback, targetFilterCallback ||
            (() => {
                return true;
            }), "f");
        __classPrivateFieldGet$c(this, _CDPBrowser_instances, "m", _CDPBrowser_setIsPageTargetCallback).call(this, isPageTargetCallback);
        if (product === 'firefox') {
            __classPrivateFieldSet$b(this, _CDPBrowser_targetManager, new FirefoxTargetManager(connection, __classPrivateFieldGet$c(this, _CDPBrowser_createTarget, "f"), __classPrivateFieldGet$c(this, _CDPBrowser_targetFilterCallback, "f")), "f");
        }
        else {
            __classPrivateFieldSet$b(this, _CDPBrowser_targetManager, new ChromeTargetManager(connection, __classPrivateFieldGet$c(this, _CDPBrowser_createTarget, "f"), __classPrivateFieldGet$c(this, _CDPBrowser_targetFilterCallback, "f")), "f");
        }
        __classPrivateFieldSet$b(this, _CDPBrowser_defaultContext, new CDPBrowserContext(__classPrivateFieldGet$c(this, _CDPBrowser_connection, "f"), this), "f");
        __classPrivateFieldSet$b(this, _CDPBrowser_contexts, new Map(), "f");
        for (const contextId of contextIds) {
            __classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").set(contextId, new CDPBrowserContext(__classPrivateFieldGet$c(this, _CDPBrowser_connection, "f"), this, contextId));
        }
    }
    /**
     * @internal
     */
    static async _create(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback) {
        const browser = new CDPBrowser(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback);
        await browser._attach();
        return browser;
    }
    /**
     * @internal
     */
    get _targets() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").getAvailableTargets();
    }
    /**
     * @internal
     */
    async _attach() {
        __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").on(ConnectionEmittedEvents.Disconnected, __classPrivateFieldGet$c(this, _CDPBrowser_emitDisconnected, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").on("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, __classPrivateFieldGet$c(this, _CDPBrowser_onAttachedToTarget, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").on("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$c(this, _CDPBrowser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").on("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, __classPrivateFieldGet$c(this, _CDPBrowser_onTargetChanged, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").on("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, __classPrivateFieldGet$c(this, _CDPBrowser_onTargetDiscovered, "f"));
        await __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").initialize();
    }
    /**
     * @internal
     */
    _detach() {
        __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").off(ConnectionEmittedEvents.Disconnected, __classPrivateFieldGet$c(this, _CDPBrowser_emitDisconnected, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").off("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, __classPrivateFieldGet$c(this, _CDPBrowser_onAttachedToTarget, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").off("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$c(this, _CDPBrowser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").off("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, __classPrivateFieldGet$c(this, _CDPBrowser_onTargetChanged, "f"));
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").off("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, __classPrivateFieldGet$c(this, _CDPBrowser_onTargetDiscovered, "f"));
    }
    /**
     * The spawned browser process. Returns `null` if the browser instance was created with
     * {@link Puppeteer.connect}.
     */
    process() {
        var _a;
        return (_a = __classPrivateFieldGet$c(this, _CDPBrowser_process, "f")) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * @internal
     */
    _targetManager() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f");
    }
    /**
     * @internal
     */
    _getIsPageTargetCallback() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_isPageTargetCallback, "f");
    }
    /**
     * Creates a new incognito browser context. This won't share cookies/cache with other
     * browser contexts.
     *
     * @example
     *
     * ```ts
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   // Create a new incognito browser context.
     *   const context = await browser.createIncognitoBrowserContext();
     *   // Create a new page in a pristine context.
     *   const page = await context.newPage();
     *   // Do stuff
     *   await page.goto('https://example.com');
     * })();
     * ```
     */
    async createIncognitoBrowserContext(options = {}) {
        const { proxyServer, proxyBypassList } = options;
        const { browserContextId } = await __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").send('Target.createBrowserContext', {
            proxyServer,
            proxyBypassList: proxyBypassList && proxyBypassList.join(','),
        });
        const context = new CDPBrowserContext(__classPrivateFieldGet$c(this, _CDPBrowser_connection, "f"), this, browserContextId);
        __classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").set(browserContextId, context);
        return context;
    }
    /**
     * Returns an array of all open browser contexts. In a newly created browser, this will
     * return a single instance of {@link BrowserContext}.
     */
    browserContexts() {
        return [__classPrivateFieldGet$c(this, _CDPBrowser_defaultContext, "f"), ...Array.from(__classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").values())];
    }
    /**
     * Returns the default browser context. The default browser context cannot be closed.
     */
    defaultBrowserContext() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_defaultContext, "f");
    }
    /**
     * @internal
     */
    async _disposeContext(contextId) {
        if (!contextId) {
            return;
        }
        await __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").send('Target.disposeBrowserContext', {
            browserContextId: contextId,
        });
        __classPrivateFieldGet$c(this, _CDPBrowser_contexts, "f").delete(contextId);
    }
    /**
     * The browser websocket endpoint which can be used as an argument to
     * {@link Puppeteer.connect}.
     *
     * @returns The Browser websocket url.
     *
     * @remarks
     *
     * The format is `ws://${host}:${port}/devtools/browser/<id>`.
     *
     * You can find the `webSocketDebuggerUrl` from `http://${host}:${port}/json/version`.
     * Learn more about the
     * {@link https://chromedevtools.github.io/devtools-protocol | devtools protocol} and
     * the {@link
     * https://chromedevtools.github.io/devtools-protocol/#how-do-i-access-the-browser-target
     * | browser endpoint}.
     */
    wsEndpoint() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").url();
    }
    /**
     * Promise which resolves to a new {@link Page} object. The Page is created in
     * a default browser context.
     */
    async newPage() {
        return __classPrivateFieldGet$c(this, _CDPBrowser_defaultContext, "f").newPage();
    }
    /**
     * @internal
     */
    async _createPageInContext(contextId) {
        const { targetId } = await __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").send('Target.createTarget', {
            url: 'about:blank',
            browserContextId: contextId || undefined,
        });
        const target = __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").getAvailableTargets().get(targetId);
        if (!target) {
            throw new Error(`Missing target for page (id = ${targetId})`);
        }
        const initialized = await target._initializedPromise;
        if (!initialized) {
            throw new Error(`Failed to create target for page (id = ${targetId})`);
        }
        const page = await target.page();
        if (!page) {
            throw new Error(`Failed to create a page for context (id = ${contextId})`);
        }
        return page;
    }
    /**
     * All active targets inside the Browser. In case of multiple browser contexts, returns
     * an array with all the targets in all browser contexts.
     */
    targets() {
        return Array.from(__classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").getAvailableTargets().values()).filter(target => {
            return target._isInitialized;
        });
    }
    /**
     * The target associated with the browser.
     */
    target() {
        const browserTarget = this.targets().find(target => {
            return target.type() === 'browser';
        });
        if (!browserTarget) {
            throw new Error('Browser target is not found');
        }
        return browserTarget;
    }
    /**
     * Searches for a target in all browser contexts.
     *
     * @param predicate - A function to be run for every target.
     * @returns The first target found that matches the `predicate` function.
     *
     * @example
     *
     * An example of finding a target for a page opened via `window.open`:
     *
     * ```ts
     * await page.evaluate(() => window.open('https://www.example.com/'));
     * const newWindowTarget = await browser.waitForTarget(
     *   target => target.url() === 'https://www.example.com/'
     * );
     * ```
     */
    async waitForTarget(predicate, options = {}) {
        const { timeout = 30000 } = options;
        let resolve;
        let isResolved = false;
        const targetPromise = new Promise(x => {
            return (resolve = x);
        });
        this.on("targetcreated" /* BrowserEmittedEvents.TargetCreated */, check);
        this.on("targetchanged" /* BrowserEmittedEvents.TargetChanged */, check);
        try {
            this.targets().forEach(check);
            if (!timeout) {
                return await targetPromise;
            }
            return await waitWithTimeout(targetPromise, 'target', timeout);
        }
        finally {
            this.off("targetcreated" /* BrowserEmittedEvents.TargetCreated */, check);
            this.off("targetchanged" /* BrowserEmittedEvents.TargetChanged */, check);
        }
        async function check(target) {
            if ((await predicate(target)) && !isResolved) {
                isResolved = true;
                resolve(target);
            }
        }
    }
    /**
     * An array of all open pages inside the Browser.
     *
     * @remarks
     *
     * In case of multiple browser contexts, returns an array with all the pages in all
     * browser contexts. Non-visible pages, such as `"background_page"`, will not be listed
     * here. You can find them using {@link Target.page}.
     */
    async pages() {
        const contextPages = await Promise.all(this.browserContexts().map(context => {
            return context.pages();
        }));
        // Flatten array.
        return contextPages.reduce((acc, x) => {
            return acc.concat(x);
        }, []);
    }
    /**
     * A string representing the browser name and version.
     *
     * @remarks
     *
     * For headless Chromium, this is similar to `HeadlessChrome/61.0.3153.0`. For
     * non-headless, this is similar to `Chrome/61.0.3153.0`.
     *
     * The format of browser.version() might change with future releases of Chromium.
     */
    async version() {
        const version = await __classPrivateFieldGet$c(this, _CDPBrowser_instances, "m", _CDPBrowser_getVersion).call(this);
        return version.product;
    }
    /**
     * The browser's original user agent. Pages can override the browser user agent with
     * {@link Page.setUserAgent}.
     */
    async userAgent() {
        const version = await __classPrivateFieldGet$c(this, _CDPBrowser_instances, "m", _CDPBrowser_getVersion).call(this);
        return version.userAgent;
    }
    /**
     * Closes Chromium and all of its pages (if any were opened). The
     * {@link CDPBrowser} object itself is considered to be disposed and cannot be
     * used anymore.
     */
    async close() {
        await __classPrivateFieldGet$c(this, _CDPBrowser_closeCallback, "f").call(null);
        this.disconnect();
    }
    /**
     * Disconnects Puppeteer from the browser, but leaves the Chromium process running.
     * After calling `disconnect`, the {@link CDPBrowser} object is considered disposed and
     * cannot be used anymore.
     */
    disconnect() {
        __classPrivateFieldGet$c(this, _CDPBrowser_targetManager, "f").dispose();
        __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").dispose();
    }
    /**
     * Indicates that the browser is connected.
     */
    isConnected() {
        return !__classPrivateFieldGet$c(this, _CDPBrowser_connection, "f")._closed;
    }
}
_CDPBrowser_ignoreHTTPSErrors = new WeakMap(), _CDPBrowser_defaultViewport = new WeakMap(), _CDPBrowser_process = new WeakMap(), _CDPBrowser_connection = new WeakMap(), _CDPBrowser_closeCallback = new WeakMap(), _CDPBrowser_targetFilterCallback = new WeakMap(), _CDPBrowser_isPageTargetCallback = new WeakMap(), _CDPBrowser_defaultContext = new WeakMap(), _CDPBrowser_contexts = new WeakMap(), _CDPBrowser_screenshotTaskQueue = new WeakMap(), _CDPBrowser_targetManager = new WeakMap(), _CDPBrowser_emitDisconnected = new WeakMap(), _CDPBrowser_createTarget = new WeakMap(), _CDPBrowser_onAttachedToTarget = new WeakMap(), _CDPBrowser_onDetachedFromTarget = new WeakMap(), _CDPBrowser_onTargetChanged = new WeakMap(), _CDPBrowser_onTargetDiscovered = new WeakMap(), _CDPBrowser_instances = new WeakSet(), _CDPBrowser_setIsPageTargetCallback = function _CDPBrowser_setIsPageTargetCallback(isPageTargetCallback) {
    __classPrivateFieldSet$b(this, _CDPBrowser_isPageTargetCallback, isPageTargetCallback ||
        ((target) => {
            return (target.type === 'page' ||
                target.type === 'background_page' ||
                target.type === 'webview');
        }), "f");
}, _CDPBrowser_getVersion = function _CDPBrowser_getVersion() {
    return __classPrivateFieldGet$c(this, _CDPBrowser_connection, "f").send('Browser.getVersion');
};
/**
 * @internal
 */
class CDPBrowserContext extends BrowserContext$1 {
    /**
     * @internal
     */
    constructor(connection, browser, contextId) {
        super();
        _CDPBrowserContext_connection.set(this, void 0);
        _CDPBrowserContext_browser.set(this, void 0);
        _CDPBrowserContext_id.set(this, void 0);
        __classPrivateFieldSet$b(this, _CDPBrowserContext_connection, connection, "f");
        __classPrivateFieldSet$b(this, _CDPBrowserContext_browser, browser, "f");
        __classPrivateFieldSet$b(this, _CDPBrowserContext_id, contextId, "f");
    }
    get id() {
        return __classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f");
    }
    /**
     * An array of all active targets inside the browser context.
     */
    targets() {
        return __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f").targets().filter(target => {
            return target.browserContext() === this;
        });
    }
    /**
     * This searches for a target in this specific browser context.
     *
     * @example
     * An example of finding a target for a page opened via `window.open`:
     *
     * ```ts
     * await page.evaluate(() => window.open('https://www.example.com/'));
     * const newWindowTarget = await browserContext.waitForTarget(
     *   target => target.url() === 'https://www.example.com/'
     * );
     * ```
     *
     * @param predicate - A function to be run for every target
     * @param options - An object of options. Accepts a timout,
     * which is the maximum wait time in milliseconds.
     * Pass `0` to disable the timeout. Defaults to 30 seconds.
     * @returns Promise which resolves to the first target found
     * that matches the `predicate` function.
     */
    waitForTarget(predicate, options = {}) {
        return __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f").waitForTarget(target => {
            return target.browserContext() === this && predicate(target);
        }, options);
    }
    /**
     * An array of all pages inside the browser context.
     *
     * @returns Promise which resolves to an array of all open pages.
     * Non visible pages, such as `"background_page"`, will not be listed here.
     * You can find them using {@link Target.page | the target page}.
     */
    async pages() {
        const pages = await Promise.all(this.targets()
            .filter(target => {
            var _a;
            return (target.type() === 'page' ||
                (target.type() === 'other' &&
                    ((_a = __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f")._getIsPageTargetCallback()) === null || _a === void 0 ? void 0 : _a(target._getTargetInfo()))));
        })
            .map(target => {
            return target.page();
        }));
        return pages.filter((page) => {
            return !!page;
        });
    }
    /**
     * Returns whether BrowserContext is incognito.
     * The default browser context is the only non-incognito browser context.
     *
     * @remarks
     * The default browser context cannot be closed.
     */
    isIncognito() {
        return !!__classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f");
    }
    /**
     * @example
     *
     * ```ts
     * const context = browser.defaultBrowserContext();
     * await context.overridePermissions('https://html5demos.com', [
     *   'geolocation',
     * ]);
     * ```
     *
     * @param origin - The origin to grant permissions to, e.g. "https://example.com".
     * @param permissions - An array of permissions to grant.
     * All permissions that are not listed here will be automatically denied.
     */
    async overridePermissions(origin, permissions) {
        const protocolPermissions = permissions.map(permission => {
            const protocolPermission = WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
            if (!protocolPermission) {
                throw new Error('Unknown permission: ' + permission);
            }
            return protocolPermission;
        });
        await __classPrivateFieldGet$c(this, _CDPBrowserContext_connection, "f").send('Browser.grantPermissions', {
            origin,
            browserContextId: __classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f") || undefined,
            permissions: protocolPermissions,
        });
    }
    /**
     * Clears all permission overrides for the browser context.
     *
     * @example
     *
     * ```ts
     * const context = browser.defaultBrowserContext();
     * context.overridePermissions('https://example.com', ['clipboard-read']);
     * // do stuff ..
     * context.clearPermissionOverrides();
     * ```
     */
    async clearPermissionOverrides() {
        await __classPrivateFieldGet$c(this, _CDPBrowserContext_connection, "f").send('Browser.resetPermissions', {
            browserContextId: __classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f") || undefined,
        });
    }
    /**
     * Creates a new page in the browser context.
     */
    newPage() {
        return __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f")._createPageInContext(__classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f"));
    }
    /**
     * The browser this browser context belongs to.
     */
    browser() {
        return __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f");
    }
    /**
     * Closes the browser context. All the targets that belong to the browser context
     * will be closed.
     *
     * @remarks
     * Only incognito browser contexts can be closed.
     */
    async close() {
        assert(__classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f"), 'Non-incognito profiles cannot be closed!');
        await __classPrivateFieldGet$c(this, _CDPBrowserContext_browser, "f")._disposeContext(__classPrivateFieldGet$c(this, _CDPBrowserContext_id, "f"));
    }
}
_CDPBrowserContext_connection = new WeakMap(), _CDPBrowserContext_browser = new WeakMap(), _CDPBrowserContext_id = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Gets the global version if we're in the browser, else loads the node-fetch module.
 *
 * @internal
 */
const getFetch = async () => {
    return globalThis.fetch || (await import('cross-fetch')).fetch;
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const getWebSocketTransportClass = async () => {
    return isNode
        ? (await Promise.resolve().then(function () { return NodeWebSocketTransport$1; })).NodeWebSocketTransport
        : (await Promise.resolve().then(function () { return BrowserWebSocketTransport$1; }))
            .BrowserWebSocketTransport;
};
/**
 * Users should never call this directly; it's called when calling
 * `puppeteer.connect`.
 *
 * @internal
 */
async function _connectToCDPBrowser(options) {
    const { browserWSEndpoint, browserURL, ignoreHTTPSErrors = false, defaultViewport = { width: 800, height: 600 }, transport, slowMo = 0, targetFilter, _isPageTarget: isPageTarget, } = options;
    assert(Number(!!browserWSEndpoint) + Number(!!browserURL) + Number(!!transport) ===
        1, 'Exactly one of browserWSEndpoint, browserURL or transport must be passed to puppeteer.connect');
    let connection;
    if (transport) {
        connection = new Connection$1('', transport, slowMo);
    }
    else if (browserWSEndpoint) {
        const WebSocketClass = await getWebSocketTransportClass();
        const connectionTransport = await WebSocketClass.create(browserWSEndpoint);
        connection = new Connection$1(browserWSEndpoint, connectionTransport, slowMo);
    }
    else if (browserURL) {
        const connectionURL = await getWSEndpoint(browserURL);
        const WebSocketClass = await getWebSocketTransportClass();
        const connectionTransport = await WebSocketClass.create(connectionURL);
        connection = new Connection$1(connectionURL, connectionTransport, slowMo);
    }
    const version = await connection.send('Browser.getVersion');
    const product = version.product.toLowerCase().includes('firefox')
        ? 'firefox'
        : 'chrome';
    const { browserContextIds } = await connection.send('Target.getBrowserContexts');
    const browser = await CDPBrowser._create(product || 'chrome', connection, browserContextIds, ignoreHTTPSErrors, defaultViewport, undefined, () => {
        return connection.send('Browser.close').catch(debugError);
    }, targetFilter, isPageTarget);
    return browser;
}
async function getWSEndpoint(browserURL) {
    const endpointURL = new URL('/json/version', browserURL);
    const fetch = await getFetch();
    try {
        const result = await fetch(endpointURL.toString(), {
            method: 'GET',
        });
        if (!result.ok) {
            throw new Error(`HTTP ${result.statusText}`);
        }
        const data = await result.json();
        return data.webSocketDebuggerUrl;
    }
    catch (error) {
        if (isErrorLike(error)) {
            error.message =
                `Failed to fetch browser webSocket URL from ${endpointURL}: ` +
                    error.message;
        }
        throw error;
    }
}

var __classPrivateFieldSet$a = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$b = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserWebSocketTransport_ws;
/**
 * @internal
 */
class BrowserWebSocketTransport {
    constructor(ws) {
        _BrowserWebSocketTransport_ws.set(this, void 0);
        __classPrivateFieldSet$a(this, _BrowserWebSocketTransport_ws, ws, "f");
        __classPrivateFieldGet$b(this, _BrowserWebSocketTransport_ws, "f").addEventListener('message', event => {
            if (this.onmessage) {
                this.onmessage.call(null, event.data);
            }
        });
        __classPrivateFieldGet$b(this, _BrowserWebSocketTransport_ws, "f").addEventListener('close', () => {
            if (this.onclose) {
                this.onclose.call(null);
            }
        });
        // Silently ignore all errors - we don't know what to do with them.
        __classPrivateFieldGet$b(this, _BrowserWebSocketTransport_ws, "f").addEventListener('error', () => { });
    }
    static create(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            ws.addEventListener('open', () => {
                return resolve(new BrowserWebSocketTransport(ws));
            });
            ws.addEventListener('error', reject);
        });
    }
    send(message) {
        __classPrivateFieldGet$b(this, _BrowserWebSocketTransport_ws, "f").send(message);
    }
    close() {
        __classPrivateFieldGet$b(this, _BrowserWebSocketTransport_ws, "f").close();
    }
}
_BrowserWebSocketTransport_ws = new WeakMap();

var BrowserWebSocketTransport$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BrowserWebSocketTransport: BrowserWebSocketTransport
});

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const knownDevices = [
    {
        name: 'Blackberry PlayBook',
        userAgent: 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
        viewport: {
            width: 600,
            height: 1024,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Blackberry PlayBook landscape',
        userAgent: 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
        viewport: {
            width: 1024,
            height: 600,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'BlackBerry Z30',
        userAgent: 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'BlackBerry Z30 landscape',
        userAgent: 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Note 3',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Note 3 landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Note II',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.1; en-us; GT-N7100 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Note II landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.1; en-us; GT-N7100 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S III',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S III landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S5',
        userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S8',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G950U Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 740,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S8 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G950U Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
        viewport: {
            width: 740,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S9+',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36',
        viewport: {
            width: 320,
            height: 658,
            deviceScaleFactor: 4.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S9+ landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36',
        viewport: {
            width: 658,
            height: 320,
            deviceScaleFactor: 4.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Tab S4',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Safari/537.36',
        viewport: {
            width: 712,
            height: 1138,
            deviceScaleFactor: 2.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Tab S4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Safari/537.36',
        viewport: {
            width: 1138,
            height: 712,
            deviceScaleFactor: 2.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad (gen 6)',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad (gen 6) landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad (gen 7)',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 810,
            height: 1080,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad (gen 7) landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1080,
            height: 810,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Mini',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Mini landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Pro',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 1366,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Pro landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1366,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Pro 11',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 834,
            height: 1194,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Pro 11 landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1194,
            height: 834,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 4',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53',
        viewport: {
            width: 320,
            height: 480,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 4 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53',
        viewport: {
            width: 480,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 5',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 320,
            height: 568,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 5 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 568,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 6',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 6 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 6 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 6 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 7',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 7 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 7 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 7 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 8',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 8 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 8 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 8 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone SE',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 320,
            height: 568,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone SE landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 568,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone X',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone X landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone XR',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone XR landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 896,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 828,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 828,
            height: 414,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 896,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 428,
            height: 926,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 926,
            height: 428,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Mini',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Mini landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 428,
            height: 926,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 926,
            height: 428,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Mini',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Mini landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'JioPhone 2',
        userAgent: 'Mozilla/5.0 (Mobile; LYF/F300B/LYF-F300B-001-01-15-130718-i;Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5',
        viewport: {
            width: 240,
            height: 320,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'JioPhone 2 landscape',
        userAgent: 'Mozilla/5.0 (Mobile; LYF/F300B/LYF-F300B-001-01-15-130718-i;Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5',
        viewport: {
            width: 320,
            height: 240,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Kindle Fire HDX',
        userAgent: 'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true',
        viewport: {
            width: 800,
            height: 1280,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Kindle Fire HDX landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true',
        viewport: {
            width: 1280,
            height: 800,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'LG Optimus L70',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 384,
            height: 640,
            deviceScaleFactor: 1.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'LG Optimus L70 landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 384,
            deviceScaleFactor: 1.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Microsoft Lumia 550',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Microsoft Lumia 950',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 4,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Microsoft Lumia 950 landscape',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 4,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 10',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 800,
            height: 1280,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 10 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 1280,
            height: 800,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 4',
        userAgent: 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 384,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 384,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 5',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 5X',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 5X landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 6',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 6 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 6P',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 6P landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 7',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 600,
            height: 960,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 7 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 960,
            height: 600,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nokia Lumia 520',
        userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)',
        viewport: {
            width: 320,
            height: 533,
            deviceScaleFactor: 1.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nokia Lumia 520 landscape',
        userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)',
        viewport: {
            width: 533,
            height: 320,
            deviceScaleFactor: 1.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nokia N9',
        userAgent: 'Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13',
        viewport: {
            width: 480,
            height: 854,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nokia N9 landscape',
        userAgent: 'Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13',
        viewport: {
            width: 854,
            height: 480,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 2',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 411,
            height: 731,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 2 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 731,
            height: 411,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 2 XL',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 411,
            height: 823,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 2 XL landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 823,
            height: 411,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 3',
        userAgent: 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.181105.017.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36',
        viewport: {
            width: 393,
            height: 786,
            deviceScaleFactor: 2.75,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 3 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.181105.017.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36',
        viewport: {
            width: 786,
            height: 393,
            deviceScaleFactor: 2.75,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 4',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
        viewport: {
            width: 353,
            height: 745,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
        viewport: {
            width: 745,
            height: 353,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 4a (5G)',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 4a (5G)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 353,
            height: 745,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 4a (5G) landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 4a (5G)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 745,
            height: 353,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 5',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 393,
            height: 851,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 851,
            height: 393,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Moto G4',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Moto G4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
];
const knownDevicesByName = {};
for (const device of knownDevices) {
    knownDevicesByName[device.name] = device;
}
/**
 * A list of devices to be used with {@link Page.emulate}.
 *
 * @example
 *
 * ```ts
 * import {KnownDevices} from 'puppeteer';
 * const iPhone = KnownDevices['iPhone 6'];
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.emulate(iPhone);
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * @public
 */
const KnownDevices = Object.freeze(knownDevicesByName);
/**
 * @deprecated Import {@link KnownDevices}
 *
 * @public
 */
const devices = KnownDevices;

/**
 * @internal
 */
const packageVersion = '19.3.0';

var __classPrivateFieldSet$9 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$a = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodeWebSocketTransport_ws;
/**
 * @internal
 */
class NodeWebSocketTransport {
    constructor(ws) {
        _NodeWebSocketTransport_ws.set(this, void 0);
        __classPrivateFieldSet$9(this, _NodeWebSocketTransport_ws, ws, "f");
        __classPrivateFieldGet$a(this, _NodeWebSocketTransport_ws, "f").addEventListener('message', event => {
            if (this.onmessage) {
                this.onmessage.call(null, event.data);
            }
        });
        __classPrivateFieldGet$a(this, _NodeWebSocketTransport_ws, "f").addEventListener('close', () => {
            if (this.onclose) {
                this.onclose.call(null);
            }
        });
        // Silently ignore all errors - we don't know what to do with them.
        __classPrivateFieldGet$a(this, _NodeWebSocketTransport_ws, "f").addEventListener('error', () => { });
    }
    static create(url) {
        return new Promise((resolve, reject) => {
            const ws = new NodeWebSocket(url, [], {
                followRedirects: true,
                perMessageDeflate: false,
                maxPayload: 256 * 1024 * 1024,
                headers: {
                    'User-Agent': `Puppeteer ${packageVersion}`,
                },
            });
            ws.addEventListener('open', () => {
                return resolve(new NodeWebSocketTransport(ws));
            });
            ws.addEventListener('error', reject);
        });
    }
    send(message) {
        __classPrivateFieldGet$a(this, _NodeWebSocketTransport_ws, "f").send(message);
    }
    close() {
        __classPrivateFieldGet$a(this, _NodeWebSocketTransport_ws, "f").close();
    }
}
_NodeWebSocketTransport_ws = new WeakMap();

var NodeWebSocketTransport$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    NodeWebSocketTransport: NodeWebSocketTransport
});

/**
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A list of network conditions to be used with
 * {@link Page.emulateNetworkConditions}.
 *
 * @example
 *
 * ```ts
 * import {PredefinedNetworkConditions} from 'puppeteer';
 * const slow3G = PredefinedNetworkConditions['Slow 3G'];
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.emulateNetworkConditions(slow3G);
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * @public
 */
const PredefinedNetworkConditions = Object.freeze({
    'Slow 3G': {
        download: ((500 * 1000) / 8) * 0.8,
        upload: ((500 * 1000) / 8) * 0.8,
        latency: 400 * 5,
    },
    'Fast 3G': {
        download: ((1.6 * 1000 * 1000) / 8) * 0.9,
        upload: ((750 * 1000) / 8) * 0.9,
        latency: 150 * 3.75,
    },
});
/**
 * @deprecated Import {@link PredefinedNetworkConditions}.
 *
 * @public
 */
const networkConditions = PredefinedNetworkConditions;

/**
 * The main Puppeteer class.
 *
 * IMPORTANT: if you are using Puppeteer in a Node environment, you will get an
 * instance of {@link PuppeteerNode} when you import or require `puppeteer`.
 * That class extends `Puppeteer`, so has all the methods documented below as
 * well as all that are defined on {@link PuppeteerNode}.
 * @public
 */
class Puppeteer {
    /**
     * @internal
     */
    constructor(settings) {
        /**
         * @internal
         */
        this._changedProduct = false;
        this._isPuppeteerCore = settings.isPuppeteerCore;
        this.connect = this.connect.bind(this);
    }
    /**
     * Registers a {@link CustomQueryHandler | custom query handler}.
     *
     * @remarks
     * After registration, the handler can be used everywhere where a selector is
     * expected by prepending the selection string with `<name>/`. The name is only
     * allowed to consist of lower- and upper case latin letters.
     *
     * @example
     *
     * ```
     * puppeteer.registerCustomQueryHandler('text', { … });
     * const aHandle = await page.$('text/…');
     * ```
     *
     * @param name - The name that the custom query handler will be registered
     * under.
     * @param queryHandler - The {@link CustomQueryHandler | custom query handler}
     * to register.
     *
     * @public
     */
    static registerCustomQueryHandler(name, queryHandler) {
        return registerCustomQueryHandler(name, queryHandler);
    }
    /**
     * Unregisters a custom query handler for a given name.
     */
    static unregisterCustomQueryHandler(name) {
        return unregisterCustomQueryHandler(name);
    }
    /**
     * Gets the names of all custom query handlers.
     */
    static customQueryHandlerNames() {
        return customQueryHandlerNames();
    }
    /**
     * Unregisters all custom query handlers.
     */
    static clearCustomQueryHandlers() {
        return clearCustomQueryHandlers();
    }
    /**
     * This method attaches Puppeteer to an existing browser instance.
     *
     * @remarks
     *
     * @param options - Set of configurable options to set on the browser.
     * @returns Promise which resolves to browser instance.
     */
    connect(options) {
        return _connectToCDPBrowser(options);
    }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$8 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$9 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserFetcher_instances, _BrowserFetcher_product, _BrowserFetcher_downloadPath, _BrowserFetcher_downloadHost, _BrowserFetcher_platform, _BrowserFetcher_getFolderPath;
const debugFetcher = debug('puppeteer:fetcher');
const downloadURLs = {
    chrome: {
        linux: '%s/chromium-browser-snapshots/Linux_x64/%d/%s.zip',
        mac: '%s/chromium-browser-snapshots/Mac/%d/%s.zip',
        mac_arm: '%s/chromium-browser-snapshots/Mac_Arm/%d/%s.zip',
        win32: '%s/chromium-browser-snapshots/Win/%d/%s.zip',
        win64: '%s/chromium-browser-snapshots/Win_x64/%d/%s.zip',
    },
    firefox: {
        linux: '%s/firefox-%s.en-US.%s-x86_64.tar.bz2',
        mac: '%s/firefox-%s.en-US.%s.dmg',
        win32: '%s/firefox-%s.en-US.%s.zip',
        win64: '%s/firefox-%s.en-US.%s.zip',
    },
};
const browserConfig = {
    chrome: {
        host: 'https://storage.googleapis.com',
    },
    firefox: {
        host: 'https://archive.mozilla.org/pub/firefox/nightly/latest-mozilla-central',
    },
};
const exec = promisify(exec$1);
function archiveName(product, platform, revision) {
    switch (product) {
        case 'chrome':
            switch (platform) {
                case 'linux':
                    return 'chrome-linux';
                case 'mac_arm':
                case 'mac':
                    return 'chrome-mac';
                case 'win32':
                case 'win64':
                    // Windows archive name changed at r591479.
                    return parseInt(revision, 10) > 591479
                        ? 'chrome-win'
                        : 'chrome-win32';
            }
        case 'firefox':
            return platform;
    }
}
function downloadURL(product, platform, host, revision) {
    const url = util.format(downloadURLs[product][platform], host, revision, archiveName(product, platform, revision));
    return url;
}
function handleArm64() {
    let exists = existsSync('/usr/bin/chromium-browser');
    if (exists) {
        return;
    }
    exists = existsSync('/usr/bin/chromium');
    if (exists) {
        return;
    }
    console.error('The chromium binary is not available for arm64.' +
        '\nIf you are on Ubuntu, you can install with: ' +
        '\n\n sudo apt install chromium\n' +
        '\n\n sudo apt install chromium-browser\n');
    throw new Error();
}
/**
 * BrowserFetcher can download and manage different versions of Chromium and
 * Firefox.
 *
 * @remarks
 * BrowserFetcher operates on revision strings that specify a precise version of
 * Chromium, e.g. `"533271"`. Revision strings can be obtained from
 * {@link http://omahaproxy.appspot.com/ | omahaproxy.appspot.com}. For Firefox,
 * BrowserFetcher downloads Firefox Nightly and operates on version numbers such
 * as `"75"`.
 *
 * @remarks
 * The default constructed fetcher will always be for Chromium unless otherwise
 * specified.
 *
 * @remarks
 * BrowserFetcher is not designed to work concurrently with other instances of
 * BrowserFetcher that share the same downloads directory.
 *
 * @example
 * An example of using BrowserFetcher to download a specific version of Chromium
 * and running Puppeteer against it:
 *
 * ```ts
 * const browserFetcher = new BrowserFetcher({path: 'path/to/download/folder'});
 * const revisionInfo = await browserFetcher.download('533271');
 * const browser = await puppeteer.launch({
 *   executablePath: revisionInfo.executablePath,
 * });
 * ```
 *
 * @public
 */
class BrowserFetcher {
    /**
     * Constructs a browser fetcher for the given options.
     */
    constructor(options) {
        var _a, _b;
        _BrowserFetcher_instances.add(this);
        _BrowserFetcher_product.set(this, void 0);
        _BrowserFetcher_downloadPath.set(this, void 0);
        _BrowserFetcher_downloadHost.set(this, void 0);
        _BrowserFetcher_platform.set(this, void 0);
        __classPrivateFieldSet$8(this, _BrowserFetcher_product, (_a = options.product) !== null && _a !== void 0 ? _a : 'chrome', "f");
        __classPrivateFieldSet$8(this, _BrowserFetcher_downloadPath, options.path, "f");
        __classPrivateFieldSet$8(this, _BrowserFetcher_downloadHost, (_b = options.host) !== null && _b !== void 0 ? _b : browserConfig[__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f")].host, "f");
        if (options.platform) {
            __classPrivateFieldSet$8(this, _BrowserFetcher_platform, options.platform, "f");
        }
        else {
            const platform = os.platform();
            switch (platform) {
                case 'darwin':
                    switch (__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f")) {
                        case 'chrome':
                            __classPrivateFieldSet$8(this, _BrowserFetcher_platform, os.arch() === 'arm64' && options.useMacOSARMBinary
                                ? 'mac_arm'
                                : 'mac', "f");
                            break;
                        case 'firefox':
                            __classPrivateFieldSet$8(this, _BrowserFetcher_platform, 'mac', "f");
                            break;
                    }
                    break;
                case 'linux':
                    __classPrivateFieldSet$8(this, _BrowserFetcher_platform, 'linux', "f");
                    break;
                case 'win32':
                    __classPrivateFieldSet$8(this, _BrowserFetcher_platform, os.arch() === 'x64' ||
                        // Windows 11 for ARM supports x64 emulation
                        (os.arch() === 'arm64' && isWindows11(os.release()))
                        ? 'win64'
                        : 'win32', "f");
                    return;
                default:
                    assert(false, 'Unsupported platform: ' + platform);
            }
        }
        assert(downloadURLs[__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f")][__classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f")], 'Unsupported platform: ' + __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"));
    }
    /**
     * @returns Returns the current `Platform`, which is one of `mac`, `linux`,
     * `win32` or `win64`.
     */
    platform() {
        return __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f");
    }
    /**
     * @returns Returns the current `Product`, which is one of `chrome` or
     * `firefox`.
     */
    product() {
        return __classPrivateFieldGet$9(this, _BrowserFetcher_product, "f");
    }
    /**
     * @returns The download host being used.
     */
    host() {
        return __classPrivateFieldGet$9(this, _BrowserFetcher_downloadHost, "f");
    }
    /**
     * Initiates a HEAD request to check if the revision is available.
     * @remarks
     * This method is affected by the current `product`.
     * @param revision - The revision to check availability for.
     * @returns A promise that resolves to `true` if the revision could be downloaded
     * from the host.
     */
    canDownload(revision) {
        const url = downloadURL(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_downloadHost, "f"), revision);
        return new Promise(resolve => {
            const request = httpRequest(url, 'HEAD', response => {
                resolve(response.statusCode === 200);
            }, false);
            request.on('error', error => {
                console.error(error);
                resolve(false);
            });
        });
    }
    /**
     * Initiates a GET request to download the revision from the host.
     * @remarks
     * This method is affected by the current `product`.
     * @param revision - The revision to download.
     * @param progressCallback - A function that will be called with two arguments:
     * How many bytes have been downloaded and the total number of bytes of the download.
     * @returns A promise with revision information when the revision is downloaded
     * and extracted.
     */
    async download(revision, progressCallback = () => { }) {
        const url = downloadURL(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_downloadHost, "f"), revision);
        const fileName = url.split('/').pop();
        assert(fileName, `A malformed download URL was found: ${url}.`);
        const archivePath = path.join(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"), fileName);
        const outputPath = __classPrivateFieldGet$9(this, _BrowserFetcher_instances, "m", _BrowserFetcher_getFolderPath).call(this, revision);
        if (existsSync(outputPath)) {
            return this.revisionInfo(revision);
        }
        if (!existsSync(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"))) {
            await mkdir(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"), { recursive: true });
        }
        // Use system Chromium builds on Linux ARM devices
        if (os.platform() === 'linux' && os.arch() === 'arm64') {
            handleArm64();
            return;
        }
        try {
            await _downloadFile(url, archivePath, progressCallback);
            await install(archivePath, outputPath);
        }
        finally {
            if (existsSync(archivePath)) {
                await unlink(archivePath);
            }
        }
        const revisionInfo = this.revisionInfo(revision);
        if (revisionInfo) {
            await chmod(revisionInfo.executablePath, 0o755);
        }
        return revisionInfo;
    }
    /**
     * @remarks
     * This method is affected by the current `product`.
     * @returns A list of all revision strings (for the current `product`)
     * available locally on disk.
     */
    localRevisions() {
        if (!existsSync(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"))) {
            return [];
        }
        const fileNames = readdirSync(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"));
        return fileNames
            .map(fileName => {
            return parseFolderPath(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), fileName);
        })
            .filter((entry) => {
            var _a;
            return (_a = (entry && entry.platform === __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"))) !== null && _a !== void 0 ? _a : false;
        })
            .map(entry => {
            return entry.revision;
        });
    }
    /**
     * @remarks
     * This method is affected by the current `product`.
     * @param revision - A revision to remove for the current `product`.
     * @returns A promise that resolves when the revision has been removes or
     * throws if the revision has not been downloaded.
     */
    async remove(revision) {
        const folderPath = __classPrivateFieldGet$9(this, _BrowserFetcher_instances, "m", _BrowserFetcher_getFolderPath).call(this, revision);
        assert(existsSync(folderPath), `Failed to remove: revision ${revision} is not downloaded`);
        await new Promise(fulfill => {
            return removeFolder(folderPath, fulfill);
        });
    }
    /**
     * @param revision - The revision to get info for.
     * @returns The revision info for the given revision.
     */
    revisionInfo(revision) {
        const folderPath = __classPrivateFieldGet$9(this, _BrowserFetcher_instances, "m", _BrowserFetcher_getFolderPath).call(this, revision);
        let executablePath = '';
        switch (__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f")) {
            case 'chrome':
                switch (__classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f")) {
                    case 'mac':
                    case 'mac_arm':
                        executablePath = path.join(folderPath, archiveName(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), revision), 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
                        break;
                    case 'linux':
                        executablePath = path.join(folderPath, archiveName(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), revision), 'chrome');
                        break;
                    case 'win32':
                    case 'win64':
                        executablePath = path.join(folderPath, archiveName(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), revision), 'chrome.exe');
                        break;
                }
                break;
            case 'firefox':
                switch (__classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f")) {
                    case 'mac':
                    case 'mac_arm':
                        executablePath = path.join(folderPath, 'Firefox Nightly.app', 'Contents', 'MacOS', 'firefox');
                        break;
                    case 'linux':
                        executablePath = path.join(folderPath, 'firefox', 'firefox');
                        break;
                    case 'win32':
                    case 'win64':
                        executablePath = path.join(folderPath, 'firefox', 'firefox.exe');
                        break;
                }
        }
        const url = downloadURL(__classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f"), __classPrivateFieldGet$9(this, _BrowserFetcher_downloadHost, "f"), revision);
        const local = existsSync(folderPath);
        debugFetcher({
            revision,
            executablePath,
            folderPath,
            local,
            url,
            product: __classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"),
        });
        return {
            revision,
            executablePath,
            folderPath,
            local,
            url,
            product: __classPrivateFieldGet$9(this, _BrowserFetcher_product, "f"),
        };
    }
}
_BrowserFetcher_product = new WeakMap(), _BrowserFetcher_downloadPath = new WeakMap(), _BrowserFetcher_downloadHost = new WeakMap(), _BrowserFetcher_platform = new WeakMap(), _BrowserFetcher_instances = new WeakSet(), _BrowserFetcher_getFolderPath = function _BrowserFetcher_getFolderPath(revision) {
    return path.resolve(__classPrivateFieldGet$9(this, _BrowserFetcher_downloadPath, "f"), `${__classPrivateFieldGet$9(this, _BrowserFetcher_platform, "f")}-${revision}`);
};
function parseFolderPath(product, folderPath) {
    const name = path.basename(folderPath);
    const splits = name.split('-');
    if (splits.length !== 2) {
        return;
    }
    const [platform, revision] = splits;
    if (!revision || !platform || !(platform in downloadURLs[product])) {
        return;
    }
    return { product, platform, revision };
}
/**
 * Windows 11 is identified by 10.0.22000 or greater
 * @internal
 */
function isWindows11(version) {
    const parts = version.split('.');
    if (parts.length > 2) {
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);
        const patch = parseInt(parts[2], 10);
        return (major > 10 ||
            (major === 10 && minor > 0) ||
            (major === 10 && minor === 0 && patch >= 22000));
    }
    return false;
}
/**
 * @internal
 */
function _downloadFile(url, destinationPath, progressCallback) {
    debugFetcher(`Downloading binary from ${url}`);
    let fulfill;
    let reject;
    const promise = new Promise((x, y) => {
        fulfill = x;
        reject = y;
    });
    let downloadedBytes = 0;
    let totalBytes = 0;
    const request = httpRequest(url, 'GET', response => {
        if (response.statusCode !== 200) {
            const error = new Error(`Download failed: server returned code ${response.statusCode}. URL: ${url}`);
            // consume response data to free up memory
            response.resume();
            reject(error);
            return;
        }
        const file = createWriteStream(destinationPath);
        file.on('finish', () => {
            return fulfill();
        });
        file.on('error', error => {
            return reject(error);
        });
        response.pipe(file);
        totalBytes = parseInt(response.headers['content-length'], 10);
        if (progressCallback) {
            response.on('data', onData);
        }
    });
    request.on('error', error => {
        return reject(error);
    });
    return promise;
    function onData(chunk) {
        downloadedBytes += chunk.length;
        progressCallback(downloadedBytes, totalBytes);
    }
}
async function install(archivePath, folderPath) {
    debugFetcher(`Installing ${archivePath} to ${folderPath}`);
    if (archivePath.endsWith('.zip')) {
        await extractZip(archivePath, { dir: folderPath });
    }
    else if (archivePath.endsWith('.tar.bz2')) {
        await extractTar(archivePath, folderPath);
    }
    else if (archivePath.endsWith('.dmg')) {
        await mkdir(folderPath);
        await installDMG(archivePath, folderPath);
    }
    else {
        throw new Error(`Unsupported archive format: ${archivePath}`);
    }
}
/**
 * @internal
 */
function extractTar(tarPath, folderPath) {
    return new Promise((fulfill, reject) => {
        const tarStream = tar.extract(folderPath);
        tarStream.on('error', reject);
        tarStream.on('finish', fulfill);
        const readStream = createReadStream(tarPath);
        readStream.pipe(bzip()).pipe(tarStream);
    });
}
/**
 * @internal
 */
async function installDMG(dmgPath, folderPath) {
    const { stdout } = await exec(`hdiutil attach -nobrowse -noautoopen "${dmgPath}"`);
    const volumes = stdout.match(/\/Volumes\/(.*)/m);
    if (!volumes) {
        throw new Error(`Could not find volume path in ${stdout}`);
    }
    const mountPath = volumes[0];
    try {
        const fileNames = await readdir(mountPath);
        const appName = fileNames.find(item => {
            return typeof item === 'string' && item.endsWith('.app');
        });
        if (!appName) {
            throw new Error(`Cannot find app in ${mountPath}`);
        }
        const mountedPath = path.join(mountPath, appName);
        debugFetcher(`Copying ${mountedPath} to ${folderPath}`);
        await exec(`cp -R "${mountedPath}" "${folderPath}"`);
    }
    finally {
        debugFetcher(`Unmounting ${mountPath}`);
        await exec(`hdiutil detach "${mountPath}" -quiet`);
    }
}
function httpRequest(url, method, response, keepAlive = true) {
    const urlParsed = URL$1.parse(url);
    let options = {
        ...urlParsed,
        method,
        headers: keepAlive ? { Connection: 'keep-alive' } : undefined,
    };
    const proxyURL = getProxyForUrl(url);
    if (proxyURL) {
        if (url.startsWith('http:')) {
            const proxy = URL$1.parse(proxyURL);
            options = {
                path: options.href,
                host: proxy.hostname,
                port: proxy.port,
            };
        }
        else {
            const parsedProxyURL = URL$1.parse(proxyURL);
            const proxyOptions = {
                ...parsedProxyURL,
                secureProxy: parsedProxyURL.protocol === 'https:',
            };
            options.agent = createHttpsProxyAgent(proxyOptions);
            options.rejectUnauthorized = false;
        }
    }
    const requestCallback = (res) => {
        if (res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location) {
            httpRequest(res.headers.location, method, response);
        }
        else {
            response(res);
        }
    };
    const request = options.protocol === 'https:'
        ? https.request(options, requestCallback)
        : http.request(options, requestCallback);
    request.end();
    return request;
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$7 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$8 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Connection_instances, _Connection_transport, _Connection_delay, _Connection_lastId, _Connection_closed, _Connection_callbacks, _Connection_onClose;
const debugProtocolSend = debug('puppeteer:webDriverBiDi:SEND ►');
const debugProtocolReceive = debug('puppeteer:webDriverBiDi:RECV ◀');
/**
 * @internal
 */
class Connection extends EventEmitter {
    constructor(transport, delay = 0) {
        super();
        _Connection_instances.add(this);
        _Connection_transport.set(this, void 0);
        _Connection_delay.set(this, void 0);
        _Connection_lastId.set(this, 0);
        _Connection_closed.set(this, false);
        _Connection_callbacks.set(this, new Map());
        __classPrivateFieldSet$7(this, _Connection_delay, delay, "f");
        __classPrivateFieldSet$7(this, _Connection_transport, transport, "f");
        __classPrivateFieldGet$8(this, _Connection_transport, "f").onmessage = this.onMessage.bind(this);
        __classPrivateFieldGet$8(this, _Connection_transport, "f").onclose = __classPrivateFieldGet$8(this, _Connection_instances, "m", _Connection_onClose).bind(this);
    }
    get closed() {
        return __classPrivateFieldGet$8(this, _Connection_closed, "f");
    }
    send(method, params) {
        var _a;
        const id = __classPrivateFieldSet$7(this, _Connection_lastId, (_a = __classPrivateFieldGet$8(this, _Connection_lastId, "f"), ++_a), "f");
        const stringifiedMessage = JSON.stringify({
            id,
            method,
            params,
        });
        debugProtocolSend(stringifiedMessage);
        __classPrivateFieldGet$8(this, _Connection_transport, "f").send(stringifiedMessage);
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet$8(this, _Connection_callbacks, "f").set(id, {
                resolve,
                reject,
                error: new ProtocolError(),
                method,
            });
        });
    }
    /**
     * @internal
     */
    async onMessage(message) {
        if (__classPrivateFieldGet$8(this, _Connection_delay, "f")) {
            await new Promise(f => {
                return setTimeout(f, __classPrivateFieldGet$8(this, _Connection_delay, "f"));
            });
        }
        debugProtocolReceive(message);
        const object = JSON.parse(message);
        if ('id' in object) {
            const callback = __classPrivateFieldGet$8(this, _Connection_callbacks, "f").get(object.id);
            // Callbacks could be all rejected if someone has called `.dispose()`.
            if (callback) {
                __classPrivateFieldGet$8(this, _Connection_callbacks, "f").delete(object.id);
                if ('error' in object) {
                    callback.reject(createProtocolError(callback.error, callback.method, object));
                }
                else {
                    callback.resolve(object.result);
                }
            }
        }
        else {
            this.emit(object.method, object.params);
        }
    }
    dispose() {
        __classPrivateFieldGet$8(this, _Connection_instances, "m", _Connection_onClose).call(this);
        __classPrivateFieldGet$8(this, _Connection_transport, "f").close();
    }
}
_Connection_transport = new WeakMap(), _Connection_delay = new WeakMap(), _Connection_lastId = new WeakMap(), _Connection_closed = new WeakMap(), _Connection_callbacks = new WeakMap(), _Connection_instances = new WeakSet(), _Connection_onClose = function _Connection_onClose() {
    if (__classPrivateFieldGet$8(this, _Connection_closed, "f")) {
        return;
    }
    __classPrivateFieldSet$7(this, _Connection_closed, true, "f");
    __classPrivateFieldGet$8(this, _Connection_transport, "f").onmessage = undefined;
    __classPrivateFieldGet$8(this, _Connection_transport, "f").onclose = undefined;
    for (const callback of __classPrivateFieldGet$8(this, _Connection_callbacks, "f").values()) {
        callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Connection closed.`));
    }
    __classPrivateFieldGet$8(this, _Connection_callbacks, "f").clear();
};
function rewriteError(error, message, originalMessage) {
    error.message = message;
    error.originalMessage = originalMessage !== null && originalMessage !== void 0 ? originalMessage : error.originalMessage;
    return error;
}
function createProtocolError(error, method, object) {
    let message = `Protocol error (${method}): ${object.error} ${object.message}`;
    if (object.stacktrace) {
        message += ` ${object.stacktrace}`;
    }
    return rewriteError(error, message, object.message);
}

var __classPrivateFieldSet$6 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$7 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PipeTransport_instances, _PipeTransport_pipeWrite, _PipeTransport_eventListeners, _PipeTransport_isClosed, _PipeTransport_pendingMessage, _PipeTransport_dispatch;
/**
 * @internal
 */
class PipeTransport {
    constructor(pipeWrite, pipeRead) {
        _PipeTransport_instances.add(this);
        _PipeTransport_pipeWrite.set(this, void 0);
        _PipeTransport_eventListeners.set(this, void 0);
        _PipeTransport_isClosed.set(this, false);
        _PipeTransport_pendingMessage.set(this, '');
        __classPrivateFieldSet$6(this, _PipeTransport_pipeWrite, pipeWrite, "f");
        __classPrivateFieldSet$6(this, _PipeTransport_eventListeners, [
            addEventListener(pipeRead, 'data', buffer => {
                return __classPrivateFieldGet$7(this, _PipeTransport_instances, "m", _PipeTransport_dispatch).call(this, buffer);
            }),
            addEventListener(pipeRead, 'close', () => {
                if (this.onclose) {
                    this.onclose.call(null);
                }
            }),
            addEventListener(pipeRead, 'error', debugError),
            addEventListener(pipeWrite, 'error', debugError),
        ], "f");
    }
    send(message) {
        assert(!__classPrivateFieldGet$7(this, _PipeTransport_isClosed, "f"), '`PipeTransport` is closed.');
        __classPrivateFieldGet$7(this, _PipeTransport_pipeWrite, "f").write(message);
        __classPrivateFieldGet$7(this, _PipeTransport_pipeWrite, "f").write('\0');
    }
    close() {
        __classPrivateFieldSet$6(this, _PipeTransport_isClosed, true, "f");
        removeEventListeners(__classPrivateFieldGet$7(this, _PipeTransport_eventListeners, "f"));
    }
}
_PipeTransport_pipeWrite = new WeakMap(), _PipeTransport_eventListeners = new WeakMap(), _PipeTransport_isClosed = new WeakMap(), _PipeTransport_pendingMessage = new WeakMap(), _PipeTransport_instances = new WeakSet(), _PipeTransport_dispatch = function _PipeTransport_dispatch(buffer) {
    assert(!__classPrivateFieldGet$7(this, _PipeTransport_isClosed, "f"), '`PipeTransport` is closed.');
    let end = buffer.indexOf('\0');
    if (end === -1) {
        __classPrivateFieldSet$6(this, _PipeTransport_pendingMessage, __classPrivateFieldGet$7(this, _PipeTransport_pendingMessage, "f") + buffer.toString(), "f");
        return;
    }
    const message = __classPrivateFieldGet$7(this, _PipeTransport_pendingMessage, "f") + buffer.toString(undefined, 0, end);
    if (this.onmessage) {
        this.onmessage.call(null, message);
    }
    let start = end + 1;
    end = buffer.indexOf('\0', start);
    while (end !== -1) {
        if (this.onmessage) {
            this.onmessage.call(null, buffer.toString(undefined, start, end));
        }
        start = end + 1;
        end = buffer.indexOf('\0', start);
    }
    __classPrivateFieldSet$6(this, _PipeTransport_pendingMessage, buffer.toString(undefined, start), "f");
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$5 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$6 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserRunner_product, _BrowserRunner_executablePath, _BrowserRunner_processArguments, _BrowserRunner_userDataDir, _BrowserRunner_isTempUserDataDir, _BrowserRunner_closed, _BrowserRunner_listeners, _BrowserRunner_processClosing;
const removeFolderAsync = promisify(removeFolder);
const renameAsync = promisify(fs$1.rename);
const unlinkAsync = promisify(fs$1.unlink);
const debugLauncher = debug('puppeteer:launcher');
const PROCESS_ERROR_EXPLANATION = `Puppeteer was unable to kill the process which ran the browser binary.
This means that, on future Puppeteer launches, Puppeteer might not be able to launch the browser.
Please check your open processes and ensure that the browser processes that Puppeteer launched have been killed.
If you think this is a bug, please report it on the Puppeteer issue tracker.`;
/**
 * @internal
 */
class BrowserRunner {
    constructor(product, executablePath, processArguments, userDataDir, isTempUserDataDir) {
        _BrowserRunner_product.set(this, void 0);
        _BrowserRunner_executablePath.set(this, void 0);
        _BrowserRunner_processArguments.set(this, void 0);
        _BrowserRunner_userDataDir.set(this, void 0);
        _BrowserRunner_isTempUserDataDir.set(this, void 0);
        _BrowserRunner_closed.set(this, true);
        _BrowserRunner_listeners.set(this, []);
        _BrowserRunner_processClosing.set(this, void 0);
        __classPrivateFieldSet$5(this, _BrowserRunner_product, product, "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_executablePath, executablePath, "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_processArguments, processArguments, "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_userDataDir, userDataDir, "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_isTempUserDataDir, isTempUserDataDir, "f");
    }
    start(options) {
        var _a, _b;
        const { handleSIGINT, handleSIGTERM, handleSIGHUP, dumpio, env, pipe } = options;
        let stdio;
        if (pipe) {
            if (dumpio) {
                stdio = ['ignore', 'pipe', 'pipe', 'pipe', 'pipe'];
            }
            else {
                stdio = ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'];
            }
        }
        else {
            if (dumpio) {
                stdio = ['pipe', 'pipe', 'pipe'];
            }
            else {
                stdio = ['pipe', 'ignore', 'pipe'];
            }
        }
        assert(!this.proc, 'This process has previously been started.');
        debugLauncher(`Calling ${__classPrivateFieldGet$6(this, _BrowserRunner_executablePath, "f")} ${__classPrivateFieldGet$6(this, _BrowserRunner_processArguments, "f").join(' ')}`);
        this.proc = childProcess.spawn(__classPrivateFieldGet$6(this, _BrowserRunner_executablePath, "f"), __classPrivateFieldGet$6(this, _BrowserRunner_processArguments, "f"), {
            // On non-windows platforms, `detached: true` makes child process a
            // leader of a new process group, making it possible to kill child
            // process tree with `.kill(-pid)` command. @see
            // https://nodejs.org/api/child_process.html#child_process_options_detached
            detached: process.platform !== 'win32',
            env,
            stdio,
        });
        if (dumpio) {
            (_a = this.proc.stderr) === null || _a === void 0 ? void 0 : _a.pipe(process.stderr);
            (_b = this.proc.stdout) === null || _b === void 0 ? void 0 : _b.pipe(process.stdout);
        }
        __classPrivateFieldSet$5(this, _BrowserRunner_closed, false, "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_processClosing, new Promise((fulfill, reject) => {
            this.proc.once('exit', async () => {
                __classPrivateFieldSet$5(this, _BrowserRunner_closed, true, "f");
                // Cleanup as processes exit.
                if (__classPrivateFieldGet$6(this, _BrowserRunner_isTempUserDataDir, "f")) {
                    try {
                        await removeFolderAsync(__classPrivateFieldGet$6(this, _BrowserRunner_userDataDir, "f"));
                        fulfill();
                    }
                    catch (error) {
                        debugError(error);
                        reject(error);
                    }
                }
                else {
                    if (__classPrivateFieldGet$6(this, _BrowserRunner_product, "f") === 'firefox') {
                        try {
                            // When an existing user profile has been used remove the user
                            // preferences file and restore possibly backuped preferences.
                            await unlinkAsync(path.join(__classPrivateFieldGet$6(this, _BrowserRunner_userDataDir, "f"), 'user.js'));
                            const prefsBackupPath = path.join(__classPrivateFieldGet$6(this, _BrowserRunner_userDataDir, "f"), 'prefs.js.puppeteer');
                            if (fs$1.existsSync(prefsBackupPath)) {
                                const prefsPath = path.join(__classPrivateFieldGet$6(this, _BrowserRunner_userDataDir, "f"), 'prefs.js');
                                await unlinkAsync(prefsPath);
                                await renameAsync(prefsBackupPath, prefsPath);
                            }
                        }
                        catch (error) {
                            debugError(error);
                            reject(error);
                        }
                    }
                    fulfill();
                }
            });
        }), "f");
        __classPrivateFieldSet$5(this, _BrowserRunner_listeners, [addEventListener(process, 'exit', this.kill.bind(this))], "f");
        if (handleSIGINT) {
            __classPrivateFieldGet$6(this, _BrowserRunner_listeners, "f").push(addEventListener(process, 'SIGINT', () => {
                this.kill();
                process.exit(130);
            }));
        }
        if (handleSIGTERM) {
            __classPrivateFieldGet$6(this, _BrowserRunner_listeners, "f").push(addEventListener(process, 'SIGTERM', this.close.bind(this)));
        }
        if (handleSIGHUP) {
            __classPrivateFieldGet$6(this, _BrowserRunner_listeners, "f").push(addEventListener(process, 'SIGHUP', this.close.bind(this)));
        }
    }
    close() {
        if (__classPrivateFieldGet$6(this, _BrowserRunner_closed, "f")) {
            return Promise.resolve();
        }
        if (__classPrivateFieldGet$6(this, _BrowserRunner_isTempUserDataDir, "f")) {
            this.kill();
        }
        else if (this.connection) {
            // Attempt to close the browser gracefully
            this.connection.send('Browser.close').catch(error => {
                debugError(error);
                this.kill();
            });
        }
        // Cleanup this listener last, as that makes sure the full callback runs. If we
        // perform this earlier, then the previous function calls would not happen.
        removeEventListeners(__classPrivateFieldGet$6(this, _BrowserRunner_listeners, "f"));
        return __classPrivateFieldGet$6(this, _BrowserRunner_processClosing, "f");
    }
    kill() {
        // If the process failed to launch (for example if the browser executable path
        // is invalid), then the process does not get a pid assigned. A call to
        // `proc.kill` would error, as the `pid` to-be-killed can not be found.
        if (this.proc && this.proc.pid && pidExists(this.proc.pid)) {
            const proc = this.proc;
            try {
                if (process.platform === 'win32') {
                    childProcess.exec(`taskkill /pid ${this.proc.pid} /T /F`, error => {
                        if (error) {
                            // taskkill can fail to kill the process e.g. due to missing permissions.
                            // Let's kill the process via Node API. This delays killing of all child
                            // processes of `this.proc` until the main Node.js process dies.
                            proc.kill();
                        }
                    });
                }
                else {
                    // on linux the process group can be killed with the group id prefixed with
                    // a minus sign. The process group id is the group leader's pid.
                    const processGroupId = -this.proc.pid;
                    try {
                        process.kill(processGroupId, 'SIGKILL');
                    }
                    catch (error) {
                        // Killing the process group can fail due e.g. to missing permissions.
                        // Let's kill the process via Node API. This delays killing of all child
                        // processes of `this.proc` until the main Node.js process dies.
                        proc.kill('SIGKILL');
                    }
                }
            }
            catch (error) {
                throw new Error(`${PROCESS_ERROR_EXPLANATION}\nError cause: ${isErrorLike(error) ? error.stack : error}`);
            }
        }
        // Attempt to remove temporary profile directory to avoid littering.
        try {
            if (__classPrivateFieldGet$6(this, _BrowserRunner_isTempUserDataDir, "f")) {
                removeFolder.sync(__classPrivateFieldGet$6(this, _BrowserRunner_userDataDir, "f"));
            }
        }
        catch (error) { }
        // Cleanup this listener last, as that makes sure the full callback runs. If we
        // perform this earlier, then the previous function calls would not happen.
        removeEventListeners(__classPrivateFieldGet$6(this, _BrowserRunner_listeners, "f"));
    }
    async setupWebDriverBiDiConnection(options) {
        assert(this.proc, 'BrowserRunner not started.');
        const { timeout, slowMo, preferredRevision } = options;
        let browserWSEndpoint = await waitForWSEndpoint(this.proc, timeout, preferredRevision, /^WebDriver BiDi listening on (ws:\/\/.*)$/);
        browserWSEndpoint += '/session';
        const transport = await NodeWebSocketTransport.create(browserWSEndpoint);
        return new Connection(transport, slowMo);
    }
    async setupConnection(options) {
        assert(this.proc, 'BrowserRunner not started.');
        const { usePipe, timeout, slowMo, preferredRevision } = options;
        if (!usePipe) {
            const browserWSEndpoint = await waitForWSEndpoint(this.proc, timeout, preferredRevision);
            const transport = await NodeWebSocketTransport.create(browserWSEndpoint);
            this.connection = new Connection$1(browserWSEndpoint, transport, slowMo);
        }
        else {
            // stdio was assigned during start(), and the 'pipe' option there adds the
            // 4th and 5th items to stdio array
            const { 3: pipeWrite, 4: pipeRead } = this.proc.stdio;
            const transport = new PipeTransport(pipeWrite, pipeRead);
            this.connection = new Connection$1('', transport, slowMo);
        }
        return this.connection;
    }
}
_BrowserRunner_product = new WeakMap(), _BrowserRunner_executablePath = new WeakMap(), _BrowserRunner_processArguments = new WeakMap(), _BrowserRunner_userDataDir = new WeakMap(), _BrowserRunner_isTempUserDataDir = new WeakMap(), _BrowserRunner_closed = new WeakMap(), _BrowserRunner_listeners = new WeakMap(), _BrowserRunner_processClosing = new WeakMap();
function waitForWSEndpoint(browserProcess, timeout, preferredRevision, regex = /^DevTools listening on (ws:\/\/.*)$/) {
    assert(browserProcess.stderr, '`browserProcess` does not have stderr.');
    const rl = readline.createInterface(browserProcess.stderr);
    let stderr = '';
    return new Promise((resolve, reject) => {
        const listeners = [
            addEventListener(rl, 'line', onLine),
            addEventListener(rl, 'close', () => {
                return onClose();
            }),
            addEventListener(browserProcess, 'exit', () => {
                return onClose();
            }),
            addEventListener(browserProcess, 'error', error => {
                return onClose(error);
            }),
        ];
        const timeoutId = timeout ? setTimeout(onTimeout, timeout) : 0;
        function onClose(error) {
            cleanup();
            reject(new Error([
                'Failed to launch the browser process!' +
                    (error ? ' ' + error.message : ''),
                stderr,
                '',
                'TROUBLESHOOTING: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md',
                '',
            ].join('\n')));
        }
        function onTimeout() {
            cleanup();
            reject(new TimeoutError(`Timed out after ${timeout} ms while trying to connect to the browser! Only Chrome at revision r${preferredRevision} is guaranteed to work.`));
        }
        function onLine(line) {
            stderr += line + '\n';
            const match = line.match(regex);
            if (!match) {
                return;
            }
            cleanup();
            // The RegExp matches, so this will obviously exist.
            resolve(match[1]);
        }
        function cleanup() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            removeEventListeners(listeners);
        }
    });
}
function pidExists(pid) {
    try {
        return process.kill(pid, 0);
    }
    catch (error) {
        if (isErrnoException(error)) {
            if (error.code && error.code === 'ESRCH') {
                return false;
            }
        }
        throw error;
    }
}

var __classPrivateFieldSet$4 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$5 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ProductLauncher_product;
/**
 * Describes a launcher - a class that is able to create and launch a browser instance.
 *
 * @public
 */
class ProductLauncher {
    /**
     * @internal
     */
    constructor(puppeteer, product) {
        _ProductLauncher_product.set(this, void 0);
        this.puppeteer = puppeteer;
        __classPrivateFieldSet$4(this, _ProductLauncher_product, product, "f");
    }
    get product() {
        return __classPrivateFieldGet$5(this, _ProductLauncher_product, "f");
    }
    launch() {
        throw new Error('Not implemented');
    }
    executablePath() {
        throw new Error('Not implemented');
    }
    defaultArgs() {
        throw new Error('Not implemented');
    }
    /**
     * @internal
     */
    getProfilePath() {
        var _a;
        return join((_a = this.puppeteer.configuration.temporaryDirectory) !== null && _a !== void 0 ? _a : tmpdir(), `puppeteer_dev_${this.product}_profile-`);
    }
    /**
     * @internal
     */
    resolveExecutablePath() {
        const executablePath = this.puppeteer.configuration.executablePath;
        if (executablePath) {
            if (!existsSync(executablePath)) {
                throw new Error(`Tried to find the browser at the configured path (${executablePath}), but no executable was found.`);
            }
            return executablePath;
        }
        const ubuntuChromiumPath = '/usr/bin/chromium-browser';
        if (this.product === 'chrome' &&
            os__default.platform() !== 'darwin' &&
            os__default.arch() === 'arm64' &&
            existsSync(ubuntuChromiumPath)) {
            return ubuntuChromiumPath;
        }
        const browserFetcher = new BrowserFetcher({
            product: this.product,
            path: this.puppeteer.defaultDownloadPath,
        });
        const revisionInfo = browserFetcher.revisionInfo(this.puppeteer.browserRevision);
        if (!revisionInfo.local) {
            if (this.puppeteer.configuration.browserRevision) {
                throw new Error(`Tried to find the browser at the configured path (${revisionInfo.executablePath}) for revision ${this.puppeteer.browserRevision}, but no executable was found.`);
            }
            switch (this.product) {
                case 'chrome':
                    throw new Error(`Could not find Chromium (rev. ${this.puppeteer.browserRevision}). This can occur if either\n` +
                        ' 1. you did not perform an installation before running the script (e.g. `npm install`) or\n' +
                        ` 2. your cache path is incorrectly configured (which is: ${this.puppeteer.configuration.cacheDirectory}).\n` +
                        'For (2), check out our guide on configuring puppeteer at https://pptr.dev/guides/configuration.');
                case 'firefox':
                    throw new Error(`Could not find Firefox (rev. ${this.puppeteer.browserRevision}). This can occur if either\n` +
                        ' 1. you did not perform an installation for Firefox before running the script (e.g. `PUPPETEER_PRODUCT=firefox npm install`) or\n' +
                        ` 2. your cache path is incorrectly configured (which is: ${this.puppeteer.configuration.cacheDirectory}).\n` +
                        'For (2), check out our guide on configuring puppeteer at https://pptr.dev/guides/configuration.');
            }
        }
        return revisionInfo.executablePath;
    }
}
_ProductLauncher_product = new WeakMap();

var __classPrivateFieldGet$4 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChromeLauncher_instances, _ChromeLauncher_executablePathForChannel;
/**
 * @internal
 */
class ChromeLauncher extends ProductLauncher {
    constructor(puppeteer) {
        super(puppeteer, 'chrome');
        _ChromeLauncher_instances.add(this);
    }
    async launch(options = {}) {
        const { ignoreDefaultArgs = false, args = [], dumpio = false, channel, executablePath, pipe = false, env = process.env, handleSIGINT = true, handleSIGTERM = true, handleSIGHUP = true, ignoreHTTPSErrors = false, defaultViewport = { width: 800, height: 600 }, slowMo = 0, timeout = 30000, waitForInitialPage = true, debuggingPort, } = options;
        const chromeArguments = [];
        if (!ignoreDefaultArgs) {
            chromeArguments.push(...this.defaultArgs(options));
        }
        else if (Array.isArray(ignoreDefaultArgs)) {
            chromeArguments.push(...this.defaultArgs(options).filter(arg => {
                return !ignoreDefaultArgs.includes(arg);
            }));
        }
        else {
            chromeArguments.push(...args);
        }
        if (!chromeArguments.some(argument => {
            return argument.startsWith('--remote-debugging-');
        })) {
            if (pipe) {
                assert(!debuggingPort, 'Browser should be launched with either pipe or debugging port - not both.');
                chromeArguments.push('--remote-debugging-pipe');
            }
            else {
                chromeArguments.push(`--remote-debugging-port=${debuggingPort || 0}`);
            }
        }
        let isTempUserDataDir = false;
        // Check for the user data dir argument, which will always be set even
        // with a custom directory specified via the userDataDir option.
        let userDataDirIndex = chromeArguments.findIndex(arg => {
            return arg.startsWith('--user-data-dir');
        });
        if (userDataDirIndex < 0) {
            isTempUserDataDir = true;
            chromeArguments.push(`--user-data-dir=${await mkdtemp(this.getProfilePath())}`);
            userDataDirIndex = chromeArguments.length - 1;
        }
        const userDataDir = chromeArguments[userDataDirIndex].split('=', 2)[1];
        assert(typeof userDataDir === 'string', '`--user-data-dir` is malformed');
        let chromeExecutable = executablePath;
        if (!chromeExecutable) {
            assert(channel || !this.puppeteer._isPuppeteerCore, `An \`executablePath\` or \`channel\` must be specified for \`puppeteer-core\``);
            chromeExecutable = this.executablePath(channel);
        }
        const usePipe = chromeArguments.includes('--remote-debugging-pipe');
        const runner = new BrowserRunner(this.product, chromeExecutable, chromeArguments, userDataDir, isTempUserDataDir);
        runner.start({
            handleSIGHUP,
            handleSIGTERM,
            handleSIGINT,
            dumpio,
            env,
            pipe: usePipe,
        });
        let browser;
        try {
            const connection = await runner.setupConnection({
                usePipe,
                timeout,
                slowMo,
                preferredRevision: this.puppeteer.browserRevision,
            });
            browser = await CDPBrowser._create(this.product, connection, [], ignoreHTTPSErrors, defaultViewport, runner.proc, runner.close.bind(runner), options.targetFilter);
        }
        catch (error) {
            runner.kill();
            throw error;
        }
        if (waitForInitialPage) {
            try {
                await browser.waitForTarget(t => {
                    return t.type() === 'page';
                }, { timeout });
            }
            catch (error) {
                await browser.close();
                throw error;
            }
        }
        return browser;
    }
    defaultArgs(options = {}) {
        // See https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
        const chromeArguments = [
            '--allow-pre-commit-input',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-extensions-with-background-pages',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            // AcceptCHFrame disabled because of crbug.com/1348106.
            '--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-sync',
            '--enable-automation',
            // TODO(sadym): remove '--enable-blink-features=IdleDetection' once
            // IdleDetection is turned on by default.
            '--enable-blink-features=IdleDetection',
            '--enable-features=NetworkServiceInProcess2',
            '--export-tagged-pdf',
            '--force-color-profile=srgb',
            '--metrics-recording-only',
            '--no-first-run',
            '--password-store=basic',
            '--use-mock-keychain',
        ];
        const { devtools = false, headless = !devtools, args = [], userDataDir, } = options;
        if (userDataDir) {
            chromeArguments.push(`--user-data-dir=${path__default.resolve(userDataDir)}`);
        }
        if (devtools) {
            chromeArguments.push('--auto-open-devtools-for-tabs');
        }
        if (headless) {
            chromeArguments.push(headless === 'chrome' ? '--headless=chrome' : '--headless', '--hide-scrollbars', '--mute-audio');
        }
        if (args.every(arg => {
            return arg.startsWith('-');
        })) {
            chromeArguments.push('about:blank');
        }
        chromeArguments.push(...args);
        return chromeArguments;
    }
    executablePath(channel) {
        if (channel) {
            return __classPrivateFieldGet$4(this, _ChromeLauncher_instances, "m", _ChromeLauncher_executablePathForChannel).call(this, channel);
        }
        else {
            return this.resolveExecutablePath();
        }
    }
}
_ChromeLauncher_instances = new WeakSet(), _ChromeLauncher_executablePathForChannel = function _ChromeLauncher_executablePathForChannel(channel) {
    const platform = os__default.platform();
    let chromePath;
    switch (platform) {
        case 'win32':
            switch (channel) {
                case 'chrome':
                    chromePath = `${process.env['PROGRAMFILES']}\\Google\\Chrome\\Application\\chrome.exe`;
                    break;
                case 'chrome-beta':
                    chromePath = `${process.env['PROGRAMFILES']}\\Google\\Chrome Beta\\Application\\chrome.exe`;
                    break;
                case 'chrome-canary':
                    chromePath = `${process.env['PROGRAMFILES']}\\Google\\Chrome SxS\\Application\\chrome.exe`;
                    break;
                case 'chrome-dev':
                    chromePath = `${process.env['PROGRAMFILES']}\\Google\\Chrome Dev\\Application\\chrome.exe`;
                    break;
            }
            break;
        case 'darwin':
            switch (channel) {
                case 'chrome':
                    chromePath =
                        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
                    break;
                case 'chrome-beta':
                    chromePath =
                        '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
                    break;
                case 'chrome-canary':
                    chromePath =
                        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';
                    break;
                case 'chrome-dev':
                    chromePath =
                        '/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev';
                    break;
            }
            break;
        case 'linux':
            switch (channel) {
                case 'chrome':
                    chromePath = '/opt/google/chrome/chrome';
                    break;
                case 'chrome-beta':
                    chromePath = '/opt/google/chrome-beta/chrome';
                    break;
                case 'chrome-dev':
                    chromePath = '/opt/google/chrome-unstable/chrome';
                    break;
            }
            break;
    }
    if (!chromePath) {
        throw new Error(`Unable to detect browser executable path for '${channel}' on ${platform}.`);
    }
    // Check if Chrome exists and is accessible.
    try {
        accessSync(chromePath);
    }
    catch (error) {
        throw new Error(`Could not find Google Chrome executable for channel '${channel}' at '${chromePath}'.`);
    }
    return chromePath;
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$3 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$3 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Page_connection, _Page_contextId;
/**
 * @internal
 */
class Page extends Page$1 {
    constructor(connection, contextId) {
        super();
        _Page_connection.set(this, void 0);
        _Page_contextId.set(this, void 0);
        __classPrivateFieldSet$3(this, _Page_connection, connection, "f");
        __classPrivateFieldSet$3(this, _Page_contextId, contextId, "f");
    }
    async close() {
        await __classPrivateFieldGet$3(this, _Page_connection, "f").send('browsingContext.close', {
            context: __classPrivateFieldGet$3(this, _Page_contextId, "f"),
        });
    }
    async evaluate(pageFunction, ..._args) {
        // TODO: re-use evaluate logic from Execution context.
        const str = `(${pageFunction.toString()})()`;
        const result = (await __classPrivateFieldGet$3(this, _Page_connection, "f").send('script.evaluate', {
            expression: str,
            target: { context: __classPrivateFieldGet$3(this, _Page_contextId, "f") },
            awaitPromise: true,
        }));
        return result.result.value;
    }
}
_Page_connection = new WeakMap(), _Page_contextId = new WeakMap();

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$2 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$2 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserContext_connection;
/**
 * @internal
 */
class BrowserContext extends BrowserContext$1 {
    constructor(connection) {
        super();
        _BrowserContext_connection.set(this, void 0);
        __classPrivateFieldSet$2(this, _BrowserContext_connection, connection, "f");
    }
    async newPage() {
        const result = (await __classPrivateFieldGet$2(this, _BrowserContext_connection, "f").send('browsingContext.create', {
            type: 'tab',
        }));
        return new Page(__classPrivateFieldGet$2(this, _BrowserContext_connection, "f"), result.context);
    }
    async close() { }
}
_BrowserContext_connection = new WeakMap();

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Browser_process, _Browser_closeCallback, _Browser_connection;
/**
 * @internal
 */
class Browser extends Browser$1 {
    /**
     * @internal
     */
    constructor(opts) {
        super();
        _Browser_process.set(this, void 0);
        _Browser_closeCallback.set(this, void 0);
        _Browser_connection.set(this, void 0);
        __classPrivateFieldSet$1(this, _Browser_process, opts.process, "f");
        __classPrivateFieldSet$1(this, _Browser_closeCallback, opts.closeCallback, "f");
        __classPrivateFieldSet$1(this, _Browser_connection, opts.connection, "f");
    }
    /**
     * @internal
     */
    static async create(opts) {
        // TODO: await until the connection is established.
        (await opts.connection.send('session.new', {}));
        return new Browser(opts);
    }
    async close() {
        var _a;
        await ((_a = __classPrivateFieldGet$1(this, _Browser_closeCallback, "f")) === null || _a === void 0 ? void 0 : _a.call(null));
        __classPrivateFieldGet$1(this, _Browser_connection, "f").dispose();
    }
    isConnected() {
        return !__classPrivateFieldGet$1(this, _Browser_connection, "f").closed;
    }
    process() {
        var _a;
        return (_a = __classPrivateFieldGet$1(this, _Browser_process, "f")) !== null && _a !== void 0 ? _a : null;
    }
    async createIncognitoBrowserContext(_options) {
        return new BrowserContext(__classPrivateFieldGet$1(this, _Browser_connection, "f"));
    }
}
_Browser_process = new WeakMap(), _Browser_closeCallback = new WeakMap(), _Browser_connection = new WeakMap();

/**
 * @internal
 */
class FirefoxLauncher extends ProductLauncher {
    constructor(puppeteer) {
        super(puppeteer, 'firefox');
    }
    async launch(options = {}) {
        const { ignoreDefaultArgs = false, args = [], dumpio = false, executablePath, pipe = false, env = process.env, handleSIGINT = true, handleSIGTERM = true, handleSIGHUP = true, ignoreHTTPSErrors = false, defaultViewport = { width: 800, height: 600 }, slowMo = 0, timeout = 30000, extraPrefsFirefox = {}, waitForInitialPage = true, debuggingPort = null, protocol = 'cdp', } = options;
        const firefoxArguments = [];
        if (!ignoreDefaultArgs) {
            firefoxArguments.push(...this.defaultArgs(options));
        }
        else if (Array.isArray(ignoreDefaultArgs)) {
            firefoxArguments.push(...this.defaultArgs(options).filter(arg => {
                return !ignoreDefaultArgs.includes(arg);
            }));
        }
        else {
            firefoxArguments.push(...args);
        }
        if (!firefoxArguments.some(argument => {
            return argument.startsWith('--remote-debugging-');
        })) {
            if (pipe) {
                assert(debuggingPort === null, 'Browser should be launched with either pipe or debugging port - not both.');
            }
            firefoxArguments.push(`--remote-debugging-port=${debuggingPort || 0}`);
        }
        let userDataDir;
        let isTempUserDataDir = true;
        // Check for the profile argument, which will always be set even
        // with a custom directory specified via the userDataDir option.
        const profileArgIndex = firefoxArguments.findIndex(arg => {
            return ['-profile', '--profile'].includes(arg);
        });
        if (profileArgIndex !== -1) {
            userDataDir = firefoxArguments[profileArgIndex + 1];
            if (!userDataDir || !fs__default.existsSync(userDataDir)) {
                throw new Error(`Firefox profile not found at '${userDataDir}'`);
            }
            // When using a custom Firefox profile it needs to be populated
            // with required preferences.
            isTempUserDataDir = false;
            const prefs = this.defaultPreferences(extraPrefsFirefox);
            this.writePreferences(prefs, userDataDir);
        }
        else {
            userDataDir = await this._createProfile(extraPrefsFirefox);
            firefoxArguments.push('--profile');
            firefoxArguments.push(userDataDir);
        }
        let firefoxExecutable;
        if (this.puppeteer._isPuppeteerCore || executablePath) {
            assert(executablePath, `An \`executablePath\` must be specified for \`puppeteer-core\``);
            firefoxExecutable = executablePath;
        }
        else {
            firefoxExecutable = this.executablePath();
        }
        const runner = new BrowserRunner(this.product, firefoxExecutable, firefoxArguments, userDataDir, isTempUserDataDir);
        runner.start({
            handleSIGHUP,
            handleSIGTERM,
            handleSIGINT,
            dumpio,
            env,
            pipe,
        });
        if (protocol === 'webDriverBiDi') {
            let browser;
            try {
                const connection = await runner.setupWebDriverBiDiConnection({
                    timeout,
                    slowMo,
                    preferredRevision: this.puppeteer.browserRevision,
                });
                browser = await Browser.create({
                    connection,
                    closeCallback: runner.close.bind(runner),
                    process: runner.proc,
                });
            }
            catch (error) {
                runner.kill();
                throw error;
            }
            return browser;
        }
        let browser;
        try {
            const connection = await runner.setupConnection({
                usePipe: pipe,
                timeout,
                slowMo,
                preferredRevision: this.puppeteer.browserRevision,
            });
            browser = await CDPBrowser._create(this.product, connection, [], ignoreHTTPSErrors, defaultViewport, runner.proc, runner.close.bind(runner), options.targetFilter);
        }
        catch (error) {
            runner.kill();
            throw error;
        }
        if (waitForInitialPage) {
            try {
                await browser.waitForTarget(t => {
                    return t.type() === 'page';
                }, { timeout });
            }
            catch (error) {
                await browser.close();
                throw error;
            }
        }
        return browser;
    }
    executablePath() {
        // replace 'latest' placeholder with actual downloaded revision
        if (this.puppeteer.browserRevision === 'latest') {
            const browserFetcher = new BrowserFetcher({
                product: this.product,
                path: this.puppeteer.defaultDownloadPath,
            });
            const localRevisions = browserFetcher.localRevisions();
            if (localRevisions[0]) {
                this.puppeteer.configuration.browserRevision = localRevisions[0];
            }
        }
        return this.resolveExecutablePath();
    }
    defaultArgs(options = {}) {
        const { devtools = false, headless = !devtools, args = [], userDataDir = null, } = options;
        const firefoxArguments = ['--no-remote'];
        switch (os__default.platform()) {
            case 'darwin':
                firefoxArguments.push('--foreground');
                break;
            case 'win32':
                firefoxArguments.push('--wait-for-browser');
                break;
        }
        if (userDataDir) {
            firefoxArguments.push('--profile');
            firefoxArguments.push(userDataDir);
        }
        if (headless) {
            firefoxArguments.push('--headless');
        }
        if (devtools) {
            firefoxArguments.push('--devtools');
        }
        if (args.every(arg => {
            return arg.startsWith('-');
        })) {
            firefoxArguments.push('about:blank');
        }
        firefoxArguments.push(...args);
        return firefoxArguments;
    }
    defaultPreferences(extraPrefs) {
        const server = 'dummy.test';
        const defaultPrefs = {
            // Make sure Shield doesn't hit the network.
            'app.normandy.api_url': '',
            // Disable Firefox old build background check
            'app.update.checkInstallTime': false,
            // Disable automatically upgrading Firefox
            'app.update.disabledForTesting': true,
            // Increase the APZ content response timeout to 1 minute
            'apz.content_response_timeout': 60000,
            // Prevent various error message on the console
            // jest-puppeteer asserts that no error message is emitted by the console
            'browser.contentblocking.features.standard': '-tp,tpPrivate,cookieBehavior0,-cm,-fp',
            // Enable the dump function: which sends messages to the system
            // console
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1543115
            'browser.dom.window.dump.enabled': true,
            // Disable topstories
            'browser.newtabpage.activity-stream.feeds.system.topstories': false,
            // Always display a blank page
            'browser.newtabpage.enabled': false,
            // Background thumbnails in particular cause grief: and disabling
            // thumbnails in general cannot hurt
            'browser.pagethumbnails.capturing_disabled': true,
            // Disable safebrowsing components.
            'browser.safebrowsing.blockedURIs.enabled': false,
            'browser.safebrowsing.downloads.enabled': false,
            'browser.safebrowsing.malware.enabled': false,
            'browser.safebrowsing.passwords.enabled': false,
            'browser.safebrowsing.phishing.enabled': false,
            // Disable updates to search engines.
            'browser.search.update': false,
            // Do not restore the last open set of tabs if the browser has crashed
            'browser.sessionstore.resume_from_crash': false,
            // Skip check for default browser on startup
            'browser.shell.checkDefaultBrowser': false,
            // Disable newtabpage
            'browser.startup.homepage': 'about:blank',
            // Do not redirect user when a milstone upgrade of Firefox is detected
            'browser.startup.homepage_override.mstone': 'ignore',
            // Start with a blank page about:blank
            'browser.startup.page': 0,
            // Do not allow background tabs to be zombified on Android: otherwise for
            // tests that open additional tabs: the test harness tab itself might get
            // unloaded
            'browser.tabs.disableBackgroundZombification': false,
            // Do not warn when closing all other open tabs
            'browser.tabs.warnOnCloseOtherTabs': false,
            // Do not warn when multiple tabs will be opened
            'browser.tabs.warnOnOpen': false,
            // Disable the UI tour.
            'browser.uitour.enabled': false,
            // Turn off search suggestions in the location bar so as not to trigger
            // network connections.
            'browser.urlbar.suggest.searches': false,
            // Disable first run splash page on Windows 10
            'browser.usedOnWindows10.introURL': '',
            // Do not warn on quitting Firefox
            'browser.warnOnQuit': false,
            // Defensively disable data reporting systems
            'datareporting.healthreport.documentServerURI': `http://${server}/dummy/healthreport/`,
            'datareporting.healthreport.logging.consoleEnabled': false,
            'datareporting.healthreport.service.enabled': false,
            'datareporting.healthreport.service.firstRun': false,
            'datareporting.healthreport.uploadEnabled': false,
            // Do not show datareporting policy notifications which can interfere with tests
            'datareporting.policy.dataSubmissionEnabled': false,
            'datareporting.policy.dataSubmissionPolicyBypassNotification': true,
            // DevTools JSONViewer sometimes fails to load dependencies with its require.js.
            // This doesn't affect Puppeteer but spams console (Bug 1424372)
            'devtools.jsonview.enabled': false,
            // Disable popup-blocker
            'dom.disable_open_during_load': false,
            // Enable the support for File object creation in the content process
            // Required for |Page.setFileInputFiles| protocol method.
            'dom.file.createInChild': true,
            // Disable the ProcessHangMonitor
            'dom.ipc.reportProcessHangs': false,
            // Disable slow script dialogues
            'dom.max_chrome_script_run_time': 0,
            'dom.max_script_run_time': 0,
            // Only load extensions from the application and user profile
            // AddonManager.SCOPE_PROFILE + AddonManager.SCOPE_APPLICATION
            'extensions.autoDisableScopes': 0,
            'extensions.enabledScopes': 5,
            // Disable metadata caching for installed add-ons by default
            'extensions.getAddons.cache.enabled': false,
            // Disable installing any distribution extensions or add-ons.
            'extensions.installDistroAddons': false,
            // Disabled screenshots extension
            'extensions.screenshots.disabled': true,
            // Turn off extension updates so they do not bother tests
            'extensions.update.enabled': false,
            // Turn off extension updates so they do not bother tests
            'extensions.update.notifyUser': false,
            // Make sure opening about:addons will not hit the network
            'extensions.webservice.discoverURL': `http://${server}/dummy/discoveryURL`,
            // Temporarily force disable BFCache in parent (https://bit.ly/bug-1732263)
            'fission.bfcacheInParent': false,
            // Force all web content to use a single content process
            'fission.webContentIsolationStrategy': 0,
            // Allow the application to have focus even it runs in the background
            'focusmanager.testmode': true,
            // Disable useragent updates
            'general.useragent.updates.enabled': false,
            // Always use network provider for geolocation tests so we bypass the
            // macOS dialog raised by the corelocation provider
            'geo.provider.testing': true,
            // Do not scan Wifi
            'geo.wifi.scan': false,
            // No hang monitor
            'hangmonitor.timeout': 0,
            // Show chrome errors and warnings in the error console
            'javascript.options.showInConsole': true,
            // Disable download and usage of OpenH264: and Widevine plugins
            'media.gmp-manager.updateEnabled': false,
            // Prevent various error message on the console
            // jest-puppeteer asserts that no error message is emitted by the console
            'network.cookie.cookieBehavior': 0,
            // Disable experimental feature that is only available in Nightly
            'network.cookie.sameSite.laxByDefault': false,
            // Do not prompt for temporary redirects
            'network.http.prompt-temp-redirect': false,
            // Disable speculative connections so they are not reported as leaking
            // when they are hanging around
            'network.http.speculative-parallel-limit': 0,
            // Do not automatically switch between offline and online
            'network.manage-offline-status': false,
            // Make sure SNTP requests do not hit the network
            'network.sntp.pools': server,
            // Disable Flash.
            'plugin.state.flash': 0,
            'privacy.trackingprotection.enabled': false,
            // Can be removed once Firefox 89 is no longer supported
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1710839
            'remote.enabled': true,
            // Don't do network connections for mitm priming
            'security.certerrors.mitm.priming.enabled': false,
            // Local documents have access to all other local documents,
            // including directory listings
            'security.fileuri.strict_origin_policy': false,
            // Do not wait for the notification button security delay
            'security.notification_enable_delay': 0,
            // Ensure blocklist updates do not hit the network
            'services.settings.server': `http://${server}/dummy/blocklist/`,
            // Do not automatically fill sign-in forms with known usernames and
            // passwords
            'signon.autofillForms': false,
            // Disable password capture, so that tests that include forms are not
            // influenced by the presence of the persistent doorhanger notification
            'signon.rememberSignons': false,
            // Disable first-run welcome page
            'startup.homepage_welcome_url': 'about:blank',
            // Disable first-run welcome page
            'startup.homepage_welcome_url.additional': '',
            // Disable browser animations (tabs, fullscreen, sliding alerts)
            'toolkit.cosmeticAnimations.enabled': false,
            // Prevent starting into safe mode after application crashes
            'toolkit.startup.max_resumed_crashes': -1,
        };
        return Object.assign(defaultPrefs, extraPrefs);
    }
    /**
     * Populates the user.js file with custom preferences as needed to allow
     * Firefox's CDP support to properly function. These preferences will be
     * automatically copied over to prefs.js during startup of Firefox. To be
     * able to restore the original values of preferences a backup of prefs.js
     * will be created.
     *
     * @param prefs - List of preferences to add.
     * @param profilePath - Firefox profile to write the preferences to.
     */
    async writePreferences(prefs, profilePath) {
        const lines = Object.entries(prefs).map(([key, value]) => {
            return `user_pref(${JSON.stringify(key)}, ${JSON.stringify(value)});`;
        });
        await fs__default.promises.writeFile(path__default.join(profilePath, 'user.js'), lines.join('\n'));
        // Create a backup of the preferences file if it already exitsts.
        const prefsPath = path__default.join(profilePath, 'prefs.js');
        if (fs__default.existsSync(prefsPath)) {
            const prefsBackupPath = path__default.join(profilePath, 'prefs.js.puppeteer');
            await fs__default.promises.copyFile(prefsPath, prefsBackupPath);
        }
    }
    async _createProfile(extraPrefs) {
        const temporaryProfilePath = await fs__default.promises.mkdtemp(this.getProfilePath());
        const prefs = this.defaultPreferences(extraPrefs);
        await this.writePreferences(prefs, temporaryProfilePath);
        return temporaryProfilePath;
    }
}

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const PUPPETEER_REVISIONS = Object.freeze({
    chromium: '1056772',
    firefox: 'latest',
});

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PuppeteerNode_instances, _PuppeteerNode__launcher, _PuppeteerNode_lastLaunchedProduct, _PuppeteerNode_launcher_get;
/**
 * Extends the main {@link Puppeteer} class with Node specific behaviour for
 * fetching and downloading browsers.
 *
 * If you're using Puppeteer in a Node environment, this is the class you'll get
 * when you run `require('puppeteer')` (or the equivalent ES `import`).
 *
 * @remarks
 * The most common method to use is {@link PuppeteerNode.launch | launch}, which
 * is used to launch and connect to a new browser instance.
 *
 * See {@link Puppeteer | the main Puppeteer class} for methods common to all
 * environments, such as {@link Puppeteer.connect}.
 *
 * @example
 * The following is a typical example of using Puppeteer to drive automation:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * Once you have created a `page` you have access to a large API to interact
 * with the page, navigate, or find certain elements in that page.
 * The {@link Page | `page` documentation} lists all the available methods.
 *
 * @public
 */
class PuppeteerNode extends Puppeteer {
    /**
     * @internal
     */
    constructor(settings) {
        const { configuration, ...commonSettings } = settings;
        super(commonSettings);
        _PuppeteerNode_instances.add(this);
        _PuppeteerNode__launcher.set(this, void 0);
        _PuppeteerNode_lastLaunchedProduct.set(this, void 0);
        /**
         * @internal
         */
        this.configuration = {};
        if (configuration) {
            this.configuration = configuration;
        }
        switch (this.configuration.defaultProduct) {
            case 'firefox':
                this.defaultBrowserRevision = PUPPETEER_REVISIONS.firefox;
                break;
            default:
                this.configuration.defaultProduct = 'chrome';
                this.defaultBrowserRevision = PUPPETEER_REVISIONS.chromium;
                break;
        }
        this.connect = this.connect.bind(this);
        this.launch = this.launch.bind(this);
        this.executablePath = this.executablePath.bind(this);
        this.defaultArgs = this.defaultArgs.bind(this);
        this.createBrowserFetcher = this.createBrowserFetcher.bind(this);
    }
    /**
     * This method attaches Puppeteer to an existing browser instance.
     *
     * @param options - Set of configurable options to set on the browser.
     * @returns Promise which resolves to browser instance.
     *
     * @public
     */
    connect(options) {
        return super.connect(options);
    }
    /**
     * Launches a browser instance with given arguments and options when
     * specified.
     *
     * When using with `puppeteer-core`,
     * {@link LaunchOptions.executablePath | options.executablePath} or
     * {@link LaunchOptions.channel | options.channel} must be provided.
     *
     * @example
     * You can use {@link LaunchOptions.ignoreDefaultArgs | options.ignoreDefaultArgs}
     * to filter out `--mute-audio` from default arguments:
     *
     * ```ts
     * const browser = await puppeteer.launch({
     *   ignoreDefaultArgs: ['--mute-audio'],
     * });
     * ```
     *
     * @remarks
     * Puppeteer can also be used to control the Chrome browser, but it works best
     * with the version of Chromium downloaded by default by Puppeteer. There is
     * no guarantee it will work with any other version. If Google Chrome (rather
     * than Chromium) is preferred, a
     * {@link https://www.google.com/chrome/browser/canary.html | Chrome Canary}
     * or
     * {@link https://www.chromium.org/getting-involved/dev-channel | Dev Channel}
     * build is suggested. See
     * {@link https://www.howtogeek.com/202825/what%E2%80%99s-the-difference-between-chromium-and-chrome/ | this article}
     * for a description of the differences between Chromium and Chrome.
     * {@link https://chromium.googlesource.com/chromium/src/+/lkgr/docs/chromium_browser_vs_google_chrome.md | This article}
     * describes some differences for Linux users.
     *
     * @param options - Options to configure launching behavior.
     *
     * @public
     */
    launch(options = {}) {
        const { product = this.defaultProduct } = options;
        __classPrivateFieldSet(this, _PuppeteerNode_lastLaunchedProduct, product, "f");
        return __classPrivateFieldGet(this, _PuppeteerNode_instances, "a", _PuppeteerNode_launcher_get).launch(options);
    }
    /**
     * @returns The default executable path.
     *
     * @public
     */
    executablePath(channel) {
        return __classPrivateFieldGet(this, _PuppeteerNode_instances, "a", _PuppeteerNode_launcher_get).executablePath(channel);
    }
    /**
     * @internal
     */
    get browserRevision() {
        var _a;
        return (_a = this.configuration.browserRevision) !== null && _a !== void 0 ? _a : this.defaultBrowserRevision;
    }
    /**
     * @returns The default download path for puppeteer. For puppeteer-core, this
     * code should never be called as it is never defined.
     *
     * @internal
     */
    get defaultDownloadPath() {
        var _a;
        return ((_a = this.configuration.downloadPath) !== null && _a !== void 0 ? _a : join(this.configuration.cacheDirectory, this.product));
    }
    /**
     * @returns The name of the browser that was last launched.
     *
     * @public
     */
    get lastLaunchedProduct() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _PuppeteerNode_lastLaunchedProduct, "f")) !== null && _a !== void 0 ? _a : this.defaultProduct;
    }
    /**
     * @returns The name of the browser that will be launched by default. For
     * `puppeteer`, this is influenced by your configuration. Otherwise, it's
     * `chrome`.
     *
     * @public
     */
    get defaultProduct() {
        var _a;
        return (_a = this.configuration.defaultProduct) !== null && _a !== void 0 ? _a : 'chrome';
    }
    /**
     * @deprecated Do not use as this field as it does not take into account
     * multiple browsers of different types. Use
     * {@link PuppeteerNode.defaultProduct | defaultProduct} or
     * {@link PuppeteerNode.lastLaunchedProduct | lastLaunchedProduct}.
     *
     * @returns The name of the browser that is under automation.
     *
     * @public
     */
    get product() {
        return __classPrivateFieldGet(this, _PuppeteerNode_instances, "a", _PuppeteerNode_launcher_get).product;
    }
    /**
     * @param options - Set of configurable options to set on the browser.
     *
     * @returns The default flags that Chromium will be launched with.
     *
     * @public
     */
    defaultArgs(options = {}) {
        return __classPrivateFieldGet(this, _PuppeteerNode_instances, "a", _PuppeteerNode_launcher_get).defaultArgs(options);
    }
    /**
     * @param options - Set of configurable options to specify the settings of the
     * BrowserFetcher.
     *
     * @remarks
     * If you are using `puppeteer-core`, do not use this method. Just
     * construct {@link BrowserFetcher} manually.
     *
     * @returns A new BrowserFetcher instance.
     */
    createBrowserFetcher(options) {
        var _a;
        const downloadPath = this.defaultDownloadPath;
        if (downloadPath) {
            options.path = downloadPath;
        }
        if (!options.path) {
            throw new Error('A `path` must be specified for `puppeteer-core`.');
        }
        if ((_a = this.configuration.experiments) === null || _a === void 0 ? void 0 : _a.macArmChromiumEnabled) {
            options.useMacOSARMBinary = true;
        }
        if (this.configuration.downloadHost) {
            options.host = this.configuration.downloadHost;
        }
        return new BrowserFetcher(options);
    }
}
_PuppeteerNode__launcher = new WeakMap(), _PuppeteerNode_lastLaunchedProduct = new WeakMap(), _PuppeteerNode_instances = new WeakSet(), _PuppeteerNode_launcher_get = function _PuppeteerNode_launcher_get() {
    if (__classPrivateFieldGet(this, _PuppeteerNode__launcher, "f") &&
        __classPrivateFieldGet(this, _PuppeteerNode__launcher, "f").product === this.lastLaunchedProduct) {
        return __classPrivateFieldGet(this, _PuppeteerNode__launcher, "f");
    }
    switch (this.lastLaunchedProduct) {
        case 'chrome':
            this.defaultBrowserRevision = PUPPETEER_REVISIONS.chromium;
            __classPrivateFieldSet(this, _PuppeteerNode__launcher, new ChromeLauncher(this), "f");
            break;
        case 'firefox':
            this.defaultBrowserRevision = PUPPETEER_REVISIONS.firefox;
            __classPrivateFieldSet(this, _PuppeteerNode__launcher, new FirefoxLauncher(this), "f");
            break;
        default:
            throw new Error(`Unknown product: ${__classPrivateFieldGet(this, _PuppeteerNode_lastLaunchedProduct, "f")}`);
    }
    return __classPrivateFieldGet(this, _PuppeteerNode__launcher, "f");
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @public
 */
const puppeteer = new PuppeteerNode({
    isPuppeteerCore: true,
});
const { connect, createBrowserFetcher, defaultArgs, executablePath, launch, } = puppeteer;

export { Accessibility, Browser$1 as Browser, BrowserContext$1 as BrowserContext, BrowserFetcher, BrowserRunner, BrowserWebSocketTransport, CDPBrowser, CDPBrowserContext, CDPPage, CDPSession, CDPSessionEmittedEvents, CDPSessionImpl, CSSCoverage, ChromeLauncher, ChromeTargetManager, Connection$1 as Connection, ConnectionEmittedEvents, ConsoleMessage, Coverage, CustomError, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY, Dialog, EVALUATION_SCRIPT_URL, ElementHandle, EmulationManager, EventEmitter, ExecutionContext, FileChooser, FirefoxLauncher, FirefoxTargetManager, Frame, FrameManager, FrameManagerEmittedEvents, FrameTree, HTTPRequest, HTTPResponse, InterceptResolutionAction, IsolatedWorld, JSCoverage, JSHandle, Keyboard, KnownDevices, LazyArg, LifecycleWatcher, MAIN_WORLD, Mouse, NetworkEventManager, NetworkManager, NetworkManagerEmittedEvents, NodeWebSocketTransport, PUPPETEER_REVISIONS, PUPPETEER_WORLD, Page$1 as Page, PipeTransport, PredefinedNetworkConditions, ProductLauncher, ProtocolError, Puppeteer, PuppeteerNode, SecurityDetails, Target, TaskManager, TaskQueue, TimeoutError, TimeoutSettings, Touchscreen, Tracing, WEB_PERMISSION_TO_PROTOCOL_PERMISSION, WaitTask, WebWorker, _connectToCDPBrowser, _keyDefinitions, _paperFormats, addEventListener, ariaHandler, assert, clearCustomQueryHandlers, connect, createBrowserFetcher, createDebuggableDeferredPromise, createDeferredPromise, createJSHandle, customQueryHandlerNames, debug, debugError, puppeteer as default, defaultArgs, devices, errors, evaluationString, executablePath, getExceptionMessage, getFetch, getQueryHandlerAndSelector, getReadableAsBuffer, getReadableFromProtocolStream, importDebug, importFS, isErrnoException, isErrorLike, isNumber, isString, isTargetClosedError, launch, networkConditions, pageBindingDeliverErrorString, pageBindingDeliverErrorValueString, pageBindingDeliverResultString, pageBindingInitString, registerCustomQueryHandler, releaseObject, removeEventListeners, supportedMetrics$1 as supportedMetrics, unitToPixels$1 as unitToPixels, unregisterCustomQueryHandler, valueFromRemoteObject, waitForEvent, waitWithTimeout };
