# `<<p>>` Macro

## THIS MACRO IS A WORK IN PROGRESS. EXPECT THINGS TO BREAK.

A container macro that attempts to automatically wrap any unprocessed raw text enclosed into individual `<p>` elements so you don't have to.

&nbsp;

### Default behavior:
Blocks of text enclosed by the `<<p>>` macro are individually wrapped in `<p>` elements. Pre-wrapped lines are ignored. By default, the `<p>` block delimiter is set to line breaks or 3 spaces (a tab is sufficient on most interfaces) using the RegExp `[\r\n]+|[ ]{3,}`, but you may supply your own expression as an optional argument. This does mean if you have the `nobr` setting enabled, the tab or your own delimiter is mandatory.
    
&nbsp;    

### Usage:
```html
:: Basic_Usage
<<p>>

    p1: raw text

    p2: text with <span>span</span>

    <div>div that will be ignored</div>

    etc.

<</p>>

<<p '-->'>>

--> custom delimiter enabled

--> line breaks will no longer count as separate blocks

    and this line will be combined with the one above it

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
