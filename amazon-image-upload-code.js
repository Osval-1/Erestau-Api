
// Configure multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// AWS.config.update({
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRETE_ACCESS,
//     region: process.env.REGION,
//   });
//   const s3 = new AWS.S3();


// const createProduct = async(req, res) => {
    // try{ 
//     const imageFile = req.file;
  
  
//     const compressedImageBuffer = await sharp(imageFile.buffer)
//     .toFormat("jpeg").jpeg({ quality: 70}).toBuffer();
  
//      // Upload the compressed image file to S3 bucket
//      const uploadParams = {
//       Bucket: 'newalzironbucket',
//       Key: `${Date.now()}-${imageFile.originalname}`,
//       Body: compressedImageBuffer,
//       ACL: 'public-read',
//       ContentType: imageFile.mimetype
//     };
  
//     const uploadResult = await s3.upload(uploadParams).promise();

//     const user = await User.findOne({ username: req.body.username });
  
//       // Get the S3 image URL
//       const imageUrl = uploadResult.Location;
//     //.replace(/\s/g, '');
//     const newProduct = new Product({
//       name: req.body.name,
//       price: req.body.price,
//       quantity: req.body.quantity,
//       image: uploadResult.Location,
//       owner: user.id,
//       ownerName: req.body.username,
//       ownerLocation: user.location,
//       key: uploadResult.Key
//     });
  
//     const savedProducts = await newProduct.save();
//     console.log("Product created successfully!", savedProducts, imageFile);
//     res.status(200).json({message: "Product created successfully!" });
  
  
//   }catch(error){
//     res.status(404).json({ message: `Error occured while creating product!` });
//     console.log(error);
//   }
//   };  

// const updateProduct = async (req, res) =>{
//     const { id: productID } = req.params;
//     const { key, file } = req.body;
//     const params = {
//         Bucket: "newalzironbucket",
//         Key: key,
//         Body: file
//     }

//     await s3Storage.upload(params).promise();

//     const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if(!product) return res.status(404).send("Product to be updated not found!");

//     res.status(200).json({ product });
// };

// const deleteProduct = async (req, res) =>{
//     const { id } = req.params;
//     const Key = id;
//     //Deleting from the S3 bucket
//     const params = {
//         Bucket: "newalzironbucket",
//         Key: Key
//     }

//     console.log(req.params);
//     s3.deleteObject(params).promise();
//     console.log("Picture deleted successfully!", Key);

//     const product = await Product.findOneAndDelete({ Key: Key });

//     if(!product) return res.status(404).json({ message: `Product not found!` });

//     await product.remove();
//     res.status(200).json({ msg: "Product successfully deleted!" });
// };