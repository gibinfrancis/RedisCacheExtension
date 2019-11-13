import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
var constants = require('./config');

var redis = require('redis');
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

describe('Cache Clear Tests', function () {

    //Host name of the redis server
    const _redishost: string = constants._redishost;
    //port address of the redis server
    const _redisport: string = constants._redisport;
    //key to authenticate to the redis server
    const _rediskey: string = constants._rediskey;


    //creating redis connetion
    var client = redis.createClient( _redisport, _redishost,
        {
            auth_pass : _rediskey,
            tls : {
                servername : _redishost
            }
    });

    before(function () {

    });

    after(() => {

    });

    //Flush all test
    it('should succeed flush all', async () => {

        
        await client.setAsync('samplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('samplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        let tp = path.join(__dirname, 'flushallsuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        var result1 = await client.getAsync('samplekey1');
        var result2 = await client.getAsync('samplekey2');

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
        assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
        assert.equal(result1, null, "Cache key 1 removed");
        assert.equal(result2, null, "Cache key 2 removed");

        await Promise.resolve();

    }).timeout(10000);


    //delete cache key test
    it('should succeed delete key', async () => {

        
        await client.setAsync('samplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('samplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        let tp = path.join(__dirname, 'deletekeysuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        var result1 = await client.getAsync('samplekey1');
        var result2 = await client.getAsync('samplekey2');

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
        assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
        assert.equal(result1, null, "Cache key 1 removed");
        assert.equal(result2, 'samplevalue2', "Cache key 2 should not removed");

        await Promise.resolve();

    }).timeout(10000);




    //delete cache key test
    it('should succeed delete key with invalid key', async () => {

        let tp = path.join(__dirname, 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        await Promise.resolve();

    }).timeout(10000);
    
});