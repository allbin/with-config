import React from 'react';
import axios from 'axios';

interface WithConfigProps {
  default_config: any;
  Context: React.Context<any>;
}

const WithConfig: React.FC<WithConfigProps> = ({
  children,
  default_config,
  Context,
}) => {
  const [config, setConfig] = React.useState<any>({});

  React.useEffect(() => {
    void axios
      .get<any>('/config.json')
      .then((r) => setConfig({ ...default_config, ...r.data }))
      .catch((err) => {
        console.error(err);
      });
  }, [default_config]);

  if (Object.keys(config).length > 0) {
    return <Context.Provider value={config}>{children}</Context.Provider>;
  }

  return null;
};

export default WithConfig;
