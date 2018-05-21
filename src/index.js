import React from 'react';
import axios from 'axios';

let base_uri = "https://" + window.location.hostname;
let config_asset_uri = '/config.json';

let default_cfg = null;
let fetched_cfg = null;
let combined_cfg = {};

let fetched_cb = null;
let fetching_error_cb = null;

let fetching_status = "not_initialized";
let listeners = [];

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
        listeners.forEach((listener) => { listener(); });
    }).catch((err) => {
        err.network_error = true;
        if (fetching_error_cb !== null) {
            fetching_error_cb(err);
            return;
        }
        console.error("withConfig: ERROR WHEN FETCHING CONFIG:");
        console.error(err);
        throw err;
    });
}

export default function withConfig(WrappedComponent = null, SpinnerComponent = null) {
    if (WrappedComponent === null) {
        return {
            setDefault: (default_config) => {
                if (default_cfg !== null) {
                    console.error("Cannot setDefault; Default config already set!");
                    return;
                }
                if (default_config instanceof Object !== false) {
                    console.error("Arguemnt default_config is required to be an object.");
                    return;
                }
                if (fetching_status !== "not_initialized") {
                    console.error("withConfig error: Cannot setDefault after a withConfig-wrapped component has been mounted.");
                    return;
                }
                default_cfg = default_config;
                combined_cfg = Object.assign({}, default_cfg);
            },
            getConfig: () => { return combined_cfg; },
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
                loading: false
            };
        }

        componentDidMount() {
            if (fetching_status !== "fetched") {
                this.setState({ loading: true });
                listeners.push(() => { this.setState({ loading: false }); });
                if (fetching_status === "not_initialized") {
                    initiateFetch();
                }
                return;
            }
        }

        render() {
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