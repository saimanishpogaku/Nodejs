class Validation {
	isset(val){
		if((typeof val === 'undefined') || (val === null) || (val === '') || (val == undefined)){
		return false;
		} else {
		return true;
		}
	}
}

module.exports = new Validation()