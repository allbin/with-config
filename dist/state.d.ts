interface InitialState {
    [key: string]: any;
    config_initialized: false;
}
declare const _default: {
    reducer: (state: InitialState, action: any) => any;
    actions: {
        set: (state: any, config: any) => {
            type: string;
            payload: any;
        };
        update: (state: any, new_config_settings: any) => {
            type: string;
            payload: any;
        };
    };
};
export default _default;
//# sourceMappingURL=state.d.ts.map