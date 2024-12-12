const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");

const {
    createReview,
    getSpecificReview,
    getSingleReview,
    deleteReview,
    updateReview,
    getAverageReview
} = require("../controllers/reviewContoller");

router.route("/createReview").post(createReview)
router.route("/getSingleReview").get(getSingleReview);
router.route("/get-average-review").get(getAverageReview);
router.route('/:productId/reviews/:reviewId').get(getSingleReview)
                                             .put(updateReview)
                                             .delete(deleteReview);

// router.route("/:id/review").get(getSingleReview)
//                     .patch([authJwt.verifyToken], updateReview)
//                     .delete([authJwt.verifyToken], deleteReview);

module.exports = router;