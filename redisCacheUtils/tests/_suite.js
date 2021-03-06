"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var assert = __importStar(require("assert"));
var ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
var constants = require('./config');
var redis = require('redis');
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
describe('Cache Clear Tests', function () {
    var _this = this;
    //Host name of the redis server
    var _redishost = constants._redishost;
    //port address of the redis server
    var _redisport = constants._redisport;
    //key to authenticate to the redis server
    var _rediskey = constants._rediskey;
    //authentication method for the redis server
    var _redisPwdType = constants._redisPwdType;
    //authentication method for the redis server
    var _redisdb = constants._redisPwdType;
    //creating redis connetion
    var client = redis.createClient(_redisport, _redishost, {
        auth_pass: _rediskey,
        tls: (_redisPwdType == 'sas') ? { servername: _redishost } : null,
        db: _redisdb
    });
    //creating redis connetion
    var client_second = redis.createClient(_redisport, _redishost, {
        auth_pass: _rediskey,
        tls: (_redisPwdType == 'sas') ? { servername: _redishost } : null,
        db: '1'
    });
    before(function () {
    });
    after(function () {
    });
    //Add key test with prefix
    it('should Add key to cache with repfix ', function () { return __awaiter(_this, void 0, void 0, function () {
        var tp, tr, result1, prefixresult1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.setAsync('samplekey1', 'samplevalue1')];
                case 1:
                    _a.sent();
                    tp = path.join(__dirname, "redisCacheAddKeyTests", 'redisCacheAddKey_withPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 2:
                    result1 = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(result1.toString(), 'samplevalue1', "Cache key 1 should not update after task");
                    return [4 /*yield*/, client.getAsync('sampleprefixsamplekey1')];
                case 3:
                    prefixresult1 = _a.sent();
                    assert.equal(prefixresult1.toString(), 'sampleprefixValue1', "Cache key 1 should be added");
                    return [4 /*yield*/, Promise.resolve()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //Add key test without prefix
    it('should Add key to cache without prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var tp, tr, result1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tp = path.join(__dirname, "redisCacheAddKeyTests", 'redisCacheAddKey_withoutPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 1:
                    result1 = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(result1.toString(), 'sampleNewValue1', "New Key should be updated");
                    return [4 /*yield*/, Promise.resolve()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //Flush all test
    it('should succeed flush all without prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var before_result1, before_result2, tp, tr, result1, result2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.setAsync('samplekey1', 'samplevalue1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.setAsync('samplekey2', 'samplevalue2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 3:
                    before_result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 4:
                    before_result2 = _a.sent();
                    tp = path.join(__dirname, "redisCacheFlushAllTests", 'redisCacheFlushAll_withoutPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 5:
                    result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 6:
                    result2 = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
                    assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
                    assert.equal(result1, null, "Cache key 1 removed");
                    assert.equal(result2, null, "Cache key 2 removed");
                    return [4 /*yield*/, Promise.resolve()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //delete cache key test
    it('should succeed delete key without prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var before_result1, before_result2, tp, tr, result1, result2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.setAsync('samplekey1', 'samplevalue1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.setAsync('samplekey2', 'samplevalue2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 3:
                    before_result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 4:
                    before_result2 = _a.sent();
                    tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_withoutPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 5:
                    result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 6:
                    result2 = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
                    assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
                    assert.equal(result1, null, "Cache key 1 removed");
                    assert.equal(result2, 'samplevalue2', "Cache key 2 should not removed");
                    return [4 /*yield*/, Promise.resolve()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //delete cache key test
    it('should succeed delete key with prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var before_result1, before_result2, tp, tr, result1, result2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.setAsync('sampleprefixsamplekey1', 'samplevalue1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.setAsync('samplekey2', 'samplevalue2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getAsync('sampleprefixsamplekey1')];
                case 3:
                    before_result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 4:
                    before_result2 = _a.sent();
                    tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_withPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('sampleprefixsamplekey1')];
                case 5:
                    result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 6:
                    result2 = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
                    assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
                    assert.equal(result1, null, "Cache key 1 removed");
                    assert.equal(result2, 'samplevalue2', "Cache key 2 should not removed");
                    return [4 /*yield*/, Promise.resolve()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //delete cache key test
    it('should succeed delete key with invalid key', function () { return __awaiter(_this, void 0, void 0, function () {
        var tp, tr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tp = path.join(__dirname, "redisCacheClearKeyTests", 'redisCacheClearKey_failure.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
    //Flush DB test
    it('should succeed flush DB without prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var before_result1, before_result2, before_result1_second, before_result2_second, tp, tr, result1, result2, result1_second, result2_second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.setAsync('samplekey1', 'samplevalue1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.setAsync('samplekey2', 'samplevalue2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 3:
                    before_result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 4:
                    before_result2 = _a.sent();
                    return [4 /*yield*/, client_second.setAsync('samplekey1', 'samplevalue1')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, client_second.setAsync('samplekey2', 'samplevalue2')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, client_second.getAsync('samplekey1')];
                case 7:
                    before_result1_second = _a.sent();
                    return [4 /*yield*/, client_second.getAsync('samplekey2')];
                case 8:
                    before_result2_second = _a.sent();
                    tp = path.join(__dirname, "redisCacheFlushDBTests", 'redisCacheFlushDB_withoutPrefix.js');
                    tr = new ttm.MockTestRunner(tp);
                    tr.run();
                    return [4 /*yield*/, client.getAsync('samplekey1')];
                case 9:
                    result1 = _a.sent();
                    return [4 /*yield*/, client.getAsync('samplekey2')];
                case 10:
                    result2 = _a.sent();
                    return [4 /*yield*/, client_second.getAsync('samplekey1')];
                case 11:
                    result1_second = _a.sent();
                    return [4 /*yield*/, client_second.getAsync('samplekey2')];
                case 12:
                    result2_second = _a.sent();
                    assert.equal(tr.succeeded, true, 'should have succeeded');
                    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
                    assert.equal(tr.errorIssues.length, 0, "should have no errors");
                    assert.equal(before_result1.toString(), 'samplevalue1', "Cache key 1 updated");
                    assert.equal(before_result2.toString(), 'samplevalue2', "Cache key 2 updated");
                    assert.equal(result1, null, "Cache key 1 removed");
                    assert.equal(result2, null, "Cache key 2 removed");
                    assert.equal(result1_second, before_result1_second, "Other DB Cache key 1 retained");
                    assert.equal(result2_second, before_result2_second, "Other DB Cache key 2 retained");
                    return [4 /*yield*/, Promise.resolve()];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).timeout(10000);
});
