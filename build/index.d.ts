export declare class FastApiSessionController {
    name: string;
    constructor(name: string);
    static FastApiSession: FastApiSessionController;
    static ExpressSession: FastApiSessionController;
}
export declare class FastApiClient {
    private basePath;
    private baseUri;
    private sessionController;
    private corsEnabled;
    constructor(basePath?: string, baseUri?: string);
    setSession(controllerCode: FastApiSessionController): void;
    setCors(): void;
    registerRouter(className: any, router: any): any;
    execute(className: any, actionName: any, args: any, method?: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map