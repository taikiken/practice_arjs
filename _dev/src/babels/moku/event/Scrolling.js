/**
 * license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/04
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

// event
import Scroll from './Scroll';
import EventDispatcher from './EventDispatcher';
import ScrollEvents from './events/ScrollEvents';

// tick
import Rate from '../tick/Rate';

/**
 * fps: {@link Rate} new Rate(Rate.RATE_5)` で Scroll 位置を計算します
 *
 * @example
 * // 途中で rate を変更する
 * const scrolling = new Scrolling();
 * scrolling
 *    .start()
 *    .rate.setRate(Rate.RATE_12);
 * */
export default class Scrolling extends EventDispatcher {
  // ---------------------------------------------------
  //  CONSTANT / EVENT
  // ---------------------------------------------------
  /**
   * fps: {@link Rate} で発生するイベント - scrollingUpdate
   * @event UPDATE
   */
  static UPDATE = 'scrollingUpdate';

  // ---------------------------------------------------
  //  CALLBACK
  // ---------------------------------------------------
  /**
   * 指定 rate(fps) 毎 scroll top 位置をもたせた Scrolling.UPDATE custom event を発火します
   *
   * 下記のプロパティをイベント・インスタンスに追加します
   *
   * - original {Events} - Rate Events instance
   * - y {number} - scroll top
   * - height {number} - window height
   * - width {number} - window width
   * - bottom {number} - window bottom 位置 (y + height)
   * - previous {number} - 前回の scroll top
   * - moving {number} - 前回からの移動量, 正: scroll down, 負: scroll up
   * - wide {boolean} - width が 768 以上の時に true
   * - changed {boolean} - scroll top が前回と変わっていたら true
   *
   * @param {?Events} event {@link Rate.UPDATE} Events instance
   */
  onUpdate = (event) => {
    // @type {number} - scroll top
    const y = Scroll.y();
    // @type {ScrollEvents} - events
    // const { events } = this;
    // @type {number} - previous scroll top
    const { previous, events } = this;
    // @type {boolean} - 移動したかを表します,
    const changed = event === null || previous !== y;
    // 移動量 0 の時は rate 監視を停止する
    if (!changed) {
      this.unwatch();
    }
    // @type {number} - window height
    const height = window.innerHeight;
    // @type {number} - window width
    const width = window.innerWidth;

    // @type {Event} - Rate Events instance
    events.original = event;
    // @type {number} - scroll top
    events.y = y;
    // @type {number} - window height
    events.height = height;
    // @type {number} - window width
    events.width = width;
    // @type {number} - window bottom(y + height)
    events.bottom = y + height;
    // @type {boolean} - 移動したかを表します,
    // event が null の時は強制発火なので移動量 0 （scroll top 位置に変更がない）でも changed を true にします
    events.changed = changed;
    // @type {number} - 前回の y 位置
    events.previous = previous;
    // @type {number} - 移動量 +: down, -: up
    events.moving = y - previous;
    // event fire
    // console.log('Scrolling.scroll', events);
    this.dispatch(events);

    // save scroll top -> previous
    this.previous = y;
  };

  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
   * @param {Rate} [rate=new Rate(Rate.RATE_30)] Rate instance, scroll 監視 fps を設定します
   */
  constructor(rate = new Rate(Rate.RATE_30)) {
    super();
    // @type {function}
    // const onUpdate = this.scroll.bind(this);
    // /**
    //  * bound onUpdate, Rate.UPDATE event handler
    //  * @type {function}
    //  */
    // this.onUpdate = this.onUpdate.bind(this);
    // this.onUpdate = onUpdate;
    // @type {ScrollEvents}
    // const events = new ScrollEvents(Scrolling.UPDATE, this, this);
    /**
     * ScrollEvents instance, 発火時に使用します
     * @type {ScrollEvents}
     */
    this.events = new ScrollEvents(Scrolling.UPDATE, this, this);
    // this.events = events;
    /**
     * 前回 scroll top 位置
     * @type {number}
     * @default -1
     */
    this.previous = -1;
    // /**
    //  * start 済みフラッグ
    //  * @type {boolean}
    //  * @default false
    //  */
    // this.started = false;
    /**
     * Rate instance
     * @type {?Rate}
     */
    this.rate = rate;
    /**
     * scrolling 監視開始 flag
     * @type {boolean}
     * @since 0.3.8
     */
    this.watching = false;
    /**
     * bind onNativeEvent - window.onscroll|onresize event handler
     * @type {function}
     */
    this.onNativeEvent = this.onNativeEvent.bind(this);
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * window.onscroll / window.onresize event handler,
   * `this.watching` flag を確認し `watch` を call します
   * @since 0.3.8
   */
  onNativeEvent() {
    if (!this.watching) {
      this.watch();
    }
  }

  /**
   * window.onscroll / window.onresize 監視を開始します
   * @returns {Scrolling} method chain 可能なように instance を返します
   */
  start() {
    window.addEventListener('scroll', this.onNativeEvent, false);
    window.addEventListener('resize', this.onNativeEvent, false);
    return this;
  }

  /**
   * window.onscroll / window.onresize 監視を停止します
   * @returns {Scrolling} method chain 可能なように instance を返します
   */
  stop() {
    window.removeEventListener('scroll', this.onNativeEvent);
    window.removeEventListener('resize', this.onNativeEvent);
    return this;
  }

  /**
   * fps を監視しスクロール位置を知らせます
   * @returns {Scrolling} method chain 可能なように instance を返します
   * @since 0.3.8
   */
  watch() {
    this.unwatch();
    this.watching = true;
    const { rate } = this;
    rate.on(Rate.UPDATE, this.onUpdate);
    rate.start();
    return this;
  }

  /**
   * fps 監視を止めます
   * @returns {Scrolling} method chain 可能なように instance を返します
   * @since 0.3.8
   */
  unwatch() {
    this.rate.off(Rate.UPDATE, this.onUpdate);
    this.watching = false;
    return this;
  }

  /**
   * 強制的に Scrolling.SCROLL event を発火させます
   */
  fire() {
    this.onUpdate(null);
  }
}
