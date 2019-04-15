/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/30 - 15:16
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Scrolling from './Scrolling';

/**
 * singleton instance, nullable
 * @type {?Scrolling}
 * @private
 */
let instance = null;

/**
 * Scrolling instance を singleton 提供します
 */
export default class ScrollingSingle {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * Scrolling instance を singleton を保証し作成します
   * @returns {Scrolling} Scrolling instance を返します
   */
  static factory() {
    if (instance === null) {
      instance = new Scrolling();
    }
    return instance;
  }
}
