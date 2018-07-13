"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SET_CONFIG_STATE = "SET_CONFIG_STATE";
let default_state = {
    config_initialized: false
};
let reducer = (state = default_state, action) => {
    switch (action.type) {
        case SET_CONFIG_STATE: {
            return Object.assign({}, action.payload);
        }
        default: {
            return state;
        }
    }
};
let actions = {
    set: (state, config) => {
        return {
            type: SET_CONFIG_STATE,
            payload: Object.assign({ config_initialized: true }, config)
        };
    },
    update: (state, new_config_settings) => {
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
