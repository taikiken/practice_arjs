/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/28 - 16:36
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import devices from '../devices';
import Windows from './Windows';

/**
 * {@link devices}.props
 * {@link Android}
 * @type {?object}
 */
let props = null;

/**
 * version 情報を計算します
 * {@link Android}
 */
const version = () => {
  const { app } = devices;
  const numbers = app.match(/android (\d+)\.(\d+)\.?(\d+)?/i);
  if (!Array.isArray(numbers)) {
    return;
  }
  // 先頭の Android 4.3 削除
  numbers.shift();
  const versions = numbers.map((number, index) => {
    const int = parseInt(number, 10);
    if (index < 3) {
      return Number.isNaN(int) ? 0 : int;
    }
    return null;
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
 * {@link Android}
 * - Android standard browser
 *   - `Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13`,
 *   - `Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
 * - Windows phone
 *   - `Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; DEVICE INFO) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.OS_BUILD_NUMBER`
 * - #ref: `https://msdn.microsoft.com/ja-jp/library/hh869301(v=vs.85).aspx`
 * - @see http://googlewebmastercentral.blogspot.jp/2011/03/mo-better-to-also-detect-mobile-user.html
 */
const init = () => {
  if (props) {
    return;
  }
  // props = Object.assign({}, devices.props);
  props = {...devices.props};
  const { ua } = devices;
  // windows phone ua に `Android` が入っている
  const android = !Windows.phone() && !!ua.match(/android/i);
  if (android) {
    props.android = true;
    props.phone = !!ua.match(/mobile/i);
    // phone / tablet
    if (!props.phone) {
      props.tablet = true;
    }
    // Android 標準 browser
    props.standard = devices.safari && (!!ua.match(/version/i) || !!ua.match(/samsungbrowser/i));
    // hd
    props.hd = Math.max(window.innerWidth, window.innerHeight) > 1024;
    // version check
    version();
  }
};

/**
 * Android OS detector
 */
export default class Android {
  /**
   * Android OS
   * @returns {boolean} true: Android OS
   */
  static is() {
    init();
    return props.android;
  }

  /**
   * Android OS && standard browser
   * @returns {boolean} true: Android standard browser
   */
  static standard() {
    init();
    return props.standard;
  }

  /**
   * Android OS && phone
   * @returns {boolean} true: Android phone
   */
  static phone() {
    init();
    return props.phone;
  }

  /**
   * Android OS && tablet
   * @returns {boolean} true: Android tablet
   */
  static tablet() {
    init();
    return props.tablet;
  }

  /**
   * Android OS && HD window
   * @returns {boolean} true: Android HD window
   */
  static hd() {
    init();
    return props.hd;
  }

  /**
   * Android OS version
   * @returns {number} Android OS version, not Android -1
   */
  static version() {
    init();
    return props.version;
  }

  /**
   * Android OS major version
   * @returns {number} Android OS major version, not Android -1
   */
  static major() {
    init();
    return props.major;
  }

  /**
   * Android OS version `major.minor.build`
   * @returns {string} Android OS version NN.NN.NN 型（文字）で返します, not Android ''
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
   * Android 4.3 ~ 4.4 && standard browser
   * - touchend が未実装
   * @returns {boolean} true: Android 4.3 ~ 4.4
   */
  static kitKat() {
    // no touchend - standard browser 4.3 ~ 4.4
    const v = Android.version();
    return Android.standard() && (v > 4.2 && v < 4.5);
  }
}
