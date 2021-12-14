function compareNew(obj, action) {
    $('#compareProducts').load('ajax_compare.php', {
        'compare_id': obj,
        'action': 'remove'
    });
    $('#compareProducts').load('ajax_compare.php', {
        'compare_id': obj,
        'action': 'add'
    });
}

function getFiltersValues() {
    var result = $.ajax({
        url: 'ajax-get-filters-values',
        type: 'POST',
        data: obj
    });
    return result;
}

compareNew(23931488, 'add');