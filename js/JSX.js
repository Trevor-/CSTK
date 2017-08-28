//////////////////////////////////////////////////////////////////////////////////
// JSX.js © and writtent by Trevor http://creative-scripts.com/jsx-js           //
// If you turn over is less the $50,000,000 then you don't have to pay anything //
// License MIT, don't complain, don't sue NO MATTER WHAT                        //
// If you turn over is more the $50,000,000 then you DO have to pay             //
// Contact me http://creative-scripts.com/contact for pricing and licensing     //
// Don't remove these commented lines                                           //
// For simple and effective calling of jsx from the js engine                   //
// Version 1 last modified Aug 27 2017                                          //
//////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// NOTE: JSX.js is dependent on NodeJS                                         //
// See http://creative-scripts.com/jsx-js on how turn on NodeJS and use JSX.js //
/////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSX.js for calling jsx code from the js engine                                                        //
// 2 methods included                                                                                    //
// 1) jsx.evalScript AKA jsx.eval                                                                        //
// 2) jsx.evalFile AKA jsx.file                                                                          //
// Special features                                                                                      //
// 1) Allows all changes in your jsx code to be reloaded into your extension at the click of a button    //
// 2) Can enable the $.fileName property to work and provides a $.__fileName() method as an alternative  //
// 3) Can force a callBack result from InDesign                                                          //
// 4) No more csInterface.evalScript('alert("hello "' + title + " " + name + '");')                      //
//    use jsx.evalScript('alert("hello __title__ __name__");', {title: title, name: name});              //
// 5) execute jsx files from your jsx folder like this jsx.evalFile('myFabJsxScript.jsx');               //
//    or from a relative path jsx.evalFile('../myFabScripts/myFabJsxScript.jsx');                        //
//    or from an absolute url jsx.evalFile('/Path/to/my/FabJsxScript.jsx'); (mac)                        //
//    or from an absolute url jsx.evalFile('C:Path/to/my/FabJsxScript.jsx'); (windows)                   //
// 6) Parameter can be entered in the from of a parameter list which can be in any order or as an object //
// 7) Not camelCase sensitive (very useful for the illiterate)                                           //
// 8) Dead easy to use BUT SPEND THE 3 TO 5 MINUTES IT SHOULD TAKE TO READ THE INSTRUCTIONS              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/* jshint undef:true, unused:true, esversion:6 */

//////////////////////////////////////
// jsx is the interface for the API //
//////////////////////////////////////

var jsx;

