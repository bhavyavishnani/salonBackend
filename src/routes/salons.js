const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Get the MongoDB URI from the .env file
const uri = process.env.MONGODB_URI;
const dbName = "<dbname>";  // Replace with your database name
const collectionName = "salons";  // Your collection name

// Route to get all salons
router.get('/', async (req, res) => {
  const city = req.query.city ? req.query.city.trim() : '';

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let query = {};
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };  // Case-insensitive search
    }

    const salons = await collection.find(query).toArray();
    
    if (salons.length === 0) {
      return res.status(404).json({ message: 'No salons found' });
    }

    res.json(salons);
  } catch (error) {
    console.error("Error fetching salons:", error);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    await client.close();
  }
});

module.exports = router;
