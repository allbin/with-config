import React from 'react';
import axios from 'axios';

type AnyConfig = { [key: string]: any };

interface WithConfigProps {
  default_config: AnyConfig;
  Context: React.Context<AnyConfig>;
}

export const WithConfig: React.FC<WithConfigProps> = ({
  children,
  default_config,
  Context,
}) => {
  const [config, setConfig] = React.useState<AnyConfig>({});

  React.useEffect(() => {
    void axios
      .get<AnyConfig>('', {})
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
