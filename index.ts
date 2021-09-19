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

export class FastApiSessionController {
    constructor(public name: string) {}
    public static FastApiSession: FastApiSessionController = new FastApiSessionController('fastapi');
    public static ExpressSession: FastApiSessionController = new FastApiSessionController('express');
}

export class FastApiClient {
    private basePath: string;
    private baseUri: string;
    private sessionController: FastApiSessionController;
    private corsEnabled: boolean = false;
    constructor(basePath = "api", baseUri = window.location.origin) {
        this.basePath = basePath;
        this.baseUri = baseUri;
        this.sessionController = (FastApiSessionController as any).ExpressSession;
    }
    setSession(controllerCode: FastApiSessionController) {
        this.sessionController = controllerCode;
    }
    setCors() {
        this.corsEnabled = true;
    }
    registerRouter(className, router) {
        var actions = Object.getOwnPropertyNames(router.__proto__).filter(p => p != "constructor");
        for (var action of actions) {
            var actionNameParts = action.split('_');
            var actionName = actionNameParts.length == 2 ? actionNameParts[1] : actionNameParts[0];
            var actionMethod = actionNameParts.length == 2 ? actionNameParts[0] : 'get';
            var argNames = getParamNames(router[action]);
            var bindedAction = (async (executeAsync, argNames, actionMethod, ...bindedArgs) => {
                var args = {};
                var i = 0;
                for (var argName of argNames) {
                    args[argName] = bindedArgs[i];
                    i++;
                }
                return await executeAsync(args, actionMethod);
            }).bind(this, this.execute.bind(this, className, actionName), argNames, actionMethod);
            router[action] = bindedAction;
        }
        return router;
    }

    async execute(className, actionName, args, method = "get") {
        var extra = {};
        method = method.toLowerCase();
        var headers = {
            'Content-Type': 'application/json'
        };
        if (this.sessionController.name == "fastapi") {
            var sessionid = window.localStorage.getItem("fsi");
            if (sessionid == null || sessionid == undefined || sessionid.trim().length == 0) {
                sessionid = uuidv4();
                window.localStorage.setItem("fsi", sessionid);
            }
            headers['sessionid'] = sessionid;
        }
        var body = null;
        var generatedURL = `${this.baseUri}/${this.basePath}/${className}/${actionName}`;
        if (method == "get" || method == "head") {
            generatedURL += "?" + Object.keys(args).map(item => (`${item}=${escape((args[item] || "").toString())}`)).join("&");
        }
        else {
            body = JSON.stringify(args);
        }
        if (this.corsEnabled) {
            extra["mode"] = "cors";
        }
        var response = fetch(generatedURL.replace(/\/{2,}/g, "/").replace(/^(https?)\:\//, "$1://"), {
            method: method,
            headers: headers,
            body: body,
            ...extra
        }).then(p => p.json()).catch(console.error);
        return response;
    }
}
