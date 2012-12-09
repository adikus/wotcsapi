var cls = require("./lib/class"),
    _ = require("underscore"),
    Member = require("./member");

module.exports = Clan = cls.Class.extend({
	init: function(id){
		this.memberIds = [];
		this.status = 'Loading';
		this.members = {};
		this.done = 0;
		this.id = id;
	},
	
	parseData: function(data){
		clanData = JSON.parse(data);
		for(i in clanData.data.members){
			pid = clanData.data.members[i].account_id;
			name = clanData.data.members[i].account_name;
			this.members[pid] = new Member(pid, name);
			this.memberIds.push(pid);
			//console.log('Added new player - '+pid+' (Clan: '+this.id+')');
		}
	},
	
	show: function(){
		return {
			members: _.map(this.members, function(member){return member.show();}),
			id: this.id
		};
	}
});