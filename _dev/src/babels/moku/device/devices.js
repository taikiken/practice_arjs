/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/28 - 16:39
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * [native code] userAgent
 * `device/index.js`
 * @type {string}
 */
const ua = navigator.userAgent;

/**
 * [native code] appVersion
 * `device/index.js`
 * @type {string}
 */
const app = navigator.appVersion;

/**
 * Safari - userAgent に `Safari` が含まれる
 * - 【注意】Safari browser を保証しない
 * @type {boolean}
 */
const safari = !!ua.match(/safari/i);

/**
 * device property
 * `device/index.js`
 * @type {{
 * ios: boolean,
 * ipad: boolean,
 * ipod: boolean,
 * iphone: boolean,
 * windows: boolean,
 * android: boolean,
 * standard: boolean,
 * phone: boolean,
 * tablet: boolean,
 * hd: boolean,
 * webView: boolean,
 * standalone: boolean,
 * version: number,
 * major: number,
 * build: string,
 * numbers: [?number,?number,?number]
 * }}
 */
const props = {
  ios: false,
  ipad: false,
  ipod: false,
  iphone: false,
  windows: false,
  android: false,
  standard: false,
  phone: false,
  tablet: false,
  hd: false,
  webView: false,
  standalone: false,
  build: '',
  major: -1,
  numbers: [-1, -1, -1],
  version: -1,
};

/**
 * browser property
 * `device/index.js`
 * @type {{
 *   safari: boolean,
 *   chrome: boolean,
 *   firefox: boolean,
 *   ie: boolean,
 *   ie6: boolean,
 *   ie7: boolean,
 *   ie8: boolean,
 *   ie9: boolean,
 *   ie10: boolean,
 *   ie11: boolean,
 *   edge: boolean,
 *   crios: boolean,
 *   fxios: boolean,
 *   edgios: boolean,
 *   edga: boolean,
 *   standard: boolean,
 *   build: string,
 *   major: number,
 *   numbers: [null,null,null],
 *   version: number
 * }}
 */
const browsers = {
  safari: false,
  chrome: false,
  firefox: false,
  ie: false,
  ie6: false,
  ie7: false,
  ie8: false,
  ie9: false,
  ie10: false,
  ie11: false,
  edge: false,
  edgios: false,
  edga: false,
  crios: false,
  fxios: false,
  standard: false,
  build: '',
  major: -1,
  numbers: [-1, -1, -1],
  version: -1,
};

/**
 * devices object
 * `device/index.js`
 * ```
 * @import device from './device';
 * const property = Object.assign({}, device);
 * ```
 * @type {{
 *    ua: string,
 *    app: string,
 *    props: {
 *      ios: boolean,
 *      ipad: boolean,
 *      ipod: boolean,
 *      iphone: boolean,
 *      windows: boolean,
 *      android: boolean,
 *      standard: boolean,
 *      phone: boolean,
 *      tablet: boolean,
 *      hd: boolean,
 *      webView: boolean,
 *      standalone: boolean,
 *      version: number,
 *      major: number,
 *      build: string,
 *      numbers: (number|number|number)[]},
 *    safari: boolean,
 *    browsers: {
 *      safari: boolean,
 *      chrome: boolean,
 *      firefox: boolean,
 *      ie: boolean,
 *      ie6: boolean,
 *      ie7: boolean,
 *      ie8: boolean,
 *      ie9: boolean,
 *      ie10: boolean,
 *      ie11: boolean,
 *      edge: boolean,
 *      edgios: boolean,
 *      crios: boolean,
 *      fxios: boolean,
 *      standard: boolean,
 *      build: string,
 *      major: number,
 *      numbers: [null,null,null],
 *      version: number
 *    }
 * }}
 */
const devices = {
  ua,
  app,
  props,
  safari,
  browsers,
};

export default devices;
