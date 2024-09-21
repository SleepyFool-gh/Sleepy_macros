Macro.add('divider', {
    handler: function() {

        // check if animation flag provided
        const transition = this.args.includes('t8n') || this.args.includes('transition');
        
        // hide old dividers, trigger transition out animation
        $('.macro-divider')
            .addClass(   
                transition
                    ? 'macro-divider-hidden macro-divider-out'
                    : 'macro-divider-hidden'
            );

        // create new divider, append to output
        const $hr = $(document.createElement('hr'))
        $hr
            .addClass(
                transition
                    ? 'macro-divider macro-divider-in'
                    : 'macro-divider'
            )
            .appendTo(this.output);

        // trigger transition in animation
        setTimeout( function() {
            $('.macro-divider').removeClass('macro-divider-in');
        }, 40)

    }
});