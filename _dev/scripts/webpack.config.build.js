'use strict';
// --------------------------------------
// DEV - BUILD
// --------------------------------------
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// ------------------------------------------------------
const pkg = require('../package');
const settings = require('./settings');
const server = require('./webpack.server.config');

const mode = 'production';

const config = {
  mode,
  entry: settings.entries,
  output: {
    path: settings.directory.dist,
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: /@license/i,
          },
        },
        parallel: true,
        extractComments: true,
        // banner: true,
        // extractComments: {
        //   condition: /^\**!|@preserve|@license|@cc_on/i,
        //   filename: (file) => {
        //     console.error(`TerserWebpackPlugin - LICENSE - ${file}.LICENSE`);
        //     return `${file}.LICENSE`;
        //   },
        //   banner: (licenseFile) => {
        //     console.error(`TerserWebpackPlugin - licenseFile - ${licenseFile}`);
        //     return `License information can be found in ${licenseFile}`;
        //   },
        // },
      }),
    ],
  },
  module: {
    rules: [
      // // eslint
      // {
      //   test: /\.(js|jsx|mjs)$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         // formatter: eslintFormatter,
      //         eslintPath: require.resolve('eslint'),
      //
      //       },
      //       loader: require.resolve('eslint-loader'),
      //     },
      //   ],
      //   include: settings.directory.src,
      //   exclude: [
      //     /node_modules/,
      //   ],
      // },
      {
        oneOf: [
          // ------------------------------------
          // babel
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: [
              /node_modules/,
            ],
            use: [
              {
                // Babel を利用する
                loader: 'babel-loader',
                // Babel のオプションを指定する
                options: {
                  cacheDirectory: true,
                  presets: [
                    [
                      // プリセットを指定することで、ES2018 を ES5 に変換
                      // use react preset
                      // '@babel/preset-react',
                      '@babel/preset-env',
                      {
                        targets: {
                          node: 'current',
                          browsers: settings.babel.browsers,
                        },
                        useBuiltIns: 'usage',
                        // @see https://babeljs.io/blog/2019/03/19/7.4.0
                        // need core-js version
                        corejs: 3,
                      },
                      // modules: false - IE Symbol polyfill not found error になる
                      // 回避策 - babel-polyfill import + useBuiltIns: entry -> dev-client.bundle.js とコンフリクトの危険性
                      // babelrc - "useBuiltIns": "usage" とし `{ modules: false }` 使用しない
                      // { modules: false },
                    ],
                  ],
                  ignore: [
                    'node_modules',
                  ],
                  plugins: [
                    '@babel/plugin-proposal-class-properties',
                  ],
                },// options
              },
            ],// use
          },
          // ------------------------------------
          // sass / scss
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              // linkタグに出力する機能
              // require.resolve('style-loader'),
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '/',
                }
              },
              // require.resolve('resolve-url-loader'),
              // CSSをバンドルするための機能
              {
                loader: require.resolve('css-loader'),
                options: {
                  // オプションでCSS内のurl()メソッドの取り込みを禁止する
                  url: true,
                  // url: false,
                  // ソースマップの利用有無
                  // sourceMap: true,
                  // 0 => no loaders (default);
                  // 1 => postcss-loader;
                  // 2 => postcss-loader, sass-loader
                  importLoaders: 2,
                },
              },
              // postCss - autoprefixer
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  // sourceMap: true,
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer(settings.autoprefixer)
                  ],
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  minimize: true,
                }
              },
            ],
          },
          // ------------------------------------
          // img
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            // loader: require.resolve('url-loader'),
            // options: {
            //   // limit: 8192,
            //   name: '[path][name].[hash:8].[ext]',
            // },
            use: [
              {
                // loader: 'url-loader',
                loader: require.resolve('url-loader'),
                options: {
                  limit: 1024 * 8,
                  // name: '[path][name].[hash:8].[ext]',
                  name: '[path][name].[ext]',
                  outputPath: (url, resourcePath, context) => {
                    return url.replace('src/', '')
                  },
                  publicPath: '',
                },
              },
              {
                loader: 'img-loader',
                options: {
                  plugins: [
                    require('imagemin-gifsicle')({
                      interlaced: false,
                      verbose: true,
                    }),
                    require('imagemin-mozjpeg')({
                      progressive: false,
                      arithmetic: false,
                      quality: 90,
                      verbose: true,
                    }),
                    require('imagemin-pngquant')({
                      floyd: 0.5,
                      speed: 1,
                      quality: [0.8, 0.9],
                      verbose: true,
                    }),
                    require('imagemin-svgo')({
                      plugins: [
                        {
                          removeTitle: true,
                        },
                        {
                          convertPathData: false,
                        },
                      ],
                      verbose: true,
                    }),
                  ],
                },
              },
            ],
          },
          // -------------------
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            // include: [
            //   path.resolve(__dirname, '../../assets/img'),
            // ],
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  // name: 'assets/img/[name].[hash:8].[ext]',
                  // name: '[path][name].[hash:8].[ext]'
                  name: '[path][name].[ext]',
                  // outputPath: '/',
                  outputPath: (url, resourcePath, context) => {
                    return url.replace('src/', '')
                  },
                  publicPath: '',
                },
              },
            ],
          },
        ],
      },
    ],// rules
  },// modules
  performance: {
    hints: 'warning',
    // int (in bytes)
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new FixStyleOnlyEntriesPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        BUILD_VERSION: JSON.stringify(pkg.version),
        BUILD_TIME: JSON.stringify(new Date().toLocaleString()),
      },
    }),
    // ---
    ...settings.htmlList,
    new webpack.NamedModulesPlugin(),
    // ---
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].[hash].css',
    }),
    // css 圧縮
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            autoprefixer: false,
            zindex: false,
            reduceIdents: false,
          },
        ],
      },
      canPrint: true,
    }),
    // new CopyWebpackPlugin(
    //   [
    //     {
    //       from: `${settings.directory.src}`,
    //       to: settings.directory.dist,
    //       ignore: [
    //         '*.js',
    //         '*.jsx',
    //         '*.mjs',
    //         '*.html',
    //         '*.css',
    //         '*.scss',
    //         '*.md',
    //         `${settings.directory.src}/**/babels/**/*`,
    //         `${settings.directory.src}/**/_*/**/*`,
    //       ],
    //     },
    //   ],
    // ),
    // new CopyWebpackPlugin(
    //   [
    //     {
    //       from: settings.directory.public,
    //       to: settings.directory.app,
    //     }
    //   ]
    // ),
    new CopyWebpackPlugin(
      [
        {
          from: settings.directory.public,
          to: settings.directory.dist,
        }
      ]
    ),
  ],
};

config.devServer = server;
config.devServer.quiet = true;

module.exports = config;
