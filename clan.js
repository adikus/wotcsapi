var cls = require("./lib/class"),
    _ = require("underscore"),
    Member = require("./member");

module.exports = Clan = cls.Class.extend({
	init: function(id){
		this.memberIds = [];
		this.status = 'Fetching clan info';
		this.status_code = 1;
		this.members = {};
		this.done = 0;
		this.id = id;
	},
	
	parseData: function(data){
		clanData = JSON.parse(data);
		this.tag = clanData.data.abbreviation;
		this.name = clanData.data.name;
		this.motto = clanData.data.motto;
		this.description = clanData.data.description_html;
		this.members_count = clanData.data.members_count;
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
	},
	
	showMember: function(pid){
		return this.members[pid].show();
	},
	
	info: function(){
		return {
			id: this.id,
			members_count: this.members_count,
			tag: this.tag,
			name: this.name,
			motto: this.motto,
			description: this.description,
			members: this.listAll()
		};
	},
	
	listDone: function(){
		ret = [];
		_.each(this.members,function(member){
			if(member.stats["GPL"] != undefined)ret.push({id:member.id,name:member.name});
		}); 
		return ret;
	},
	
	listAll: function(){
		ret = [];
		_.each(this.members,function(member){
			ret.push({id:member.id,name:member.name});
		}); 
		return ret;
	}
});