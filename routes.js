var express =  require('express');
var router = express.Router();

router.all('*', checkApiKey);

router.get('/', function(req, res) { res.status(200).json({ status:'OK', message:'HRH to Data Warehouse API' }); });

function checkApiKey(req, res, next) {
	if(req.path == '/' || req.query.api_key == process.env.API_KEY || req.body.api_key == process.env.API_KEY) {
		return next();
  	} else {
  		res.status(550).json({
			"status": "error",
			"message": "permission denied. no api_key"
		});
  	}
}

module.exports = router;