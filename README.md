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
Add `"with-config": "git+https://bitbucket.org/allbin/with-config.git#v`**`x.y.z`** to package.json. Where **x.y.z** is the version tagged.

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

### Example with default config and initial fetch
```
import React from 'react';
import withConfig from 'with-config';
import default_config from './default_config.js';
import SomeComponent from './components/SomeComponent';

withConfig().setDefault(default_config);
withConfig().getConfig().then((config) => {
    //Do something with config.
    //Such as configure ErrorReporting URLs etc.
}).catch((err) => {
    //Fetch failed. The use will see the default error message
    //or optional ErrorComponent.
});

let SomeComponentWithConfig = withConfig(SomeComponent);

export default class MyComp extends React.Component {
    ...

    render() {
        return (
            <SomeComponentWithConfig>
                <ChildComponent />
            </SomeComponentWithConfig>
        );
    }
}

```
**NOTE:** ChildComponent will only show after fetch is complete.

# Wrapping function
The HOC wrapping function attaches the `config` prop to the component being wrapped.

Example: `withConfig(YourComponent)` will give access to `this.props.config` inside *YourComponent*.

### Optional parameters
#### SpinnerComponent
*withConfig(YourComponent, **`SpinnerComponent`**)*.  
Optionally a second component can be supplied which will be shown while the config is being fetched. The spinner component, if supplied, also gets any props assigned to the wrapped component.

#### ErrorComponent
*withConfig(YourComponent, SpinnerComponent || null, **`ErrorComponent`**)*.  
Optionally a third component can be supplied. It will be displayed when a fetch has failed due to network issues.  
Defaults to showing the text "Oops, something went wrong." if no ErrorComponent is supplied.

# Utility functions

`withConfig().getConfig()` - Returns a promise that resolves to the current config values, any default values merged with any fetched values.  
If the fetch has not been initiated it will be by this call and it will resolve once finished. Alias: `withConfig().fetch()`.

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

**NOTE:** If the fetch fails the optional [ErrorComponent](#error-component) will show.
