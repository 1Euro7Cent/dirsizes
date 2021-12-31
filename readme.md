Do you ever wanted to see what game is the largest? No problem. This can help.
This thing is written with 0 dependencies.

## Installation (for cmd only use)

```
npm i -g dirsizes
```

## Installation (for module use)

```
npm i dirsizes
```

## usage (cmd)

```
dirsizes <path>
```

## here is an example how it could look

![image](https://user-images.githubusercontent.com/67194495/146416151-e4516c2d-a708-4724-9389-8b73c93b2a6d.png)

## usage (module)

```js
const dirsizes = require("dirsizes");
/**
 * optional. set the logging functions. this are the default values
 */
dirSizes.setOnLog((...args) => {
  console.log(...args);
});
dirSizes.setOnLogWON(args => {
  process.stdout.write(args);
});
// check sizes. these are the default values
// first one is the path to the folder to check
// second one is if the values should be prettyfied
console.log(dirSizes.getSize("./", true));
/* 
returns
{
  dirs: { 'folderB': '234.0 B', 'folderA': '123.0 B' },
  files: {
    'fileA.txt': '1.0 GB',
    'fileB.txt': '200.0 KB',
    'fileC.txt': '1.0 MB',
  },
  timeTook: { milliseconds: 6 }
}

*/
```
