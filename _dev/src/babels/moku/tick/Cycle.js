/**
 * license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/03
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

// event
import EventDispatcher from '../event/EventDispatcher';
// import Events from '../event/Events';

// tick/events
import CycleEvents from './events/CycleEvents';

/**
 * new を許可しないための Symbol
 * @type {symbol}
 * @private
 */
const singletonSymbol = Symbol('Cycle singleton instance');
/**
 * singleton instance, nullable
 * @type {?Cycle}
 * @private
 */
let instance = null;

/**
 * requestAnimationFrame を使用しループイベントを発生させます
 * singleton です。 new ではなく factory を使用し instance を作成します
 *
 * ```
 * const loop = Cycle.factory();
 * const update = () => {
 *  // code here, something do
 * };
 * loop.on(Cycle.UPDATE, update);
 * ```
 *
 * Cycle は `requestAnimationFrame` を auto start させます
 *
 * - 【注意】requestAnimationFrame は tab が active(focus) な時のみ発生します
 * - `blur` 時にも動作させたい時は使用しないでください。`setTimeout` の利用を検討してください
 */
export default class Cycle extends EventDispatcher {
  // ----------------------------------------
  //  CONSTANT / EVENT
  // ----------------------------------------
  /**
   * requestAnimationFrame 毎に発生するイベント - cycleUpdate
   * @event UPDATE
   * @type {string}
   */
  static UPDATE = 'cycleUpdate';

  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * Cycle instance を singleton を保証し作成します
   * @returns {Cycle} Cycle instance を返します
   */
  static factory() {
    if (instance === null) {
      instance = new Cycle(singletonSymbol);
    }
    return instance;
  }


  // ----------------------------------------
  // CALLBACK
  // ----------------------------------------
  /**
   * loop(requestAnimationFrame)コールバック関数
   * - Cycle.UPDATE event を発火します
   * @param {number} [time=0] animation time
   * @returns {number} requestAnimationFrame ID
   */
  onUpdate = (time = 0) => {
    // @type {number} - requestAnimationFrame id
    const id = requestAnimationFrame(this.onUpdate);
    this.id = id;

    // @type {Events} - events
    const { events } = this;
    events.id = id;
    events.time = time;
    // event fire
    this.dispatch(events);
    return id;
  };

  // ----------------------------------------
  //  CONSTRUCTOR
  // ----------------------------------------
  /**
   * singleton です
   * @param {symbol} checkSymbol singleton を保証するための private instance
   * @returns {Cycle} singleton instance を返します
   */
  constructor(checkSymbol) {
    // checkSymbol と singleton が等価かをチェックします
    if (checkSymbol !== singletonSymbol) {
      throw new Error('don\'t use new, instead use static factory method.');
    }
    // instance 作成済みかをチェックし instance が null の時 this を設定します
    if (instance !== null) {
      return instance;
    }
    super();
    // -------------------------------
    // onetime setting
    /**
     * Cycle.UPDATE Events instance
     * @type {Events}
     */
    this.events = new CycleEvents(Cycle.UPDATE, this, this);
    // /**
    //  * bound update requestAnimationFrame callback
    //  * @type {function}
    //  */
    // this.onUpdate = this.onUpdate.bind(this);
    /**
     * requestAnimationFrame ID
     * @type {number}
     */
    this.id = 0;
    // instance 作成時に自動スタートさせる
    this.start(checkSymbol);
    // 設定済み instance を返します
    return this;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * loop(requestAnimationFrame) を開始します
   * @private
   * @param {Symbol} checkSymbol inner method 保証する inner Symbol
   */
  start(checkSymbol) {
    // checkSymbol と singleton が等価かをチェックします
    if (checkSymbol !== singletonSymbol) {
      throw new Error('start is private method, dont call this.');
    }
    this.onUpdate();
  }

  /**
   * loop(cancelAnimationFrame) を止めます
   * @param {number} [id] requestAnimationFrame id を使い cancelAnimationFrame をします
   */
  stop(id = this.id) {
    cancelAnimationFrame(id);
  }
}
