#targetengine main
alert('Engine: ' + $.engineName);
// $.evalFile('C:\\Program Files\\Common Files\\Adobe\\CEP\\extensions\\CSTK\\jsx\\engine.jsx');
// "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\jsx\engine.jsx"
'Engine Name: '  + $.engineName;

/*
$ind = new-object -comobject InDesign.Application.CC.2018
$ind.DoScript('C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\jsx\engine.jsx', 1246973031);

$ind = new-object -comobject InDesign.Application.CC.2018;$ind.DoScript('C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\jsx\engine.jsx', 1246973031)

powershell -command "$ind = new-object -comobject InDesign.Application.CC.2018; $ind.DoScript('C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK\jsx\engine.jsx', 1246973031)"

There is also a powershell -noexit flag to keep the shell alive?

Mac
osascript  -e 'tell application "Adobe InDesign CS5" to do script alias "%s" language javascript '''


ScriptLanguage.JAVASCRIPT: 1246973031
ScriptLanguage.VISUAL_BASIC: 1447185511
ScriptLanguage.APPLESCRIPT_LANGUAGE: 1095978087
 */
