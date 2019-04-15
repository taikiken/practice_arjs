/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/06/02 - 15:42
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import Events from '../../event/Events';

/**
 * {@link Polling} Events
 */
export default class PollingEvents extends Events {
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
    // ---
    /**
     * polling event 発生時間
     * @type {number}
     */
    this.begin = 0;
    /**
     * 現在時間 - Date.now
     * @type {number}
     */
    this.present = 0;
    /**
     * イベント間隔(ms)
     * @type {number}
     */
    this.interval = 0;
    /**
     * CycleEvents
     * @type {CycleEvents}
     * @since 2018-01-20
     */
    this.cycleEvents = 0;
  }
}
