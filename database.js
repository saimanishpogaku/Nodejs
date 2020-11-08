require('dotenv').config();
const { Sequelize } = require('sequelize');
const db_name = process.env.DATABASE_NAME;
	const db_uname = process.env.DATABASE_USERNAME;
	const db_port = process.env.DATABASE_PORT;
	const db_url = process.env.DATABASE_URL
	const db_pass = process.env.DATABASE_PASSWORD;
	const sequelize = new Sequelize(db_name, db_uname, db_pass, {
  	host: db_url,
  	port: db_port,
  	dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
async function create_db_connection() {
	try {
  		await sequelize.authenticate();
  		console.log('Connection has been established successfully.');
	} 	catch (error) {
  		console.error('Unable to connect to the database:', error);
	}

}


async function init(){
	await create_db_connection();
}

init();


module.exports = sequelize;
