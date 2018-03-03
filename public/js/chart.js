//Manager of the chart related to this id
function renderChart(id){
  //refresh all related charts
  d3.selectAll("svg").remove();

  //FIXME: It takes so long to use consumptionOnIntervalById on yearly level

  //Monthly part
  let selectedYr;
  $.getJSON("/consumptionOnIntervalById/"+id+"/2012-01-01/2018-01-01/month").then(function(result){
    //drawYearlyBarChart(result);
    for(let yr in result){
      drawMonthlyChart(yr,result[yr],id);
    }
  });
}
function drawMonthlyChart(yr,data,id){
  //console.log(yr);
  //console.log(data);

}
function drawDailyChart(month,data,id){
  d3.select("#dailyChart").remove();
}
//function drawChart(result){
  //console.log("drawChart");
  //console.log(result);
//}
//function 
