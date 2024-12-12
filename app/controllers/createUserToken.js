const User = require("../models/user.model");
const Token = require("../models/user-token");

const createUserToken = async (req, res)=>{
    try {
        const username = await User.findOne({ username: req.body.username });
        const userId = username.id;


        if(!userId){
           console.log("User not found!");
        }

        const checkToken = await Token.findOne({ userId });

        if(checkToken){
           console.log("Token already exist!");
           res.status(404).json({ msg: "Token already exist!"});
           return
        }

        const newToken = new Token({
           userId,
           token: req.body.token
        });

     const savedToken = await newToken.save();
     res.json({ savedToken });
    } catch (error) {
        res.status(404).json({ msg: "Error while creating user token!"});
    }
}

module.exports = {
    createUserToken
}