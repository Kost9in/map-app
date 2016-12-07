
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.dbName}`);
mongoose.connection.on('error', error => console.log(`DB connection error: ${error.message}`));

app.use(express.static('static'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/points', require('./routes/points'));
app.use('/api/path', require('./routes/path'));

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
