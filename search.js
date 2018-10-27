var mongoose = require('mongoose');

var model = mongoose.model('query', new mongoose.Schema({
	search: {type: String, unique: true}
}));

exports.getModel = function() {
	return model;
}
