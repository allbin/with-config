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
export default ConfigContext;
```

src/index.tsx:
```
import WithConfig from 'with-config';
import ConfigContext, { default_config } from './config';

[...]

ReactDOM.render(
  <WithConfig Context={ConfigContext} default_config={default_config}>
    <...>
  </WithConfig>
)
```

src/views/View.tsx:
```
import ConfigContext from '../config';


const View = React.FC = () => {
  const config = useContext(ConfigContext);

  [...]
}
```
