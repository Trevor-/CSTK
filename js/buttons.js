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

    ///////////////////////////////////////////
    // Set and Get LogLevel and Debug Values //
    ///////////////////////////////////////////

    $(document).ready(function() {
        {
            $('#SetWarning').hide();
            var $log, $cep, $debug, getValue, processValue, setValue, cep, setUI;
            $log = $("#logLevel").prettyDropdown({
                height: 29,
                classic: true
            });
            $debug = $("#debugLevel").prettyDropdown({
                height: 29,
                classic: true
            });
            $cep = $("#cepVersion").prettyDropdown({
                height: 29,
                classic: true
            });

            processValue = function(key, value) {
                if (!isMac) value = value.replace(/\s/g, '').match(/\d+$/);
                if (key === 'LogLevel') {
                    $("#logLevel").val('' + (value ? +value : 7));
                    $log.refresh();
                } else if (key === 'PlayerDebugMode') {
                    $("#debugLevel").val('' + (value ? +value : 2));
                    $debug.refresh();
                }
            };

            setUI = function(error, result, warning) {
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
                    processValue(key, result);
                });
            };

            cep = csInterface.getCurrentApiVersion().major;
            $("#cepVersion").val(cep);
            $cep.refresh();
            getValue('LogLevel', cep);
            getValue('PlayerDebugMode', cep);
            $("#cepVersion").change(function() {
                var cep = '' + $("#cepVersion").val();
                getValue('LogLevel', cep);
                getValue('PlayerDebugMode', cep);
                setUI(false, false, 'REMEMBER to click SET to apply the changes');
            });
            $("#logLevel").change(function() {
                setUI(false, false, 'REMEMBER to click SET to apply the changes');
            });
            $("#debugLevel").change(function() {
                setUI(false, false, 'REMEMBER to click SET to apply the changes');
            });
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
            '<div id="folderDiv" class="leftBlock" style="padding:0px 4px 0 14px;">' +
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

    $("#folders").hide();

    $("#openFolders").click(function() {
        if ($('#folders').is(":visible")) {
            $('#folders').hide();
            $("#openFolders").text('Show All Extensions Folders');
            $("#openFolders").removeClass("blueButton");
            $('#console').show();
        } else {
            $('#console').hide();
            $("#openFolders").text('Show Console');
            $("#openFolders").addClass("blueButton");
            $('#folders').show();
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

    ///////////////////////
    // Open Chrome Debug //
    ///////////////////////

    // exec('mdfind kMDItemCFBundleIdentifier == "com.google.Chrome"', function(e,r){alert(r)})

    (function() {
        var a;
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
        wmic path Win32_Process get handle, CommandLine /format:list
        wmic path Win32_Process get Caption, handle, CommandLine /format:list
        >wmic.exe path Win32_Process where Name='CEPHtmlEngine.exe' get handle, commandline  /format:list
        this will list all processes in the form
        wmic.exe path Win32_Process where handle='27864'  get CommandLine /format:list
        CommandLine="C:\Program Files\Adobe\Adobe Illustrator CC 2017\Support Files\Contents\Windows\CEPHtmlEngine\CEPHtmlEngine.exe" "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\html\index.html" ebc0f56f-0838-4e23-acc0-1418483c4bdb 24796 ILST 21.0.0 com.creative-scripts.cstk.1 3 "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK" "illustrator" 1 WyItLWVuYWJsZS1ub2RlanMiLCItLW1peGVkLWNvbnRleHQiXQ== en_IL 4293980400 100
        Handle=27864
        We then have access to the app running the extension and the extensions id and pid and then can see if it's got a debug port
        Mac -
        ps ax | grep "CEPHtmlEngine.app"
        1042   ??  S      0:44.47 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/MacOS/CEP/CEPHtmlEngine/CEPHtmlEngine.app/Contents/MacOS/CEPHtmlEngine 74f9081c-9da3-4a7b-a6ab-cbeb77c9201b 2f40fe61-5f68-452b-b710-2ae80398cab5 IDSN 13.0 com.adobe.ccx.start 1 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start 64 WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= en_IL 100 -4671304
        1047   ??  S      0:34.99 /Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/MacOS/CEP/CEPHtmlEngine/CEPHtmlEngine.app/Contents/Frameworks/CEPHtmlEngine Helper.app/Contents/MacOS/CEPHtmlEngine Helper --type=gpu-process --no-sandbox --lang=en --log-file=/Users/Trevor/Library/Logs/CSXS/CEPHtmlEngine8-IDSN-13.0-com.adobe.ccx.start.log --log-severity=error --params_ppid=IDSN --params_ppversion=13.0 --params_extensionid=com.adobe.ccx.start --params_loglevel=1 --params_serverid=74f9081c-9da3-4a7b-a6ab-cbeb77c9201b --params_clientid=2f40fe61-5f68-452b-b710-2ae80398cab5 --node-module-dir=/Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start --params_commandline=WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= --supports-dual-gpus=false --gpu-driver-bug-workarounds=0,1,10,23,25,36,39,47,53,61,63,64,65,66,68,73,74,76,84,85,86,89,92 --disable-gl-extensions=GL_KHR_blend_equation_advanced GL_KHR_blend_equation_advanced_coherent --gpu-vendor-id=0x8086 --gpu-device-id=0x0166 --gpu-driver-vendor --gpu-driver-version --gpu-driver-date --gpu-active-vendor-id=0x8086 --gpu-active-device-id=0x0166 --lang=en --log-file=/Users/Trevor/Library/Logs/CSXS/CEPHtmlEngine8-IDSN-13.0-com.adobe.ccx.start.log --log-severity=error --params_ppid=IDSN --params_ppversion=13.0 --params_extensionid=com.adobe.ccx.start --params_loglevel=1 --params_serverid=74f9081c-9da3-4a7b-a6ab-cbeb77c9201b --params_clientid=2f40fe61-5f68-452b-b710-2ae80398cab5 --node-module-dir=/Applications/Adobe InDesign CC 2018/Adobe InDesign CC 2018.app/Contents/Resources/CEP/extensions/com.adobe.ccx.start --params_commandline=WyItLW5vZGVqcy1kaXNhYmxlZCIsIi0taGlnaC1kcGktc3VwcG9ydD0xIiwiLS1kaXNhYmxl^M\012LXBpbmNoIl0= --service-request-channel-token=4E49BF968C83CB109A581C3F6134E422
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

    if (isMac) {
        var getCeps, getDebugPorts, processCeps;


        processCeps = function(err, cepPorts, cepProcesses) {
            // definitely lacking error checking!
            // TODO add error checking! 
            try {
                var l, n, params_serverids, cepProcess, params_serverid, cepPid, pidMap, portMap, port, portUrl, extension, extensions, hostExtensions, hostExtensionsMap;
                params_serverids = {};
                pidMap = {};
                portMap = {};
                hostExtensionsMap = {};
                extensions = [];
                hostExtensions = window.__adobe_cep__.getExtensions().split('"id":');
                cepProcesses = cepProcesses && cepProcesses.split(/[\n\r]/);
                cepPorts = cepPorts && cepPorts.split(/[\n\r]/);
                l = cepProcesses.length;
                for (n = 0; n < l; n++) {
                    cepProcess = cepProcesses[n];
                    if (/--type=renderer/.test(cepProcess)) {
                        // renderer_helpers.push(cepProcess);
                        params_serverid = cepProcess.match(/--params_serverid=(\S+)/);
                        params_serverid = params_serverid && params_serverid[1];
                        if (params_serverid) {
                            cepPid = '' + cepProcess.match(/\d+/);
                            if (params_serverids[params_serverid]) {
                                params_serverids[params_serverid].renderer = cepProcess;
                                params_serverids[params_serverid].renderPid = cepPid;
                            } else {
                                params_serverids[params_serverid] = { renderer: cepProcess, renderPid: cepPid };
                            }
                        }
                        continue;
                    }
                    if (/--type=gpu-process/.test(cepProcess)) {
                        params_serverid = cepProcess.match(/--params_serverid=(\S+)/);
                        params_serverid = params_serverid && params_serverid[1];
                        if (params_serverid) {
                            cepPid = '' + cepProcess.match(/\d+/);

                            if (params_serverids[params_serverid]) {
                                params_serverids[params_serverid].gpuPid = cepPid;
                            } else {
                                params_serverids[params_serverid] = { gpuPid: cepPid };
                            }
                        }
                        continue;
                    }
                    // CEPHtmlEngine.app/Contents/MacOS/CEPHtmlEngine
                    params_serverid = cepProcess.match(/CEPHtmlEngine.app\/Contents\/MacOS\/CEPHtmlEngine (\S+)/);
                    params_serverid = params_serverid && params_serverid[1];
                    if (params_serverid) {
                        cepPid = '' + cepProcess.match(/\d+/);
                        pidMap[cepPid] = params_serverid;
                        if (params_serverids[params_serverid]) {
                            params_serverids[params_serverid].cepPid = cepPid;
                        } else {
                            params_serverids[params_serverid] = { cepPid: cepPid };
                        }
                    }
                }

                // we now have a useful map of the 3 separate cep processes for each extension and of the main PIDs to server ids
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

                var extName, basePath, hostExt;
                l = hostExtensions.length;
                for (n = 0; n < l; n++) {
                    hostExt = hostExtensions[n];
                    basePath = hostExt.match(/"basePath":"([^"]+)/);
                    basePath = basePath && basePath[1];
                    extName = hostExt.match(/"name":"([^"]+)/);
                    extName = extName && extName[1];
                    hostExtensionsMap[basePath] = extName;
                }

                // alert(JSON.stringify(hostExtensionsMap));
                // now we can go through the params_serverids map and extract some useful data
                var ext, info, render;
                for (extension in params_serverids) {
                    // extensions
                    extension = params_serverids[extension];
                    // alert(JSON.stringify(extension))
                    render = extension.renderer;
                    ext = {};
                    // Adobe app
                    info = render.match(/\/.+?\.app/);
                    ext.app = info && info[0].match(/\/([^\/]+?)\/[^\/]+$/)[1];
                    // app code
                    ext.appCode = render.match(/--params_ppid=(.+?) --/)[1];
                    // app version
                    ext.appVersion = render.match(/--params_ppversion=(.+?) --/)[1];
                    // extension id
                    ext.id = render.match(/--params_extensionid=(.+?) --/)[1];
                    // --node-module-dir - dirName
                    ext.dirName = render.match(/--node-module-dir=(.+?) --/)[1];
                    if (hostExtensionsMap[ext.dirName]) {
                        ext.name = hostExtensionsMap[ext.dirName];
                    }
                    // logFile
                    ext.log = render.match(/--log-file=(.+?) --/)[1];
                    // logFile
                    ext.log = render.match(/--log-file=(.+?) --/)[1];
                    // logLevel and severity
                    ext.logLevel = render.match(/--params_loglevel=(.+?) --/)[1] + ' - ' + render.match(/--log-severity=(.+?) --/)[1];
                    ext.cepPid = extension.cepPid;
                    ext.renderPid = extension.renderPid;
                    ext.gpuPid = extension.gpuPid;
                    // debugPort
                    info = portMap[ext.cepPid];
                    ext.debugPort = info;
                    // commandLine Parameters
                    info = render.match(/--type=renderer (.+?) --primordial-pipe-token/);
                    info = info && info[1].split(/ /);
                    ext.commandLineParameters = info;
                    // Lang
                    ext.lang = render.match(/--lang=(.+?) --/)[1];
                    // do PIDs
                    extensions.push(ext);
                }


                alert(JSON.stringify(extensions));
                // alert('cepPorts:' + cepPorts);
            } catch (e) {
                alert(e.stack);
            }
        };

        getDebugPorts = function(err, cepProcesses) {
            exec('lsof -PiTCP -sTCP:LISTEN | grep CEPHtmlEn', function(err, result) {
                processCeps(err, result, cepProcesses);
            });
        };

        getCeps = function() {
            exec('ps ax | grep "CEPHtmlEngine.app"', getDebugPorts);
        };

        getCeps();
    }

})();
