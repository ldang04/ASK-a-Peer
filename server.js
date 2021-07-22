const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('And so it begins...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The ASC-a-Peer server is running on port ${PORT} >;D`));