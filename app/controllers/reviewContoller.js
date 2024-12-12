const User = require("../models/user.model");
const Review = require("../models/reviews.model");
const Product = require("../models/product.model");

const createReview = async (req, res) => {
    try {
        const username = await User.findOne({ username: req.body.username });
        const userId = username.id;
        const productId = req.body.productId
        // if (!product) {
        //   return res.status(404).json({ error: 'Product not found' });
        // }
    
        const review = new Review({
          userId,
          productId,
          rating: req.body.rating,
        });
    
        const savedReview = await review.save();
        res.status(200).json({ savedReview });

        
        
        // Review.find({}, "rating", (err, products) =>{
        //   if(err){
        //     console.log("error occured!",err);
        //     return
        //   }

        //   // Calculate the total price by summing the `price` values
        // const totalPrice = products.reduce((sum, product) => sum + product.rating, 0);
      
        // // Calculate the average price
        // const averagePrice = totalPrice / products.length;
      
        // console.log('Total price:', totalPrice);
        // console.log('Average price:', averagePrice);
        // });

      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

//Get all reviews for single product!
const getSingleReview = async (req, res) => {
    const { productId } = req.params;
    Review.findOne({ productId }).then((review) => res.status(200).json({ review }))
    .catch((error) => {
        res.status(404).json({ message: error})
    })
};

const getAverageReview = async (req, res) => {
  try{
    const productId = req.body.productId
    const username = await User.findOne({ username: req.body.username });
    const userId = username.id;

     const ratings = await Review.find({ userId });
     const ratingValues = ratings.map(rating => rating.rating);

     const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);

     // Calculate the average
     const average = sum / ratingValues.length;

        res.status(200).json({ average });
  }catch(error){
    res.status(404).json({ msg: "Error occured while getting average review!" });
  }
}

// GET a specific review for a product
const getSpecificReview = async (req, res) => {
    const { reviewId } = req.params;
  
    // Retrieve the specific review based on the reviewId
    Review.findById(reviewId)
      .then((review) => {
        if (!review) {
          return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  };

  const updateReview = async (req, res) =>{
        const { reviewId } = req.params;
        const { rating } = req.body;
      
        // Find the review by ID and update its properties
        Review.findByIdAndUpdate(
          reviewId,
          { rating },
          { new: true }
        )
          .then((updatedReview) => {
            if (!updatedReview) {
              return res.status(404).json({ error: 'Review not found' });
            }
            res.json(updatedReview);
          })
          .catch((err) => res.status(500).json({ error: err.message }));
  };

// DELETE a review for a product
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
  
    // Find the review by ID and remove it
    Review.findByIdAndDelete(reviewId)
      .then((deletedReview) => {
        if (!deletedReview) {
          return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  };

// const getSingleProductReviews = async (req, res) =>{
//     const { id: productId } = req.params;
//     const review = await Review.findOne({ product: productId });
//     res.status(200).json({ review, count: review.length });
// };

module.exports = {
    createReview,
    getSpecificReview,
    getAverageReview,
    deleteReview,
    getSingleReview,
    updateReview
}