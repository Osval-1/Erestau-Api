const mongoose = require("mongoose");

const orderSchema = mongoose.model("Order", new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    uniqueCode: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Please provide price!"]
    },
    productName: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true,
    },
    ownerLocation: {
      type: String,
      required: true
    },
    customerLocation: {
      type: String,
      required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
      type: String,
      required: true,
    },
    deliveryNumber: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status:{
        type: String,
        enum: ["pending", "failed", "completed", "canceled"],
        default: "pending",
    },
    token: [{
      type: String,
      // required: [true, "Please provide notification token"],
    }]
  
}
));

module.exports =  orderSchema 

