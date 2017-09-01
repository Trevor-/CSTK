# CSTK© README #
## Created by Trevor [Creative Scripts](https://creative-scripts.com) ##

* CSTK© Version 1

![][consoleGif]

### What is this repository for? ###

* Faffing around, learning and helping to write Adobe HTML Extensions
* On app console for JS, JSX and Shell Bash.
* You can debug your extensions a bit.
* You can rip off a bit of the code here an include it in your own extensions but if you leave it exposed when not in debug mode then you must include a link to this file.
* Lists all the apps loaded extensions with buttons to open their folders.
* Button to open the log folder.
* Works of nearly all of the Adobe CC apps.

![][console]
![][extensions]

### How do I get set up? ###

* Plonk and unzip the zip file in the extensions folder
* Mac /Library/Application Support/Adobe/CEP/extensions or ~/Library/Application Support/Adobe/CEP/extensions
* Windows C:\Program Files\Common Files\Adobe\CEP\extensions or C:\Users\{USER}\AppData\Roaming\Adobe\CEP\extensions (for pre CEP 6.1 C:\Program Files (x86)\Common Files\Adobe\CEP\extensions)

#### How do set the debug mode? ####
* The extension's not signed and **WILL NOT WORK** unless the debug mode is set, so set to debug mode!
### The examples here or for CEP7<br>For CEP8 you use CSXS.8 instead of CSXS.7<br>What will you need to do for CEP9? 😕
* **Mac**: In **Terminal**
````Shell
defaults write com.adobe.CSXS.7.plist PlayerDebugMode 1
defaults write com.adobe.CSXS.7.plist LogLevel 6
killall -u `whoami` cfprefsd
````
* **Windows**: In **CMD (Command line)**
```` bash
reg add HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.7 /t REG_SZ /v PlayerDebugMode /d 1 /f
````
If your a chicken 🐔 you can use RegEdit, edit or add the `PlayerDebugMode` entry of type "string" with the value of "1" to the `HKEY_CURRENT_USER/Software/Adobe/CSXS.7` key.

![][regedit]

#### How do set the log level? ####

Logging levels can be modified as per the following levels:
+ 0 - Off (No logs are generated)
+ 1 - Error (the default logging value)
+ 2 - Warn
+ 3 - Info
+ 4 - Debug
+ 5 - Trace
+ 6 - All

* **Mac**: In **Terminal**
````Shell
defaults write com.adobe.CSXS.7.plist LogLevel 6
killall -u `whoami` cfprefsd
````
* **Windows**: In **CMD (Command line)**
```` bash
reg add HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.7 /t REG_SZ /v LogLevel /d 6 /f
````
If your a chicken you can use RegEdit, edit or add the `LogLevel` entry of type "string" with the value of "6" or whatever log level you want to the `HKEY_CURRENT_USER/Software/Adobe/CSXS.7` key.

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

* Do not sue.
* Do not complain.
* Use with care.
* No liability accepted NO MATTER WHAT.
* Any disputes to be settled by my dad.
* Copyright Trevor [Creative Scripts](https://creative-scripts.com)

[regedit]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/06f14ee3-fa9c-411e-85bf-dce61c8ec9bd/regedit_small.png
[consoleGif]: http://creative-scripts.com/wp-content/uploads/2017/09/CSTK-GIF.gif

[console]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/09b3efde-0bd3-4dc1-8b00-331f28c81398/CSTK%20Console.png
[extensions]: https://content.screencast.com/users/dtrevor1/folders/Snagit/media/bfd23e15-486f-4ce9-819c-e0aaf2c445e3/All%20extensions.png