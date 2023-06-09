# SELECT Macro

A replacement for the native `<<choice>>` macro which runs code and appends content instead of navigating to passages. `<<select>>` creates a link which removes all other links in its group when selected.

&nbsp;

### Default behavior:
Clicking a link produced by the `<<select>>` macro replaces the link with its contents. It then removes all other links in the same group (or replaces them with their optional alternate content). A `<<select>>` link, when clicked, only removes other links in the same group as itself, but remove all links in all groups it belongs to.
    
&nbsp;    

### Usage:
```html
:: Basic_Usage

<<select 'link text' 'optional_group_id'>>
    ...content that replaces this link when clicked
<<alternate>>
    ...optional content that replaces this link when ANOTHER link in 'optional_group_id' is clicked 
<</select>>
<!--    group_id defaults to 'default' when not specified
        a group_id MUST only be one word
        a group_id MUST only include CSS valid characters -->


<<selectRemove 'group_id'>>
<!--    removes all <<select>> links associated with the provided group_id -->



:: Advanced_Usage

<<select 'link text' 'group_id1 group_id2 group_id3'>>
    ...content that replaces this link when clicked
<<alternate 'group_id2'>>
    ...optional content that replaces this link when ANOTHER link in 'group_id2' is clicked
<<alternate>>
    ...default optional content used as alternate replacement for the groups that DON'T have SPECIFIC alternate defined above (here, 'group_id1' or 'group_id3')
<</select>>
<!--    when using multiple group_id's, they MUST be a space separated list
        default alternate replacement text MUST come last, AFTER any specific group_id alternate replacements
        when a select link is clicked, it triggers remove or alternate replacements in ALL groups it belongs to-->
```

&nbsp;

### Examples:
```html
:: Example_1
<!-- basic usage:
        -> selecting any one of these will remove the others -->

<!-- a fork in the road -->
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
           then, the 2nd link will be replaced with its ALTERNATE content
           and, the 3rd link will be removed (no alternate content)
        -> selecting the 2nd link (Save Yor) will replace it with its normal replace contents,
           the alternate replacement WILL NOT BE USED
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



:: Example_4
<!-- manually removing groups:
        -> selecting the 1st link (high five) removes the handshake option
        -> selecting the 2nd link (handshake) removes both high five and right hand options -->

<!-- a social encounter! -->
<<select 'Give a high five with your left hand' 'lh'>>
    He returns your greeting, the slap is resounding.
<</select>>
<<select 'Give a handshake with your left' 'lh'>>
    He frowns and grabs your right hand instead, "Handshakes are down with the right, my friend."
    <<selectRemove 'rh'>>
<</select>>
<<select 'Give a thumbs up with your right hand' 'rh'>>
    You give a him a solid thumbs up.
<</select>>



:: Example_5
<!-- putting everything together, with code:
        -> trying to open the box triggers the trap and removes the option for the player to leave
        -> smashing the box causes removes the option to open it or to take it with you
           it also causes a cave in and removes the option to go further in
        -> taking the box removes the option to smash it, 
           but they can still try to open it, which will triggers the trap as before
        -> going further in removes the options to interact with the mechanism IF you did not take it with you
           you CANNOT go further in and then pocket the box
           but you CAN pocket the box first and then go further in
        -> leaving the cave removes the option interact with the mechanism and the option to go further in
           but if you took the box with you, you can now open it -->

<!-- adventure! -->
An intricate mechanism of twin mallets stands before you. A small box is precariously balanced in the middle. If you just tipped one side a little bit...

<<select 'Open the box' 'trap box'>>
    The box remains locked despite your attempts. You've triggered a trap!
    <<set $trapTriggered = true>>
<<alternate 'trap'>>
    <<linkreplace 'Open the box'>>
        The box opens! Inside you find a small jewel.
    <</linkreplace>>
<</select>>
<<select 'Smash the box' 'mechanism cavein'>>
    The box screams and the cave rumbles!
    <<selectRemove 'box'>>
<</select>>
<<select 'Free the box and take it with you' 'mechanism'>>
    You pocket the small box, it whispers ominously.
    <<set $tookBox = true>>
<</select>>
<<select 'Go further in' 'cavein route'>>
    <<if $trapTriggered>>
      The way back is blocked, your only option is forward.
    <<else>>
      You venture forth.
    <</if>>
    <<selectRemove 'mechanism'>>
    <<if ! $tookBox>>
        <<selectRemove 'box'>>
    <</if>>
<<alternate>>
    You need to leave NOW!
    <<set $cavein = true>>
<</select>>
<<select 'Turn around and leave the cave' 'trap'>>
    <<if $cavein>>
        You run out with boulders at your heel.
    <<else>>
        You decide this is enough adventuring for today.
    <</if>>
    <<selectRemove 'mechanism'>>
    <<selectRemove 'route'>>
<</select>>



```
