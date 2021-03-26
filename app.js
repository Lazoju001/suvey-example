const express = require( 'express' );
const app = express();
const routes = require('./routes');
var bodyParser = require('body-parser');
var mongoose = require ('mongoose');
const config = require('./config');
const cors = require('cors');
require('dotenv').config();



mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Conectado a la base de datos",process.env.MONGO_URL))

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(process.env.PORT  || 3005 ,console.log("Escuchando en el puerto ::"))