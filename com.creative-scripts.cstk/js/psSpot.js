var psSpotCallBack, getItemCallBack, d, addThisIfNotInArray, removeThisIfInArray;
d = new Date();
addThisIfNotInArray = function(value, array) {
    if (array.indexOf(value) === -1) {array.push(value);}
};
removeThisIfInArray = function(value, array) {
    var i;
    i = array.indexOf(value);
    if (i !== -1) {array.splice(i, 1);}
};
psSpotCallBack = function(err, result) {
    var psSpot, apps, psGetItems, getItems, n, l;
    psSpot = `powershell "$connector = new-object system.data.oledb.oledbdataadapter -argument \\"SELECT System.ItemPathDisplay FROM SYSTEMINDEX WHERE CONTAINS (System.FileName, '\\"\\"Google Chrome\\"\\" OR Cefclient.exe')\\", \\"provider=search.collatordso;extended properties='application=windows';\\"; $dataset = new-object system.data.dataset; if ($connector.fill($dataset)) { $dataset.tables[0] }"`;
    apps = result.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
        .replace(/^[\n\r]+/, '')
        .replace(/[\n\r]+$/, '')
        .split(/ *[\n\r]+/);
    // Add some potential locations for Chrome as Windows search might only index the start folder
    // If they don't exists they will just be filtered out later by the Get-Item command.
    addThisIfNotInArray('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', apps);
    addThisIfNotInArray('D:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', apps);
    // At some point Chrome will change?
    addThisIfNotInArray('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', apps);
    addThisIfNotInArray('D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', apps);
    l = apps.length;
    getItems = function(paths, field) {
        var getTemplate, filePaths;
        getTemplate = "(Get-Item __PATHS__)__FIELD__;";
        filePaths = "'" + paths.join("','").replace(/\\/, '\\\\') + "'";
        return getTemplate.replace(/__PATHS__/, filePaths)
            .replace(/__FIELD__/, field ? '.' + field : '');
    };
    psGetItems = 'powershell "';
    psGetItems += getItems(apps, 'FullName');
    psGetItems += getItems(apps, 'VersionInfo');
    psGetItems += getItems(apps, 'CreationTime.Year');
    psGetItems += getItems(apps, 'CreationTime.Month');
    psGetItems += getItems(apps, 'CreationTime.Day');
    psGetItems += '"';
    // __log(apps);
    exec(psGetItems, getItemCallBack);
};
getItemCallBack = function(err, result) {
    var paths, info, n, l, data;
    result = result.split(/----+ +-----+ +-----+[ \n\r]*/);
    paths = result[0] || '';
    // __log('paths: ' + paths);
    info = result[1] || '';
    // __log('info: ' + info);
    paths = paths.replace(/[\n\r]+[^:\n\r]+[\n\r]/g, '')
        .replace(/^[\n\r]+/, '')
        .replace(/[\n\r]+$/, '')
        .split(/ *[\n\r]+/);
    info = info.split(/ *[\n\r]+/);
    l = paths.length;
    data = [];
    for (n = 0; n < l; n++) {
        data[n] = {
            path: paths[n],
            version: '' + (info[n].match(/^\S+/) || 'Unknown Version'),
            date: new Date(info[l + n], info[l * 2 + n], info[l * 3 + n])
                .toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
        };
    }
    __log(Jfy(data) + '\n' + ((new Date() - d) / 1000) + 's');
};
exec(psSpot, psSpotCallBack);