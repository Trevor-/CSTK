// C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\js\debug.js
/* globals exec, log, csInterface, path, fs, os, isMac, jsx */
(function() {
    var launchDebug, selectDebugFile, addDropdownOption, spotLight, removeDropdownOption;
    var cstkFolder, defaultChromePath, cookieFile, debugAppFile, appSelection, openFolderApp, openFolderAppFile;
    var dummy;

    defaultChromePath = isMac ? '/Applications/Google Chrome.app' : 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
    cstkFolder = path.join(csInterface.getSystemPath('userData'), 'Creative Scripts', 'CSTK');
    debugAppFile = path.join(cstkFolder, 'debugAppsList.txt');
    cookieFile = path.join(cstkFolder, 'debugAppSelection.txt');
    openFolderAppFile = path.join(cstkFolder, 'OpenFolderApp.txt');

    dummy = function(err) {
        // this function might be needed at some point to stop asynchronous node functions throwing errors
        // because no callback has been provided
        // this would be more according to the letter than the spirit of the law ;-{
        if (err) {
            log(err.stack, 'e');
        }
    };

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
        var selectFileCallBack = function(newApp) {
            if (newApp === '' || newApp === 'null' || newApp === 'undefined') {
                return;
            }
            openFolderApp = newApp;
            $('#openFolderApp').text('' + openFolderApp.match(/[^\/\\]+$/));
            fs.outputFile(openFolderAppFile, openFolderApp, function() {});
        };
        jsx.evalFile("fileDialog.jsx", {
                baseFolder: '/Applications',
                message: "Please select an application for opening Folders shift clicking"
            },
            selectFileCallBack);
    });

    ///////////////////////////////////////////
    // Set and Get LogLevel and Debug Values //
    ///////////////////////////////////////////

    $(document).ready(function() {
        {
            $('#SetWarning').hide();
            var $log, $cep, $debug, $debugA, getValue, processValue, setValue, cep, setUI;

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
                }
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
                    // $log.refresh();
                    $log.selectmenu('refresh');
                } else if (key === 'PlayerDebugMode') {
                    $("#debugLevel").val('' + (value ? +value : 2));
                    $log.selectmenu('refresh');
                    // $log.refresh();
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
                    if (err) {
                        log('getValue error: ' + err, 'e', 'ping');
                    }
                    processValue(key, result);
                });
            };

            cep = csInterface.getCurrentApiVersion().major;
            $("#cepVersion").val(cep);
            // $cep.refresh();
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
        // kMDItemFSContentChangeDate

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

    var getCeps, getDebugPorts, processCeps, appMap, appName, app, appId,
        appLocale, appVersion, logFile, extId, displayExtensions, setUpButtons;

    appMap = {
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
    app = csInterface.getHostEnvironment();
    appId = app.appId;
    appVersion = app.appVersion;
    appName = csInterface.getSystemPath('hostApplication').match(/Adobe[^\/\\]+/);
    appLocale = app.appLocale;
    extId = csInterface.getExtensionID();
    logFile = os.tmpdir() + '\\CEPHtmlEngine__CEPMAJOR__-__APPID__-__APPVERSION__-__EXTID__.log'
        .replace('__CEPMAJOR__', csInterface.getCurrentApiVersion().major)
        .replace('__APPID__', appId).replace('__APPVERSION__', appVersion);


    if (isMac) {
        getCeps = function() {
            exec('ps ax | grep "CEPHtmlEngine.app"', getDebugPorts);
        };

        getDebugPorts = function(err, cepProcesses) {
            exec('lsof -PiTCP -sTCP:LISTEN | grep CEPHtmlEn', function(err, result) {

                processCeps(err, result, cepProcesses);
            });
        };

        processCeps = function(err, cepPorts, cepProcesses) {
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
        };
    }


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
            if (a.id.toLowerCase() < b.id.toLowerCase()) {
                return -1;
            }
            if (a.id.toLowerCase() > b.id.toLowerCase()) {
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
        } // /Users/Trevor/Documents/SDKs/CEP-Resources/CEP_7.x/cefclient.app/Contents/MacOS/cefclient

        var $debugTool;
        $debugTool = $("#debugTool").prettyDropdown({
            height: 29,
            classic: true
        });
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
                    // log('open "__FILE__"'.replace(/__FILE__/, '' + extension.log));
                    exec('open "__FILE__"'.replace(/__FILE__/, '' + extension.log));
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

    spotLight = function() {
        try {
            var spotlightCallBack = function(error, result) {
                var debugApps;
                debugApps = result && result
                    .replace(/^[\n\r]+/, '')
                    .replace(/[\n\r]+$/, '')
                    .split(/[\n\r]+/);
                appsFromFile(debugApps);
                // addDropdownOption(debugApps, false);
            }; // end of spotlightCallBack
            exec('mdfind \'kMDItemCFBundleIdentifier == "com.google.Chrome" || kMDItemCFBundleIdentifier == "org.cef.cefclient"\'', spotlightCallBack);

        } catch (e) { // Error loading syntax file "Packages/zzz A File Icon zzz/aliases/Plain Text (PDF).sublime-syntax": Unable to read Packages/zzz A File Icon zzz/aliases/Plain Text (PDF).sublime-syntax
            alert(e);
        }
    }; // end of spotLight

    var appsFromFile = function(debugApps) {
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
        };
        addInfo();
    };

    launchDebug = function(port) {
        var debugApp, cmd;
        debugApp = '' + $('#debugApps').val();
        port = undefined ? '' : '' + port;
        if (!(/:/.test(port))) {
            port = 'http://localhost:' + port;
        } else if (!(/http/.test(port))) {
            port = 'http://' + port;
        }
        if (debugApp === '0') {
            debugApp = selectDebugFile();
            if (!debugApp) return;
        }
        if (!/\d/.test(port)) { return; }
        if (/chrome/i.test(debugApp)) {
            debugApp += '/Contents/MacOS/Google Chrome'; // /Contents/MacOS/Google Chrome
            cmd = 'open -a "' + debugApp + '" ' + port;
        } else if (/cefclient/i.test(debugApp)) {
            debugApp += '/Contents/MacOS/cefclient';
            cmd = '"' + debugApp + '" --url=' + port;
        } else {
            alert('Sorry at present only Chrome and Cefclient are supported :-<');
        }
        // log(cmd)
        // alert(cmd)
        exec(cmd, function(err) {
            if (err !== null) alert('err:' + err + '@');
            // should offer to remove app from list
        });
    }; // end of launchDebug

    selectDebugFile = function() {
        var debugApp;

        debugApp = window.cep.fs.showOpenDialogEx(false, false, 'Please select a file (chrome or cefclient only!)');
        debugApp = '' + debugApp.data[0];
        if (/chrome|cefclient/i.test(debugApp)) {
            addDropdownOption(debugApp);
            return debugApp;
        }
        if (debugApp !== '' && debugApp !== 'undefined' && debugApp !== 'null') {
            alert('Sorry at present only Chrome and Cefclient are supported :-<');
        }
        return false;
    }; // end of selectDebugFile



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
                version = result.match(/kMDItemVersion += "([^"]+)/);
                version = version && version[1];
                contentUpdate = result.match(/kMDItemFSContentChangeDate += (\S+)/);
                contentUpdate = contentUpdate && '' + new Date(contentUpdate[1]).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                appsArray.push(`<option value="${value}" title="${value + '&nbsp; Last&nbsp;modified:&nbsp;' + contentUpdate}">${name + ' (' + version})</option>`);
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
        cmd = 'mdls "app"'.replace(/app/, '' + value);
        return exec(cmd, addPathAndVersion);
    }; // end of addDropdownOption

    removeDropdownOption = function() {
        var value;
        value = $('#debugApps').val();
        if (value === '') { return; }
        $(`#debugApps option[value='${value}']`).remove();
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
        $('#debugApps').selectmenu('refresh');
        appSelection = $('#debugApps').val();
        fs.outputFile(cookieFile, appSelection);
    }; // end of removeDropdownOption

    $("#debugAddBT").click(selectDebugFile);
    $("#debugRemoveBT").click(removeDropdownOption);

    $('#debugBT').click(function() {
        launchDebug($('#portIN').val());
    });
    $('#refeshAppList').click(function() {
        spotLight();
        $('#folderBody').text('Please wait a few (upto 10) seconds for the apps to be processed');
        getCeps();
    });

    spotLight();
    getCeps();
})();