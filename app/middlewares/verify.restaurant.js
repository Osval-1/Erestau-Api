const User = require("../models/user.model");
const verifyUser = async (req, res, next) =>{
    try{
        const user = await User.findOne({ username: req.body.username });
            if(!user){
                res.status(404).json({ msg: "Cannot find user!" });
            }else if(user.verifyUser === "true"){
                res.status(200).json({ msg: "You are a verified user!" });
                next();
            }else{
                res.status(404).json({ msg: "You are not a verified user!" });
            }
        
    }catch(error){
        res.status(404).json({ msg: "Error verifying your identity!"})
    }
};

module.exports = { verifyUser };