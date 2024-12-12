const Product  = require("../models/product.model");
const User = require("../models/user.model");
const multer = require("multer");
const sharp = require("sharp");
const Order = require("../models/order.model")
const dbConfig = require("../config/db.config");
const AWS = require("aws-sdk");

require('dotenv').config()

//Firebase
var admin = require("firebase-admin");

var serviceAccount = require("../../e-restou-alziron-firebase-adminsdk-37aq4-324ba2051c.json");
const { collection } = require("../models/order.model");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
  storageBucket: process.env.BUCKET_URL
}, "bucket");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createProduct = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user.verifyUser){
      res.status(200).json({error:"Restaurant not verified"})
      return
    }

    const { originalname, buffer } = req.file;

    const compressedImageBuffer = await sharp(buffer)
    .resize({ width: 800 }).jpeg({ quality: 70 }).toBuffer();

    // Create a unique filename for the uploaded image
    const filename = `${Date.now()}_${originalname}`;

    // Upload the image file to Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(filename);
    await file.save(compressedImageBuffer, {
      metadata: {
        contentType: req.file.mimetype, // Set the appropriate content type for your image
      },
    });

    // Get the public URL of the uploaded image
    const url = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Set an appropriate expiration date
    });


    const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: url[0],
            owner: user._id,
            ownerName: req.body.username,
            ownerLocation: user.location,
            path: filename
          });
        
          const savedProducts = await newProduct.save();
         console.log(savedProducts);

    res.status(200).json({ url });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('An error occurred while uploading the image.');
  }
}

const getProductByCategory = async(req, res)=>{
  try {
    const categoryName = req.body.category;

    const date = new Date();
    date.setHours(0,0,0,0);

    const category = await Product.find({ 
      categoryName,
      createdAt: { $gte: date },
    });

    res.status(200).json({ category });
  } catch (error) {
    res.status(404).json({ msg: "Error occured while getting product by category" });
  }
}


const getAllProduct = async (req, res) =>{
    const products = await Product.find({});

res.status(200).json({ products/*, count: products.length*/ });
};

const getALLProductsBySingleUser = async (req, res) =>{
    const userId = req.params.userId

    const products = await Product.find({ owner: userId });

    res.status(200).json({ products });
}

const getSingleProduct = async (req, res) =>{
const product = await Product.findById(req.params.id);
      res.status(200).json(product);
};

//Get recent products

const getDashboard = async (req, res) =>{
    try{
        const product = await Product.find({})
        .sort({ createdAt: -1 }).limit(20)
//The below code is to get the most frequently ordered products
// For a month
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
    
        const orders = await Order.find({
          createdAt: { $gte: monthAgo, $lte: today },
        });
    
          const productCount = {};
    
          //count the occurance of each Id
          orders.forEach((order)=>{
            const productName = order.productName;
            if (productName) {
              productCount[productName] = (productCount[productName] || 0) + 1;
            }
          });
    
           // Sort product IDs based on occurrence counts in descending order
        const sortedProductNames = Object.keys(productCount).sort(
          (a, b) => productCount[b] - productCount[a]
        );
    
        // Retrieve the most frequently ordered product IDs
        const mostFrequentlyBoughtProductNames = sortedProductNames.slice(0, 10);
        //searching products in the database
        let products = [];
    
        const frequentlyBoughtProducts = await Promise.all(
          mostFrequentlyBoughtProductNames.map(async (productName) => {
            try{
              const product = await Product.findOne({ name: productName });
              return product;
            }catch(error){
              console.log(error);
            }
          })
        );

        res.status(200).json({ product, frequentlyBoughtProducts });
    }catch(error){
        res.status(404).json({ message: "Error occured while getting recent product!" });
    }
}

const deleteProduct = async (req, res) =>{
    const { id } = req.params;
   try{
    const image = await Product.findOne({ _id: id });

    if(!image){
      res.status(200).json("Image not found!");
      return;
    };

     // Delete the image from Firebase Storage
     admin.storage().bucket().file(image.path).delete();

     // Delete the image record from MongoDB
    await Product.deleteOne({ _id : id });

    res.status(200).json({ message: 'Image deleted successfully!' });
   }catch(err){
    res.status(404).json({ msg: "Error while deleting picture!" });
   }
};

const searchProduct = async (req, res) => {
    const searchTerm = req.query.q; // Get the search query parameter from the request
  
    try {
      const results = await Product.find({ 
        $or: [ 
        { name: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
        ]
     });
  
      res.json(results);
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'An error occurred during the search' });
    }
  };

  const getMostFrequentlyBoughtProduct = async(req, res)=>{
    "use strict"
    try{
      const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    const orders = await Order.find({
      createdAt: { $gte: monthAgo, $lte: today },
    });

      const productCount = {};

      //count the occurance of each Id
      orders.forEach((order)=>{
        const productName = order.productName;
        if (productName) {
          productCount[productName] = (productCount[productName] || 0) + 1;
        }
      });

       // Sort product IDs based on occurrence counts in descending order
    const sortedProductNames = Object.keys(productCount).sort(
      (a, b) => productCount[b] - productCount[a]
    );

    // Retrieve the most frequently ordered product IDs
    const mostFrequentlyBoughtProductNames = sortedProductNames.slice(0, 10);
    //searching products in the database
    let products = [];

    const frequentlyBoughtProducts = await Promise.all(
      mostFrequentlyBoughtProductNames.map(async (productName) => {
        try{
          const product = await Product.findOne({ name: productName });
          return product;
        }catch(error){
          console.log(error);
        }
      })
    )

    res.status(200).json({ frequentlyBoughtProducts });
    }catch(error){
      res.status(404).json({ msg: "Error getting frequently ordered products!" });
    }
  }


module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    getProductByCategory,
    deleteProduct,
    getALLProductsBySingleUser,
    getDashboard,
    searchProduct,
    getALLProductsBySingleUser,
    getMostFrequentlyBoughtProduct,
    upload,
}

