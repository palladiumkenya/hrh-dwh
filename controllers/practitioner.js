const practitioner = require('../models/practitioner');
const practitionerWorker = require('../workers/practitioner');
var sequelize = require('../config/database').sequelize;

module.exports = {
	index(req, res) {
		var options = {};
		practitioner.find(options).then(function (data) {
			res.status(200).json({
				"status": "success",
				"meta": {
					"total": data.length
				}
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	countyByCountyQualification(req, res) {
		var options = {
			attributes: [
				['workStationCounty', 'county'],
				['qualification', 'cadre'],
				[sequelize.fn('COUNT', sequelize.col('practitionerUniqueId')), 'count'],
			],
			order: [
				['workStationCounty'],
				['qualification'],
			],
			group: ['workStationCounty', 'qualification'],
		};
		practitioner.find(options).then(function (data) {
			res.status(200).json({
				"status": "success",
				"data": data
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