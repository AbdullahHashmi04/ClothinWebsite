import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import { Credentials } from "../Model/Credentials.js"
import Product from "../Model/Product.js"
import OrderDetails from "../Model/OrderDetails.js"
import Discount from "../Model/Discount.js"
import axios from "axios";
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import * as arctic from "arctic";
import jwt from 'jsonwebtoken'
import fs from "fs";
import multer from "multer";
import vtonRouter from '../Routes/tryonRoutes.js';
import Login from '../Routes/Login.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


const app = express()
// const port = 3000
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Google OAuth Config ───────────────────────────────────────────────────────
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectURI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/google/callback';

app.post("/signup", (req, res) => {
  console.log("Body req is ", req.body);
  const product = new Credentials(req.body)
  product.save()
  // console.log("User signed up: ",product);
  res.send("Signup Successful")
})

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Multer config for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = join(__dirname, '../uploads/products');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

app.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.imageUrl = `http://localhost:3000/uploads/products/${req.file.filename}`;
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send(err.message);
  }
});

app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.imageUrl = `http://localhost:3000/uploads/products/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send(err.message);
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.delete('/deleteorder/:id', async (req, res) => {
  try {

    const { id } = req.params;
    const order = await OrderDetails.findByIdAndDelete(id);
    res.json(order)
  } catch (err) {
    res.status(500).send(err.message);
  }
})
app.delete('/deletecustomer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Credentials.findByIdAndDelete(id);
    res.json(customer)
  } catch (err) {
    res.status(500).send(err.message);
  }
})

app.post("/orders", (req, res) => {
  const date = new Date().toISOString().split('T')[0];
  // console.log(req.body.data)
  const Status = "paid"
  const query = new OrderDetails({ ...req.body.data, date, Status });
  console.log("Order received: ", query);
  query.save()
  res.status(200)
  res.send("Successful")
})

app.get('/', (req, res) => {
  res.send("Hello World")
})


app.get('/getorders', async (req, res) => {
  const orders = await OrderDetails.find({})
  res.send(orders)
})


app.post('/discount', (req, res) => {

  console.log(req.body)
  const discount = new Discount(req.body);
  discount.save();
  res.status(200)
  res.send("Successful")
})

app.get('/getdiscount', async (req, res) => {
  const discounts = await Discount.find({})
  res.send(discounts)
})

app.delete('/deletediscount/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByIdAndDelete(id);
    res.json(discount)
  } catch (err) {
    res.status(500).send(err.message);
  }
})
app.put('/updatediscount/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true });
    res.json(discount)
  } catch (err) {
    res.status(500).send(err.message);
  }
})







// ─── Google OAuth PKCE Flow ────────────────────────────────────────────────────

// Step 1: Redirect user to Google's authorization page
app.get('/googleLogin', (req, res) => {
  const google = new arctic.Google(googleClientId, googleClientSecret, googleRedirectURI);
  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  // Store state and codeVerifier in HTTP-only cookies so the callback can use them
  res.cookie('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'lax',
    path: '/'
  });
  res.cookie('google_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000,
    sameSite: 'lax',
    path: '/'
  });

  res.redirect(url.toString());
});

// Step 2: Handle Google's callback — exchange code for tokens
app.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies.google_oauth_state;
  const storedCodeVerifier = req.cookies.google_code_verifier;

  res.clearCookie('google_oauth_state', { path: '/' });
  res.clearCookie('google_code_verifier', { path: '/' });

  try {
    const google = new arctic.Google(googleClientId, googleClientSecret, googleRedirectURI);

    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const accessToken = tokens.accessToken();

    const idToken = tokens.idToken();
    const claims = arctic.decodeIdToken(idToken);

    const googleUser = {
      googleId: claims.sub,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
      emailVerified: claims.email_verified,
    };

    console.log('Google user authenticated:', googleUser.email);

    let user = await Credentials.findOne({ Email: googleUser.email });
    if (!user) {
      user = new Credentials({
        Username: googleUser.name,
        Email: googleUser.email,
        googleId: googleUser.googleId,
        picture: googleUser.picture,
        authProvider: 'google',
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const frontendURL = process.env.FRONTEND_URL;
    res.redirect(`${frontendURL}/auth/callback?token=${jwtToken}`);

  } catch (e) {
    console.error('Google OAuth error:', e);

    if (e instanceof arctic.OAuth2RequestError) {
      return res.status(400).json({ error: 'Invalid authorization code or credentials.', code: e.code });
    }
    if (e instanceof arctic.ArcticFetchError) {
      return res.status(502).json({ error: 'Failed to communicate with Google servers.' });
    }

    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});


app.get('/getcustomers', async (req, res) => {
  const customers = await Credentials.find({})
  res.send(customers)
})

app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful ecommerce assistant." },
          { role: "user", content: req.body.message }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.json(response.data.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get('/trending', async (req, res) => {
  try {
    const prompt = `You are a Pakistani fashion stylist.

Return ONLY valid JSON.
Do not use markdown.
Do not explain anything.

Format:
[
 { "style": "", "category": "", "image_keyword": "single_keyword_only", "popular_in": "" }
]

Generate 12 trending clothing styles in Pakistan.`
    const trend = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful ecommerce assistant." },
        { role: "user", content: prompt }
      ]
    },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const parsed = JSON.parse(trend.data.choices[0].message.content);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: "Failed to parse model response" });
  }
});

fs.mkdirSync(join(__dirname, "../uploads/temp"), { recursive: true });

app.use('/uploads', express.static(join(__dirname, '../uploads')));

app.use('/login', Login);
app.use('/tryon', vtonRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
