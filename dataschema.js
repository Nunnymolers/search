var mongoose = require('mongoose');

var model = mongoose.model('results', new mongoose.Schema({
	link: {type: String, unique: true}
  , title: {type: String}
  , contents: {type: String}
  , url: {type: String, unique: true}
}));

exports.getModel = function() {
	return model;
}
