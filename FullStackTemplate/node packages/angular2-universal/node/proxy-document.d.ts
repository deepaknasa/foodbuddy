export declare class ProxyElement {
    private __zone?;
    readonly _zone: any;
    constructor(__zone?: any);
    readonly querySelector: any;
    readonly querySelectorAll: any;
    readonly tagName: any;
    readonly value: any;
    readonly nodeName: any;
    readonly nodeValue: any;
    readonly firstChild: any;
    readonly nextSibling: any;
    readonly parentElement: any;
    readonly childNodes: any;
    createElement(tagName: any): any;
}
export declare class ProxyDocument {
    private __zone?;
    readonly _zone: any;
    constructor(__zone?: any);
    readonly querySelector: any;
    readonly querySelectorAll: any;
    readonly tagName: any;
    readonly cookie: any;
    createElement(tagName: any): any;
}
export declare function createDocumentProxy(): ProxyDocument;
export declare function createGlobalProxy(): any;
