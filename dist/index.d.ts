import * as React from 'react';
export interface WithConfigFunction {
    setDefault: (any: any) => void;
    fetch: () => any;
    getConfig: () => Promise<any>;
    getDefault: () => any;
    getFetched: () => any;
    setFetchedCallback: (cb: (any: any) => any) => void;
    setFetchingErrorCallback: (cb: (any: any) => any) => void;
}
export interface WithConfigState {
    error: boolean;
    loading: boolean;
}
export declare function WithConfigHOC(WrappedComponent: typeof React.Component, SpinnerComponent?: typeof React.Component, ErrorComponent?: typeof React.Component): typeof React.Component;
export declare namespace WithConfigHOC {
    function setDefault(default_config: any): void;
    function fetch(): Promise<any>;
    function getConfig(): Promise<any>;
    function getDefault(): any;
    function getFetched(): any;
    function setFetchedCallback(cb: any): void;
    function setFetchingErrorCallback(cb: any): void;
}
export default WithConfigHOC;
//# sourceMappingURL=index.d.ts.map