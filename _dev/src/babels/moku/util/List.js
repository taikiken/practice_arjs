/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/10/26 - 14:57
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Type from './Type';

/**
 * Array（配列）Utility
 */
export default class List {
  /**
   * Array.prototype.fill, polyfill
   * @param {number} lengthData 配列長
   * @param {*} value fill する値
   * @returns {Array.<*>} fill 後の配列を返します
   * @private
   */
  static filling(lengthData, value) {
    let length = lengthData;
    const arr = [].slice(0);
    while (length > 0) {
      arr.push(value);
      length -= 1;
    }
    return arr;
  }

  /**
   * Array.prototype.fill を行います
   * @param {number} length 配列長
   * @param {*} value fill する値
   * @returns {Array.<*>} fill 後の配列を返しますd
   */
  static fill(length, value = 0) {
    // 関数が使えない時は polyfill 関数を使用します
    if (!Type.method(Array.prototype.fill)) {
      return List.filling(length, value);
    }
    // native method
    return new Array(length).fill(value);
  }

  /**
   * 複数の配列を `concat` marge 結合します
   * @param {*} args 複数の配列
   * @returns {*[]} 複数の配列を結合し返します
   * @see https://gist.github.com/yesvods/51af798dd1e7058625f4
   */
  static marge(...args) {
    return args.reduce((acc, val) => ([...acc, ...val]));
  }

  /**
   * 配列内配列（多次元配列）を1階層にします
   * @param {*} arr 多次元配列
   * @returns {*[]} 多次元配列を1階層にし返します
   * @see https://stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
   */
  static flatten(arr) {
    const flat = [].concat(...arr);
    return flat.some(Array.isArray) ? List.flatten(flat) : flat;
  }
}
