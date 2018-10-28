/* The express module is used to look at the address of the request and send it to the correct function */
var express = require('express');
/*https://duckduckgo.com/?q=e&t=h_&atb=v100-7&ia=about https://duckduckgo.com/d.js?q=e&t=D&l=us-en&s=0&a=h_&dl=en&ck=news_e&ct=US&ss_mkt=us&vqd=3-40956783707519506589204876674884997383-319404277572093397259993403570685871621&atb=v100-7&p_ent=&ex=-1&sp=0&ext=1*/
/* The http module is used to listen for requests from a web browser */
var http = require('http');


var fs = require('fs');


/* The path module is used to transform relative paths to absolute paths */
var path = require('path');

var searchmodel = require('./search.js').getModel();
var example = require('./example.js');


var mongoose = require('mongoose');
var dbAddress = process.env.MONGODB_URI || 'mongodb://127.0.0.1/search';

/* Creates an express application */
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '16mb' }));

/* Creates the web server */
var server = http.createServer(app);

/* Defines what port to use to listen to web requests */
var port =  process.env.PORT ? parseInt(process.env.PORT) : 8080;

function startServer() {

	app.get('/', (req, res, next) => {

		/* Get the absolute path of the html file */
		var filePath = path.join(__dirname, './index.html')
		/* Sends the html file back to the browser */
		res.sendFile(filePath);
	});

	app.post('/', (req, res, next) => {

		var newquery = new searchmodel(req.body);
		awesome = newquery.search;
		example.hiya(awesome)
		newquery.save(function(err) {
			res.send(err || 'OK');
		});
		return awesome;
	});

}
/* Defines what function to call when a request comes from the path '/' in http://localhost:8080 */
/*https://duckduckgo.com/?q=atom+closing+window&atb=v100-7&ia=qa

*/

/* Defines what function to all when the server recieves any request from http://localhost:8080 */
server.on('listening', () => {

	/* Determining what the server is listening for */
	var addr = server.address()
		, bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port
	;

	/* Outputs to the console that the webserver is ready to start listenting to requests */
	console.log('Listening on ' + bind);
});

/* Tells the server to start listening to requests from defined port */
server.listen(port);
mongoose.connect(dbAddress, startServer)
