# @allbin/with-config

### Example

src/config.ts:
```
interface ConfigType {
  [...]
}

export const default_config: ConfigType = {
  [...]
}

const ConfigContext = React.createContext<ConfigType>(default_config);
export default ConfigContext
```

src/index.tsx:
```
import WithConfig from 'with-config';
import ConfigContext, { default_config } from './config';

[...]

ReactDOM.render(
  <WithConfig context={ConfigContext} default_config={default_config}>
    <...>
  </WithConfig>
)
```
