/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/22 - 11:38
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * Element の CSS class を操作します
 */
export default class Classes {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * 可哀相な IE のための配列コンバーター, `.classList` 代用します
   * @param {Element} element 操作対象 NodeList
   * @returns {Array} 配列にコンバートして返します
   */
  static convert(element) {
    const arr = element.className.split(' ');
    let i = 0;
    const limit = arr.length;
    const empty = [];
    for (;i < limit; i += 1) {
      const className = arr[i];
      if (!!className && className !== ' ') {
        empty.push(className);
      }
    }
    return empty;
  }

  /**
   * 引数 `element` の class name list を取得します
   * 1. `classList` && `Array.from` - `Array.from(element.classList)`
   * 2. {@link Classes.convert}
   * @param {Element} element 操作対象 Element
   * @returns {Array.<string>} 引数 `element` の class を配列変換し返します
   */
  static get(element) {
    return element.classList && Array.from
      ? Array.from(element.classList)
      : Classes.convert(element);
  }

  /**
   * Elementが引数 className を有するかを調べます
   * @param {Element} element 操作対象 Element
   * @param {string} className 調査対象 CSS class name
   * @returns {boolean} 存在すると true を返します
   */
  static has(element, className) {
    return element.classList ?
      element.classList.contains(className) :
      Classes.get(element).includes(className);
    // const elementClasses = Classes.get(element);
    // return elementClasses.indexOf(className) !== -1;
  }

  /**
   * Element へ引数 className を追加します
   * - className 存在チェック
   * -
   * @param {Element} node 操作対象 Element
   * @param {string} className 追加対象 CSS class name
   * @returns {boolean} 追加に成功すると true を返します
   */
  static add(node, className) {
    if (node.classList) {
      node.classList.add(className);
      return true;
    }
    // CSS class の存在チェック
    if (Classes.has(node, className)) {
      return false;
    }
    // argument copy
    const element = node;
    // @type {Array<string>} - element class を取得し配列へ変換
    const elementClasses = Classes.get(element);
    // 置換え配列最後尾に新規 `className` を追加します
    elementClasses.push(className);
    // 配列を ' '（ワンスペース）でつなぎ文字列変換後に設定します
    element.className = elementClasses.join(' ');
    return true;
  }

  /**
   * Element から引数 className を削除します
   * @param {Element} node 操作対象 Element
   * @param {string} className 削除対象 CSS class name
   * @returns {boolean} 削除に成功すると true を返します
   */
  static remove(node, className) {
    if (node.classList) {
      node.classList.remove(className);
      return true;
    }
    if (!Classes.has(node, className)) {
      return false;
    }
    // argument copy
    const element = node;
    // @type {Array<string>} - element class を取得し配列へ変換
    const elementClasses = Classes.get(element);
    // 配列での削除対象 class の位置を取得します
    const index = elementClasses.indexOf(className);
    // 配列位置を元に削除実行します
    elementClasses.splice(index, 1);
    // 削除後配列を ' '（ワンスペース）でつなぎ文字列変換後に設定します
    element.className = elementClasses.join(' ');
    return true;
  }

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * 操作対象 Element を保持します
   * @param {Element} element 操作対象 Element
   */
  constructor(element) {
    /**
     * 操作対象 Element
     * @type {Element}
     */
    this.element = element;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * className を有するかを調べます
   * @param {string} className 調査対象 CSS class name
   * @returns {boolean} 存在すると true を返します
   */
  has(className) {
    return Classes.has(this.element, className);
  }

  /**
   * className を追加します
   * @param {string} className 追加対象 CSS class name
   * @returns {boolean} 追加に成功すると true を返します
   */
  add(className) {
    return Classes.add(this.element, className);
  }

  /**
   * className を削除します
   * @param {string} className 削除対象 CSS class name
   * @returns {boolean} 削除に成功すると true を返します
   */
  remove(className) {
    return Classes.remove(this.element, className);
  }
}
