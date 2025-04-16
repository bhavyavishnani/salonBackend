require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB se connect ho gaya!');
        return client.db('<dbname>'); // Apna database name yahan daal
    } catch (error) {
        console.error('MongoDB connect nahi hua:', error);
        throw error;
    }
}

module.exports = connectDB;