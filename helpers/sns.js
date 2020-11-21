const AWS = require('aws-sdk');
require('dotenv').config();
const { AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_S3_PROFILES,TOPIC_ARN } = process.env;
//let credentials = new AWS.SharedIniFileCredentials({profile: 'aws_personal_admin'});
AWS.config.update({
	region: 'us-east-1',
	accessKeyId: AWS_ACCESS_KEY_ID,
  	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	//credentials: credentials
});

class SNS{
	constructor(){
		console.log("Hello");
		this.params = {
		  Message: 'Hello', /* required */
		  TopicArn: TOPIC_ARN
		};
	}
	listSubscriptionsforTopic(){
		let params = {
		  TopicArn: TOPIC_ARN
		};
		let subslistPromise = new AWS.SNS().listSubscriptionsByTopic(params).promise();
		// Handle promise's fulfilled/rejected states
		  subslistPromise.then(
		    function(data) {
		      console.log(data);
		    }).catch(
		    function(err) {
		      console.error(err, err.stack);
		    }
		  );
		}
	subscribeEmail(email){
		let params = {
		  Protocol: 'EMAIL', /* required */
		  TopicArn: TOPIC_ARN, /* required */
		  Endpoint: email
		};
		// Create promise and SNS service object
		let subscribePromise = new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();

		// Handle promise's fulfilled/rejected states
		subscribePromise.then(
		  function(data) {
		    console.log("Subscription ARN is " + data.SubscriptionArn);
		  }).catch(
		    function(err) {
		    console.error(err, err.stack);
		  });
	}	
	// Create promise and SNS service object
	publishMsg() {
		let publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(this.params).promise();
		publishTextPromise.then((data) => {
		    console.log(`Message ${this.params.Message} sent to the topic ${this.params.TopicArn}`);
		    console.log("MessageID is " + data.MessageId);
	  	}).catch((err) => {
	    	console.error(err, err.stack);
	  	}); 
	}	
	// Handle promise's fulfilled/rejected states
}

module.exports = SNS;