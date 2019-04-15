/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/22 - 13:53
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * 文字列操作の utility
 */
export default class Text {
  /**
   * camel case を hyphenation に変換します
   * @param {string} str 操作対象文字列
   * @returns {string} キャメルケースをハイフネーションに変換後文字列を返します
   */
  static dash(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  /**
   * camel case へ変換します
   * @param {string} str 操作対象文字列
   * @returns {*|void|string|XML} キャメルケース文字列を返します
   */
  static camel(str) {
    // return str.replace(/^\s+|\s+$/g, '');
    return str.replace(/-([a-z])/g, (g) => {
      const first = g[1];
      return first.toUpperCase();
    });
  }

  /**
   * 数値に3桁区切りの `,` カンマを挿入します
   * @param {number} number カンマを挿入する数値
   * @param {string} [locale=js-JP] ロケール
   * @returns {string} カンマ挿入後の文字列, 小数点なし
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
   * @see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
   */
  static comma(number, locale = 'ja-JP') {
    let numbered = '';
    if (number.toLocaleString) {
      numbered = number.toLocaleString(locale);
    } else {
      numbered = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    // IE 8 `NN.00` にするので `.` 以下削除
    return numbered.split('.').shift();
  }

  /**
   * 文字列の単語を置き換えます
   * @param {string} targetText 置換え対象文字列
   * @param {string} targetWord 置換え元単語
   * @param {string} replaceWord 置換える単語
   * @returns {string} 置換え後の文字列を返します
   */
  static replace(targetText, targetWord, replaceWord) {
    return targetText.split(targetWord).join(replaceWord);
  }

  /**
   * 文字列から単語を削除します
   * @param {string} targetText 置換え対象文字列
   * @param {string} targetWord 削除する単語
   * @returns {string} 削除後の文字列を返します
   */
  static remove(targetText, targetWord) {
    return Text.replace(targetText, targetWord, '');
  }

  /**
   * 文字列の `&` を `&amp;` へ置換えます
   * @param {string} targetText 操作対象文字列
   * @returns {string} `&amp;` 置換え後の文字列を返します
   */
  static amp(targetText) {
    return Text.replace(targetText, '&', '&amp;');
  }

  /**
   * 文字列の `&amp;` を `&` へ置換えます
   * @param {string} targetText 操作対象文字列
   * @returns {string} `&` 置換え後の文字列を返します
   */
  static and(targetText) {
    return Text.replace(targetText, '&amp;', '&');
  }
}
