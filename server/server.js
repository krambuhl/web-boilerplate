var express = require('express');

var server = express();
server.use(express.static('./dist'));
server.listen(process.env.PORT || 8080);

console.log('Server started: http://localhost:' + (process.env.PORT || 8080));