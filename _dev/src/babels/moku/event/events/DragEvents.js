/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/09/30 - 18:19
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Events from '../Events';

/**
 * drag events
 * @since v0.4.4
 */
export default class DragEvents extends Events {
  /**
   * drag events
   * @param {string} type event type
   * @param {*} currentTarget currentTarget instance
   * @param {*} target target instance
   * @param {number} x drag px
   */
  constructor(type, currentTarget, target, x) {
    super(type, currentTarget, target);
    /**
     * drag px
     * @type {number}
     */
    this.x = x;
  }
}
