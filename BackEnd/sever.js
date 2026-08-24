const express = require('express');
const app = express();

const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  // Save user to database
  res.status(201).json(user);
});

// Route parameters
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, name: 'John' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
