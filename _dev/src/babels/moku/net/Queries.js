/**
 * license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/23
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

import Text from '../util/Text';

/**
 * URL query をパースします
 */
export default class Queries {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * `&amp;` を `&` へ置換えます
   * @param {string} targetText 操作対象文字列
   * @returns {string} `&amp;` を `&` へ置換え返します
   */
  static amp(targetText) {
    return targetText.split('&amp;').join('&');
  }
  /**
   * 文字列先頭に `?` があればそれ以降の文字列を返し {@link Text.and} を実行し `&amp;` を `&` 変換します
   * @param {string} targetText 操作対象文字列
   * @returns {string} query を正規化します
   */
  static naked(targetText) {
    // const queryString = Queries.amp(targetText);
    const queryString = Text.and(targetText);
    return queryString.substr(0, 1) === '?' ? queryString.substring(1) : targetText;
  }

  /**
   * query を kye: value 形式にします
   * @param {string} targetText 操作対象文字列
   * @returns {[Object, Array]} data, keys を返します
   */
  static parse(targetText) {
    const query = Queries.naked(targetText);
    const pairs = query.split('&');
    const data = {};
    const keys = [];
    pairs.map((pair) => {
      let keyName = '';
      if (pair && pair.indexOf('=') !== -1) {
        // @type {Array<string>} - `key=value` を `=` で分割する
        const keyValue = pair.split('=');
        // @type {string} keyName
        const key = keyValue.shift();
        // data object へ keyName を key に値をセットする
        data[key] = keyValue.shift();
        keyName = key;
        // key 名称配列へ追加する
        keys.push(key);
      }
      return keyName;
    });

    return [data, keys];
  }

  /**
   * 引数 targetText (query) から引数 keyName 値を取得します
   * @param {string} keyName key 名称
   * @param {string} targetText query
   * @returns {string|undefined} 見つかると文字列で返します, 見つからない時は undefined を返します
   */
  static get(keyName, targetText = window.location.search) {
    const [data] = Queries.parse(targetText);
    return data[keyName];
  }

  /**
   * URL query の key: value 形式を取得します
   * @param {string} targetText query
   * @returns {[Object, Array]} URL query を key: value 形式で返します
   */
  static getAll(targetText = window.location.search) {
    // const [data] = Queries.parse(targetText);
    return Queries.parse(targetText);
  }

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * URL query を受取パースします
   * @param {string} [queryString=location.search] パースする URL 文字列
   */
  constructor(queryString = window.location.search) {
    const [data, keys] = Queries.parse(queryString);
    // const naked = Queries.naked(queryString);
    /**
     * query key を取得します - query key array
     * @type {Array<string>}
     */
    this.keys = keys;
    /**
     * key: value 形式を取得します - URL query を key: value 形式で返します
     * @type {Object}
     */
    this.data = data;
    // /**
    //  * query 文字列を取得します - パースする query 文字列
    //  * @type {string}
    //  */
    // this.queryString = queryString;
    // /**
    //  * パースしやすいように正規化した query 文字列 - `?` 以降文字 + `&amp;` を `&` へ置換えます
    //  * @type {string}
    //  */
    // this.naked = naked;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * key が存在するかを調べます
   * @param {string} keyName 調査対象 key 名称
   * @returns {boolean} true: 存在する
   */
  has(keyName) {
    return this.keys.indexOf(keyName) !== -1;
  }

  /**
   * key 値を取得します
   * @param {string} keyName 調査対象 key 名称
   * @returns {string|undefined} 見つかると文字列で返します, 見つからない時は undefined を返します
   */
  get(keyName) {
    return this.data[keyName];
  }

  /**
   * key: value 形式を取得します
   * @returns {Object} URL query を key: value 形式で返します
   */
  getAll() {
    return this.data;
  }
}
