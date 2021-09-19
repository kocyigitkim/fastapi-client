"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.FastApiClient = exports.FastApiSessionController = void 0;
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
var FastApiSessionController = /** @class */ (function () {
    function FastApiSessionController(name) {
        this.name = name;
    }
    FastApiSessionController.FastApiSession = new FastApiSessionController('fastapi');
    FastApiSessionController.ExpressSession = new FastApiSessionController('express');
    return FastApiSessionController;
}());
exports.FastApiSessionController = FastApiSessionController;
var FastApiClient = /** @class */ (function () {
    function FastApiClient(basePath, baseUri) {
        if (basePath === void 0) { basePath = "api"; }
        if (baseUri === void 0) { baseUri = window.location.origin; }
        this.corsEnabled = false;
        this.basePath = basePath;
        this.baseUri = baseUri;
        this.sessionController = FastApiSessionController.ExpressSession;
    }
    FastApiClient.prototype.setSession = function (controllerCode) {
        this.sessionController = controllerCode;
    };
    FastApiClient.prototype.setCors = function () {
        this.corsEnabled = true;
    };
    FastApiClient.prototype.registerRouter = function (className, router) {
        var _this = this;
        var actions = Object.getOwnPropertyNames(router.__proto__).filter(function (p) { return p != "constructor"; });
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            var actionNameParts = action.split('_');
            var actionName = actionNameParts.length == 2 ? actionNameParts[1] : actionNameParts[0];
            var actionMethod = actionNameParts.length == 2 ? actionNameParts[0] : 'get';
            var argNames = getParamNames(router[action]);
            var bindedAction = (function (executeAsync, argNames, actionMethod) {
                var bindedArgs = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    bindedArgs[_i - 3] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () {
                    var args, i, _a, argNames_1, argName;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                args = {};
                                i = 0;
                                for (_a = 0, argNames_1 = argNames; _a < argNames_1.length; _a++) {
                                    argName = argNames_1[_a];
                                    args[argName] = bindedArgs[i];
                                    i++;
                                }
                                return [4 /*yield*/, executeAsync(args, actionMethod)];
                            case 1: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            }).bind(this, this.execute.bind(this, className, actionName), argNames, actionMethod);
            router[action] = bindedAction;
        }
        return router;
    };
    FastApiClient.prototype.execute = function (className, actionName, args, method) {
        if (method === void 0) { method = "get"; }
        return __awaiter(this, void 0, void 0, function () {
            var extra, headers, sessionid, body, generatedURL, response;
            return __generator(this, function (_a) {
                extra = {};
                method = method.toLowerCase();
                headers = {
                    'Content-Type': 'application/json'
                };
                if (this.sessionController.name == "fastapi") {
                    sessionid = window.localStorage.getItem("fsi");
                    if (sessionid == null || sessionid == undefined || sessionid.trim().length == 0) {
                        sessionid = uuidv4();
                        window.localStorage.setItem("fsi", sessionid);
                    }
                    headers['sessionid'] = sessionid;
                }
                body = null;
                generatedURL = this.baseUri + "/" + this.basePath + "/" + className + "/" + actionName;
                if (method == "get" || method == "head") {
                    generatedURL += "?" + Object.keys(args).map(function (item) { return (item + "=" + escape((args[item] || "").toString())); }).join("&");
                }
                else {
                    body = JSON.stringify(args);
                }
                if (this.corsEnabled) {
                    extra["mode"] = "cors";
                }
                response = fetch(generatedURL.replace(/\/{2,}/g, "/").replace(/^(https?)\:\//, "$1://"), __assign({ method: method, headers: headers, body: body }, extra)).then(function (p) { return p.json(); }).catch(console.error);
                return [2 /*return*/, response];
            });
        });
    };
    return FastApiClient;
}());
exports.FastApiClient = FastApiClient;
//# sourceMappingURL=index.js.map