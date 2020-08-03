const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
  '/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile']})
);
router.get(
  '/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: `${process.env.clientURL}/no-permission`}),
  (req, res) => {
    res.redirect(process.env.clientURL);
});
router.get(
  '/auth/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.clientURL);
  }
)
module.exports = router;