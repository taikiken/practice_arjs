/**
 * license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/10/08
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 * f
 */

// event
import EventDispatcher from './EventDispatcher';
import TouchingEvents from './events/TouchingEvents';

// util
import Vectors from '../util/Vectors';
import Type from '../util/Type';

// device
import Can from '../device/Can';

// device/os
import Android from '../device/os/Android';

// // touchevent 3rd argument
// /**
//  * addEventListener 第三引数 - { passive: true } | false
//  * {@link Touching}
//  * @private
//  * @type {*}
//  * @since 0.3.2
//  */
// const event3rd = Can.passive() ? { passive: true } : false;


/**
 * Touch event を監視し y方向移動が `threshold` 以内の時に `TOUCH` event を発火します
 */
export default class Touching extends EventDispatcher {
  /**
   * addEventListener 第三引数 - { passive: true } | false
   * {@link Touching}
   * @private
   * @type {*}
   * @since 0.3.2
   */
  static event3rd = Can.passive() ? { passive: true } : false;

  // ---------------------------------------------------
  //  CONSTANT / EVENT
  // ---------------------------------------------------
  /**
   * touchstart event type - touchingStart
   * @constant START
   * @type {string}
   */
  static START = 'touchingStart';

  /**
   * touchend event type - touchingEnd
   * @constant END
   * @type {string}
   */
  static END = 'touchingEnd';

  /**
   * touchcancel event type - touchingCancel
   * @constant CANCEL
   * @type {string}
   */
  static CANCEL = 'touchingCancel';

  /**
   * touchmove event type - touchingMove
   * @constant MOVE
   * @type {string}
   */
  static MOVE = 'touchingMove';

  /**
   * touch event type - touchingTouch
   * @constant TOUCH
   * @type {string}
   */
  static TOUCH = 'touchingTouch';

  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * y 方向移動が threshold 以内か判定します
   * @param {Vectors} pointA スタートポイント(Vectors)
   * @param {Vectors} pointB エンドポイント(Vectors)
   * @param {number} threshold 閾値
   * @returns {boolean} true の時は閾値以上なのでスクロール判定になります
   */
  static scrolling(pointA, pointB, threshold) {
    const y = pointA.betweenY(pointB);
    // 正数値にし閾値と比較
    return Math.abs(y) >= threshold;
  }

  /**
   * MouseEvent|TouchEvent から pageX / pageY 座標を取得します
   * @param {Event|MouseEvent|TouchEvent} event down / move / up event object
   * @returns {{x: number, y: number}} pageX / pageY 座標を返します
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches
   */
  static point(event) {
    const x = event.pageX;
    const y = event.pageY;

    // event.pageX / pageY があればそのまま値を返します
    // Android で pageX / pageY 存在しても 0, 0 しか返さない端末あり
    if (Type.number(x) && Type.number(y) && (x !== 0 && y !== 0)) {
      return { x, y };
    }

    // event.pageX / pageY がない時は TouchEvent の changedTouches から取得します
    // touch event
    // @type {TouchList}
    const touches = event.changedTouches || event.touches;
    // touches が取得できない時は 0 をセットし返します
    if (!Type.exist(touches) || touches.length === 0) {
      return { x: 0, y: 0 };
    }

    // changedTouches list の先頭データを取り出し pageX / pageY を取得します
    // @type {Touch}
    const touch = touches[0];
    return { x: touch.pageX, y: touch.pageY };
  }

  // ---------------------------------------------------
  //  CALLBACK
  // ---------------------------------------------------
  /**
   * touchstart event handler
   * @param {Event|TouchEvent} event touchstart event
   * @returns {void}
   */
  onStart = (event) => {
    // event unbind <- 二重 bind にならないように
    this.dispose();
    // vectors を初期化
    this.reset();
    // 現在 position を保存
    const { vectors, body, eventOption } = this;
    const point = Touching.point(event);
    vectors.start.update(point.x, point.y);
    vectors.moving.push(vectors.start);

    // キャンセル event 監視を開始
    // const eventOption = this.eventOption;
    // const body = this.body;
    body.addEventListener('touchend', this.onEnd, eventOption);
    body.addEventListener('touchmove', this.onMove, eventOption);
    body.addEventListener('touchcancel', this.onCancel, eventOption);

    // Touching.START 発火
    this.dispatch(new TouchingEvents(
      Touching.START,
      this,
      event,
      vectors.start,
    ));
  };

