/* global jsx, window, process, LogFactory,CSInterface, require, $, setTimeout, SystemPath, alert, document */
/* jshint undef:true, unused:true, evil: true, esversion:6 */

/*
     ____    _____   ________    __   ___
    / ___)  / ____\ (___  ___)  () ) / __)
   / /     ( (___       ) )     ( (_/ /
  ( (       \___ \     ( (      ()   (
  ( (           ) )     ) )     () /\ \
   \ \___   ___/ /     ( (      ( (  \ \
    \____) /____/      /__\     ()_)  \_\

         __ __  __  __        __
    \  /|_ |__)(_ |/  \|\ |    _)
     \/ |__| \ __)|\__/| \|   /__


    |   _  _|_  |\/| _  _|.(_. _ _|.
    |__(_|_)|_  |  |(_)(_||| |(-(_|.

                          __   __      __
     /| |__|    | _  _     _) /  \ /| (__)
      |    |  __)(_|| )   /__ \__/  | (__)

     __                       __                 __
    /   _  _    _. _ |_ |_.  /   _ _ _ |_.   _  (_  _ _. _ |_ _
    \__(_)|_)\/| |(_)| )|_.  \__| (-(_||_|\/(-  __)(_| ||_)|__)
          |  /    _/                                    |

         ___ ___  __     /   /  __   __   ___      ___         ___     __   __   __     __  ___  __    __   __
    |__|  |   |  |__) . /   /  /  ` |__) |__   /\   |  | \  / |__  __ /__` /  ` |__) | |__)  |  /__`  /  ` /  \  |\/|
    |  |  |   |  |    ./   /   \__, |  \ |___ /~~\  |  |  \/  |___    .__/ \__, |  \ | |     |  .__/ .\__, \__/  |  |

         __  __ __        ___ __            __            __  __         ___
     /\ |__)(_ /  \|  /  \ | |_ | \_/  |\ |/  \  |  | /\ |__)|__) /\ |\ | | \_/
    /--\|__)__)\__/|__\__/ | |__|__|   | \|\__/  |/\|/--\| \ | \ /--\| \| |  |


    http://creative-scripts.com
*/


//////////////////////////////////
// setup script loader function //
//////////////////////////////////

