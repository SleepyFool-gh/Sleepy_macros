Macro.add('p', {
    tags: null,
    handler() {
        
        console.log(this.self);
        
        // much thanks to Hituro & Sjoerd who helped clean, improve & troubleshoot

        // check if custom p delimiter, set to default if no
        const re = typeof this.args[0] !== 'undefined' ? new RegExp(this.args[0],'g') : new RegExp('[\\n]+|[ ]{3,}','g');

        const frag = document.createDocumentFragment();
        const contents = this.payload[0].contents.trim();

        // count macro instance, set id
        this.self.count = (this.self.count || 0) + 1;
        const pId = this.self.count;

        // split by delimiter, add break, join, wrap
        let output = contents
            .split(re)
            .map((el) => `${el.trim()}<p-macro-break/>`)
            .join('');

        output = `<div id='p-macro-output-${pId}' style='display:none'>${output}</div>`;
        

        // wiki, normalize, output, run post process
        $(frag).wiki(output);

        frag.normalize();

        $(this.output).append(frag);

        setTimeout( function() {
            postProcess(pId)
        }, 0);

        
        // aux function, post process
        const postProcess = function(pId) {
            const wout = $(`#p-macro-output-${pId}`).contents();
            const toWrap = [];

            // if current node is a text node or inline element that is not the break or a br, initiate wrap queuer
            for (let i = 0; i < wout.length - 1; i++) {
                const currentNode = wout[i];
                if (currentNode.nodeType === Node.TEXT_NODE || (currentNode.nodeType === Node.ELEMENT_NODE && !['BR','P-MACRO-BREAK'].includes(currentNode.nodeName) && window.getComputedStyle(currentNode).display.includes('inline'))) {
                    const endIndex = wrapUntil(i, pId);
                    toWrap.push([i, endIndex]);
                    i = endIndex;
                }
            }

            // wrap nodes with queue, starting from end, backwards
            for (let k = toWrap.length - 1; k >= 0; k--) {
                const [startIdx, endIdx] = toWrap[k];
                wout.slice(startIdx, endIdx + 1).wrapAll('<p class="p-macro"></p>');
            }

            // remove breaks's and unwrap
            $(`#p-macro-output-${pId}`).find('p-macro-break').remove();
            $(`#p-macro-output-${pId}`).contents().unwrap();
        }

        // aux function, wrap queuer
        const wrapUntil = function(startIndex, pId) {
            const wout = $(`#p-macro-output-${pId}`).contents();
            let endIndex = startIndex;

            // checks next nodes until it finds either a break or something not a text node and not an inline element
            while (endIndex + 1 <= wout.length - 1) {
                const nextNode = wout[endIndex + 1];

                if (nextNode.nodeName === 'P-MACRO-BREAK') {
                    endIndex += 1;
                    break;
                } else if (nextNode.nodeType === Node.TEXT_NODE || window.getComputedStyle(nextNode).display.includes('inline')) {
                    endIndex += 1;
                } else {
                    break;
                }
            }

            return endIndex;
        }
        

    },
});