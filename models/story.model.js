const mongoose = require('mongoose');

const formField = new mongoose.Schema({
  name: {type: String, required: true},
  label: {type: String, required: true},
  defaultValue: {type: String, required: true},
  type: {type: String, required: true},
});

const story = new mongoose.Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  titleImage: {type: String, required: true},
  frames: [String],
  tags: [String],
  contributor: {type: String, required: true, ref: 'Contributor'},
  addDate: Date,
  formSchema: [formField],
  requirements: [String],
});
module.exports = mongoose.model('Story', story);

