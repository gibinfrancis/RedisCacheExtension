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
        //Cache key which need to be deleted
        const _redisCachekey: string = tl.getInput('rediscachekey', true)!;
        
        //Checking for all required fields
        if (_redishost == '' || 
            _redisport == '' ||
            _rediskey == '' ||
            _redisCachekey == '') {
            
            //Seting the Status of the task
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;

        }
        
        //creating redis connetion
        var client = redis.createClient( _redisport, _redishost,
        {
            auth_pass : _rediskey,
            tls : {
                servername : _redishost
            }
        });

        //Chekcing the cache key is '*'
        //If the value is '*' then it will be flushed
        //other wise the specific key will be deleted
        if(_redisCachekey == '*') 
        {
            //flushing the redis server
            var flushallresult = await client.flushall();
            if(flushallresult!= null)
            {
                tl.setResult(tl.TaskResult.Succeeded, 'Cache flushed successfully');
                console.log('Cache flushed successfully');
            }
        }
        else
        {
            //deleteing the specific key from redis server
            var delKeyResult = await client.del(_redisCachekey);
            if(delKeyResult != null) 
            {
                //Seting the Status of the task
                tl.setResult(tl.TaskResult.Succeeded, 'Cache key ' + _redisCachekey + ' cleared successfully');
                console.log('Cache key ' + _redisCachekey + ' cleared successfully');
            }
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