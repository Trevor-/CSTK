#Change log#


##Version 2.1##
##16 April 18##

* Improved error handling for jsx console
* `__jsx` function from the js console for better processing of `jsx.evalScript` and `jsx.evalFile` methods.
* `__doc()` method from jsx console to retrieve a document `__doc()` is shortcut for `app.documents[0]` `__doc(10)` is same as `app.documents[10]`
* `__sel()` method from jsx console to retrieve the current selection `__sel()` is shortcut for `app.selection[0]` (In Illustrator in cases where app.selection[0] is undefined and app.selection is not undefined then `app.selection` will be returned) `__sel(10)` is same as `app.selection[10]`

##Version - 2##
##19-Oct-17##

+Fully workingUpdated for CEP8
+Can set and get debug and log levels
+UI improvements
