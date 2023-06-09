# `<<newhr>>` Macro

A macro which generates an `<hr>` divider while removing old `<hr>`'s created this way. Useful for showing a clear divider before new content.

&nbsp;

### Default behavior:
Calling `<<newhr>>` removes all `<hr>`'s previously created by this macro. It then produces a new `<hr>` where it is called. The appearance of the `<hr>` generated can be modified by editing the CSS for `hr.macro-newhr`.

&nbsp;    

### Usage:
```html
:: Basic_Usage
<<newhr>>

```

&nbsp;

### Examples:
```html
:: Example_1
<!-- appending content with a new content line above to show it -->

I woke up this morning.
<div id='newContent'></div>
<<newhr>>

<<link 'Next'>>
    <<append '#newContent'>>
        <<newhr>>
        Then I made coffee.
    <</append>>
<</link>>
```