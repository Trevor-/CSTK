// C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\js\debug.js
var createDebugAppList, launchDebug;

launchDebug = function(port) {
    var exec, debugApp, cmd;
    exec = require('child_process').exec;
    debugApp = '' + $('#debugApps').val();
    if (!(/:/.test(port))) {
        port = 'localhost:' + port;
    } else if (!(/http/.test(port))) {
        port = 'http://' + port;
    }
    if (debugApp === '0') {
        debugApp = window.cep.fs.showOpenDialogEx(false, false, 'hello');
        debugApp = debugApp.data[0];
        if (/chrome.exe|cefclient.exe/i.test(debugApp)) {
            createDebugAppList(debugApp);
        }
    }
    if (/chrome.exe/i.test(debugApp)) {
        cmd = '"' + debugApp + '" ' + port;
    } else if (/cefclient\.exe/i.test(debugApp)) {
        cmd = '"' + debugApp + '" --url=' + port;
    }
    if (cmd === '') {
        alert('Sorry at present only Chrome.exe and Cefclient.exe are suported :-<');
    }
    exec(cmd, function(err) {
        if (err !== null) alert('err:' + err + '@');
    });
};
createDebugAppList = function(appToAdd) {
    var $debugApps = $("#debugApps").prettyDropdown({
        height: 29,
        classic: true
    });
    $debugApps.refresh();
    try {
        var cstkFolder, defaultChromePath, cookieFile, fs, path, debugAppFile, csInterface, exec,
            defaultDebugAppFileContents, writeToDebugList, proccessDebugList, processFileList;
        var appSelection;

        fs = require('fs-extra');
        path = require('path');
        exec = require('child_process').exec;
        csInterface = new CSInterface();

        defaultChromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
        cstkFolder = path.join(csInterface.getSystemPath('userData'), 'Creative Scripts', 'CSTK');
        debugAppFile = path.join(cstkFolder, 'debugAppsList.txt');
        cookieFile = path.join(cstkFolder, 'debugAppSelection.txt');

        $("#debugApps").change(function() {
            appSelection = '' + $("#debugApps").val();
            fs.outputFile(cookieFile, appSelection);
            // if val is 0 open file dialog
        });

        processFileList = function(fileList) {
            var l, fl, versionHandler, newList = [],
                newDebugAppDropdownHtml, appPath, appVersion, appName, tempDropDown;
            fl = fileList.slice();
            // finding the version numbers on windows is really quite slow
            // so in the mean time we can make a temp dropdown
            tempDropDown = ['<option value="0">Choose debug app</option>'];
            l = fl.length;
            while (l--) {
                appPath = fileList[l];
                appName = appPath && appPath.match(/[^\/\\]+$/);
                if (appPath.match(/[\/\\]/)) tempDropDown.push(
                    '<option value="VALUE">APP</option>'
                    .replace(/APP/, appName)
                    .replace(/VALUE/, appPath)
                );
            }
            $('#debugApps').html(tempDropDown.join('\n'));
            // change as per cookie value
            fs.readFile(cookieFile, function(err, result) {
                if (err) {
                    result = (fileList.length > 1) ? fileList[1] : 0;
                    fs.outputFile(cookieFile, fileList.length > 1);
                }
                // $debugApps.refresh();
                appSelection = '' + result;
                $('#debugApps').val(appSelection);
                $debugApps.refresh();
            });
            newDebugAppDropdownHtml = ['<option value="0">Choose debug app</option>'];
            versionHandler = function(error, result) {
                appPath = fileList[fl.length];
                appName = appPath && appPath.match(/[^\/\\]+$/);
                if (result && appName) {
                    appVersion = result.match(/[\d\.]+/);
                    newList.push(appName + ' (' + (appVersion || 'unknown version') + ')');
                    newDebugAppDropdownHtml.push(
                        '<option value="VALUE">APP</option>'
                        .replace(/APP/, appName + ' (' + (appVersion || 'unknown version') + ')')
                        .replace(/VALUE/, appPath)
                    );
                }
                if (fl.length) {
                    // TODO should first check if the files exists otherwise things could get too slow.
                    exec('powershell "(Get-Item \'' + fl.pop() + '\').VersionInfo"', versionHandler);
                } else {
                    // alert(newList);
                    try {
                        $('#evalResult').val(newDebugAppDropdownHtml.join('\n') + '\n' + newList.join('\n') + '\n');

                        $('#debugApps').html(newDebugAppDropdownHtml.join('\n'));
                        $('#debugApps').val(appSelection);
                        $debugApps.refresh();
                    } catch (err) {
                        alert(err);
                    }
                }


            };
            // exec('powershell "(Get-Item \'' + fl.pop() + '\').VersionInfo"', versionHandler);
            versionHandler();
        };

        writeToDebugList = function(contents, append) {
            // alert( ' append: '+ append +' contents: ' + contents )
            var contentFiles, appendFiles, n, l, contentMap = {},
                forceWrite,
                newContents;
            if (typeof contents === 'object') {
                contentFiles = contents;
            } else {
                contentFiles = (contents) ? contents.split(/[\n\r]/) : [];
            }
            if (append === false) {
                append = [];
                forceWrite = true;
            }
            if (typeof append === 'string') {
                appendFiles = [append];
            } else if (typeof append === 'undefined') {
                appendFiles = [];
            } else {
                appendFiles = append;
            }
            if (typeof contentFiles === 'string') {
                newContents = contentFiles.split(/[\n\r]/);
            } else if (typeof contentFiles === 'object') {
                newContents = contentFiles.slice();
            } else {
                newContents = [];
            }
            // have to check if append is already in the contents
            // we can do this by creating an object map
            l = contentFiles.length;
            for (n = 0; n < l; n++) {
                contentMap[contentFiles[n]] = true;
            }
            l = appendFiles.length;
            for (n = 0; n < l; n++) {
                if (!contentMap[appendFiles[n]]) {
                    newContents.push(n);
                }
            }
            try {
                log(newContents);
                log.open();
            } catch (e) { alert(e); }
            if (forceWrite || ('' + contentFiles !== '' + newContents)) {
                try {
                    fs.outputFile(debugAppFile, newContents.join('\n') + '\n', function(err) {
                        // alert(err ? 'Error: ' + err : 'No Error');
                        processFileList(newContents);
                    });
                } catch (e) { alert(e); }
            } else {
                processFileList(newContents);
            }

        };

        proccessDebugList = function(contents) {
            fs.readFile(debugAppFile, function(err, debugListContents) {
                if (err) {
                    writeToDebugList('' + defaultDebugAppFileContents, false);
                } else {
                    // return;
                    // if (debugListContents === contents) { return; }
                    writeToDebugList('' + debugListContents, contents);
                }
            });
        };

        fs.access(appToAdd || defaultChromePath, 0, function(err) {
            defaultDebugAppFileContents = (!err) ? appToAdd || defaultChromePath : '';
            proccessDebugList(defaultDebugAppFileContents);
        });
    } catch (e) { alert(e); }
};