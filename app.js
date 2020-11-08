require("dotenv").config();
const express = require("express");
const path = require("path");
const os = require("os");
const bodyParser = require("body-parser");
const userRouter = require(path.join(__dirname,'./routes/users'));
const uploadRouter = require(path.join(__dirname,'./routes/upload_router.js'));
//const jwt = require("jsonwebtoken")
//const create_token = require("./create_token");
const JWT = require('./helpers/token');
let jwt_obj = JWT;
const app = express();
//const post_router = require(path.join(__dirname,"routes/post_router"));
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/test',(req,res) => {
	console.log(req)
})

app.use("/v1/users",userRouter);

app.use("/v1/upload",uploadRouter);
app.get('/posts',Authorize,(req,res) => {
	console.log("authorization success")
});

//app.use("/v1/posts",post_router)

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`server listening on ${port}`);
})

function Authorize(req,res,next) {
	var token = req.headers["authorization"] || '';
	if(token === ''){
		res.status(403).json({'message': 'please add a valid token'});
	}
	let token_array = token.split(' ');
	let decoded = token_array[1]
	res.status(200).json({'message': 'success'});
	next();
}