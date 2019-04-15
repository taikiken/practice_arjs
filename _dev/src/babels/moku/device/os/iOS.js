/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/28 - 17:39
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import devices from '../devices';

/**
 * {@link devices}.props
 * {@link iOS}
 * @type {?object}
 */
let props = null;

/**
 * version 情報を計算します
 * {@link iOS}
 */
const version = () => {
  const { app } = devices;
  const numbers = app.match(/os (\d+)_(\d+)_?(\d+)?/i);
  if (!Array.isArray(numbers)) {
    return;
  }
  // iOS N.N.N 削除
  numbers.shift();
  const versions = numbers.map((number) => {
    const int = parseInt(number, 10);
    return Number.isNaN(int) ? 0 : int;
  });
  props.build = versions.join('.');
  const [
    strMajor,
    strMinor,
    strBuild,
  ] = versions;
  const major = parseInt(strMajor, 10);
  let minor = 0;
  if (versions.length >= 2) {
    minor = strMinor;
  }
  let build = '';
  if (versions.length >= 3) {
    build = strBuild;
  }
  props.major = major;
  props.version = parseFloat(`${major}.${minor}${build}`);
  props.numbers = versions;
};

/**
 * iOS 判定を行います
 * {@link iOS}
 */
const init = () => {
  if (props) {
    return;
  }
  // props = Object.assign({}, devices.props);
  props = {...devices.props};
  const { ua } = devices;
  const ipad = !!ua.match(/ipad/i);
  const ipod = !!ua.match(/ipod/i);
  const iphone = !!ua.match(/iphone/i) && !ipad && !ipod;
  const ios = ipad || ipod || iphone;
  if (!ios) {
    return;
  }
  const standalone = !!navigator.standalone;
  props.stanalone = standalone;
  props.ios = ios;
  props.ipad = ipad;
  props.ipod = ipod;
  props.iphone = iphone;
  props.phone = iphone || ipod;
  props.tablet = ipad;
  // アプリ内コンテンツ
  props.webView = ios && !standalone && !devices.safari;
  // version check
  version();
};

/**
 * iOS detector
 */
export default class iOS {
  /**
   * iOS
   * @returns {boolean} true: iOS
   */
  static is() {
    init();
    return props.ios;
  }

  /**
   * iOS && iPhone or iPod
   * @returns {boolean} true: iOS && iPhone or iPod
   */
  static phone() {
    init();
    return props.phone;
  }

  /**
   * iOS && iPad
   * @returns {boolean} true: iOS && iPad
   */
  static tablet() {
    init();
    return props.tablet;
  }

  /**
   * iOS && iPhone
   * @returns {boolean} true: iOS && iPhone
   */
  static iphone() {
    init();
    return props.iphone;
  }

  /**
   * iOS && iPad
   * @returns {boolean} true: iOS && iPad
   */
  static ipad() {
    init();
    return props.ipad;
  }

  /**
   * iOS && iPod
   * @returns {boolean} true: iOS && iPod
   */
  static ipod() {
    init();
    return props.ipod;
  }

  /**
   * iOS version
   * @returns {number} iOS version, not iOS -1
   */
  static version() {
    init();
    return props.version;
  }

  /**
   * iOS major version
   * @returns {number} iOS major version, not iOS -1
   */
  static major() {
    init();
    return props.major;
  }

  /**
   * iOS version `major.minor.build`
   * @returns {string} iOS version NN.NN.NN 型（文字）で返します, not iOS 空文字列
   */
  static build() {
    init();
    return props.build;
  }

  /**
   * version を配列形式で取得します
   * @returns {Array.<number>} {{major: int, minor: int, build: int}} 形式で返します
   */
  static numbers() {
    init();
    return props.numbers;
  }

  /**
   * iOS webView - 標準 UA のみ対応
   * @returns {boolean} true: iOS webView
   */
  static webView() {
    init();
    return props.webView;
  }

  /**
   * iOS standalone - app mode
   * @returns {boolean} true: iOS app mode
   */
  static standalone() {
    return props.standalone;
  }
}
