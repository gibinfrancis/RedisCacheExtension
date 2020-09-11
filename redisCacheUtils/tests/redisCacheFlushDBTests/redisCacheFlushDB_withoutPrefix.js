"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tmrm = require("../../node_modules/azure-pipelines-task-lib/mock-run");
var path = require("path");
var constants = require('../config');
var taskPath = path.join(__dirname, '../..', 'redisCacheFlushDB', 'index.js');
var tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('redishost', constants._redishost);
tmr.setInput('redisport', constants._redisport);
tmr.setInput('rediskey', constants._rediskey);
tmr.setInput('redisPwdType', constants._redisPwdType);
tmr.setInput('redisdb', constants._redisdb);
tmr.run();