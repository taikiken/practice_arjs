/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/04 - 18:02
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */
import ScrollEvents from './ScrollEvents';

/**
 * {@link Resizing} Events
 */
export default class ResizingEvents extends ScrollEvents {
  /**
   * {@link Resizing} Events
   * @param {string} type イベント種類
   * @param {*} currentTarget current イベント発生インスタンス
   * @param {*} [target=undefined] イベント発生インスタンス
   */
  constructor(type, currentTarget, target = undefined) {
    super(type, currentTarget, target);
    // -----
    /**
     * body clientWidth
     * @type {number}
     */
    this.bodyWidth = 0;
    /**
     * body clientHeight
     * @type {number}
     */
    this.bodyHeight = 0;
  }
}
