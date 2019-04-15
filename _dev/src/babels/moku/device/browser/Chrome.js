/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/09/22 - 19:27
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */


import devices from '../devices';
import CriOS from './CriOS';
import Edge from './Edge';
import EdgiOS from './EdgiOS';
import EdgA from './EdgA';

/**
 * {@link devices}.browsers
 * {@link Chrome}
 * @type {?object}
 * @since 0.4.2
 */
let browsers = null;

/**
 * version 情報を計算します
 * {@link Chrome}
 * @since 0.4.2
 */
const version = () => {
  const { app } = devices;
  const numbers = app.match(/chrome\/(\d+)\.(\d+)\.(\d+)\.?(\d+)?/i);
  if (!Array.isArray(numbers)) {
    return;
  }
  // 先頭 削除
  numbers.shift();
  const versions = numbers.map((number, index) => {
    const int = parseInt(number, 10);
    if (index <= 3) {
      return Number.isNaN(int) ? 0 : int;
    }
    return null;
  });
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
 * {@link Chrome}
 * @since 0.4.2
 */
const init = () => {
  if (browsers) {
    return;
  }
  // browsers = Object.assign({}, devices.browsers);
  browsers = {...{}};
  const crios = CriOS.is();
  const edge = Edge.is();
  let chrome = false;
  if (
    !edge
    && !EdgiOS.is()
    && !EdgA.is()
  ) {
    if (crios) {
      // iOS chrome
      chrome = true;
    } else {
      const { ua } = devices;
      chrome = !!ua.match(/chrome/i);
    }
  }
  browsers.chrome = chrome;
  if (chrome) {
    version();
  }
};

/**
 * Chrome detector
 * @since 0.4.2
 */
export default class Chrome {
  /**
   * 書き換え済み `browsers` を取得します
   * @returns {Object} 書き換え済み `browsers` を返します
   */
  static browsers() {
    init();
    return browsers;
  }

  /**
   * Chrome 判定
   * @returns {boolean} true: Chrome
   */
  static is() {
    init();
    return browsers.chrome;
  }

  /**
   * Chrome Browser version
   * @returns {number} Chrome version, not Android -1
   */
  static version() {
    init();
    return browsers.version;
  }

  /**
   * Chrome Browser major version
   * @returns {number} Chrome major version, not Android -1
   */
  static major() {
    init();
    return browsers.major;
  }

  /**
   * Chrome Browser version `major.minor.build`
   * @returns {string} Chrome version NN.NN.NN.NN 型（文字）で返します
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
