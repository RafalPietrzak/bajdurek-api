const mongoose = require('mongoose');
const formFieldValue = new mongoose.Schema({
  name: {type: String, required: true},
  value: {type: String, required: true}
});
const cartItem = new mongoose.Schema({
  count: {type: Number, required: true},
  story: {type: String, required: true, ref:'Story'}
});
const order = new mongoose.Schema({
  status: {type: String, required: true},
  cart: [cartItem],
  orderDate: Date
})
const storyShelfItem = new mongoose.Schema({
  story: {type: String, required: true, ref: 'Story'},
  dataForm: [formFieldValue],
  status: {type: String, required: true},
  sampleFrames: [String],
  generatedDate: Date,
  addDate: Date,
})
const user = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  cart: [cartItem],
  orders: [order],
  storyShelf: [storyShelfItem],
  email: {type: String, required: true},
});
module.exports = mongoose.model('User', user);

