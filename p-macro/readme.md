# `<<p>>` Macro

A container macro that attempts to automatically wrap any unprocessed raw text enclosed into individual `<p>` elements so you don't have to.

&nbsp;

### Default behavior:
Blocks of text enclosed by the `<<p>>` macro are individually wrapped in `<p>` elements. Pre-wrapped lines are ignored. The `.p-macro` class gets added to each `<p>` block generated with the macro. `<br>` elements are skipped in the wrap process, but you can put them inside `<p>` blocks.

By default, the macro separates `<p>` block by line break or a line indent consisting of at least 3 consecutive spaces (a tab works on most interfaces) using the RegExp `'\\n+|[ ]{3,}'`, but you can supply your own expression to act as a custom delimiter using an optional string argument. 

**Note:** If you use `nobr`, the line indent or your own delimiter is *required*, since line breaks get removed by SugarCube and can no longer be used to identify the start and end of new `<p>` blocks.

**Note:** Placing an `<<include>>` (or similar which pulls content from another passage) inside a `<<p>>` container will NOT wrap said content with individual `<p>` elements. The macro will wrap the *entirety* of the included content in one big `<p>` — block elements inside the included content will create empty `<p>` blocks as a result. However, `<<include>>`ing a passage with a `<<p>>` call inside it will work just fine — as long as the `<<include>>` call itself is not inside another `<<p>>`.

&nbsp;    

### Usage:
```html
:: Basic_Usage
<<p>>

    p1: raw text

    p2: text with an <span style='display:inline-flex'>inline flex</span>

    <p>p3: pre-wrapped p that will be ignored</p>

    <div>div block element that will also be ignored</div>

    <<include 'another_passage'>> <!-- this WILL NOT work, inside <<p>> container -->

<</p>>

<<include 'Custom_Delimiter'>> <!-- but this WILL work, included passage has a <<p>> call -->


:: Custom_Delimiter
<<p '-->'>>

--> p1: custom delimiter enabled

--> p2: line breaks will no longer count as separate blocks

    and this line will be combined with the one above it

--> p3: the delimiter itself gets removed on process

<</p>>
```

&nbsp;

### Examples:
```html
:: Example_1
<<p>>

    p1: This is a p block

    p2: This will be on the same line <<if true>> as this

    p3: but this will be its own p

    p4: this will be another p <</if>> though this is also on p4

    p5: This p has a link <<link 'click me'>><<append '#new'>>

            beware this will NOT be wrapped

            <<p>> 
                
                p6: but this will be wrapped
                
                p7: and this too
                
            <</p>>

    <</append>><</link>> and this text will still be on p5

<</p>>

<div id='new'></div>

```

&nbsp;

Many thanks to SjoerdHekking & Hituro for helping me clean, troubleshoot, & improve this macro.
