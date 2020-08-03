const Contributor = require('./models/contributor.model');
const User = require('./models/user.model');
const Story = require('./models/story.model');
const StoryUser = require('./models/storyUser.model');
const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://localhost:27017/bajdurek',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
const getRandomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
const fillDataBase = async () => {
  const contributorListId = [];
  const userListId = [];
  const storyListId = [];
  try {
    for (let i = 0; i < 10; i++) {
      const user = new User({
        name: 'userName' + i,
        email: 'userEmail' + i,
        password: 'password' + i,
        cartData: [],
      })
      userListId.push(user._id);
      await user.save();
      const contributor = new Contributor({
        name: 'contributorName' + i,
        email: 'contributorEmail' + i,
        password: 'password' + i,
      })
      contributorListId.push(contributor._id)
      await contributor.save();
    }
    contributorListId.map(async contributorId => {
      try {
        for (let j = 0; j < 10; j++) {
          const story = new Story({
            title: 'Story ' + j + ' title',
            price: 1.33 * j,
            description: 'Description of stroy nr ' + j + 'This is best description.',
            titleImage: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            frames: [
              'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              'https://images.pexels.com/photos/42415/pexels-photo-42415.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              'https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              'https://images.pexels.com/photos/3411134/pexels-photo-3411134.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            ],
            tags: ['action', 'boy', 'girl', 'unisex', 'teen', 'child', 'fun', 'joke'],
            contributor: contributorId._id,
            addDate: Date(),
            formSchema: [
              { name: 'name', label: 'Napisz imię bohatera bajki', type: 'text', defaultValue: 'Imię' },
              { name: 'secondName', label: 'Napisz nazwisko bohatera bajki', type: 'text', defaultValue: 'Nazwisko' },
              { name: 'image', label: 'Dodaj zdjęcie bohatera', type: 'image', defaultValue: ' ' },
            ],
            requirements: [
              'Imię bohatera bajki',
              'Nazwisko bohatera bajki',
              'Zdjęcie portretowe bohatera bajki',
            ],
          });
          storyListId.push(story._id);
          await story.save();
        }
        for(let k = 0; k < 1000; k++){
          const storyUser = new StoryUser({
              user: getRandomFromArray(userListId)._id,
              story: getRandomFromArray(storyListId)._id,
              dataForm: [ ],
              status: 'NEW',
              sampleFrames: ['sample','sample','sample'],
              addDate: Date(),
          });
          await storyUser.save();
        }
      } catch (err) {
        console.log(err);
      }
    })
  } catch (err) {
    console.log(err);
  }
}
db.once('open', () => {
  console.log('OK: Connected to the database');
  fillDataBase();
});
db.on('error', err => console.log('ERROR:' + err))