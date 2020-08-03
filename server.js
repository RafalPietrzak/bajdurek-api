const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const contributorsRoutes = require('./routes/contributors.routes');
const storyUsersRoutes = require('./routes/storyUsers.routes');
const storyRoutes = require('./routes/story.routes');
const authRoutes = require('./routes/auth.routes');
const session = require('express-session');
const app = express();
const passport = require('passport');
const passportConfig = require('./config/passport');
const { v4: uuidv4 } = require('uuid');

app.use(cors({
  origin: 'http://localhost:3000',     
  methods: ['GET','POST'],
  credentials: true }
));
app.use(session({
  secret: process.env.secret,
  genid: (req) => uuidv4(),
  name: 'bajdurek'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/user', (req, res, next)=>{
  if(!req.user) {
    res.status(401).json({permission: false, message: 'Permission denied. Not logged'})
  } else {
    next();
  } 
});
app.use('/api', usersRoutes);
app.use('/api', contributorsRoutes);
app.use('/api', storyUsersRoutes);
app.use('/api', storyRoutes);
app.use('/api', authRoutes);

mongoose.connect(
  'mongodb://localhost:27017/bajdurek',
  {useNewUrlParser: true, useUnifiedTopology: true}
);
const db = mongoose.connection;
db.once('open', ()=>{
  const date = new Date();
  console.log( date.toISOString(), 'OK: Connected to the database');
});
db.on('error', err => {
  const date = new Date();
  console.log(date.toISOString(), 'ERROR:' + err)
});
app.listen(8000, ()=> {
  const date = new Date();
  console.log(date.toISOString(), 'OK: Server is running on port: 8000');
});