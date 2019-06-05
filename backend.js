var express = require("express");
var app = express();
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
	var dateTime = date+'_'+time;

	console.log("recieved request")
	console.log(request.body);
	fs.appendFile("/home/finn/value_graphs/" + dateTime + ".json", JSON.stringify(request.body), function (err) {
		if (err) throw err;
		console.log("Saved file to " + dateTime);
	});
	
});

app.listen(8080);
console.log("Listening on 8080");
