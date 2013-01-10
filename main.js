
function main(){
	var s = require('./server'),
		a = new require('./app');
	
	server = new s(process.env.PORT || 3000);
	app = new a(500);
	
	server.setRoute('load',function(server,id){return app.loadClan(server,id);});
	server.setRoute('status',function(server,id){return app.clanStatus(server,id);});
	server.setRoute('members',function(server,id){return app.showClanMembers(server,id);});
	server.setRoute('clan',function(server,id){return app.showClanInfo(server,id);});
	server.setRoute('member',function(server,id,pid){return app.showMember(server,id,pid);});
}

main();