var express =  require('express');
var router = express.Router();
var practitionerController = require('./controllers/practitioner');
var statusController = require('./controllers/status');

router.all('*', checkApiKey);

router.get('/', function(req, res) { res.status(200).json({ status:'OK', message:'HRH to Data Warehouse API' }); });
router.get('/status', statusController.index);
router.get('/practitioners', practitionerController.index);
router.get('/practitioners/count-by-county-qualification', practitionerController.countyByCountyQualification);
router.get('/practitioners/reprocess', practitionerController.reprocess);

function checkApiKey(req, res, next) {
	if(
		req.path == '/' ||
		req.path == '/practitioners/count-by-county-qualification' ||
		req.query.api_key == process.env.API_KEY ||
		req.body.api_key == process.env.API_KEY
	) {
		return next();
  	} else {
  		res.status(550).json({
			"status": "error",
			"message": "permission denied. no api_key"
		});
  	}
}

module.exports = router;