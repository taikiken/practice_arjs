/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/04 - 16:46
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import EventDispatcher from '../event/EventDispatcher';
// import Events from '../event/Events';

// tick
import Cycle from './Cycle';

// tick/events
import PollingEvents from './events/PollingEvents';
// import CycleEvents from './events/CycleEvents';

/**
 * 一定間隔毎に UPDATE イベントを発生させます
 *
 * @example
 * // 3sec. interval
 * const polling = new Polling(1000 * 3);
 * const update = () => {
 *  // code here, something do
 * };
 * polling.on(Polling.UPDATE, update);
 * polling.start();
 */
export default class Polling extends EventDispatcher {
  // ----------------------------------------
  // STATIC EVENT
  // ----------------------------------------
  /**
   * 一定間隔(milliseconds)毎に発生するイベント - pollingUpdate
   * @event UPDATE
   * @type {string}
   */
  static UPDATE = 'pollingUpdate';

  // ----------------------------------------
  // CALLBACK
  // ----------------------------------------
  /**
   * Cycle.UPDATE event handler, polling を計測しイベントを発火するかを判断します
   *
   * @param {CycleEvents} events Cycle event object
   * @listens {Cycle.UPDATE} Cycle.UPDATE が発生すると実行されます
   * @returns {boolean} Polling.UPDATE event が発生すると true を返します
   */
  onUpdate = (events) => {
    // 現在時間
    // @type {number}
    const present = Date.now();
    // @type {number} - interval 間隔
    // const interval = this.interval;
    // @type {number} - 開始時間
    const { begin, interval } = this;
    // 現在時間 が interval より大きくなったか
    if ((present - begin) >= interval) {
      // event 発火
      this.fire(this.updateEvents(begin, present, events));
      // 開始時間を update
      this.begin = present;
      // event 発生
      return true;
    }
    return false;
  };

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * 引数の polling に合わせ UPDATE イベントを発生させます
   * @param {number} [interval=1000] イベント発生間隔 milliseconds
   */
  constructor(interval = 1000) {
    super();
    /**
     * Cycle instance を取得します
     * @ty[e {Cycle}
     */
    this.cycle = Cycle.factory();
    /**
     * 間隔(ms)
     * @type {number}
     */
    this.interval = interval;
    // /**
    //  * bound onUpdate, Cycle.UPDATE event handler
    //  * @returns {function}
    //  */
    // this.onUpdate = this.onUpdate.bind(this);
    /**
     * Events instance - Polling.UPDATE Events object
     * @type {Events}
     */
    this.events = new PollingEvents(Polling.UPDATE, this, this);
    /**
     * polling event 発生時間, event を発火すると 0 にリセットされます
     * @type {number}
     */
    this.begin = 0;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * polling 時間を変更します<br>
   * 1. プロパティ polling 変更
   * 1. update 実行
   * @param {number} interval polling 時間
   * @returns {boolean} `update` をコールし Polling.UPDATE event が発生すると true を返します
   */
  change(interval) {
    this.interval = interval;
    return this.start();
  }

  /**
   * polling を開始します
   * @returns {boolean} start に成功すると true を返します
   */
  start() {
    // event unbind
    this.stop();
    // @type {number} - 開始時間
    this.begin = Date.now();
    this.cycle.on(Cycle.UPDATE, this.onUpdate);
    return true;
  }

  /**
   * polling を止めます
   * @returns {boolean} stop に成功すると true を返します
   */
  stop() {
    this.cycle.off(Cycle.UPDATE, this.onUpdate);
    return true;
  }

  // -----
  // event create & fire
  /**
   * events object を発火前に作成します
   * @param {number} begin 開始時間: 前回の発火時間
   * @param {number} present 現在時間
   * @param {CycleEvents} cycleEvents Cycle event object
   * @returns {Events} アップデートした Events を返します
   */
  updateEvents(begin, present, cycleEvents) {
    this.begin = begin;
    // @type {Events} - start event
    const { events } = this;
    events.begin = begin;
    events.present = present;
    events.interval = this.interval;
    events.cycleEvents = cycleEvents;
    return events;
  }

  /**
   * Polling.UPDATE event を発生します
   * @param {Events} events Polling.UPDATE event object
   * @returns {void}
   */
  fire(events) {
    this.dispatch(events);
  }
}
