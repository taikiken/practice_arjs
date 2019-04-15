/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/29 - 14:05
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// @see https://github.com/taylorhakes/promise-polyfill
// @see https://developers.google.com/web/fundamentals/getting-started/primers/promises
// > Chrome 32、Opera 19、Firefox 29、Safari 8、および Microsoft Edge - enabled
import Promise from 'promise-polyfill';

/**
 * Promise 未実装ブラウザへ polyfill します
 * - Chrome 32、Opera 19、Firefox 29、Safari 8、および Microsoft Edge - enabled
 * @see https://github.com/taylorhakes/promise-polyfill
 * @see https://developers.google.com/web/fundamentals/getting-started/primers/promises
 */
const activate = () => {
  // Promise: To add to window
  if (!window.Promise) {
    window.Promise = Promise;
  }
};

activate();

export default activate;
