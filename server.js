const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const api = require('./server/api');
var db = require('./db')


// API file for interacting with MongoDB

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


db.connect('mongodb://localhost:27017/mean', function(err) {
    if (err) {
      console.log('Unable to connect to Mongo.')
      process.exit(1)
    } else {
        //Set Port
        const port = process.env.PORT || '3001';
        app.set('port', port);

        const server = http.createServer(app);

        server.listen(port, () => console.log(`Running on localhost:${port}`));
    }
})
