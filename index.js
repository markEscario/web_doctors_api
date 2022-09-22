'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/backend_api', userRoutes.routes);
app.use('/backend_api', doctorsRoutes.routes);

app.get("/", (req, res) => {
  res.json({ message: "The server is running" });
});

app.listen(config.port, () => {
  console.log('app listening on url http://localhost:' + config.port )
});