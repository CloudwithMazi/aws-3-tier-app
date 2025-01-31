const express = require('express');
const path = require('path');
const db = require('./database'); // Our database connection module

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your picture, CSS, etc.) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic route for the home page
// This could also be served purely by the static index.html in public/
// but let's keep an explicit route as an example
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example endpoint to fetch data from our RDS "projects" table
app.get('/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Error fetching projects');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
