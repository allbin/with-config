# withConfig

A repo for wrapping components with a withConfig HOC to ensure correct dynamic loading of config settings.
A spinner is optionally shown while the config is being fetched.

### Index
[Quick guide](#quick-guide)  
[HOC Wrapping function](#wrapping-function)  
[Utility functions](#utility-functions)  
[Setting default config](#setting-default-config)  
[Error handling](#error-handling)  



# Quick guide
Use `import withConfig from 'with-config'` in any file and wrap desired component in it to ensure dynamically loaded configs are available.

### Example MyComponent.jsx component:
```
import React from 'react';
import withConfig from 'with-config';

class MyComponent extends React.Component {
    ...
}

export default withConfig(MyComponent);
```

### Example inline component:
```
import React from 'react';
import withConfig from 'with-config';
import SomeComponent from './components/SomeComponent';

let SomeComponentWithConfig = withConfig(SomeComponent);

export default class MyComp extends React.Component {
    ...

    render() {
        return (
            <div>
                <SomeComponentWithConfig/>
            </div>
        );
    }
}

```

# Wrapping function
The HOC wrapping function attaches the `config` prop to the component being wrapped.

Example: `withConfig(YourComponent)` will give access to `this.props.config` inside *YourComponent*.

Optionally a second component can be supplied which will be shown while the config is being fetched: `withConfig(YourComponent, SpinnerComponent)`.

**NOTE:** The spinner component, if supplied, also gets any props assigned to the wrapped component.

# Utility functions

`withConfig().getConfig()` - Returns the current config values, any default values merged with any fetched values.  
Defaults to an empty object if fetch is not complete and no defaults are entered.

`withConfig().getDefault()` - Returns default config values. If none are set returns null.

`withConfig().getFetched()` - Returns the fetched config values.

`withConfig().setDefault(<object>)` - See [Setting default config](#setting-default-config).

`withConfig().setFetchedCallback(<callback function>)` - If set this function will trigger when fetching settings from server has completed. The callbacks only parameter will be the final config object.

`withConfig().setFetchErrorCallback(<callback function>)` - See [Error handling](#error-handling).




# Setting default config
Use `withConfig().setDefault(<object>)` to set the default config. Returns nothing.

**NOTE:** Defaults will be overwritten by fetched config settings.  
**NOTE:** Defaults can only be set before the first wrapped component has mounted.  
**NOTE:** Defaults can only be set once.  


# Error handling
Use `withConfig().setFetchErrorCallback(<callback function>)` to assign a callback function which is called with the Exception object if fetching from the server fails.

**NOTE:** If the fetch fails the optional spinner will show forever. Or nothing will show if no spinner is supplied.