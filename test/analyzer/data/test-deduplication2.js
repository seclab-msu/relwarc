$.ajax({
    method: "POST",
    url: '/example/test.aspx',
    data: {
        name: "admin",
        id: adminId
    }
});


$.post({
    url: '/example/test.aspx',
    data: {
        name: adminName,
        id: "123"
    }
});