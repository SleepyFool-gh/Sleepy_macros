# `<<divider>>` Macro

A macro which generates a divider while hiding old ones created this way. Useful for showing a clear marker for new content.

&nbsp;

### Default behavior:
Calling `<<divider>>` creates an `<hr>` where it is called and hides all the old `<hr>`s created using this macro. The keyword `t8n` or `transition` controls whether these dividers animate in & out.

The CSS class `.macro-divider` is added to every divider created by the macro. The newest divider created has the CSS class `.macro-divider-in` while all the old dividers have the CSS class `.macro-divider.out`. These classes also control the animation. Technically, these animations still run with animations turned off, just with zero animation duration.

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