var express = require("express");
var app = express();
var mkdirp = require('mkdirp');
var bodyParser = require("body-parser");
var fs = require("fs");
app.use(express.static(__dirname));

app.get("/", function(request, response) {
	response.sendFile(path.join(__dirname + "/index.html"));
});

app.use(bodyParser.urlencoded({extended:true}));

app.post("/", function (request, response) {	
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	console.log("recieved request")
	console.log(request.body);
	if (!(fs.existsSync("/home/finn/value_graphs/" + date))) {
		mkdirp("/home/finn/value_graphs/" + date);
	} 
	fs.appendFile("/home/finn/value_graphs/" + date + "/" + time + ".json", JSON.stringify(request.body), function (err) {
		if (err) throw err;
		console.log("Saved file to " + date + "/" + time);
	});
	
});

app.listen(8080);
console.log("Listening on 8080");
