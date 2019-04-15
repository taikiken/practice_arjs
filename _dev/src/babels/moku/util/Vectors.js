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
 * Vectors
 */

/**
 * ある点の座標(x, y)と時間(time)を管理します
 */
export default class Vectors {
  /**
   * 座標と現在時間を元にインスタンスを作成します
   * @param {number} [x=0] 座標 x
   * @param {number} [y=0] 座標 y
   * @param {number} [time=Date.now()] 時間 milli seconds
   */
  constructor(x = 0, y = 0, time = Date.now()) {
    /**
     * 座標 x
     * @type {number}
     */
    this.x = x;
    /**
     * 座標 y
     * @type {number}
     */
    this.y = y;
    /**
     * 時間 milli seconds
     * @type {number}
     */
    this.time = time;
    /**
     * スクロール中かのフラッグ, true: スクロール中
     * @type {boolean}
     */
    this.scrolling = false;
  }

  /**
   * x, y, time プロパティを全て `0` にします
   * @returns {Vectors} メソッドチェイン可能なようにインスタンスを返します
   */
  reset() {
    this.x = 0;
    this.y = 0;
    this.time = 0;

    return this;
  }

  /**
   * x, y, time を更新します
   * @param {number} x 座標 x
   * @param {number} y 座標 y
   * @param {number} [time=Date.now] 時間 milli seconds
   * @returns {Vectors} メソッドチェイン可能なようにインスタンスを返します
   */
  update(x, y, time = Date.now()) {
    this.x = x;
    this.y = y;
    this.time = time;

    return this;
  }

  /**
   * 引数 vectors 間の距離を測ります
   * @param {Vectors} vectors 計測したい対象 Vector instance
   * @returns {number} 距離を返します
   */
  distance(vectors) {
    const distanceX = this.x - vectors.x;
    const distanceY = this.y - vectors.y;
    const sqrt = (distanceX * distanceX) + (distanceY * distanceY);
    return Math.sqrt(sqrt);
  }

  /**
   * 引数 vectors との時間差を計算します
   * @param {Vectors} vectors 計測したい対象 Vector instance
   * @returns {number} 時間差(milli seconds) を返します
   */
  duration(vectors) {
    return this.time - vectors.time;
  }

  /**
   * 複製を作成し返します
   * @returns {Vectors} 複製を返します
   */
  clone() {
    const clone = new Vectors(this.x, this.y, this.time);
    clone.scrolling = this.scrolling;
    return clone;
  }

  /**
   * ベクトルの大きさの２乗の平方根を計算します
   * @returns {number} ベクトルの大きさの２乗の平方根を返します
   */
  length() {
    const { x, y } = this;
    return Math.sqrt((x * x) + (y * y));
  }

  /**
   * ベクトルの値を scalar 値で除算します
   *
   * @param {number} scalar 除算母数
   * @returns {Vectors} 除算後の Vector を返します
   */
  divideByScalar(scalar) {
    const clone = this.clone();
    if (scalar === 0) {
      clone.x = 0;
      clone.y = 0;
    } else {
      const { x, y } = clone;
      const inverse = 1 / scalar;
      clone.x = x * inverse;
      clone.y = y * inverse;
    }

    return clone;
  }

  /**
   * ベクトルの値を scalar 値で乗算します
   *
   * @param {number} scalar 乗算母数
   * @returns {Vectors} 乗算後の Vector を返します
   */
  multiplyByScalar(scalar) {
    const clone = this.clone();
    clone.x *= scalar;
    clone.y *= scalar;
    return clone;
  }

  /**
   * 現在の Vectors を元に引数 `maxValue` 以下にした `Vectors` を取得します
   * @param {number} maxValue 最高目標値
   * @returns {Vectors} `maxValue` 以下にした `Vectors` を返します
   */
  truncate(maxValue) {
    const minValue = Math.min(maxValue, this.length());
    const oldLength = this.length();
    if (oldLength !== 0 && minValue !== oldLength) {
      return this.multiplyByScalar(minValue / oldLength);
    }
    return this.clone();
  }

  /**
   * ベクトルの大きさを正規化（大きさを1）した Vector を作成します
   * @returns {Vectors} ベクトルの大きさを正規化（大きさを1）した Vectors を返します
   */
  normalize() {
    return this.divideByScalar(this.length());
  }

  /**
   * ベクトルが正規化（length が 1）されているかを判定します
   * @returns {boolean} true: 正規化されている
   */
  isNormalize() {
    return this.length() === 1;
  }

  /**
   * 引数 vectors との X 値を減算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {number} X 値を減算し返します
   */
  betweenX(vectors) {
    return this.x - vectors.x;
  }

  /**
   * 引数 vectors との Y 値を減算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {number} Y 値を減算し返します
   */
  betweenY(vectors) {
    return this.y - vectors.y;
  }

  /**
   * 引数 vectors との time 値を減算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {number} time 値を減算し返します
   */
  betweenTime(vectors) {
    return this.time - vectors.time;
  }

  /**
   * 引数 vectors との x, y, time 値を減算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {Vectors} 引数 vectors との x, y, time 値を減算した clone を返します
   */
  between(vectors) {
    const clone = this.clone();
    clone.x = clone.betweenX(vectors);
    clone.y = clone.betweenY(vectors);
    clone.time = clone.betweenTime(vectors);

    return clone;
  }

  /**
   * 引数ベクトルの内積を計算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {number} 内積を返します
   */
  dot(vectors) {
    return (this.x * vectors.x) + (this.y * vectors.y);
  }

  /**
   * 引数ベクトルの値(x, y)が等しいかを判定します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {boolean} true: 等しい
   */
  equals(vectors) {
    return (vectors.x === this.x) && (vectors.y === this.y);
  }

  /**
   * 引数ベクトルとの角度を計算します
   * @param {Vectors} vectors 計測したい対象 Vectors instance
   * @returns {number} 角度を返します
   */
  angle(vectors) {
    let v1 = this.clone();
    let v2 = vectors.clone();
    if (!v1.isNormalize()) {
      v1 = v1.normalize();
    }
    if (!v2.isNormalize()) {
      v2 = v2.normalize();
    }
    // console.log('angle', v1, v2, v1.dot(v2), Math.acos(v1.dot(v2)));
    return Math.acos(v1.dot(v2));
  }
}