  /**
   * touchmove event handler
   * - Android 4.3 ~ 4.4 && standard browser のために `kitkatEnd` を実行します
   * @param {Event} event touchmove event
   * @returns {void}
   */
  onMove = (event) => {
    // console.log('Touching.onMove', event);
    const { vectors } = this;
    const movingArray = vectors.moving;

    // 現在 position
    const point = Touching.point(event);
    const position = new Vectors(point.x, point.y, Date.now());

    // 前回 position <- moving 配列最後
    const previous = movingArray.pop();
    // 戻す
    movingArray.push(previous);

    // scroll checked
    const scrolling = Touching.scrolling(position, previous, this.threshold);
    position.scrolling = scrolling;
    // 現在 position を配列後ろにセット
    movingArray.push(position);

    // global cancel と 閾値チェックで `preventDefault` を実行し scroll を止める
    if (this.canceling && !scrolling) {
      event.preventDefault();
    }

    // 移動量
    const between = position.between(previous);

    // Touching.MOVE 発火
    this.dispatch(new TouchingEvents(
      Touching.MOVE,
      this,
      event,
      position,
      between,
      scrolling,
    ));
    // kitkat(Android 4.3 ~ 4.4 && standard browser) - touchend 発火しないので check
    if (this.kitkat) {
      this.kitkatEnd(event);
    }
  };

  /**
   * touchend event handler
   * - {@link Touching}.[END|TOUCH] を発火します
   * @param {Event} event touchend event
   */
  onEnd = (event) => {
    // console.log('Touching.onEnd', event);
    const { vectors } = this;

    // 現在 position
    const point = Touching.point(event);
    const position = new Vectors(point.x, point.y, Date.now());

    // 前回 position を touchstart 位置としチェックします
    const previous = vectors.start;
    const scrolling = Touching.scrolling(position, previous, this.threshold);
    position.scrolling = scrolling;

    // global cancel と 閾値チェックで `preventDefault` を実行し scroll を止める
    if (this.canceling && !scrolling) {
      event.preventDefault();
    }

    // 移動量
    const between = position.between(previous);

    // Touching.END 発火
    this.dispatch(new TouchingEvents(
      Touching.END,
      this,
      event,
      position,
      between,
      scrolling,
    ));

    // Touching.Touch 発火
    this.dispatch(new TouchingEvents(
      Touching.TOUCH,
      this,
      event,
      position,
      between,
      scrolling,
    ));
    // ---
    this.dispose();
  };

  /**
   * touchcancel event handler<br>
   * 処理をキャンセルします
   * @param {Event} event touchend event
   * @returns {boolean} 正常終了時に true を返します
   */
  onCancel = (event) => {
    return this.abort(event);
  }

