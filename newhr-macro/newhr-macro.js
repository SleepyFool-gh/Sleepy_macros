Macro.add('newhr', {
    skipArgs: true,
    handler() {
        
        // remove old newhr's
        $('hr.macro-newhr').remove();

        // create new <hr>, append to output
        const $hr   = $(document.createElement('hr'));

        $hr
            .addClass('macro-newhr')
            .appendTo(this.output);
            

    }
});