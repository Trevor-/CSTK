/* global jsx, window, process, LogFactory */
/* jshint undef:true, unused:true, evil: true, esversion:6 */


//////////////////////////////////
// setup script loader function //
//////////////////////////////////

// Set these as global to help out for console and external scripts
// Would be good to have them also as locals
var run, Jfy, log, exec, isMac, __dirname, path, os, csInterface, fs;


////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var evalMode;
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
            $('#folders').hide();
            $("#openFolders").text('Show Extensions Tools');
            // $("#openFolders").removeClass("blueButton");
            $('#console').show();
        } else {
            $('#console').hide();
            $('#folderBody').text('Please wait a few (upto 10) seconds for the apps to be processed');
            run(isMac ? 'debug_tools_mac.js' : 'debug_tools_windows.js');
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

})();