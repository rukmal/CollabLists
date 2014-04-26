/*
 * @description Schema for song JSON store
 */

mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	artist: {
		type: String,
		required: true
	},
	streaming_service_id: {
		type: String,
		required: true
	},
	album_art_url: {
		type: String,
		required: false
	}
});

module.exports = mongoose.model('Song', songSchema);