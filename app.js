require('dotenv').config();
const { PORT } = process.env;

const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser')
const logger = require('morgan');


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/api', routes);

app.listen(port, () => console.log(`Listening on port: ${PORT}`))
