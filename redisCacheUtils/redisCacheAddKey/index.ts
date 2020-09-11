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
        //prefix key in the redis server
        const _redisprefix: string = tl.getInput('redisprefix', false)!;
        //Cache key which need to be added
        const _redisCachekey: string = tl.getInput('rediscachekey', true)!;
        //Cache value which need to be added
        const _rediscachevalue: string = tl.getInput('rediscachevalue', true)!;
        //db index in the redis server
        const _redisdb: string = tl.getInput('redisdb', true)!;
        
        //Checking for all required fields
        if (_redishost == '' || 
            _redisport == '' ||
            _rediskey == '' ||
            _redisCachekey == '' ||
            _rediscachevalue == '') {
            
            //Seting the Status of the task
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }

        //creating redis options
        var _redisOptions = {
            auth_pass : _rediskey,
            tls :  (_redisPwdType == 'sas') ? { servername : _redishost } : null,
            prefix : (_redisprefix == '' || _redisprefix == null) ? null :  _redisprefix,
            db : (_redisdb == null) ? '0' : _redisdb
        };

        //creating redis connetion
        var client = redis.createClient(_redisport, _redishost, _redisOptions);

        //adding the key
        var result = await client.set(_redisCachekey, _rediscachevalue);

        if(result!= null)
        {
            tl.setResult(tl.TaskResult.Succeeded, 'Cache key ' + _redisCachekey + ' addded successfully');
            console.log('Cache key ' + _redisCachekey + ' addded successfully');
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