import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import Products from "../Routes/Product.js"
import Order from "../Routes/Order.js"
import Login from '../Routes/Login.js';
import Chatbot from '../ExternalApi/Chatbot.js';
import Signup from '../Routes/Signup.js'
import ClothTrending from '../ExternalApi/ClothTrending.js'
import GoogleLogin from '../Auth/GoogleLogin.js'
import GoogleCallback from '../Auth/GoogleCallback.js'
import AdminDiscounts from '../Routes/AdminDiscount.js'
import Customer from '../Routes/Customer.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Auth
app.use('/login', Login);
app.use("/signup", Signup);

app.use('/googleLogin', GoogleLogin)
app.use('/google/callback', GoogleCallback)


//Admin
app.use('/customers', Customer)

app.use("/orders", Order)
app.use("/products", Products)

app.use('/discounts', AdminDiscounts)


//Ai
app.use("/chat", Chatbot)
app.use('/trending', ClothTrending)



// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});