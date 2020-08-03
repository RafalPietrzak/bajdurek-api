const Story = require('../models/story.model');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getAll = async (req, res) => {
  try {
    const sto = await Story.find({}, { price: 1, title: 1, titleImage: 1 });
    res.json(sto);
  } catch (err) {
    console.log('ERROR:' + err);
    res.status(500);
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
      const sto = await Story.findById(req.params.id).populate('contributor');
      if (!sto) {
        res.status(404).json({ message: 'Not found' });
      } else { res.json(sto); }
    } else {
      res.status(400).json({ message: 'Bad id' });
    }
  } catch (err) {
    console.log('ERROR:' + err);
    res.status(500);
  }
}