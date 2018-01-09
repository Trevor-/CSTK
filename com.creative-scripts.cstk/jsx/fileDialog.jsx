// fileDialog.jsx
(function(baseFolder, message) {
    var file;
    baseFolder = new Folder(baseFolder);
    file = baseFolder.openDlg(message);
    return '' + (file && file.fsName);
    // the { {baseFolder} }, "{ {message} }" }
    // are replaced by the jsx.evalFile call
})('__baseFolder__', '__message__'); 