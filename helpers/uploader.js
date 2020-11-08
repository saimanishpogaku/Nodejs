const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();
const { AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_S3_PROFILES } = process.env;
const s3 = new AWS.S3({params: {Bucket: AWS_S3_PROFILES }});

class Uploads {	
	constructor(){
		AWS.config.update({
			accessKeyId : AWS_ACCESS_KEY_ID,
			secretAccessKey : AWS_SECRET_ACCESS_KEY,
			region : AWS_REGION
		});
	}
	static ListBuckets(){
		s3.listBuckets((err, data) => {
		 	if (err) {
		    	console.log("Error", err);
		 	} else {
		    	console.log("Success", data.Buckets); // WILL DISPLAY LIST OF S3 BUCKETS 
		 	}
		})
	}
	static CreateBucket(){
		let bucketParams = {
  			Bucket : process.argv[2]
		};
		s3.createBucket(bucketParams, (err, data) => {
			  if (err) {
			    console.log("Error", err);
			  } else {
			    console.log("Success", data.Location);
			  }
		});
	}
	static uploadFile(filename,buffer){
		let uploadParams = {Key: filename, Body: buffer};
		let promise = new Promise((resolve,reject) => {
			s3.upload (uploadParams, (err, data) => {
				if (err) {
				    console.log("Error", err);
				    reject(err);
				} if (data) {
				    console.log("Upload Success", data.Location);
				    resolve(data.Location);
			  	}
			})
		})
		return promise;
	}
	static getBucketACLS(){
		let bucketParams = {Bucket: process.argv[2]};
		s3.getBucketAcl(bucketParams, function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else if (data) {
		    console.log("Success", data.Grants);
		  }
		});
	}
	static getBucketPolicy(){
		let bucketParams = {Bucket: process.argv[2]};
		s3.getBucketPolicy(bucketParams, function(err, data) {
		  if (err) {
		    console.log("Error", err);
		  } else if (data) {
		    console.log("Success", data.Policy);
		  }
		});
	}
}

module.exports = Uploads;