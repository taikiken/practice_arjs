/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/09/30 - 18:21
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import EventDispatcher from './EventDispatcher';
import Events from './Events';

// event/events
import DragEvents from './events/DragEvents';
import Touching from './Touching';

/**
 * touch 端末 swipe 監視を行います
 * @since v0.4.4
 */
export default class Swipe extends EventDispatcher {
  // ----------------------------------------
  // EVENT
  // ----------------------------------------
  /**
   * LEFT - left
   * @type {string}
   */
  static LEFT = 'left';

  /**
   * RIGHT - right
   * @type {string}
   */
  static RIGHT = 'right';

  /**
   * END - end
   * @type {string}
   */
  static END = 'end';

  /**
   * DRAG - drag'
   * @type {string}
   */
  static DRAG = 'drag';

  // ----------------------------------------
  // CALLBACK
  // ----------------------------------------
  /**
   * touchstart - event handler
   */
  onStart = () => {
    this.dispose();
    this.reset();
    // ----
    const { touching } = this;
    touching.on(Touching.MOVE, this.onMove);
    touching.on(Touching.END, this.onEnd);
    touching.on(Touching.CANCEL, this.onCancel);
  };

  /**
   * touchmove {@link Touching}.MOVE - event handler
   * @param {TouchingEvents} events events.between.y で移動量を計算します
   */
  onMove = (events) => {
    // 移動量を累積する
    this.dragging += events.between.x;
    this.drag(this.dragging);
    if (this.swipeCheck()) {
      this.dispose();
      this.reset();
    }
  };

  /**
   * touchend {@link Touching}.END - event handler
   * @param {TouchingEvents} events events.between.y で移動量を計算します
   */
  onEnd = (events) => {
    // 移動量を累積する
    this.dragging += events.between.x;
    this.drag(this.dragging);
    // ---
    const move = this.swipeCheck();
    if (!move) {
      this.dispatch(this.events.end);
    }
    // ---
    this.dispose();
    this.reset();
  };

  /**
   * touchend {@link Touching}.CANCEL - event handler
   * - 処理を中止します
   */
  onCancel = () => {
    this.dispose();
    this.reset();
    this.dispatch(this.events.end);
  };

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * touch event 管理を行います
   * @param {Element} element touch target Element
   * @param {Touching} touching - 設定済み {@link Touching} instance
   * @param {number} [marginal=10] 閾値 X 方向 - 絶対値が超えると swipe event 発火します
   */
  constructor(element, touching, marginal = 10) {
    super();
    // ---`
    /**
     * drag / swipe target Element
     * @type {Element}
     */
    this.element = element;
    /**
     * touch event 管理
     * @type {Touching}
     */
    this.touching = touching;
    /**
     * 閾値 X 方向
     * @type {number}
     */
    this.marginal = marginal;
    // /**
    //  * bound onStart - touchstart event handler
    //  * @type {function}
    //  */
    // this.onStart = this.onStart.bind(this);
    // /**
    //  * bound onMove - touchmove event handler
    //  * @type {function}
    //  */
    // this.onMove = this.onMove.bind(this);
    // /**
    //  * bound onEnd - touchend event handler
    //  * @type {function}
    //  */
    // this.onEnd = this.onEnd.bind(this);
    // /**
    //  * bound onCancel - touchcancel event handler
    //  * @type {function}
    //  */
    // this.onCancel = this.onCancel.bind(this);
    /**
     * X 移動量を累積加算します
     * @type {number}
     */
    this.dragging = 0;
    /**
     * Swipe Events
     * - left - swipe left
     * - right - swipe right
     * - end - drag end
     * - drag - dragging
     * @type {{left: Events, right: Events, end: Events, drag: DragEvents}}
     */
    this.events = {
      left: new Events(Swipe.LEFT, this, this),
      right: new Events(Swipe.RIGHT, this, this),
      end: new Events(Swipe.END, this, this),
      drag: new DragEvents(Swipe.DRAG, this, this, 0),
    };
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * x 方向閾値(`marginal`)超えているかをチェックします
   * - 超えているときは swipe 方向を check し `swipe` event を発火します
   *   - 負数 - swipe left
   *   - 正数 - swipe right
   * @return {boolean} true: 超えている
   */
  swipeCheck() {
    const move = Math.abs(this.dragging) > this.marginal;
    if (move) {
      if (this.dragging < 0) {
        this.dispatch(this.events.left);
      } else {
        this.dispatch(this.events.right);
      }
    }
    return move;
  }

  /**
   * {@link Touching}.[MOVE|END|CANCEL] unbind します
   */
  dispose() {
    const { touching } = this;
    touching.off(Touching.MOVE, this.onMove);
    touching.off(Touching.END, this.onEnd);
    touching.off(Touching.CANCEL, this.onCancel);
  }

  /**
   * drag 量を `0` にします
   */
  reset() {
    this.dragging = 0;
  }

  /**
   * drag `x` value と共に通知します
   * @param {number} x 移動(px)
   */
  drag(x) {
    const events = this.events.drag;
    events.x = x;
    this.dispatch(events);
  }

  /**
   * {@link Touching}.START 監視を始めます
   */
  start() {
    this.stop();
    const { touching } = this;
    touching.on(Touching.START, this.onStart);
    touching.start();
  }

  /**
   * {@link Touching}.START 監視を停止します
   */
  stop() {
    const { touching } = this;
    touching.off(Touching.START, this.onStart);
    touching.stop();
    this.dispose();
  }
}
