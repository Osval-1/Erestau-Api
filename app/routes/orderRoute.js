const express = require("express");
const router = express.Router();

const {
    getOrderUser,
    getOrderRestaurant,
    getOrdersOfTheDay,
    getOrdersCompleted,
    createOrder,
    tokenRoute,
    validateCode,
    getTotalAmountPerWeekPerUser,
    getTotalAmountPerMonthPerUser,
    deleteOrder,
} = require("../controllers/order.controller");

router
      .route("/createOrder")
      .post(createOrder);
router.route("/deliveryCode").post(validateCode);
router.route("/getOrderUser/:orderedBy").get(getOrderUser);
router.route("/getOrderRestaurant/:createdBy").get(getOrderRestaurant);
router.route("/getOrdersCompleted/:createdBy").get(getOrdersCompleted);
router.route("/get-orders-per-day").get(getOrdersOfTheDay);
router.route("/get-orders-per-week").get(getTotalAmountPerWeekPerUser);
router.route("/get-orders-per-month").get(getTotalAmountPerMonthPerUser);
router.route("/delete-order/:id").delete(deleteOrder);
router.route("/token").post(tokenRoute);

module.exports = router;