'use strict';

const path = require('path');
const egg = require('egg');
const AppWorkerLoader = require('./workloader')
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');

class Application extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }

  // 覆盖 Egg 的 Loader，启动时使用这个 Loader
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }
}

module.exports = Application