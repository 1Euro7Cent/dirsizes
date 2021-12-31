#!/usr/bin/env node
/**
 * This should check for all folders recursively and sort them in a list by size
 */
const fs = require('fs');
const path = require('path');






/**
 * sort object by size
 * @param {object} obj
 * @returns {object}
 */
function sortBySize(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push({
            key: key,
            value: obj[key]
        });
    }
    arr.sort(function (a, b) {
        return b.value - a.value;
    });

    // convert to object
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].key] = arr[i].value;
    }
    return obj;
}
/**
 * convert milliseconds to human readable time
 * @param {number} ms
 * @returns {string}
 */
function humanReadableTime(ms) {
    const units = ['years', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
    const intervals = [31536000000, 86400000, 3600000, 60000, 1000, 1];
    let time = {};
    for (let i = 0; i < intervals.length; i++) {
        if (ms > intervals[i]) {
            time[units[i]] = Math.floor(ms / intervals[i]);
            ms -= time[units[i]] * intervals[i];
        }
    }
    return time;
}
/**
 * this returns the human readable size from bytes
 * @param {number} size 
 * @returns {string}
 */
function humanReadableSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (size >= 1024) {
        size /= 1024;
        ++i;
    }
    return size?.toFixed?.(1) + ' ' + units[i];
}
/**
 * function to convert every value to human readable size
 * @param {object} obj
 * @returns {object}
 */
function humanReadable(obj) {
    var newObj = {};
    for (var key in obj) {
        // if key is object then call function again
        if (typeof obj[key] === 'object') {
            newObj[key] = humanReadable(obj[key]);
        } else {
            newObj[key] = humanReadableSize(obj[key]);
        }
    }
    return newObj;
}

/**
 * this function checks the size of the folder
 * @param {string} dir 
 * @returns {number}
 */
function check(dir) {
    var size = 0;
    try {
        let files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            let file = path.join(dir, files[i]);
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                // onLog(`checking ${file}... `);
                size += check(file);
            } else {
                size += stat.size;
            }
        }
    }
    catch (err) {
        onLog(err)
        size = -1
    }
    return size;
}
/**
 * this goes through every folder and checks the size
 * @param {string} dir 
 * @returns 
 */
function all(dir) {
    // onLog(dir);
    var sizes = {};
    var fileSizes = {};
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        let file = path.join(dir, files[i]);
        try {
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                onLogWON(`checking ${file}... `);
                // onLog(`checking ${file}`);
                sizes[file] = check(file);
                onLog('done: ' + humanReadableSize(sizes[file]));
            } else {
                // if (!sizes['files']) sizes['files'] = {};
                fileSizes[file] = stat.size;
            }
        }
        catch (err) {
            onLog(err)
        }
    }
    return { fileSizes, sizes };
}

/**
 * 
 * @param {string} dir path to check
 * @param {boolean} pretty if all values should be prettyfied. Default: true
 */
function getSize(dir, pretty = true) {
    var startTime = Date.now()
    var sizes = all(dir);
    for (var key in sizes) {
        var data = sortBySize(sizes[key])
        if (pretty) {
            sizes[key] = humanReadable(data);
        }
    }

    var endTime = Date.now()
    var time = endTime - startTime;
    var humanTime
    if (pretty) humanTime = humanReadableTime(time);
    else {
        humanTime = time;
    }

    return {
        dirs: sizes.sizes,
        files: sizes.fileSizes,
        timeTook: humanTime
    }


}
function onLog(...args) {
    console.log(...args);
}
function onLogWON(args) {
    process.stdout.write(args);
}
function setOnLog(func) {
    onLog = func;
}
function setOnLogWON(func) {
    onLogWON = func;
}
module.exports = {
    getSize,
    setOnLog,
    setOnLogWON
}

if (require.main === module) {
    onLog('called directly');
    var args = process.argv.slice(2);
    onLog(args)
    var startTime = Date.now();
    var result = all(args[0] ? args.join(' ') : './')

    onLog('Time took:')
    console.table(humanReadableTime(Date.now() - startTime))
    // log result and fileresult separately to console
    for (var key in result) {
        var data = sortBySize(result[key])
        var readable = humanReadable(data);
        onLog(key + ':');
        console.table(readable)
    }
} else {
    onLog('required as a module');
}


