import React from 'react';
declare type AnyConfig = {
    [key: string]: any;
};
interface WithConfigProps {
    default_config: AnyConfig;
    Context: React.Context<AnyConfig>;
}
export declare const WithConfig: React.FC<WithConfigProps>;
export {};
