const practitioner = require('../models/practitioner');
const practitionerWorker = require('../workers/practitioner');

module.exports = {
	index(req, res) {
		var options = {};
		practitioner.find(options).then(function (data) {
			res.status(200).json({
				"status": "success",
				"meta": {
					"total": data.count
				}
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	reprocess(req, res) {
		practitionerWorker.processFetchPractitioners();
		res.status(200).json({
			"status": "success"
		});
	}
};