const multer = require('multer');
const express = require('express');
const uploader = require('../helpers/uploader');

const app = express(); 

let storage = multer.memoryStorage()
let upload = multer({ storage: storage })

app.post('/image', upload.single('profile'), (req,res) => {
	console.log(req);
	uploader.uploadFile(req.file.originalname,req.file.buffer).then((data) => {
		return res.status(200).json({
			'msg':'file uploaded successfully',
			'location':data
		})
	}).catch((err) => {
		return res.status(500).json({
			'error':`error occured while file uploading due to ${err}`
		})
	})
})

module.exports = app;