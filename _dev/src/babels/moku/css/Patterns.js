/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/22 - 13:26
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Text from '../util/Text';

/**
 * CSS short hand pattern を管理します
 */
export default class Patterns {
  /**
   * パターン調査対象の CSS class リスト
   * ```
   * {
   *  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
   *  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
   *  'border-color': [
   *    'borderTopColor',
   *    'borderRightColor',
   *    'borderBottomColor',
   *    'borderLeftColor'],
   *  'border-style': [
   *    'borderTopStyle',
   *    'borderRightStyle',
   *    'borderBottomStyle',
   *    'borderLeftStyle'],
   *  'border-width': [
   *    'borderTopWidth',
   *    'borderRightWidth',
   *    'borderBottomWidth',
   *    'borderLeftWidth'],
   * }
   * ```
   * @returns {Object} パターン調査対象の CSS class list
   */
  static settings() {
    return {
      padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
      margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
      'border-color': [
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
      ],
      'border-style': [
        'borderTopStyle',
        'borderRightStyle',
        'borderBottomStyle',
        'borderLeftStyle',
      ],
      'border-width': [
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
      ],
    };
  }

  /**
   * 引数 `str` が調査対象 className かを判定します
   * @param {string} str CSS className
   * @returns {boolean} 調査対象の時に true を返します
   */
  static match(str) {
    // camel case を dash(hyphenation)へ変換します
    const key = Text.dash(str);
    // settings パターンキーと合致してるかを調査します
    return Object.keys(Patterns.settings()).indexOf(key) !== -1;
  }

  /**
   * 引数 `str` をキーにした操作対象のリストを取得します
   * @param {string} str CSS className
   * @returns {Array<string>|undefined} 引数 `str` をキーにした操作対象のリスト
   */
  static get(str) {
    // camel case を dash(hyphenation)へ変換します
    const key = Text.dash(str);
    return Patterns.settings()[key];
  }
}
