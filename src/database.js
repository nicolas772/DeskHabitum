const pg = require('pg');

const conString = "Ipostgres://bfrgouab:1G3nqhUwUmzEqg-_zHM8Pk36iX6lRrml@kesavan.db.elephantsql.com/bfrgouab" //Can be found in the Details page
const client = new pg.Client(conString);
module.exports = client;

