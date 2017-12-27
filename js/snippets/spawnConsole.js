// jshint esversion:6, node: true

    var shell = function(command, powershell) {
       'use strict';
var bashCwd;
        let isMac = process.platform[0] === 'd'; // [d]arwin

        const spawn = require('child_process').spawn;
        var cmd;
        if (isMac) {
            cmd = spawn('cmd /c ', [command + ' & $PWD'], { shell: true, maxBuffer: 52428800, cwd: bashCwd });
        } else {
            if (powershell){
            cmd = spawn('powershell', [command + '; Write-Host $PWD'], { shell: true, maxBuffer: 52428800, cwd: bashCwd });

            } else {
            cmd = spawn('cmd /c ' + command + ' & cd', { shell: true, maxBuffer: 52428800, cwd: bashCwd });
            }
        }
        let result = '';
        let error = '';
        let cwd = '';
        let d = new Date();
        cmd.stdout.on('data', function(data) {
            result += data;
        });
        cmd.stderr.on('data', function(data) {
            error += data;
            __log(`stderr: ${data}`);
        });
        __log('command: ' + command);
        cmd.on('close', function() {
            cwd = /[^\r\n]+?[\r\n]+$/.exec(result);
            bashCwd = '' + cwd;

            result = result.substr(0, cwd.index - 1).replace(/[\n\r]+$/,'');
            result = result.split(/[\n\r]+/);
            __log('result: ' + result);
            if (error !== '') {
                __log('Error: ' + error);
            }
            __log('cwd: ' + cwd);
            __log('took: ' + ((new Date() - d) / 1000) + ' seconds');
        });
    };


shell('dgfhjsdfgj & cd "C:\\Users\\Trevor\\Documents\\"');
// shell('dgfhjsdfgj & cd "C:\Users\Trevor\Documents\"');