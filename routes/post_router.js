const express = require("express");

const post_router = express();

post_router.get('/',Authorize,(req,res) => {
	
});

module.exports = post_router;