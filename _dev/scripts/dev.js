'use strict';

// --------------------------------------
// DEV
// --------------------------------------

const webpack = require('webpack');
const chalk = require('chalk');

const config = require('./webpack.config.dev');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// -------------------------------------------
console.group(chalk.green('webpack:dev'));

console.time('dev');

webpack(config, (error, stats) => {
  if (error) {
    throw new Error(`webpack:dev:error - ${error}`);
  }
  console.log(stats.toString({
    colors: true,
    progress: true,
  }));
})

console.timeEnd('dev');

console.groupEnd();
