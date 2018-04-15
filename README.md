# CSTK© README #
## Created by Trevor [Creative Scripts](https://creative-scripts.com) ##

* CSTK© Version 2

![][CSTK2]

### What is this repository NOT for? ###

* Text editing, developing and testing projects. Use an appropriate text editor and developing environment for that.

### What is this repository for? ###

* An in app console for JSX, JSX and CMD / Bash.
* This is convenient for checking out and changing DOM properties and testing out the JS compatibilities of a given app version.
    * The JSX console now shows useful error messages even with InDesign (Error, line# and source line)
    * `$.writeln` and `$.write` are now forwarded to the console and can include css `$.writeln('Hi there', 'background: yellow; color: blue;')`
    * The `$.writeln()` and `$.write()` and `__log()` `__error()` and `__result()` methods will output to the console and automatically stringify objects and arrays.

    ![][howdey]
    * `$.props()` will give useful info on selected item or other target, see [below](#console) for details.
    * `__log('hi')` works in both JSX and JS consoles can also include css and class `__log('foo', 'background: yellow', 'error')`
    * `__error()` same as `__log()` just with the error class applied (comes out red)
    * `__result(err, result, stderr)` useful for JS callbacks `fs.someFunction('somethingHere', __result)`
    * For JS console can use `Jfy(myObject)` instead of `JSON.stringify(myObject)`
    * Can use some node modules without the need to require. (fs, exec, path, os, spawn)
    * The bash / cmd shell console is good where administrative rights are not needed on the Mac you can pipe a password into sudo using `echo "your_password" | sudo -S -k <command>` see the answer of user393365 [here](https://superuser.com/questions/67765/sudo-with-password-in-one-command-line) before you do that.
* Some useful Adobe HTML Extensions tools.
    * Easily open extensions in CefClient or Chrome for debugging
    * Set debug and log levels
    * Easily open extensions with Finder / Explorer or your favorite text editor
    * Opens extensions log file and the log folder
* Works of most of the Adobe CC apps (Including Ai, Ic, Id, Ps, Pp, Ae).

### How do I get set up? ###

**The best way to set up is to clone the repository to a repository folder and create a symbolic link in the CEP extensions folder to the repositories com.creative-scripts.cstk sub-folder.**

#### Mac ####
**Note because you need administrative rights use a normal terminal and not CSTK's shell console**
```Shell
mkdir -p "/Users/TREVOR/repositories"
cd "/Users/TREVOR/repositories"
git clone https://github.com/Trevor-/CSTK.git
sudo ln -s "/Users/TREVOR/repositories/CSTK/com.creative-scripts.cstk" "/Library/Application Support/Adobe/CEP/extensions/CSTK"
```

#### Windows ####
**Note because you need administrative rights use CMD as administrator (Type cmd in Windows search and then right click and choose run as administrator) and not CSTK's shell console**
```
if not exist "C:\Users\TREVOR\repositories" md "C:\Users\TREVOR\repositories"
cd "C:\Users\TREVOR\repositories"
git clone https://github.com/Trevor-/CSTK.git
mklink /J  "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK"  "C:\Repositories\CSTK\com.creative-scripts.cstk"
```

**Replace TREVOR with your user name!**

**After you have done that one time then to update the extension just `cd` to the CSTK repository folder and type `git pull`**

**If you are a real beginner "developer" and can't handle the above then:**
Follow the instructions [here](http://creative-scripts.com/cstk-in-adobe-app-console-and-tool#install)

#### How do set the debug mode? ####
* The extension is now signed so you know longer need to do this.

### Usage Instructions ###

**Mess around until you get the idea.**
**See the video on [this](http://creative-scripts.com/cstk-in-adobe-app-console-and-tool) page.**

##### Console #####
* Make sure you have the correct console mode selected.
* You can press Shift + Enter to execute selected lines.
* To execute the entire contents of the console on Mac use Option⌥+Enter on Windows use Ctr+Shift+A or on both you can click the Execute button.
* Note that the J
SX mode runs in a persistent engine remembers what it's feed until you restart the app.
    * What will happen if you execute a global `const foo = 123` and then 15 years (not a long time in the history of ExtendScript) later (unless you restarted the app in the meantime) tried `const foo = 456`?
* The JSX console has some built in functions including the `$.props()` method. This method provided a very convenient way of finding out the properties of a selected item or any target for that matter.
![][props]
    * By default on apps that have the `app.selection` property if an object is selected then `app.selection[0]` will be the target and if that is undefined depending on the app the `app.selection` will be the target and if there's no selection then the target will just default to `app`.
    * One can specify a target in the form of a DOM object `$.props(app.documents[0])` this will list all the properties of document 0.
    * One can filter the result `$.props(app.documents[0], 'fullName', 'id')` if you only want some of them.
    * In InDesign Enums are provided in the form of `<integer> /* Enum.CONSTANT */` for example `rgbPolicy: 1129345136 /* ColorSettingsPolicy.PRESERVE_EMBEDDED_PROFILES */`
    * One can _build_ on the `app.selection[0]` default by including an array to specify the target for example `$.props(['transparencySettings', 'blendingSettings'])`
* The both the JSX and JS modes contain the functions `__log(message, css, class)` `__error(message, css)` and `__result(error, result, stderr)`  which will stringify objects and arrays.
* The `__result(error, result, stderr)` function is very useful for callbacks in the JS console which will display error, result and stderr.

![][result]
* The JSX console handles binary files so if you enjoy writing your code in binary you can have a great time.
* JS mode **DOES NOT REMEMBER** var's let's cont's from one line to the next so select all the lines you want to run so either run snippets by selecting multiple lines or just use globals.
* Restarting the extension with the restart ![][RestartBT] button will cause all the globals to be forgotten.
* **NOTE** once a script has started it's going to be tough to stop it, a shell script is going to be even harder to stop. For JSX and JS scripts you can force close the app :no_mouth: for shell you can try force close the computer  :rage:
* The **Shell** terminal is somewhat primitive it's good for very basic stuff and was mainly written to fulfill my curiosity. Maybe some year I'll look into implementing [node-webterm](https://github.com/Gottox/node-webterm) which would be much better or even more likely maybe I'll just remove the shell console.  :unamused:

![][Shell]

##### Extensions Tools #####
* To get to the extensions tools click the ![][ExToolsBT] button to go back to the console click the ![][ConsoleBT] button.
![][tools]
* To set debug and log levels for a CEP version select the levels and version from the dropdowns and click the **SET** button.
* To debug extensions the extension you want to debug must be active at the time the list was generated. If you don't see the ![][DebugBT] next to the extension you want to debug, make sure the extension is active and then click the ![][RefreshBT] button. You should then seen it.

![][ExButtons]
* Choose you debug app that should automatically be listed in the dropdown and then click the debug button. If you're on the Mac and using a cefclient it will start minimized so you need to click on the cefclient icon in that shows up in the dock.

![][cefclient]

![][debug]
* Use your common sense for what the other buttons do.
* **DO NOT** mess up the built in Adobe modules.
* **DO NOT NO MATTER WHAT** look at the Adobe files that start with "Private and Confidential".


### Contribution guidelines ###

* DIY

### Who do I talk to? ###

* Yourself

### License ###

* Don't forget to pay! There's a ![][PayPalBT] button on the extension, I don't mind if you use it for a year without coughing up but after that if you find the extension useful make sure to pay ($10 for now).
* If you nick any snippets from the code please at least put a credit with a link to this page in your binary code.
* Do not sue.
* Do not complain.
* Use with care.
* **No liability accepted NO MATTER WHAT.**
* Any disputes to be settled by my dad.
* Copyright Trevor [Creative Scripts](https://creative-scripts.com)

### Change Log ###



Version 2.1 (16 April 18)
* Improved error handling for jsx console
* `__jsx` function from the js console for better processing of `jsx.evalScript` and `jsx.evalFile` methods.
* `__doc()` method from jsx console to retrieve a document `__doc()` is shortcut for `app.documents[0]` `__doc(10)` is same as `app.documents[10]`
* `__sel()` method from jsx console to retrieve the current selection `__sel()` is shortcut for `app.selection[0]` (In Illustrator in cases where app.selection[0] is undefined and app.selection is not undefined then `app.selection` will be returned) `__sel(10)` is same as `app.selection[10]`

Version 2

OK a very lot changed between version 1 and 2 and I've spent too much time on the project as is to list them so for now make do with a `git diff`

For the next version I'll try and be more helpful.

### Final Note ###

Please judge me favorably. My annotations and general writing are much less sloppy when I get paid for what I'm doing!

[howdey]: ./Resources/MDImages/howdey.png
[props]: ./Resources/MDImages/props.png
[result]: ./Resources/MDImages/result.png
[RestartBT]: ./Resources/MDImages/RestartBT.png
[ExToolsBT]: ./Resources/MDImages/ExToolsBT.png
[ConsoleBT]: ./Resources/MDImages/ConsoleBT.png
[tools]: ./Resources/MDImages/tools.png
[DebugBT]: ./Resources/MDImages/DebugBT.png
[RefreshBT]: ./Resources/MDImages/RefreshBT.png
[ExButtons]: ./Resources/MDImages/ExButtons.png
[debug]: ./Resources/MDImages/debug.png
[PayPalBT]: ./Resources/MDImages/PayPalBT.png
[cefclient]: ./Resources/MDImages/cefclient.png
[Shell]: ./Resources/MDImages/Shell.png
[CSTK2]: ./Resources/MDImages/CSTK2.gif