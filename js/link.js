/* jshint undef:true, unused:true, evil: true, esversion:6 */

////////////////////////////////////////////////////////
// Set up button for opening Creative Scripts folder  //
////////////////////////////////////////////////////////
(function() {
    var exec, isMac;
    exec = require('child_process').exec;
    isMac = process.platform[0] === 'd'; // [d]arwin

    $("#CreativeScripts,#CreativeScripts2").click(function() {
        exec('X http://www.creative-scripts.com '.replace(/X/, isMac ? 'open' : 'start'));
    });


})();
