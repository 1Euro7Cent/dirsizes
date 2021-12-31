const dirSizes = require('./index.js');
console.log(dirSizes)

/**
 * optional. set the logging functions. this are the default values
 */
dirSizes.setOnLog((...args) => {
    console.log(...args);
})
dirSizes.setOnLogWON((args) => {
    process.stdout.write(args);
})
// check sizes. these are the default values
console.log(dirSizes.getSize('./', true))