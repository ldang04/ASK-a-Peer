const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect database
connectDB();

//Initialize middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('And so it begins...'));

// Define routes 
app.use('/auth', require('./routes/auth'));
app.use('/questions', require('./routes/questions'));
app.use('/answers', require('./routes/answers'));
app.use('/profiles', require('./routes/profile'));
app.use('/spaces', require('./routes/spaces'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The ASC-a-Peer server is running on port ${PORT} >;D`));