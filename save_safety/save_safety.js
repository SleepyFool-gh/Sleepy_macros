(function() {
//  ████  ███  █   █ █████  ████  ███  █████ █████ █████ █   █
// █     █   █ █   █ █     █     █   █ █     █       █    █ █
//  ███  █████ █   █ ███    ███  █████ ███   ███     █     █
//     █ █   █  █ █  █         █ █   █ █     █       █     █
// ████  █   █   █   █████ ████  █   █ █     █████   █     █
// DESC: saveSafety system adds two checkboxes that disable / enable the buttons to delete or clear saves
const enableDelete = {
    any: false,
    all: false,
}
$(document).on(':dialogopening', function() {
    // if opening saves dialog
    if ($('#ui-dialog').hasClass('saves')) {
        // when opening, add checkboxes & set states
        saveSafety.add_checkboxes();
        saveSafety.set_states();
        // add listener to re-add checkboxes after every click if missing
        $('#ui-dialog').ariaClick( 
            {
                namespace: 'saveSafety',
            },
            function() {
                if ($('#saveSafety').length === 0) {
                    saveSafety.add_checkboxes();
                    saveSafety.set_states();
                }
            }
        );
        // remove said click listener when dialog closes
        $(document).on(':dialogclosed', function() {
            $('#ui-dialog').off('.saveSafety');
        });
    }
});
const saveSafety = {
    // set states for buttons
    set_states: function() {
        // delete buttons
        $('#saves-list button.delete[role="button"]').ariaDisabled(! enableDelete.any);
        $('#saves-clear').ariaDisabled(! enableDelete.all);
    },
    // creates checkboxes and listener
    add_checkboxes: function() {
        // create container & checkboxes
        const $container = $(document.createElement('div'));
        $container
            .attr('id', 'saveSafety')
            .html(`
                <label>
                    <span>Enable Save Deleting</span>
                    <input class='deleteAny' type='checkbox'>
                </label>
                <label>
                    <span>Enable Save Clearing</span>
                    <input class='deleteAll' type='checkbox'>
                </label>
            `)
            // add listeners
            .ariaClick( function(e) {
                if ($(e.target).hasClass('deleteAny')) {
                    enableDelete.any = ! enableDelete.any;
                    saveSafety.set_states();
                }
                else if ($(e.target).hasClass('deleteAll')) {
                    enableDelete.all = ! enableDelete.all;
                    saveSafety.set_states();
                }
            })
            // insert
            .insertAfter($('#saves-list'));
        // set proper checkbox states
        $container.find('.deleteAny').prop('checked', enableDelete.any);
        $container.find('.deleteAll').prop('checked', enableDelete.all);
    }
};
})();
