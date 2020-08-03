const User = require('../models/user.model');

exports.getUserById = async (req, res) => {
  try {
    //console.log(req.user);
    const {provider, id, displayName, emails} = req.user;
    const user = await User.findOne({id: id + provider}).populate();
    if(!user){
      newUser = new User({
        id: id + provider,
        name: displayName,
        email: emails[0].value,
        cart: [],
        userStory: [],
        orders: [],        
      });
      newUser.save()
    };
    res.json({
      name: user ? user.name : newUser.name,
      cart: user ? user.cart : newUser.cart,
      stroyShelf: user ? user.storyShelf : newUser.storyShelf,
    });
  } catch (err) {
    console.log('ERROR:' + err);
    res.status(500);
  }
}
exports.newOrder = async (req, res) => {
  try {
    const {provider, id, displayName} = req.user;
    const newOrder = {
      cart: req.body.map(item=>({story: item._id, count: item.count})),
      status: 'NEW',
    };
    const user = await User.findOne({id: id + provider});
    user.orders.push(newOrder);
    user.save();
    //TODO add summary and redirect to pay api not to paid end
    res.redirect('/api/user/pay');
    
  } catch (err) {
    console.log('ERROR:' + err);
    res.status(500);  
  }
}