/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/03 - 19:33
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import Scrolling from './Scrolling';
import Scroll from './Scroll';

// event/events
import ResizingEvents from './events/ResizingEvents';

/**
 * resize のみを監視します
 */
export default class Resizing extends Scrolling {
  // ----------------------------------------
  // STATIC PROPERTY
  // ----------------------------------------
  /**
   * Resizing event type - resizingUpdate
   * @event UPDATE
   * @type {string}
   */
  static UPDATE = 'resizingUpdate';


  /**
   * 指定 rate(fps) 毎にスクロール位置を scroll top 位置をもたせた Scrolling.UPDATE custom event を発火します
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
    // @type {number} - previous scroll top
    const { previous } = this;
    // --- [window]
    // @type {number} - window width
    const width = window.innerWidth;
    // @type {number} - window height
    const height = window.innerHeight;
    // --- [body]
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;
    // @type {boolean} - 移動したかを表します,
    const changed = event === null
      || previous !== y
      || height !== this.window.height
      || width !== this.window.width
      || bodyWidth !== this.body.width
      || bodyHeight !== this.body.height;
    // ----------------------------------------------
    // @type {ScrollEvents} - events
    const events = this.events.clone();
    // @type {Event} - Rate Events instance
    events.original = event;
    // @type {number} - scroll top
    events.y = y;
    // @type {number} - window height
    events.height = height;
    // @type {number} - window width
    events.width = width;
    // -- body
    events.bodyWidth = bodyWidth;
    events.bodyHeight = bodyHeight;
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
    // console.log('Resizing.onUpdate', events);
    this.dispatch(events);
    // ----------------------------------------------
    this.window.width = width;
    this.window.height = height;
    this.body.width = bodyWidth;
    this.body.height = bodyHeight;
    // save scroll top -> previous
    this.previous = y;
    // // 移動量 0 の時は rate 監視を停止する
    // if (!changed) {
    //   this.unwatch();
    // }
  };

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * events instance を準備します
   */
  constructor() {
    super();
    // ------
    // /**
    //  * bound onUpdate, Rate.UPDATE event handler
    //  * @type {function}
    //  */
    // this.onUpdate = this.onUpdate.bind(this);
    /**
     * Resizing event を準備します
     * @type {ScrollEvents}
     */
    this.events = new ResizingEvents(Resizing.UPDATE, this, this);
    // console.log('Resizing events', this.events);
    /**
     * document.body size - clientWidth / clientHeight
     * @type {{width: number, height: number}}
     */
    this.body = {
      width: -1,
      height: -1,
    };
    /**
     * window innerWidth / innerHeight
     * @type {{width: number, height: number}}
     */
    this.window = {
      width: -1,
      height: -1,
    };
    /**
     * 前回スクロールトップ値
     * @type {number}
     */
    this.previous = -1;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * 監視を開始します
   * - 常時監視します - document.body.onresize が作動しないため
   * @returns {*} method chain 可能なように instance を返します
   */
  start() {
    this.watch();
    return this;
  }

  /**
   * 監視を停止します
   * @returns {*} method chain 可能なように instance を返します
   */
  stop() {
    this.unwatch();
    return this;
  }
}
