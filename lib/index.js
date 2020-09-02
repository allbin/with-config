"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithConfig = void 0;
var react_1 = __importDefault(require("react"));
var axios_1 = __importDefault(require("axios"));
exports.WithConfig = function (_a) {
    var children = _a.children, default_config = _a.default_config, Context = _a.Context;
    var _b = react_1.default.useState({}), config = _b[0], setConfig = _b[1];
    react_1.default.useEffect(function () {
        void axios_1.default
            .get('', {})
            .then(function (r) { return setConfig(__assign(__assign({}, default_config), r.data)); })
            .catch(function (err) {
            console.error(err);
        });
    }, [default_config]);
    if (Object.keys(config).length > 0) {
        return react_1.default.createElement(Context.Provider, { value: config }, children);
    }
    return null;
};
//# sourceMappingURL=index.js.map