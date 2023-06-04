Macro.add('select', {
    isAsync :   true,
    tags    :   null,
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

        // setup.SS ??= {};
        // setup.SS.select ??= {};


        $link.wiki(this.args[0]);

        $link
                .addClass(`link-internal macro-${this.name} select-group-${_group}`)
                .ariaClick({
                    one :   true
                }, this.createShadowWrapper (
                    () => {

                        // if (_persist) {
                        //     console.log('persist!');
                        //     $link.removeClass(`select-group-${_group}`);
                        //     $link.removeAttr('href');
                        //     $(`.select-group-${_group}`).remove();
                        // }
                        // else {
                        //     $link.remove();
                        //     $(`.select-group-${_group}`).remove();
                        // }

                        $link.remove();
                        $(`.select-group-${_group}`).remove();

                        if (this.payload[0].contents !== '') {
                            const frag = document.createDocumentFragment();
                            new Wikifier(frag, this.payload[0].contents.trim());
                            $insert.append(frag);
                        }
                    }
                ))
                .appendTo(this.output);

        $insert.addClass(`macro-${this.name}-in`);

        $insert.insertAfter($link);

    }
});