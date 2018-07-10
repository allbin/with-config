interface IWithConfig {
    setDefault: (any) => void;
    fetch: () => any;
    getConfig: () => Promise<any>;
    getDefault: () => any;
    getFetched: () => any;
    setFetchedCallback: (cb: (any) => any) => void;
    setFetchingErrorCallback: (cb: (any) => any) => void;
}

interface WithConfigState {
    error: boolean;
    loading: boolean;
}
