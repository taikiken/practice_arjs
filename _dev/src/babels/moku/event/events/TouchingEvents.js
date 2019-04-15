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
 * TouchingEvents
 */

// events
import Events from '../Events';

// util
import Vectors from '../../util/Vectors';

/**
 * {@link Touching} Events
 */
export default class TouchingEvents extends Events {
  /**
   * Touching events object 各プロパティを設定します
   * @param {string} type event type
   * @param {*} target イベント発生インスタンス
   * @param {Event} origin 発生時のオリジナルイベント
   * @param {Vectors} current 現在の位置
   * @param {Vectors} between 前回位置との差
   * @param {boolean} scrolling scroll したかの真偽値, true: scroll している
   */
  constructor(
    type,
    target,
    origin,
    current = new Vectors(),
    between = new Vectors(),
    scrolling = false,
  ) {
    // super
    super(type, target);
    /**
     * 発生時のオリジナルイベント
     * @type {Event}
     */
    this.origin = origin;
    /**
     * 現在の位置
     * @type {Vectors}
     */
    this.current = current;
    /**
     * 前回位置との差
     * @type {Vectors}
     */
    this.between = between;
    /**
     * scroll したかの真偽値
     * @type {boolean}
     */
    this.scrolling = scrolling;
  }
}
