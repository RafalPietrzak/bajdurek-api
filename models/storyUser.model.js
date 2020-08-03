const mongoose = require('mongoose');

const formFieldValue = new mongoose.Schema({
  name: {type: String, required: true},
  value: {type: String, required: true}
});
const storyUser = new mongoose.Schema({
  user: {type: String, required: true, ref: 'User'},
  story: {type: String, required: true, ref: 'Story'},
  dataForm: [formFieldValue],
  status: {type: String, required: true},
  sampleFrames: [String],
  generatedDate: Date,
  addDate: Date,
});
module.exports = mongoose.model('StoryUser', storyUser);

