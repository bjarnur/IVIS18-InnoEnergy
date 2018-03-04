function setInfo(building) {
  
  console.log(building);
  
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
  var ret = [];
  for(let yr in chData){
    var yrData = {};
    yrData['sum'] = 0;
    yrData['yr'] = yr;
    yrData['vals'] = [];
    for(let month in chData[yr]){
      yrData['sum'] += chData[yr][month].sum;
      yrData['vals'][parseInt(month)-1] = {
        time: month,
        val: chData[yr][month].sum,
        cnt: chData[yr][month].count
      };
    }
    ret.push(yrData);
  }
  return ret;
}

function parseYearlyData2(chData){
 var ret = [];
  for(let yr in chData){
    var yrData = {};
    yrData['sum'] = chData[yr].sum;
    yrData['yr'] = yr;
    yrData['vals'] = [];
    //yrData['vals'] = chData[yr].values;
    for(let month in chData[yr].values) {
      yrData['vals'][parseInt(month)-1] = {
        time: month,
        val: chData[yr].values[month],
        //cnt: 1
      };
    }
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
        //cnt: chData[month][day].count
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
  console.log(ret)
  return ret;
}
