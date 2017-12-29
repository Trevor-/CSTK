var shell = function(command) {
    var terminal, n, l, _cwd, __cwd;
    if (!command) { return; }
    if (typeof command !== 'object') { command = [command]; }
    terminal = require('child_process').spawn('cmd', ['/K'], { timeout: 1000 * 60 * 60 * 24 });
    terminal.stdin.setEncoding = 'utf-8';
    l = command.length;
    for (n = 0; n < l; n++) {
        terminal.stdin.write(new Buffer(command[n] + '\n'));
    }
    terminal.stdin.write(new Buffer('echo \u0800\u1560\u2503C\n')); // ;-}

    terminal.stdout.on('data', function(data) {
    	_cwd = /[^\r\n]*(?=echo \u0800\u1560\u2503C)/.exec(data);
        if (_cwd) {
        	__cwd = '' + _cwd;
        	__log('__cwd: ' + __cwd);
        	data = data.substr(0,_cwd.index);
            terminal.kill();
        }
        __log(data);
    });
    terminal.stderr.on('data', function(data) {
        __log('stderr: ' + data);
    });

    terminal.on('exit', function(code) {
        __log('child process exited with code ' + code);
    });
};

shell(['dir', 'cd..', 'dir']);