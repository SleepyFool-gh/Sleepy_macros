// main macro, select link
Macro.add('select', {
    isAsync       :   true,
    tags          :   ["alternate"],
    groupContent  :   {},
    selectCount   :   0,
    handler() {


        // if no arguments, return error
        if (this.args.length === 0) {
            return this.error('no <<select>> link text specified');
        }

        
        let groupContent = this.self.groupContent;
        const $link     = $(document.createElement('a'));

        const linkId    = this.self.selectCount;
        this.self.selectCount++;
        
        // if more than 1 argument, assign groups
        const groups = this.args.length > 1  ?  this.args[1].split(' ')  :  ['default'];
        


        // for each group, _g
        for (let i = 0; i < groups.length; i++) {

            // create group content array & link identifier
            let g = groups[i];
            groupContent[g] ??= [];
            let linkNum = Object.keys(groupContent[g]).length;

            // if no replacement data, push null
            if (this.payload.length === 1) {
                groupContent[g][linkNum] = null;
            }
            else {
                // for each payload
                for (let j = 1; j < this.payload.length; j++) {
                    // check if payload arguments is blank or that the argument matches the current group, _g
                    // blank arguments === default replacement, must be last
                    if (! this.payload[j].args.length || this.payload[j].args[0].split(' ').includes(g)) {
                        groupContent[g][linkNum] = clone(this.payload[j]);
                        break
                    }
                }
            }

            // add group identifiers to each link
            $link
                    .addClass(`select-${g}`)
                    .attr(`data-select-${g}-n`,linkNum)
            
        }
        
        // displays link text
        $link.wiki(this.args[0]);



        $link
                // add appropriate classes & id
                .attr('data-select-id',linkId)
                .addClass(`link-internal macro-${this.name}`)
                .ariaClick({
                    one :   true
                }, this.createShadowWrapper (
                    () => {


                        // for each group this link is a part of
                        for (let i = 0; i < groups.length; i++) {
                            
                            let g = groups[i];

                            // search all other links in this group except this one
                            $(`.select-${g}:not([data-select-id='${linkId}'])`).each( function() {

                                // find num of this link
                                let linkNum = $(this).attr(`data-select-${g}-n`);

                                // if stored payload data contains replacement data,
                                // wiki it into a span after link
                                if (groupContent[g][linkNum]) {
                                    const frag = document.createDocumentFragment();
                                    new Wikifier(frag, groupContent[g][linkNum].contents.trim());
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
                            delete groupContent[g];
                        }

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

        // find all links with selected group and delete them, then delete group content data
        let g = this.args[0];
        $(`.select-${g}`).remove();

        delete Macro.get('select').groupContent[g];

    }
});
