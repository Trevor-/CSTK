/* global jsx, window, process, LogFactory,CSInterface, require, $, setTimeout, SystemPath, alert, document */
/* jshint undef:true, unused:true, evil: true, esversion:6 */


//////////////////////////////////
// setup script loader function //
//////////////////////////////////

// Set these as global to help out for console and external scripts
// Would be good to have them also as locals
var run, Jfy, log, exec, isMac, __dirname, path, os, csInterface, fs;
var __log, __result;

////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var evalMode, dummy;
    log = new LogFactory('CSTK.log');
    csInterface = new CSInterface();
    exec = require('child_process').exec;
    isMac = process.platform[0] === 'd'; // [d]arwin
    __dirname = csInterface.getSystemPath(SystemPath.EXTENSION);
    path = require('path');
    os = require('os');
    fs = require('fs-extra');

    $("#zoomOut").click(function() {
        var newFontSize;
        newFontSize = $('.result').css('font-size').replace(/[\.\d]+/, function(n) {
            return +n - 1;
        });
        $('.result').css('font-size', newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });

    $("#zoomIn").click(function() {
        var newFontSize;
        newFontSize = $('.result').css('font-size').replace(/[\.\d]+/, function(n) {
            return +n + 1;
        });
        $('.result').css('font-size', newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });

    dummy = function(err) {
        //  function might be needed at some point to stop asynchronous node functions throwing errors
        // because no callback has been provided
        // this would be more according to the letter than the spirit of the law ;-{
        if (err) {
            log(err.stack, 'e');
        }
    };

    ///////////////////
    // On Enter Mode //
    ///////////////////

    evalMode = 0; // default value

    $('#jsModeRB').click(function() {
        $('#evalCode').css({ borderColor: 'blue' });
        evalMode = 0;
    });

    $('#jsxModeRB').click(function() {
        $('#evalCode').css({ borderColor: 'green' });
        evalMode = 1;
    });

    $('#execModeRB').click(function() {
        $('#evalCode').css({ borderColor: 'red' });
        evalMode = 2;
    });


    var evalOnEnter = function(key) {
        var codeContents, result, evalCallBack, pos, beforeString, afterString, startOfLines, endOfLines, evalLines, startIndex, endIndex,
            beforeReg, afterReg;

        beforeReg = /[^\n\r]*$/;
        afterReg = /[^\n\r]*/g;
        beforeReg.lastIndex = 0;
        afterReg.lastIndex = 0;

        evalCallBack = function(result, execResult) {
            // In exec mode the "result" parameter is the error value and the "execResult" is the real result
            // If there's an error we ant to show that and if there's not then we want to show the real result
            if (execResult === undefined) { execResult = result; }
            result = result || execResult;
            var contents, modes;
            modes = ['JS', 'JSX', 'SHELL'];
            contents = $("#evalResult").val();
            result = $("#evalResult").val() +
                evalLines.replace(/^\s+/, '') +
                '\n---------------------------\n' +
                ('' + new Date()).substr(16, 8) +
                ' @ ==> '.replace('@', modes[evalMode]) +
                (/.[\n\r]/.test(result) ? '\n' : '') + // for multiline results we'll start on a new line
                result +
                '\n---------------------------\n';
            // we should be able to use ("#evalResult").append() but it wasn't working properly
            $("#evalResult").val(result);
            $("#evalResult").animate({
                scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
            }, 100);
            $('#evalCode').val(codeContents);
            $('#evalCode').selection('setPos', pos);
        };

        if (key.shiftKey && key.keyCode == 13) {
            codeContents = $('#evalCode').val();
            pos = ($('#evalCode').selection('getPos'));
            beforeString = codeContents.substring(0, pos.start + 1);
            afterString = codeContents.substring(pos.end);
            while (/[\r\n]$/.test(beforeString)) {
                beforeString = beforeString.replace(/[\r\n]$/, ' ');
            }
            startOfLines = beforeReg.exec(beforeString);
            startIndex = startOfLines && startOfLines.index || 0;
            endOfLines = afterReg.exec(afterString);
            endIndex = pos.end + afterReg.lastIndex;
            evalLines = codeContents.substring(startIndex, endIndex);
            try {
                if (evalMode === 0) {
                    ///////////////////////////////////////////////////////////////////////////////////
                    // if there were 2 lines                                                         //
                    // alert(1);                                                                     //
                    // alert(2);                                                                     //
                    // and the Shift+ Enter was pressed with the cursor at the end if the first line //
                    // then the line alert(1) would be executed correctly                            //
                    // but the evalCode box would look like                                          //
                    // alert(1);                                                                     //
                    //                                                                               //
                    // alert(2);                                                                     //
                    // with a new line inserted between the 2 alerts                                 //
                    // The setTimeout fixes that allowing the jquery to do it's job                  //
                    // Took be a bit of luck and time to figure this one out!                        //
                    ///////////////////////////////////////////////////////////////////////////////////
                    result = eval(evalLines);
                    setTimeout(function() { evalCallBack(result); }, 0);

                } else if (evalMode === 1) {
                    result = jsx.eval(evalLines, evalCallBack, true);
                } else if (evalMode === 2) {
                    result = exec(evalLines, { cwd: __dirname }, evalCallBack);
                }
            } catch (err) {
                setTimeout(function() { evalCallBack(err); }, evalMode);

            }
        } else {}
    };

    $('#evalCode').keypress(function(key) {
        evalOnEnter(key, 1);
    });



    /////////////
    // JS Eval //
    /////////////

    $("#eval").click(function() {
        var result;
        $('#jsModeRB').click();
        try {
            result = eval($("#evalCode").val());
        } catch (err) {
            result = err;
        }
        result = $("#evalResult").val() +
            $("#evalCode").val() +
            '\n---------------------------\n' +
            ('' + new Date()).substr(16, 8) +
            ' JS ==> ' +
            (/.[\n\r]/.test('' + result) ? '\n' : '') +
            result +
            '\n---------------------------\n';
        // we should be able to use ("#evalResult").append() but it wasn't working properly
        $("#evalResult").val(result);
        $("#evalResult").animate({
            scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
        }, 200);
    });

    //////////////
    // JSX Eval //
    //////////////

    $("#evaljsx").click(function() {
        $('#jsxModeRB').click();
        var evalCallBack = function(result) {
            result = $("#evalResult").val() +
                $("#evalCode").val() +
                '\n---------------------------\n' +
                ('' + new Date()).substr(16, 8) +
                ' JSX ==> ' +
                (/.[\n\r]/.test(result) ? '\n' : '') +
                result +
                '\n---------------------------\n';
            // we should be able to use ("#evalResult").append() but it wasn't working properly
            $("#evalResult").val(result);
            $("#evalResult").animate({
                scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
            }, 200);
        };
        try {
            jsx.eval($("#evalCode").val(), evalCallBack, true);
        } catch (err) {
            evalCallBack(err);
        }
    });


    ///////////////
    // EXEC Eval //
    ///////////////


    $("#evalExec").click(function() {
        var result;
        $('#execModeRB').click();
        var evalCallBack = function(error, stdout) {
            var result;
            result = error || stdout;
            result = $("#evalResult").val +
                $("#evalCode").val() +
                '\n---------------------------\n' +
                ('' + new Date()).substr(16, 8) +
                ' EXEC ==> ' +
                (/.[\n\r]/.test(result) ? '\n' : '') +
                result +
                '\n---------------------------\n';
            // we should be able to use ("#evalResult").append() but it wasn't working properly
            $("#evalResult").val(result);
            $("#evalResult").animate({
                scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
            }, 200);
        };
        try {
            result = exec($("#evalCode").val(), { cwd: __dirname }, evalCallBack);
        } catch (err) {
            evalCallBack(err);
        }
    });

    ////////////////////////////////////////////////////////
    // Setup some helper functions for use in the console //
    ////////////////////////////////////////////////////////
    Jfy = JSON.stringify;


    __log = function(message) {
        if (message === undefined) { return; }
        $("#evalResult").val($("#evalResult").val() + message + '\n');
        $("#evalResult").animate({
            scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
        }, 10);
    };
    __result = function(error, result) {
        $("#evalResult").val($("#evalResult").val() + 'Error: ' + error + '\nResult: ' + result + '\n');
        $("#evalResult").animate({
            scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
        }, 10);
    };

    //////////////////////////////////////////////////////////////////////////
    // for executing scripts from the console and loading scripts on demand //
    // default path will be the js folder in the extensions folder          //
    // If the url starts with file then absolute url will be used           //
    // run('snippets/debugAppsList.js', 'f()');                             //
    //////////////////////////////////////////////////////////////////////////

    run = function(url, success, error) {
        var s, e;
        // need to check for mac and windows
        if (!(/^file:/.test(url))) {
            url = 'file:///' + path.join(__dirname, 'js', url);
        }

        $.ajax({
            url: url,
            dataType: "script",
            // success: success,
            success: function(suc) {
                if (success) {
                    s = (typeof success === 'function') ?
                        success() :
                        eval(success);
                } else {
                    s = suc;
                }
            },
            error: function(err) {
                if (error) {
                    // e = (typeof error === 'function') ?
                    //     error() :
                    //     eval(error); // this looks rubbish! and 99.99% is!
                } else {
                    e = err;
                }
            }
        }).done(function() {
            // This will allow for console feedback
            // if (success === false || error === false) { return; }
            // not doing this now
            // if (s || e) {
            //     $("#evalResult").val(
            //         $("#evalResult").val() +
            //         (s || e) + '\n'
            //     );
            // }
        });

    };

    //////////////////////////
    // File in version info //
    //////////////////////////

    var versions = process.versions;
    $('#versions').html(
        'CSTK: 2' +
        ' - node: ' + versions.node +
        // OK I could have used csInterface.getCurrentApiVersion().major etc. but this was more simple ;-/
        ' - cep: ' + (versions.cep || window.__adobe_cep__.getCurrentApiVersion().replace(/[^\d\.]+([\d\.])+[^\d\.]+([\d\.])+[^\d\.]+([\d\.])+.+/, "$3.$2.$1").replace(/\.0$/, '')) +
        (versions.chromium ? ' - chromium: ' + versions.chromium : '') +
        ' - v8: ' + versions.v8 +
        (versions.unicode ? ' - unicode: ' + versions.unicode : '')
    );
    /*= {
           "http_parser": "2.7.0",
           "node": "7.7.4",
           "v8": "5.7.492.65",
           "uv": "1.11.0",
           "zlib": "1.2.11",
           "ares": "1.10.1-DEV",
           "modules": "51",
           "openssl": "1.0.2k",
           "icu": "58.1",
           "unicode": "9.0",
           "cep": "8.0",
           "chromium": "57.0.2987.74"
       }*/






    //////////////////
    // Open Folders //
    //////////////////

    (function() {
        var extensions, n, l, template, html, setUpButtons;
        extensions = eval(window.__adobe_cep__.getExtensions());
        l = extensions.length;
        template = [
            '<div id="div__n__">',
            '<span id="base__n__" class="csButton blueButton">__name__ - Open Folder</span>',
            '</div>',
        ].join('\n');
        html = [];
        for (n = 0; n < l; n++) {
            html.push(template
                .replace(/__name__/g, extensions[n].name)
                .replace(/__n__/g, '' + n)
            );
        }


        setUpButtons = function(n) {
            var id = function(key) {
                return '#' + key + n;
            };
            $(id('base')).click(function() {
                exec((isMac ? 'open "' : 'start "" "') + extensions[n].basePath + '"');
            });

        };
        for (n = 0; n < l; n++) {
            setUpButtons(n);
        }
    })();

    $("#folders").hide();
    $("#SetWarning").hide();

    $("#openFolders").mousedown(function() {
        if ($('#folders').is(":visible")) {
            $('#folders').attr({
                height: '0px'
            });
            $('#folders').hide();
            $("#openFolders").text('Show Extensions Tools');
            // $("#openFolders").removeClass("blueButton");
            $('#console').show();
        } else {
            $('#console').hide();
            $('#folders').attr({
                height: 'auto'
            });
            $('#folderBody').text('Please wait a few (upto 10) seconds for the apps to be processed');
            // run(isMac ? 'debug_tools_mac.js' : 'debug_tools_windows.js');
            getCeps();
            $("#openFolders").text('Show Console');
            $('#folders').show();
        }
    });

    var appMap = {
        "PHSP": "Adobe Photoshop", // OLD non extended version
        "PHXS": "Adobe Photoshop",
        "IDSN": "Adobe InDesign",
        "AICY": "Adobe InCopy",
        "ILST": "Adobe Illustrator",
        "PPRO": "Adobe Premiere Pro",
        "PRLD": "Adobe Prelude",
        "AEFT": "Adobe After Effects",
        "FLPR": "Adobe Animate",
        "AUDT": "Adobe Audition",
        "DRWV": "Adobe Dreamweaver",
        "MUSE": "Adobe Muse",
        "KBRG": "Adobe Bridge",
        "undefined": "Unknown App"
    };
    var app = csInterface.getHostEnvironment();
    var appId = app.appId;
    var appVersion = app.appVersion;
    var appName = '' + csInterface.getSystemPath('hostApplication').match(/Adobe[^\/\\]+/);


    $('#hostAppInfo').html(
        '<img src="../img/Forum_Icons/APPID.png" style="height: 25px; top: 8px; position: relative;" id="" />'
        .replace(/APPID/, appMap[appId] ? appId : 'CLOD') +
        '<span style="font-size: .7em"> ' + appName.replace('Adobe', '') + ' (' + appVersion + ')</span>'
    );


    var setUI = function(error, result, warning) {
        'use strict';
        let m;
        // The error on the Mac kill cfprefsd command does not seem to effect the reset
        // i.e. it looks like cfprefsd is reset even if it says it's not
        // this is because the call is made 2 times consequently so by the second call it's already dead
        // Seeing as the second kill should not be needed we can ignore errors for now
        if (isMac) error = false;
        m = warning || error || result + (isMac ? '' : '<br>') + 'The apps need to be restarted to reflect the changes';
        $('#SetWarning').html(m);
        $('#SetWarning').show();
        $('#SetWarning').fadeOut(warning ? 2000 : 3000);
        // of now this will never happen!
        if (isMac && error) {
            $('#sudo').show();
        }
    };

    ///////////////////////////////////////////
    // Set and Get LogLevel and Debug Values //
    ///////////////////////////////////////////

    var appSelection;
    $(document).ready(function() {
        {
            $('#SetWarning').hide();
            var $log, $cep, $debug, $debugA, getValue, processValue, setValue, cep;

            $debugA = $("#debugApps");
            $log = $("#logLevel");
            $debug = $("#debugLevel");
            $cep = $("#cepVersion");

            $debugA.selectmenu({
                change: function(event, ui) {
                    appSelection = ui && ui.item && ui.item.value;
                    fs.outputFile(cookieFile, appSelection, function(err, result) {
                        log('outputFile cookieFile: ' + (err || result));
                    });
                    if (appSelection) {
                        // the tooltip had problems :-/
                        // $('#debugApps-button')
                        //     .attr('title',
                        //      $("#debugApps option[value='_VALUE_']".replace(/_VALUE_/, appSelection)).attr('title')
                        //     );
                        setUI(false, false, 'The default debug app has been set to <br>' + appSelection);
                    } else {
                        appSelection = '';
                    }
                },
                position: { collision: "flip" }
            });


            $log.selectmenu({
                change: function(event, ui) {
                    var cep = '' + $("#cepVersion").val();
                    getValue('LogLevel', cep);
                    getValue('PlayerDebugMode', cep);
                    setUI(false, false, 'REMEMBER to click SET to apply the changes');
                }
            });
            $("#logLevel, #debugLevel").selectmenu({
                change: function(event, ui) {
                    setUI(false, false, 'REMEMBER to click SET to apply the changes');
                }
            });

            processValue = function(key, value) {
                if (!isMac) value = value.replace(/\s/g, '').match(/\d+$/);
                if (key === 'LogLevel') {
                    $("#logLevel").val('' + (value ? +value : 7));
                    // $log.selectmenu('refresh');
                    $log.selectmenu('refresh');
                } else if (key === 'PlayerDebugMode') {
                    $("#debugLevel").val('' + (value ? +value : 2));
                    $log.selectmenu('refresh');
                    // $log.selectmenu('refresh');
                }
            };


            setValue = function(key, value, cep) {
                var command;
                command = isMac ? 'defaults write com.adobe.CSXS._CEP_.plist _KEY_ _VALUE_ && killall -u `whoami` cfprefsd' :
                    'reg add HKEY_CURRENT_USER\\SOFTWARE\\Adobe\\CSXS._CEP_ /t REG_SZ /v _KEY_ /d _VALUE_ /f';
                command = command.replace(/_CEP_/, '' + cep).replace(/_KEY_/, '' + key).replace(/_VALUE_/, '' + value);
                exec(command, function(err, result) {
                    setUI(err, result);
                });
            };


            getValue = function(key, cep) {
                var command;
                command = isMac ? 'defaults read com.adobe.CSXS._CEP_.plist _KEY_' :
                    'reg query HKEY_CURRENT_USER\\SOFTWARE\\Adobe\\CSXS._CEP_ /v _KEY_';
                command = command.replace(/_CEP_/, '' + cep).replace(/_KEY_/, '' + key);
                exec(command, function(err, result) {
                    if (err) {
                        log('getValue error: ' + err, 'e', 'ping');
                    }
                    processValue(key, result);
                });
            };

            cep = csInterface.getCurrentApiVersion().major;
            $("#cepVersion").val(cep);
            // $cep.selectmenu('refresh');
            $cep.selectmenu('refresh');
            getValue('LogLevel', cep);
            getValue('PlayerDebugMode', cep);
            $('#Set').click(function() {
                var logValue, cepValue, debugValue;
                logValue = $('#logLevel').val();
                cepValue = $('#cepVersion').val();
                debugValue = $('#debugLevel').val();
                if (logValue !== '7') {
                    setValue('LogLevel', logValue, cepValue);
                }
                if (debugValue !== '2') {
                    setValue('PlayerDebugMode', debugValue, cepValue);
                }
            });

            $('#sudoEnter').click(function() {
                var command, password;
                password = $('#sudoText').val();
                if (!password) {
                    return;
                }
                command = 'echo _PASSWORD_ | sudo -S killall cfprefsd'.replace(/_PASSWORD_/, password);
                $('#sudoText').val('');

                exec(command);
                $('#sudo').hide();
            });
            $('#sudoClose').click(function() {
                $('#sudo').hide();
            });
            $('#sudo').hide();


        }
    });

    //////////////////////////////////////
    // Setup The debug application list //
    //////////////////////////////////////

    var cstkFolder, debugAppFile, cookieFile, openFolderAppFile;
    cstkFolder = path.join(csInterface.getSystemPath('userData'), 'Creative Scripts', 'CSTK');
    debugAppFile = path.join(cstkFolder, 'debugAppsList.txt');
    cookieFile = path.join(cstkFolder, 'debugAppSelection.txt');
    openFolderAppFile = path.join(cstkFolder, 'OpenFolderApp.txt');

    /////////////////////////////////////////////////////////////////////////////////////
    // Use Windows Search or Spotlight to search for instances of Chrome and cefclient //
    /////////////////////////////////////////////////////////////////////////////////////

    var windowsSearchCallBack, macSearchCallBack, windowsAddFileInfo, macAddFileInfo, d, addThisIfNotInArray, removeThisIfInArray, removeDropdownOption, addDropdownOption, selectDebugFile;
    d = new Date();
    addThisIfNotInArray = function(value, array) {
        if (array.indexOf(value) === -1) { array.push(value); }
    };
    removeThisIfInArray = function(value, array) {
        var i;
        i = array.indexOf(value);
        if (i !== -1) { array.splice(i, 1); }
    };
    /////////////
    // Windows //
    /////////////
    windowsSearchCallBack = function(err, result) {
        try {
            var apps, psGetItems, getItems, n, l, manDebugApps;
            apps = result.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
                .replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/ *[\n\r]+/);
            // Add some potential locations for Chrome as Windows search might only index the start folder
            // If they don't exists they will just be filtered out later by the Get-Item command.
            addThisIfNotInArray('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', apps);
            addThisIfNotInArray('D:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', apps);
            // At some point Chrome will change?
            addThisIfNotInArray('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', apps);
            addThisIfNotInArray('D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', apps);

            //////////////////////////////////////
            // add / remove manually added apps //
            //////////////////////////////////////
            try {
                manDebugApps = fs.readFileSync(debugAppFile) + '';
                manDebugApps = manDebugApps.replace(/^[\n\r]+/, '')
                    .replace(/[\n\r]+$/, '')
                    .split(/[\n\r]+/);
                l = manDebugApps.length;
                // if the file is designated to be removed by having a :- appended to the path
                // then remove from the app list else if it's not been picked up by spotlight then add it
                for (n = 0; n < l; n++) {
                    app = manDebugApps[n];
                    if (/:-$/.test(app)) {
                        app = app.replace(/:-$/, '');
                        removeThisIfInArray(app, apps);
                    } else {
                        addThisIfNotInArray(app, apps);
                    }
                }
            } catch (err) {
                // __log(err.stack);
                //  alert(err.stack);
                // no debugAppFile
            }
            apps.sort();
            l = apps.length;
            getItems = function(paths, field) {
                var getTemplate, filePaths;
                getTemplate = "(Get-Item __PATHS__)__FIELD__;";
                filePaths = "'" + paths.join("','").replace(/\\/, '\\\\') + "'";
                return getTemplate.replace(/__PATHS__/, filePaths)
                    .replace(/__FIELD__/, field ? '.' + field : '');
            };
            psGetItems = 'powershell "';
            psGetItems += getItems(apps, 'FullName');
            psGetItems += getItems(apps, 'VersionInfo');
            psGetItems += getItems(apps, 'CreationTime.Year');
            psGetItems += getItems(apps, 'CreationTime.Month');
            psGetItems += getItems(apps, 'CreationTime.Day');
            psGetItems += '"';
            // __log(apps);
            exec(psGetItems, windowsAddFileInfo);
        } catch (err) {
            __log(err.stack);
            alert(err.stack);
        }
    };
    windowsAddFileInfo = function(err, result) {
        try {
            var paths, info, n, l, html, app, version, date, name;
            result = result.split(/----+ +-----+ +-----+ *[\n\r]*/);
            paths = result[0] || '';
            // __log('paths: ' + paths);
            info = result[1] || '';
            // __log('info: ' + info);
            paths = paths.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
                .replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/ *[\n\r]+/);
            info = info.split(/ *[\n\r]+/);
            l = paths.length;
            html = [];
            for (n = 0; n < l; n++) {
                app = paths[n];
                // name = '' + app.match(/[^\\\/]+$/);
                name = app.match(/Chrome|CefClient/i);
                version = '' + (info[n].match(/^\S+/) || 'Unknown Version');
                date = new Date(info[l + n], info[l * 2 + n], info[l * 3 + n])
                    .toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                html.push(`<option value="${app}" title="${app + '&nbsp; Last&nbsp;modified:&nbsp;' + date}">${name + ' (' + version})</option>`);

            }
            $("#debugApps").html(html.join('\n'));
            $("#debugApps").selectmenu('refresh');

        } catch (e) {
            // __log(e.stack);
            // alert(e.stack);
        }
    };

    /////////
    // Mac //
    /////////

    macSearchCallBack = function(error, result) {
        var debugApps;
        debugApps = result && result
            .replace(/^[\n\r]+/, '')
            .replace(/[\n\r]+$/, '')
            .split(/[\n\r]+/);
        macAddFileInfo(debugApps);
        // addDropdownOption(debugApps, false);
    }; // end of macSearchCallBack

    macAddFileInfo = function(debugApps) {
        var apps, n, l, app, i, appMap, addInfo;
        try {
            apps = fs.readFileSync(debugAppFile) + '';
            apps = apps.replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/[\n\r]+/);
            l = apps.length;
            // if the file is designated to be removed by having a :- appended to the path
            // then remove from the app list else if it's not been picked up by spotlight then add it
            for (n = 0; n < l; n++) {
                app = apps[n];
                if (/:-$/.test(app)) {
                    app = app.replace(/:-$/, '');
                    i = debugApps.indexOf(app);
                    if (i > -1) {
                        debugApps.splice(i, 1);
                    }
                } else {
                    if (debugApps.indexOf(app) === -1) {
                        debugApps.push(app);
                    }
                }
            }
        } catch (err) {
            log(err.stack);
            // no debugAppFile
        }
        appMap = [];
        var dApps = [];
        addInfo = function(error, result) {
            var app, l, version, contentUpdate, name;
            l = debugApps.length;
            app = debugApps[l - 1];
            if (error) {
                // remove the app from the list
                debugApps.pop();
                return addInfo();
            } else if (result) {
                name = result.match(/Chrome|CefClient/i);
                version = result.match(/kMDItemVersion += "([^"]+)/);
                version = version && version[1];

                contentUpdate = result.match(/kMDItemFSContentChangeDate += (\S+)/);
                contentUpdate = contentUpdate && '' + new Date(contentUpdate[1]).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                if (!name) {
                    debugApps.pop();
                    return addInfo();
                }
                appMap.push(`<option value="${app}" title="${app + '&nbsp; Last&nbsp;modified:&nbsp;' + contentUpdate}">${name + ' (' + version})</option>`);
                dApps.push(debugApps.pop());
            }
            l = debugApps.length;
            app = debugApps[l - 1];
            if (l) {
                try {
                    var cmd;
                    cmd = 'mdls "app"'.replace(/app/, '' + app);
                    return exec(cmd, addInfo);
                } catch (e) {
                    log(e.stack, 'e');
                }
            }
            // no more results time to update the dropdown
            // The order picked up by spotlight is as far as we are concerned somewhat random
            // It would be nicer if the order was consistent hence the sort according to the file path
            appMap.sort();
            $("#debugApps").html(appMap.join('\n'));
            // get selection from cookie
            fs.readFile(cookieFile, function(err, result) {
                if (result) {
                    appSelection = '' + result;
                    if (dApps.indexOf(appSelection) > -1) {
                        // fs.outputFile(cookieFile, appSelection);
                        $('#debugApps').val(appSelection);
                        // $debugApps.selectmenu('refresh');
                    } else {
                        appSelection = $("#debugApps").val();
                    }
                } else {
                    appSelection = $("#debugApps").val();
                }
                // try {
                // $('#debugApps-button').attr('title',
                //     $("#debugApps option[value='_VALUE_']".replace(/_VALUE_/, '' + appSelection)).attr('title')
                // );
                // } catch (e) {}
                $("#debugApps").selectmenu('refresh');
            });
        }; // end of addInfo
        addInfo();
    }; // end of macAddFileInfo

    /////////////////////
    // Windows and Mac //
    /////////////////////

    addDropdownOption = function(value) {
        // TODO change function
        // if value not in html using jquery
        // then check the values version info
        // split the html into an array
        // add the new entry if the info is good
        // sort array and update the html and bebugApps file
        // select the value and update the cookie file

        var optionsHtml, appsArray, cmd, addPathAndVersion, name, version, contentUpdate;
        optionsHtml = $('#debugApps').html();
        // if the values already there then we can go home
        if (optionsHtml.indexOf(`"${value}"`) > -1) {
            return;
        }
        appsArray = optionsHtml.replace(/^[\s\n\r]+/).replace(/[\s\n\r]+$/).split(/[\n\r]/);
        addPathAndVersion = function(error, result) {
            if (result) {
                name = result.match(/Chrome|CefClient/i);
                if (isMac) {
                    version = result.match(/kMDItemVersion += "([^"]+)/);
                    version = version && version[1];
                    contentUpdate = result.match(/kMDItemFSContentChangeDate += (\S+)/);
                    contentUpdate = contentUpdate && '' + new Date(contentUpdate[1]).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                } else {
                    result = result.split(/----+ +-----+ +-----+ *[\n\r]*/);
                    result = result[1] || '';
                    result = result.split(/ *[\n\r]+/);
                    version = '' + (result[0].match(/^\S+/) || 'Unknown Version');
                    contentUpdate = new Date(result[1], result[2], result[3])
                        .toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

                }
                appsArray.push(`<option value="${value.replace(/\\/g,'\\\\')}" title="${value + '&nbsp; Last&nbsp;modified:&nbsp;' + contentUpdate}">${name + ' (' + version})</option>`);
                appsArray.sort();
                $('#debugApps').html(appsArray.join('\n'));
                $('#debugApps').val(value);
                appSelection = value;
                $('#debugApps').selectmenu('refresh');
                fs.outputFile(cookieFile, value);
                // add the file to the debug File list
                // we need to check the debug file before we write to it to see if the new entry is not there as non include file
                // if it's there as a non include file then we want to remove the :- sign otherwise we want to append the file to the list
                // if the file doesn't exist then we need to create it.
                fs.readFile(debugAppFile, function(err, result) {
                    if (err) {
                        // Probably no file so we just need to write to the file
                        result = value;
                    } else {
                        result += '';
                        result = result.replace(value + ':-', '') + '\n' + value;
                        result = result.replace(/[\n\r]{2,}/g, '\n').replace(/^[\n\r]+/, '').replace(/[\n\r]+$/, '');
                    }
                    fs.outputFile(debugAppFile, result, dummy);
                });
            }
        };

        var getItems;
        if (isMac) {
            cmd = 'mdls "app"'.replace(/app/, '' + value);
        } else {
            getItems = function(path, field) {
                var getTemplate, filePath;
                getTemplate = "(Get-Item __PATH__)__FIELD__;";
                filePath = "'" + path.replace(/\\/, '\\\\') + "'";
                return getTemplate.replace(/__PATH__/, filePath)
                    .replace(/__FIELD__/, field ? '.' + field : '');
            };
            cmd = 'powershell "';
            cmd += getItems(app, 'VersionInfo');
            cmd += getItems(app, 'CreationTime.Year');
            cmd += getItems(app, 'CreationTime.Month');
            cmd += getItems(app, 'CreationTime.Day');
            cmd += '"';
        }
        return exec(cmd, addPathAndVersion);
    }; // end of addDropdownOption
    removeDropdownOption = function() {
        var value, selection;
        value = $('#debugApps').val();
        if (value === '' || !value) { return; }
        selection = $(`#debugApps option[value='${value.replace(/\\/g,'\\\\')}']`);
        if (!selection) { return; }
        selection.remove();
        $('#debugApps').selectmenu('refresh');
        fs.readFile(debugAppFile, function(err, result) {
            if (err) {

                // Probably no file so we just need to write to the file
                result = value + ':-';
                dummy(err);
            } else {
                result += '';
                result = result.replace(value, '') + '\n' + value + ':-';
                result = result.replace(/[\n\r]{2,}/g, '\n').replace(/^[\n\r]+/, '').replace(/[\n\r]+$/, '');
            }
            fs.outputFile(debugAppFile, result, dummy);
        });
        appSelection = $('#debugApps').val();
        fs.outputFile(cookieFile, appSelection);
    }; // end of removeDropdownOption


    selectDebugFile = function() {
        var debugApp;

        debugApp = window.cep.fs.showOpenDialogEx(false, false, 'Please select a file (chrome or cefclient only!)');
        debugApp = '' + debugApp.data[0];
        if (/chrome|cefclient/i.test(debugApp)) {
            setUI(false, false, 'Please Wait a few moments');
            addDropdownOption(debugApp);
            return debugApp;
        }
        if (debugApp !== '' && debugApp !== 'undefined' && debugApp !== 'null') {
            alert('Sorry at present only Chrome and Cefclient are supported :-<');
        }
        return false;
    }; // end of selectDebugFile

    var addDebugApps;
    addDebugApps = function() {
        var cmd;
        if (isMac) {
            cmd = 'mdfind \'kMDItemCFBundleIdentifier == "com.google.Chrome" || kMDItemCFBundleIdentifier == "org.cef.cefclient"\'';
            exec(cmd, macSearchCallBack);
        } else {
            cmd = `powershell "$connector = new-object system.data.oledb.oledbdataadapter -argument \\"SELECT System.ItemPathDisplay FROM SYSTEMINDEX WHERE CONTAINS (System.FileName, '\\"\\"Google Chrome\\"\\" OR Cefclient.exe')\\", \\"provider=search.collatordso;extended properties='application=windows';\\"; $dataset = new-object system.data.dataset; if ($connector.fill($dataset)) { $dataset.tables[0] }"`;
            exec(cmd, windowsSearchCallBack);
        }
    };


    $("#debugAddBT").click(selectDebugFile);
    $("#debugRemoveBT").click(removeDropdownOption);

    // C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\js\debug.js

    // https://www.petri.com/how-to-query-the-windows-search-index-using-sql-and-powershell
    // $sql = "SELECT System.ItemPathDisplay, System.DateCreated, System.DateModified FROM SYSTEMINDEX WHERE CONTAINS (System.FileName, '""Google Chrome"" OR Cefclient.exe')"
    // $provider = "provider=search.collatordso;extended properties='application=windows';"
    // $connector = new-object system.data.oledb.oledbdataadapter -argument $sql, $provider
    // $dataset = new-object system.data.dataset
    // if ($connector.fill($dataset)) { $dataset.tables[0] }

    var launchDebug, openFolderApp;
    //var cstkFolder, defaultChromePath, cookieFile, debugAppFile, appSelection, openFolderApp, openFolderAppFile;
    // var cstkFolder, defaultChromePath, cookieFile, debugAppFile, appSelection, openFolderApp, openFolderAppFile;

    fs.readFile(openFolderAppFile, function(err, result) {
        if (err) {
            $('#openFolderApp').text(isMac ? "Finder" : "Windows Explorer");
            openFolderApp = false;
        } else {
            openFolderApp = '' + result;
            $('#openFolderApp').text('' + openFolderApp.match(/[^\/\\]+$/));
        }
    });

    $('#openFolderAppBT').click(function() {
        var newApp;
        newApp = window.cep.fs.showOpenDialogEx(false, false, 'Please select an application for opening the folders on Shift Click');
        newApp = '' + newApp.data[0];
        if (newApp === '' || newApp === 'null' || newApp === 'undefined') {
            return;
        }
        openFolderApp = newApp;
        $('#openFolderApp').text(('' + openFolderApp.match(/[^\/\\]+$/)).replace(/\.[^\.]+$/,''));
        fs.outputFile(openFolderAppFile, openFolderApp, dummy);
    });




    /////////////////////
    // Open Log folder //
    /////////////////////

    $("#openLogFolder").click(function() {
        var logFolder, query;
        if (isMac) {
            logFolder = path.join(
                csInterface.getSystemPath(SystemPath.USER_DATA),
                '../Logs/CSXS'
            );
            exec('open "' + logFolder + '"');
        } else { //  windows
            logFolder = path.join(
                csInterface.getSystemPath(SystemPath.USER_DATA),
                '../Local/Temp'
            );
            // For Windows as there's no dedicated log folder it's best to add a filter
            query = 'explorer.exe "search-ms:query=cep*.log&crumb=location:' + logFolder + '&"';
            exec(query);
        }
    });

    $("#CreativeScripts").click(function() {
        exec('X http://www.creative-scripts.com '.replace(/X/, isMac ? 'open' : 'start'));
    });

    ///////////////////////
    // Open Chrome Debug //
    ///////////////////////

    // exec('mdfind kMDItemCFBundleIdentifier == "com.google.Chrome"', function(e,r){alert(r)})

    (function() {
        // check if chrome present will add cefClient later
        //exec('mdfind \'kMDItemCFBundleIdentifier == "com.google.Chrome" || kMDItemCFBundleIdentifier == "org.cef.cefclient"\'', function(e, r) { alert(r); });
        /***********************************************************************************
         * Volumes/Macintosh HD/Applications/Google Chrome.app                              *
         * Applications/Google Chrome.app                                                   *
         * Users/Trevor/Documents/SDKs/CEP 7/CEP-Resources/CEP_7.x/cefclient.app            *
         * Users/Trevor/Documents/Magic Briefcase/Books/CEP-Resources/CEP_7.x/cefclient.app *
         ***********************************************************************************/

        // Then process each file as follows to give the version
        // plutil -p /Applications/Google\ Chrome.app/Contents/Info.plist | grep CFBundleShortVersionString
        // "CFBundleShortVersionString" => "62.0.3202.62"
        // Can also do
        // mdls /Applications/Google\ Chrome.app | grep kMDItemVersion
        // kMDItemVersion                 = "62.0.3202.62"


        // after the 1st exec one can know how many apps there are
        // one can use loop the mdls exec and on callback check the filled array count
        //
        // on Windows
        // wmic datafile where name='C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' get Version /value
        // Version=61.0.3163.100
        // "C:\Users\Trevor\Documents\Adobe Scripts\SDKs\sigcheck64.exe" -n -q "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
        // 61.0.3163.100
        // would need to package sigcheck64
        // powershell (Get-Item "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe").VersionInfo
        // 61.0.3163.100    61.0.3163.100    C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
        // looks like the best way to go
        // powershell "(Get-Item 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe').VersionInfo"
        //
        //
        // To check out open ports
        // Mac -
        // lsof -PiTCP -sTCP:LISTEN | grep CEPHtmlEn
        // Windows -
        // netstat -aon | findstr 127.0 | findstr 0.0.0.0:0
        //   TCP    127.0.0.1:843          0.0.0.0:0              LISTENING       9952
        //   TCP    127.0.0.1:1556         0.0.0.0:0              LISTENING       3352
        //   TCP    127.0.0.1:1557         0.0.0.0:0              LISTENING       3352
        //   TCP    127.0.0.1:1978         0.0.0.0:0              LISTENING       11952
        //   TCP    127.0.0.1:5354         0.0.0.0:0              LISTENING       3344
        //   TCP    127.0.0.1:5939         0.0.0.0:0              LISTENING       3880
        //   TCP    127.0.0.1:9072         0.0.0.0:0              LISTENING       27864
        //   TCP    127.0.0.1:9990         0.0.0.0:0              LISTENING       3712
        //   TCP    127.0.0.1:15292        0.0.0.0:0              LISTENING       11940
        //   TCP    127.0.0.1:17600        0.0.0.0:0              LISTENING       9952
        //   TCP    127.0.0.1:65000        0.0.0.0:0              LISTENING       3704
        //   TCP    127.0.0.1:65001        0.0.0.0:0              LISTENING       4952
        //   Then need to compare the PIDs to the CEF pids
        //   nope do the other way around
        //   netstat -aon | findstr 27864
        //   TCP    127.0.0.1:9072         0.0.0.0:0              LISTENING       27864
        //   need to then check that the finds are the PIDs and not the ports, that can be done on the js side
        //   To find CEPHtmlEngine.exe
        //   tasklist | findstr CEPHtmlEngine.exe
        /*  CEPHtmlEngine.exe            25756 Console                    1     42,104 K
            CEPHtmlEngine.exe            20284 Console                    1     39,748 K
            CEPHtmlEngine.exe            27864 Console                    1     43,084 K
            CEPHtmlEngine.exe             8536 Console                    1     52,280 K
            CEPHtmlEngine.exe            26932 Console                    1     48,568 K
            CEPHtmlEngine.exe            17044 Console                    1     65,008 K
            CEPHtmlEngine.exe            22888 Console                    1     41,496 K
            CEPHtmlEngine.exe            28028 Console                    1     41,424 K
            CEPHtmlEngine.exe            24320 Console                    1     31,440 K
            CEPHtmlEngine.exe            28100 Console                    1     31,488 K
            CEPHtmlEngine.exe            24940 Console                    1     56,448 K
            CEPHtmlEngine.exe            24672 Console                    1     61,516 K
        */

        /*
        // need to test wmic on Windows Home - tested seems to work :-\
        wmic.exe path Win32_Process where handle='27864'  get CommandLine /format:list
        CommandLine="C:\Program Files\Adobe\Adobe Illustrator CC 2017\Support Files\Contents\Windows\CEPHtmlEngine\CEPHtmlEngine.exe" "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\html\index.html" ebc0f56f-0838-4e23-acc0-1418483c4bdb 24796 ILST 21.0.0 com.creative-scripts.cstk.1 3 "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK" "illustrator" 1 WyItLWVuYWJsZS1ub2RlanMiLCItLW1peGVkLWNvbnRleHQiXQ== en_IL 4293980400 100
        can use
        wmic.exe path Win32_Process where Name='CEPHtmlEngine.exe' get handle, commandline  /format:list
        this will list all processes in the form
        wmic.exe path Win32_Process where handle='27864'  get CommandLine /format:list
        CommandLine="C:\Program Files\Adobe\Adobe Illustrator CC 2017\Support Files\Contents\Windows\CEPHtmlEngine\CEPHtmlEngine.exe" "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\html\index.html" ebc0f56f-0838-4e23-acc0-1418483c4bdb 24796 ILST 21.0.0 com.creative-scripts.cstk.1 3 "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK" "illustrator" 1 WyItLWVuYWJsZS1ub2RlanMiLCItLW1peGVkLWNvbnRleHQiXQ== en_IL 4293980400 100
        Handle=27864
        We then have access to the app running the extension and the extensions id and pid and then can see if it's got a debug port
        Mac -
        ps ax | grep "CEPHtmlEngine.app"
        1042   ??  S      0:44.47 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/MacOS/CEP/CEPHtmlEngine/CEPHtmlEngine.app/Contents/MacOS/CEPHtmlEngine 74f9081c-9da3-4a7b-a6ab-cbeb77c9201b 2f40fe61-5f68-452b-b710-2ae80398cab5 IDSN 13.0 com.adobe.ccx.start 1 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start 64 WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= en_IL 100 -4671304
        1047   ??  S      0:34.99 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/MacOS/CEP/CEPHtmlEngine/CEPHtmlEngine.app/Contents/Frameworks/CEPHtmlEngine Helper.app/Contents/MacOS/CEPHtmlEngine Helper --type=gpu-process --no-sandbox --lang=en --log-file=/Users/Trevor/Library/Logs/CSXS/CEPHtmlEngine8-IDSN-13.0-com.adobe.ccx.start.log --log-severity=error --params_ppid=IDSN --params_ppversion=13.0 --params_extensionid=com.adobe.ccx.start --params_loglevel=1 --params_extensionuuid=74f9081c-9da3-4a7b-a6ab-cbeb77c9201b --params_clientid=2f40fe61-5f68-452b-b710-2ae80398cab5 --node-module-dir=/Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start --params_commandline=WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= --supports-dual-gpus=false --gpu-driver-bug-workarounds=0,1,10,23,25,36,39,47,53,61,63,64,65,66,68,73,74,76,84,85,86,89,92 --disable-gl-extensions=GL_KHR_blend_equation_advanced GL_KHR_blend_equation_advanced_coherent --gpu-vendor-id=0x8086 --gpu-device-id=0x0166 --gpu-driver-vendor --gpu-driver-version --gpu-driver-date --gpu-active-vendor-id=0x8086 --gpu-active-device-id=0x0166 --lang=en --log-file=/Users/Trevor/Library/Logs/CSXS/CEPHtmlEngine8-IDSN-13.0-com.adobe.ccx.start.log --log-severity=error --params_ppid=IDSN --params_ppversion=13.0 --params_extensionid=com.adobe.ccx.start --params_loglevel=1 --params_extensionuuid=74f9081c-9da3-4a7b-a6ab-cbeb77c9201b --params_clientid=2f40fe61-5f68-452b-b710-2ae80398cab5 --node-module-dir=/Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start --params_commandline=WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= --service-request-channel-token=4E49BF968C83CB109A581C3F6134E422
        Then can grep with js compare pid with tcp list and can make a list of all the extensions and there debug ports

        */

    })();

    ////////////////////
    // Set Log Levels //
    ////////////////////

    $("#logLevel").click(function() {
        if (/\bshow\b/.test('' + $('#myDropdown').attr('class'))) {
            $("#myDropdown").removeClass("show");
        } else {
            $("#myDropdown").addClass("show");
        }
    });

    $("#restartExt").click(function() {
        try {
            // if we're restarting then we should remove all the eventListeners so we don't get double events
            process.removeAllListeners();
            window.location.href = './index.html';
        } catch (e) {
            window.location.href = './index.html';
        }
    });

    $('.label').click(function() {
        $(this).prev('input:checkbox').attr('checked', true).change(); // Manually trigger the change event
        $(this).prev('input:radio').attr('checked', true).change(); // Manually trigger the change event
    });

    $("#ext").click(function() {
        jsx.eval("new File('" + csInterface.getSystemPath(SystemPath.EXTENSION) + "').execute();");
    });

    $('#help').click(function() {
        exec((isMac ? 'open "' : 'start "" "') + 'https://github.com/Trevor-/CSTK#readme"');
    });

    var getCeps, getDebugPorts, processCeps,
        appLocale, logFile, extId, displayExtensions, setUpButtons;


    app = csInterface.getHostEnvironment();
    appId = app.appId;
    appVersion = app.appVersion;
    appName = csInterface.getSystemPath('hostApplication').replace(/^.+Adobe./, '').replace(/[\/\\].+$/, '');
    appLocale = app.appLocale;
    extId = csInterface.getExtensionID();
    logFile = os.tmpdir() + '\\CEPHtmlEngine__CEPMAJOR__-__APPID__-__APPVERSION__-__EXTID__.log'
        .replace('__CEPMAJOR__', csInterface.getCurrentApiVersion().major)
        .replace('__APPID__', appId)
        .replace('__APPVERSION__', appVersion);
    $('#hostAppInfo').html(
        '<img src="../img/Forum_Icons/APPID.png" style="height: 25px; top: 8px; position: relative;" id="" />'
        .replace(/APPID/, appId ? appId : 'CLOD') +
        '<span style="font-size: .8em"> ' + appName + ' (' + appVersion + ')</span>'
    );


    if (1) { // windows

        getCeps = isMac ? function() {
                exec('ps ax | grep "CEPHtmlEngine.app"', getDebugPorts);
            } :
            function() { // Windows
                var powershell = 'powershell "Get-WmiObject win32_process -Filter \\"name=\'CEPHTMLEngine.exe\'\\" handle, commandLine"';
                exec(powershell, function(e, r) {
                    if (e) {
                        log('getCeps error: ' + e, 'e', 'ping');
                    }
                    //log(e||r)
                    r = r.replace(/[\r\n]\s{15,}/g, '').replace(/[\n\r]+Handle +:/g, '').match(/CommandLine[^\r\n]+/g);
                    // log(r, 'v', 'ping')
                    getDebugPorts(e, r);
                });
            }; // end of getCeps


        getDebugPorts = isMac ? function(err, cepProcesses) {
                exec('lsof -PiTCP -sTCP:LISTEN | grep CEPHtmlEn', function(err, result) {

                    processCeps(err, result, cepProcesses);
                });
            } :
            function(err, cepProcesses) { // Windows
                var n, l;
                // alert(cepProcesses)
                l = cepProcesses.length;
                for (n = 0; n < l; n++) {
                    cepProcesses[n] = cepProcesses[n].replace(/(CommandLine .+?)(\d+$)/g, '$2 $1');
                }
                // jsx.eval('alert("""__cep__""")',{cep:(JSON.stringify(cepProcesses))});
                exec('netstat -aon |  findstr 0.0.0.0:0', function(err, result) {
                    var n, l, r, port, pid;
                    if (err) {
                        alert(err);
                        return;
                    }

                    result = result.split(/[\r\n]+/g);
                    l = result.length;
                    for (n = 0; n < l; n++) {
                        r = '' + result[n];
                        port = r.match(/[\d:\.]+/);
                        pid = r.match(/\d+\s*$/);
                        port = port && port[0];
                        pid = pid && pid[0];

                        result[n] = (pid | '0') + ' TCP ' + (port || '0.0.0.0:0') + ' ';
                        // result[n] =  r.match(/\d+\s*$/);

                    }
                    //jsx.eval('alert("""__cep__""")', { cep: (JSON.stringify(result)) });
                    processCeps(err, result, cepProcesses);
                });
            }; // end of getDebugPorts


        processCeps = isMac ? function(err, cepPorts, cepProcesses) {
                // definitely lacking error checking!
                // TODO add error checking!
                try {
                    var l, n, extensionMap, dirName, cepProcess, params_serverid, cepPid, logFiles, pidMap, portMap, port, portUrl, extension, extensions, hostExtensions, hostExtensionsMap, dirNameMap;
                    logFiles = {};
                    extensionMap = {};
                    dirNameMap = {};
                    pidMap = {};
                    portMap = {};
                    hostExtensionsMap = {};
                    extensions = [];
                    hostExtensions = csInterface.getExtensions();
                    cepProcesses = cepProcesses && cepProcesses.split(/[\n\r]/);
                    cepPorts = cepPorts && cepPorts.split(/[\n\r]/);
                    l = cepProcesses.length;

                    // We now need to categorize the processes
                    // there are 3 CEP types for each extension: parent, renderer and gpu
                    // The process with the most useful information stored in it's command line parameter is the renderer
                    // The parent process has the PID which can be compared to the PID in the listening ports to fetch the debug port

                    for (n = 0; n < l; n++) {
                        cepProcess = cepProcesses[n];
                        if (/--type=renderer/.test(cepProcess)) {
                            // renderer_helpers.push(cepProcess);
                            params_serverid = cepProcess.match(/--params_serverid=(\S+)/);
                            params_serverid = params_serverid && params_serverid[1];
                            if (params_serverid) {
                                cepPid = '' + cepProcess.match(/\d+/);
                                if (extensionMap[params_serverid]) {
                                    extensionMap[params_serverid].renderer = cepProcess;
                                    extensionMap[params_serverid].renderPid = cepPid;
                                } else {
                                    extensionMap[params_serverid] = {
                                        renderer: cepProcess,
                                        renderPid: cepPid
                                    };
                                }
                            }
                            continue;
                        }
                        if (/--type=gpu-process/.test(cepProcess)) {
                            // we don't need the gpu-process
                            continue;
                        }
                        // if it's not the renderer or gpu-process then it's the main parent process
                        // The only thing we need from this is it's PID and dirName
                        // so we can compare with the PIDs of the ports being listened to
                        // Then we can know if there's a debug port
                        params_serverid = cepProcess.match(/[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/);
                        // log('params_serverid: ' + params_serverid);
                        // params_serverid = params_serverid && (params_serverid[1]) + '';
                        dirName = cepProcess.match(
                            /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12} [\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}[^\/]+(.+?)(?= \d+ [^ ]{12,}?= )/
                        );
                        // 9421f897-0ea4-403f-a504-4564154bd694 3e9b1810-7520-42c5-bc46-e7d5c4cfbe14
                        dirName = dirName && dirName[1];
                        // log('cepProcess: ' + cepProcess);
                        // log('dirName: ' + dirName);
                        // log('params_serverid: ' + params_serverid);
                        if (params_serverid) {
                            cepPid = '' + cepProcess.match(/\d+/);
                            pidMap[cepPid] = params_serverid;
                            if (extensionMap[params_serverid]) {
                                extensionMap[params_serverid].cepPid = cepPid;
                                extensionMap[params_serverid].dirName = dirName;

                            } else {
                                extensionMap[params_serverid] = {
                                    cepPid: cepPid,
                                    dirName: dirName
                                };
                            }
                            dirNameMap[dirName] = params_serverid;
                        }
                    }

                    // let's make a map of the cep ports to pids

                    l = cepPorts.length;
                    for (n = 0; n < l; n++) {
                        port = '' + cepPorts[n];
                        //alert(port)
                        portUrl = port.match(/TCP (\S+)/);
                        portUrl = portUrl && portUrl[1];
                        if (portUrl) portMap['' + port.match(/\d+/)] = portUrl;
                    }
                    // alert(JSON.stringify(portMap));

                    // map paths to known extension names
                    // map paths to known extension names that way we can get some of the names of the extensions
                    // this info is not available from the command line argument of the processes
                    // one could fetch it for all the processes by scanning all the manifest files but that could be slow
                    // instead we're just going to fetch the one of the active app list is easier and quicker
                    // but as a result the names for extensions that aren't also running on the current app will not be retrieved

                    var basePath, hostExt, ext;
                    l = hostExtensions.length;
                    for (n = 0; n < l; n++) {
                        hostExt = hostExtensions[n];
                        basePath = hostExt.basePath;
                        if (dirNameMap[basePath]) {
                            ext = extensionMap[dirNameMap[basePath]];
                            if (ext) {
                                ext.name = hostExt.name;
                                ext.isCurrentApp = 1;
                            }
                            // log('extensionMap[' + dirNameMap[basePath] + ']: ' + Jfy(extensionMap[dirNameMap[basePath]]));
                        } else {
                            ext = {};
                            ext.appName = appName;
                            ext.appCode = appId;
                            ext.appVersion = appVersion;
                            ext.id = hostExt.id;
                            ext.dirName = hostExt.basePath;
                            ext.name = hostExt.name;
                            ext.log = logFile.replace('__EXTID__', '' + ext.id);
                            ext.isCurrentApp = 1;
                            ext.active = false;
                            extensions.push(ext);
                        }
                    }

                    // alert(JSON.stringify(hostExtensionsMap));
                    // now we can go through the extensionMap map and extract some useful data
                    var info, render;
                    for (extension in extensionMap) {
                        // extensions
                        extension = extensionMap[extension];
                        // alert(JSON.stringify(extension))
                        render = extension.renderer;
                        if (!render) {
                            continue;
                        }
                        ext = {};
                        // Adobe app
                        info = render.match(/\/.+?\.app/);
                        ext.appName = info && info[0].match(/\/([^\/]+?)\/[^\/]+$/)[1];
                        // app code
                        ext.appCode = render.match(/--params_ppid=(.+?) --/)[1];
                        // app version
                        ext.appVersion = render.match(/--params_ppversion=(.+?) --/)[1];
                        // extension id
                        ext.id = render.match(/--params_extensionid=(.+?) --/)[1];
                        // --node-module-dir - log
                        ext.dirName = extension.dirName;
                        // logFile
                        ext.log = render.match(/--log-file=(.+?) --log/);
                        // logFile
                        ext.log = ext.log ? ext.log[1] : undefined;
                        // logLevel and severity
                        ext.logLevel = render.match(/--params_loglevel=(.+?) --/)[1] + ' - ' + render.match(/--log-severity=(.+?) --/)[1];
                        // debugPort
                        info = portMap[extension.cepPid];
                        ext.debugPort = info;
                        // is current app
                        ext.isCurrentApp = extension.isCurrentApp || 0;
                        ext.name = extension.name;
                        // is Extension active
                        // var dirN;
                        // dirN = ext.dirName && ext.dirName.replace(/[\/\\]/g, ':');
                        // if (hostExtensionsMap[dirN]) {
                        //     ext.name = hostExtensionsMap[dirN].name;
                        //     hostExtensionsMap[dirN].active = true;
                        // }
                        ext.active = true;

                        extensions.push(ext);
                    } // end of extension loop
                    displayExtensions(extensions);
                } catch (e) {
                    log(e.stack, '  e');
                    alert(e.stack);
                }
            } : // Windows
            function(err, cepPorts, cepProcesses) {
                // definitely lacking error checking!
                // TODO add error checking!
                try {

                    var l, n, extensionMap, cepProcess, gpuMap, params_extensionuuid, cepPid, dirName, pidMap, portMap, port, portUrl, extension, extensions, hostExtensions, hostExtensionsMap;
                    extensionMap = {};
                    pidMap = {};
                    portMap = {};
                    gpuMap = {};
                    hostExtensionsMap = {};
                    extensions = [];
                    hostExtensions = JSON.parse(window.__adobe_cep__.getExtensions());
                    l = cepProcesses.length;

                    // We now need to categorize the process but unlike on the Mac
                    // there are 3 CEP types for each extension: parent, renderer and gpu

                    for (n = 0; n < l; n++) {
                        cepProcess = cepProcesses[n];
                        if (/--type=renderer/.test(cepProcess)) {
                            // the renderer process contains useful data let's get it.
                            params_extensionuuid = cepProcess.match(/--params_extensionuuid=(\S+)/);
                            params_extensionuuid = params_extensionuuid && params_extensionuuid[1];
                            if (params_extensionuuid) {
                                cepPid = '' + cepProcess.match(/\d+/);
                                if (extensionMap[params_extensionuuid]) {
                                    extensionMap[params_extensionuuid].renderer = cepProcess;
                                    extensionMap[params_extensionuuid].renderPid = cepPid;
                                } else {
                                    extensionMap[params_extensionuuid] = { renderer: cepProcess, renderPid: cepPid };
                                }
                            }
                            continue;
                        }
                        if (/--type=gpu-process/.test(cepProcess)) {
                            // we don't need the gpu-process
                            continue;
                        }
                        // if it's not the renderer or gpu-process then it's the main parent process
                        // The only thing we need from this is it's PID
                        // so we can compare with the PIDs of the ports being listened to
                        // Then we can know if there's a debug port
                        params_extensionuuid = cepProcess.match(/" ([^"\s]+)/);
                        params_extensionuuid = params_extensionuuid && params_extensionuuid[1];
                        dirName = cepProcess.match(/" [^"]+?"([^"]+)/);
                        dirName = dirName && dirName[1];
                        if (params_extensionuuid) {
                            cepPid = '' + cepProcess.match(/\d+/);
                            pidMap[cepPid] = params_extensionuuid;
                            if (extensionMap[params_extensionuuid]) {
                                extensionMap[params_extensionuuid].cepPid = cepPid;
                                extensionMap[params_extensionuuid].dirName = dirName;
                            } else {
                                extensionMap[params_extensionuuid] = { cepPid: cepPid, dirName: dirName };
                            }
                        }
                    }

                    // let's make a map of the cep ports to pids

                    l = cepPorts.length;
                    for (n = 0; n < l; n++) {
                        port = '' + cepPorts[n];
                        //alert(port)
                        portUrl = port.match(/TCP (\S+)/);
                        portUrl = portUrl && portUrl[1];
                        if (portUrl) portMap['' + port.match(/\d+/)] = portUrl;
                    }
                    // log(JSON.stringify(portMap));

                    // map paths to known extension names that way we can get some of the names of the extensions
                    // this info is not available from the command line argument of the processes
                    // one could fetch it for all the processes by scanning all the manifest files but that could be slow
                    // instead we're just going to fetch the one of the active app list is easier and quicker
                    // but as a result the names for extensions that aren't also running on the current app will not be retrieved

                    var basePath, hostExt;
                    l = hostExtensions.length;
                    for (n = 0; n < l; n++) {
                        hostExt = hostExtensions[n];
                        basePath = hostExt.basePath;
                        basePath = basePath && basePath.replace(/[\/\\]+/g, ':');
                        hostExtensionsMap[basePath] = { name: hostExt.name, ext: hostExt };
                    }

                    // log('hostExtensionsMap:' + JSON.stringify(hostExtensionsMap),'v', 'happy');
                    // now we can go through the extensionMap map and extract some useful data
                    var ext, info, render;
                    for (extension in extensionMap) {
                        // extensions
                        extension = extensionMap[extension];
                        render = extension.renderer;
                        ext = {};
                        // Adobe app
                        info = render.match(/\\Adobe\\([^\\]+)/);
                        ext.appName = info && info[1];
                        // app code
                        ext.appCode = render.match(/--params_ppid=(.+?) --/)[1];
                        // app version
                        ext.appVersion = render.match(/--params_ppversion=(.+?) --/)[1];
                        // extension id
                        ext.id = render.match(/--params_extensionid=(.+?) --/)[1];
                        // --node-module-dir - dirName
                        // for now
                        // info = render.match(/--node-module-dir="([^"]+)/);
                        ext.dirName = extension.dirName;
                        // logFile
                        ext.log = render.match(/--log-file="([^"]+)/)[1];
                        // logLevel and severity
                        ext.logLevel = render.match(/--params_loglevel=(.+?) --/)[1] + ' - ' + render.match(/--log-severity=(.+?) --/)[1];


                        // debugPort
                        info = portMap[extension.cepPid];
                        ext.debugPort = info;
                        // is current app
                        ext.isCurrentApp = +((ext.appCode == appId) && (ext.appVersion == appVersion));
                        // is Extension active
                        var dirN;
                        dirN = ext.dirName && ext.dirName.replace(/[\/\\]/g, ':');
                        if (hostExtensionsMap[dirN]) {
                            ext.name = hostExtensionsMap[dirN].name;
                            hostExtensionsMap[dirN].active = true;
                        }
                        ext.active = true;

                        extensions.push(ext);
                    } // end of for
                    // add inactive extensions that are on the host app
                    for (hostExt in hostExtensionsMap) {
                        if (hostExtensionsMap[hostExt].active) {
                            continue;
                        }
                        hostExt = hostExtensionsMap[hostExt].ext;
                        // log('hostExt: ' + hostExt);
                        ext = {};
                        ext.appName = appName;
                        ext.appCode = appId;
                        ext.appVersion = appVersion;
                        ext.id = hostExt && hostExt.id;
                        ext.dirName = hostExt && hostExt.basePath;
                        ext.name = hostExt && hostExt.name;
                        ext.log = logFile.replace('__EXTID__', '' + ext.id);
                        ext.isCurrentApp = 1;
                        ext.active = false;

                        extensions.push(ext);
                    }
                    // if we wanted to we could search all the extension folders
                    // or at least the user and system extension folders and read the manifest files
                    // to complete the picture, but were not going to bother for now!
                    // scanning all the individual app CEP folder would be more work

                    // create the html for the extensions
                    displayExtensions(extensions);
                } catch (e) {
                    log(e.stack);
                    alert(e.stack);
                }
            }; // end of processCeps


        // getCeps();
    } // end  of windows


    displayExtensions = function(extensions) {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // each extension should have at least some of the following keys                                              //
        // "appName": "Adobe InDesign CC 2018",                                                                        //
        // "appCode": "IDSN",                                                                                          //
        // "appVersion": "13.0",                                                                                       //
        // "id": "com.creative-scripts.cstk.1",                                                                        //
        // "dirName": "C:\\Program Files\\Common Files\\Adobe\\CEP\\extensions\\CSTK",                                 //
        // "name": "CSTK",                                                                                             //
        // "log": "C:\\Users\\Trevor\\AppData\\Local\\Temp\\CEPHtmlEngine8-IDSN-13.0-com.creative-scripts.cstk.1.log", //
        // "logLevel": "4 - verbose",                                                                                  //
        // "debugPort": "127.0.0.1:9073"                                                                               //
        // It would be best to sort them per app                                                                       //
        // current app at top then app alphabetically then version then extension alphabetically                       //
        // active / inactive shown by green and red icons                                                              //
        // In the event that there are multiple instances of the same version of the same app running                  //
        // some minor details could be inaccurate                                                                      //
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var extension, l, n, extensionSort, openFolder;
        openFolder = function(folder) {
            if (openFolderApp) {
                exec((isMac ? 'open -a "_openFolderApp_" "_folder_"' : '"_openFolderApp_" "_folder_"')
                    .replace(/_openFolderApp_/, openFolderApp)
                    .replace(/_folder_/, folder));
            } else {
                exec((isMac ? 'open "_folder_"' : 'start "" "_folder_"')
                    .replace(/_folder_/, folder));
            }
        };
        extensionSort = function(a, b) {
            var aa, bb;
            // Sort by current app
            if (a.isCurrentApp > b.isCurrentApp) {
                return -1;
            }
            if (a.isCurrentApp < b.isCurrentApp) {
                return 1;
            }
            if ((a.appCode === appId) && (b.appCode !== appId)) {
                return -1;
            }
            if ((a.appCode !== appId) && (b.appCode === appId)) {
                return 1;
            }
            // Sort by app
            if (a.appCode > b.appCode) {
                return 1;
            }
            if (a.appCode < b.appCode) {
                return -1;
            }
            // sort by version - most recent at top
            // major / minor / micro
            aa = a.appVersion.split('.');
            bb = b.appVersion.split('.');
            if (+aa[0] < +bb[0]) {
                return -1;
            }
            if (+aa[0] > +bb[0]) {
                return 1;
            }
            if (+aa[1] < +bb[1]) {
                return -1;
            }
            if (+aa[1] > +bb[1]) {
                return 1;
            }
            if (+aa[2] < +bb[2]) {
                return -1;
            }
            if (+aa[2] > +bb[2]) {
                return 1;
            }
            // sort by extension id
            if (a.id.toLowerCase() > b.id.toLowerCase()) {
                return -1;
            }
            if (a.id.toLowerCase() < b.id.toLowerCase()) {
                return 1;
            }
            return 0;
        };

        var oldApp = '',
            html = [];
        l = extensions.length;
        extensions.sort(extensionSort);
        for (n = 0; n < l; n++) {
            extension = extensions[n];
            if (oldApp !== extension.appCode + extension.appVersion) {
                oldApp = extension.appCode + extension.appVersion;
                html.push(`
                    <img src="../img/Forum_Icons/${appMap[extension.appCode] ? extension.appCode : 'CLOD'}.png" style="height:48px;top:0px;position: relative;padding:10px 10px 0 0;" />
                    <b> ${extension.appName} - ${extension.appCode} ${extension.appVersion} ${(oldApp === appId + appVersion ? ' (Current App)<br><span style="font-size: .8em;"><span style="color: green;">Active</span> &amp; <span style="color: Red;">inactive</span> extensions listed</span>' : '<br><span style="font-size: .8em;"">Only <span style="color: green;">active</span> listed</span>')}
                    </b>
                `);
            }
            html.push(` <div>
                                <img src="../img/Forum_Icons/${appMap[extension.appCode] ? extension.appCode : 'CLOD'}.png" style="height:22px;top:4px;position: relative;padding-right:4px;" />
                                <span style="font-size:.7em;">${extension.appVersion}</span>
                                <span> ${extension.id} ${((extension.name && (extension.name !== extension.id)) ? ` - [${extension.name}]` : '')}
                                </span>
                                <img src="../img/${extension.active ? 'green' : 'red'}LED.png" style="top:0px;position: relative;padding:0 4px 0 4px;"/>
                                <span class="csButton blueButton" id="OpenFolder_${n}" title="Click to open with ${(isMac ? 'Finder' : 'Explorer')}. SHIFT click to open with selected application."> Open Folder</span>
                                <span class="csButton blueButton" id="OpenLog_${n}" title="Open the extension's main log (IF IT EXISTS)"> Open Log<span style="font-size:.7em;">${extension.logLevel ? ' ' + extension.logLevel : ''}</span></span>
                                ${extension.debugPort ? '<span class="csButton greyButton"  id="OpenDebug_' + n + '" title="Port: ' + extension.debugPort + '">Debug</span>' : ''}
                            </div>
                `);
        }

        $("#folderBody").html(html.join('\n'));

        setUpButtons = function(n) {
            var extension = extensions[n];
            if (extension.dirName) {
                $('#OpenFolder_' + n).click(function(event) {
                    // The folder shouldn't have permissions issues regarding opening it
                    // using exec will cause the log to come to the foreground
                    // execute() will not when called called by jsx.eval as the app goes back or stays in focus

                    if (event.shiftKey) {
                        openFolder(extension.dirName);
                    } else {
                        exec((isMac ? 'open "' : 'start "" "') + extension.dirName + '"');
                    }
                });
            }
            if (extension.log) {
                $('#OpenLog_' + n).click(function() {
                    // The log could have permissions issues regarding opening it
                    // using execute() will circumvent besides we can provide some prettier feedback
                    var script = `
                            if (!(new File("__file__").execute())){
                                alert(
                                    !(new File("__file__").exists) ?
                                    "The log probably hasn't been created and couldn't be opened.\\n" +
                                    "Start the extension to created the log." :
                                    "Make sure you've there's an assigned program for opening \\".log\\" files"
                                    );
                            }
                            `;
                    jsx.eval(script.join('\n'), { file: extension.log.replace(/\\/g, '\\\\\\\\') });
                    // exec('open "__FILE__"'.replace(/__FILE__/, '' + extension.log));
                });
            }
            if (extension.debugPort) {
                $('#OpenDebug_' + n).click(function() {
                    launchDebug(extension.debugPort);
                });
            }


        };

        l = extensions.length;
        for (n = 0; n < l; n++) {
            setUpButtons(n);
        }

    }; //end of displayExtensions


    launchDebug = function(port) {
        var debugApp, cmd;
        debugApp = '' + $('#debugApps').val();
        port = undefined ? '' : '' + port;
        if (!(/:/.test(port))) {
            port = 'http://localhost:' + port;
        } else if (!(/http/.test(port))) {
            port = 'http://' + port;
        }
        if (!/\d/.test(port)) { return; }
        if (/chrome/i.test(debugApp)) {
            if (isMac) {
                debugApp += '/Contents/MacOS/Google Chrome'; // /Contents/MacOS/Google Chrome
                cmd = 'open -a "' + debugApp + '" ' + port;
            } else {
                cmd = '"' + debugApp + '" ' + port;
            }
        } else if (/cefclient/i.test(debugApp)) {
            if (isMac) {
                debugApp += '/Contents/MacOS/cefclient';
                cmd = '"' + debugApp + '" --url=' + port;
            } else {
                cmd = '"' + debugApp + '" --url=' + port;
            }
        } else {
            alert('Sorry at present only Chrome and Cefclient are supported :-<');
        }
        exec(cmd, function(err) {
            if (err !== null) {
                __log('CSTK launch debug error:' + err, 'e');
                alert('CSTK launch debug error:' + err);
            }
            // should offer to remove app from list?
        });
    }; // end of launchDebug


    $('#debugBT').click(function() {
        launchDebug($('#portIN').val());
    });
    $('#refeshAppList').click(function() {
        $('#folderBody').text('Please wait a few (upto 10) seconds for the apps to be processed');
        addDebugApps();
        getCeps();
    });
    addDebugApps();

})();