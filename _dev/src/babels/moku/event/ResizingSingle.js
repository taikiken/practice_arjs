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

import Resizing from './Resizing';

/**
 * singleton Resizing instance
 * @type {?Resizing}
 */
let instance = null;

/**
 * Resizing instance を singleton 提供します
 */
export default class ResizingSingle {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * Resizing instance を singleton 提供します
   * @returns {Resizing} Resizing instance
   */
  static factory() {
    if (!instance) {
      instance = new Resizing();
    }
    return instance;
  }
}
