function abcd() {
    fetch("/testurl");
}

function efgh() {
    abcd();
}

function f() {
    efgh();
}