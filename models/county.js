var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;
var moment = require('moment');

var county = sequelize.define('counties', {
	id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
	name: { type: Sequelize.STRING, allowNull: false },
	population: { type: Sequelize.BIGINT },
}, {
	timestamps: true,
	freezeTableName: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: false, fields: ['name'] },
	]
});

county.sync();

module.exports = {
	find: function (options) {
		if (!options.order) {
			options.order = [['updatedAt', 'DESC']];
		}
		return county.findAll(options);
	},
	create: function (body) {
		var options = {
			where: { name: body.name },
			order: [['updatedAt', 'DESC']]
		};
		return county.findOne(options).then(function (data) {
			if(data) {
				body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
				return data.update(body);
			} else {
				return county.create(body);
			}
		});
	},
	update: function (body) {
		if (body.id) {
			return county.findById(body.id).then(function (data) {
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