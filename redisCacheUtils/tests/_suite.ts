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
    //authentication method for the redis server
    const _redisPwdType: string = constants._redisPwdType;
    //authentication method for the redis server
    const _redisdb: string = constants._redisPwdType;
    
    //creating redis connetion
    var client = redis.createClient( _redisport, _redishost,
        {
            auth_pass : _rediskey,
            tls :  (_redisPwdType == 'sas') ?  { servername : _redishost } : null,
            db : _redisdb
        }
    );

    //creating redis connetion
    var client_second = redis.createClient( _redisport, _redishost,
        {
            auth_pass : _rediskey,
            tls :  (_redisPwdType == 'sas') ?  { servername : _redishost } : null,
            db : '1'
        }
    );

    before(function () {

    });

    after(() => {

    });

    //Add key test with prefix
    it('should Add key to cache with repfix ', async () => {


        await client.setAsync('samplekey1', 'samplevalue1');
        
        let tp = path.join(__dirname, "redisCacheAddKeyTests", 'redisCacheAddKey_withPrefix.js');        
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        var result1 = await client.getAsync('samplekey1');

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        assert.equal(result1.toString(), 'samplevalue1', "Cache key 1 should not update after task");

        var prefixresult1 = await client.getAsync('sampleprefixsamplekey1');
        assert.equal(prefixresult1.toString(), 'sampleprefixValue1', "Cache key 1 should be added");

        await Promise.resolve();

    }).timeout(10000);


    //Add key test without prefix
    it('should Add key to cache without prefix', async () => {

        let tp = path.join(__dirname, "redisCacheAddKeyTests", 'redisCacheAddKey_withoutPrefix.js');      
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        var result1 = await client.getAsync('samplekey1');

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        assert.equal(result1.toString(), 'sampleNewValue1', "New Key should be updated");

        await Promise.resolve();

    }).timeout(10000);


    //Flush all test
    it('should succeed flush all without prefix', async () => {

        
        await client.setAsync('samplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('samplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        let tp = path.join(__dirname, "redisCacheFlushAllTests", 'redisCacheFlushAll_withoutPrefix.js');
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
    it('should succeed delete key without prefix', async () => {

        
        await client.setAsync('samplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('samplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        let tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_withoutPrefix.js');
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
    it('should succeed delete key with prefix', async () => {

        
        await client.setAsync('sampleprefixsamplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('sampleprefixsamplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        let tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_withPrefix.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        var result1 = await client.getAsync('sampleprefixsamplekey1');
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

        let tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        await Promise.resolve();

    }).timeout(10000);


    
    //Flush DB test
    it('should succeed flush DB without prefix', async () => {

        
        await client.setAsync('samplekey1', 'samplevalue1');
        await client.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1 = await client.getAsync('samplekey1');
        var before_result2  = await client.getAsync('samplekey2');

        await client_second.setAsync('samplekey1', 'samplevalue1');
        await client_second.setAsync('samplekey2', 'samplevalue2');
        
        var before_result1_second = await client_second.getAsync('samplekey1');
        var before_result2_second  = await client_second.getAsync('samplekey2');

        let tp = path.join(__dirname, "redisCacheFlushDBTests", 'redisCacheFlushDB_withoutPrefix.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        var result1 = await client.getAsync('samplekey1');
        var result2 = await client.getAsync('samplekey2');

        var result1_second = await client_second.getAsync('samplekey1');
        var result2_second = await client_second.getAsync('samplekey2');

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
        assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
        assert.equal(result1, null, "Cache key 1 removed");
        assert.equal(result2, null, "Cache key 2 removed");
        assert.equal(result1_second, before_result1_second, "Other DB Cache key 1 retained");
        assert.equal(result2_second, before_result2_second, "Other DB Cache key 2 retained");

        await Promise.resolve();

    }).timeout(10000);

   
});