const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const compression = require('compression');

const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(compression());

app.use('/', routes());

http.createServer(app).listen(config.port);
