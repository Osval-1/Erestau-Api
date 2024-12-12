const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const admin = require('firebase-admin');
const Token = require("../models/user-token");
const { response } = require("express");



var serviceAccount = require("../../e-restou-alziron-firebase-adminsdk-37aq4-324ba2051c.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL,
  });

  
function generateOTP() {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const otp = generateOTP();


const createOrder = async (req, res) => {
    try {

      const newOrder = req.body.map((items)=>{
        const uniqueCode = generateOTP();
        return{...items,uniqueCode:uniqueCode}
      });

      let products = await Order.create(newOrder);

      const userTokens = await Promise.all(
        newOrder.map(async (order) =>{
          try{
            const users = await Token.find({ userId: order.createdBy });
            users.forEach((user) => {
              const message = {
                token: user.token,
                notification: {
                  title: "New Order!",
                  body: ` Mr ${order.customerName} from ${order.customerLocation} has purchased ${order.quantity} orders of ${order.productName} with unique code ${order.uniqueCode} `,
                },
              };
              admin
              .messaging()
              .send(message)
              .then((response) =>{
                console.log("Push notification sent successfully!", response);
              }).catch((error) =>{
                console.log("Error sending push notification!", error);
              });
            });
            return users;
          }catch(error){
            res.status(404).json({ msg: "Error occured!" });
          }
        })
      );

      res.json(products)
      } catch (error) {
        console.error('Error sending FCM notification:', error);
      }
  };

  const getOrderUser = async (req, res) =>{
    try{
      const orderedBy  = req.params.orderedBy;
      
      const order = await Order.find({ orderedBy });

      res.status(202).json({ order });
    }catch(error){
      res.status(404).json({ message: "Error occured while getting Order" });
    }
  }

const getOrderRestaurant = async (req, res) =>{
  try{
    const  restaurantId  = req.params.createdBy;

    Order.find({ createdBy: restaurantId, status: { $ne: "completed" } }, (err, orders) => {
      if(err){
        res.status(500).json({ msg: "Error while getting orders" });
      }else{
        res.status(200).json({ orders });
      }
    });
    
  }catch(error){
    res.status(404).json({ message: "Error occured while getting restaurant food!" });
  }
}

const getOrdersCompleted = async (req, res) => {
  try {
    const createdBy = req.params.createdBy;

    Order.find({ createdBy: createdBy, status: 'completed' }, (err, orders) => {
      if (err) {
        res.status(500).json({ msg: 'Error retrieving completed orders' });
      } else {
        res.status(200).json({ orders });
      }
    });
  } catch (error) {
    res.status(404).json({ msg: "Error Occured while getting completed orders" });
  }
}

const getOrdersOfTheDay = async (req, res) =>{
  try{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const order = await Order.find({
      createdAt: { $gte: today },
    });

    const totalPricePerUser = order.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      }else{
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});
    console.log(totalPricePerUser);

    res.json(totalPricePerUser);

  }catch(error){
    res.status(404).json({ message: "Error occured while getting food!" });
  }
};

const getTotalAmountPerWeekPerUser = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date()
    weekAgo.setDate(today.getDate() - 7);

    const orders = await Order.find({
      createdAt: { $gte: weekAgo, $lte: today },
    });

    const totalPricePerUser = orders.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      } else {
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});

    res.json({ totalPricePerUser });
  } catch (error) {
    res.status(400).json({ msg: "Error occured!" });
  }
};

const getTotalAmountPerMonthPerUser = async (req, res) => {
  try {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    const orders = await Order.find({
      createdAt: { $gte: monthAgo, $lte: today },
    });

    const totalPricePerUser = orders.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      } else {
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});

    res.json({ totalPricePerUser });
  } catch (error) {
    res.status(401).json({ msg: "Error occured!" });
  }
}

const getUserBalance = async (req, res) =>{
  try{
    const user = await User.findOne({ username: req.params.username });
    const userId = user.id;

    const orders = await Order.find({ 
      createdBy: userId,
      status: "completed",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    let totalAmount = 0;
    for(const order of orders){
      totalAmount += order.price;
    }

    res.status(200).json({ totalAmount });
    
  }catch(error){
    res.status(404).json({ message: "Error occured while getting user balance!" });
  }
}

const deleteOrder = async (req, res) =>{
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id });

        if(!order){
            res.status(400).json({ message: "Order not found!" });
        };
        
        order.remove();
        res.status(200).json({ message: "Order successfully deleted!" });
    } catch (error) {
        res.status(404).json({ message: "Error occured while trying to delete order!" });
    };
};

const tokenRoute = async(req, res) =>{
  try{
    const user = await User.findOne({ username: req.body.username });
    const token = req.body.token;

    const notificationToken = new Token({
      token: notificationToken,
      userId: user.id,
    });

    const savedToken = notificationToken.save();

    res.status(200).json({ savedToken });
  }catch(error){
    res.status(400).json({ error: "Error occured!" });
  }
};

const validateCode = async(req, res) =>{
  try {
    const code = req.body.uniqueCode;
  // const orderedBy = req.body.orderedBy;

  Order.findOne({ uniqueCode: code }, (err, result) => {
    if (err) {
      res.status(404).json({ msg: "Error Occurred!" });
    } else if (result) {
      // Update the order status
      result.status = "completed";
      result.save((err) => {
        if (err) {
          res.status(500).json({ msg: "Failed to update order status" });
        } else {
          res.status(200).json({ msg: "Delivery confirmed!" });
        }
      });
    } else {
      res.status(404).json({ msg: "Wrong code inserted" });
    }
  });
  
  } catch (error) {
    res.status(400).json({ msg: "Error occured!" });
  }
}


module.exports = {
    getOrderUser,
    getOrderRestaurant,
    createOrder,
    deleteOrder,
    tokenRoute,
    validateCode,
    getUserBalance,
    getOrdersOfTheDay,
    getOrdersCompleted,
    getTotalAmountPerWeekPerUser,
    getTotalAmountPerMonthPerUser
}

//google maps API key = AIzaSyD6s-1OllYQhM8mfw_5nqwwKPtym_IPO20