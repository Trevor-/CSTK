// LogFactory.jsx Ver 1 By Trevor 6rd Mar 2017 http://www.creative-scripts.com/logging-with-a-smile/ Provided 'as is', with no warranty whatsoever. This line may not be removed.
var LogFactory, LogFactoryVersion, LogFactoryCurrentVersion;
LogFactoryVersion = 1.2;
if (!LogFactory || LogFactoryCurrentVersion !== LogFactoryVersion) {
    LogFactory = function(file, write, store, level, defaultStatus, continuing) {
        if (file && (file.constructor === String || file.constructor === File)) { file = { file: file }; } else if (!file) file = { file: {} };
        write = (file.write !== undefined) ? file.write : write;
        if (write === undefined) { write = true; }
        store = (file.store !== undefined) ? file.store || false : store || false;
        level = (file.level !== undefined) ? file.level : level;
        defaultStatus = (file.defaultStatus !== undefined) ? file.defaultStatus : defaultStatus;
        if (defaultStatus === undefined) { defaultStatus = 'LOG'; }
        continuing = (file.continuing !== undefined) ? file.continuing : continuing || false;
        file = file.file || {};
        var stack, times, logTime, logPoint, icons, statuses, LOG_LEVEL, LOG_STATUS;
        stack = [];
        times = [];
        logTime = new Date();
        logPoint = 'Log Factory Start';
        icons = {
            "1": "🕐",
            "130": "🕜",
            "2": "🕑",
            "230": "🕝",
            "3": "🕒",
            "330": "🕞",
            "4": "🕓",
            "430": "🕟",
            "5": "🕔",
            "530": "🕠",
            "6": "🕕",
            "630": "🕡",
            "7": "🕖",
            "730": "🕢",
            "8": "🕗",
            "830": "🕣",
            "9": "🕘",
            "930": "🕤",
            "10": "🕙",
            "1030": "🕥",
            "11": "🕚",
            "1130": "🕦",
            "12": "🕛",
            "1230": "🕧",
            "AIRPLANE": "🛩",
            "ALARM": "⏰",
            "AMBULANCE": "🚑",
            "ANCHOR": "⚓",
            "ANGRY": "😠",
            "ANGUISHED": "😧",
            "ANT": "🐜",
            "ANTENNA": "📡",
            "APPLE": "🍏",
            "APPLE2": "🍎",
            "ATM": "🏧",
            "ATOM": "⚛",
            "BABYBOTTLE": "🍼",
            "BAD:": "👎",
            "BANANA": "🍌",
            "BANDAGE": "🤕",
            "BANK": "🏦",
            "BATTERY": "🔋",
            "BED": "🛏",
            "BEE": "🐝",
            "BEER": "🍺",
            "BELL": "🔔",
            "BELLOFF": "🔕",
            "BIRD": "🐦",
            "BLACKFLAG": "🏴",
            "BLUSH": "😊",
            "BOMB": "💣",
            "BOOK": "📕",
            "BOOKMARK": "🔖",
            "BOOKS": "📚",
            "BOW": "🏹",
            "BOWLING": "🎳",
            "BRIEFCASE": "💼",
            "BROKEN": "💔",
            "BUG": "🐛",
            "BUILDING": "🏛",
            "BUILDINGS": "🏘",
            "BULB": "💡",
            "BUS": "🚌",
            "CACTUS": "🌵",
            "CALENDAR": "📅",
            "CAMEL": "🐪",
            "CAMERA": "📷",
            "CANDLE": "🕯",
            "CAR": "🚘",
            "CAROUSEL": "🎠",
            "CASTLE": "🏰",
            "CATEYES": "😻",
            "CATJOY": "😹",
            "CATMOUTH": "😺",
            "CATSMILE": "😼",
            "CD": "💿",
            "CHECK": "✔",
            "CHEQFLAG": "🏁",
            "CHICK": "🐥",
            "CHICKEN": "🐔",
            "CHICKHEAD": "🐤",
            "CIRCLEBLACK": "⚫",
            "CIRCLEBLUE": "🔵",
            "CIRCLERED": "🔴",
            "CIRCLEWHITE": "⚪",
            "CIRCUS": "🎪",
            "CLAPPER": "🎬",
            "CLAPPING": "👏",
            "CLIP": "📎",
            "CLIPBOARD": "📋",
            "CLOUD": "🌨",
            "CLOVER": "🍀",
            "CLOWN": "🤡",
            "COLDSWEAT": "😓",
            "COLDSWEAT2": "😰",
            "COMPRESS": "🗜",
            "CONFOUNDED": "😖",
            "CONFUSED": "😕",
            "CONSTRUCTION": "🚧",
            "CONTROL": "🎛",
            "COOKIE": "🍪",
            "COOKING": "🍳",
            "COOL": "😎",
            "COOLBOX": "🆒",
            "COPYRIGHT": "©",
            "CRANE": "🏗",
            "CRAYON": "🖍",
            "CREDITCARD": "💳",
            "CROSS": "✖",
            "CROSSBOX:": "❎",
            "CRY": "😢",
            "CRYCAT": "😿",
            "CRYSTALBALL": "🔮",
            "CUSTOMS": "🛃",
            "DELICIOUS": "😋",
            "DERELICT": "🏚",
            "DESKTOP": "🖥",
            "DIAMONDLB": "🔷",
            "DIAMONDLO": "🔶",
            "DIAMONDSB": "🔹",
            "DIAMONDSO": "🔸",
            "DICE": "🎲",
            "DISAPPOINTED": "😞",
            "CRY2": "😥",
            "DIVISION": "➗",
            "DIZZY": "😵",
            "DOLLAR": "💵",
            "DOLLAR2": "💲",
            "DOWNARROW": "⬇",
            "DVD": "📀",
            "EJECT": "⏏",
            "ELEPHANT": "🐘",
            "EMAIL": "📧",
            "ENVELOPE": "📨",
            "ENVELOPE2": "✉",
            "ENVELOPE_DOWN": "📩",
            "EURO": "💶",
            "EVIL": "😈",
            "EXPRESSIONLESS": "😑",
            "EYES": "👀",
            "FACTORY": "🏭",
            "FAX": "📠",
            "FEARFUL": "😨",
            "FILEBOX": "🗃",
            "FILECABINET": "🗄",
            "FIRE": "🔥",
            "FIREENGINE": "🚒",
            "FIST": "👊",
            "FLOWER": "🌷",
            "FLOWER2": "🌸",
            "FLUSHED": "😳",
            "FOLDER": "📁",
            "FOLDER2": "📂",
            "FREE": "🆓",
            "FROG": "🐸",
            "FROWN": "🙁",
            "GEAR": "⚙",
            "GLOBE": "🌍",
            "GLOWINGSTAR": "🌟",
            "GOOD:": "👍",
            "GRIMACING": "😬",
            "GRIN": "😀",
            "GRINNINGCAT": "😸",
            "HALO": "😇",
            "HAMMER": "🔨",
            "HAMSTER": "🐹",
            "HAND": "✋",
            "HANDDOWN": "👇",
            "HANDLEFT": "👈",
            "HANDRIGHT": "👉",
            "HANDUP": "👆",
            "HATCHING": "🐣",
            "HAZARD": "☣",
            "HEADPHONE": "🎧",
            "HEARNOEVIL": "🙉",
            "HEARTBLUE": "💙",
            "HEARTEYES": "😍",
            "HEARTGREEN": "💚",
            "HEARTYELLOW": "💛",
            "HELICOPTER": "🚁",
            "HERB": "🌿",
            "HIGH_BRIGHTNESS": "🔆",
            "HIGHVOLTAGE": "⚡",
            "HIT": "🎯",
            "HONEY": "🍯",
            "HOT": "🌶",
            "HOURGLASS": "⏳",
            "HOUSE": "🏠",
            "HUGGINGFACE": "🤗",
            "HUNDRED": "💯",
            "HUSHED": "😯",
            "ID": "🆔",
            "INBOX": "📥",
            "INDEX": "🗂",
            "JOY": "😂",
            "KEY": "🔑",
            "KISS": "😘",
            "KISS2": "😗",
            "KISS3": "😙",
            "KISS4": "😚",
            "KISSINGCAT": "😽",
            "KNIFE": "🔪",
            "LABEL": "🏷",
            "LADYBIRD": "🐞",
            "LANDING": "🛬",
            "LAPTOP": "💻",
            "LEFTARROW": "⬅",
            "LEMON": "🍋",
            "LIGHTNINGCLOUD": "🌩",
            "LINK": "🔗",
            "LITTER": "🚮",
            "LOCK": "🔒",
            "LOLLIPOP": "🍭",
            "LOUDSPEAKER": "📢",
            "LOW_BRIGHTNESS": "🔅",
            "MAD": "😜",
            "MAGNIFYING_GLASS": "🔍",
            "MASK": "😷",
            "MEDAL": "🎖",
            "MEMO": "📝",
            "MIC": "🎤",
            "MICROSCOPE": "🔬",
            "MINUS": "➖",
            "MOBILE": "📱",
            "MONEY": "💰",
            "MONEYMOUTH": "🤑",
            "MONKEY": "🐵",
            "MOUSE": "🐭",
            "MOUSE2": "🐁",
            "MOUTHLESS": "😶",
            "MOVIE": "🎥",
            "MUGS": "🍻",
            "NERD": "🤓",
            "NEUTRAL": "😐",
            "NEW": "🆕",
            "NOENTRY": "🚫",
            "NOTEBOOK": "📔",
            "NOTEPAD": "🗒",
            "NUTANDBOLT": "🔩",
            "O": "⭕",
            "OFFICE": "🏢",
            "OK": "🆗",
            "OKHAND": "👌",
            "OLDKEY": "🗝",
            "OPENLOCK": "🔓",
            "OPENMOUTH": "😮",
            "OUTBOX": "📤",
            "PACKAGE": "📦",
            "PAGE": "📄",
            "PAINTBRUSH": "🖌",
            "PALETTE": "🎨",
            "PANDA": "🐼",
            "PASSPORT": "🛂",
            "PAWS": "🐾",
            "PEN": "🖊",
            "PEN2": "🖋",
            "PENSIVE": "😔",
            "PERFORMING": "🎭",
            "PHONE": "📞",
            "PILL": "💊",
            "PING": "❗",
            "PLATE": "🍽",
            "PLUG": "🔌",
            "PLUS": "➕",
            "POLICE": "🚓",
            "POLICELIGHT": "🚨",
            "POSTOFFICE": "🏤",
            "POUND": "💷",
            "POUTING": "😡",
            "POUTINGCAT": "😾",
            "PRESENT": "🎁",
            "PRINTER": "🖨",
            "PROJECTOR": "📽",
            "PUSHPIN": "📌",
            "QUESTION": "❓",
            "RABBIT": "🐰",
            "RADIOACTIVE": "☢",
            "RADIOBUTTON": "🔘",
            "RAINCLOUD": "🌧",
            "RAT": "🐀",
            "RECYCLE": "♻",
            "REGISTERED": "®",
            "RELIEVED": "😌",
            "ROBOT": "🤖",
            "ROCKET": "🚀",
            "ROLLING": "🙄",
            "ROOSTER": "🐓",
            "RULER": "📏",
            "SATELLITE": "🛰",
            "SAVE": "💾",
            "SCHOOL": "🏫",
            "SCISSORS": "✂",
            "SCREAMING": "😱",
            "SCROLL": "📜",
            "SEAT": "💺",
            "SEEDLING": "🌱",
            "SEENOEVIL": "🙈",
            "SHIELD": "🛡",
            "SHIP": "🚢",
            "SHOCKED": "😲",
            "SHOWER": "🚿",
            "SLEEPING": "😴",
            "SLEEPY": "😪",
            "SLIDER": "🎚",
            "SLOT": "🎰",
            "SMILE": "🙂",
            "SMILING": "😃",
            "SMILINGCLOSEDEYES": "😆",
            "SMILINGEYES": "😄",
            "SMILINGSWEAT": "😅",
            "SMIRK": "😏",
            "SNAIL": "🐌",
            "SNAKE": "🐍",
            "SOCCER": "⚽",
            "SOS": "🆘",
            "SPEAKER": "🔈",
            "SPEAKEROFF": "🔇",
            "SPEAKNOEVIL": "🙊",
            "SPIDER": "🕷",
            "SPIDERWEB": "🕸",
            "STAR": "⭐",
            "STOP": "⛔",
            "STOPWATCH": "⏱",
            "SULK": "😦",
            "SUNFLOWER": "🌻",
            "SUNGLASSES": "🕶",
            "SYRINGE": "💉",
            "TAKEOFF": "🛫",
            "TAXI": "🚕",
            "TELESCOPE": "🔭",
            "TEMPORATURE": "🤒",
            "TENNIS": "🎾",
            "THERMOMETER": "🌡",
            "THINKING": "🤔",
            "THUNDERCLOUD": "⛈",
            "TICKBOX": "✅",
            "TICKET": "🎟",
            "TIRED": "😫",
            "TOILET": "🚽",
            "TOMATO": "🍅",
            "TONGUE": "😛",
            "TOOLS": "🛠",
            "TORCH": "🔦",
            "TORNADO": "🌪",
            "TOUNG2": "😝",
            "TRADEMARK": "™",
            "TRAFFICLIGHT": "🚦",
            "TRASH": "🗑",
            "TREE": "🌲",
            "TRIANGLE_LEFT": "◀",
            "TRIANGLE_RIGHT": "▶",
            "TRIANGLEDOWN": "🔻",
            "TRIANGLEUP": "🔺",
            "TRIANGULARFLAG": "🚩",
            "TROPHY": "🏆",
            "TRUCK": "🚚",
            "TRUMPET": "🎺",
            "TURKEY": "🦃",
            "TURTLE": "🐢",
            "UMBRELLA": "⛱",
            "UNAMUSED": "😒",
            "UPARROW": "⬆",
            "UPSIDEDOWN": "🙃",
            "WARNING": "⚠",
            "WATCH": "⌚",
            "WAVING": "👋",
            "WEARY": "😩",
            "WEARYCAT": "🙀",
            "WHITEFLAG": "🏳",
            "WINEGLASS": "🍷",
            "WINK": "😉",
            "WORRIED": "😟",
            "WRENCH": "🔧",
            "X": "❌",
            "YEN": "💴",
            "ZIPPERFACE": "🤐",
            "UNDEFINED": "",
            "": ""
        };
        statuses = { F: 'FATAL', B: 'BUG', C: 'CRITICAL', E: 'ERROR', W: 'WARNING', I: 'INFO', IM: 'IMPORTANT', D: 'DEBUG', L: 'LOG', CO: 'CONSTANT', FU: 'FUNCTION', R: 'RETURN', V: 'VARIABLE', S: 'STACK', RE: 'RESULT', ST: 'STOPPER', TI: 'TIMER', T: 'TRACE' };
        LOG_LEVEL = { NONE: 7, OFF: 7, FATAL: 6, ERROR: 5, WARN: 4, INFO: 3, UNDEFINED: 2, '': 2, DEFAULT: 2, DEBUG: 2, TRACE: 1, ON: 0, ALL: 0, };
        LOG_STATUS = { OFF: LOG_LEVEL.OFF, NONE: LOG_LEVEL.OFF, NO: LOG_LEVEL.OFF, NOPE: LOG_LEVEL.OFF, FALSE: LOG_LEVEL.OFF, FATAL: LOG_LEVEL.FATAL, BUG: LOG_LEVEL.ERROR, CRITICAL: LOG_LEVEL.ERROR, ERROR: LOG_LEVEL.ERROR, WARNING: LOG_LEVEL.WARN, INFO: LOG_LEVEL.INFO, IMPORTANT: LOG_LEVEL.INFO, DEBUG: LOG_LEVEL.DEBUG, LOG: LOG_LEVEL.DEBUG, STACK: LOG_LEVEL.DEBUG, CONSTANT: LOG_LEVEL.DEBUG, FUNCTION: LOG_LEVEL.DEBUG, VARIABLE: LOG_LEVEL.DEBUG, RETURN: LOG_LEVEL.DEBUG, RESULT: LOG_LEVEL.TRACE, STOPPER: LOG_LEVEL.TRACE, TIMER: LOG_LEVEL.TRACE, TRACE: LOG_LEVEL.TRACE, ALL: LOG_LEVEL.ALL, YES: LOG_LEVEL.ALL, YEP: LOG_LEVEL.ALL, TRUE: LOG_LEVEL.ALL };
        var logFile, logFolder;
        var LOG = function(message, status, icon) {
            if (LOG.level !== LOG_LEVEL.OFF && (LOG.write || LOG.store) && LOG.arguments.length) return LOG.addMessage(message, status, icon);
        };
        LOG.logDecodeLevel = function(level) {
            if (level == ~~level) return Math.abs(level);
            var lev;
            level += '';
            level = level.toUpperCase();
            if (level in statuses) { level = statuses[level]; }
            lev = LOG_LEVEL[level];
            if (lev !== undefined) return lev;
            lev = LOG_STATUS[level];
            if (lev !== undefined) return lev;
            return LOG_LEVEL.DEFAULT;
        };
        LOG.write = write;
        LOG.store = store;
        LOG.level = LOG.logDecodeLevel(level);
        LOG.status = defaultStatus;
        LOG.addMessage = function(message, status, icon) {
            var date = new Date(),
                count, bool, logStatus;
            if (status && status.constructor.name === 'String') {
                status = status.toUpperCase();
                status = statuses[status] || status;
            } else status = LOG.status;
            logStatus = LOG_STATUS[status] || LOG_STATUS.ALL;
            if (logStatus < LOG.level) return;
            date = ' \t[' + date + ' ' + date.getMilliseconds() + 'ms]';
            status = '[' + status + '] ';
            if (status.length < 11) status = (status + '           ').substr(0, 11);
            if (icon) {
                icon = ('' + icon).toUpperCase();
                icon = (icon in icons && icons[icon]) || '';
            } else { icon = ''; }
            if (LOG.count !== ~~LOG.count) { LOG.count = 1; }
            count = (LOG.count > 999) ? '[' + LOG.count + '] ' : ('   [' + LOG.count + '] ').slice(-7);
            message = count + status + icon + (message instanceof Object ? message.toSource() : message) + date;
            if (LOG.store) { stack.push(message); }
            if (LOG.write) {
                bool = file && file.writable && logFile.writeln(message);
                if (!bool) {
                    file.writable = true;
                    LOG.setFile(logFile);
                    logFile.writeln(message);
                }
            }
            LOG.count++;
            return true;
        };
        var logNewFile = function(file, isCookie, overwrite) {
            file.encoding = 'UTF-8';
            file.lineFeed = ($.os[0] == 'M') ? 'Macintosh' : ' Windows';
            if (isCookie) return file.open(overwrite ? 'w' : 'e') && file;
            file.writable = LOG.write;
            logFile = file;
            logFolder = file.parent;
            if (continuing) { LOG.count = LOG.setCount(file); }
            return (!LOG.write && file || (file.open('a') && file));
        };
        LOG.setFile = function(file, isCookie, overwrite) {
            var bool, folder, fileName, suffix, newFileName, f, d, safeFileName, sn;
            d = new Date();
            if (file && file.constructor.name == 'String') { file = (file.match('/')) ? new File(file) : new File((logFolder || Folder.temp) + '/' + file); }
            if (file instanceof File) {
                f = logNewFile(file, isCookie, overwrite);
                if (f) return f;
                folder = file.parent;
                bool = folder.exists || folder.create();
                if (!bool) folder = Folder.temp;
                fileName = File.decode(file.name);
                suffix = fileName.match(/\.[^.]+$/);
                suffix = suffix ? suffix[0] : '';
                fileName = '/' + fileName;
                newFileName = fileName.replace(/\.[^.]+$/, '') + '_' + (+(new Date()) + suffix);
                f = logNewFile(new File(folder + newFileName), isCookie, overwrite);
                if (f) return f;
                try { sn = $.stack.split("\n")[0].replace(/^\[\(?/, '').replace(/\)?\]$/, ''); } catch (e) {
                    $.gc();
                    $.gc();
                    try { sn = $.stack.split("\n")[0].replace(/^\[\(?/, '').replace(/\)?\]$/, ''); } catch (e) { sn = $.fileName; }
                }
                if (sn == ~~sn) { sn = $.fileName.replace(/[^\/]+\//g, ''); }
                safeFileName = File.encode((isCookie ? '/COOKIE_' : '/LOG_') + sn.replace(/^\//, '') + '_' + (1900 + d.getYear()) + ('' + d).replace(/...(...)(..).+/, '_$1_$2') + (isCookie ? '.txt' : '.log'));
                f = logNewFile(new File(folder + safeFileName), isCookie, overwrite);
                if (f) return f;
                if (folder != Folder.temp) {
                    f = logNewFile(new File(Folder.temp + fileName), isCookie, overwrite);
                    if (f) return f;
                    f = logNewFile(new File(Folder.temp + safeFileName), isCookie, overwrite);
                    return f || new File(Folder.temp + safeFileName);
                }
            }
            return LOG.setFile(((logFile && !isCookie) ? new File(logFile) : new File(Folder.temp + safeFileName)), isCookie, overwrite);
        };
        LOG.setCount = function(file) {
            if (~~file === file) {
                LOG.count = file;
                return LOG.count;
            }
            if (file === undefined) { file = logFile; }
            if (file && file.constructor === String) { file = new File(file); }
            var logNumbers, contents;
            if (!file.length || !file.exists) {
                LOG.count = 1;
                return 1;
            }
            file.open('r');
            file.encoding = 'utf-8';
            file.seek(10000, 2);
            contents = '\n' + file.read();
            logNumbers = contents.match(/\n{0,3}\[\d+\] \[\w+\]+/g);
            if (logNumbers) {
                logNumbers = +logNumbers[logNumbers.length - 1].match(/\d+/) + 1;
                file.close();
                LOG.count = logNumbers;
                return logNumbers;
            }
            if (file.length < 10001) {
                file.close();
                LOG.count = 1;
                return 1;
            }
            file.seek(10000000, 2);
            contents = '\n' + file.read();
            logNumbers = contents.match(/\n{0,3}\[\d+\] \[\w+\]+/g);
            if (logNumbers) {
                logNumbers = +logNumbers[logNumbers.length - 1].match(/\d+/) + 1;
                file.close();
                LOG.count = logNumbers;
                return logNumbers;
            }
            file.close();
            LOG.count = 1;
            return 1;
        };
        LOG.setLevel = function(level) {
            LOG.level = LOG.logDecodeLevel(level);
            return LOG.level;
        };
        LOG.setStatus = function(status) {
            status = ('' + status).toUpperCase();
            LOG.status = statuses[status] || status;
            return LOG.status;
        };
        LOG.cookie = function(file, level, overwrite, setLevel) {
            var log, cookie;
            if (!file) { file = { file: file }; }
            if (file && (file.constructor === String || file.constructor === File)) { file = { file: file }; }
            log = file;
            if (log.level === undefined) { log.level = (level !== undefined) ? level : 'NONE'; }
            if (log.overwrite === undefined) { log.overwrite = (overwrite !== undefined) ? overwrite : false; }
            if (log.setLevel === undefined) { log.setLevel = (setLevel !== undefined) ? setLevel : true; }
            setLevel = log.setLevel;
            overwrite = log.overwrite;
            level = log.level;
            file = log.file;
            file = LOG.setFile(file, true, overwrite);
            if (overwrite) { file.write(level); } else {
                cookie = file.read();
                if (cookie.length) { level = cookie; } else { file.write(level); }
            }
            file.close();
            if (setLevel) { LOG.setLevel(level); }
            return { path: file, level: level };
        };
        LOG.args = function(args, funct, line) {
            if (LOG.level > LOG_STATUS.FUNCTION) return;
            if (!(args && ('' + args.constructor).replace(/\s+/g, '') === 'functionObject(){[nativecode]}')) return;
            if (!LOG.args.STRIP_COMMENTS) { LOG.args.STRIP_COMMENTS = /((\/.*$)|(\/\*[\s\S]*?\*\/))/mg; }
            if (!LOG.args.ARGUMENT_NAMES) { LOG.args.ARGUMENT_NAMES = /([^\s,]+)/g; }
            if (!LOG.args.OUTER_BRACKETS) { LOG.args.OUTER_BRACKETS = /^\((.+)?\)$/; }
            if (!LOG.args.NEW_SOMETHING) { LOG.args.NEW_SOMETHING = /^new \w+\((.+)?\)$/; }
            var functionString, argumentNames, stackInfo, report, functionName, arg, argsL, n, argName, argValue, argsTotal;
            if (funct === ~~funct) { line = funct; }
            if (!(funct instanceof Function)) { funct = args.callee; }
            if (!(funct instanceof Function)) return;
            functionName = funct.name;
            functionString = ('' + funct).replace(LOG.args.STRIP_COMMENTS, '');
            argumentNames = functionString.slice(functionString.indexOf('(') + 1, functionString.indexOf(')')).match(LOG.args.ARGUMENT_NAMES);
            argumentNames = argumentNames || [];
            report = [];
            report.push('--------------');
            report.push('Function Data:');
            report.push('--------------');
            report.push('Function Name:' + functionName);
            argsL = args.length;
            stackInfo = $.stack.split(/[\n\r]/);
            stackInfo.pop();
            stackInfo = stackInfo.join('\n                              ');
            report.push('Call stack:' + stackInfo);
            if (line) { report.push('Function Line around:' + line); }
            report.push('Arguments Provided:' + argsL);
            report.push('Named Arguments:' + argumentNames.length);
            if (argumentNames.length) { report.push('Arguments Names:' + argumentNames.join(',')); }
            if (argsL) {
                report.push('----------------');
                report.push('Argument Values:');
                report.push('----------------');
            }
            argsTotal = Math.max(argsL, argumentNames.length);
            for (n = 0; n < argsTotal; n++) {
                argName = argumentNames[n];
                arg = args[n];
                if (n >= argsL) { argValue = 'NO VALUE PROVIDED'; } else if (arg === undefined) { argValue = 'undefined'; } else if (arg === null) { argValue = 'null'; } else { argValue = arg.toSource().replace(LOG.args.OUTER_BRACKETS, '$1').replace(LOG.args.NEW_SOMETHING, '$1'); }
                report.push((argName ? argName : 'arguments[' + n + ']') + ':' + argValue);
            }
            report.push('');
            report = report.join('\n                  ');
            LOG(report, 'f');
            return report;
        };
        LOG.stack = function(reverse) {
            var st = $.stack.split('\n');
            st.pop();
            st.pop();
            if (reverse) { st.reverse(); }
            return LOG(st.join('\n                  '), 's');
        };
        LOG.values = function(values) {
            var n, value, map = [];
            if (!(values instanceof Object || values instanceof Array)) {
                return;
            }
            if (!LOG.values.OUTER_BRACKETS) { LOG.values.OUTER_BRACKETS = /^\((.+)?\)$/; }
            if (!LOG.values.NEW_SOMETHING) { LOG.values.NEW_SOMETHING = /^new \w+\((.+)?\)$/; }
            for (n in values) {
                try {
                    value = values[n];
                    if (value === undefined) { value = 'undefined'; } else if (value === null) { value = 'null'; } else { value = value.toSource().replace(LOG.values.OUTER_BRACKETS, '$1').replace(LOG.values.NEW_SOMETHING, '$1'); }
                } catch (e) { value = '\uD83D\uDEAB ' + e; }
                map.push(n + ':' + value);
            }
            if (map.length) {
                map = map.join('\n                  ') + '\n                  ';
                return LOG(map, 'v');
            }
        };
        LOG.reset = function(all) {
            stack.length = 0;
            LOG.count = 1;
            if (all !== false) {
                if (logFile instanceof File) { logFile.close(); }
                logFile = LOG.store = LOG.writeToFile = undefined;
                LOG.write = true;
                logFolder = Folder.temp;
                logTime = new Date();
                logPoint = 'After Log Reset';
            }
        };
        LOG.stopper = function(message) {
            var newLogTime, t, m, newLogPoint;
            newLogTime = new Date();
            newLogPoint = (LOG.count !== undefined) ? 'LOG#' + LOG.count : 'BEFORE LOG#1';
            LOG.time = t = newLogTime - logTime;
            if (message === false) {
                return;
            }
            message = message || 'Stopper start point';
            t = LOG.prettyTime(t);
            m = message + '\n                  ' + 'From ' + logPoint + ' to ' + newLogPoint + ' took ' + t + ' Starting ' + logTime + ' ' + logTime.getMilliseconds() + 'ms' + ' Ending ' + newLogTime + ' ' + newLogTime.getMilliseconds() + 'ms';
            LOG(m, 'st');
            logPoint = newLogPoint;
            logTime = newLogTime;
            return m;
        };
        LOG.start = function(message) {
            var t = new Date();
            times.push([t, (message !== undefined) ? message + '' : '']);
        };
        LOG.stop = function(message) {
            if (!times.length) return;
            message = (message) ? message + ' ' : '';
            var nt, startLog, ot, om, td, m;
            nt = new Date();
            startLog = times.pop();
            ot = startLog[0];
            om = startLog[1];
            td = nt - ot;
            if (om.length) { om += ' '; }
            m = om + 'STARTED [' + ot + ' ' + ot.getMilliseconds() + 'ms]\n                  ' + message + 'FINISHED [' + nt + ' ' + nt.getMilliseconds() + 'ms]\n                  TOTAL TIME [' + LOG.prettyTime(td) + ']';
            LOG(m, 'ti');
            return m;
        };
        LOG.prettyTime = function(t) {
            var h, m, s, ms;
            h = Math.floor(t / 3600000);
            m = Math.floor((t % 3600000) / 60000);
            s = Math.floor((t % 60000) / 1000);
            ms = t % 1000;
            t = (!t) ? '<1ms' : ((h) ? h + ' hours ' : '') + ((m) ? m + ' minutes ' : '') + ((s) ? s + ' seconds ' : '') + ((ms && (h || m || s)) ? '&' : '') + ((ms) ? ms + 'ms' : '');
            return t;
        };
        LOG.get = function() {
            if (!stack.length) return 'THE LOG IS NOT SET TO STORE';
            var a = fetchLogLines(arguments);
            return a ? '\n' + a.join('\n') : 'NO LOGS AVAILABLE';
        };
        var fetchLogLines = function() {
            var args = arguments[0];
            if (!args.length) return stack;
            var c, n, l, a = [],
                ln, start, end, j, sl;
            l = args.length;
            sl = stack.length - 1;
            n = 0;
            for (c = 0; c < l; c++) {
                ln = args[c];
                if (~~ln === ln) {
                    ln = (0 > ln) ? sl + ln + 1 : ln - 1;
                    if (ln >= 0 && ln <= sl) a[n++] = stack[ln];
                } else if (ln instanceof Array && ln.length === 2) {
                    start = ln[0];
                    end = ln[1];
                    if (!(~~start === start && ~~end === end)) continue;
                    start = (0 > start) ? sl + start + 1 : start - 1;
                    end = (0 > end) ? sl + end + 1 : end - 1;
                    start = Math.max(Math.min(sl, start), 0);
                    end = Math.min(Math.max(end, 0), sl);
                    if (start <= end)
                        for (j = start; j <= end; j++) a[n++] = stack[j];
                    else
                        for (j = start; j >= end; j--) a[n++] = stack[j];
                }
            }
            return (n) ? a : false;
        };
        LOG.file = function() {
            return logFile;
        };
        LOG.openFolder = function() {
            if (logFolder) return logFolder.execute();
        };
        LOG.show = LOG.execute = function() {
            if (logFile) return logFile.execute();
        };
        LOG.close = function() {
            if (logFile) return logFile.close();
        };
        LOG.setFile(file);
        if (!$.summary.difference) {
            $.summary.difference = function() {
                return $.summary().replace(/ *([0-9]+)([^ ]+)(\n?)/g, $.summary.updateSnapshot);
            };
        }
        if (!$.summary.updateSnapshot) {
            $.summary.updateSnapshot = function(full, count, name, lf) {
                var snapshot = $.summary.snapshot;
                count = Number(count);
                var prev = snapshot[name] ? snapshot[name] : 0;
                snapshot[name] = count;
                var diff = count - prev;
                if (diff === 0) return "";
                return "     ".substring(String(diff).length) + diff + " " + name + lf;
            };
        }
        if (!$.summary.snapshot) {
            $.summary.snapshot = [];
            $.summary.difference();
        }
        $.gc();
        $.gc();
        $.summary.difference();
        LOG.sumDiff = function(message) {
            $.gc();
            $.gc();
            var diff = $.summary.difference();
            if (diff.length < 8) { diff = ' - NONE -'; }
            if (message === undefined) { message = ''; }
            message += diff;
            return LOG('$.summary.difference():' + message, 'v');
        };
        LogFactoryCurrentVersion = LogFactoryVersion;
        return LOG;
    };
}
