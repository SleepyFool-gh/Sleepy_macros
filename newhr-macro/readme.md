# `<<newhr>>` Macro

A macro which generates an `<hr>` divider while hiding old `<hr>`'s created this way. Useful for showing a clear divider before new content.

&nbsp;

### Default behavior:
Calling `<<newhr>>` hides all `<hr>`'s previously created by this macro by setting max-height and opacity to zero. It then produces a new `<hr>` where it is called. The appearance of the `<hr>` generated can be modified by editing the CSS for `hr.macro-newhr`. Optionally, the `<hr>`'s can animate in & out.

&nbsp;    

### Usage:
```html
:: Basic_Usage
<<newhr>>
<!-- animation off by default, supplying false produces the same behavior -->

<<newhr true>>
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
    <<append '#newContent'>>
        <<newhr>>
        Then I made coffee.
    <</append>>
<</link>>
```