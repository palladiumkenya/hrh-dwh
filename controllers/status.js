const practitioner = require('../models/practitioner');

module.exports = {
	index(req, res) {
        var options = {};
        Promise.all([
            practitioner.find(options),
        ]).then(function ([practitioner]) {
			res.status(200).json({
				"status": "success",
				"practitioners": practitioner.length,
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	}
};