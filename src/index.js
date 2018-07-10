import React from 'react';
import axios from 'axios';

let base_uri = window.location.protocol + "//" + window.location.host;
let config_asset_uri = '/config.json';

let default_cfg = null;
let fetched_cfg = null;
let combined_cfg = {};

let fetched_cb = null;
let fetching_error_cb = null;
let fetching_error = null;

let fetching_status = "not_initialized";
let get_config_listeners = [];
let component_listeners = [];

function initiateFetch() {
    fetching_status = "fetching";

    axios({
        url: base_uri + config_asset_uri,
        method: "GET"
    }).then((res) => {
        fetched_cfg = res.data;
        combined_cfg = Object.assign({}, default_cfg, fetched_cfg);
        fetching_status = "completed";
        if (fetched_cb !== null) {
            fetched_cb(combined_cfg);
        }
        get_config_listeners.forEach((listener) => { listener(); });
        component_listeners.forEach((listener) => { listener(); });
    }).catch((err) => {
        fetching_status = "failed";
        err.network_error = true;
        fetching_error = err;
        if (fetching_error_cb !== null) {
            fetching_error_cb(err);
            return;
        }
        if (get_config_listeners.length === 0 && fetching_error_cb === null) {
            console.error("withConfig: ERROR WHEN FETCHING CONFIG:");
            console.error(err);
        }
        get_config_listeners.forEach((listener) => { listener(); });
        component_listeners.forEach((listener) => { listener(); });
        throw err;
    });
}

function getConfig() {
    return new Promise((resolve, reject) => {
        if (fetching_status === "completed") {
            resolve(combined_cfg);
            return;
        }
        if (fetching_status === "failed") {
            reject(fetching_error);
            return;
        }
        get_config_listeners.push(() => {
            if (fetching_status === "completed") {
                resolve(combined_cfg);
                return;
            }
            reject(fetching_error);
            return;
        });
        if (fetching_status === "not_initialized") {
            initiateFetch();
        }
    });
}

export default function withConfig(WrappedComponent = null, SpinnerComponent = null, ErrorComponent = null) {
    if (WrappedComponent === null) {
        return {
            setDefault: (default_config) => {
                if (default_cfg !== null) {
                    console.error("withConfig error: Cannot setDefault; Default config already set!");
                    return;
                }
                if (typeof default_config !== "object") {
                    console.error("withConfig error: Arguemnt default_config is required to be an object.");
                    return;
                }
                if (fetching_status !== "not_initialized") {
                    console.error("withConfig error: Cannot setDefault after a withConfig-wrapped component has been mounted.");
                    return;
                }
                default_cfg = default_config;
                combined_cfg = Object.assign({}, default_cfg);
            },
            fetch: () => { return getConfig(); },
            getConfig: () => { return getConfig(); },
            getDefault: () => { return default_cfg; },
            getFetched: () => { return fetched_cfg; },
            setFetchedCallback: (cb) => { fetched_cb = cb; },
            setFetchingErrorCallback: (cb) => { fetching_error_cb = cb; }
        };
    }

    return class WithConfig extends React.Component {
        constructor(props) {
            super();

            this.state = {
                error: false,
                loading: true
            };
        }

        componentListener() {
            if (fetching_status === "failed") {
                this.setState({ error: true });
            }
            this.setState({ loading: false });
        }

        componentDidMount() {
            component_listeners.push(() => { this.componentListener(); });
            if (fetching_status === "completed") {
                this.setState({ loading: false });
                return;
            }
            if (fetching_status === "not_initialized") {
                initiateFetch();
            }
        }

        componentWillUnmount() {
            let listener_index = component_listeners.indexOf(this.componentListener);
            component_listeners.splice(listener_index, 1);
        }

        render() {
            if (this.state.error) {
                if (ErrorComponent !== null) {
                    return <ErrorComponent />;
                }
                return (<p style={{ textAlign: "center", marginTop: "20%" }}>Oops, something went wrong.</p>);
            }
            if (this.state.loading) {
                if (SpinnerComponent !== null) {
                    return <SpinnerComponent {...this.props} />;
                }
                return null;
            }
            return <WrappedComponent config={combined_cfg} {...this.props} />;
        }
    };
}