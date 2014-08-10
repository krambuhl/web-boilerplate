var express = require('express');

var server = express();
server.use(express.static('./dist'));
server.listen(8080);

console.log('Server started: http://localhost:8080');