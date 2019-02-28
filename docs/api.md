# API

:arrow_left: [Documentation](./index.md)

#### *Sections*

- [Methods](#helpers)
    - [app](#app)
    - [cssLoaderOptions](#cssloaderoptions)
    - [customRules](#customrules)
    - [exportConfig](#exportconfig)
    - [externals](#externals)
    - [postcssLoaderPlugins](#postcssloaderplugins)
    - [publicPath](#publicpath)
    - [plugins](#plugins)
    - [resolveAlias](#resolveAlias)
    - [resolveModules](#resolveModules)
    - [sass](#sass)
    - [sassLoaderOptions](#sassloaderoptions)
    - [silent()](#silent)
    - [sourcemaps](#sourcemaps)
    - [styleLoaderOptions](#styleloaderoptions)
- [Properties](#properties)
    - [isProduction](#isproduction)
    - [isWatching](#iswatching)
- [Methods](#methods)
- [Helpers](#helpers)
    - [helpers.clear()](#helpersclear)
    - [helpers.copy()](#helperscopy)
    
---

## Methods

### app()

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

Specify your main single JS file.

```js
injector.app(sourceFile, distFile): Injector
```

_Parameters:_

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| **sourceFile**  | `string` | --- | Relative FS path from yout CWD = source file |
| **distFile**  | `string` | --- | Relative FS path from yout CWD = destinaion file (css result) |

Returns: `Injector` instance

```js
injector.app('./src/app.js', './dist/bundled-app.js');
```

---

### publicPath()

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

This option specifies the public URL of the output directory when referenced in a browser.  
See [webpack configuration -> output.publicPath](https://webpack.js.org/configuration/output#outputpublicpath)

```js
injector.publicPath(path): Injector
```

_Parameters:_

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| **path**  | `string` | --- | public URL |

Returns: `Injector` instance

_Usage example:_

```js
injector
    .app('./src/app.js', './dist/bundled-app.js')
    .publicPath('./src/app.js', './dist/bundled-app.js');
```

### silent()

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

Disable/enable information logs in terminal.  
_**Note!** The error logs will not be suppressed_

```js
injector.silent(value): injector
```

_Parameters:_

| Name       | Type      | Attributes    | Default       | Description                                    |
| :--------- | :-------- | :------------ | :------------ | :--------------------------------------------- |
| **value**  | _boolean_ |               |               | `true` - disable / `false` - enable logs again |

_Returns:_ `injector`

_Examples:_

```js
const injector = require('webpack-injector');

injector.helpers.clear('./public/assets/');
injector.helpers.clear('./my-logs/stats.json');
```

---

## Properties


### isProduction

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

_readonly_  
_type: `boolean`_  
_default: `false`_

Determined value - is webpack will be runned in production mode or development mode

```js
injector.isProduction: boolean
```


---



### isWatching

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

_readonly_  
_type: `boolean`_  
_default: `false`_

Determined value - is webpack will be watching files or not

```js
injector.isWatching: boolean




---

## Helpers


### helpers.clear()

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

Clear some folders or files, before webpack starts to bundle your project

```js
injector.helpers.clear(paths): void
```

_Parameters:_

| Name       | Type              | Attributes    | Default       | Description               |
| :--------- | :---------------- | :------------ | :------------ | :------------------------ |
| **paths**  | _string/string[]_ |               |               | paths that need to remove |


_Returns:_ `undefined`

_Examples:_

```js
const injector = require('webpack-injector');

injector.helpers.clear('./public/assets/');
injector.helpers.clear('./my-logs/stats.json');
```

---

### helpers.copy()

:arrow_left: [Documentation](./index.md) | :arrow_up: [Top](#readme)

Copy file from `sourceFile` to `distFile`.  
This can be useful when need to copy files from directories 
that are not included in the main distribution of the project or repository.

```js
injector.helpers.copy(sourceFile, distFile[, onlyIfNewer]): void
```

_Parameters:_

| Name            | Type       | Attributes    | Default       | Description                                    |
| :-------------- | :--------- | :------------ | :------------ | :--------------------------------------------- |
| **sourceFile**  | _string_   |               |               | relative path from your CWD to the source file |
| **distFile**    | _string_   |               |               | relative path from your CWD to the destination file. **Note**, if folders path does not exist - it will be created |
| **onlyIfNewer** | _boolean_  | `<optional>`  | `false`       | copy only if source file is newer than destination file |


_Returns:_ `undefined`

_Examples:_

```js
const injector = require('webpack-injector');

injector.helpers.copy('./node_modules/jquery/dist/jquery.min.js', './public/assets/js/vendors/jquery.js', true);
injector.helpers.copy('./node_modules/webpack/readme.md', './dist/TEST.md', true);
```

---


