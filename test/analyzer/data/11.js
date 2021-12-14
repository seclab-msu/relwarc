function request11(checkParam) {
    var checker = "surveiller=" + checkParam;
    var url = `/application/kl3j5h/interface/32nhj4/handle?qh44j3=1&${checker}`;
    $.ajax({
        type: "GET",
        url: url
    });
}

function makeReq1(param) {
    let paramVal = param + "o";
    makeReq2(paramVal);
}

function makeReq2(param) {
    if (param.length == 6) {
        request11(param)
    } else {
        request11("asdfds");
    }
}

function falseMakeReq1(param) {
    var paramVal = param + "1";
    makeReq1(paramVal);
}

function falseMakeReq2(param) {
    var paramVal = param + "kek";
    if (paramVal.endsWith("k")) {
        falseMakeReq3(paramVal);
    } else {
        makeReq2(paramVal);
    }
}

function falseMakeReq3(param) {
    var paramVal = "random";
    request11(paramVal);
}

function callerReq1() {
    var paramVal = "po89u";
    makeReq1(paramVal);
}

function callerReq2() {
    var param = "gn2n1"
    falseMakeReq1(param);
}

function callerReq3() {
    var param = "kjkdk";
    falseMakeReq2(param);
}
