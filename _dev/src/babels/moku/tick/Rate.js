/**
 * license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/16
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

// event
import Events from '../event/Events';

// tick
import Polling from './Polling';

/**
 * 固定値を使用し fps を決定します
 *
 * 以下のフレームレートが設定可能です
 *
 * - 60: Rate.RATE_60
 * - 30: RATE_30
 * - 20: RATE_20
 * - 15: RATE_15
 * - 12: RATE_12
 * - 10: RATE_10
 * - 6: RATE_6
 * - 5: RATE_5
 *
 * @example
 * // 1sec interval
 * const rate = new Rate(Rate.Rate_60);
 * const update = () => {
 *  // code here, something do
 * };
 * rate.on(Rate.UPDATE, update);
 * rate.start();
 */
export default class Rate extends Polling {
  // ----------------------------------------
  // CONST
  // ----------------------------------------
  /**
   * fps 60 基準値
   * @type {number}
   */
  static RATE_60 = 1;

  /**
   * fps 30 基準値
   * @type {number}
   */
  static RATE_30 = 2;

  /**
   * fps 20 基準値
   * @type {number}
   */
  static RATE_20 = 3;

  /**
   * fps 15 基準値
   * @type {number}
   */
  static RATE_15 = 4;

  /**
   * fps 12 基準値
   * @type {number}
   */
  static RATE_12 = 5;

  /**
   * fps 10 基準値
   * @type {number}
   */
  static RATE_10 = 6;

  /**
   * fps 6 基準値
   * @type {number}
   */
  static RATE_6 = 10;

  /**
   * fps 5 基準値
   * @type {number}
   */
  static RATE_5 = 12;

  /**
   * fps 4 基準値
   * @type {number}
   */
  static RATE_4 = 15;

  /**
   * fps 3 基準値
   * @type {number}
   */
  static RATE_3 = 20;

  /**
   * fps 2 基準値
   * @type {number}
   */
  static RATE_2 = 30;

  /**
   * fps 1 基準値
   * @type {number}
   */
  static RATE_1 = 60;

  // ----------------------------------------
  // EVENT
  // ----------------------------------------
  /**
   * フレームレート毎に発生するイベント - rateUpdate
   * @event UPDATE
   * @type {string}
   */
  static UPDATE = 'rateUpdate';

  /**
   * {@link Cycle}.UPDATE event handler
   *
   * count property を `+1` 加算後設定 rate で割り算し余りが `0` の時にイベント Rate.UPDATE を発生させます
   * @param {CycleEvents} events Polling event object
   * @returns {boolean} Rate.UPDATE event が発生すると true を返します
   */
  onUpdate = (events) => {
    // 余りが 0 の時にイベントを発火します
    this.count += 1;
    const reminder = this.count % this.rate;
    if (reminder === 0) {
      this.count = 0;
      this.fire(this.updateEvents(0, 0, events));
      return true;
    }
    return false;
  };

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * 固定値フレームレート毎に UPDATE イベントを発生させます
   * @param {number} [rateValue=Rate.RATE_5] fps, 固定値以外設定できません
   */
  constructor(rateValue = Rate.RATE_5) {
    // 60fps で polling を行う
    super(1000 / 60);
    // @type {Events}
    const events = new Events(Rate.UPDATE, this, this);
    // 設定可能な rate list
    const rates = [
      Rate.RATE_60,
      Rate.RATE_30,
      Rate.RATE_20,
      Rate.RATE_15,
      Rate.RATE_12,
      Rate.RATE_10,
      Rate.RATE_6,
      Rate.RATE_5,
      Rate.RATE_4,
      Rate.RATE_3,
      Rate.RATE_2,
      Rate.RATE_1,
    ];
    /**
     * Rate 通知 Events instance
     * @type {Events}
     */
    this.events = events;
    /**
     * 許容可能な rate
     * @type {Array<number>}
     */
    this.rates = rates;
    /**
     * rate count, update 毎にカウントアップします<br>
     * 不正値の時は `Rate.RATE_5` を使用します
     * @type {number}
     */
    this.count = 0;
    // let rate = this.validate(rateValue) ? rateValue : Rate.RATE_5;
    /**
     * rate 値
     * @type {?number}
     * @default Rate.RATE_5
     */
    this.rate = this.validate(rateValue) ? rateValue : Rate.RATE_5;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * rate 値を設定します
   * - 正常値: `this.rate` 更新, value を返します
   * - 不正値: `this.rate` 更新しません, null を返します
   * @param {number} value rate 値
   * @returns {?number} 正しい rate は設定値を不正な時は null を返します
   */
  setRate(value) {
    if (this.validate(value)) {
      this.rate = value;
      return value;
    }
    return null;
  }

  /**
   * 正規な rate 値かをチェックします
   * @param {number} rate 対象 rate
   * @returns {boolean} 正しいと true を返します
   */
  validate(rate) {
    return this.rates.indexOf(rate) !== -1;
  }

  /**
   * fps 基準値を設定します
   * @throws {Error} 引数 rate が設定可能値以外の時に例外エラーが発生します
   * @param {number} rate fps 基準値, <br>
   * RATE_60, RATE_30, RATE_20, RATE_15, RATE_12, RATE_10, <br>
   * RATE_6, RATE_5, RATE_4, RATE_3, RATE_2, RATE_1 の何れかが必須です
   * @returns {boolean} rate 設定に成功すると true を返します
   */
  change(rate) {
    this.setRate(rate);
    return this.start();
  }
}
