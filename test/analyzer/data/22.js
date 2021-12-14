var global_config = {
    protocol: 'http://'
};
function doajax (q) {
    var x = new XMLHttpRequest;
    x.open('GET', q, false);
    x.onreadystatechange = function (state) {
        console.log('state changed ' + x.readyState);
    }
    x.send(null);

} 

function a (arg) {
    var config = {
        domain: 'test.com',
        script: '/index.php'
    };
    function b () {
        var x = '123';
        function f () {
            return doajax(global_config.protocol + config.domain + config.script + '?param=' + x);
        }
    }
}

doajax('test');
