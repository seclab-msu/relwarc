var url = '/doing/actions.php';
function mkreq() {
    var d = {'n': 'x85'},
        tok = 'abcd';

    $.ajax({'url': url, data: d});

    let jobTheDo = function () {
        var method = 'PUT';
        fetch(url, {method: method, body: 'xn=85', headers: {'X-Tok': tok}});
    };
}