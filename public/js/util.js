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


