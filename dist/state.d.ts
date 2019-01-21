interface InitialState {
    [key: string]: any;
    config_initialized: false;
}
declare const _default: {
    reducer: (state: InitialState, action: any) => any;
    actions: {
        set: (config: any, state: any) => {
            type: string;
            payload: any;
        };
        update: (new_config_settings: any, state: any) => {
            type: string;
            payload: any;
        };
    };
};
export default _default;
//# sourceMappingURL=state.d.ts.map