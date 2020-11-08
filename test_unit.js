// const sequelize = require('./database')
// const User = require("./models/User");


// async function find_user(val){
// 		let user = await User.findOne({
// 		  where: {
// 		    Mobile : val
// 		  }
// 		})
// 		return user;
// 	}

// console.log(find_user("919030380074"));
// const AWS = require('aws-sdk');
// require('dotenv').config();
// const { AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_S3_PROFILES } = process.env;
// AWS.config.update({
// 			accessKeyId : AWS_ACCESS_KEY_ID,
// 			secretAccessKey : AWS_SECRET_ACCESS_KEY,
// 			region : AWS_REGION
// });
// const s3 = new AWS.S3({params: {Bucket: AWS_S3_PROFILES }});
// s3.listBuckets(function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

const s3 = require('./helpers/uploader.js');
s3.getBucketPolicy();