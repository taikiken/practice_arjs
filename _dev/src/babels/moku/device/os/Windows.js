/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/08/28 - 16:50
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

import devices from '../devices';

/**
 * {@link devices}.props
 * {@link Windows}
 * @type {?object}
 */
let props = null;

/**
 * `userAgent` を解析します
 * {@link Windows}
 * @private
 */
const init = () => {
  if (props) {
    return;
  }
  // props = Object.assign({}, devices.props);
  props = {...devices.props};
  const { ua } = devices;
  const windows = !!ua.match(/windows/i);
  if (windows) {
    props.windows = true;
    props.phone = !!ua.match(/windows phone/i);
  }
};

/**
 * windows phone detector
 */
export default class Windows {
  /**
   * windows OS
   * @returns {boolean} true; windows OS
   */
  static is() {
    init();
    return props.windows;
  }

  /**
   * windows phone
   * @returns {boolean} true: windows phone
   */
  static phone() {
    init();
    return props.phone;
  }
}
