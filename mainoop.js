
function main(){
	var s = require('./server'),
		a = new require('./app');
	
	server = new s(process.env.PORT || 3000);
	app = new a(500);
	
	server.setRoute('load',function(server,id){return app.loadClan(server,id);});
	server.setRoute('status',function(server,id){return app.clanStatus(server,id);});
	server.setRoute('show',function(server,id){return app.showClan(server,id);});
}

main();