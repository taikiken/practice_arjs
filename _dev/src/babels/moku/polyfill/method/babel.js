/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/29 - 14:02
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// IE
// Symbol 対応できない問題を解決するために...
// @see https://babeljs.io/docs/usage/polyfill/
// @see https://github.com/babel/babel-preset-env/issues/203
// IE 11 Symbol is not defined #203
// ```
// babel-preset-env includes plugins by default. To include polyfill you need:
// specify useBuiltIns: true in presets options (see more)
// include import "babel-polyfill" to your codebase.
// ```
// import '@babel/polyfill';
