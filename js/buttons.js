/* global jsx, window, process */
/* jshint undef:true, unused:true, evil: true, esversion:6 */

////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var exec, csInterface, isMac, __dirname, evalMode, path;
    csInterface = new CSInterface();
    exec = require('child_process').exec;
    isMac = process.platform[0] === 'd'; // [d]arwin
    __dirname = csInterface.getSystemPath(SystemPath.EXTENSION);
    path = require('path');

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


    //////////////////
    // Open Folders //
    //////////////////

    (function() {
        var extensions, n, l, template, html;
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
        html = html.join('\n');
        $("#folders").html(
            '<div id="folderDiv" class="collapsed leftBlock" style="padding:0px 4px 0 14px;">' +
            html +
            '</div>'
        );


        function setUpButtons(n) {
            var id = function(key) {
                return '#' + key + n;
            };
            $(id('base')).click(function() {
                exec((isMac ? 'open "' : 'start "" "') + extensions[n].basePath + '"');
            });

        }
        for (n = 0; n < l; n++) {
            setUpButtons(n);
        }

    })();

    $("#openFolders").click(function() {
        if ($('#console').attr('class') === 'expanded') {
            $('#folderDiv').removeClass("collapsed").addClass("expanded");
            $('#console').removeClass("expanded").addClass("collapsed");
            $("#openFolders").text('Show Console');
            $("#openFolders").addClass("blueButton");
        } else {
            $('#console').removeClass("collapsed").addClass("expanded");
            $('#folderDiv').removeClass("expanded").addClass("collapsed");
            $("#openFolders").text('Show All Extensions Folders');
            $("#openFolders").removeClass("blueButton");
        }
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
            // window.location.href = path.join(__dirname, "/html/index.html");
            window.location.href = '/Library/Application Support/Adobe/CEP/extensions/CSTK/html/index.html';
        } catch (e) {
            // window.location.href = path.join(__dirname, "/html/index.html");
            window.location.href = '/Library/Application Support/Adobe/CEP/extensions/CSTK/html/index.html';
        }
    });

    $('.label').click(function() {
        $(this).prev('input:checkbox').attr('checked', true).change(); // Manually trigger the change event
        $(this).prev('input:radio').attr('checked', true).change(); // Manually trigger the change event
    });

    $("#ext").click(function() {
        jsx.eval("new File('" + csInterface.getSystemPath(SystemPath.EXTENSION) + "').execute();");
    });


})();
