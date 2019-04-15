'use strict';
// --------------------------------------
// 基本機能 - 階層設定します
// --------------------------------------

const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// --------------------------------------
// 生成するファイルをリストします

const directory = {
  src: path.resolve(__dirname, '../src'),
  app: path.resolve(__dirname, '../app'),
  public: path.resolve(__dirname, '../public'),
  dist: path.resolve(__dirname, '../../htdocs'),
};

const files = {
  js: globule.find([
    `${directory.src}/**/*.{js,jsx,mjs}`,
    `!${directory.src}/**/_*/**/*.{js,jsx,mjs}`,
    `!${directory.src}/babels/**/*.{js,jsx,mjs}`
  ]),
  html: globule.find([
    `${directory.src}/**/*.html`,
    `!${directory.src}/**/_*/**/_*.html`,
    `!${directory.src}/**/_*.html`,
  ]),
  css:  globule.find([
    `${directory.src}/**/*.{css,scss}`,
    `!${directory.src}/**/_*/**/*.{css,scss}`,
    `!${directory.src}/**/_*.{css,scss}`,
  ]),
};


const entries = {};

// app.bundle.js
const babelName = 'app';
entries[path.join('assets/js', `${babelName}.bundle`)] = path.join(__dirname, '../src/babels', `${babelName}.js`);

/**
 * @param {Array<string>} targets glob target path list
 * @param {Array<string>} ext 拡張子リスト - key name から削除します
 * */
const convert = (targets, ext) => {
  Object.values(targets)
    .map((file) => {
      let fileName = file.replace(`${directory.src}/`, '');
      ext.map(extension => {
        fileName = fileName.replace(`.${extension}`, '');
      });
      entries[fileName] = file;
    })
};

convert(files.css, ['css', 'scss']);
convert(files.js, ['js', 'jsx', 'mjs']);

/**
 * `.html` - `HtmlWebpackPlugin` instance list
 * @type {Array<HtmlWebpackPlugin>}
 * */
const htmlList = [];

Object.values(files.html)
  .map(file => (htmlList.push(
    new HtmlWebpackPlugin({
      filename: file.replace(`${directory.src}/`, ''),
      inject: false,
      template: file,
    }),
  )));

module.exports = {
  // ------
  directory,
  // ------
  entries,
  htmlList,
  // ------
  // babel
  babel: {
    browsers: [
      'last 2 versions',
      'Safari >= 10',
      'Explorer >= 10',
      'last 4 Edge versions',
      'ChromeAndroid >= 18.0',
      'Android >= 6',
      'iOS >= 10.0',
    ],
  },
  // ------
  // css
  autoprefixer: {
    browsers: [
      '>1%',
      'last 4 versions',
      'ie >= 10',
      'ie_mob >= 10',
      'ff >= 44',
      'chrome >= 48',
      'safari >= 9',
      'opera >= 34',
      'ios >= 8.4',
      'android >= 4.2',
      'bb >= 10',
    ],
    flexbox: 'no-2009',
    grid: true,
  },
};
