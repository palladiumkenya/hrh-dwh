var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;
var moment = require('moment');

var practitioner = sequelize.define('practitioners', {
	id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
	practitionerUniqueId: { type: Sequelize.STRING },
	nationalId: { type: Sequelize.STRING },
	firstName: { type: Sequelize.STRING },
	middleName: { type: Sequelize.STRING },
	lastName: { type: Sequelize.STRING },
	dateOfBirth: { type: Sequelize.STRING },
	dateOfBirthPrecision: { type: Sequelize.STRING },
	sex: { type: Sequelize.STRING },
	postalAddress: { type: Sequelize.STRING },
	phoneNumber: { type: Sequelize.STRING },
	email: { type: Sequelize.STRING },
	qualification: { type: Sequelize.STRING },
	deploymentDate: { type: Sequelize.STRING },
	employmentType: { type: Sequelize.STRING },
	workStationType: { type: Sequelize.STRING },
	mflCode: { type: Sequelize.STRING },
	workStation: { type: Sequelize.STRING },
	workStationArea: { type: Sequelize.STRING },
	workStationCounty: { type: Sequelize.STRING },
	deploymentEndDate: { type: Sequelize.STRING },
}, {
	timestamps: true,
	freezeTableName: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: false, fields: ['practitionerUniqueId'] },
		{ unique: false, fields: ['nationalId'] },
	]
});

practitioner.sync();

module.exports = {
	find: function (options) {
		if (!options.order) {
			options.order = [['updatedAt', 'DESC']];
		}
		return practitioner.findAll(options);
	},
	create: function (body) {
		var options = {
			where: { practitionerUniqueId: body.practitionerUniqueId },
			order: [['updatedAt', 'DESC']]
		};
		return practitioner.findOne(options).then(function (data) {
			if(data) {
				body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
				return data.update(body);
			} else {
				return practitioner.create(body);
			}
		});
	},
	update: function (body) {
		if (body.id) {
			return practitioner.findById(body.id).then(function (data) {
				if(data) {
					body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					return data.update(body);
				} else {
					return this.create(body);
				}
			});
		}
		return this.create(body);
	}
}