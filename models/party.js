/*
 * @description Schema for a party JSON store
 */
var mongoose = require('mongoose');

var partySchema = new mongoose.Schema({
	partyName: {
		type: String,
		required: true
	},
	owners: {
		type: Array,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	location: {
		type: String,
		required: true
	},
	playlist:{
		type: Array,
		required: true
	}
});

module.exports = mongoose.model('Party', partySchema)