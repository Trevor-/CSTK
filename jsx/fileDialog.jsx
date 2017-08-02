/* globals __baseFolder__, __filter__, __multi__ */
// fileDialog.jsx
(function(baseFolder, message, filter, multi) {
    var files, fsFiles, n, fc;
    baseFolder = baseFolder || Folder.myDocuments;
    files = baseFolder.openDlg(message, filter, multi);
    if (!files) {
        return false;
    }
    fc = files.length;
    fsFiles = [];
    for (n = 0; n < fc; n++) {
        // the test is to filter out Folders like myVideo.cmproj that look like files but are not
        // They can be filtered out with the filter by 
        // filter = function(f){return (f instanceof Folder && !((/\./).test("" + f))) || (/\.ai$|\.pdf$/i).test("" + f)}
        // This is an extra safety precaution
        // Note the above filter will filter also "NORMAL" folders if there name contains a "."
        if (files[n] instanceof File) { fsFiles.push(files[n].fsName); }
    }
    return fsFiles.toSource();
    // the { {baseFolder} }, "{ {message} }", { {filter} }, and  { {multi} }
    // are replaced by the jsx.evalFile call
})(__baseFolder__, "__message__", __filter__, __multi__); 