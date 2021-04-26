//code related to connecting Node server to db

const pg = require('pg');
const dotenv = require("dotenv");
dotenv.config();

//connection string telling the server where our db is and login details
const DB_URL = process.env.DATABASE_URL;

//Connection pooling refers to the method of creating a pool of connections and
//caching those connections so that it can be reused again. 
const options = {
  connectionString: DB_URL,
};

const db = new pg.Pool(options);

//below line checks everything is working so far - should see data logged in
//terminal. 
db.query("SELECT * FROM fac_members")
.then((result) => console.log(result));

//export the pool object so we can reuse it in other files.
module.exports = db;