  /**
   * window.blur event handler<br>
   * 処理をキャンセルします
   * @param {Event} event window blur event
   * @returns {boolean} 正常終了時に true を返します
   */
  onBlur = (event) => {
    return this.abort(event);
  };

  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
   * 処理対象 element などを保存します
   * @param {Element} element 処理対象 Element
   * @param {boolean} [canceling=false] touchmove 中に `preventDefault` を行うフラッグ
   * false の時は {@link Can.passive} を調べ可能なら `{ passive: true }` します - since 0.3.2
   * @param {number} [threshold=10] y 方向閾値
   */
  constructor(element, canceling = false, threshold = 10) {
    super();
    /**
     * 処理対象 Element
     * @type {Element}
     */
    this.element = element;
    /**
     * touchmove 中に `preventDefault` を行うかのフラッグ
     * @type {boolean}
     * @default false
     */
    this.canceling = canceling;
    /**
     * y 方向閾値, default: 10px
     * @type {number}
     * @default 10
     */
    this.threshold = threshold;
    // /**
    //  * bound onStart
    //  * @type {function}
    //  */
    // this.onStart = this.onStart.bind(this);
    // /**
    //  * bound onMove
    //  * @type {function}
    //  */
    // this.onMove = this.onMove.bind(this);
    // /**
    //  * bound onEnd
    //  * @type {function}
    //  */
    // this.onEnd = this.onEnd.bind(this);
    // /**
    //  * bound onCancel
    //  * @type {function}
    //  */
    // this.onCancel = this.onCancel.bind(this);
    // /**
    //  * bound onBlur
    //  * @type {function}
    //  */
    // this.onBlur = this.onBlur.bind(this);
    /**
     * 位置管理を行う Vectors instance を含む object
     * @type {{start: Vectors, end: Vectors, moving: Array.<Vectors>}}
     */
    this.vectors = {
      start: new Vectors(),
      end: new Vectors(),
      moving: [].slice(0),
    };
    /**
     * TouchEvent listener 3rd argument, option | useCapture
     * @type {boolean}
     * @since 0.3.2
     */
    this.eventOption = canceling ? false : Touching.event3rd;
    /**
     * [native code] - document.body
     * @type {HTMLElement}
     */
    this.body = document.body;
    /**
     * timer ID
     * - kitkat - touchend 強制実行
     * @type {{kitkat: number}}
     * @since v0.4.4
     */
    this.timer = {
      kitkat: 0,
    };
    /**
     * Android 4.3 ~ 4.4 && standard browser (webview) flag
     * @type {boolean}
     */
    this.kitkat = Android.kitKat();
  }

  // ---------------------------------------------------
  //  METHOD
  // ---------------------------------------------------
  /**
   * Android 4.3 ~ 4.4 && standard browser - browser bug のため `touchend` が発火しません
   * - `touchmove` も 1 回だけ発火します - touchmove の後に本 method `kitkatEnd` を実行します
   * - `onEnd` を強制実行し `touchend` させます
   * @param {Event} event touch event
   * @since v0.4.4
   */
  kitkatEnd(event) {
    clearTimeout(this.timer.kitkat);
    this.timer.kitkat = setTimeout(() => {
      this.onEnd(event);
    }, 32);
  }
  // 処理
  // ---------------------------------------------------
  /**
   * touch event 監視を開始します
   * - `element`.ontouchstart
   * - window.onblur - cancel するため
   * @since 0.4.4
   */
  start() {
    this.stop();
    this.element.addEventListener('touchstart', this.onStart, this.eventOption);
    window.addEventListener('blur', this.onBlur, false);
  }

  /**
   * touch event 監視を停止します
   * @since 0.4.4
   */
  stop() {
    this.element.removeEventListener('touchstart', this.onStart);
    window.removeEventListener('blur', this.onBlur);
    this.dispose();
  }

  /**
   * @deprecated instead use `start`
   * 初期処理<br>
   * element への `touchstart` と<br>
   * window.blur event をそれぞれ bind します
   * @returns {void}
   */
  init() {
    // this.element.addEventListener('touchstart', this.onStart, this.eventOption);
    // window.addEventListener('blur', this.onBlur, false);
    this.start();
  }

  /**
   * touch event での処理をキャンセルし、設定値を初期値に戻します
   * @param {Event} event touch / window.onblur Event
   * @returns {boolean} 正常終了時に true を返します
   */
  abort(event) {
    this.dispose();
    this.reset();
    this.dispatch(new TouchingEvents(
      Touching.CANCEL,
      this,
      event,
    ));
    return true;
  }

  /**
   * bind した event を unbind します
   * @returns {boolean} 正常終了時に true を返します
   */
  dispose() {
    const { body } = this;

    body.removeEventListener('touchend', this.onEnd);
    body.removeEventListener('touchmove', this.onMove);
    body.removeEventListener('touchcancel', this.onCancel);
    return true;
  }

  /**
   * 移動監視に使用した vectors instance を全て reset します
   * @returns {{start: Vectors, end: Vectors, moving: Array.<Vectors>}}
   * reset 後の vectors object を返します
   */
  reset() {
    const { vectors } = this;
    vectors.start.reset();
    vectors.end.reset();
    vectors.moving = [].slice(0);

    return vectors;
  }
}
