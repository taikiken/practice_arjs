/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/26 - 19:12
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import EventDispatcher from './EventDispatcher';
import WheelEvents from './events/WheelEvents';

/**
 * mousewheel event を監視し通知を行います
 *
 * singleton です new ではなく factory を使用し instance を作成します
 *
 * event handler 引数 `events` は {@link WheelEvents} instance です
 * - events.moved > 0 - wheel up
 *
 * @example
 *  const up = (events) => {
 *    // wheel up
 *  };
 *  const down = (events) => {
 *    // wheel down
 *  };
 *  const update = (events) => {
 *    // wheel up / down
 *  };
 *  const wheel = new Wheel();
 *  wheel.threshold = 500;
 *  wheel.on(Wheel.UP, up);
 *  wheel.on(Wheel.DOWN, down);
 *  wheel.on(Wheel.UPDATE, update);
 *  wheel.start();
 */
export default class Wheel extends EventDispatcher {
  // ----------------------------------------
  // EVENT
  // ----------------------------------------
  /**
   * wheel up で発生するイベント - wheelUp
   * @type {string}
   */
  static UP = 'wheelUp';

  /**
   * wheel down で発生するイベント - wheelDown
   * @type {string}
   */
  static DOWN = 'wheelDown';

  /**
   * wheel move で発生するイベント - wheelUpdate
   * @type {string}
   */
  static UPDATE = 'wheelUpdate';

  // ---------------------------------------------------
  //  CALLBACK
  // ---------------------------------------------------
  /**
   * window mousewheel event handler
   * <p>delta 値を取得し `this.moving` を実行します</p>
   *
   * @listens {WheelEvent} WheelEvent.wheel
   * @param {WheelEvent} event window wheel event
   * @returns {number} 前回移動量に delta 値 を加算した値を返します
   */
  onMouseWheel = (event) => {
    const { deltaY } = event;
    return this.moving(deltaY);
  };

  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
   * wheel event を管理します
   * @param {number} [threshold=200] 閾値 - event を発生させる移動量(px)
   */
  constructor(threshold = 200) {
    super();
    // /**
    //  * bound onMouseWheel
    //  * @type {function}
    //  */
    // this.onMouseWheel = this.onMouseWheel.bind(this);
    /**
     * 閾値, wheel 移動量が閾値を超えたときにイベントを発生させます
     * @type {number}
     * @default 200
     */
    this.threshold = threshold;
    /**
     * wheelDelta 移動量が閾値を超えるかをチェックするための積算計算変数
     * @type {number}
     */
    this.moved = 0;
    // /**
    //  * start flag
    //  * @type {boolean}
    //  */
    // this.started = false;
    // const events = {
    //   up: new WheelEvents(Wheel.UP, this),
    //   down: new WheelEvents(Wheel.DOWN, this),
    // };
    /**
     * UP / DOWN Events instance
     * @returns {{up: WheelEvents, down: WheelEvents, update: WheelEvents}} UP / DOWN Events instance
     */
    this.events = {
      up: new WheelEvents(Wheel.UP, this, this),
      down: new WheelEvents(Wheel.DOWN, this, this),
      update: new WheelEvents(Wheel.UPDATE, this, this),
    };

    // 設定済み instance を返します
    // return this;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * 移動量積算 property を `0` にします
   */
  reset() {
    this.moved = 0;
  }

  /**
   * mousewheel event を監視します
   * @returns {Wheel} method chain 可能なように instance を返します
   */
  start() {
    // if (this.started) {
    //   return this;
    // }
    // this.started = true;
    // this.unwatch();
    this.stop();
    this.reset();
    window.addEventListener('wheel', this.onMouseWheel, false);
    return this;
  }

  /**
   * mousewheel event を監視を止めます
   * @returns {Wheel} method chain 可能なように instance を返します
   */
  stop() {
    // if (!this.started) {
    //   return this;
    // }
    // this.started = false;
    window.removeEventListener('wheel', this.onMouseWheel);
    return this;
  }

  /**
   * mouse delta から移動量を計算します
   * @param {number} delta mouse delta 値
   * @returns {number} 前回移動量に delta 値 を加算した値を返します
   */
  moving(delta) {
    /**
     * 移動量が閾値を超えるかをチェックするための計算変数
     * @type {number}
     */
    this.moved += delta;
    // @type {number}
    const { moved } = this;

    // 0 check
    if (moved === 0) {
      // 移動量が 0 なので処理をしない
      return moved;
    }

    // 閾値チェック
    if (Math.abs(moved) >= this.threshold) {
      // scroll event を発火します
      this.update(moved);
      // down / up
      if (moved > 0) {
        // scroll up
        this.up(moved);
      } else {
        this.down(moved);
      }

      // initialize moved, 発火後に積算移動変数を初期化します
      // this.moved = 0;
      this.reset();
      return moved;
    }
    // 閾値を超えていないので処理をしない
    return moved;
  }

  /**
   * scroll up イベントを発火します
   * @param {number} moved 移動量
   * @returns {number} 加算移動量を返します
   */
  up(moved) {
    // @type {Events}
    const events = this.events.up;
    events.moved = moved;
    this.dispatch(events);

    return moved;
  }

  /**
   * scroll down イベントを発火します
   * @param {number} moved 移動量
   * @returns {number} 加算移動量を返します
   */
  down(moved) {
    // @type {Events}
    const events = this.events.down;
    events.moved = moved;
    this.dispatch(events);

    return moved;
  }

  /**
   * scroll update イベントを発火します
   * @param {number} moved 移動量
   * @returns {number} 加算移動量を返します
   */
  update(moved) {
    // @type {Events}
    const events = this.events.update;
    events.moved = moved;
    this.dispatch(events);

    return moved;
  }
}
