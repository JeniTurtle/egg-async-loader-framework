'use strict';

const Application= require('./lib/application');
const AppWorkerLoader = require('./lib/workloader');
const Agent = require('./lib/agent');
const egg = require('egg');

module.exports = Object.assign(egg, {
  Application,
  AppWorkerLoader,
  Agent
});
