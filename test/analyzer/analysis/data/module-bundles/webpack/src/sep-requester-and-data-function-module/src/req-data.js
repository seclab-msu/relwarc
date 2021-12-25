function getBaseURL() {
    return '/api/data';
}

function getData() {
    return {
        p1: 'foobar',
        p2: '456'
    }
};

exports.getBaseURL = getBaseURL;
exports.getData = getData;