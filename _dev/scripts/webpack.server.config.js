'use strict';
// --------------------------------------
// server setting - webpack-dev-server
// https://webpack.js.org/guides/development/
// https://webpack.js.org/configuration/dev-server/
// --------------------------------------
const path = require('path');

let port;
try {
  port = require('../port');
} catch (error) {
  console.warn('*********************************');
  console.warn('*[404] `port.js` file not found *');
  console.warn('*use default port number: 61000 *');
  console.warn('*********************************');
  port = 61000;
}

/*
server を client ip で起動する option
- useLocalIp: true,
- host: '0.0.0.0',

port 指定し起動します via `port.js`

directory

- src - 開発階層
- app - develop 出力
 */
module.exports = {
  useLocalIp: true,
  host: '0.0.0.0',
  port,
  contentBase: [
    path.resolve(__dirname, '../app'),
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../public'),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
    ignored: /node_modules/,
  },
  watchContentBase: true,
  hot: true,
  index: 'index.html',
  open: true,
  publicPath: '/',
  progress: true,
  inline: true,
  // quiet: true,
  clientLogLevel: 'warning',
  disableHostCheck: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  https: false,
  stats: {
    colors: true,
  },
};
