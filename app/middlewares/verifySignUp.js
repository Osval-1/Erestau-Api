const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrPhone = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      phone: req.body.phone
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Phone number is already in use!" });
        return;
      }

      next();
    });
  });
};

//This code considers if the user is logged in or not

loginAuth = async(req, res, next) => {
  try {
    //const token = req.headers('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, config.secret)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token':token });

    const isTokenExpired = Date.now() >= decoded.exp * 1000
    if(isTokenExpired){
      user.tokens = [];
      await user.save();

      res.status(301).json({ message: "Token expired! Please login again" } );
    }

    req.user.tokens =  req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    req.user.tokens = [];
    await req.user.save();
          res.send();
  if(!user) {
  throw new Error
  }
    req.token = token
    req.user = user
  next()
  } catch (error) {
  res.status(401).send({error: "Authentication required"})
   }
  }

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrPhone,
  loginAuth,
  checkRolesExisted
};

module.exports = verifySignUp;
