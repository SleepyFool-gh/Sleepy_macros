Macro.add('p', {
    tags    :   null,
    handler() {

        
        const _runPost = this.args[0] ?? true;

        const _frag = document.createDocumentFragment();
        let _contents = this.payload[0].contents.trim().replaceAll(/[\r\n\t]*/g,'');
        
        


        // add new string prototype to reverse it
        String.prototype.reverse = function() {
            return this.split('').reverse().join('');
        };



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
            console.log('this should never run, report if it does');
            return re.test(el);
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
                                        if (! _checker(el.replace(/<\/?br\/?>/g,''),false)) {
                                            return el.trim() + '<br>'
                                        }
                                        else {
                                            return '<p class="p-macro p-macro-pre">' + el.trim() + '</p>'
                                        }
                                    }
                                    // else wrap
                                    else {
                                        return '<p class="p-macro p-macro-pre">' + el.trim() + '</p>'
                                    }
                                })
                            .join("");

        if (_runPost) {
            _output = "<div id='p-macro-output'>" + _output + "</div>";
        }

        // wiki output into document fragment
        $(_frag).wiki(_output);

        // post-process
        // normalize to rid empty text nodes and fuse them
        // wrap any leftover text nodes
        if (_runPost) {
            _frag.normalize();
        }

        // output macro
        $(this.output).append(_frag);

        setTimeout(setup.SS.p_macro_post(), 100)

    }
});


setup.SS ??= {};

setup.SS.p_macro_post = function() {

    $(document).on(':passagedisplay.p_macro', function(e) {

        let _wout = $('#p-macro-output').contents();
        let _toWrap = [];

        for (let _i = 0; _i < _wout.length-1; _i++) {
            
            if (_wout[_i].nodeType === Node.TEXT_NODE) {
                let _j = setup.SS.wrapUntil(_i);
                _toWrap.push([_i,_j]);
                _i = _j;
                continue
            }
            else if (_wout[_i].nodeName === 'BR') {
                continue
            }
            else if (_wout[_i].nodeType === Node.ELEMENT_NODE) {
                if (window.getComputedStyle(_wout[_i]).display.includes('inline')) {
                    let _j = setup.SS.wrapUntil(_i);
                    _toWrap.push([_i,_j]);
                    _i = _j;
                    continue
                }
            }
        }
        let _offset = 0;
        for (let _k = 0; _k < _toWrap.length; _k++) {
            _wout.slice(_toWrap[_k][0] - _offset,_toWrap[_k][1]+1 - _offset).wrapAll('<p class="p-macro p-macro-post"></p>');
            _offset += _toWrap[_k][1] - _toWrap[_k][1];
        }

        $('#p-macro-output').find('*').filter('br').remove();
        $('#p-macro-output').contents().unwrap();
        $(document).off(':passagedisplay.p_macro');

    });
    
}

setup.SS.wrapUntil = function(_i) {
    let _wout = $('#p-macro-output').contents();
    if (_i+1 > _wout.length-1) {
        return _i
    }
    if (_wout[_i+1].nodeType === Node.TEXT_NODE) {
        return setup.SS.wrapUntil(_i+1);
    }
    else if (_wout[_i+1].nodeName === 'BR') {
        return _i+1
    }
    else if (window.getComputedStyle(_wout[_i+1]).display.includes('inline')) {
        return setup.SS.wrapUntil(_i+1);
    }
    else {
        return _i
    }
};