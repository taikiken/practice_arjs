/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/19 - 22:10
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * scroll 操作を強制的に不可能にします
 */
export default class Freeze {
  /**
   * scroll freeze timeout id
   * @type {number}
   */
  static timerId = 0;

  /**
   * scroll を止める時間
   * @type {number}
   * @default 200
   */
  static delay = 200;

  /**
   * scroll 動作を受付不能にします
   * @returns {void}
   */
  static start() {
    // window.addEventListener('touchstart', Freeze.onScroll, false);
    // window.addEventListener('touchmove', Freeze.onScroll, false);
    // window.addEventListener('touchend', Freeze.onScroll, false);
    window.addEventListener('scroll', Freeze.onScroll, false);
    document.addEventListener('wheel', Freeze.onScroll, false);
    document.addEventListener('mousewheel', Freeze.onScroll, false);
    window.addEventListener('DOMMouseScroll', Freeze.onScroll, false);
  }

  /**
   * scroll 動作を回復します
   * @returns {void}
   */
  static stop() {
    // window.removeEventListener('touchstart', Freeze.onScroll);
    // window.removeEventListener('touchmove', Freeze.onScroll);
    // window.removeEventListener('touchend', Freeze.onScroll);
    window.removeEventListener('scroll', Freeze.onScroll);
    document.removeEventListener('wheel', Freeze.onScroll);
    document.removeEventListener('mousewheel', Freeze.onScroll);
    window.removeEventListener('DOMMouseScroll', Freeze.onScroll);
  }

  /**
   * window scroll event handler, バブリング・伝播全てキャンセルします
   * @param {Event} event window scroll event
   * @returns {boolean} event をキャンセルするために false を返します
   */
  static onScroll(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  /**
   * scroll 操作を引数(delay)の間キャンセルします
   * @param {number} [delay=200] 遅延時間(ms), 200
   * @returns {number} time out id
   */
  static freeze(delay = Freeze.delay) {
    clearTimeout(Freeze.timerId);
    // timerId = 0;
    Freeze.start();
    if (delay > 0) {
      Freeze.timerId = setTimeout(Freeze.stop, delay);
    }
    return Freeze.timerId;
  }
}
