'use strict';
// --------------------------------------
// BUILD
// --------------------------------------

const webpack = require('webpack');
const chalk = require('chalk');

const config = require('./webpack.config.build');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

console.group(chalk.green(`${new Date().toLocaleString()}: webpack:build`));
console.time('build');


webpack(config, (error, stats) => {
  if (error) {
    throw new Error(`webpack:build:error - ${error}`);
  }
  console.log(stats.toString({
    colors: true,
    progress: true,
  }));
})

console.log(chalk.cyan('build success. you can check by `serve`.'))
console.log(chalk.cyan('serve -p 61100  ../htdocs'))

console.timeEnd('build');

console.groupEnd();
