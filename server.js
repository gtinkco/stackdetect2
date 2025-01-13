require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs'); // Ensure EJS is installed

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'views')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB Connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongoDB();

// Sample data for trending technologies
const trendingData = [
  { name: "React.js", category: "Frontend Framework", popularity: 98 },
  { name: "Node.js", category: "Backend Framework", popularity: 95 },
  { name: "Docker", category: "Containerization", popularity: 93 },
  { name: "Kubernetes", category: "Orchestration", popularity: 90 },
  { name: "GraphQL", category: "API Query Language", popularity: 85 },
];

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Tester Route
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'api.html'));
});

// View Company Stack Route
app.get('/view/companystack', (req, res) => {
  const company = req.query.company;
  if (!company) {
    return res.status(400).json({ error: "Company name is required." });
  }

  const mockData = {
    Amazon: [
      { name: "AWS", description: "Cloud computing platform." },
      { name: "React", description: "Frontend framework." },
    ],
    Google: [
      { name: "Kubernetes", description: "Container orchestration." },
      { name: "Angular", description: "Frontend framework." },
    ],
  };

  const data = mockData[company] || [];
  res.json(data);
});

// Route for the Tech Stack page
app.get('/techstack', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/techstack.html'));
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, plan } = req.body;
    const db = client.db("stackdetect_registration_form");
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ username, email, password: hashedPassword, plan });
    res.status(200).json({ message: 'User registered successfully', redirectUrl: '/login.html' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: '	Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = client.db("stackdetect_registration_form");
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: 'Login successful', username: user.username, redirectUrl: '/dashboard' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to check subscription
function checkSubscription(req, res, next) {
  const token = req.cookies['authToken'];
  if (!token) return res.status(401).send('Access Denied: No Token Provided!');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

// Serve trending technologies EJS page
app.get('/trendingtechnologies', (req, res) => {
  res.render('trendingtechnologies', { trendingTechnologies: trendingData });
});

// Serve dashboard page with dynamic user data
app.get('/dashboard', checkSubscription, (req, res) => {
  const { username, plan } = req.user;
  res.render('dashboard', { username, plan });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
