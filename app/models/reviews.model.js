const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user's Id"],
        ref: "User"
    },
    rating: {
        type: Number,
        required: [true, "Please provide rating"],
        default: 1,
        maxlength: 5
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide product id"],
        ref: "Products"
    }
});

module.exports = mongoose.model("Review", reviewSchema);