"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var axios_1 = require("axios");
var state_1 = require("./state");
var stores = [];
var base_uri = window.location.protocol + '//' + window.location.host;
var config_asset_uri = '/config.json';
var default_cfg = {};
var fetched_cfg = {};
var combined_cfg = {};
var debug_cb = null;
var fetched_cb = null;
var fetching_error_cb = null;
var fetching_error = null;
var fetching_status = 'not_initialized';
var get_config_listeners = [];
var component_listeners = [];
function initiateFetch() {
    fetching_status = 'fetching';
    if (debug_cb) {
        debug_cb("Fetching");
    }
    return axios_1.default({
        url: base_uri + config_asset_uri,
        method: 'GET'
    })
        .then(function (res) {
        if (debug_cb) {
            debug_cb("Fetch completed " + JSON.stringify(fetched_cfg));
        }
        fetched_cfg = res.data;
        combined_cfg = Object.assign({}, default_cfg, fetched_cfg);
        fetching_status = 'completed';
        stores.forEach(function (store) {
            store.actions.set(combined_cfg);
        });
        if (fetched_cb !== null) {
            fetched_cb(combined_cfg);
        }
        get_config_listeners.forEach(function (listener) {
            listener();
        });
        setTimeout(function () {
            //Timeout here to force the component listeners to the end of the execution chain,
            //after the callbacks have all been executed.
            component_listeners.forEach(function (listener) {
                listener();
            });
            if (debug_cb) {
                debug_cb("Component listeners called.");
            }
        }, 10);
    })
        .catch(function (err) {
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
        if (get_config_listeners.length === 0 &&
            fetching_error_cb === null) {
            console.error('withConfig: ERROR WHEN FETCHING CONFIG:');
            console.error(err);
        }
        get_config_listeners.forEach(function (listener) {
            listener();
        });
        component_listeners.forEach(function (listener) {
            listener();
        });
        throw err;
    });
}
function fetchCfg() {
    return new Promise(function (resolve, reject) {
        if (fetching_status === 'completed') {
            resolve(combined_cfg);
            return;
        }
        if (fetching_status === 'failed') {
            reject(fetching_error);
            return;
        }
        get_config_listeners.push(function () {
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
function getCfg() {
    if (fetching_status !== "completed") {
        console.warn("withConfig: getConfig was run before config finished fetching.\n        withConfig.fetch() returns a promise which resolves when fetch completes, you might want to use it instead.");
    }
    return combined_cfg;
}
function WithConfigHOC(WrappedComponent, SpinnerComponent, ErrorComponent) {
    var WithConfig = /** @class */ (function (_super) {
        __extends(WithConfig, _super);
        function WithConfig(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { error: false, loading: true };
            return _this;
        }
        WithConfig.prototype.componentListener = function () {
            if (fetching_status === 'failed') {
                this.setState({ error: true });
            }
            this.setState({ loading: false });
        };
        WithConfig.prototype.componentDidMount = function () {
            var _this = this;
            component_listeners.push(function () {
                _this.componentListener();
            });
            if (fetching_status === 'completed') {
                this.setState({ loading: false });
                return;
            }
            if (fetching_status === 'not_initialized') {
                initiateFetch();
            }
        };
        WithConfig.prototype.componentWillUnmount = function () {
            var listener_index = component_listeners.indexOf(this.componentListener);
            component_listeners.splice(listener_index, 1);
        };
        WithConfig.prototype.render = function () {
            if (this.state.error) {
                if (ErrorComponent) {
                    return React.createElement(ErrorComponent, null);
                }
                return (React.createElement("p", { style: {
                        textAlign: 'center',
                        marginTop: '20%'
                    } }, "Oops, something went wrong."));
            }
            if (this.state.loading) {
                if (SpinnerComponent) {
                    return React.createElement(SpinnerComponent, __assign({}, this.props));
                }
                return null;
            }
            return React.createElement(WrappedComponent, __assign({ config: combined_cfg, config_state: this.state }, this.props));
        };
        return WithConfig;
    }(React.Component));
    return WithConfig;
}
exports.WithConfigHOC = WithConfigHOC;
(function (WithConfigHOC) {
    function setDefault(default_config) {
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
    WithConfigHOC.setDefault = setDefault;
    function fetch() {
        return fetchCfg();
    }
    WithConfigHOC.fetch = fetch;
    function getConfig() {
        return getCfg();
    }
    WithConfigHOC.getConfig = getConfig;
    function getDefault() {
        return default_cfg;
    }
    WithConfigHOC.getDefault = getDefault;
    function getFetched() {
        return fetched_cfg;
    }
    WithConfigHOC.getFetched = getFetched;
    function setFetchedCallback(cb) {
        fetched_cb = cb;
    }
    WithConfigHOC.setFetchedCallback = setFetchedCallback;
    function setFetchingErrorCallback(cb) {
        fetching_error_cb = cb;
    }
    WithConfigHOC.setFetchingErrorCallback = setFetchingErrorCallback;
    function addStore(store) {
        var i = stores.push(store.addState("config", state_1.default));
        if (fetching_status === "completed") {
            stores[i].actions.set(combined_cfg);
        }
    }
    WithConfigHOC.addStore = addStore;
    function setDebugCallback(cb) {
        debug_cb = cb;
    }
    WithConfigHOC.setDebugCallback = setDebugCallback;
})(WithConfigHOC = exports.WithConfigHOC || (exports.WithConfigHOC = {}));
exports.default = WithConfigHOC;

//# sourceMappingURL=index.js.map
