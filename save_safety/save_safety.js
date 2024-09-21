(function() {

// init flags, save / clear disabled
let deleteAny_disabled = true;
let deleteAll_disabled = true;

// when opening dialog
$(document).on(':dialogopening', function() {

    // if opening saves dialog
    if ($('#ui-dialog-body').hasClass('saves')) {

        create_checkboxes();
        set_states();

        // attach checkbox functionality
        setTimeout( function() {
            $(document).on('click.save_safety', (ev) => checkbox_fn(ev) );
            $(document).on('keypress.save_safety', (ev) => checkbox_fn(ev) );
        }, 40);
        
    }
});

// create checkboxes
const create_checkboxes = function() {
    // create checkbox container
    const $div = $(document.createElement('div')).addClass('save_safety');

    // create checkboxes
    const $label_any = $(document.createElement('label')).addClass('deleteAny');
    const $label_all = $(document.createElement('label')).addClass('deleteAll');

    // add checkboxes to menu
    $label_any.wiki("<span class='title'>Enable Delete</span><input type='checkbox' class='deleteAny'>").appendTo($div);
    $label_all.wiki("<span class='title'>Enable Clear</span><input type='checkbox' class='deleteAll'>").appendTo($div);
    $div.insertAfter($('#saves-list'));
};

// checkbox functionality
const checkbox_fn = function(ev) {
    // save dialog has been closed, remove listener, set flags back to disable
    if (! $('#ui-dialog-body').hasClass('saves')) {
        deleteAny_disabled = true;
        deleteAll_disabled = true;
        $(document).off('click.save_safety');
        $(document).off('keypress.save_safety');
    }
    // main behavior
    else {
        // in case save menu content updated, re-add checkboxes & re-set states
        if (! $('.save_safety').length) {
            create_checkboxes();
            set_states();
        }
        // deleteAny behavior
        if ($(ev.target).hasClass('deleteAny')) {
            deleteAny_disabled = ! deleteAny_disabled;
            set_states();

        }
        // deleteAll behavior
        else if ($(ev.target).hasClass('deleteAll')) {
            deleteAll_disabled = ! deleteAll_disabled;
            set_states();
        }
    }
};

// set proper states for checkboxes & delete buttons
const set_states = function() {
    $('input.deleteAll').prop('checked', ! deleteAll_disabled);
    $('input.deleteAny').prop('checked', ! deleteAny_disabled);
    $('#saves-list button.delete[role="button"]').ariaDisabled(deleteAny_disabled);
    $('#saves-clear').ariaDisabled(deleteAll_disabled);
}

})();
