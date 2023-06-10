Macro.add('newhr', {
    handler() {

        
        // if no arguments, return error
        if (typeof this.args[0] !== 'undefined' && ! [true,false].includes(this.args[0])) {
            return this.error('<<newhr>> only accepts true or false!');
        }

        this.args[0] ??= false;
        

        if (this.args[0]) {

            $('hr.macro-newhr').animate({
                opacity: 0,
                'max-height': 0,
                marginTop: 0,
                marginBottom: 0
            },500);

            const $hr   = $(document.createElement('hr'));
            $hr
                .css({opacity: 0})
                .addClass('macro-newhr')
                .appendTo(this.output)
                .animate({opacity: 1});

            setTimeout( function() {
                $('hr.macro-oldhr').remove();
                $hr.addClass('macro-oldhr');
            }, 510);
            
        }
        else {
            $('hr.macro-oldhr').css({
                opacity: 0,
                'max-height': 0,
                marginTop: 0,
                marginBottom: 0
            });

            const $hr   = $(document.createElement('hr'));
            $hr
                .addClass('macro-newhr macro-oldhr')
                .appendTo(this.output);

        }

    }
});