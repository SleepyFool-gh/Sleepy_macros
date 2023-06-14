# `<<p>>` Macro

A container macro that attempts to automatically wrap any unprocessed raw text enclosed into individual `<p>` elements so you don't have to.

&nbsp;

### Default behavior:
Blocks of text enclosed by the `<<p>>` macro are individually wrapped in `<p>` elements. By default, it attempt to process lines with unclosed elements or macros after they get added to the page, but you can optionally turn this off by supplying `false` if you're seeing odd behavior. Pre-wrapped lines are ignored.
    
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

<<p false>>

    Post processing turned off
    
    Affects processing of lines like <<if true>> this

    and this <</if>>

    as well as <div style='display: inline'>this</div>

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
