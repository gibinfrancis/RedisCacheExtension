

import tmrm = require('../../node_modules/azure-pipelines-task-lib/mock-run');
import path = require('path');
var constants = require('../config');

let taskPath = path.join(__dirname, '../..', 'redisCacheFlushAll', 'index.js');

let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
   
tmr.setInput('redishost', constants._redishost);
tmr.setInput('redisport', constants._redisport);
tmr.setInput('rediskey', constants._rediskey);
tmr.setInput('redisprefix', 'sampleprefix');

tmr.run();