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
        //authentication method for the redis server
        const _redisPwdType: string = tl.getInput('redisPwdType', true)!;
        //db index in the redis server
        const _redisdb: string = tl.getInput('redisdb', true)!;
        
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
            tls :  (_redisPwdType == 'sas') ? { servername : _redishost } : null,
            db : (_redisdb == null) ? '0' : _redisdb
        };

        //creating redis connetion
        var client = redis.createClient(_redisport, _redishost, _redisOptions);

        //flushing the redis server
        var flushallresult = await client.flushdb();
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