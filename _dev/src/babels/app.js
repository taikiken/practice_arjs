/**
 * @license MIT
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 * @author (at)taikiken / http://inazumatv.com
 */

/**
 * build 情報を管理します
 */
class Identity {
  /**
   * build time - `process.env.BUILD_TIME` を使用します
   * @type {string}
   */
  static build = `${process.env.BUILD_TIME}`;

  /**
   * build time を出力します
   */
  static verbose() {
    console.warn(`[APP] build time - ${Identity.build}`);
  }
}

if (process.env.NODE_ENV !== 'production') {
  Identity.verbose();
}
