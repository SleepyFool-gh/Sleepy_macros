Macro.add('p', {
    tags    :   null,
    handler() {

        console.log(this.payload[0].contents);

        const _frag = document.createDocumentFragment();
        const _contents = this.payload[0].contents.trim();

        let _output = _contents
                            .split(/[\r\n]+|[ ]{4,}/g)
                            .map( function(el) {
                                    // ignore if line is already wrapped in any of: p, div, pre, header, canvas, h1-h6, ol, ul, li
                                    if (/<(p|div|pre|header|canvas|h[0-9]|ol|ul|li)[ ]*.*>.*<\/\1>/.test(el)) {
                                        return el
                                    }
                                    // if there's a macro, check that it's closed. wrap if it is, don't if it isn't (but trim)
                                    else if (el.includes('<<')) {
                                        if (! /<<([a-zA-Z]{1,})[ ]*.*>>.*<<\/\1>>/.test(el)) {
                                            return el.trim()
                                        }
                                        else {
                                            return '<p>' + el.trim() + '</p>'
                                        }
                                    }
                                    // same treatment as above for elements
                                    if (el.includes('<')) {
                                        if (! /<([a-zA-Z]{1,})[ ]*.*>.*<\/\1>/.test(el)) {
                                            return el.trim()
                                        }
                                        else {
                                            return '<p>' + el.trim() + '</p>'
                                        }
                                    }
                                    // else wrap
                                    else {
                                        return '<p>' + el.trim() + '</p>'
                                    }
                                })
                            .join("");

        
        // wiki output into document fragment
        // normalize to rid empty text nodes and fuse them
        $(_frag).wiki(_output);
        _frag.normalize();

        // post-process, wrap any leftover text nodes
        $(_frag).contents().filter( function() {
                return this.nodeType === Node.TEXT_NODE
            }).wrap('<p></p>');

        // output macro
        $(this.output).append(_frag);

    }
});