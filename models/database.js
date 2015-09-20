var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/potfund_development';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, title VARCHAR(40) not null, genre VARCHAR(40) not null, minimum_age INT default null, maximum_age INT default null, amount INT default null, invite_only BOOLEAN, timestamp timestamp default current_timestamp)');
query.on('end', function() { client.end(); });
