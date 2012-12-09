var cls = require("./lib/class"),
    _ = require("underscore"),
    Clan = require("./clan"),
    Request = require("./request");

module.exports = app = cls.Class.extend({
	init: function(miliseconds){
		this.clans = {};
		this.clanIds = [];
		var self = this;
		
		setInterval(function(){self.step();}, miliseconds);
	},
	
	step: function(){
		if(this.clanIds.length > 0){
			this.loadClanFromWG(this.clanIds.pop());
		}else{
			var id = -1;
			for (var i in this.clans) {
			    if(this.clans[i].memberIds.length > 0){
			    	id = i;
			    	break;
			    }
			}
			if(id > -1){
				pid = this.clans[id].memberIds.pop();
				this.loadPlayerFromWG(id,pid);
			}
		}
	},
	
	loadPlayerFromWG: function(cid,id){
		var self = this;
		
		req = new Request('worldoftanks.eu','accounts',id,'1.8');
		req.onSuccess(function(data){
			self.clans[cid].members[id].parseData(data);
			self.clans[cid].done++;
			console.log('Player request finished - '+id);
		});
		req.onTimeout(function(){
			console.log('Player request timeout - '+id);	
			//self.clans[cid].status = 'timeout';
			self.clans[cid].memberIds.push(id);
		});
	},
	
	loadClanFromWG: function(id){
		var self = this;
		
		this.clans[id] = new Clan(id);
		
		req = new Request('worldoftanks.eu','clans',id,'1.1');
		req.onSuccess(function(data){
			self.clans[id].parseData(data);
			console.log('Clan request finished - '+id);
		});
		req.onTimeout(function(){
			console.log('Clan request timeout - '+id);	
			self.clans[id].status = 'timeout';
		});
	},
	
	loadClan: function(server,id){
		if(!_.include(this.clanIds, id) && !this.clans[id]){
			this.clanIds.push(id);
			console.log('Added new clan - '+id);
			return {status:'Loading'};
		}
		else return {status:this.clans[id].status};
		
	},
	
	clanStatus: function(server,id){
		if(this.clans[id])return {status:this.clans[id].status,done:this.clans[id].done,size:_.size(this.clans[id].members)};
		else return {status:'Error',error:'Clan not found'};
	},
	
	showClan: function(server,id){
		if(this.clans[id])return {status:this.clans[id].status,clan:this.clans[id].show()};
		else return {status:'Error',error:'Clan not found'};
	},
});