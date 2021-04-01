var express =  require('express');
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')
var conf = require('dotenv').config();
var port = process.env.API_PORT;
var app = express();
var logDirectory = path.join(__dirname, 'logs')
var router = require('./routes');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs.createStream('access.log', { interval: '1d', compress: "gzip", path: logDirectory })

app.use(morgan('combined', {stream: accessLogStream}))
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	.json({
		status: 'error',
		message: err.message
	});
});
app.listen(port, function() {
	console.log('Server started on port ' + port);
});
module.exports = app;