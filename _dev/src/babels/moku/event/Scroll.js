/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/26 - 21:05
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import EventDispatcher from './EventDispatcher';
import ScrollEvents from './events/ScrollEvents';

// util
import Freeze from '../util/Freeze';

/**
 * new を許可しないための inner Symbol
 * @type {symbol}
 * @private
 */
const singletonSymbol = Symbol('Scroll singleton symbol');

/**
 * singleton instance, nullable
 * @type {?Scroll}
 * @private
 */
let instance = null;

/**
 * window scroll event を監視し通知を行います
 * - singleton です。 new ではなく factory を使用し instance を作成します
 *
 * @example
 *  const instance = Scroll.factory();
 */
export default class Scroll extends EventDispatcher {
  // ----------------------------------------
  // STATIC CONST
  // ----------------------------------------
  /**
   * scroll で発生するイベント - `scrollScroll`
   * @event SCROLL
   * @type {string}
   */
  static SCROLL = 'scrollScroll';

  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * Scroll instance を singleton を保証し作成します
   * @returns {Scroll} Scroll instance を返します
   */
  static factory() {
    if (instance === null) {
      instance = new Scroll(singletonSymbol);
    }
    return instance;
  }

  /**
   * y 位置に scroll top を即座に移動させます
   * @param {number} [y=0] scroll top 目標値
   * @param {number} [delay=0] time out 遅延 ms
   * @returns {number} time out id
   */
  static jump(y = 0, delay = 0) {
    return setTimeout(() => { window.scrollTo(0, y); }, delay);
  }

  /**
   * {@link Freeze}.freeze を実行し scroll 操作を一定期間不能にします
   * @returns {number} time out ID
   */
  static freeze() {
    return Freeze.freeze();
  }

  /**
   * scroll top 位置
   * @returns {number} scroll top 位置を返します
   * @see https://developer.mozilla.org/ja/docs/Web/API/Window/scrollY
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset
   */
  static y() {
    return (typeof window.pageYOffset !== 'undefined')
      ? window.pageYOffset
      : (document.documentElement
        || document.body.parentNode
        || document.body).scrollTop;
  }

  // ---------------------------------------------------
  //  CALLBACK
  // ---------------------------------------------------
  /**
   * window scroll event handler
   * - window scroll event 発生後に scroll top 位置をもたせた Scroll.SCROLL custom event を発火します
   * @param {?Event} event window scroll event, nullable
   */
  onScroll = (event) => {
    // @type {number} - scroll top
    const y = Scroll.y();
    // @type {number} - window height
    const { innerHeight } = window;
    // @type {number} - 前回の scroll top
    // @type {Events} - events
    const { events, previous } = this;
    // @type {Event} - scroll event
    events.original = event;
    // @type {number} - scroll top
    events.y = y;
    // @type {number} - window height
    events.height = innerHeight;
    // @type {number} - window bottom(y + height)
    events.bottom = y + innerHeight;
    events.previous = previous;
    // @type {boolean} - 前回の scroll top と比較し移動したかを真偽値で取得します, true: 移動した
    events.changed = previous !== y;
    // @type {number} - 移動量 +（正）: down, -（負）: up
    events.moving = y - previous;
    // event fire
    this.dispatch(events);
    this.previous = y;
  };

  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
  /**
   * singleton です
   * @param {symbol} checkSymbol singleton を保証するための private instance
   * @returns {Scroll} singleton instance を返します
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
    // onetime setting
    super();
    // instance = this;

    // event handler
    // /**
    //  * bound onScroll, window.onscroll event handler
    //  * @type {function}
    //  */
    // this.onScroll = this.onScroll.bind(this);
    /**
     * ScrollEvents instance, 発火時に使用します
     * @type {ScrollEvents}
     */
    this.events = new ScrollEvents(Scroll.SCROLL, this, this);
    /**
     * 前回 scroll top 位置
     * @type {number}
     * @default -1
     */
    this.previous = -1
    // 設定済み instance を返します
    return this;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * scroll event を監視します
   * @returns {Scroll} method chain 可能なように instance を返します
   */
  start() {
    this.stop();
    window.addEventListener('scroll', this.onScroll, false);
    return this;
  }

  /**
   * scroll event を監視を止めます
   * @returns {Scroll} method chain 可能なように instance を返します
   */
  stop() {
    window.removeEventListener('scroll', this.onScroll);
    return this;
  }
}