// Wrap everything in an anonymous function to prevent leeks 
(function() {
    /////////////////////////////////////////////////////////////////////
    // Substitute some CSInterface functions to avoid dependency on it //
    /////////////////////////////////////////////////////////////////////

    var __dirname = (function() {
        var path, isMac;
        path = decodeURI(window.__adobe_cep__.getSystemPath('extension'));
        isMac = process.platform[0] === 'd'; // [d]arwin
        path = path.replace('file://' + (isMac ? '' : '/'), '');
        return path;
    })();

    var evalScript = function(script, callback) {
        callback = callback || function() {};
        window.__adobe_cep__.evalScript(script, callback);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The is the  "main" function which is to be prototyped                                              //
    // It run a small snippet in the jsx engine that                                                      //
    // 1) Assigns $.__dirname with the value of the extensions __dirname base path                        //
    // 2) Sets up a method $.__fileName() for retrieving from within the jsx script it's $.fileName value //
    //    more on that method later                                                                       //
    // At the end of the script the global declaration jsx = new Jsx(); has been made.                    //
    // If you like you can remove that and include in your relevant functions                             //
    // var jsx = new Jsx(); You would never call the Jsx function without the "new" declaration           //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    var Jsx = function() {
        var jsxScript;
        // Setup jsx function to enable the jsx scripts to easily retrieve their file location
        jsxScript = [
            'if(!$.__fileNames){',
            '    $.__fileNames = {};',
            '    $.__dirname = "__dirname__";'.replace('__dirname__', __dirname),
            '    $.__fileName = function(name){',
            '        name = name || $.fileName;',
            '        return ($.__fileNames && $.__fileNames[name]) || $.fileName;',
            '    };',
            '}'
        ].join('');
        evalScript(jsxScript);
        return this;
    };

    /**
     * [evalScript] For calling jsx scripts from the js engine
     *         
     *         The jsx.evalScript method is used for calling jsx scripts directly from the js engine
     *         Allows for easy replacement i.e. variable insertions and for forcing eval.
     *         For convenience jsx.eval or jsx.script or jsx.evalscript can be used instead of calling jsx.evalScript
     * 
     * @param  {String} jsxScript 
     *                            The string that makes up the jsx script
     *                            it can contain a simple template like syntax for replacements
     *                            'alert("__foo__");'
     *                            the __foo__ will be replaced as per the replacements parameter
     * 
     * @param  {Function} callback  
     *                            The callback function you want the jsx script to trigger on completion
     *                            The result of the jsx script is passed as the argument to that function
     *                            The function can exist in some other file.
     *                            Note that InDesign does not automatically pass the callBack as a string.
     *                            Either write your InDesign in a way that it returns a sting the form of 
     *                            return 'this is my result surrounded by quotes'
     *                            or use the force eval option
     *                            [Optional DEFAULT no callBack]
     *                            
     * @param  {Object} replacements
     *                            The replacements to make on the jsx script
     *                            given the following script (template)
     *                            'alert("__message__: " + __val__);'
     *                            and we want to change the script to
     *                            'alert("I was born in the year: " + 1234);'
     *                            we would pass the following object
     *                            {"message": 'I was born in the year', "val": 1234}
     *                            or if not using reserved words like do we can leave out the key quotes
     *                            {message: 'I was born in the year', val: 1234}                           
     *                            [Optional DEFAULT no replacements]
     *                            
     * @param  {Bolean} forceEval
     *                             If the script should be wrapped in an eval
     *                             This is only necessary if you need result to come back as a string
     *                             in an application that by default does not return a string
     *                             i.e. you need a callback from indesign
     *                             In illustrator you never need to set this
     *                             [Optional DEFAULT false]
     *
     * Note 1) The order of the parameters is irrelevant
     * Note 2) One can pass the arguments as an object if desired
     *         jsx.evalScript(myCallBackFunction, 'alert("__myMessage__");', true);
     *         is the same as
     *         jsx.evalScript({
     *             script: 'alert("__myMessage__");',
     *             replacements: {myMessage: 'Hi there'},
     *             callBack: myCallBackFunction,
     *             eval: true
     *         });
     *         note that either lower or camelCase key names are valid
     *         i.e. both callback or callBack will work
     *
     *      The following keys are the same jsx || script || jsxScript || jsxscript || file
     *      The following keys are the same callBack || callback
     *      The following keys are the same replacements || replace
     *      The following keys are the same eval || forceEval || forceeval
     *      The following keys are the same forceEvalScript || forceevalscript || evalScript || evalscript;
     * 
     * @return {Boolean} if the jsxScript was executed or not
     */

    Jsx.prototype.evalScript = function() {
        var arg, i, key, replaceThis, withThis, args, callback, forceEval, replacements, jsxScript;

        //////////////////////////////////////////////////////////////////////////////////////
        // sort out order which arguments into jsxScript, callback, replacements, forceEval //
        //////////////////////////////////////////////////////////////////////////////////////

        args = arguments;

        // Detect if the parameters were passed as an object and if so allow for various keys
        if (args.length === 1 && (arg = args[0]) instanceof Object) {
            jsxScript = arg.jsxScript || arg.jsx || arg.script || arg.file || arg.jsxscript;
            callback = arg.callBack || arg.callback;
            replacements = arg.replacements || arg.replace;
            forceEval = arg.eval || arg.forceEval || arg.forceeval;
        } else {
            for (i = 0; i < 4; i++) {
                arg = args[i];
                if (arg === undefined) {
                    continue;
                }
                if (arg.constructor === String) {
                    jsxScript = arg;
                    continue;
                }
                if (arg.constructor === Object) {
                    replacements = arg;
                    continue;
                }
                if (arg.constructor === Function) {
                    callback = arg;
                    continue;
                }
                if (arg === true) {
                    forceEval = true;
                }
            }
        }

        // If no script provide then not too much to do!
        if (!jsxScript) {
            return false;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // On Illustrator and other apps the result of the jsx script is automatically passed as a string                                       //
        // if you have a "script" containing the single number 1 and nothing else then the callBack will register as "1"                        //
        // On InDesign that same script will provide a blank callBack                                                                           //
        // Let's say we have a callBack function var callBack = function(result){alert(result);}                                                //
        // On Ai your see the 1 in the alert                                                                                                    //
        // On ID your just see a blank alert                                                                                                    //
        // To see the 1 in the alert you need to convert the result to a string and then it will show                                           //
        // So if we rewrite out 1 byte script to '1' i.e. surround the 1 in quotes then the call back alert will show 1                         //
        // If the scripts planed one can make sure that the results always passed as a string (including errors)                                //
        // otherwise one can wrap the script in an eval and then have the result passed as a string                                             //
        // I have not gone through all the apps but can say                                                                                     //
        // for Ai you never need to set the forceEval to true                                                                                   //
        // for ID you if you have not coded your script appropriately and your want to send a result to the callBack then set forceEval to true //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (forceEval) {
            jsxScript = "eval(''' " + jsxScript.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "\n''') + '';";
        }

        ////////////////////////////////
        // deal with the replacements //
        ////////////////////////////////
        if (replacements) {
            for (key in replacements) {
                if (replacements.hasOwnProperty(key)) {
                    replaceThis = new RegExp('__' + key + '__', 'g');
                    withThis = replacements[key];
                    jsxScript = jsxScript.replace(replaceThis, withThis + '');
                }
            }
        }


        try {
            evalScript(jsxScript, callback);
            return true;
        } catch (err) {
            ////////////////////////////////////////////////
            // Do whatever error handling you want here ! //
            ////////////////////////////////////////////////
            var newErr;
            newErr = new Error(err);
            alert('Error Eek: ' + newErr.stack);
            return false;
        }

    };


    /**
     * [evalFile] For calling jsx scripts from the js engine
     *         
     *         The jsx.evalFiles method is used for executing saved jsx scripts
     *         where the jsxScript parameter is a string of the jsx scripts file location.
     *         For convenience jsx.file or jsx.evalfile can be used instead of jsx.evalFile
     * 
     * @param  {String} file 
     *                            The path to jsx script
     *                            If only the base name is provided then the path will be presumed to be the
     *                            To execute files stored in the jsx folder located in the __dirname folder use
     *                            jsx.evalFile('myFabJsxScript.jsx');
     *                            To execute files stored in the a folder myFabScripts located in the __dirname folder use
     *                            jsx.evalFile('./myFabScripts/myFabJsxScript.jsx'); 
     *                            To execute files stored in the a folder myFabScripts located at an absolute url use
     *                            jsx.evalFile('/Path/to/my/FabJsxScript.jsx'); (mac)
     *                            or jsx.evalFile('C:Path/to/my/FabJsxScript.jsx'); (windows)
     * 
     * @param  {Function} callback  
     *                            The callback function you want the jsx script to trigger on completion
     *                            The result of the jsx script is passed as the argument to that function
     *                            The function can exist in some other file.
     *                            Note that InDesign does not automatically pass the callBack as a string.
     *                            Either write your InDesign in a way that it returns a sting the form of 
     *                            return 'this is my result surrounded by quotes'
     *                            or use the force eval option
     *                            [Optional DEFAULT no callBack]
     *                            
     * @param  {Object} replacements
     *                            The replacements to make on the jsx script
     *                            give the following script (template)
     *                            'alert("__message__: " + __val__);'
     *                            and we want to change the script to
     *                            'alert("I was born in the year: " + 1234);'
     *                            we would pass the following object
     *                            {"message": 'I was born in the year', "val": 1234}
     *                            or if not using reserved words like do we can leave out the key quotes
     *                            {message: 'I was born in the year', val: 1234}  
     *                            By default when possible the forceEvalScript will be set to true
     *                            The forceEvalScript option cannot be true when there are replacements
     *                            To force the forceEvalScript to be false you can send a blank set of replacements
     *                            jsx.evalFile('myFabScript.jsx', {}); Will NOT be executed using the $.evalScript method                      
     *                            jsx.evalFile('myFabScript.jsx'); Will YES be executed using the $.evalScript method 
     *                            see the forceEvalScript parameter for details on this                     
     *                            [Optional DEFAULT no replacements]
     *                            
     * @param  {Bolean} forceEval
     *                             If the script should be wrapped in an eval
     *                             This is only necessary if 
     *                             1) You need the result for a callback
     *                             2) In an application that by default does not return a string
     *                             i.e. you need a callback from indesign
     *                             3) The result isn't explicitly passed as a String
     *                             4) replacements have been passed.
     *                             
     *                             If no replacements are needed then the jsx script is be executed by using the $.evalFile method
     *                             This exposes the true value of the $.fileName property 8-)
     *                             In such a case it's best to avoid using the $.__fileName() with no base name as it won't work
     *                             BUT one can still use the $.__fileName('baseName') method which is more accurate than the standard $.fileName property :-)
     *                             Let's say you have a Drive called "Graphics" AND YOU HAVE a root folder on your "main" drive called "Graphics"
     *                             You call a script jsx.evalFile('/Volumes/Graphics/myFabScript.jsx');
     *                             $.fileName will give you '/Graphics/myFabScript.jsx' which is wrong
     *                             $.__fileName('myFabScript.jsx') will give you '/Volumes/Graphics/myFabScript.jsx' which is correct
     *                             $.__fileName() will not give you a reliable result
     *                             Note that if your calling multiple versions of myFabScript.jsx stored in multiple folders then you can get stuffed!
     *                             i.e. if the fileName is important to you then don't do that.
     *                             It also will force the result of the jsx file as a string which is particularly useful for InDesign callBacks
     *                             [Optional DEFAULT false]
     * 
     * Note 1) The order of the parameters is irrelevant
     * Note 2) One can pass the arguments as an object if desired
     *         jsx.evalScript(myCallBackFunction, 'alert("__myMessage__");', true);
     *         is the same as
     *         jsx.evalScript({
     *             script: 'alert("__myMessage__");',
     *             replacements: {myMessage: 'Hi there'},
     *             callBack: myCallBackFunction,
     *             eval: false,
     *         });
     *         note that either lower or camelCase key names or valid
     *         i.e. both callback or callBack will work
     *         
     *      The following keys are the same file || jsx || script || jsxScript || jsxscript
     *      The following keys are the same callBack || callback
     *      The following keys are the same replacements || replace
     *      The following keys are the same eval || forceEval || forceeval
     *      
     * @return {Boolean} if the jsxScript was executed or not
     */

    Jsx.prototype.evalFile = function() {
        var arg, args, callback, fileName, fileNameScript, forceEval, forceEvalScript,
            fs, i, jsxFolder, jsxScript, key, newLine, path, replacements, replaceThis, success, withThis;

        success = true; // optimistic :-)
        args = arguments;
        fs = require('fs');
        path = require('path');
        jsxFolder = path.join(__dirname, 'jsx');
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // $.fileName does not return it's correct path in the jsx engine for files called from the js engine   //
        // In Illustrator it returns an integer in InDesign it returns an empty string                          //
        // This script injection allows for the script to know it's path by calling                             //
        // $.__fileName();                                                                                      //
        // on Illustrator this works pretty well                                                                //
        // on InDesign it's best to use with a bit of care                                                      //
        // If the a second script has been called the InDesing will "forget" the path to the first script       //
        // 2 work-arounds for this                                                                              //
        // 1) at the beginning of your script add var thePathToMeIs = $.fileName();                             //
        //    thePathToMeIs will not be forgotten after running the second script                               //
        // 2) $.__fileName('myBaseName.jsx');                                                                   //
        //    for example you have file with the following path                                                 //
        //    /path/to/me.jsx                                                                                   //
        //    Call $.__fileName('me.jsx') and you will get /path/to/me.jsx even after executing a second script //
        // Note When the forceEvalScript option is used then you just use the regular $.fileName property       //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        fileNameScript = [
            // The if statement should not normally be executed
            'if(!$.__fileNames){',
            '    $.__fileNames = {};',
            '    $.__dirname = "__dirname__";'.replace('__dirname__', __dirname),
            '    $.__fileName = function(name){',
            '        name = name || $.fileName;',
            '        return ($.__fileNames && $.__fileNames[name]) || $.fileName;',
            '    };',
            '}',
            '$.__fileNames["__basename__"] = $.__fileNames["" + $.fileName] = "__fileName__";'
        ].join('');

        //////////////////////////////////////////////////////////////////////////////////////
        // sort out order which arguments into jsxScript, callback, replacements, forceEval //
        //////////////////////////////////////////////////////////////////////////////////////


        // Detect if the parameters were passed as an object and if so allow for various keys
        if (args.length === 1 && (arg = args[0]) instanceof Object) {
            jsxScript = arg.jsxScript || arg.jsx || arg.script || arg.file || arg.jsxscript;
            callback = arg.callBack || arg.callback;
            replacements = arg.replacements || arg.replace;
            forceEval = arg.eval || arg.forceEval || arg.forceeval;
        } else {
            for (i = 0; i < 5; i++) {
                arg = args[i];
                if (arg === undefined) {
                    continue;
                }
                if (arg.constructor.name === 'String') {
                    jsxScript = arg;
                    continue;
                }
                if (arg.constructor.name === 'Object') {
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // If no replacements are provided then the $.evalScript method will be used                                //
                    // This will allow directly for the $.fileName property to be used                                          //
                    // If one does not want the $.evalScript method to be used then                                             //
                    // either send a blank object as the replacements {}                                                        //
                    // or explicitly set the forceEvalScript option to false                                                    //
                    // This can only be done if the parameters are passed as an object                                          //
                    // i.e. jsx.evalFile({file:'myFabScript.jsx', forceEvalScript: false});                                     //
                    // if the file was called using                                                                             //
                    // i.e. jsx.evalFile('myFabScript.jsx');                                                                    //
                    // then the following jsx code is called $.evalFile(new File('Path/to/myFabScript.jsx', 10000000000)) + ''; //
                    // forceEval is never needed if the forceEvalScript is triggered                                            //
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    replacements = arg;
                    continue;
                }
                if (arg.constructor === Function) {
                    callback = arg;
                    continue;
                }
                if (arg === true) {
                    forceEval = true;
                }
            }
        }

        // If no script provide then not too much to do!
        if (!jsxScript) {
            return false;
        }

        forceEvalScript = !replacements;


        //////////////////////////////////////////////////////
        // Get path of script                               //
        // Check if it's literal, relative or in jsx folder //
        //////////////////////////////////////////////////////

        if (/^\/|[a-zA-Z]+:/.test(jsxScript)) { // absolute path Mac  | Windows
            jsxScript = path.normalize(jsxScript);
        } else if (/^\.+\//.test(jsxScript)) {
            jsxScript = path.join(__dirname, jsxScript); // relative path
        } else {
            jsxScript = path.join(jsxFolder, jsxScript); // files in the jsxFolder
        }


        if (forceEvalScript) {
            jsxScript = jsxScript.replace(/"/g, '\\"');
            // Check that the path exist, should change this to asynchronous at some point
            try {
                fs.statSync(jsxScript);
                // TODO Needs more checking for windows 
                jsxScript = fileNameScript.replace(/__fileName__/, jsxScript).replace(/__basename__/, path.win32.basename(jsxScript)) +
                    '$.evalFile(new File("' + jsxScript + '", 1e14)) + "";';
                evalScript(jsxScript, callback);
                return true;
            } catch (err) {
                return false;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////
        // Replacements made so we can't use $.evalFile and need to read the jsx script for ourselves //
        ////////////////////////////////////////////////////////////////////////////////////////////////

        fileName = jsxScript.replace(/"/g, '\\"');
        try {
            jsxScript = fs.readFileSync(jsxScript);
        } catch (er) {
            return false;
        }
        // It is desirable that the injected fileNameScript is on the same line as the 1st line of the script
        // This is so that the $.line or error.line returns the same value as the actual file
        // However if the 1st line contains a # directive then we need to insert a new line and stuff the above problem
        // When possible i.e.  when there's no replacements then $.evalFile will be used and then the whole issue is avoided
        newLine = /^\s*#/.test(jsxScript) ? '\n' : '';
        jsxScript = fileNameScript.replace(/__fileName__/, fileName).replace(/__basename__/, path.basename(fileName)) + newLine + jsxScript;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // On Illustrator and other apps the result of the jsx script is automatically passed as a string                                       //
        // if you have a "script" containing the single number 1 and nothing else then the callBack will register as "1"                        //
        // On InDesign that same script will provide a blank callBack                                                                           //
        // Let's say we have a callBack function var callBack = function(result){alert(result);}                                                //
        // On Ai your see the 1 in the alert                                                                                                    //
        // On ID your just see a blank alert                                                                                                    //
        // To see the 1 in the alert you need to convert the result to a string and then it will show                                           //
        // So if we rewrite our 1 byte script to the 3 byte '1' i.e. surround the 1 in quotes then the call back alert will show 1              //
        // If the scripts planed one can make sure that the results always passed as a string (including errors)                                //
        // otherwise one can wrap the script in an eval and then have the result passed as a string                                             //
        // I have not gone through all the apps but can say                                                                                     //
        // for Ai you never need to set the forceEval to true                                                                                   //
        // for ID you if you have not coded your script appropriately and your want to send a result to the callBack then set forceEval to true //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (forceEval) {
            jsxScript = "eval(''' " + newLine + jsxScript.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "\n''') + '';";
            // To be honest I would be surprised if this always works
            // I'll wait for feedback
        }

        ////////////////////////////////
        // deal with the replacements //
        ////////////////////////////////
        if (replacements) {
            for (key in replacements) {
                if (replacements.hasOwnProperty(key)) {
                    replaceThis = new RegExp('__' + key + '__', 'g');
                    withThis = replacements[key];
                    jsxScript = jsxScript.replace(replaceThis, withThis + '');
                }
            }
        }

        try {
            evalScript(jsxScript, callback);
            return true;
        } catch (err) {
            ////////////////////////////////////////////////
            // Do whatever error handling you want here ! //
            ////////////////////////////////////////////////
            var newErr;
            newErr = new Error(err);
            alert('Error Eek: ' + newErr.stack);
            return false;
        }

        return success; // success should be an array but for now it's a Boolean
    };


    ////////////////////////////////////
    // Setup alternative method names //
    ////////////////////////////////////
    Jsx.prototype.eval = Jsx.prototype.script = Jsx.prototype.evalscript = Jsx.prototype.evalScript;
    Jsx.prototype.file = Jsx.prototype.evalfile = Jsx.prototype.evalFile;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Examples                                                                                                                      //
    // jsx.evalScript('alert("foo");');                                                                                              //
    // jsx.evalFile('foo.jsx'); // where foo.jsx is stored in the jsx folder at the base of the extensions directory                 //
    // jsx.evalFile('../myFolder/foo.jsx'); // where a relative or absolute file path is given                                       //
    //                                                                                                                               //
    // using conventional methods one would use in the case were the values to swap were supplied by variables                       //
    // csInterface.evalScript('var q = "' + name + '"; alert("' + myString + '" ' + myOp + ' q);q;', callback);                      //
    // Using all the '' + foo + '' is very error prone                                                                               //
    // jsx.evalScript('var q = "__name__"; alert(__string__ __opp__ q);q;',{'name':'Fred', 'string':'Hello ', 'opp':'+'}, callBack); //
    // is much simpler and less error prone                                                                                          //
    //                                                                                                                               //
    // more readable to use object                                                                                                   //
    // jsx.evalFile({                                                                                                                //
    //      file: 'yetAnotherFabScript.jsx',                                                                                         //
    //      replacements: {"this": foo, That: bar, and: "&&", the: foo2, other: bar2},                                               //
    //      eval: true                                                                                                               //
    // })                                                                                                                            //
    // Enjoy :-)                                                                                                                     //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    jsx = new Jsx();
})();
