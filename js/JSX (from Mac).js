////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSX.js by Trevor http://creative-scripts.com/adobe-html-extension-development-jsx-js-the-quick-and-easy-way-of-making-them //
// License MIT, don't complain, don't sue NO MATTER WHAT                                                                      //
// Don't remove these commented lines (Unless your minifying or uglifying)                                                    //
// For simple and effective calling of jsx from the js engine                                                                 //
// Written 2017 Version 1                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* jshint undef:true, unused:true, evil: true, esversion:6 */
var Jsx, jsx;

Jsx = function() {
    var csInterface, jsxScript;
    // Setup jsx function to enable the jsx scripts to easily retrieve their file location
    csInterface = new CSInterface();
    jsxScript = [
        'if(!$.__fileNames){',
        '    $.__fileNames = {};',
        '    $.__dirname = "' + csInterface.getSystemPath(SystemPath.EXTENSION) + '"',
        '    $.__fileName = function(name){',
        '        name = name || $.fileName;',
        '        return ($.__fileNames && $.__fileNames[name]) || $.fileName;',
        '    };',
        '}'
    ].join('\n');
    csInterface.evalScript(jsxScript);
    return this;
};

/**
 * [__jsx] For calling jsx scripts from the js engine
 *         This is the base method that the evalScripts and evalFiles methods call.
 *         
 *         The evalScripts method is used for calling single are multiple jsx scripts
 *         where the jsxScript parameter is a string of the script.
 *         For convenience evalScript or eval can be used instead of calling evalScripts
 *
 *         The evalFiles method is used for calling single are multiple jsx scripts
 *         where the jsxScript parameter is a string of the jsx scripts file location.
 *         For convenience evalFile or file can be used instead of calling evalScripts
 *
 * 
 * @param  {String} jsxScript 
 *                            The string that makes up the jsx script
 *                            it can contain a simple twig template like syntax for replacements
 *                            'alert("__foo__");'
 *                            the __foo__ will be replaced as per the replacements parameter
 * 
 * @param  {Function} callback  
 *                            The callback function you want the jsx script to trigger on completion
 *                            The result of the jsx script is passed as the argument to that function
 *                            The function can exist in some other file
 *                            [Optional]
 *                            
 * @param  {Array or Object} replacements
 *                            The replacements to make on the jsx script
 *                            give the following script (template)
 *                            'alert("__message__: " + __val__);'
 *                            and we want to change the script to
 *                            'alert("I was born in the year: " + 1234);'
 *                            we could pass the replacements parameter as the following 2D array
 *                            [['message', 'I was born in the year'], ['val', 1234]]
 *                            The "replace this" is the string that's surrounded by the {{}} in the template
 *                            we could instead pass the following object
 *                            {"message": 'I was born in the year', "val": 1234}
 *                            or even (more risky)
 *                            {message: 'I was born in the year', val: 1234}
 *                            Arrays of objects are not accepted
 *                            [{"message": 'I was born in the year'}, {"val": 1234}] will not work
 *                            
 *                            if there is only one replacement to be made then a 1D array can be passed
 *                            alert("__message__";'
 *                            ['message', 'foo'] will work
 *                            [['message', 'foo']] will also work
 *                            {"message": 'foo'} will also work
 *                            {message: 'foo'} will also work
 *                            [{"message": 'foo'}] will NOT work
 *                            
 *                            [Optional]
 *
 *
 * Note The order of the parameters is irrelevant

 * @return {Boolean} if the jsxScript was executed or not
 */

