
const DEBUG=false
const NO_DATA=undefined /* This should probably not be -1 since a SUM, AVG and MIN will be affected*/
const FUSES = {
	'16A' : {
		'yearly_lower' : 0,
		'yearly_upper' : 20000,
		'capacity' : 11
	},
	'20A' : {
		'yearly_lower' : 20000,
		'yearly_upper' : 25000,
		'capacity' : 14
	},
	'25A' : {
		'yearly_lower' : 25000,
		'yearly_upper' : 30000,
		'capacity' : 17
	},
	'35A' : {
		'yearly_lower' : 30000,
		'yearly_upper' : 40000,
		'capacity' : 24
	},
	'50A' : {
		'yearly_lower' : 40000,
		'yearly_upper' : 55000,
		'capacity' : 35
	},
	'63A' : {
		'yearly_lower' : 55000,
		'yearly_upper' : 70000,
		'capacity' : 44
	}
}

module.exports = {
  DEBUG,
  NO_DATA,
  FUSES
}
