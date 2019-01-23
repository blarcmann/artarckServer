const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config.json');



const app = express();

mongoose.connect(config.development.dburl,{useNewUrlParser: true}, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to db');
    }
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
app.use('/api/accounts', userRoutes);


app.listen(config.development.port, function(err) {
    console.log(`Shit happens on port ${config.development.port}`);
});