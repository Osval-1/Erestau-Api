const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide User id"],
    },
    token: {
        type: String,
        required: [true, "Please provide message"],
    }
},
{
    timestamps: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Token", tokenSchema);