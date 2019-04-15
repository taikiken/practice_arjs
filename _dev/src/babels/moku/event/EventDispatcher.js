/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/06/30 - 20:09
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// util
import Type from '../util/Type';

// /**
//  * private property key, listeners Object
//  * @type {Symbol}
//  * @private
//  */
// const listenersKey = Symbol('event listeners object');

/**
 * Custom Event を作成し Event 通知を行います
 *
 * ```
 * const callback = (event) => {
 *  console.log(event);
 * };
 *
 * const event = new EventDispatcher();
 * event.on('abc', callback);
 *
 * console.log(event.has('abc', callback));// true
 *
 * event.dispatch(new Events('abc'));
 *
 * event.off('abc', callback);
 * console.log(event.has('abc', callback));// false
 * ```
 *
 * {@link Events}
 */
export default class EventDispatcher {
  /**
   * listener property をイニシャライズします
   */
  constructor() {
    /**
     * リスナーリスト object,
     * event type {string} を key, 値は Array.<function> になります
     * @type {Object}
     */
    this.listeners = {...{}};
    // this.listeners = Object.create({});
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * 全てのリスナーを破棄します
   */
  destroy() {
    // this.listeners = Object.create({});
    this.listeners = {...{}};
  }

  /**
   * event type に リスナー関数を bind します
   * @param {string} type event type（種類）
   * @param {Function} listener callback関数
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  on(type, listener) {
    if (!Type.exist(type)) {
      // type が有効値ではないので処理しない
      return false;
    }
    if (!Type.method(listener)) {
      // listener が 関数でないので処理しない
      return false;
    }

    // type {Object} - {{eventType: array [listener: Function...]...}}
    const { listeners } = this;

    if (!Type.has(listeners, type)) {
      // listeners.type が存在しない場合は
      // listeners.type をキーに新規配列を作成し
      // listener {function} を配列へ追加（登録）します
      listeners[type] = [];
    }
    // すでに listeners.type が存在する
    listeners[type].push(listener);
    return true;
  }

  /**
   * event type からリスナー関数を remove します
   * - 一時的に null 設定にします
   * - {@link EventDispatcher.clean} で all null の時に空にします
   * @param {string} type event type（種類）
   * @param {Function} listener リスナー関数
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  off(type, listener) {
    if (!Type.method(listener)) {
      // listener が 関数でないので処理しない
      return false;
    }

    // @type {Object} - events.type:String: [listener:Function...]
    const { listeners } = this;
    if (!Type.has(listeners, type)) {
      // listener.type が存在しない - 処理しない
      return false;
    }

    // @type {Array} - listener list
    const types = listeners[type];

    // listener の配列位置を調べる
    // @type {number}
    const index = types.indexOf(listener);

    if (index === -1) {
      // 配列位置が -1, 見つからなかった
      // 処理しない
      return false;
    }

    // すぐに削除するのでは無く null 代入
    // loop(iterator) の中で off すると index 位置が変わりまずい
    types[index] = null;

    this.clean(type, types);

    return true;
  }

  /**
   * リスナー配列を調べ可能なら空にします
   * - リスナーリストが全て null の時に 空配列にします
   * @param {string} type event type（種類）
   * @param {Array<Function>} types event type に登録されている配列（関数）
   * @returns {boolean} 成功・不成功の真偽値を返します, true: 空にした
   */
  clean(type, types) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    // Array.some は 戻り値が true の時に走査を止めます
    // types 配列に null 以外があるかを調べます
    // @type {boolean} - listener list に 関数(typeof 'function')が存在すると true になります
    const hasFunction = types.some(listener => Type.method(listener));

    if (!hasFunction) {
      // null 以外が無いので空にする
      // this.listeners[type] = [].slice(0);
      this.listeners[type] = [...[]];
    }

    // 空配列にしたかを hasFunction flag を反転させることで知らせます
    return !hasFunction;
  }

  /**
   * event type にリスナー関数が登録されているかを調べます
   * @param {string} type event type（種類）
   * @param {Function} listener リスナー関数
   * @returns {boolean} event type にリスナー関数が登録されているかの真偽値を返します
   */
  has(type, listener) {
    if (!Type.method(listener)) {
      // listener が 関数でないので処理しない
      return false;
    }

    // @type {Object} - events.type:String: [listener:Function...]
    const { listeners } = this;

    if (!Type.has(listeners, type)) {
      // listener.type が存在しない - 処理しない
      return false;
    }

    // @type {boolean} - 存在チェック
    // return listeners[type].indexOf(listener) !== -1;
    return listeners[type].includes(listener);
  }

  /**
   * イベントを発生させリスナー関数を call します
   * @param {Events|*} events 送信される Event Object.type キーにイベント種類が設定されています、dispatch 時に target プロパティを追加し this を設定します
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  dispatch(events) {
    // @type {Object} - events.type:string: [listener:Function...]
    const { listeners } = this;
    // @type {string} - event type
    const { type } = events;

    if (!Type.has(listeners, type)) {
      // listener.type が存在しない - 処理しない
      return false;
    }

    // event.target = this しようとすると
    // Assignment to property of function parameter 'event'  no-param-reassign
    // になるのでコピーし使用します
    const eventObject = events;
    // target プロパティに発生元を設定する
    eventObject.target = this;

    // callback を実行する
    listeners[type]
      .map(
        // @param listener {Function}
        (listener) => {
          // null が混じっているのでタイプチェックを行い listener 関数を実行します
          if (Type.method(listener)) {
            return listener.call(this, eventObject);
          }
          return null;
        },
      );

    return true;
  }

  /**
   * **alias on**
   * - event type に リスナー関数を bind します
   * @deprecated instead use `on`
   * @param {string} type event type（種類）
   * @param {Function} listener callback関数
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  addEventListener(type, listener) {
    return this.on(type, listener);
  }

  /**
   * **alias off**
   * - event type からリスナー関数を remove します
   * @deprecated instead use `off`
   * @param {string} type event type（種類）
   * @param {Function} listener リスナー関数
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  removeEventListener(type, listener) {
    return this.off(type, listener);
  }

  /**
   * **alias has**
   * - event type にリスナー関数が登録されているかを調べます
   * @deprecated instead use `has`
   * @param {string} type event type（種類）
   * @param {Function} listener リスナー関数
   * @returns {boolean} event type にリスナー関数が登録されているかの真偽値を返します
   */
  hasEventListener(type, listener) {
    return this.has(type, listener);
  }

  /**
   * **alias dispatch**
   * - イベントを発生させリスナー関数を call します
   * @deprecated instead use `dispatch`
   * @param {Events} events typeキー が必須です
   * @returns {boolean} 成功・不成功の真偽値を返します
   */
  dispatchEvent(events) {
    return this.dispatch(events);
  }
}
