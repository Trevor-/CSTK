/* global APP, jsx, watcher, window */
/* jshint undef:true, unused:true, evil: true, esversion:6 */

////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var exec, path, csInterface, fs, extensionDataFolder;
    csInterface = new CSInterface();
    exec = require('child_process').exec;
    path = require('path');
    fs = require('fs-extra');
    extensionDataFolder = path.join(
        csInterface.getSystemPath(SystemPath.USER_DATA),
        'Creative Scripts',
        'Envision Aviation',
        'Illustrator Extension Suite'
    );

    $("#CreativeScripts").click(function() {
        exec('open "http://www.creative-scripts.com"');
    });
    $("#logo").click(function() {
        exec('open "http://www.creative-scripts.com"');
    });
    $("#mail").click(function() {
        exec('open "mailto:Trevor@creative-scripts.com"');
    });
    $("#Envision1").click(function() {
        exec('open "http://www.envisionaviation.com/"');
    });
    $("#Envision2").click(function() {
        exec('open "http://www.envisionaviation.com/"');
    });
    $("#Envision3").click(function() {
        exec('open "http://www.envisionaviation.com/"');
    });
    $("#foo").click(function() {
        (function() {
            var extensions, n, l, template, html, callback;
            extensions = eval(window.__adobe_cep__.getExtensions());
            l = extensions.length;
            template = [
                '<div id="div__n__">',
                '<span id="name__n__" class="csButton redButton">__name__</span>',
                // '<span id="id__n__" class="csButton blueButton">__id__</span>',
                '<span id="base__n__" class="csButton blueButton">Open Folder</span>',
                '<span id="kill__n__" class="csButton blueButton">Kill</span>',
                '<span id="load__n__" class="csButton blueButton">Load</span>',
                '<span id="restart__n__" class="csButton blueButton">Restart</span>',
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
                    exec('open "' + extensions[n].basePath + '"');
                });

            }
            for (n = 0; n < l; n++) {
                // Currently let is not supported so  we're making a function enclosure
                // feeding it with extensions[n]
                setUpButtons(n);
            }

        })();
    });
    $("#zoomOut").click(function() {
        var newFontSize;
        newFontSize = +$('.result').css('font-size').replace(/\D/g,'') - 1;
        $('.result').css('font-size',  newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });
    $("#zoomIn").click(function() {
        var newFontSize;
        newFontSize = +$('.result').css('font-size').replace(/\D/g,'') + 1;
        $('.result').css('font-size',  newFontSize);
        $('.codeBox').css('font-size', newFontSize);
    });

    $("#eval").click(function() {
        var contents, result;
        contents = $("#zZResult").val();
        try {
            result = eval($("#zZEval").val());
        } catch (err) {
            result = err;
        }
        $("#zZResult").append($("#zZEval").val() + '\n---------------------------\n' + ('' + new Date()).substr(16, 8) + ' JS ==> ' + result + '\n---------------------------\n');
        $("#zZResult").animate({
            scrollTop: $("#zZResult")[0].scrollHeight - $("#zZResult").height()
        }, 100);
    });
    $("#evaljsx").click(function() {
        var result;
        var evalCallBack = function(result) {
            var contents;
            contents = $("#zZResult").val();
            // $("#zZResult").append('[' + ('' + new Date()).substr(16, 8) + ' JSX RESULT]: ' + result + '\n');
            $("#zZResult").append($("#zZEval").val() + '\n---------------------------\n' + ('' + new Date()).substr(16, 8) + ' JSX ==> ' + result + '\n---------------------------\n');
            $("#zZResult").animate({
                scrollTop: $("#zZResult")[0].scrollHeight - $("#zZResult").height()
            }, 100);
        };
        try {
            result = jsx.eval($("#zZEval").val(), evalCallBack, true);
        } catch (err) {
            evalCallBack(err);
        }
    });
    $("#zZstackOEF").click(function() {
        exec('open "__folder__"'.replace(/__folder__/, extensionDataFolder));
        // jsx.eval("csws.assaignRow(app.activeDocument);");
    });

    $("#restartExt").click(function() {
        try {
            watcher.close();
            window.history.go(0);
        } catch (e) {
            window.history.go(0);
            // alert('Watcher Error: ' + e);
        }
    });

    $("#zZstackOLF").click(function() {
        // jsx.eval("new File('~/Library/Application Support/Creative Scripts/XML_To_Illustrator/config').execute();");
        jsx.eval("alert(myTest)");

    });
    $("#zZstackSAPF").click(function() {
        alert('Coming soon');
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
