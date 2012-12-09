var cls = require("./lib/class"),
    _ = require("underscore"),
    url = require("url");

module.exports = router = cls.Class.extend({
	init: function(){
		this.routes = {};
	},

	setRoute: function(path,callback){
		this.routes[path] = callback;
	},
	
	route: function(requrl,data){
		var url_parts = url.parse(requrl,true);
	    var path_parts = url_parts.path.split("/");
	    var path = path_parts[1];
	    var server = 'eu';
	    var id = path_parts[2];
	    var ret = {};
	    if(this.routes[path] && path && server && id){
	    	ret = this.routes[path](server,id);
	    }else{
	    	ret = {status:'Error',error:''};
	    	if(!id)ret.error += 'Id not defined;';
	    	if(!server)ret.error += 'Server not defined;';
	    	if(!path)ret.error += 'Method not defined;';
	    	if(path && !this.routes[path])ret.error += 'Method '+path+' does not exist;';
	    }
		return JSON.stringify(ret);
	}
});