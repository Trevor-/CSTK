var writeFileList, readFileList, truncateFileList;
writeFileList = function(releasePaths, colorEnds, fixedDist, files) {
    if (!files) return;
    var fs, home, path;
    path = require('path');
    fs = require('fs-extra');
    home = require('os').homedir();
    // const dir = '/Users/Trevor/Documents/Documents/Adobe Scripts/Scripts Panel/Clients/Envision Aviation/some/new/directory';
    const dir = home + '/Documents/Adobe Scripts/Scripts Panel/Clients/Envision Aviation/watchFolder';
    fs.ensureDir(dir, err => {

        if (err) return err;
        var jobFileName, fileContents, fileList, fileLength;
        fileList;
        jobFileName = path.join(dir, +(new Date()) + '.zZstackJobList.txt');
        fileContents = [
            'task:zZstack' +
            'fileCount:' + files.length,
            'releasePaths:' + releasePaths,
            'colorEnds:' + colorEnds,
            'fixedDist:' + fixedDist,
        ].join('\n');
            'file:' + files.join('\nfile:') + '\n'
        fs.writeFile(jobFileName, fileContents, function(err) {
            if (err) {
                return console.log(err);
            }
            // File has been written
        });

    });

};
writeFileList(true, true, false, ['file1', 'file2', 'file3']);

readFileList = function(file) {
    var fs, home, path;
    path = require('path');
    fs = require('fs-extra');
    var data, dataObject, fileCount;
    data = fs.readFile(file, (err, data) => {
        if (err) throw err;
        var a;
    });
};

