# API

## helpers

### helpers.clear

### helpers.copy

Copy file from `sourceFile` to `destFile`.  
This can be useful when need to copy files from directories 
that are not included in the main distribution of the project or repository.

```js
injector.helpers.copy(sourceFile, destFile[, onlyIfNewer]): void
```

_Parameters:_

| Name            | Data type  | Attributes    | Default value | Description |
| :-------------- | :--------- | :------------ | :------------ | :---------- |
| **sourceFile**  | _string_   |               |               | relative path from your CWD to the source file |
| **destFile**    | _string_   |               |               | relative path from your CWD to the destination file. **Note**, if folders path does not exist - it will be created |
| **onlyIfNewer** | _boolean_  | `<optional>`  | `false`       | copy only if source file is newer than destination file |


_Returns:_ `undefined`

_Examples:_

```js
const injector = require('webpack-injector');

injector.helpers.copy('./node_modules/jquery/dist/jquery.min.js', './public/assets/js/vendors/jquery.js', true);
injector.helpers.copy('./node_modules/webpack/readme.md', './dist/TEST.md', true);
```
