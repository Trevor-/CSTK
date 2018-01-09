var __log, __error;
(function(){
const ARRAY_SPLIT = ';;@;;:@#;';
if (new ExternalObject('lib:PlugPlugExternalObject')) {
    $.dispatch = function(in_eventType, in_message) {
        var eventObj = new CSXSEvent();
        eventObj.type = in_eventType;
        eventObj.data = '' + in_message;
        eventObj.dispatch();
    };
    $.write = function(message, style, __class) {
        style = style || ' ';
        message += ARRAY_SPLIT + style;
        message += ARRAY_SPLIT + (__class ? __class : ' ');
        $.dispatch('com.creative-scripts.cstk.writeln', message);
    };
    $.writeln = function(message, style, __class) {
        style = style || ' ';
        message += ARRAY_SPLIT + style;
        message += ARRAY_SPLIT + (__class ? __class : ' ');
        message += ARRAY_SPLIT + 1;
        $.dispatch('com.creative-scripts.cstk.writeln', message);
    };
    __log = function(message, style, __class) {
        style = style || ' ';
        message += ARRAY_SPLIT + style;
        if (__class) {
            message += ARRAY_SPLIT + __class;
        }
        $.dispatch('com.creative-scripts.cstk.__log', message);
    };
    __error = function(message, style) {
        __log(message, style, 'error');
    };
} else {
    __log = __error = $.writeln;
}
})();