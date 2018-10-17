import * as React from 'react';
import axios from 'axios';
import state_definition from './state';



export interface WithConfigState {
    error: boolean;
    loading: boolean;
}

type Status = "not_initialized" | "fetching" | "completed" | "failed";

let stores = [];

let base_uri = window.location.protocol + '//' + window.location.host;
let config_asset_uri = '/config.json';

let default_cfg: object = {};
let fetched_cfg: object = {};
let combined_cfg = {};

let debug_cb = null;

let fetched_cb = null;
let fetching_error_cb = null;
let fetching_error = null;

let fetching_status: Status = 'not_initialized';
let get_config_listeners = [];
let component_listeners = [];

function initiateFetch(): Promise<any> {
    fetching_status = 'fetching';
    if (debug_cb) {
        debug_cb("Fetching: " + base_uri + config_asset_uri);
    }

    return axios({
        url: base_uri + config_asset_uri,
        method: 'GET'
    })
    .then((res) => {
        fetched_cfg = res.data;
        if (debug_cb) {
            debug_cb("Fetch completed " + JSON.stringify(fetched_cfg));
        }
        combined_cfg = Object.assign({}, default_cfg, fetched_cfg);
        fetching_status = 'completed';
        stores.forEach((store) => {
            store.actions.set(combined_cfg);
        });
        if (fetched_cb !== null) {
            fetched_cb(combined_cfg);
        }
        get_config_listeners.forEach((listener) => {
            listener();
        });
        setTimeout(() => {
            //Timeout here to force the component listeners to the end of the execution chain,
            //after the callbacks have all been executed.
            component_listeners.forEach((listener) => {
                listener();
            });
            if (debug_cb) {
                debug_cb("Component listeners called.");
            }
        }, 10);
    })
    .catch((err) => {
        if (debug_cb) {
            debug_cb("Fetching failed: " + err.message);
        }
        fetching_status = 'failed';
        err.network_error = true;
        fetching_error = err;
        if (fetching_error_cb !== null) {
            fetching_error_cb(err);
            return;
        }
        if (
            get_config_listeners.length === 0 &&
            fetching_error_cb === null
        ) {
            console.error('withConfig: ERROR WHEN FETCHING CONFIG:');
            console.error(err);
        }
        get_config_listeners.forEach((listener) => {
            listener();
        });
        component_listeners.forEach((listener) => {
            listener();
        });
        throw err;
    });
}

function fetchCfg(): Promise<any> {
    return new Promise((resolve, reject) => {
        if (fetching_status === 'completed') {
            resolve(combined_cfg);
            return;
        }
        if (fetching_status === 'failed') {
            reject(fetching_error);
            return;
        }
        get_config_listeners.push(() => {
            if (fetching_status === 'completed') {
                resolve(combined_cfg);
                return;
            }
            reject(fetching_error);
            return;
        });
        if (fetching_status === 'not_initialized') {
            initiateFetch();
        }
    });
}

function getCfg(): any {
    if (fetching_status !== "completed") {
        console.warn(`withConfig: getConfig was run before config finished fetching.
        withConfig.fetch() returns a promise which resolves when fetch completes, you might want to use it instead.`);
    }
    return combined_cfg;
}


export function WithConfigHOC (
    WrappedComponent: typeof React.Component,
    SpinnerComponent?: typeof React.Component,
    ErrorComponent?: typeof React.Component
): typeof React.Component {
    class WithConfig extends React.Component<any, WithConfigState> {
        constructor(props) {
            super(props);

            this.state = { error: false, loading: true };
        }

        componentListener() {
            if (fetching_status === 'failed') {
                this.setState({ error: true });
            }
            this.setState({ loading: false });
        }

        componentDidMount() {
            component_listeners.push(() => {
                this.componentListener();
            });
            if (fetching_status === 'completed') {
                this.setState({ loading: false });
                return;
            }
            if (fetching_status === 'not_initialized') {
                initiateFetch();
            }
        }

        componentWillUnmount() {
            let listener_index = component_listeners.indexOf(
                this.componentListener
            );
            component_listeners.splice(listener_index, 1);
        }

        render() {
            if (this.state.error) {
                if (ErrorComponent) {
                    return <ErrorComponent />;
                }
                return (
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '20%'
                        }}
                    >
                        Oops, something went wrong.
                    </p>
                );
            }
            if (this.state.loading) {
                if (SpinnerComponent) {
                    return <SpinnerComponent {...this.props} />;
                }
                return null;
            }
            return <WrappedComponent config={combined_cfg} config_state={this.state} {...this.props} />;
        }
    }

    return WithConfig;
}

export namespace WithConfigHOC {
    export function setDefault(default_config) {
        if (Object.keys(default_cfg).length > 0) {
            console.error('withConfig error: Cannot setDefault; Default config already set!');
            return;
        }
        if (typeof default_config !== 'object') {
            console.error('withConfig error: Arguemnt default_config is required to be an object.');
            return;
        }
        default_cfg = default_config;
        combined_cfg = Object.assign({}, default_cfg, fetched_cfg);
    }
    export function fetch() {
        return fetchCfg();
    }
    export function getConfig() {
        return getCfg();
    }
    export function getDefault() {
        return default_cfg;
    }
    export function getFetched() {
        return fetched_cfg;
    }
    export function setFetchedCallback(cb) {
        fetched_cb = cb;
    }
    export function setFetchingErrorCallback(cb) {
        fetching_error_cb = cb;
    }
    export function addStore(store) {
        let i = stores.push(store.addState("config", state_definition));
        if (fetching_status === "completed") {
            stores[i].actions.set(combined_cfg);
        }
    }
    export function setDebugCallback(cb) {
        debug_cb = cb;
    }
}

export default WithConfigHOC;
