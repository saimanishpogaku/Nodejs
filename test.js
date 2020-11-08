/*
let buf = Buffer.alloc(10,'ahghjhbjb','utf-8');
console.log(buf);
for(let each of buf){
	console.log(buf.toString('utf-8'))
}
*/
const User = require('./models/User');
User.sync().then(() => {
	console.log("table created successfully");
}).catch((reason) => {
	console.log("table creation failed due to"+reason);
});