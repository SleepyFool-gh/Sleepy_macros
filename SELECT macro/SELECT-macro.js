Macro.add('select', {
    isAsync :   true,
    tags    :   ["replacement"],
    handler() {

        // if no arguments, return error
        if (this.args.length === 0) {
            return this.error('no select link text specified');
        }

        // create link
        const $link     = $(document.createElement('a'));
        const $insert   = $(document.createElement('span'));

        let _group = 'default';
        let _keywords = [':end',':persist'];
        // let _end = this.args.includes(':end');
        // let _persist = this.args.includes(':persist');

        // if more than 1 argument && the 2nd argument isn't a keyword
        if ((this.args.length > 1) && (!  _keywords.includes(this.args[1]))) {
            _group = this.args[1];
        }

        // create namespace for select macro
        setup.SS ??= {};
        setup.SS.select ??= {};

        // create object to store macro payloads
        setup.SS.select[_group] ??= {};
        let _g = setup.SS.select[_group];

        // create id, this being the n-1'th item in _group
        // assign payload to this id
        let _id = _group + Object.keys(_g).length;
        _g[_id] = this.payload;
        
        // displays link text
        $link.wiki(this.args[0]);

        $link
                // add appropriate classes & id
                .addClass(`link-internal macro-${this.name} select-${_group}`)
                .attr('id',`select-${_id}`)
                .ariaClick({
                    one :   true
                }, this.createShadowWrapper (
                    () => {

                        // remove this link
                        $link.remove();

                        // if this link has content to replace in its 1st payload
                        if (this.payload[0].contents !== '') {
                            const frag = document.createDocumentFragment();
                            new Wikifier(frag, this.payload[0].contents.trim());
                            $insert.append(frag);
                        }

                        // search all other links in group
                        $(`.select-${_group}`).each( function() {
                            let _id = $(this).attr('id').replace('select-','');

                            // if stored payload data contains replacement data
                            if (_g[_id].length > 1) {
                                const frag = document.createDocumentFragment();
                                new Wikifier(frag, _g[_id][1].contents.trim());
                                $(`#select-${_id}-in`)
                                    .append(frag)
                            }

                            // remove link
                            this.remove();
                        });

                        // clear up data, delete group after operation finish
                        delete setup.SS.select[_group];

                    }
                ))
                .appendTo(this.output);

        // container to hold append content, add appropriate class & ids
        // insert directly after link
        $insert
                .addClass(`macro-${this.name}-in`)
                .attr('id',`select-${_id}-in`)
                .insertAfter($link);

    }
});