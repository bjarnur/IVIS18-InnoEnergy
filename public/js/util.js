function setInfo(building) {
  
  var nameelement = document.getElementById('markerinfo'); 
  nameelement.textContent = building.address.replace(/"/g, '').replace(';', ',');
  
  var fuseelement = document.getElementById('fuseinfo');
  fuseelement.textContent = building.fuse + ' Ampere';
  
  if (building.additional_info != "") {
    var addelement = document.getElementById('addinfo');
    addelement.textContent = 'Additional information: ' + building.additional_info;
  }
  if (building.additional_info == "") {
    var addelement = document.getElementById('addinfo');
    addelement.textContent = '';
  }
  
  
  var subelement = document.getElementById('subinfo');
  subelement.textContent = building.subscription;
  
}


function parseYearlyData(chData){
  //console.log(chData);
 var ret = [];
  for(let yr in chData){
    var yrData = {};
    yrData['sum'] = chData[yr].sum;
    yrData['yr'] = yr;
    yrData['vals'] = [];
    for(let month in chData[yr].values) {
      yrData['vals'][parseInt(month)-1] = {
        time: month,
        val: chData[yr].values[month],
      };
    }
    //console.log(yrData['vals']);
    ret.push(yrData);
  }
  return ret;
}


function parseMonthlyData(chData){
  var ret = [];
  console.log(chData);
  for(let month in chData){
    var mData = {};
    mData['sum'] = chData[month].sum;
    mData['month'] = month;
    mData['vals'] = [];
    for(let day in chData[month].values){
      mData['vals'][parseInt(day)-1] = {
        time: day,
        val: chData[month].values[day],
      };
    }
    if(month == "Capacity") {
      //Hacky-hack :)
      ret[12] = mData;
    }
    else {
      ret[parseInt(month)-1] = mData;
    }
  }
  //To handle some month lack of data
  //for(let mid = 1;mid < 12;++mid ){
    //if(typeof ret[parseInt(mid)-1] == 'undefined'){
      //ret[parseInt(mid)-1] = {'month':mid,'vals':[]};
    //}
  //}
  
  return ret;
}
