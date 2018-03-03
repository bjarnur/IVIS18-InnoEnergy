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

function parseMonthlyData(chData){
  console.log(chData);
  var ret = [];
  for(let month in chData){
    var mData = {};
    mData['sum'] = 0;
    mData['month'] = month;
    mData['vals'] = [];
    for(let day in chData[month]){
      mData['sum'] += chData[month][day].sum;
      mData['vals'][parseInt(day)-1] = {
        time: day,
        val: chData[month][day].sum,
        cnt: chData[month][day].count
      };
    }
    ret[parseInt(month)-1] = mData;
  }
  return ret;
}
