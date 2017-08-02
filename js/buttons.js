/* global APP, jsx, window, process */
/* jshint undef:true, unused:true, evil: true, esversion:6 */

////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var exec, csInterface, isMac, __dirname;
    csInterface = new CSInterface();
    exec = require('child_process').exec;
    isMac = process.platform[0] === 'd'; // [d]arwin
    __dirname = csInterface.getSystemPath(SystemPath.EXTENSION);

    $("#zoomOut").click(function() {
        var newFontSize;
        newFontSize = +$('.result').css('font-size').replace(/\D/g, '') - 1;
        $('.result').css('font-size', newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });

    $("#zoomIn").click(function() {
        var newFontSize;
        newFontSize = +$('.result').css('font-size').replace(/\D/g, '') + 1;
        $('.result').css('font-size', newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });

    /////////////
    // JS Eval //
    /////////////

    $("#eval").click(function() {
        var contents, result;
        $('#evalCode').css({borderColor: 'blue'});
        contents = $("#evalResult").val();
        try {
            result = eval($("#evalCode").val());
        } catch (err) {
            result = err;
        }
        $("#evalResult").append($("#evalCode").val() + '\n---------------------------\n' + ('' + new Date()).substr(16, 8) + ' JS ==> ' + result + '\n---------------------------\n');
        $("#evalResult").animate({
            scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
        }, 100);
    });

    //////////////
    // JSX Eval //
    //////////////

    $("#evaljsx").click(function() {
        var result;
        $('#evalCode').css({borderColor: 'orange'});
        var evalCallBack = function(result) {
            var contents;
            contents = $("#evalResult").val();
            // $("#evalResult").append('[' + ('' + new Date()).substr(16, 8) + ' JSX RESULT]: ' + result + '\n');
            $("#evalResult").append($("#evalCode").val() + '\n---------------------------\n' + ('' + new Date()).substr(16, 8) + ' JSX ==> ' + result + '\n---------------------------\n');
            $("#evalResult").animate({
                scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
            }, 100);
        };
        try {
            result = jsx.eval($("#evalCode").val(), evalCallBack, true);
        } catch (err) {
            evalCallBack(err);
        }
    });


    ///////////////
    // EXEC Eval //
    ///////////////


    $("#evalExec").click(function() {
        var result;
        $('#evalCode').css({borderColor: 'red'});
        var evalCallBack = function(error, stdout) {
            var contents;
            contents = $("#evalResult").val();
            // $("#evalResult").append('[' + ('' + new Date()).substr(16, 8) + ' JSX RESULT]: ' + result + '\n');
            $("#evalResult").append($("#evalCode").val() + '\n---------------------------\n' + ('' + new Date()).substr(16, 8) + ' EXEC ==> ' + (error || stdout) + '\n---------------------------\n');
            $("#evalResult").animate({
                scrollTop: $("#evalResult")[0].scrollHeight - $("#evalResult").height()
            }, 100);
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

    $("#openFolders").click(function() {
        (function() {
            var extensions, n, l, template, html, callback;
            extensions = eval(window.__adobe_cep__.getExtensions());
            l = extensions.length;
            template = [
                '<div id="div__n__">',
                '<span id="name__n__" class="csButton redButton">__name__</span>',
                // '<span id="id__n__" class="csButton blueButton">__id__</span>',
                '<span id="base__n__" class="csButton blueButton">Open Folder</span>',
                '<span style="font-size:.7em;">Mess With Care!</span>',
                '</div>',
            ].join('\n');
            html = [];
            callback = function(result) {
                alert(result.html());
            };
            for (n = 0; n < l; n++) {
                html.push(template
                    .replace(/__name__/g, extensions[n].name)
                    .replace(/__n__/g, '' + n)
                );
            }
            html = html.join('\n');
            // alert(html);
            $("#control").html(html);

            function setUpButtons(n) {
                var id = function(key) {
                    return '#' + key + n;
                };
                $(id('base')).click(function() {
                    // alert($(idd).attr('val'));
                    exec((isMac ? 'open "' : 'start "') + extensions[n].basePath + '"');
                });

            }
            for (n = 0; n < l; n++) {
                // Currently let is not supported so  we're making a function enclosure
                // feeding it with extensions[n]
                setUpButtons(n);
            }

        })();
    });

    $("#CreativeScripts").click(function() {
        exec('X http://www.creative-scripts.com '.replace(/X/, isMac ? 'open' : 'start'));
    });

    $("#restartExt").click(function() {
        try {
            // if we're restarting then we should remove all the eventListeners so we don't get double events
            process.removeAllListeners();
            window.history.go(0);
        } catch (e) {
            window.history.go(0);
            // alert('Watcher Error: ' + e);
        }
    });

    $("#restartApp").click(function() {
        try {
            APP.restart();
        } catch (e) {
            alert(e);
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
