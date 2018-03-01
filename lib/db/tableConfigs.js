const constants = require('constants')

const tableConfigs = {
  /* If you add a new table you are required to specify ALL fields and functions below, with the exact same name on the left hand side */
  building_info : {
    /* This path is relative to the root when doing npm start */
    "dataLocation" : "secret/building_info.csv", //or if you are brave: "secret/el_07_07_2017.csv"
    "tableName": "building_info",
    "createStatement": "CREATE TABLE building_info (id, fuse, additional_info, subscription, latitude, longitude, address)",

    /* -line : current line read from file,
       -lineCount: current line index, starts at 0,
       -ids: Initially empty array which you can fill with id at index i and use across lines,
       -toInsert, Initially empty array which you fill with a json of values, the keys are to
       be referenced in the insertRunStatement,
       -setIds: Function that takes a list which is assigned to ids. During the following loops,
       the variable ids will contain what you passed as the parameter to this function.
       -doStage: Function without arguments, empties the toInsert array and sends the content to be inserted
       according to the insertRunStatement below. */
    "onParseLine": function(line, lineCount, ids, toInsert, setIds, doStage) {
      if ( lineCount == 0 ) {
        //Ignore column headers
      }
      else {
        let fields = line.split(',')
        let id = fields[0]
        let fuse = fields[1]
        let additional_info = fields[2]
        let subscription = fields[3]
        let latitude = fields[4]
        let longitude = fields[5]
        let address = fields[6]
        toInsert.push({ "id": id,
                        "fuse": fuse,
                        "additional_info": additional_info,
                        "subscription": subscription,
                        "latitude": latitude,
                        "longitude": longitude,
                        "address": address})
        doStage()
      }
    },
    "insertStatement":" INSERT INTO building_info VALUES (?,?,?,?,?,?,?)",

    /*  This function always takes these arguments and should only be concerned
        with the ORDER of the values. */
    "insertRunStatement" : function(stmt, fields, i){
      stmt.run( fields[i].id, fields[i].fuse,
                fields[i].additional_info,
                fields[i].subscription,
                fields[i].latitude,
                fields[i].longitude,
                fields[i].address)
    }
  },
  consumption : {
    /* This path is relative to the root when doing npm start */
    "dataLocation" : "secret/sample500.csv", //or if you are brave: "secret/el_07_07_2017.csv"
    "tableName": "consumption",
    "createStatement": "CREATE TABLE consumption (id, timestamp DATETIME, value)",
    /* -line : current line read from file,
       -lineCount: current line index, starts at 0,
       -ids: Initially empty array which you can fill with id at index i and use across lines,
       -toInsert, Initially empty array which you fill with a json of values, the keys are to
       be referenced in the insertRunStatement,
       -setIds: Function that takes a list which is assigned to ids. During the following loops,
       the variable ids will contain what you passed as the parameter to this function.
       -doStage: Function without arguments, empties the toInsert array and sends the content to be inserted
       according to the insertRunStatement below. */
    "onParseLine": function(line, lineCount, ids, toInsert, setIds, doStage) {
      if ( lineCount == 0 ) {
        /* This is ID row, the first field is not an id */
        setIds(line.split(','))
      } else {
        let fields = line.split(',')
        let date = fields[0]
        for(let i = 1; i < fields.length; i++){
          let value = fields[i] ? fields[i] : constants.NO_DATA
          //console.log(ids[i], date, value)
          toInsert.push({"id": ids[i], "date": date, "value": value})
        }
        doStage()
      }
    },
    "insertStatement":" INSERT INTO consumption VALUES (?,?,?)",
    /* This function always takes these arguments and should only be concerned
    with the ORDER of the values, in this case id first, then date, then value
    just like in the createStatement and in the toInsert.push */
    "insertRunStatement" : function(stmt, fields, i){
      stmt.run(fields[i].id, fields[i].date, fields[i].value)
    }
  }

}

module.exports = tableConfigs
