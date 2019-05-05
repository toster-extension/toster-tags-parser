'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var minimist = _interopDefault(require('minimist'));
var path = require('path');
var puppeteer = require('puppeteer');
var cliProgress = require('cli-progress');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var FILENAME_REGEX = /^[\w,\s-]+\.[A-Za-z]{3,4}$/;
var QUERY_REGEX = /^(\??[\w\[\]-]+=[^&]*&?)+$/;
function clean(paths) {
    return paths.map(function (path) { return path.replace(/^\//, '').replace(/\/$/, ''); });
}
function isFile(path) {
    return FILENAME_REGEX.test(path);
}
function isQuery(path) {
    return QUERY_REGEX.test(path);
}
var urlGlue = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var clearedPaths = clean(paths);
    var last = paths
        .join('/')
        .split('/')
        .pop();
    if (isFile(last) || isQuery(last)) {
        return clearedPaths.join('/');
    }
    return clearedPaths.join('/') + "/";
};

var mkdir = require('mkdirp-sync');
function buildFilePath() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return path.resolve.apply(path, [process.cwd()].concat(args));
}
var Parser = /** @class */ (function () {
    function Parser(url, filePath) {
        this.url = url;
        this.filePath = filePath;
        this.browser = null;
        this.baseUrl = 'https://toster.ru';
        this.progress = new cliProgress.Bar({
            barCompleteChar: '#',
            barIncompleteChar: '.',
            stopOnComplete: true,
        });
        this.url = urlGlue(this.baseUrl, url);
        this.filePath = buildFilePath(filePath);
        var dirName = path.dirname(this.filePath);
        mkdir(dirName);
        if (!fs.existsSync(dirName)) {
            console.error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \"" + dirName + "\"!");
            process.exit(1);
        }
    }
    Parser.prototype.run = function (selector, totalPages) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                console.log('Selector: %s, Total pages: %d', selector, totalPages);
                return [2 /*return*/];
            });
        });
    };
    Parser.prototype.start = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer.launch()];
                    case 1:
                        _a.browser = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.stop = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.progressWrapper = function (promises) {
        var _this = this;
        var total = promises.length;
        var d = 0;
        this.progress.start(100, 0);
        promises.forEach(function (p) {
            p.then(function () {
                d++;
                var percentage = (d * 100) / total;
                _this.progress.update(parseInt(String(percentage), 10));
            });
        });
        return Promise.all(promises);
    };
    return Parser;
}());

var argv = minimist(process.argv.slice(2), {
    default: {
        pages: 62,
        output: null,
    },
    string: ['pages', 'output'],
    alias: {
        p: 'pages',
        o: 'output',
    },
});
if (!argv.output) {
    console.error('Не передан путь к файлу');
    process.exit(1);
}
var TagsParser = /** @class */ (function (_super) {
    __extends(TagsParser, _super);
    function TagsParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagsParser.prototype.run = function (selector, totalPages) {
        if (totalPages === void 0) { totalPages = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, _loop_1, this_1, i, pagesData, lines;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.start()];
                    case 1:
                        _a.sent();
                        promises = [];
                        _loop_1 = function (i) {
                            promises.push(this_1.browser.newPage().then(function (page) { return __awaiter(_this, void 0, Promise, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, page.goto("" + this.url + i, {
                                                timeout: 100000,
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, page.$$eval(selector, function (elements) {
                                                    return Array.from(elements).map(function (element) {
                                                        var image = (element.querySelector('img.tag__image'));
                                                        var link = (element.querySelector('.card__head-title a'));
                                                        return {
                                                            name: link.innerText,
                                                            slug: link.getAttribute('title'),
                                                            image: image
                                                                ? image.getAttribute('src')
                                                                : '',
                                                        };
                                                    });
                                                })];
                                    }
                                });
                            }); }));
                        };
                        this_1 = this;
                        for (i = 1; i <= totalPages; i++) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, this.progressWrapper(promises)];
                    case 2:
                        pagesData = _a.sent();
                        lines = pagesData.reduce(function (acc, item) { return acc.concat(item); });
                        this.saveToJSON(lines);
                        return [4 /*yield*/, this.stop()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagsParser.prototype.saveToJSON = function (lines, flags) {
        if (flags === void 0) { flags = 'w+'; }
        console.log('Собрано тегов:', lines.length);
        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }
        var logger = fs.createWriteStream(this.filePath, { flags: flags });
        var tagsList = [];
        lines.forEach(function (tag, index) {
            tagsList.push(__assign({ id: (index + 1) }, tag));
        });
        logger.write(JSON.stringify(tagsList, null, 2));
    };
    return TagsParser;
}(Parser));
var parser = new TagsParser('/tags/?page=', argv.output);
var pages = Number(argv.pages) || 62;
parser.run('header.card__head', pages);

exports.TagsParser = TagsParser;
