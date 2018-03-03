var selectedYr = -1;
var bMonthlyChart = false;
var months = {
  "01":"January",
  "02":"Feburary",
  "03":"March",
  "04":"April",
  "05":"May",
  "06":"June",
  "07":"July",
  "08":"August",
  "09":"September",
  "10":"October",
  "11":"November",
  "12":"December"
}
var curId = -1;

//drawing related
var	margin = {top: 20, right: 80, bottom: 30, left: 30};
var canvasLineW = 1030,canvasLineH = 500;
var canvasBarW = 360, canvasBarH = 500;
var wLine = canvasLineW- margin.left - margin.right,
    hLine = canvasLineH - margin.top - margin.bottom;
var wBar = canvasBarW - margin.left - margin.right,
    hBar = canvasBarH - margin.top - margin.bottom;