// Set these as global to help out for console and external scripts
// Would be good to have them also as locals
var run, Jfy, log, exec, isMac, __dirname, path, os, csInterface, fs;
var __log, __result, __error;

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

    ////////////////////////
    // setup config files //
    ////////////////////////

    var cstkFolder, debugAppFile, debugAppSelection, openFolderAppFile, optionsFile;
    cstkFolder = path.join(csInterface.getSystemPath('userData'), 'Creative Scripts', 'CSTK');
    debugAppFile = path.join(cstkFolder, 'debugAppsList.txt');
    debugAppSelection = path.join(cstkFolder, 'debugAppSelection.txt');
    openFolderAppFile = path.join(cstkFolder, 'OpenFolderApp.txt');
    optionsFile = path.join(cstkFolder, 'options.json');

    var searchForandAddDebugApps;

    // Set PhotoShop to persistent

    (function(isPersistent) {
        var event;
        event = new CSEvent((isPersistent ?
                "com.adobe.PhotoshopPersistent" :
                "com.adobe.PhotoshopUnPersistent"),
            "APPLICATION");
        event.extensionId = 'com.creative-scripts.cstk.2';
        csInterface.dispatchEvent(event);
    })(true); //persistent to prevent extension from unloading


    /*
     _______  _______  _        _______  _______  _        _______
    (  ____ \(  ___  )( (    /|(  ____ \(  ___  )( \      (  ____ \
    | (    \/| (   ) ||  \  ( || (    \/| (   ) || (      | (    \/
    | |      | |   | ||   \ | || (_____ | |   | || |      | (__
    | |      | |   | || (\ \) |(_____  )| |   | || |      |  __)
    | |      | |   | || | \   |      ) || |   | || |      | (
    | (____/\| (___) || )  \  |/\____) || (___) || (____/\| (____/\
    (_______/(_______)|/    )_)\_______)(_______)(_______/(_______/

     */


    ////////////////////////////////
    // Config options             //
    // Not too much here for now! //
    ////////////////////////////////
    var options = {};
    (function() {
        fs.readJson(optionsFile, function(err, packageObj) {
            if (!err) {
                options = packageObj;
            }
            // Setup default values
            if (options.showSnippet === undefined) { options.showSnippet = false; }
            if (options.consoleFontSize === undefined) { options.consoleFontSize = 12; }
            $("#resultModeDV").html('<i class="far fa-' + (options.showSnippet ? 'check-square' : 'square') + ' fa-lg"></i> Include snippet in results');
            $('.console').css('font-size', options.consoleFontSize + 'px');
        });
    })();

    $("#configBT").click(function() {
        $('#configDiv').css('display', $('#configDiv').is(":visible") ? 'none' : 'block');
    });
    $("#closeConfigBT").click(function() {
        $('#configDiv').css('display', 'none');
    });

    $("#resultModeDV").click(function() {
        options.showSnippet = !options.showSnippet;
        $("#resultModeDV").html('<i class="far fa-' + (options.showSnippet ? 'check-square' : 'square') + ' fa-lg"></i> Include snippet in results');
        fs.outputJSON(optionsFile, options);
    });

    $('#lisenceBT').click(function() {
        exec((isMac ? 'open' : 'explorer') + ' "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4H6E938ACF4CU"');
    });

    ///////////////////////
    // Console font size //
    ///////////////////////

    $("#zoomOut").click(function() {
        options.consoleFontSize--;
        $('.console').css('font-size', options.consoleFontSize + 'px');
        fs.outputJSON(optionsFile, options);
    });

    $("#zoomIn").click(function() {
        options.consoleFontSize++;
        $('.console').css('font-size', options.consoleFontSize + 'px');
        fs.outputJSON(optionsFile, options);
    });

    ////////////////////////////
    // Open and Save Snippets //
    ////////////////////////////

    $('#openSnippetBT').click(function() {
        var snippet;
        snippet = window.cep.fs.showOpenDialog(false, false, 'Please select a Snippet');
        snippet = '' + snippet.data[0];
        if (snippet === '' || snippet === 'undefined' || snippet === 'null') {
            return;
        }
        fs.readFile(snippet, function(error, result) {
            if (error) return __error('Open Snippet Error: ' + error, 'background:#FFFCAA');
            __log('Opened: ' + snippet, 'background:#FFFCAA');
            $('#evalCode').val('' + result);
        });
    });


    $('#saveSnippetBT').click(function() {
        var snippet;
        snippet = window.cep.fs.showSaveDialogEx('Save Snippet');
        snippet = '' + snippet.data;
        if (snippet === '' || snippet === 'undefined' || snippet === 'null') {
            return;
        }
        fs.writeFile(snippet, $('#evalCode').val(), function(error) {
            if (error) return __error('Save Snippet Error: ' + error, 'background:#FFFCAA');
            __log('Saved: ' + snippet, 'background:#FFFCAA');
        });
    });


    dummy = function(err) {
        //  function might be needed at some point to stop asynchronous node functions throwing errors
        // because no callback has been provided
        // this would be more according to the letter than the spirit of the law ;-{
        if (err) {
            // log(err.stack, 'e');
        }
    };

    // Make sure the correct whole snippet OS dependent shortcut shows up
    if (isMac) {
        $("#wholeSnippetDV").text('Press Option\u2325+Enter to execute the whole snippet');
        $("#EVAL").attr('title', 'Execute the selected snippet as a JSX script.<br>' + (isMac ? 'Option\u2325+Enter' : 'Shift+Ctrl+A') + ' to execute the whole snippet<br>Shift+Enter to execute only selected lines');
    }

    ////////////////////////////////////////////////////////
    // The console should work in JS, JSX and Shell modes //
    // This deals with the mode buttons                   //
    ////////////////////////////////////////////////////////

    evalMode = 1; // default value
    var cwd = csInterface.getSystemPath('myDocuments');
    if (!isMac) { cwd = cwd.replace(/\//g, '\\'); }
    $('#pwd').text(cwd + '>');
    $('#jsModeBT').click(function() { // JS
        var colorClass;
        $('#evalCode').css({ borderColor: 'blue' });
        evalMode = 0;
        if ($('#cwd').is(":visible")) { $('#cwd').hide(); }
        colorClass = '' + $('#EVAL').attr('class');
        if (/blue/.test(colorClass)) { return; }
        if (/red/.test(colorClass)) {
            $("#EVAL").removeClass("redButton");
            $("#execModeBT").removeClass("redButton").addClass('greyButton');
        } else {
            $("#EVAL").removeClass("greenButton");
            $("#jsxModeBT").removeClass("greenButton").addClass('greyButton');
        }
        $("#EvalMode").text("JS");
        $("#EVAL").addClass("blueButton");
        $("#jsModeBT").removeClass("greyButton").addClass('blueButton');
        $("#EVAL").attr('title', 'Execute the selected snippet as a JS script.<br>' + (isMac ? 'Option\u2325+Enter' : 'Shift+Ctrl+A') + ' to execute the whole snippet<br>Shift+Enter to execute only selected lines');
    });

    $('#jsxModeBT').click(function() { // JSX
        var colorClass;
        $('#evalCode').css({ borderColor: 'green' });
        if ($('#cwd').is(":visible")) { $('#cwd').hide(); }
        evalMode = 1;
        colorClass = '' + $('#EVAL').attr('class');
        if (/green/.test(colorClass)) { return; }
        if (/red/.test(colorClass)) {
            $("#EVAL").removeClass("redButton");
            $("#execModeBT").removeClass("redButton").addClass('greyButton');
        } else {
            $("#EVAL").removeClass("blueButton");
            $("#jsModeBT").removeClass("blueButton").addClass('greyButton');
        }
        $("#EvalMode").text("JSX");
        $("#EVAL").addClass("greenButton");
        $("#jsxModeBT").removeClass("greyButton").addClass('greenButton');
        $("#EVAL").attr('title', 'Execute the selected snippet as a JSX script.<br>' + (isMac ? 'Option\u2325+Enter' : 'Shift+Ctrl+A') + ' to execute the whole snippet<br>Shift+Enter to execute only selected lines');
    });


    $('#execModeBT').click(function() {
        var colorClass;
        $('#evalCode').css({ borderColor: 'red' });
        evalMode = 2;
        if (!($('#cwd').is(":visible"))) { $('#cwd').show(); }
        colorClass = '' + $('#EVAL').attr('class');
        if (/red/.test(colorClass)) { return; }
        if (/green/.test(colorClass)) {
            $("#EVAL").removeClass("greenButton");
            $("#jsxModeBT").removeClass("greenButton").addClass('greyButton');
        } else {
            $("#EVAL").removeClass("blueButton");
            $("#jsModeBT").removeClass("blueButton").addClass('greyButton');
        }
        $("#EvalMode").text(isMac ? "BASH" : "CMD");
        $("#EVAL").addClass("redButton");
        $("#execModeBT").removeClass("greyButton").addClass('redButton');
        $("#EVAL").attr('title', 'Execute the selected snippet as a shell script.<br>' + (isMac ? 'Option\u2325+Enter' : 'Shift+Ctrl+A') + ' to execute the whole snippet<br>Shift+Enter to execute only selected lines<br>For complex shell usage use a real console :->');
    });

    /////////////////////////////////////////////////////////////////////////////////
    // Function captures the Shift+Enter and Shift+Ctrt+A console key combinations //
    // Select the relevant lines of code and passes them on to be processed        //
    /////////////////////////////////////////////////////////////////////////////////
    var evalOnEnter = function(key) {
        var codeContents, result, pos, selectedLines, beforeString, afterString, startOfLines, endOfLines, evalLines, startIndex, endIndex,
            beforeReg, afterReg;

        beforeReg = /[^\n\r]*$/;
        afterReg = /[^\n\r]*/g;
        beforeReg.lastIndex = 0;
        afterReg.lastIndex = 0;

        ////////////////////////////////////////////////////////////////////////////////////////
        // Windows and Mac and differing Chrome versions pickup differing key events          //
        // This allows for executing selected lines using Shift+Enter                         //
        // And the whole snippet by using Shift+Ctrl+A on Windows and Option\u2325+Enter on the Mac //
        ////////////////////////////////////////////////////////////////////////////////////////

        // __log('keyCode: ' + key.keyCode + ' key: ' + key.key + ' code: ' + key.code + ' altKey: ' + key.altKey + ' meta: ' + key.metaKey, 'background:yellow;')
        if (key.keyCode === 13 || (!isMac && key.shiftKey && key.ctrlKey && key.keyCode === 1)) {
            codeContents = $('#evalCode').val();
            if (key.keyCode === 13) {
                selectedLines = !key.altKey;
                if (key.altKey && parseInt(process.versions.v8) > 4) {
                    evalLines = codeContents;
                } else if (key.shiftKey || key.altKey) {
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
                    evalLines = (key.altKey) ? codeContents : codeContents.substring(startIndex, endIndex);
                } else {
                    return;
                }
            } else {
                selectedLines = false;
                evalLines = codeContents;
            }
            // provide feedback that the commands been sent
            $('#evalCode').animate({ 'border-color': '#d2691e' }, 200, function() {
                $('#evalCode').animate({ 'border-color': ['blue', 'green', 'red'][evalMode] }, 200);
            });

            $(['#wholeSnippetDV', '#lineSnippetDV'][+selectedLines]).toggleClass("highlight", 300).toggleClass("highlight", 500);

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
                    setTimeout(function() { jsAndJSXCallBack(undefined, result, evalLines, codeContents, pos, selectedLines); }, 0);
                } else if (evalMode === 1) {
                    result = jsx.eval(evalLines, function(e, r) { jsAndJSXCallBack(r, e, evalLines, codeContents, pos, selectedLines); }, true);
                } else if (evalMode === 2) {
                    setTimeout(function() { shell(evalLines, codeContents, pos); }, 0);
                }
            } catch (err) {
                setTimeout(function() { jsAndJSXCallBack(err.stack.replace(/.+?(\d+):(\d+)\)[\n\r][^\u0800]+/, (err instanceof SyntaxError) ? '' : ' (Line $1 Column $2)'), undefined, evalLines, codeContents, pos, selectedLines); }, 0);
            }
        }
    }; // end of evalOnEnter

    var jsAndJSXCallBack, resultModeRB, timeStampCB;
    resultModeRB = $('#resultModeRB');
    timeStampCB = $('#timeStampCB');
    jsAndJSXCallBack = function(error, execResult, evalLines, codeContents, pos, selectedLines) {
        var includeTimeStamp, modes,
            CmdCSS, ErrCSS, resultCSS;
        includeTimeStamp = true;
        includeTimeStamp = timeStampCB.is(':checked');
        if (pos !== undefined) {
            $('#evalCode').val(codeContents);
            $('#evalCode').selection('setPos', pos);
        }
        // provide feedback the the script run
        $('#evalResult').animate({ 'border-color': ['blue', 'green', 'red'][evalMode] }, 200, function() {
            $('#evalResult').animate({ 'border-color': '#d2691e' }, 200);
        });
        CmdCSS = (evalMode) ? 'background:#DDFFDD;' : 'background:#DDDDFF;';
        resultCSS = (evalMode) ? 'background:#F5FFF5;border-bottom:green solid 1px;' : 'background:#F5F5FF;border-bottom:blue solid 1px;';
        ErrCSS = (evalMode) ? 'background:#DFD;font-weight:800;border:red dotted 1px;' : 'background:#DDF;font-weight:800;border:red dotted 1px;';
        modes = ['JS', 'JSX', 'SHELL'];
        if (evalMode === 1 && /^[^\n\r]*?Error/i.test(execResult.substring(0, 200))) {
            // The jsx eval mode will not provide and official error
            // This should work for the Brits :-)
            // At worst the error will not be red
            error = execResult;
            execResult = undefined;
        }
        if (options.showSnippet || selectedLines) {
            __log(evalLines.replace(/^\s+/, ''), CmdCSS);
        }

        if (error) { __error(error, ErrCSS); }
        if (execResult) { __log(execResult, resultCSS); }
        $("#evalResult").animate({
            scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
        }, 100);
    }; // end of jsAndJSXCallBack


    $('#evalCode').keypress(function(key) {
        evalOnEnter(key);
    });


    ///////////////////
    // Shell Console //
    ///////////////////

    var spawn = require('child_process').spawn;
    var shell = isMac ? function(command, codeContents, pos) { // Mac
            // provide feedback that the commands been sent
            $('#evalCode').animate({ 'border-color': '#d2691e' }, 200, function() {
                $('#evalCode').animate({ 'border-color': 'red' }, 200);
            });
            if (pos !== undefined) {
                $('#evalCode').val(codeContents);
                $('#evalCode').selection('setPos', pos);
            }
            if (!command) { return; }
            var terminal, _cwd, CmdCSS, ErrCSS, resultCSS;

            CmdCSS = 'background:#FFDDDD;';
            resultCSS = 'background:#FFF5F5;';
            ErrCSS = 'background:#FDD;font-weight:800;border:red dotted 1px;';
            __log(cwd + '$ ' + command, CmdCSS);
            try {
                terminal = spawn('/bin/bash', ['-c', command + '\necho "$PWD SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf"'], {
                    cwd: cwd,
                    maxBuffer: 10000 * 1024,
                    encoding: 'utf-8'
                });
            } catch (err) {
                __error(err, ErrCSS);
            }

            terminal.stdout.on('data', function(data) {
                _cwd = /[^\r\n]*?(?= *SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf)/.exec(data);
                if (_cwd) {
                    cwd = '' + _cwd;
                    $('#pwd').text(cwd);
                    data = ('' + data).substr(0, _cwd.index);
                    data = data.replace(/SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf/, '');
                    __log(data, resultCSS);
                    __log(cwd + '$', CmdCSS + 'border-bottom:red solid 1px;');
                } else {
                    __log('' + data, resultCSS);
                }
            });
            terminal.stderr.on('data', function(data) {
                __error(data, ErrCSS);
            });
            // provide feedback the the script run
            $('#evalResult').animate({ 'border-color': 'red' }, 200, function() {
                $('#evalResult').animate({ 'border-color': '#d2691e' }, 200);
            });
        } :
        function(command, codeContents, pos) { // Windows
            if (pos !== undefined) {
                $('#evalCode').val(codeContents);
                $('#evalCode').selection('setPos', pos);
            }
            // provide feedback that the commands been sent
            $('#evalCode').animate({ 'border-color': '#d2691e' }, 200, function() {
                $('#evalCode').animate({ 'border-color': 'red' }, 200);
            });
            var terminal, n, l, _cwd, CmdCSS, ErrCSS, resultCSS;

            CmdCSS = 'background:#FFDDDD;';
            resultCSS = 'background:#FFF5F5;';
            ErrCSS = 'background:#FDD;font-weight:800;border:red dotted 1px;';

            if (!command) { return; }
            command = command.split(/[\n\r]/);
            terminal = spawn('cmd', ['/K'], {
                timeout: 0,
                cwd: cwd.replace(/>$/, ''),
                maxBuffer: 10000 * 1024,
                encoding: 'utf-8'
            });

            // For powershell we would go along the lines of
            // terminal = spawn('powershell', [command + '; Write-Host $PWD'], { maxBuffer: 52428800, cwd: cwd });


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Don't think we need to set these if we set the encoding ;-?                                                          //
            // Windows is real dumb with unicode one can set the page encoding using chcp 65001                                      //
            // One can also do some registry hacks                                                                                  //
            // see https://stackoverflow.com/questions/14109024/how-to-make-unicode-charset-in-cmd-exe-by-default/18439832#18439832 //
            // I'm not going to do them for you!                                                                                    //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            terminal.stdin.setEncoding = 'utf-8';
            terminal.stdout.setEncoding = 'utf-8';
            terminal.stderr.setEncoding = 'utf-8';

            l = command.length;
            for (n = 0; n < l; n++) {
                terminal.stdin.write(new Buffer(command[n] + '\n'));
            }
            terminal.stdin.write(new Buffer('echo SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf\n')); // ;-}

            terminal.stdout.on('data', function(data) {
                _cwd = /[^\r\n]*?(?=echo SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf)/.exec(data);
                if (_cwd) {
                    cwd = '' + _cwd;
                    $('#pwd').text(cwd);
                    data = ('' + data).substr(0, _cwd.index);
                    data = data.replace(/SomeUnlikelyCombinationHereKsHlsdgKLJHKsetnlksdfuBIKgsprdyhoNOUYWQERFGHNiosdf/g, '');
                    __log(data, resultCSS);
                    terminal.kill();
                    __log(cwd, CmdCSS + 'border-bottom:red solid 1px;');
                } else {
                    __log('' + data, resultCSS);
                }
            });
            terminal.stderr.on('data', function(data) {
                __error(data, ErrCSS);
            });
            // provide feedback the the script run
            $('#evalResult').animate({ 'border-color': '#F00' }, 200, function() {
                $('#evalResult').animate({ 'border-color': '#d2691e' }, 200);
            });
            // terminal.on('exit', function(code) {
            // __log('child process exited with code ' + code);
            // });
        }; // end of shell


    //////////////////////////////////////////////////////////
    // Sends the code to be run by JS, JSX or Shell engines //
    //////////////////////////////////////////////////////////

    var evalCode = function() {

        var codeContents, result;
        // provide feedback that the commands been sent
        $('#evalCode').animate({ 'border-color': '#d2691e' }, 200, function() {
            $('#evalCode').animate({ 'border-color': ['blue', 'green', 'red'][evalMode] }, 200);
        });
        $('#wholeSnippetDV').toggleClass("highlight", 300).toggleClass("highlight", 500);
        codeContents = $('#evalCode').val();
        try {
            if (evalMode === 0) {
                result = eval(codeContents);
                setTimeout(function() { jsAndJSXCallBack(undefined, result, codeContents); }, 0);
            } else if (evalMode === 1) {
                jsx.eval(codeContents, function(e, r) { jsAndJSXCallBack(r, e, codeContents); }, true);
            } else if (evalMode === 2) {
                shell(codeContents);
            }
        } catch (err) {
            setTimeout(function() { jsAndJSXCallBack(err.stack.replace(/.+?(\d+):(\d+)\)[\n\r][^\u0800]+/, (err instanceof SyntaxError) ? '' : ' (Line $1 Column $2)'), undefined, codeContents); }, 0);
        }
    }; // end of evalCode

    $("#EVAL").click(evalCode);

    ////////////////////////////////////////////////////////
    // Setup some helper functions for use in the console //
    ////////////////////////////////////////////////////////
    Jfy = JSON.stringify;


    __log = function(message, style, __class) {
        var evalResult = $("#evalResult");
        if (message === undefined) { return; }
        if (typeof message === 'object') { message = Jfy(message); }
        __class = __class ? ' ' + __class : '';
        style = style || '';
        $(`<p class="__pre${__class}" style="${style}"></p>`).appendTo(evalResult).text(message);
        $(evalResult).animate({
            scrollTop: $(evalResult)[0].scrollHeight - $(evalResult).height()
        }, 0);
    };
    __error = function(message, style) {
        __log(message, style, 'error');
    };
    __result = function(error, result, stderr) {
        var evalResult = $("#evalResult");
        if (error) {
            if (typeof error === 'object') { error = Jfy(error); }
            __error('Error: ' + error);
        }
        if (stderr) {
            if (typeof stderr === 'object') { stderr = Jfy(stderr); }
            __error('Stderr: ' + stderr);
        }
        if (result) {
            if (typeof result === 'object') { result = Jfy(result); }
            __log('Result: ' + result);
        }
        $(evalResult).animate({
            scrollTop: $(evalResult)[0].scrollHeight - $(evalResult).height()
        }, 0);
    };

    (function() {
        var evalResult = $("#evalResult");
        var write = function(message, style, __class, writeln) {
            if (message === undefined) { return; }
            __class = __class ? ' ' + __class : '';
            $(`<span style="${style}" class="__pre${__class}"></span>`).text(message).appendTo(evalResult);
            if (writeln) {
                $('<br>').appendTo(evalResult);
            }
            $(evalResult).animate({
                scrollTop: $(evalResult)[0].scrollHeight - $(evalResult).height()
            }, 0);

        };


        //////////////////////////////////////////////////////////////
        // Setup JSX __log interface and $.writeln $.write redirect //
        //////////////////////////////////////////////////////////////

        // jsx.file('__log.jsx', __log);
        // found a nasty bus in JSX.js and need to pass replacements:{} to get it to work :./ will try fix later
        jsx.file({ file: '__log.jsx', replacements: {}, eval: true });
        var jsxLog = function(data) {
            data = ('' + data.data).split(';;@;;:@#;');
            __log(data[0], data[1], data[2]);
        };

        var wl = function(data) {
            data = ('' + data.data).split(';;@;;:@#;');
            write(data[0], data[1], data[2], data[3]);
        };

        csInterface.addEventListener('com.creative-scripts.cstk.__log', jsxLog);
        csInterface.addEventListener('com.creative-scripts.cstk.writeln', wl);
    })();

    //////////////////////////////////////////////////////////////////////////
    // for executing scripts from the console and loading scripts on demand //
    // default path will be the js folder in the extensions folder          //
    // If the url starts with file then absolute url will be used           //
    // run('snippets/debugAppsList.js', 'f()');                             //
    //////////////////////////////////////////////////////////////////////////

    run = function(url, success, error, console) {
        if (typeof url === 'object') {
            success = url.success;
            error = url.error;
            console = url.console;
            url = url.url;
        }
        var s, e;
        if (!(/^file:/.test(url))) {
            // url = 'file:///' + path.join(__dirname, 'js', url);
            url = 'file:///' + path.join(url);
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
            if (console) {
                __result(e, s);
            }
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



    /*
        _________ _______  _______  _       _______
        \__   __/(  ___  )(  ___  )( \     (  ____ \
           ) (   | (   ) || (   ) || (     | (    \/
           | |   | |   | || |   | || |     | (_____
           | |   | |   | || |   | || |     (_____  )
           | |   | |   | || |   | || |           ) |
           | |   | (___) || (___) || (____/Y\____) |
           )_(   (_______)(_______)(_______|_______)

    */


    //////////////////
    // Open Folders //
    //////////////////

    // (function() {
    //     var extensions, n, l, template, html, setUpButtons;
    //     extensions = eval(window.__adobe_cep__.getExtensions());
    //     l = extensions.length;
    //     html = [];
    //     for (n = 0; n < l; n++) {
    //         html.push(`<div id="div${n}"><span id="base${n}" class="csButton blueButton">${extensions[n].name} - Open Folder</span></div>`);
    //     }

    //     setUpButtons = function(n) {
    //         $(`#base${n}`).click(function() {
    //             exec((isMac ? 'open "' : 'explorer "') + extensions[n].basePath + '"');
    //         });
    //     };
    //     for (n = 0; n < l; n++) {
    //         setUpButtons(n);
    //     }
    // })();

    $("#folders").hide();
    $("#SetWarning").hide();

    // $("#openFolders").tooltip({ content: "Show Extension Tools" }).mouseleave(function() { $('#openFolders').tooltip('close'); }).focusout(function() { $('#openFolders').tooltip('close'); });

    $("#openConsole").mousedown(function() {
        $('#refeshAppList').focus();
        $('#folders').hide();
        $('#console').show();
        $('#openConsole').hide();
        $('#openFolders').show();
        // $("#openFolders").tooltip("close");
    });
    $("#openFolders").mousedown(function() {
        $('#evalCode').focus();
        $('#console').hide();
        $('#folders').show();
        // $("#openFolders").tooltip("close");
        getCeps();
        searchForandAddDebugApps();
        $('#openFolders').hide();
        $('#openConsole').show();
    });

    // Using these for Icons
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
        $('#SetWarning').fadeOut(3500);
        // of now this will never happen!
        if (isMac && error) {
            $('#sudo').show();
        }
    };



    //////////////////////////////////////
    // Setup The debug application list //
    //////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////
    // Use Windows Search or Spotlight to search for instances of Chrome and cefclient //
    /////////////////////////////////////////////////////////////////////////////////////

    var windowsSearchCallBack, macSearchCallBack, windowsAddFileInfo, macAddFileInfo, debugAppSelectionFromCookie, d, addThisIfNotInArray, removeThisIfInArray, removeDropdownOption, addDropdownOption, selectDebugFile;
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // These functions use powershell to search the Windows index for Chrome and CefClient instances //
    // Found instances are filtered, the can be removed, non-found ones can be added manually        //
    // Basic app data is found, Version and Last Mod date                                            //
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    windowsSearchCallBack = function(err, result) {
        try {
            var apps, psGetItems, getItems, n, l, manDebugApps;
            apps = result.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
                .replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/ *[\n\r]+/) || [];
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
            } catch (err) {}
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
            exec(psGetItems, windowsAddFileInfo);
        } catch (err) {
            __log(err.stack);
            alert(err.stack);
        }
    }; // end of windowsSearchCallBack

    windowsAddFileInfo = function(err, result) {
        try {
            var paths, info, n, l, html, app, version, date, name, appSelection;
            result = result.split(/----+ +-----+ +-----+ *[\n\r]*/);
            paths = result[0] || '';
            info = result[1] || '';
            paths = paths.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
                .replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/ *[\n\r]+/);
            info = info.split(/ *[\n\r]+/);
            l = paths.length;
            html = [];
            for (n = 0; n < l; n++) {
                app = paths[n];
                name = app.match(/Chrome|CefClient/i);
                version = '' + (info[n].match(/^\S+/) || 'Unknown Version');
                date = new Date(info[l + n], info[l * 2 + n], info[l * 3 + n])
                    .toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                html.push(`<option value="${app}" title="${app + '<br>Last&nbsp;modified:&nbsp;' + date}">${name + ' (' + version})</option>`);

            }
            appSelection = $("#debugApps").val();
            $("#debugApps").html(html);
            if (appSelection && appSelection !== 'Please Wait') {
                $("#debugApps").val(appSelection);
                $("#debugApps").selectmenu('refresh');
                $('#debugAppsSP').tooltip({
                    content: 'Debug app: ' + appSelection,
                    show: { effect: "drop", duration: 250 },
                    hide: { effect: "drop", duration: 250 }
                }).mouseleave(function() { $('#debugAppsSP').tooltip('close'); }).focusout(function() { $('#debugAppsSP').tooltip('close'); });
                $('#debugAppsSP').tooltip('close');
            } else {
                debugAppSelectionFromCookie();
            }

        } catch (e) {
            // __log(e.stack);
            // alert(e.stack);
        }
    }; // end of windowsAddFileInfo


    //////////////////////////
    // Mac Spotlight Search //
    //////////////////////////

    macSearchCallBack = function(err, result) {
        try {
            var apps, fileList, cmd, n, l, manDebugApps;
            apps = result && result
                .replace(/^[\n\r]+/, '')
                .replace(/[\n\r]+$/, '')
                .split(/[\n\r]+/) || [];
            // Add some potential locations for Chrome as Spotlight search might only index the start folder
            // If they don't exists they will just be filtered out later by the Get-Item command.
            addThisIfNotInArray('/Applications/Google Chrome.app', apps);
            // At some point Chrome will change?

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
            fileList = '"' + apps.join('\u0800\u1800" "') + '\u0800\u1800"';
            cmd = 'stat ' + fileList.replace(/\u0800\u1800/g, '') + '; plutil -p ' + fileList.replace(/\u0800\u1800/g, '/Contents/Info.plist') + ' | grep CFBundleShortVersionString;';
            // __log(cmd);
            exec(cmd, macAddFileInfo);
        } catch (err) {
            __log(err.stack);
            alert(err.stack);
        }
    }; // end of macSearchCallBack

    macAddFileInfo = function(error, result) {
        try {
            var info, n, l, html, app, version, date, name;
            var stats, versions, fileCount;
            var statReg, versionReg, appSelection;
            result = result || '';
            result = result.replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
            result = result.split(/[\n\r]/);
            fileCount = result.length / 2;
            stats = result.slice(0, fileCount);
            versions = result.slice(fileCount);
            l = stats.length;
            statReg = /[^"]+"[^"]+" "([^"]+)" "[^"]+" "[^"]+" \d+ \d+ \d+ (\/.+)/;
            versionReg = / => "([^"]+)"$/;
            html = [];
            for (n = 0; n < l; n++) {
                info = statReg.exec(stats[n]);
                date = info && info[1];
                date = (date && new Date(date).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })) || '';
                app = (info && info[2]) || '';
                version = versionReg.exec(versions[n]);
                version = (version && version[1]) || '';
                name = app.match(/Chrome|CefClient/i);
                // html.push({path: path, modDate: date, version: version});
                html.push(`<option value="${app}" title="${app + '<br>Last&nbsp;modified:&nbsp;' + date}">${name + ' (' + version})</option>`);
            }
            html = html.join('\n');
            appSelection = $("#debugApps").val();
            $("#debugApps").html(html);
            if (appSelection) { $("#debugApps").val(appSelection); }
            // $("#debugApps").selectmenu('refresh');
            debugAppSelectionFromCookie();

        } catch (e) {
            __log(e.stack);
            // alert(e.stack);
        }
    }; // end of macAddFileInfo

    /////////////////////
    // Windows and Mac //
    /////////////////////

    debugAppSelectionFromCookie = function() {
        fs.readFile(debugAppSelection, function(err, result) {
            var r;
            if (result) {
                r = result = '' + result;
                result = result.replace(/\\/g, '\\\\');
                if ($("#debugApps option[value='" + result + "']").length) {
                    $('#debugApps').val(r);
                }
            }
            $("#debugApps").selectmenu('refresh');
        });
    };

    addDropdownOption = function(value) {

        var optionsHtml, appsArray, cmd, addPathAndVersion, name, version, contentUpdate;
        optionsHtml = $('#debugApps').html();
        // if the values already there then we can go home
        if (optionsHtml.indexOf(`"${value}"`) > -1) {
            return;
        }
        appsArray = optionsHtml.replace(/^[\s\n\r]+/).replace(/[\s\n\r]+$/).split(/[\n\r]/);
        addPathAndVersion = function(error, result) {
            __result(error, result);
            if (result) {
                result = result.replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
                name = result.match(/CefClient|Chrome/i);
                if (isMac) {
                    version = result.match(/[\n\r]+.+? => "([^"]+)"$/);
                    version = version && version[1];
                    contentUpdate = result.match(/[^"]+"[^"]+" "([^"]+)"/);
                    contentUpdate = contentUpdate && '' + new Date(contentUpdate[1]).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                } else {
                    result = result.split(/----+ +-----+ +-----+ *[\n\r]*/);
                    result = result[1] || '';
                    result = result.split(/ *[\n\r]+/);
                    version = '' + (result[0].match(/^\S+/) || 'Unknown Version');
                    contentUpdate = new Date(result[1], result[2], result[3])
                        .toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

                }
                appsArray.push(`<option value="${value.replace(/\\/g,'\\\\')}" title="${value + '<br>Last&nbsp;modified:&nbsp;' + contentUpdate}">${name + ' (' + version})</option>`);
                appsArray.sort();
                $('#debugApps').html(appsArray.join('\n'));
                $('#debugApps').val(value);
                $('#debugApps').selectmenu('refresh');
                fs.outputFile(debugAppSelection, value);
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
            cmd = `stat "${value}"; plutil -p "${value}/Contents/Info.plist" | grep CFBundleShortVersionString;`;
            // cmd = 'mdls "app"'.replace(/app/, '' + value);
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
        var appSelection = $('#debugApps').val();
        fs.outputFile(debugAppSelection, appSelection);
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

    searchForandAddDebugApps = function() {
        var cmd;
        if (isMac) {
            // use spotlight to find Chrome and Client instances
            cmd = 'mdfind \'kMDItemCFBundleIdentifier == "com.google.Chrome" || kMDItemCFBundleIdentifier == "org.cef.cefclient"\'';
            exec(cmd, macSearchCallBack);
        } else {
            // Access Windows search data base
            // This site was a big help https://www.petri.com/how-to-query-the-windows-search-index-using-sql-and-powershell
            cmd = `powershell "$connector = new-object system.data.oledb.oledbdataadapter -argument \\"SELECT System.ItemPathDisplay FROM SYSTEMINDEX WHERE CONTAINS (System.FileName, '\\"\\"Google Chrome\\"\\" OR Cefclient.exe')\\", \\"provider=search.collatordso;extended properties='application=windows';\\"; $dataset = new-object system.data.dataset; if ($connector.fill($dataset)) { $dataset.tables[0] }"`;
            exec(cmd, windowsSearchCallBack);
        }
    };


    $("#debugAddBT").click(selectDebugFile);
    $("#debugRemoveBT").click(removeDropdownOption);


    var launchDebug, openFolderApp;
    //var cstkFolder, defaultChromePath, debugAppSelection, debugAppFile, appSelection, openFolderApp, openFolderAppFile;
    // var cstkFolder, defaultChromePath, debugAppSelection, debugAppFile, appSelection, openFolderApp, openFolderAppFile;

    fs.readFile(openFolderAppFile, function(err, result) {
        var baseName, defaultApp;
        defaultApp = isMac ? "Finder" : "Windows Explorer";
        if (err) {
            $('#openFolderApp').text(defaultApp);
            openFolderApp = false;
        } else {
            openFolderApp = '' + result;
            try {
                fs.statSync(openFolderApp);
                baseName = openFolderApp.match(/[^\/\\]+$/);
                baseName = baseName && ('' + baseName).replace(/\.[^\.]+$/, '');
                $('#openFolderApp').text(baseName || defaultApp);
            } catch (e) {
                $('#openFolderApp').text(defaultApp);
                openFolderApp = false;
            }
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
        $('#openFolderApp').text(('' + openFolderApp.match(/[^\/\\]+$/)).replace(/\.[^\.]+$/, ''));
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
        exec((isMac ? 'open "' : 'explorer "') + 'https://github.com/Trevor-/CSTK#readme"');
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



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function gets all the active CEPHTMLEngine processes with info on PIDs and command line calls    //
    // The results are sent to the getDebugPorts function which checks if debug ports are being listened to  //
    // This can be done by comparing the PIDs with the active ports, Info is extracted from the command line //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCeps = isMac ? function() {
            exec('ps ax | grep "CEPHtmlEngine.app"', getDebugPorts);
        } :
        function() { // Windows
            var powershell = 'powershell "Get-WmiObject win32_process -Filter \\"name=\'CEPHTMLEngine.exe\'\\" handle, commandLine"';
            exec(powershell, function(e, r) {
                if (e) {
                    __error('getCeps powershell error: ' + e + "\u2757");
                }
                r = r.replace(/[\r\n]\s{15,}/g, '').replace(/[\n\r]+Handle +:/g, '').match(/CommandLine[^\r\n]+/g);
                // log(r, 'v', 'ping')
                getDebugPorts(e, r);
            });
        }; // end of getCeps

    ///////////////////////////////////////////////////////////
    // Get active debug ports so they can easily be accessed //
    ///////////////////////////////////////////////////////////
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
                log(e.stack, 'e');
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
                    if (!render) { continue; }
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
            }
        }; // end of processCeps



    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Shows Info on the extensions with buttons to open extension folders, logs and debug ports //
    ///////////////////////////////////////////////////////////////////////////////////////////////
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
                exec(isMac ? `open "${folder}"` : `Explorer.exe "${folder}"`);
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
            html.push(` <div style="font-size:.7em;">
                                <img src="../img/Forum_Icons/${appMap[extension.appCode] ? extension.appCode : 'CLOD'}.png" style="height:22px;top:4px;position: relative;padding-right:4px;" />
                                <span>${extension.appVersion}</span>
                                <span> ${extension.id} ${((extension.name && (extension.name !== extension.id)) ? ` - [${extension.name}]` : '')}
                                </span>
                                <img src="../img/${extension.active ? 'green' : 'red'}LED.png" style="top:0px;position: relative;padding:0 4px 0 4px;"/>
                                <span class="csButton blueButton" id="OpenFolder_${n}" title="Click to open with ${(isMac ? 'Finder' : 'Explorer')}.<br>SHIFT click to open with selected application."> Open Folder</span>
                                <span class="csButton blueButton" id="OpenLog_${n}" title="Open the extension's main log<br>(IF IT EXISTS)"> Open Log<span style="font-size:.7em;">${extension.logLevel ? ' ' + extension.logLevel : ''}</span></span>
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
                        setUI(false, false, 'Opening extension directory');
                        exec((isMac ? 'open "' : 'explorer.exe "') + extension.dirName + '"');
                    }
                });
            }
            if (extension.log) {
                $('#OpenLog_' + n).click(function() {
                    fs.stat(extension.log, function(err) {
                        if (err) {
                            setUI(false, false, "The log file couldn't be opened, It probably doesn't exist");
                            return;
                        }
                        setUI(false, false, 'Opening Log');
                        exec((isMac ? 'open "' : 'explorer "') + extension.log + '"');
                    });
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
        // $('#folderBody').text('Please wait a few (upto 10) seconds for the apps to be processed');
        searchForandAddDebugApps();
        getCeps();
    });


    ///////////////////////////////////////////
    // Set and Get LogLevel and Debug Values //
    ///////////////////////////////////////////

    $(document).ready(function() {
        var appSelection;
        $('#SetWarning').hide();
        var $log, $cep, $debug, $debugA, getValue, processValue, setValue, cep;

        $debugA = $("#debugApps");
        $log = $("#logLevel");
        $debug = $("#debugLevel");
        $cep = $("#cepVersion");

        $debugA.selectmenu({
            change: function() {
                appSelection = $('#debugApps').val();
                fs.outputFile(debugAppSelection, appSelection, function() {});
                if (appSelection) {
                    $('#debugAppsSP').tooltip({
                        content: 'Debug app: ' + appSelection,
                        show: { effect: "drop", duration: 250 },
                        hide: { effect: "drop", duration: 250 }
                    }).mouseleave(function() { $('#debugAppsSP').tooltip('close'); }).focusout(function() { $('#debugAppsSP').tooltip('close'); });
                    $('#debugAppsSP').tooltip('close');
                    // $("#openFolders").tooltip({ content: "Show Extension Tools" }).mouseleave(function() { $('#openFolders').tooltip('close'); }).focusout(function() { $('#openFolders').tooltip('close'); });

                    // the tooltip had problems :-/
                    // $('#debugApps-button')
                    //     .attr('title',
                    //      $("#debugApps option[value='_VALUE_']".replace(/_VALUE_/, appSelection)).attr('title')
                    //     );
                    //////////////////////////////////////////////////////////////////////////////////////////////////
                    // IF SOMEONE CAN GET THE TOOLTIP TO WORK PROPERLY ON SEND A PULL REQUEST                       //
                    // as of now the tool tip is only on the individual select options                              //
                    // The general select option widget does not have a tooltip                                     //
                    // The problem might have been OS specific so please make sure it works on both Windows and Mac //
                    //////////////////////////////////////////////////////////////////////////////////////////////////
                    // setUI(false, false, 'The default debug app has been set to <br>' + appSelection);
                } else {
                    appSelection = '';
                }
            },
            position: { collision: "flip" }
        });


        $log.selectmenu({
            change: function() {
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
                $debug.selectmenu('refresh');
            }
        };

        // sets the CEP debugPlayerMode and logLevels
        setValue = function(key, value, cep) {
            var command;
            command = isMac ? 'defaults write com.adobe.CSXS._CEP_.plist _KEY_ _VALUE_ && killall -u `whoami` cfprefsd' :
                'reg add HKEY_CURRENT_USER\\SOFTWARE\\Adobe\\CSXS._CEP_ /t REG_SZ /v _KEY_ /d _VALUE_ /f';
            command = command.replace(/_CEP_/, '' + cep).replace(/_KEY_/, '' + key).replace(/_VALUE_/, '' + value);
            exec(command, function(err, result) {
                setUI(err, result);
            });
        };

        // gets the CEP debugPlayerMode and logLevels
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

        // Not implemented

        // $('#sudoEnter').click(function() {
        //     var command, password;
        //     password = $('#sudoText').val();
        //     if (!password) {
        //         return;
        //     }
        //     command = 'echo _PASSWORD_ | sudo -S killall cfprefsd'.replace(/_PASSWORD_/, password);
        //     $('#sudoText').val('');

        //     exec(command);
        //     $('#sudo').hide();
        // });
        // $('#sudoClose').click(function() {
        //     $('#sudo').hide();
        // });
        // $('#sudo').hide();

        searchForandAddDebugApps();
        getCeps();
    });

})();