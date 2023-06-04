# SELECT Macro

A replacement for the native `<<choice>>` macro which runs code and appends content instead of navigating to passages. `<<select>>` creates a link which removes all other links in its group when selected.

&nbsp;

### Default behavior:
Clicking a link produced by the `<<select>>` macro replaces the link with its contents. It then removes all other links in the same group. The default group is 'default' but you can optionally specify a group as a second argument. Links in a group only remove other links in the same group as itself.
    
&nbsp;    

### Examples:
```html
:: Example_1
<!-- selecting any one of these will remove the rest -->

<<select 'Take the left path.'>>
    You turned left.
<</select>>
<<select 'Take the right path.'>>
    You turned right.
<</select>>
<<select 'Take the center path.'>>
    You stayed the course.
<</select>>



:: Example_2
<!-- selecting the 1st or 2nd link will remove ONLY the first two links,
     selecting the 3rd or 4th link will remove ONLY the latter two links -->

<!-- entree selection -->
<<select 'Order a burger.' 'entree'>>
    A savory burger. Normal, but delicious.
<</select>>
<<select 'Order the steak.' 'entree'>>
    A dry steak. Expensive because it wasn't you who cooked it.
<</select>>

<!-- dessert selection -->
<<select 'Order a crème brûlée.' 'dessert'>>
    The thing you can't even spell properly. It was yummy nonetheless.
<</select>>
<<select 'Order ice cream.' 'dessert'>>
    Creamy ice cream. It's never a bad time for ice cream.
<</select>>

```
