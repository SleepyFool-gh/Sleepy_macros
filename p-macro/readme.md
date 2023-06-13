# `<<p>>` Macro

A container macro that attempts to automatically wrap any unprocessed raw text enclosed into individual `<p>` elements so you don't have to.

&nbsp;

### Default behavior:
Blocks of text enclosed by the `<<p>>` macro are individually wrapped in `<p>` elements. By default, it ignores lines with broken (unclosed) macros or HTML elements, but you can have the macro attempt to process these lines as well by supplying `true` as an argument. Whether you have `nobr` turned on or not does not affect the default behavior.
    
&nbsp;    

### Usage:
```html
:: Basic_Usage
<<p>>

    1st block of raw text to be wrapped

    2nd block of raw text

    etc.

<</p>>

<<p true>>

    Post processing turned on

    Attempts to process broken <<if true>> lines like this one

    <</if>> and this one. 

<</p>>
```

&nbsp;

### Examples:
```html
:: Example_1
<<p>>

    This is a paragraph.

    This is another paragraph.

    Each of these will get wrapped into their own p blocks and now this is a <<link 'text'>><</link>>

<</p>>

```
