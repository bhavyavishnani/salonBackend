const express = require('express');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');

const app = express();
app.use(express.json()); // JSON ke liye
app.use(express.urlencoded({ extended: true })); // Form data ke liye (optional)
app.use('/api', routes); // /api ke neeche sare routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server chal raha hai port ${PORT} pe`);
});