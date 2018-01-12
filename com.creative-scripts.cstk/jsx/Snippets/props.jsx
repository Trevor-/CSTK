$.sel = function(target, specifier, properties) {

    var n, l, inTarget, level, results, errors, getProp;
    level = $.level;
    $.level = 0;
    results = [];
    errors = [];

    getProp = function(prop, target) {
        try {
            results.push(prop + ': ' + target[prop]);
        } catch (err) {
            errors.push(prop + ': ' + err);
        }
    };

    if (!target || target.length === 0 || typeof target === 'string') {
        if (typeof target === 'string') {
            properties = target;
        }
        target = app.selection[0];
        if (!target) {
            $.level = level;
            return;
        }
    } else if (target.constructor === Array) {
        properties = specifier;
        specifier = target;
        target = app.selection[0];
        if (!target) {
            $.level = level;
            return;
        }
    }
    if (typeof specifier === 'object' && specifier.length) {
        l = specifier.length;
        for (n = 0; n < l; n++) {
            try {
                target = target[specifier[n]];
            } catch (err) {
                $.writeln(err, 'color:red');
                $.level = level;
                return;
            }
        }
    }
    // __log([target, specifier, properties].join('\n'), 'background:yellow')
    inTarget = (properties && properties.constructor === Array) ? properties : target;
    // __log(typeof inTarget);
    if (!properties) {
        for (n in target) {
            getProp(n, target);
        }
    } else if (properties.constructor !== Array) {
        getProp(properties, target);
    } else {
        l = properties.length;
        for (n = 0; n < l; n++) {
            getProp(properties[n], target);
        }
    }
    if (results.length) {
        $.writeln(results.join('\n'), 'color:green;font-weight:800;');
    }
    if (errors.length) {
        $.writeln(errors.join('\n'), 'color:red');
    }
    $.level = level;
};



$.props = function() {
    var arg, n, l, props, errors, results, prop, target, selTaget, getProp, propString, error, level;
    props = [];
    errors = [];
    results = [];
    l = arguments.length;
    level = $.level;
    $.level = 0;
    error = function(message) {
        var errorMessage = [
            'To use the function either have an item selected or provide a valid DOM target.',
            'Examples:',
            'With item selected $.props() // => lists all the selected items properties',
            'With item selected $.props(["fillColor", "parentColorGroup"]) // => lists all the selected items fillColors parentColorGroup properties (in InDesign)',
            'With item selected $.props(["fillColor", "parentColorGroup"], "id", "name") // => lists id and name of the selected items fillColors parentColorGroup (in InDesign)',
            'With or without item selected $.props(app.activeDocument.textFrames[0]) // => lists all textFrames[0] properties (in InDesign)',
            'The examples here are for InDesign but the same idea should work in all the apps \ud83d\ude15',
            ''
        ].join('\n');
        message = message ? message + '\n' + errorMessage : errorMessage;
        $.level = level;
        return __log(message, 'color:red; top:10px; margin-left:3px;position: relative;');
    };
    for (n = 0; n < l; n++) {
        arg = arguments[n];
        if (typeof arg === 'object') {
            target = arg;
            continue;
        }
        if (arg) { props.push(arg); }
    }
    if (!target) {
        target = app.selection[0] || (app.selection.length && app.selection);
        if (!target) {
            return error('\ud83d\ude91 No item is selected and no target found.');
        }
    }
    getProp = function(prop, target) {
        try {
            results.push(prop + ': ' + target[prop]);
        } catch (err) {
            errors.push(prop + ': ' + err);
        }
    };
    // If the target is provided as an array that specifies the app.selection[0] try and resolve the target;
    if (target.constructor === Array) {
        propString = app.selection[0] ? 'app.selection[0]' : 'app.selection';
        selTaget = app.selection[0] || (app.selection.length && app.selection);
        l = target.length;
        for (n = 0; n < l; n++) {
            prop = target[n];
            propString += '["'+prop+'"]';
            try {
                selTaget = selTaget[prop];
            } catch (err) {
                return error('\ud83d\ude91 The target ' + propString + ' is not valid' + '\n' + err);
            }
        }
    }
            target = selTaget || target;
    if (props.length) { // if properties have been selected then only find them
        l = props.length;
        for (n = 0; n < l; n++) {
            getProp(props[n], target);
        }
    } else { // else find all the properties
        for (prop in target) {
            getProp(prop, target);
        }
    }
    __log('target' + (propString ? ' - ' + propString : '') + ': ' + target);
    if (results.length) {
        __log(results.join('\n'), 'color:green;font-weight:600;');
    }
    if (errors.length) {
        __error(errors.join('\n'));
    }
    $.level = level;

};