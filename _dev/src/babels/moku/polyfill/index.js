/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/28 - 18:25
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// fetch
import './method/fetch';

import animationFrame from './method/animationFrame';

// ------------------------------------------------
animationFrame();

// /**
//  * 以下全てを読み込みます、一部だけ必要な時は個別に `import` します
//  * - babel-polyfill - `./method/babel`
//  *   - IE, Symbol 対応できない問題を解決するために...
//  *   - https://babeljs.io/docs/usage/polyfill/
//  *   - https://github.com/babel/babel-preset-env/issues/203
//  *   - `babel-preset-env includes plugins by default. To include polyfill you need:, specify useBuiltIns: true in presets options (see more), include import "babel-polyfill" to your codebase.`
//  * - promise-polyfill - `./method/promise`
//  *   - https://github.com/taylorhakes/promise-polyfill
//  *   - https://developers.google.com/web/fundamentals/getting-started/primers/promises
//  *   - Chrome 32、Opera 19、Firefox 29、Safari 8、および Microsoft Edge - enabled
//  * - whatwg-fetch - `./method/fetch`
//  *   - https://github.com/whatwg/fetch
//  *   - https://fetch.spec.whatwg.org/
//  *   - https://github.github.io/fetch/
//  * - animationFrame - `./method/animationFrame`
//  *   - Android 4.3 以下, requestAnimationFrame 未実装なので polyfill する
//  * @type {{animationFrame: function}}
//  */
// const polyfill = {
//   animationFrame,
// };

// export default polyfill;
