'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withConfig;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var default_cfg = null;
var fetched_cfg = null;
var combined_cfg = {};

var fetched_cb = null;
var fetching_error_cb = null;

var fetching_status = "not_initialized";
var listeners = [];

function initiateFetch() {
    var url = "https://" + window.location.hostname;

    fetching_status = "fetching";

    (0, _axios2.default)({
        url: url,
        method: "GET"
    }).then(function (res) {
        fetched_cfg = res.data;
        combined_cfg = Object.assign({}, default_cfg, fetched_cfg);
        fetching_status = "completed";
        if (fetched_cb !== null) {
            fetched_cb(combined_cfg);
        }
        listeners.forEach(function (listener) {
            listener();
        });
    }).catch(function (err) {
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

function withConfig() {
    var WrappedComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var SpinnerComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (WrappedComponent === null) {
        return {
            setDefault: function setDefault(default_config) {
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
            getConfig: function getConfig() {
                return combined_cfg;
            },
            getDefault: function getDefault() {
                return default_cfg;
            },
            getFetched: function getFetched() {
                return fetched_cfg;
            },
            setFetchedCallback: function setFetchedCallback(cb) {
                fetched_cb = cb;
            },
            setFetchingErrorCallback: function setFetchingErrorCallback(cb) {
                fetching_error_cb = cb;
            }
        };
    }

    return function (_React$Component) {
        _inherits(WithConfig, _React$Component);

        function WithConfig(props) {
            _classCallCheck(this, WithConfig);

            var _this = _possibleConstructorReturn(this, (WithConfig.__proto__ || Object.getPrototypeOf(WithConfig)).call(this));

            _this.state = {
                loading: false
            };
            return _this;
        }

        _createClass(WithConfig, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                if (fetching_status !== "fetched") {
                    this.setState({ loading: true });
                    listeners.push(function () {
                        _this2.setState({ loading: false });
                    });
                    if (fetching_status === "not_initialized") {
                        initiateFetch();
                    }
                    return;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                if (this.state.loading) {
                    if (SpinnerComponent !== null) {
                        return _react2.default.createElement(SpinnerComponent, this.props);
                    }
                    return null;
                }
                return _react2.default.createElement(WrappedComponent, _extends({ config: combined_cfg }, this.props));
            }
        }]);

        return WithConfig;
    }(_react2.default.Component);
}