Inline Submit Widget
====================

The purpose of this widget is to enable saving of a user's work as they edit a form, rather than having the user press a save button.
When the user edits an enhanced input value a post is made to the form containing the input with two values.

 1. propertyName - the name attribute value of the edited input (or id if no name present).
 2. propertyValue - the value of the edited input.

This widget supports text inputs, textarea, select lists, and radio buttons.  When an input begins saving, finishes saving, or fails at saving a container element is placed after the input that can be styled as you wish.  A few seconds after a successful save the success element disappears.  

For each of the three statuses the widget automatically uses a span with specific style names so that all you need to do is add the styles to your stylesheet.  However, you can override the element html added for each of the three statuses.  Sample styles are included.