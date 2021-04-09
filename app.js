var express =  require('express');
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')
var conf = require('dotenv').config();
var http = require('http');
var https = require('https');
var httpPort = process.env.API_HTTP_PORT;
var httpsPort = process.env.API_HTTPS_PORT;
var keyPath = '/etc/ssl/private/hrh-dwh.key';
var certPath = '/etc/ssl/certs/hrh-dwh.crt';
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

http.createServer(app).listen(httpPort, function() {
	console.log('HTTP server started on port ' + httpPort);
});

if (process.env.APP_ENV === 'production' && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
	https.createServer({
		key: fs.readFileSync(keyPath, 'utf8'),
		cert: fs.readFileSync(certPath, 'utf8')
	}, app).listen(httpsPort, function() {
		console.log('HTTPS server started on port ' + httpsPort);
	});
}

var CronJob = require('cron').CronJob;
var practitionerWorker = require('./workers/practitioner');

var practitionersPullJob = new CronJob('0 3 * * *', function() { // everyday at 3am
    practitionerWorker.processFetchPractitioners();
}, null, true, 'Africa/Nairobi');
practitionersPullJob.start();