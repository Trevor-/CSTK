/* jshint undef:true, unused:true, evil: true, esversion:6 */
/*global require, process, jsx */

////////////////////
// The LogFactory //
////////////////////

var LogFactory;
LogFactory = function(logFile) {
    var LOG = function(message, status, icon, file, enabled) {
        if (enabled === true) {
            LOG.enabled = true;
        } else if (enabled === false) {
            LOG.enabled = false;
        } else {
            if (LOG.enabled !== undefined) {
                LOG.enabled = true;
            }
        }
        var path, exec, os, fs, isMac, open;

        path = require('path');
        exec = require('child_process').exec;
        os = require('os');
        fs = require('fs-extra');
        isMac = process.platform[0] === 'd'; // [d]arwin
        open = function(URL) {
            if (isMac) {
                exec('open "' + URL + '"');
            } else {
                exec(`explorer.exe "${URL}"`);
            }

            // log((isMac ? 'open "' : 'start "" "') + URL + '"');

        };
        LOG.enabled = true;
        if (!LOG.icons) {
            LOG.icons = {
                happy: '😃',
                cry: '😢',
                sad: '😩',
                angry: '😠',
                teeth: '😬',
                tiered: '😫',
                cool: '😎',
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
                "airplane": "🛩",
                "alarm": "⏰",
                "ambulance": "🚑",
                "anchor": "⚓",
                "angry": "😠",
                "anguished": "😧",
                "ant": "🐜",
                "antenna": "📡",
                "apple": "🍏",
                "apple2": "🍎",
                "atm": "🏧",
                "atom": "⚛",
                "babybottle": "🍼",
                "bad:": "👎",
                "banana": "🍌",
                "bandage": "🤕",
                "bank": "🏦",
                "battery": "🔋",
                "bed": "🛏",
                "bee": "🐝",
                "beer": "🍺",
                "bell": "🔔",
                "belloff": "🔕",
                "bird": "🐦",
                "blackflag": "🏴",
                "blush": "😊",
                "bomb": "💣",
                "book": "📕",
                "bookmark": "🔖",
                "books": "📚",
                "bow": "🏹",
                "bowling": "🎳",
                "briefcase": "💼",
                "broken": "💔",
                "bug": "🐛",
                "building": "🏛",
                "buildings": "🏘",
                "bulb": "💡",
                "bus": "🚌",
                "cactus": "🌵",
                "calendar": "📅",
                "camel": "🐪",
                "camera": "📷",
                "candle": "🕯",
                "car": "🚘",
                "carousel": "🎠",
                "castle": "🏰",
                "cateyes": "😻",
                "catjoy": "😹",
                "catmouth": "😺",
                "catsmile": "😼",
                "cd": "💿",
                "check": "✔",
                "cheqflag": "🏁",
                "chick": "🐥",
                "chicken": "🐔",
                "chickhead": "🐤",
                "circleblack": "⚫",
                "circleblue": "🔵",
                "circlered": "🔴",
                "circlewhite": "⚪",
                "circus": "🎪",
                "clapper": "🎬",
                "clapping": "👏",
                "clip": "📎",
                "clipboard": "📋",
                "cloud": "🌨",
                "clover": "🍀",
                "clown": "🤡",
                "coldsweat": "😓",
                "coldsweat2": "😰",
                "compress": "🗜",
                "confounded": "😖",
                "confused": "😕",
                "construction": "🚧",
                "control": "🎛",
                "cookie": "🍪",
                "cooking": "🍳",
                "cool": "😎",
                "coolbox": "🆒",
                "copyright": "©",
                "crane": "🏗",
                "crayon": "🖍",
                "creditcard": "💳",
                "cross": "✖",
                "crossbox:": "❎",
                "cry": "😢",
                "crycat": "😿",
                "crystalball": "🔮",
                "customs": "🛃",
                "delicious": "😋",
                "derelict": "🏚",
                "desktop": "🖥",
                "diamondlb": "🔷",
                "diamondlo": "🔶",
                "diamondsb": "🔹",
                "diamondso": "🔸",
                "dice": "🎲",
                "disappointed": "😞",
                "disk": "💾",
                "cry2": "😥",
                "division": "➗",
                "dizzy": "😵",
                "dollar": "💵",
                "dollar2": "💲",
                "downarrow": "⬇",
                "dvd": "📀",
                "eject": "⏏",
                "elephant": "🐘",
                "email": "📧",
                "envelope": "📨",
                "envelope2": "✉",
                "envelope_down": "📩",
                "euro": "💶",
                "evil": "😈",
                "expressionless": "😑",
                "eyes": "👀",
                "factory": "🏭",
                "fax": "📠",
                "fearful": "😨",
                "filebox": "🗃",
                "filecabinet": "🗄",
                "fire": "🔥",
                "fireengine": "🚒",
                "fist": "👊",
                "flower": "🌷",
                "flower2": "🌸",
                "flushed": "😳",
                "folder": "📁",
                "folder2": "📂",
                "free": "🆓",
                "frog": "🐸",
                "frown": "🙁",
                "gear": "⚙",
                "globe": "🌍",
                "glowingstar": "🌟",
                "good:": "👍",
                "grimacing": "😬",
                "grin": "😀",
                "grinningcat": "😸",
                "halo": "😇",
                "hammer": "🔨",
                "hamster": "🐹",
                "hand": "✋",
                "handdown": "👇",
                "handleft": "👈",
                "handright": "👉",
                "handup": "👆",
                "hatching": "🐣",
                "hazard": "☣",
                "headphone": "🎧",
                "hearnoevil": "🙉",
                "heartblue": "💙",
                "hearteyes": "😍",
                "heartgreen": "💚",
                "heartyellow": "💛",
                "helicopter": "🚁",
                "herb": "🌿",
                "high_brightness": "🔆",
                "highvoltage": "⚡",
                "hit": "🎯",
                "honey": "🍯",
                "hot": "🌶",
                "hourglass": "⏳",
                "house": "🏠",
                "huggingface": "🤗",
                "hundred": "💯",
                "hushed": "😯",
                "id": "🆔",
                "inbox": "📥",
                "index": "🗂",
                "joy": "😂",
                "key": "🔑",
                "kiss": "😘",
                "kiss2": "😗",
                "kiss3": "😙",
                "kiss4": "😚",
                "kissingcat": "😽",
                "knife": "🔪",
                "label": "🏷",
                "ladybird": "🐞",
                "landing": "🛬",
                "laptop": "💻",
                "leftarrow": "⬅",
                "lemon": "🍋",
                "lightningcloud": "🌩",
                "link": "🔗",
                "litter": "🚮",
                "lock": "🔒",
                "lollipop": "🍭",
                "loudspeaker": "📢",
                "low_brightness": "🔅",
                "mad": "😜",
                "magnifying_glass": "🔍",
                "mask": "😷",
                "medal": "🎖",
                "memo": "📝",
                "mic": "🎤",
                "microscope": "🔬",
                "minus": "➖",
                "mobile": "📱",
                "money": "💰",
                "moneymouth": "🤑",
                "monkey": "🐵",
                "mouse": "🐭",
                "mouse2": "🐁",
                "mouthless": "😶",
                "movie": "🎥",
                "mugs": "🍻",
                "nerd": "🤓",
                "neutral": "😐",
                "new": "🆕",
                "noentry": "🚫",
                "notebook": "📔",
                "notepad": "🗒",
                "nutandbolt": "🔩",
                "o": "⭕",
                "office": "🏢",
                "ok": "🆗",
                "okhand": "👌",
                "oldkey": "🗝",
                "openlock": "🔓",
                "openmouth": "😮",
                "outbox": "📤",
                "package": "📦",
                "page": "📄",
                "paintbrush": "🖌",
                "palette": "🎨",
                "panda": "🐼",
                "passport": "🛂",
                "paws": "🐾",
                "pen": "🖊",
                "pen2": "🖋",
                "pensive": "😔",
                "performing": "🎭",
                "phone": "📞",
                "pill": "💊",
                "ping": "❗",
                "plate": "🍽",
                "plug": "🔌",
                "plus": "➕",
                "police": "🚓",
                "policelight": "🚨",
                "postoffice": "🏤",
                "pound": "💷",
                "pouting": "😡",
                "poutingcat": "😾",
                "present": "🎁",
                "printer": "🖨",
                "projector": "📽",
                "pushpin": "📌",
                "question": "❓",
                "rabbit": "🐰",
                "radioactive": "☢",
                "radiobutton": "🔘",
                "raincloud": "🌧",
                "rat": "🐀",
                "recycle": "♻",
                "registered": "®",
                "relieved": "😌",
                "robot": "🤖",
                "rocket": "🚀",
                "rolling": "🙄",
                "rooster": "🐓",
                "ruler": "📏",
                "satellite": "🛰",
                "save": "💾",
                "school": "🏫",
                "scissors": "✂",
                "screaming": "😱",
                "scroll": "📜",
                "seat": "💺",
                "seedling": "🌱",
                "seenoevil": "🙈",
                "shield": "🛡",
                "ship": "🚢",
                "shocked": "😲",
                "shower": "🚿",
                "sleeping": "😴",
                "sleepy": "😪",
                "slider": "🎚",
                "slot": "🎰",
                "smile": "🙂",
                "smiling": "😃",
                "smilingclosedeyes": "😆",
                "smilingeyes": "😄",
                "smilingsweat": "😅",
                "smirk": "😏",
                "snail": "🐌",
                "snake": "🐍",
                "soccer": "⚽",
                "sos": "🆘",
                "speaker": "🔈",
                "speakeroff": "🔇",
                "speaknoevil": "🙊",
                "spider": "🕷",
                "spiderweb": "🕸",
                "star": "⭐",
                "stop": "⛔",
                "stopwatch": "⏱",
                "sulk": "😦",
                "sunflower": "🌻",
                "sunglasses": "🕶",
                "syringe": "💉",
                "takeoff": "🛫",
                "taxi": "🚕",
                "telescope": "🔭",
                "temporature": "🤒",
                "tennis": "🎾",
                "thermometer": "🌡",
                "thinking": "🤔",
                "thundercloud": "⛈",
                "tickbox": "✅",
                "ticket": "🎟",
                "tired": "😫",
                "toilet": "🚽",
                "tomato": "🍅",
                "tongue": "😛",
                "tools": "🛠",
                "torch": "🔦",
                "tornado": "🌪",
                "toung2": "😝",
                "trademark": "™",
                "trafficlight": "🚦",
                "trash": "🗑",
                "tree": "🌲",
                "triangle_left": "◀",
                "triangle_right": "▶",
                "triangledown": "🔻",
                "triangleup": "🔺",
                "triangularflag": "🚩",
                "trophy": "🏆",
                "truck": "🚚",
                "trumpet": "🎺",
                "turkey": "🦃",
                "turtle": "🐢",
                "umbrella": "⛱",
                "unamused": "😒",
                "uparrow": "⬆",
                "upsidedown": "🙃",
                "warning": "⚠",
                "watch": "⌚",
                "waving": "👋",
                "weary": "😩",
                "wearycat": "🙀",
                "whiteflag": "🏳",
                "wineglass": "🍷",
                "wink": "😉",
                "worried": "😟",
                "wrench": "🔧",
                "x": "❌",
                "yen": "💴",
                "zipperface": "🤐",
                "undefined": "",
                "": ""
            };
        }
        LOG.setFile = function(file) {
            var dirname, directoryExists;
            if (!(/[\/\\]/.test(file))) {
                file = path.join(os.tmpdir(), file);
            }
            dirname = path.dirname(file);
            directoryExists = true;
            try {
                fs.ensureDirSync(dirname);
            } catch (e) {
                if (e.code !== 'EEXIST') {
                    directoryExists = false;
                }
            }
            if (directoryExists) {
                LOG.stream = fs.createWriteStream(file, {
                    flags: 'a+',
                    defaultEncoding: 'utf8',
                    fd: null,
                    mode: 0o777,
                    autoClose: true
                });
                LOG.file = file;
                LOG.folder = dirname;
            } else {
                LOG.stream = LOG.file = directoryExists = false;
            }
        }; // end of setFile

        if (file) {
            LOG.setFile(file);
        }

        LOG.prettyTime = LOG.pt = function(t) {
            var h, m, s, ms;
            h = Math.floor(t / 3600000);
            m = Math.floor((t % 3600000) / 60000);
            s = Math.floor((t % 60000) / 1000);
            ms = t % 1000;
            t = (!t) ? "<1ms" : ((h) ? h + " hours " : "") + ((m) ? m + " minutes " : "") + ((s) ? s + " seconds " : "") + ((ms && (h || m || s)) ? " & " : "") + ((ms) ? ms + "ms" : "");
            return t;
        };

        LOG.open = function() {
            if (LOG.file) {
                open(LOG.file);
            }
        };

        LOG.openFolder = function() {
            if (LOG.folder) {
                open(LOG.folder);
            }
        };

        LOG.end = function() {
            if (LOG.stream) LOG.stream.end();
            LOG.stream = undefined;
        };

        LOG.write = function(message, status, icon) {
            if (!LOG.file || !LOG.enabled) {
                return false;
            }
            if (!LOG.stream) {
                LOG.setFile(LOG.file);
            }
            if (icon) {
                icon = ('' + icon).toLowerCase();
                icon = (icon in LOG.icons && LOG.icons[icon]) || '';
            } else {
                icon = '';
            }
            var date, count;
            count = (LOG.count > 999) ? "[" + LOG.count + "] " : ("   [" + LOG.count + "] ").slice(-7);
            status = '[' + status + '] \t';
            date = new Date();
            date = " \t[" + date + " " + date.getMilliseconds() + "ms]\n";
            LOG.stream.write(count + status + icon + message + date);
            LOG.count++;
        };

        LOG.stack = function(message) {
            var stack;
            message = message || 'Stack';
            stack = new Error().stack.replace(/Error/, message).replace(/    at/g, '                ').replace(/\n[^\n]+/, '');
            LOG.write(stack, 'STACK', 'CLIPBOARD');
        };

        LOG.count = LOG.count || 1;
        if (!LOG.statuses) {
            LOG.statuses = {
                L: "LOG",
                I: "INFO",
                W: "WARNING",
                C: "CRITICAL",
                CO: "CONSTANT",
                B: "BUG",
                F: "FUNCTION",
                V: "VARIABLE",
                T: "TIMER",
                S: "STACK",
                SP: "STOPPER",
                E: "ERROR",
                R: "RETURN",
                RE: "RESULT"
            };
        }
        if (message) {
            status = status ? status.toUpperCase() : 'L';
            status = status in LOG.statuses && LOG.statuses[status] || status;
            LOG.write(message, status, icon);
        }
    }; // end of LOG

    LOG.file = logFile;
    LOG();
    return LOG;
}; // end of LogFactory