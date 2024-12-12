const User = require("../models/user.model");
const Token = require("../models/user-token");
const { VerifyToken } = require("../middlewares/authJwt");
const db = require("../models");
const Role = db.role;

const Signin = require("./auth.controller");

const updateUserPassword = async (req, res) =>{
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword ) {
        return res.status(500).send("Please provide both fields");
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect) return res.status(404).send("Invalid credentials");

    user.password = newPassword;

    await user.save();
    res.status(StatusCode.OK).json({ msg: "Password changed successfully!" });
}

const showCurrentUser = async (req, res) =>{
    res.status(200).json({ user })
}

const updateUserNameAndPhone = async (req, res) =>{
    const { phone, username } = req.body;

    if(!phone || !username) return res.status(404).send("Please provide both fields! ");

    const user = await User.findOne({
         _id: req.user.userId 
    });

    user.phone = phone;
    user.username = username;

    await user.save();

    const tokenUser = VerifyToken.verifyToken(user);
    Signin.signin({ res, user: tokenUser });
}

const suspendAccount = async (req, res) =>{
    try {
        const user = await User.findOne({ username: req.body.username });
        const userId = user.id;
        // console.log(userId);

        if(!userId) return res.status(404).send("User not found!");

        User.findByIdAndUpdate(userId, {
            suspended: true
        }, (err, user) => {
            if(err) return res.status(500).send(err);
            res.status(200).json({ msg: "User suspended successfully!", user });
        })
    } catch (error) {
        res.status(401).json({ msg: "Internal server error!" });
    }
};

const unsuspendUser = async (req, res) =>{
    try{
        const user = await User.findOne({ username: req.body.username });
        const userId = user.id;

        if(!userId) return res.status(404).send("User not found!");

        User.findByIdAndUpdate(userId, {
            suspended: false
        }, (err, user) => {
            if(err) return res.status(500).send(err);
            res.status(200).json({ msg: "User unsuspended successfully!", user });
        })
    }catch(error){
        res.status(404).json({ msg: "Internal server error" });
    }
}

const searchUser = async (req, res) =>{
    const { searchWord } = req.query

  try{
    const regex = new RegExp(searchWord, 'i');
    const users = await User.find({ username: regex });

    if(users.length === 0) return res.status(404).send("User not found!");

    res.status(200).json({ users });
  }catch(error){
    res.status(401).json({ msg: "Internal server error!" });
  }
}

const calculateUserBalancePerDay = async (req, res) =>{
    try{}catch(error){
        res.status(404).json({ msg: "Internal server error!" });
    }
}


const makeUserVerified = async (req, res) =>{
    const username = req.body.username;
    try {
     
    const user = await User.findOne({ username });

     user.verifyUser = true;
     await user.save();
 
     console.log(user);
     res.status(200).json({ msg: "User verified successfully!" });
    } catch (error) {
     res.status(404).json({ msg: "Error while making user verified!"})
    }
 };


module.exports = {
    updateUserPassword,
    updateUserNameAndPhone,
    showCurrentUser,
    suspendAccount,
    searchUser,
    unsuspendUser,
    calculateUserBalancePerDay,
    makeUserVerified,
}
