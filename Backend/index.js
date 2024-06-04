require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Schema = require('./models/user.model');
const Data = require('./models/product.model');
const OrderDetail= require('./models/orderdetails.model')
const cors = require('cors');
const crypto = require("crypto");
const { getAllUsers } = require('./APIS/Users');
const { getData, addProduct, updateProduct, deleteProduct } = require('./APIS/Data');
const { registerUser, loginUser } = require('./APIS/Login');
const { getProductsByCategory } = require('./APIS/ByCategory');
const {getOrderDetailsByEmail} = require('./APIS/OrderDetailsByEmail')
const {CreateOrder} = require("./APIS/CreateOrder")
const { addToCart, updateCartItem, deleteCartItem,deleteAllCartItems } = require('./APIS/Addtocart');
const { getCartItemsByEmail } = require('./APIS/GetCartItems');
const Razorpay = require("razorpay");
const { getOrderDetailsByOrderId ,getAllOrders, deleteOrder} = require('./APIS/OrderDetailsbyID');
const { ValidateOrder } = require('./APIS/OrderValidate');
const { saveOrUpdateProfile, getProfileByEmail } = require('./APIS/Profile');
const { forgotPassword } = require('./APIS/ForgetPassword');
const { resetPassword } = require('./APIS/PasswordReset');
const { addAddress, getAddresses, editAddress, deleteAddress } = require('./APIS/Address');
const { getBanner, updateBanner } = require('./APIS/Banner');

const app = express();
const URI = process.env.MONGO_URL;

// MongoDB connection
mongoose
  .connect(URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.put('/api/updatecart/:id', updateCartItem);
app.put('/api/updateproduct/:Product_id', updateProduct);
app.put('/api/user/address/:id', editAddress);
app.put('/api/updatebanner/:id',updateBanner)

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.post('/api/createorder', CreateOrder);
app.post("/api/order/validate",ValidateOrder);
app.post('/api/addtocart', addToCart);
app.post('/api/addproduct', addProduct);
app.post('/api/profile',saveOrUpdateProfile);
app.post('/api/forgot-password',forgotPassword);
app.post('/api/reset-password/:token',resetPassword);
app.post('/api/user/add-address', addAddress);

app.delete('/api/deleteallcartitems',deleteAllCartItems);
app.delete('/api/removefromcart/:id', deleteCartItem);
app.delete('/api/deleteproduct/:Product_id', deleteProduct);
app.delete('/api/deleteorder/:id',deleteOrder);
app.delete('/api/user/address/:id', deleteAddress);

app.get('/api/users', getAllUsers);
app.get('/api/data', getData);
app.get('/api/products', getProductsByCategory);
app.get('/api/orders/:email', getOrderDetailsByEmail);
app.get('/api/getcartitems',getCartItemsByEmail);
app.get('/api/getorderdetails/:orderId',getOrderDetailsByOrderId);
app.get('/api/orders', getAllOrders);
app.get('/api/profile/:email', getProfileByEmail);
app.get('/api/user/addresses',getAddresses);
app.get('/api/bannerPhotos',getBanner);


app.get('/', (req, res) => {
  res.json('Hello, Backend Readyyyy!!! ');
});

app.listen();

// const PORT = 4000; // Specify the desired local port

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
