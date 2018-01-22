# CSTK© README #
## Created by Trevor [Creative Scripts](https://creative-scripts.com) ##

* CSTK© Version 2

![][howdey]

### What is this repository for? ###

* On app console for JSX, JSX and CMD / Bash.
    * The JSX console now shows useful error messages even with InDesign (Error, line# and source line)
    * `$.writeln` and `$.write` are now forwarded to the console and can include css `$.writeln('Hi there', 'background: yellow; color: blue;')`
    * `$.props()` will give useful info on selected item or other target, see below for details.
    * `__log('hi')` works in both JSX and JS consoles can also include css and class `__log('$#^8SDG@%', 'background: yellow', 'error')`
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
* Works of most of the Adobe CC apps (Including Ai, Ic, Id, Ps, PP, Ae).

### How do I get set up? ###

**The best way to set up is to clone the repository to a repository folder and create a symbolic link in the CEP extensions folder to the repositories com.creative-scripts.cstk sub-folder.**

#### Mac ####
**Note because you need administrative rights use a normal terminal and not CSTK's shell console**
```Shell
mkdir -p "/Users/TREVOR/repositories/"

cd "/Users/TREVOR/repositories/"
git clone https://github.com/Trevor-/CSTK.git
sudo ln -s "/Users/TREVOR/repositories/CSTK/com.creative-scripts.cstk" "/Library/Application Support/Adobe/CEP/extensions/CSTK"
```

#### Windows ####
**Note because you need administrative rights use CMD as administrator (Type cmd in Windows search and then right click and choose run as administrator) and not CSTK's shell console**
```Shell
if not exist "C:\Users\TREVOR\repositories\" md "\Users\TREVOR\repositories\"
cd "\Users\TREVOR\repositories\"
git clone https://github.com/Trevor-/CSTK.git
mklink /J  "C:\Program Files\Common Files\Adobe\CEP\extensions\CSTK"  "C:\Repositories\scratchpad\com.creative-scripts.cstk"
```

**Replace TREVOR with your user name!**

**After you have done that one time then to update the extension just `cd` to the CSTK repository folder and type `git pull`**

**If you are a real beginner "developer" and can't handle the above then:**
Plonk and unzip the zip file in the CSTK.zip folder into
* Mac /Library/Application Support/Adobe/CEP/extensions or ~/Library/Application Support/Adobe/CEP/extensions
* Windows C:\Program Files\Common Files\Adobe\CEP\extensions or C:\Users\{USER}\AppData\Roaming\Adobe\CEP\extensions (for pre CEP 6.1 C:\Program Files (x86)\Common Files\Adobe\CEP\extensions)

**If you are a real real beginner "developer" and can't handle the above then: search for some installer tool to install the com.creative-scripts.cstk.zxp file**


#### How do set the debug mode? ####
* The extension is now signed so you know longer need to do this.

### Usage Instructions ###

* Mess around until you get the idea.
* You can press Shift + Enter to process the selected lines or press one of the eval buttons.
* Note that the JSX mode remembers from one line to the next.
* `var a = 'Hello';` Shift + Enter `alert(a);` Shift + Enter ==> alerts "Hello"
* JS mode **DOES NOT REMEMBER** from one line to the next.
* `var a = 'Hello';` Shift + Enter `alert(a);` Shift + Enter ==> alerts **ERROR**
* To run those to lines in JS mode either click the JS EVAL button or select at least part of both line and then Shift + Enter
* Same applies to Shell mode.
* **DO NOT** mess up the built in Adobe modules.
* **DO NOT NO MATTER WHAT** look at the Adobe files that start with "Private and Confidential".

### Contribution guidelines ###

* DIY

### Who do I talk to? ###

* Yourself

### License ###

* Don't forget to pay! There's a PayPal button on the extension, I don't mind if you use it for a year or 2 without coughing up but after that if you find the extension really useful make sure to pay.
* Do not sue.
* Do not complain.
* Use with care.
* No liability accepted NO MATTER WHAT.
* Any disputes to be settled by my dad.
* Copyright Trevor [Creative Scripts](https://creative-scripts.com)

### Change Log ###

[howdey]: ./Resources/MDImages/howdey.png

[regedit]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/06f14ee3-fa9c-411e-85bf-dce61c8ec9bd/regedit_small.png
[consoleGif]: http://creative-scripts.com/wp-content/uploads/2017/09/CSTK-GIF.gif

[console]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/09b3efde-0bd3-4dc1-8b00-331f28c81398/CSTK%20Console.png
[extensions]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/bfd23e15-486f-4ce9-819c-e0aaf2c445e3/All%20extensions.png