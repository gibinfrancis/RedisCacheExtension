import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
var constants = require('./config');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
   
tmr.setInput('redishost', constants._redishost);
tmr.setInput('redisport', constants._redisport);
tmr.setInput('rediskey', constants._rediskey);
tmr.setInput('rediscachekey', '*');

tmr.run();