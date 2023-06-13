Macro.add('p', {
    tags    :   null,
    handler() {

        console.log(this.payload[0].contents);
        console.log('----');

        const _frag = document.createDocumentFragment();
        const _contents = this.payload[0].contents.trim();


        // add new string prototype to reverse it
        String.prototype.reverse = function() {
            return this.split('').reverse().join('');
        };

        const _runPost = this.args[0] ?? false;


        let _checker = function(el,_repeat) {


            // regexp to check if closing macro pair
            let re = /(<{1,2})([a-zA-Z]{1,})[ a-zA-Z0-9:+\-\.'"`_=]*(>{1,2})(.*)\1\/\2\3/;
            
            // try macro regexp first
            let _match = el.match(re);


            // if not a match and not a recursive run
            if (! _match && ! _repeat) {
                return false
            }
            // if match, keep feeding recursively
            else if (_match) {

                let new_el = el.replace(_match[1]+_match[2],'').replace(_match[3],'').reverse().replace(_match[3]+_match[2].reverse()+'/'+_match[1],'').reverse();
                
                // console.log('call recursive!');
                return _checker(new_el,true)
            }
            // if match on a recursive run
            else if (_repeat) {
                
                // now check if there's only one macro
                let re2 = /(<{1,2})\/?([a-zA-Z]{1,})(?:.*)(?<!>)(>{1,2})/;

                _match = el.match(re2);

                if (! _match) {
                    return true
                }

                let _bool = [];

                for (let _i = 1; _i <= _match.length-2; _i++) {
                    if (_match[_i] === '<<') {
                        _bool.push(Macro.get(_match[_i+1]).tags === undefined);
                    }
                    else if (_match[_i] === '<') {
                        return false
                    }
                }

                if (! _bool) {
                    return true 
                }
                else {
                    return _bool.reduce( (s,i) => s && i )
                }

            }
            console.log('this should never run');
            return re_m.test(el);
        };

        let _output = _contents
                            .split(/[\r\n]+|[ ]{4,}/g)
                            .map( function(el) {
                                    // ignore if line is already wrapped in any of: p, div, pre, header, canvas, h1-h6, ol, ul, li
                                    // these are block elements by default
                                    if (/<(p|div|pre|header|canvas|h[0-9]|ol|ul|li).*>.*<\/\1>/.test(el) || /(?<!<)<img.*>/.test(el)) {
                                        return el
                                    }
                                    // if there's a macro or element, check that it's closed. wrap if it is, don't if it isn't (but trim)
                                    else if (el.includes('<')) {
                                        console.log(el);
                                        console.log('passed: '+_checker(el.replace(/<\/?br\/?>/g,''),false));
                                        console.log('-------------');
                                        if (! _checker(el.replace(/<\/?br\/?>/g,''),false)) {
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
        console.log(_output);

        
        // wiki output into document fragment
        $(_frag).wiki(_output);

        // post-process
        // normalize to rid empty text nodes and fuse them
        // wrap any leftover text nodes
        if (_runPost) {
            _frag.normalize();
            $(_frag).contents().filter( function() {
                    return this.nodeType === Node.TEXT_NODE
                }).wrap('<p></p>');
        }

        // output macro
        $(this.output).append(_frag);


    }
});