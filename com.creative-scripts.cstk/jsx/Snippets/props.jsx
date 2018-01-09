$.props = function(target, specifier, properites) {

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
            properites = target;
        }
        target = app.selection[0];
        if (!target) {
            $.level = level;
            return;
        }
    } else if (target.constructor === Array) {
        properites = specifier;
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
   // __log([target, specifier, properites].join('\n'), 'background:yellow')
    inTarget = (properites && properites.constructor === Array) ? properites : target;
   // __log(typeof inTarget);
    if (!properites) {
        for (n in target) {
        	getProp(n, target);
        }
    } else if (properites.constructor !== Array) {
        getProp(properites, target);
    } else {
        l = properites.length;
        for (n = 0; n < l; n++) {
        getProp(properites[n], target);
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