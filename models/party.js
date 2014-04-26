/*
 * @description Schema for a party JSON store
 */
var mongoose = require('mongoose');

var partySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	owner_first: {
		type: String,
		required: true
	},
	owner_last: {
		type: String,
		required: true
	},
	owner_id: {
		type: String,
		required: true
	},
	collaborators: {
		type: Array,
		required: false
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
		required: false
	},
	played_songs: {
		type: Array,
		required: false
	}
});

module.exports = mongoose.model('Party', partySchema);