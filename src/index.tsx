import React, { PropsWithChildren } from 'react';
import axios from 'axios';

interface WithConfigProps {
  default_config: any;
  Context: React.Context<any>;
}

const WithConfig: React.FC<PropsWithChildren<WithConfigProps>> = ({
  children,
  default_config,
  Context,
}) => {
  const [config, setConfig] = React.useState<any>({});

  React.useEffect(() => {
    void axios
      .get<any>('/config.json')
      .then(({ data }) => {
        if (
          !data ||
          typeof data !== 'object' ||
          Array.isArray(data) ||
          data === null
        ) {
          throw new Error('WithConfig: Malformed config detected.');
        }
        setConfig({ ...default_config, ...data });
      })
      .catch((err) => {
        throw err;
      });
  }, [default_config]);

  if (Object.keys(config).length > 0) {
    return <Context.Provider value={config}>{children}</Context.Provider>;
  }

  return null;
};

export default WithConfig;
