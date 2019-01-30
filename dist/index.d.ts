import * as React from 'react';
export interface WithConfigState {
    error: boolean;
    loading: boolean;
}
export declare function WithConfigHOC(WrappedComponent: typeof React.Component, SpinnerComponent?: typeof React.Component, ErrorComponent?: typeof React.Component): typeof React.Component;
export declare namespace WithConfigHOC {
    function setDefault(default_config: any): void;
    function get(): Promise<any>;
    function getCurrentConfig(): any;
    function getDefault(): object;
    function getFetched(): object;
    function setFetchedCallback(cb: any): void;
    function setFetchingErrorCallback(cb: any): void;
    function addStore(store: any): void;
    function setDebugCallback(cb: any): void;
}
export default WithConfigHOC;
//# sourceMappingURL=index.d.ts.map