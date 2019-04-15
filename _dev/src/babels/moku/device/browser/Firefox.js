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
 * {@link Firefox}
 * @type {?object}
 * @since 0.4.2
 */
let browsers = null;

/**
 * version 情報を計算します
 * {@link Firefox}
 * @since 0.4.2
 */
const version = () => {
  const { ua } = devices;
  const numbers = ua.match(/firefox\/(\d+)\.?(\d+)?/i);
  if (!Array.isArray(numbers)) {
    return;
  }
  // 先頭 削除
  numbers.shift();
  // array
  const intArr = numbers.map(number => (parseInt(number, 10)));
  const versions = intArr.filter(int => !Number.isNaN(int));
  browsers.build = versions.join('.');
  const [
    strMajor,
    strMinor,
    strBuild,
    strOption,
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
  let option = '';
  if (versions.length === 4) {
    option = strOption;
  }
  browsers.major = major;
  browsers.version = parseFloat(`${major}.${minor}${build}${option}`);
  browsers.numbers = versions;
};

/**
 * browser 判別します
 * {@link Firefox}
 * @since 0.4.2
 */
const init = () => {
  if (browsers) {
    return;
  }
  // browsers = Object.assign({}, devices.browsers);
  browsers = {...{}};
  const { ua } = devices;
  const firefox = !!ua.match(/firefox/i);
  browsers.firefox = firefox;
  if (firefox) {
    version();
  }
};

/**
 * Firefox detector
 * @since 0.4.2
 */
export default class Firefox {
  /**
   * 書き換え済み `browsers` を取得します
   * @returns {Object} 書き換え済み `browsers` を返します
   */
  static browsers() {
    init();
    return browsers;
  }

  /**
   * iOS Chrome 判定
   * @returns {boolean} true: iOS Chrome
   */
  static is() {
    init();
    return browsers.firefox;
  }

  /**
   * Firefox Browser version
   * @returns {number} Firefox version, not Android -1
   */
  static version() {
    init();
    return browsers.version;
  }

  /**
   * Firefox Browser major version
   * @returns {number} Firefox major version, not Android -1
   */
  static major() {
    init();
    return browsers.major;
  }

  /**
   * Firefox Browser version `major.minor.build`
   * @returns {string} Firefox version NN.NN.NN.NN 型（文字）で返します
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
