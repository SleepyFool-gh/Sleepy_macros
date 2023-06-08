# SELECT Macro

A replacement for the native `<<choice>>` macro which runs code and appends content instead of navigating to passages. `<<select>>` creates a link which removes all other links in its group when selected.

&nbsp;

### Default behavior:
Clicking a link produced by the `<<select>>` macro replaces the link with its contents. It then removes all other links in the same group. The default group is 'default' but you can optionally specify a group as a second argument. Links in a group only remove other links in the same group as itself.
    
&nbsp;    

### Usage:
```html
<<select 'link text' 'optional_group_id'>>
    ...content that replaces this link when clicked
<<alternate>>
    ...optional content that replaces this link when OTHER links in the same group are clicked
<</select>>
<!--    group_id defaults to 'default' when not specified
        group_id MUST only be one word, no spaces
        group_id MUST only include CSS valid characters -->
```

&nbsp;

### Examples:
```html
:: Example_1
<!-- basic usage:
        -> selecting any one of these will remove the others -->

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
<!-- multiple simultaneous groups:
        -> selecting the 1st or 2nd link (entree selection) will remove ONLY the first two links,
        -> selecting the 3rd or 4th link (dessert selection) will remove ONLY the latter two links -->

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


:: Example_3
<!-- links with alternate content:
        -> selecting the 1st link (Save Anya) will replace it with its contents
           then, the 2nd link will replace with its ALTERNATE content
           and, the 3rd link will then be removed as it has no alternate content 
        -> selecting the 2nd link (Save Yor) will replace it with its DEFAULT contents,
           the alternate content WILL NOT BE USED
           then, the 1st and 3rd link will be removed -->

<!-- maidens in distress! -->
<<select 'Save Anya'>>
    You catch Anya just before she flops to the floor.
<</select>>
<<select 'Save Yor'>>
    Yor stutters a thanks while holding your hand.
<<alternate>>
    Yor backflips into position, she didn't need your help anyway.
<</select>>
<<select 'Save Bond'>>
    Woof woof!
<</select>>

```