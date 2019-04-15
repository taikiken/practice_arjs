/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/20 - 10:54
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Events from '../Events';

/**
 * {@link Scroll} Events
 */
export default class ScrollEvents extends Events {
  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
   * custom Event Object
   * @param {string} type イベント種類
   * @param {*} currentTarget current イベント発生インスタンス
   * @param {*} [target=undefined] イベント発生インスタンス
   * */
  constructor(type, currentTarget, target = undefined) {
    super(type, currentTarget, target);
    /**
     * scroll top 前回位置(px)
     * @type {number}
     */
    this.previous = -1;
    /**
     * オリジナルイベント(window.onscroll)
     * @type {?Events|Event}
     */
    this.original = null;
    /**
     * scroll top 現在位置(px)
     * @type {number}
     */
    this.y = 0;
    /**
     * window innerHeight
     * @type {number}
     */
    this.height = 0;
    /**
     * window innerWidth
     * @type {number}
     */
    this.width = 0;
    /**
     * window 下端位置(scroll top + window height)
     * @type {number}
     */
    this.bottom = 0;
    /**
     * scroll top 位置が前回と違うかを表すフラッグ, true: 違う
     * @type {boolean}
     */
    this.changed = false;
    /**
     * UP / DOWN と前回からの移動距離(px), 正(+): scroll down
     * @type {number}
     */
    this.moving = 0;
  }
}
