// jshint esversion:6
var outputJson, jsonObj, docFile;
var fs, home, path;
path = require('path');
fs = require('fs-extra');
home = require('os').homedir();
outputJson = function(file, json) {
    fs.outputJsonSync(file, json);
};
var NestedError = require('nested-error-stacks');

var json, file;
file = path.join(
    home,
    '/Documents/Adobe Scripts/Scripts Panel/Clients/Envision Aviation/watchFolder',
    // '/Documents/Adobe Scripts/Scripts Panel/Clients/Envision Aviation/watchFolder', +(new Date()) +
    // '_' + ("000000" + ((Math.random() * 100000) | 0)).slice(-6) + '.jobList' +
    'job.jobList'
);
json = {
    task: 'zZstack',
    started: +(new Date()),
    releasePaths: true,
    colorEnds: true,
    fixedDist: false,
    files: [file, 2, 3, 0, 5]
};
json.fileCount = json.files.length;
outputJson(file, json);

try {
    jsonObj = fs.readJsonSync(file);

    console.log(docFile = jsonObj.files.pop());
    outputJson(file, jsonObj);
} catch (err) {
    console.log('!!!!!!!\n' + err);
}
	