var Request = require("request");

var request = new Request.get({url: "http://api.ipify.org/", qs: {'format' : 'json'}}, function(error, response, body) {
  if (response && response.statusCode == 200) {
    console.log(body);
  } else {
    console.error(error);
    console.log(body);
  }
});

request.qs({'format' : 'json'});
