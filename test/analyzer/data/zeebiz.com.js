var baseUrl = document.location.origin;
var path = window.location.pathname;
var path1= path.split("/")[1];
var url = path.split("/")[2];
var uri = url.split("-");
var str=uri[2];
var exc = $('#h_v').val();
var parameter_data = "webmethod=index_markets_details&exchange="+str+"&securitycode="+exc;
$.ajax({
    cache: false,
    url: baseUrl +'/'+ path1 +'/content_api/'+parameter_data,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function (data) {
      var total_scripts = data[0].TotalScrips;  
      var advances = data[0].Advances;
      var declines = data[0].Declines;
      var advances_val = advances / total_scripts * 100;
      var declines_val = declines / total_scripts * 100;      
      $('#styled').multiprogressbar({
      parts:[{value: declines_val, text: true, barClass: "red", textClass: "redText"},
      {value: advances_val, text: true, barClass: "green", textClass: "footnote"}]
      });
    },
});
