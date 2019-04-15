/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/16 - 14:45
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// // --------------------------------
// // copy [native code]
// /**
//  * copy [native code] - decodeURIComponent
//  * @type {function}
//  */
// const decodeURIComponent = self.decodeURIComponent;
// /**
//  * copy [native code] - encodeURIComponent
//  * @type {function}
//  */
// const encodeURIComponent = self.encodeURIComponent;
// /**
//  * copy [native code] - RegExp
//  * @type {function}
//  */
// const RegExp = self.RegExp;

/**
 * cookie を取得・保存・削除します
 */
export default class Cookie {
  /**
   * cookie を処理します
   *
   * インスタンスは key 毎に作成します
   * @param {string} keyName cookie key
   * @param {?Date} [endValue=null] cookie end Date instance, null の時はプラウザ `quit` で削除されます
   * @param {string} [defaultPath='/'] cookie path
   * @param {string} [defaultDomain=''] cookie domain
   * @param {boolean} [secureSetting=false] true: https 通信のときのみ、クッキーが送信されます
   */
  constructor(
    keyName,
    endValue = null,
    defaultPath = '/',
    defaultDomain = '',
    secureSetting = false,
  ) {
    let key = keyName;
    let end = endValue;
    let path = defaultPath;
    let domain = defaultDomain;
    let secure = secureSetting;

    /**
     * cookie key を取得します
     * @returns {string} cookie key を返します
     */
    this.key = () => key;
    /**
     * cookie key を設定します
     * @param {string} setting 設定する key name
     */
    this.setKey = (setting) => { key = setting; };
    /**
     * cookie end を取得します
     * @returns {?Date} cookie end Date instance
     */
    this.end = () => end;
    /**
     * cookie end を設定します
     * @param {Date} setting cookie end Date instance
     */
    this.setEnd = (setting) => { end = setting; };
    /**
     * cookie path を取得します
     * @returns {string} cookie path を返します
     */
    this.path = () => path;
    /**
     * cookie path を設定します
     * @param {string} setting 設定する path name
     */
    this.setPath = (setting) => { path = setting; };
    /**
     * cookie domain を取得します
     * @returns {string} cookie domain を返します
     */
    this.domain = () => domain;
    /**
     * cookie domain を設定します
     * @param {string} setting 設定する domain name
     */
    this.setDomain = (setting) => { domain = setting; };
    /**
     * https 通信のときのみクッキー送信を行うかのフラッグを取得します
     * @returns {boolean} https 通信のときのみクッキー送信を行うかのフラッグ
     */
    this.secure = () => secure;
    /**
     * https 通信のときのみクッキー送信を行うかのフラッグを設定します
     * @param {boolean} setting https 通信のときのみクッキー送信を行うかのフラッグ
     */
    this.setSecure = (setting) => { secure = setting; };
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * cookie value を取得します
   * @returns {string|null} cookie value を返します
   */
  get() {
    return Cookie.get(this.key());
  }

  /**
   * cookie value を設定します
   * @param {string} value cookie value
   * @param {?Date} [end=null] cookie end Date instance, null の時はプラウザ `quit` で削除されます
   * @param {string} [path='/'] cookie path
   * @param {string} [domain=''] cookie domain
   * @param {boolean} [secure=false] true: https 通信のときのみ、クッキーが送信されます
   * @returns {string} 設定した cookie 文字列
   */
  set(value, end = this.end(), path = this.path(), domain = this.domain(), secure = this.secure()) {
    return Cookie.set(this.key(), value, end, path, domain, secure);
  }

  /**
   * cookie を削除します
   * @returns {boolean} true: cookie 削除成功
   */
  remove() {
    return Cookie.remove(this.key());
  }

  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * cookie value を取得します
   * @param {string} key 取得する cookie key 名称
   * @returns {string|null} cookie value
   */
  static get(key) {
    const { cookie } = document;
    const escapeKey = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
    const exp = new RegExp(`(?:(?:^|.*;)\\s*${escapeKey}\\s*\\=\\s*([^;]*).*$)|^.*$`);
    return decodeURIComponent(cookie.replace(exp, '$1')) || null;
  }

  /**
   * cookie value を設定します
   * @param {string} key cookie key
   * @param {string} value cookie value
   * @param {?Date} [end=null] cookie end date Date instance
   * @param {string} [path=/] cookie path
   * @param {string} [domain=''] cookie domain
   * @param {boolean} [secure=false] true: https 通信のときのみ、クッキーが送信されます
   * @returns {string} 設定した cookie 文字列
   */
  static set(key, value, end = null, path = '/', domain = '', secure = false) {
    let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (end) {
      cookie += `; expires=${end.toUTCString()}`;
    }
    if (path) {
      cookie += `; path=${path}`;
    }
    if (domain) {
      cookie += `; domain=${domain}`;
    }
    if (secure) {
      cookie += '; secure';
    }
    document.cookie = cookie;
    return cookie;
  }

  /**
   * cookie を削除します
   *
   * 現在時間より前の時刻を設定します
   * @param {string} key cookie key
   * @returns {boolean} true: 削除成功
   */
  static remove(key) {
    if (Cookie.has(key)) {
      Cookie.set(key, '', new Date());
      return true;
    }
    return false;
  }

  /**
   * cookie key が存在するかを調べます
   * @param {string} key cookie key
   * @returns {boolean} true: cookie key が存在します
   */
  static has(key) {
    return Cookie.get(key) !== null;
  }
}