Jsx.prototype.__jsx = function() {
    try {
        var csInterface, jsxScript, callback, args, arg, replacements, replacementPair, key, l, n, replaceThis, withThis;
        // Detect if a
        csInterface = new CSInterface();

        args = arguments;
        l = args.length;
        if (l === 1 && args[0] instanceof Object) {
            arg = args[0];
            jsxScript = arg.jsxScript;
            callback = arg.callback;
            replacements = arg.replacements;
        } else {
            for (n = 0; n < 4; n++) {
                arg = args[n];
                if (arg === ('' + arg)) {
                    jsxScript = arg;
                } else if (arg instanceof Function) {
                    callback = arg;
                } else if (arg instanceof Array || arg instanceof Object) {
                    replacements = arg;
                }
            }
        }

        if (!jsxScript) {
            return false;
        }

        ////////////////////////////////
        // deal with the replacements //
        ////////////////////////////////
        if (replacements) {
            if (replacements instanceof Array) {
                l = replacements.length;
                // Check if just one singe replacement pair has been provided
                if (l === 2 && (!(replacements[0][0] instanceof Array))) {
                    replaceThis = new RegExp('{{' + replacements[0] + '}}', 'g');
                    withThis = replacements[1];
                    jsxScript = jsxScript.replace(replaceThis, withThis);
                } else { // The are several replacements to do which are setup as an array of arrays
                    for (n = 0; n < l; n++) {
                        replacementPair = replacements[n];
                        if (replacementPair && replacementPair.length === 2) {
                            replaceThis = new RegExp('{{' + replacementPair[0] + '}}', 'g');
                            withThis = replacementPair[1];
                            jsxScript = jsxScript.replace(replaceThis, withThis);
                        }
                    }
                } // end of else
            } else if (replacements instanceof Object) {
                for (key in replacements) {
                    if (replacements.hasOwnProperty(key)) {
                        replaceThis = new RegExp('{{' + key + '}}', 'g');
                        withThis = replacements[key];
                        jsxScript = jsxScript.replace(replaceThis, withThis);
                    }
                }
            } // end of else if Object
        }

        csInterface.evalScript(jsxScript, callback);
        return true;
    } catch (err) {
        var newErr;
        newErr = new Error(err); // Comment out if you DO NOT HAVE the npm nested-error-stacks
        alert('Error 🐱: ' + newErr.stack); // Comment out if you DO NOT HAVE the npm nested-error-stacks
        // alert(err); // Comment out if you HAVE the npm nested-error-stacks
        return false;
    }
};

//////////////////////////
// See notes at the end //
//////////////////////////
Jsx.prototype.evalScripts = function() {
    var args, c, i, arr, arg, success;
    success = [];
    args = arguments;
    if (args.length === 1 && ((arr = args[0]) instanceof Array)) {
        c = arr.length;
        for (i = 0; i < c; i++) {
            arg = arr[i];
            try {
                success.push(this.__jsx(arg[0], arg[1], arg[2], arg[3]));
            } catch (err) {
                success.push(false);
            }
        }
    } else {
        return this.__jsx(args[0], args[1], args[2], args[3]);
    }
    return success; // success should be an array
};

