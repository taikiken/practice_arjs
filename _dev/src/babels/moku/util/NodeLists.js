/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/06/16 - 19:13
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * Array.from(nodeList) が Android で error になるから polyfill する
 */
export default class NodeLists {
  /**
   * Array.from 使えないので for...i iteration する
   * @param {NodeList} elements 処理対象
   * @returns {Array} 配列変換し返します
   */
  static from(elements) {
    const data = [];
    const limit = elements.length;
    for (let i = 0; i < limit; i += 1) {
      data.push(elements[i]);
    }
    return data;
  }

  /**
   * Array.from 使用判定を行い、
   * 使用できない時は {@link NodeLists.from} を実行します
   * @param {NodeList} elements 処理対象
   * @returns {Array} 配列変換し返します
   */
  static get(elements) {
    if (!Array.from) {
      return NodeLists.from(elements);
    }
    return Array.from(elements);
  }
}
