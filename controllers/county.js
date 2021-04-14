const county = require('../models/county');
const countyWorker = require('../workers/county');

module.exports = {
	index(req, res) {
		var options = {};
		county.find(options).then(function (data) {
			res.status(200).json({
				"status": "success",
				"counties": data,
				"meta": {
					"total": data.length
				}
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	reprocess(req, res) {
		countyWorker.processFetchPopulationByCounty();
		res.status(200).json({
			"status": "success"
		});
	}
};