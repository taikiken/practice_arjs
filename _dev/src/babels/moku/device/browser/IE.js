/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/09/22 - 19:29
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import devices from '../devices';

/**
 * {@link devices}.browsers
 * {@link IE}
 * @type {?object}
 * @since 0.4.2
 */
let browsers = null;

/**
 * version 情報を計算します
 * {@link IE}
 * @since 0.4.2
 */
const version = () => {
  let major = -1;
  if (browsers.ie) {
    if (browsers.ie11) {
      major = 11;
    } else if (browsers.ie10) {
      major = 10;
    } else if (browsers.ie9) {
      major = 9;
    } else if (browsers.ie8) {
      major = 8;
    } else if (browsers.ie7) {
      major = 7;
    } else if (browsers.ie6) {
      major = 6;
    }
  }
  browsers.build = String(major);
  browsers.major = major;
  browsers.version = major;
  if (major >= 0) {
    browsers.numbers = [major];
  }
};

/**
 * browser 判別します
 * {@link IE}
 * @since 0.4.2
 */
const init = () => {
  if (browsers) {
    return;
  }
  // browsers = Object.assign({}, devices.browsers);
  browsers = {...{}};
  const { ua } = devices;
  let ie = !!ua.match(/msie/i);
  browsers.ie = ie;
  if (ie) {
    browsers.ie10 = !!ua.match(/msie [10]/i);
    browsers.ie9 = !!ua.match(/msie [9]/i);
    browsers.ie8 = !!ua.match(/msie [8]/i);
    browsers.ie7 = !!ua.match(/msie [7]/i);
    browsers.ie6 = !!ua.match(/msie [6]/i);
  } else {
    const ie11 = !!ua.match(/trident\/[7]/i) && !!ua.match(/rv:[11]/i);
    ie = ie11;
    browsers.ie = ie11;
    browsers.ie11 = ie11;
  }
  if (ie) {
    version();
  }
};

/**
 * IE detector
 * @since 0.4.2
 */
export default class IE {
  /**
   * 書き換え済み `browsers` を取得します
   * @returns {Object} 書き換え済み `browsers` を返します
   */
  static browsers() {
    init();
    return browsers;
  }

  /**
   * IE 判定
   * @returns {boolean} true: IE
   */
  static is() {
    init();
    return browsers.ie;
  }

  /**
   * IE 6 判定
   * @returns {boolean} true: IE 6
   */
  static is6() {
    init();
    return browsers.ie6;
  }

  /**
   * IE 7 判定
   * @returns {boolean} true: IE 7
   */
  static is7() {
    init();
    return browsers.ie7;
  }

  /**
   * IE 8 判定
   * @returns {boolean} true: IE 8
   */
  static is8() {
    init();
    return browsers.ie8;
  }

  /**
   * IE 9 判定
   * @returns {boolean} true: IE 9
   */
  static is9() {
    init();
    return browsers.ie9;
  }

  /**
   * IE 10 判定
   * @returns {boolean} true: IE 10
   */
  static is10() {
    init();
    return browsers.ie10;
  }

  /**
   * IE 11 判定
   * @returns {boolean} true: IE 11
   */
  static is11() {
    init();
    return browsers.ie11;
  }

  /**
   * IE Browser version
   * @returns {number} IE version, not Android -1
   */
  static version() {
    init();
    return browsers.version;
  }

  /**
   * IE Browser major version
   * @returns {number} IE major version, not Android -1
   */
  static major() {
    init();
    return browsers.major;
  }

  /**
   * IE Browser version `major.minor.build`
   * @returns {string} IE version NN.NN.NN.NN 型（文字）で返します
   */
  static build() {
    init();
    return browsers.build;
  }

  /**
   * version を配列形式で取得します
   * @returns {Array.<number>} {{major: int, minor: int, build: int, option: number}} 形式で返します
   */
  static numbers() {
    init();
    return browsers.numbers;
  }
}
