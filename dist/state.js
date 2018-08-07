"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SET_CONFIG_STATE = "SET_CONFIG_STATE";
var default_state = {
    config_initialized: false
};
var reducer = function (state, action) {
    if (state === void 0) { state = default_state; }
    switch (action.type) {
        case SET_CONFIG_STATE: {
            return Object.assign({}, action.payload);
        }
        default: {
            return state;
        }
    }
};
var actions = {
    set: function (state, config) {
        return {
            type: SET_CONFIG_STATE,
            payload: Object.assign({ config_initialized: true }, config)
        };
    },
    update: function (state, new_config_settings) {
        return {
            type: SET_CONFIG_STATE,
            payload: Object.assign({ config_initialized: true }, state, new_config_settings)
        };
    }
};
exports.default = {
    reducer: reducer,
    actions: actions
};

//# sourceMappingURL=state.js.map
