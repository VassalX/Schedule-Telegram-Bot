
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/DBName", { useMongoClient: true });
var db = mongoose.connection;

console.log("db: ", db);

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});