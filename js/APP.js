/* globals process, window */
var APP;

(function() {
    var PIDD = function() {};
    var exec, shellScript, isMac;
    exec = require('child_process').execSync;
    // alert(shellScript);

    isMac = process.platform === 'darwin';
    if (isMac) {
        // on Mac the extensions PID is CEPHtmlEngine Helper
        // it's PPID is CEPHtmlEngine
        // whose PPID is the host app
        shellScript = 'ps -o ppid= __pid__';
        PIDD.prototype.pid = ('' + exec(shellScript.replace(/__pid__/, exec(shellScript.replace(/__pid__/, process.pid))))).replace(/\n/, '');
        PIDD.prototype.restart = function() {
            var appPath, shellScript;
            appPath = decodeURI(window.__adobe_cep__.getSystemPath('hostApplication'));
            appPath = appPath.replace(/file:\/\//, '').replace(/Contents\/MacOS\/.+/, '');
            shellScript = 'kill -9 __pid__; sleep 1; open -n "__appPath__"'.replace(/__pid__/, PIDD.prototype.pid).replace(/__appPath__/, appPath);
            exec(shellScript);
            return;
        };
    } else { // is Windows
        // on windows the extensions PID is CEPHtmlEngine.exe
        // the extensions PPID is the host app (there is no CEPHtmlEngine.exe helper)
        shellScript = 'wmic process where (processid=__pid__) get parentprocessid';
        PIDD.prototype.pid = ('' + exec(shellScript.replace(/__pid__/, process.pid))).replace(/\D/g, '');
        PIDD.prototype.restart = function() {
            // The restart function on Windows get about 3/10 :-/
            var appPath, shellScript;
            appPath = decodeURI(window.__adobe_cep__.getSystemPath('hostApplication'));
            appPath = appPath.replace(/file:\/\/\//, '').replace(/Contents\/MacOS\/.+/, '');
            shellScript = 'Taskkill /PID __pid__ /F | "__appPath__"'.replace(/__pid__/, PIDD.prototype.pid).replace(/__appPath__/, appPath);
            exec(shellScript);
            return;
        };
    }

    APP = new PIDD();
    return PIDD.prototype.pid;
})();