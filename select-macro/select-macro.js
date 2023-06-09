// main macro, select link
Macro.add('select', {
    isAsync :   true,
    tags    :   ["alternate"],
    handler() {

        // if no arguments, return error
        if (this.args.length === 0) {
            return this.error('no <<select>> link text specified');
        }

        // create link
        const $link     = $(document.createElement('a'));
        

        let _groups = ['default'];
        let _keywords = [':end',':persist'];
        // let _end = this.args.includes(':end');
        // let _persist = this.args.includes(':persist');

        // if more than 1 argument && the 2nd argument isn't a keyword
        if ((this.args.length > 1) && (!  _keywords.includes(this.args[1]))) {
            _groups = this.args[1].split(' ');
        }

        // create namespace for select macro
        setup.SS ??= {};
        setup.SS.select ??= {};

        // for each group, _g
        for (let _i = 0; _i < _groups.length; _i++) {

            // create group object & number identifier
            let _g = _groups[_i];
            setup.SS.select[_g] ??= [];
            let _num = Object.keys(setup.SS.select[_g]).length;

            // if no replacement data, push null
            if (this.payload.length === 1) {
                setup.SS.select[_g].push(null);
            }
            else {
                // for each payload
                for (let _j = 1; _j < this.payload.length; _j++) {
                    // check if payload arguments is blank or that the argument matches the current group, _g
                    // blank arguments === default replacement, must be last
                    if (! this.payload[_j].args.length || this.payload[_j].args[0].split(' ').includes(_g)) {
                        setup.SS.select[_g][_num] = clone(this.payload[_j]);
                        break
                    }
                }
            }

            // add group identifiers to each link
            $link
                    .addClass(`select-${_g}`)
                    .attr(`data-select-${_g}-n`,_num)
        }
        
        // displays link text
        $link.wiki(this.args[0]);



        $link
                // add appropriate classes & id
                .addClass(`link-internal macro-${this.name}`)
                .ariaClick({
                    one :   true
                }, this.createShadowWrapper (
                    () => {


                        

                        // if this link has content to replace in its 1st payload,
                        // wiki it into a span after link
                        if (this.payload[0].contents !== '') {
                            const frag = document.createDocumentFragment();
                            new Wikifier(frag, this.payload[0].contents.trim());
                            const $insert   = $(document.createElement('span'));
                            $insert
                                    .append(frag)
                                    .addClass(`macro-select-in`)
                                    .insertAfter($link);
                        }

                        
                        // remove this link
                        $link.remove();

                        // for each group this link is a part of
                        for (let _i = 0; _i < _groups.length; _i++) {
                            
                            let _g = _groups[_i];

                            // search all other links in this group
                            $(`.select-${_g}`).each( function() {

                                // find num of this link
                                let _num = $(this).attr(`data-select-${_g}-n`);

                                // if stored payload data contains replacement data,
                                // wiki it into a span after link
                                if (setup.SS.select[_g][_num]) {
                                    const frag = document.createDocumentFragment();
                                    new Wikifier(frag, setup.SS.select[_g][_num].contents.trim());
                                    const $insert   = $(document.createElement('span'));
                                    $insert
                                            .append(frag)
                                            .addClass(`macro-select-in`)
                                            .insertAfter(this);

                                }

                                // remove link
                                this.remove();
                            });

                            
                            // clear up data, delete group after operation finish
                            delete setup.SS.select[_g];
                        }


                    }
                ))

                // adds link text to output
                .appendTo(this.output);
                

    }
});


// aux macro, removes select links of given argument
Macro.add('selectremove', {
    handler() {

        // if no arguments, error
        if (this.args.length === 0) {
            return this.error('no <<selectremove>> group_id specified');
        }

        // find all links with selected group and delete them
        let _g = this.args[0];
        $(`.select-${_g}`).remove();


    }
});
