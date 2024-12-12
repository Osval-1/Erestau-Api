const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    verifyUser:{
      type: Boolean,
      default: "false"
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      minlength: 9,
      maxlength: 13,
      match: /^(237|00237)[0-9]{7,10}&/
    },
    password: {
      type: String,
    required: [true, "Please provide password!"],
    minLength: 7,
    trim: true,
    validate(value) {
       if( value.toLowerCase().includes("password")) {
       throw new Error("password musn’t contain 'password'!")
      }
   },
    },
    hasDelivery: {
      type: String,
      required: false
    },
    suspended: {
      type: Boolean,
      default: false,
    },

    location:{
      type: String,
      required: [true, "Please provide your location!"]
    },
    
    tokens: [{
      token: {
      type: String,
      required: false
        }
      }],
      
    firebaseToken: [{
        token: {
        type: String,
        required: false
          }
        }],

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);


const userLocation = mongoose.model ("Location", new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  latitude: String,
  longitude: String,
})
);

module.exports = userLocation;

module.exports = User;
