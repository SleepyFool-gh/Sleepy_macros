setup.SS ??= {};

Macro.add('p', {
    tags    :   null,
    handler() {

        
        // pre-processing removed, all wrapping is done in post-process now
        
        // optional custom p delimiter
        // default is line break or 3 spaces
        let re;
        if (typeof this.args[0] !== 'undefined') {
            re = new RegExp(this.args[0],'g');
        }
        else {
            re = /[\r\n]+|[ ]{3,}/g;
        }

        // remove line breaks from raw content input
        const _frag = document.createDocumentFragment();
        let _contents = this.payload[0].contents.trim();

        
        // count <<p>> macro instance to account for multiple instances
        setup.SS.p_macro_count ? setup.SS.p_macro_count++ : setup.SS.p_macro_count = 1;
        let _p_id = setup.SS.p_macro_count;

        // convert p delimiter into br to use as post-process delimiter
        let _output = _contents
                            .split(re)
                            .map( (el) => el.trim() + '<br>' )
                            .join("");


        // if post processing, wrap in special container
        _output = `<div id='p-macro-output-${_p_id}' style='display:none'>${_output}</div>`;

        // wiki output into document fragment
        $(_frag).wiki(_output);

        _frag.normalize();

        // output macro
        $(this.output).append(_frag);

        // run post processing
        setTimeout(() => setup.SS.p_macro_post(_p_id), 40);


    }
});

// post processing, wraps adjacent inline elements
setup.SS.p_macro_post = function(_p_id) {

    let _wout = $(`#p-macro-output-${_p_id}`).contents();
    let _toWrap = [];

    // traverse nodes of p macro output
    for (let _i = 0; _i < _wout.length-1; _i++) {
        
        // if current node is a text node, initiate wrap queuer
        if (_wout[_i].nodeType === Node.TEXT_NODE) {
            let _j = setup.SS.wrapUntil(_i,_p_id);
            _toWrap.push([_i,_j]);
            _i = _j;
            continue
        }
        // if current node is a br, skip
        else if (_wout[_i].nodeName === 'BR') {
            continue
        }
        // if current node is an element, check if it's inline, initiate wrap queuer
        else if (_wout[_i].nodeType === Node.ELEMENT_NODE) {

            if (window.getComputedStyle(_wout[_i]).display.includes('inline')) {
                let _j = setup.SS.wrapUntil(_i,_p_id);
                _toWrap.push([_i,_j]);
                _i = _j;
                continue
            }
        }
    }

    // wrap procedure
    // offset because the length gets smaller as nodes get wrapped
    let _offset = 0;
    for (let _k = 0; _k < _toWrap.length; _k++) {
        _wout.slice(_toWrap[_k][0] - _offset,_toWrap[_k][1]+1 - _offset).wrapAll('<p class="p-macro p-macro-post"></p>');
        _offset += _toWrap[_k][1] - _toWrap[_k][1];
    }

    // remove br's & unwrap
    $(`#p-macro-output-${_p_id}`).find('*').filter('br').remove();
    $(`#p-macro-output-${_p_id}`).contents().unwrap();

}

// wrap queuer, checks subsequent nodes whether they are inline
setup.SS.wrapUntil = function(_i,_p_id) {

    let _wout = $(`#p-macro-output-${_p_id}`).contents();

    // to catch going over length errors
    if (_i+1 > _wout.length-1) {
        return _i
    }

    // if next node is a br, include it & end wrap group
    if (_wout[_i+1].nodeName === 'BR') {
        return _i+1
    }
    // if next node is text node, include in wrap group
    else if (_wout[_i+1].nodeType === Node.TEXT_NODE) {
        return setup.SS.wrapUntil(_i+1,_p_id);
    }
    // if next node is an inline element, include in wrap group
    else if (window.getComputedStyle(_wout[_i+1]).display.includes('inline')) {
        return setup.SS.wrapUntil(_i+1);
    }
    // else end wrap group
    else {
        return _i
    }
};