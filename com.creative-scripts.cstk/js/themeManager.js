/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, document, CSInterface*/


/*

    Responsible for overwriting CSS at runtime according to CC app
    settings as defined by the end user.

*/
var themeManager = (function() {
    'use strict';

    /**
     * Convert the Color object to string in hexadecimal format;
     */
    function toHex(color, delta) {

        function computeValue(value, delta) {
            var computedValue = !isNaN(delta) ? value + delta : value;
            if (computedValue < 0) {
                computedValue = 0;
            } else if (computedValue > 255) {
                computedValue = 255;
            }

            computedValue = Math.floor(computedValue);

            computedValue = computedValue.toString(16);
            return computedValue.length === 1 ? "0" + computedValue : computedValue;
        }

        var hex = "";
        if (color) {
            hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
        }
        return hex;
    }


    var stylesheet = document.getElementById("hostStyle");
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
    }

    function addRule(selector, rule) {
        if (stylesheet) {
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
    }



    /**
     * Update the theme with the AppSkinInfo retrieved from the host product.
     */
    function updateThemeWithAppSkinInfo(appSkinInfo) {

        var panelBgColor = appSkinInfo.panelBackgroundColor.color;
        var bgdColor = toHex(panelBgColor);

        var darkBgdColor = toHex(panelBgColor, 20);
        var fontSize = Math.max(+appSkinInfo.baseFontSize, 18);
        var fontColor = "F0F0F0";
        if (panelBgColor.red > 122) {
            fontColor = "000000";
        }
        var fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif, Gotham;';
        var lightBgdColor = toHex(panelBgColor, -100);

        addRule(".hostElt", "background-color:" + "#" + bgdColor);
        addRule(".hostElt", "font-size:" + fontSize + "px;");
        addRule(".hostElt", 'font-family:' + fontFamily);
        addRule(".hostElt", "color:" + "#" + fontColor);

        addRule(".hostBgd", "background-color:" + "#" + bgdColor);
        addRule(".hostBgdDark", "background-color: " + "#" + darkBgdColor);
        addRule(".hostBgdLight", "background-color: " + "#" + lightBgdColor);
        addRule(".hostFontSize", "font-size:" + fontSize + "px;");
        addRule(".hostFontFamily", "font-family:" + fontFamily);
        addRule(".hostFontColor", "color:" + "#" + fontColor);

        addRule(".hostFont", "font-size:" + fontSize + "px;");
        // addRule(".hostFont", "font-family:" + appSkinInfo.baseFontFamily);
        addRule(".hostFont", "font-family:" + fontFamily);
        addRule(".hostFont", "color:" + "#" + fontColor);

        addRule(".hostButton", "background-color:" + "#" + darkBgdColor);
        addRule(".hostButton:hover", "background-color:" + "#" + bgdColor);
        addRule(".hostButton:active", "background-color:" + "#" + darkBgdColor);
        addRule(".hostButton", "border-color: " + "#" + lightBgdColor);

        ////////////////////////////////
        // Add you own css rules here //
        ////////////////////////////////
    }


    function onAppThemeColorChanged() {
        var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
        updateThemeWithAppSkinInfo(skinInfo);
    }

    function init() {

        var csInterface = new CSInterface();

        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
    }

    return {
        init: init
    };

}());

themeManager.init();
