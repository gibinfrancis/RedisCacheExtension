import tl = require('azure-pipelines-task-lib/task');
var redis = require('redis');
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

async function run() {
    try {
        
        //Host name of the redis server
        const _redishost: string = tl.getInput('redishost', true)!;
        //port address of the redis server
        const _redisport: string = tl.getInput('redisport', true)!;
        //key to authenticate to the redis server
        const _rediskey: string = tl.getInput('rediskey', true)!;
         //prefix key in the redis server
         const _redisprefix: string = tl.getInput('redisprefix', false)!;
        
        //Checking for all required fields
        if (_redishost == '' || 
            _redisport == '' ||
            _rediskey == '') {
            
            //Seting the Status of the task
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;

        }
        
        //creating redis options
        var _redisOptions = {
            auth_pass : _rediskey,
            tls : {
                servername : _redishost
            },
            prefix : (_redisprefix == '' || _redisprefix == null) ? null :  _redisprefix
        };

        //creating redis connetion
        var client = redis.createClient(_redisport, _redishost, _redisOptions);

        //flushing the redis server
        var flushallresult = await client.flushall();
        if(flushallresult!= null)
        {
            tl.setResult(tl.TaskResult.Succeeded, 'Cache flushed successfully');
            console.log('Cache flushed successfully');
        }
        
        //closing the connection to the redis server
        await client.quit();

        return;
    }
    catch (err) {
        //Seting the Status of the task in case if any exception
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();