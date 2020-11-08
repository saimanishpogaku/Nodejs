const express = require("express");
const router = express();
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { Op } = require('Sequelize')

const validator = require("../helpers/Validation");
const User = require("../models/User");

const JWT = require('../helpers/token');

router.post('/login',async (req,res) => {
	let data = req.body;
	const schema = Joi.object().keys({
        Email: Joi.string(),
        Mobile: Joi.string().regex(/^\d{12}$/),
        Password: Joi.string().regex(/^[a-zA-Z0-9]{5,10}$/).required()
    }).xor('Email','Mobile');
    validation =  schema.validate(data);
    if(validation.error){
    	res.status(400).json({
    	"status":"failed",	
    	"error":validation.error
    });
    } else {
    	try {
    		// console.log(data.Email)
    		// console.log(validator.isset(data.Email))
    		//let userData,status;
    	if(validator.isset(data.Email)){
    		console.log("Email selected")
    		result = await find_user_by_Login("Email",data.Email);
    	} else {
    		//console.log("Mobile number selected")
    		result = await find_user_by_Login("Mobile",data.Mobile);
    	}
    	let user = result.user;
    	console.log(user)
    	let match = await compare_hash(data.Password,user.Password);
    	console.log(match)
    	if(match){
    		let token = JWT.create_token(user.dataValues);
    		return res.status(200).json({ 
    			token: token
    		});
    	} else {
    		return res.status(403).json({
    			message:"Username or Password is incorrect"
    		});
    	}
    } 
    catch(err) {
    	return res.status(500).json({
    		error:err.message
    	});
    }
}

});

router.post('/create',async  (req,res) => {
	let data = req.body;
	
	const schema = Joi.object().keys({
		firstName: Joi.string().required(),
		lastName: Joi.string(),
        Email: Joi.string().required(),
        Mobile: Joi.string().regex(/^\d{12}$/).required(),
        Password: Joi.string().regex(/^[a-zA-Z0-9]{5,10}$/)
    });
    validation =  schema.validate(data)
    //console.log(validation)
    if(validation.error){
    	res.status(400).json({
    	"status":"failed",	
    	"error":validation.error
    });
    } else {
    	try{
    		//console.log("Entered try")
    		data.UserId = uuidv4();
    		data.Password = await create_hash(data.Password);
   //  		User.findAll({
			//   where: {
			//     Mobile: data.Mobile
			//   }
			// });
    		let user_exists = await find_user(data.Mobile,data.Email);
    		console.log(user_exists)
    		if(user_exists){
    			res.status(404).json({
    				"message":"User already exists with this mobile number"
    			});
    		} else {
    			const record = await User.create(data);
	    		res.status(200).json({
	    			"message":"user created successfully"
	    		});
    		}
    	} catch(err) {
    		res.status(500).json({
    			"status":"failed",
    			"error":err
    		});
    	}
    }
});

router.put('/modify/:id',async (req,res) => {
	let UserId = req.params.id;
	var data = req.body;
	console.log(data)
	if(!validator.isset(UserId)){
		return res.status(400).json({
    			"error":"User Id is required"
    		});
	}
	
	let { exists,userData } = await find_user_by_ID(UserId);
	if(!exists){
		return res.status(400).json({
    			"error":"User Not Found"
    		});
	}
	const schema = Joi.object().keys({
		firstName: Joi.string(),
		lastName: Joi.string(),
        Email: Joi.string(),
        Mobile: Joi.string().regex(/^\d{12}$/),
        Password: Joi.string().regex(/^[a-zA-Z0-9]{5,10}$/)
    });
    validation =  schema.validate(data)
    if(validation.error){
    	res.status(400).json({
    	"status":"failed",	
    	"error":validation.error
    });
    } else {
    	try{
    		console.log(data)
	    	data.firstName = validator.isset(data.firstName) ? data.firstName : userData.firstName;
	    	data.lastName = validator.isset(data.lastName) ? data.lastName : userData.lastName;
	    	data.Email = validator.isset(data.Email) ? data.Email : userData.Email;
	    	data.Mobile = validator.isset(data.Mobile) ? data.Mobile : userData.Mobile;
	    	if(validator.isset(data.Password)){
	    		data.Password = await create_hash(data.Password)
	    	} else {
	    	  data.Password = userData.Password;
	    	}
	    	let update_status = await User.update({ 
	    		firstName: data.firstName,
	    		lastName: data.lastName,
	    		Email: data.Email,
	    		Mobile: data.Mobile,
	    		Password: data.Password,

	    	 },
	    	 {
			  where: {
			    UserId: UserId
			  }
			});
			console.log(update_status)
			if(update_status){
				return res.status(200).json({
					"status":"success",
					"data":data
				});
			}
    	} catch(err){
    		res.status(500).json({"error": err});
    	}
    }
});

function create_hash(value){
	return new Promise((resolve,reject) => {
		bcrypt.hash(value, 10, function(err, hash) {
    			if(err){
    				reject(err);
    			} else {
    				resolve(hash);
    			}
			});
	})
}

function compare_hash(value,hash){
	return new Promise((resolve,reject) => {
			bcrypt.compare(value, hash, function(err, isMatch) {
			  if (err) {
			    throw err
			  } else if (!isMatch) {
			    	resolve(false);
			  } else {
			    	resolve(true);
			  }
			});
	});
}

/*
function create_hash(value){
		bcrypt.hash(value, 10, (err, hash) => {
    			if(err){
    				return err;
    			} else {
    				return hash;
    			}
			});
	}
*/
function find_user(mobile,email){
	return new Promise((resolve,reject) => {
		User.findOne({
		 where: {
		    [Op.or]: [
		      { Mobile: mobile },
		      { Email: email }
		    ]
		  }
		}).then((user) => {
			console.log(user);
			if(user){
				resolve(true);
			} else {
				resolve(false);
			}
			
		}).catch(() => {
			reject(false)
		})
	});
	}

function find_user_by_Login(key,val){
	return new Promise((resolve,reject) => {
		let filter;
		let result;
		if(key == 'Mobile') {
		filter = {
		      Mobile:val
		  };
		} else {
			filter = {
			      Email:val
			  };
		}
		console.log(filter);
		User.findOne({
		 where: filter
		}).then((user) => {
			if(user){
				 result = {
					status:true,
					user:user
				}
				resolve(result);
			} else {
				 result = {
					status:false,
					user:null
				}
				resolve(result);
			}
			
		}).catch(() => {
			result = {
					status:false,
					user:null
				}
			reject(result);
		})
	});
	}	

function find_user_by_ID(UserId){
	return new Promise((resolve,reject) => {
		let result;
		User.findOne({
		 where: {
		    UserId : UserId
		  }
		}).then((user) => {
			console.log(user);
			if(user){
				result = {
					exists:true,
					user:user
				}
				resolve(result);
			} else {
				resolve(false);
			}
			
		}).catch(() => {
			reject(false)
		})
	});
}	

module.exports = router;