//////////////////////////
// See notes at the end //
//////////////////////////
Jsx.prototype.evalFiles = function() {
    var csInterface, args, c, i, j, arr, arg, success, fs, path, relReg, jsxFolder,
        arrayOfArrays, fileNameScript, __dirname, fileName, injectAndRun, This;
    csInterface = new CSInterface();
    success = true; // optimistic :-)
    arrayOfArrays = true;
    args = arguments;
    fs = require('fs');
    path = require('path');
    relReg = /^[.\/]/;
    __dirname = csInterface.getSystemPath(SystemPath.EXTENSION);
    jsxFolder = path.join(__dirname, 'jsx');
    This = this;
    // $.fileName does not return it's correct path in the jsx engine for files called from the js engine
    // In Illustrator it returns an integer in InDesign it returns an empty string
    // This script injection allows for the script to know it's path by calling 
    // 2 scripts being executed consecutively should have consecutive numbers
    // Sadly this doesn't always seem to be the case :-(
    // But we can play safe :-)
    fileNameScript = [
        // The if statement should not normally 
        'if(!$.__fileNames){',
        '    $.__fileNames = {};',
        '    $.__dirname = "' + __dirname + '";',
        '    $.__fileName = function(name){',
        '        name = name || $.fileName;',
        '        return ($.__fileNames && $.__fileNames[name]) || $.fileName;',
        '    };',
        '}',
        '$.__fileNames["__basename__"] = $.__fileNames["" + $.fileName] = "__fileName__";',
        ''
    ].join('\n');

    injectAndRun = function(args, j) {
        fileName = args[j].replace(/"/g, '\\"');
        try {
           // args[j] = fileNameScript.replace(/__fileName__/, fileName).replace(/__basename__/, path.basename(fileName)) + fs.readFileSync(args[j]);
           args[j] = '$.evalFile(new File("' + args[j] + '")) + "";';
            success = This.__jsx(args[0], args[1], args[2], args[3]) && success;
        } catch (e) {
            success = false;
        }
    };

    if (args.length === 1 && ((arr = args[0]) instanceof Array)) {
        c = arr.length;
        // check is a single array has been provided or and array of arrays
        for (i = 0; i < c; i++) {
            arrayOfArrays = arrayOfArrays && (arr[i] instanceof Array);
        }
        if (arrayOfArrays) { // 2D Array of Arrays
            for (i = 0; i < c; i++) {
                arg = arr[i];
                for (j = 0; j < 4; j++) {
                    if (arg[j] === ('' + arg[j])) {
                        switch (arg[j][0]) {
                            case '.':
                                arg[j] = path.join(__dirname, arg[j]);
                                break;
                            case '/':
                                arg[j] = path.normalize(arg[j]);
                                break;
                            default:
                                arg[j] = path.join(jsxFolder, arg[j]);
                                injectAndRun(arg, j);
                                break;
                        } // end of switch
                        break;
                    }
                }
            }
        } else { // A 1D Array
            for (j = 0; j < 4; j++) {
                if (arr[j] === ('' + arr[j])) {
                    switch (arg[j][0]) {
                        case '.':
                            arg[j] = path.join(__dirname, arg[j]);
                            break;
                        case '/':
                            arg[j] = path.normalize(arg[j]);
                            break;
                        default:
                            arg[j] = path.join(jsxFolder, arg[j]);
                            break;
                    } // end of switch
                    injectAndRun(arg, j);
                    break;
                }
            }
        }
    } else { // just an argument list, not an Array 

        for (j = 0; j < 4; j++) {
            if (args[j] === ('' + args[j])) {
                switch (args[j][0]) {
                    case '.':
                        args[j] = path.join(__dirname, args[j]);
                        break;
                    case '/':
                        args[j] = path.normalize(args[j]);
                        break;
                    default:
                        args[j] = path.join(jsxFolder, args[j]);
                        break;
                } // end of switch
                injectAndRun(args, j);
                break;
            }
        }
    }

    return success; // success should be an array but for now it's a Boolean
};


////////////////////////////////////
// Setup alternative method names //
////////////////////////////////////
Jsx.prototype.eval = Jsx.prototype.evalScript = Jsx.prototype.evalScripts;
Jsx.prototype.file = Jsx.prototype.files = Jsx.prototype.evalFile = Jsx.prototype.evalFiles;


// "Export" the functions for usage
// most basic usage example would be
// jsx.evalScript('alert("foo");');
// jsx.evalFile('foo.jsx'); // where foo.jsx is stored in the jsx folder at the base of the extensions directory
// jsx.evalFile('../myFolder/foo.jsx'); // where a relative or absolute file path is given
// 
// here's some more examples :-)
// 
// 
// jsx.evalScripts([
//     ['var q = "__name__"; alert("__string__" __opp__ q);q;', [
//         ['name', 'Fred'], // passing replacements as an array of arrays
//         ['string', 'Hello '],
//         ['opp', '+']
//     ]],
//     ['var q = "__foo__"; alert(__val__ __opp__ q);q;', callBall, {
//         'foo': 'qqq', // passing replacements as an object
//         'val': 5,
//         'opp': '+'
//     }],
//     ['alert("Bye");'] // Simple but still needs enclosing in [] as it's part of a batch run
// ]);
// 
// 'var q = "__name__"; alert("__string__" __opp__ q);q;' will be converted to
// 'var q = "Fred"; alert("Hello" + q);q;'
// using conventional methods one would use in the case were the values to swap were supplied by variables
// csInterface.evalScript('var q = "' + name + '"; alert("' + myString + '" ' + myOp + ' q);q;', callback);
// Using all the '' + foo + '' is very error prone
// jsx.evalScript('var q = "__name__"; alert(__string__ __opp__ q);q;',{'name':'Fred', 'string':'Hello ', 'opp':'+'}, callBack);
// is much simpler and less error prone
// 
// batch call jsx files making replacements to the file templates and using callbacks
// jsx.evalFiles([
//     ['1.js', [
//         ['name', 'Fred'],
//         ['string', '"Hello "'],
//         ['opp', '+']
//     ]],
//     ['2.js', callBall, {
//         'foo': 'qqq',
//         'val': 5,
//         'opp': '+'
//     }],
//     ['3.js']
// ]);
// 
// 
// jsx.evalScripts('alert("__foo__");', {foo:'bar'}, callBack); // valid
// jsx.evalScripts(['alert("__foo__");', {foo:'bar'}, callBack]); // valid
// jsx.evalScripts([['alert("__foo__");', {foo:'bar'}, callBack]]); // valid
// jsx.evalScripts(callBack, {foo:'bar'}, 'alert("__foo__");'); // valid!!
// 
// Same applies to the jsx.evalFiles method

jsx = new Jsx();