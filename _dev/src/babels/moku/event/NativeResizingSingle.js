/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/09 - 18:47
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import NativeResizing from './NativeResizing';

/**
 * singleton Resizing instance
 * @type {?NativeResizing}
 */
let instance = null;

/**
 * Resizing instance を singleton 提供します
 */
export default class NativeResizingSingle {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * NativeResizing instance を singleton 提供します
   * @returns {NativeResizing} NativeResizing instance
   */
  static factory() {
    if (!instance) {
      instance = new NativeResizing();
    }
    return instance;
  }
}
