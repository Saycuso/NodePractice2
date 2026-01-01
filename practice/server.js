const express = require("express");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const cors = require('cors');
const Cart = require('../models/Cart')

app.use(express.json());
app.use(cors());
const Product = require("../models/Product");
const User = require("../models/Users");

const MONGO_URI =
  "mongodb+srv://admin:admin123@cluster0.9vi41ps.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User Created" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1h" });
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/hello", (req, res) => {
  res.status(200).json({
    message: "Inventory Server is Live",
  });
});

//Create Product (Protected)
app.post("/api/products", auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Products
app.get("/api/products", async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sort = "createdAt" } = req.query;

    let query = {};

    if (search) {
      query = {
        name: { $regex: search, $options: "i" },
      };
    }

    const pageNumber = page * 1;
    const limitNumber = limit * 1;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
         .sort(sort)
         .limit(limitNumber)
         .skip(skip);

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      count: products.length,
      products: products,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
// Add to Cart (Protected)
app.post('/api/cart', auth, async(req,res) => {
  try{
    const {productId, quantity = 1 } = req.body;
    const userId = req.user.id;

      let cart = await Cart.findOne({user: userId});

      if(cart){
        const itemIndex = cart.items.findIndex(item => item.product == productId);

        if(itemIndex > -1){
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({product: productId, quantity});
        }
        await cart.save();
      }
      else{
        cart = await Cart.create({
          user: userId,
          items: [{product: productId, quantity}]
        });
      }
      res.status(200).json(cart);
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
