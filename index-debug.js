var Request = require("request");
require('request-debug')(Request);

var request = Request.get("http://api.ipify.org/", function(error, response, body) {
});

request.qs({'format' : 'json'});
