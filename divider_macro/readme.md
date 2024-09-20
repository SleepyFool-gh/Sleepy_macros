# `<<divider>>` Macro

A macro which generates a divider while hiding old ones created this way. Useful for showing a clear marker for new content.

&nbsp;

### Default behavior:
Calling `<<divider>>` creates an `<hr>` where it is called and hides all the old `<hr>`s created using this macro. The keyword `t8n` or `transition` controls whether these dividers animate in & out.

All dividers created by the macro have the `.macro-divider` class which controls what the divider looks like. The newest divider created has the `.macro-divider-in` class while all the old dividers have the `.macro-divider.out` class. These two classes control the animations and what the dividers look like after they have been hidden. Technically, the animations run even without the keyword, just with zero duration.

&nbsp;    

### Usage:
```html
:: Basic_Usage
<<divider>>
<!-- default no animation -->

<<divider t8n>>
<!-- animation on -->
     

```

&nbsp;

### Examples:
```html
:: Example_1
<!-- appending content with a new content line above to show it -->

I woke up this morning.
<div id='newContent'></div>

<<link 'Next'>>
    <<append '#newContent' t8n>>
        <<divider t8n>>
        Then I made coffee.
    <</append>>
<</link>>
```