const { Client } = require('pg');
 
const client = new Client({
	user: 'username',
	password: 'password',
	host: 'host',
	port: 5432,
	database: 'database_name',
});


client.connect()
      .then(() => {
        console.log("Connected to Database")
      })
      .catch((err) => {
        console.error("Error connecting to database ", err)
      })

module.exports = client; 