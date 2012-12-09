var cls = require("./lib/class"),
    _ = require("underscore"),
    http = require("http"),
    r = require("./router");

module.exports = server = cls.Class.extend({
	init: function(port){
		this.router = new r();
		var self = this;
		
		http.createServer(function (request, response) {
			 
		    response.writeHead(200, {
		    	'Content-Type': 'text/plain',
		    	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		    	'Access-Control-Allow-Credentials': true,
		    	'Access-Control-Allow-Origin': '*',
		    	'Access-Control-Allow-Headers': 'Content-Type, *'
		    }); 
		    this.data = '';
		    request.on('data', function(chunk) {
				this.data += chunk.toString('utf8');
		    });
		    
		    request.on('end', function(chunk) {
		    	if(chunk)this.data += chunk.toString('utf8');
				response.end(self.router.route(request.url,self.data));
		    });
		}).listen(port);   
		console.log('Server running on port '+port);
	},

	setRoute: function(path,callback){
		this.router.setRoute(path,callback);
	}
});