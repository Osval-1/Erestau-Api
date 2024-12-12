const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require('mongoose');
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./e-restou-alziron-firebase-adminsdk-37aq4-883e03d2e8.json");
mongoose.set('strictQuery', false);
const AWS = require('aws-sdk');
require('dotenv').config();

//routers
const productRoute = require("./app/routes/product.routes");
const reviewRoute = require("./app/routes/review.route");
const userRoute = require("./app/routes/user.routes");
const orderRoute  = require("./app/routes/orderRoute");
const searchUser = require("./app/routes/user");
const calculateUserBalancePerDay = require("./app/routes/user");
const user_token = require("./app/routes/createUserToken");
const makeUserVerified = require("./app/routes/user");
const recomendation = require("./app/routes/recommendation.route");
const frequentlyBought = require("./app/routes/product.routes");

const app = express();


app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  if (!admin.apps.length) {
    const firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    });
};

const message = {
  Notification: {
    title: "Test Your luck",
    body: "Not bad then",
  },
  //token: registrationToken
}

//AWS
// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
  accessKeyId: 'AKIAWY2J6GUJWDH5TXPN',
  secretAccessKey: '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',
  region: 'us-east-1'
});
const s3 = new AWS.S3();

app.use(express.static('./uploads'));

app.get("/", (req, res) =>{
  res.send("Welcome to alziron systems app!")
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.use(`${process.env.API_VERSION}/product`, productRoute);
app.use(`${process.env.API_VERSION}/review` ,reviewRoute);
app.use(`${process.env.API_VERSION}/user`, userRoute);
app.use(`${process.env.API_VERSION}/order`, orderRoute);
app.use(`${process.env.API_VERSION}/search`, searchUser);
app.use(`${process.env.API_VERSION}/`, calculateUserBalancePerDay);
app.use(`${process.env.API_VERSION}/recommendation`, recomendation);
app.use(`${process.env.API_VERSION}/token`, user_token);
app.use(`${process.env.API_VERSION}/verify`, makeUserVerified);
app.use(`${process.env.API_VERSION}`, frequentlyBought);


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'restaurant' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
