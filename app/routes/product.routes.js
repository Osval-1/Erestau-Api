const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");

const verifySignup = require("../middlewares/verifySignUp");
const { verifyUser } = require("../middlewares/verify.restaurant");
const controller = require("../controllers/user.controller");

// const upload = multer({ dest: "upload/"});

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    getProductByCategory,
    deleteProduct,
    getALLProductsBySingleUser,
    getMostFrequentlyBoughtProduct,
    getDashboard,
    searchProduct,
    upload,
} = require("../controllers/product.controller");

router.route("/createProduct").post(upload.single('image'),createProduct);
router.route("/getall", authJwt.checkSuspendedAccount).get(getAllProduct);
router.route("/getDashboard", authJwt.checkSuspendedAccount).get(getDashboard);
router.route("/search", authJwt.checkSuspendedAccount).get(searchProduct);
router.route("/get-product-category").get(getProductByCategory);
router.route("/get-frequently-bought").get(getMostFrequentlyBoughtProduct);
router.route("/getAllProductsBySingleUser/:userId", authJwt.checkSuspendedAccount).get(getALLProductsBySingleUser);
router.route("/:id", authJwt.checkSuspendedAccount).get(getSingleProduct)/*.patch(updateProduct)*/.delete(deleteProduct);

// router.route("/uploadImage")
// .post([authJwt.verifyToken], uploadImage);


module.exports = router;
