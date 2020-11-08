const jwt = require("jsonwebtoken");

var JWT = {

create_token : (payload) => {
	var token = jwt.sign(payload, process.env.API_SECRET);
	var output = {
		"token" : token
	}
	return output;
},

decode_token : (token) => {
	jwt.verify(token, process.env.API_SECRET , function(err, decoded) {
  	if(err) {
  		var output = {
  			"message" : "Invalid Token",
  			"code" : 403
  		}
  	}
  	var output = decoded;
  	return output;
});
}

}

/*
function create_token(payload) {
	var token = jwt.sign(payload, process.env.API_SECRET);
	var output = {
		"token" : token
	}
	return output;
}

function decode_token(token) {
	jwt.verify(token, process.env.API_SECRET , function(err, decoded) {
  	if(err) {
  		var output = {
  			"message" : "Invalid Token",
  			"code" : 403
  		}
  	}
  	var output = decoded;
  	return output;
});
}
*/
module.exports =  JWT;
	