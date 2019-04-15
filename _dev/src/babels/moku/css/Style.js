/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/10/06 - 21:52
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// util
import Type from '../util/Type';
import Text from '../util/Text';

// css
import Patterns from './Patterns';

/**
 * Element の style を操作します
 */
export default class Style {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * element style を取得します,
   * [getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) を使用します
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
   * @param {Object|Window} view Document.defaultView
   * @param {Element} element 操作対象 Element
   * @param {string} [property=''] 調査対象 CSS property name, 省略すると `CSSStyleDeclaration` 全セットを返します
   * @returns {CSSStyleDeclaration|CssStyle|string|undefined} style value を返します
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
   */
  static compute(view, element, property = '') {
    const style = view.getComputedStyle(element, null);
    if (Type.exist(property)) {
      const props = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return style.getPropertyValue(props);
    }
    return style;
  }

  /**
   * CSS 設定値の short hand をパターン {@link Patterns} から探し返します
   * @param {Object|Window} view Document.defaultView
   * @param {Element} element 操作対象 Element
   * @param {Array<string>} patterns 調査対象 CSS property name の配列
   * @returns {*|string|undefined} style value を返します
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
   */
  static shortHand(view, element, patterns) {
    const top = Style.compute(view, element, patterns[0]);
    const right = Style.compute(view, element, patterns[1]);
    const bottom = Style.compute(view, element, patterns[2]);
    const left = Style.compute(view, element, patterns[3]);
    if (!top && !right && !bottom && !left) {
      return undefined;
    }
    // top / bottom ...
    if (top === bottom) {
      // top - bottom: same
      if (right === left) {
        // top - bottom: same
        if (top === right) {
          // right - left: same - all same
          return top;
        }
        // top-bottom, left-right
        return `${top} ${right}`;
      }
      // separate 4
      return `${top} ${right} ${bottom} ${left}`;
    }
    // right / left
    if (right === left) {
      // top - bottom: different, left- right: same
      return `${top} ${right} ${bottom}`;
    }
    // separate 4
    return `${top} ${right} ${bottom} ${left}`;
  }

  /**
   * 引数 `element` の css を書き換えます
   * @param {Element} element 操作対象 Element
   * @param {string} css `cssText` 設定する
   */
  static change(element, css) {
    const { style } = element;
    style.cssText = css;
  }

  // ----------------------------------------
  // CONSTRUCTOR
  // ----------------------------------------
  /**
   * 引数 element の初期 style 設定を保存し復元できるようにします
   * @param {?Element} element 操作対象 Element
   */
  constructor(element) {
    /**
     * 操作対象 Element
     * @type {Element}
     */
    this.element = element;
    // @type {string} - オリジナルの element.style.cssText を保持します
    const css = this.current();
    /**
     * 現在の inline CSS
     * @type {string}
     */
    this.css = css;
    /**
     * インスタンス作成時の inline CSS
     * @type {string}
     */
    this.original = css;
  }

  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * インスタンス作成時に保存した inline CSS を上書きします
   * @param {string} style 上書き用 CSS 設定
   * @returns {string} 上書きされた CSS
   */
  update(style) {
    this.css = style;
    return style;
  }

  /**
   * style value を取得します
   * @param {string} [property=''] 調査する style property name
   * @return {string} style value を返します
   */
  get(property = '') {
    const { element } = this;
    const { ownerDocument } = element;
    const { defaultView } = ownerDocument;
    let style = Style.compute(defaultView, element, property);
    // firefox が css shorthand の取り扱いが違うので再度マッチテストする
    if (style === '' && property && Patterns.match(property)) {
      style = Style.shortHand(defaultView, element, Patterns.get(property));
    }
    return style;
  }

  /**
   * element へ css を設定します、設定済み css を上書きします
   * @param {string} property 設定する css property name
   * @param {string} value 設定する css value
   * @return {boolean} 変更されると true を返します
   */
  set(property, value) {
    // 存在チェック
    const { element } = this;
    if (!Type.exist(element)) {
      return false;
    }
    // 存在する時のみ処理を行います
    const prop = Text.camel(property);
    element.style[prop] = value;

    return true;
  }

  /**
   * element の inline style(style.cssText) を取得します
   * @return {string} style.cssText を返します
   */
  current() {
    const { element } = this;
    if (Type.exist(element)) {
      return element.style.cssText;
    }

    // this.element 不正の時は空文字を返します
    return '';
  }

  /**
   * element の style.cssText をインスタンス作成時点まで戻します
   * @return {string} 設定した css を返します
   */
  restore() {
    const css = this.original;
    this.element.style.cssText = css;
    return css;
  }

  /**
   * `save` 実行時に設定されている inline style を default にします
   * @returns {string} 設定されている inline style を返します
   */
  save() {
    const style = this.current();
    return this.update(style);
  }

  /**
   * element の style.cssText を引数 `css` で書き換えます
   * @param {string} css 書き換える css
   */
  change(css) {
    Style.change(this.element, css);
  }
}
