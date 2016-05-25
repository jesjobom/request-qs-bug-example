var Request = require("request");

var request = new Request.get("http://api.ipify.org/", function(error, response, body) {
  if (response && response.statusCode == 200) {
    console.log(body);
  } else {
    console.error(error);
    console.log(body);
  }
});

request.qs({'format' : 'json'});
