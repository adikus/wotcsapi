var cls = require("./lib/class"),
    _ = require("underscore"),
    Vehicle = require("./vehicle");

module.exports = Member = cls.Class.extend({
	init: function(id, name){
		this.name = name;
		this.id = id;
		this.vehicles = [];
		this.stats = {};
		this.bestTiers = [0,0,0,0,0];
		this.best = [{tier:0,tier_roman:0,tanks:[],scouts:[]},
		             {tier:0,tier_roman:0,tanks:[]},
		             {tier:0,tier_roman:0,tanks:[]},
		             {tier:0,tier_roman:0,tanks:[]},
		             {tier:0,tier_roman:0,tanks:[]}];
	},
	
	parseData: function(data){
		var self = this;
		
		playerData = JSON.parse(data);
		this.stats["GPL"] = playerData.data.summary.battles_count;
		this.stats["WIN"] = playerData.data.summary.wins;
		this.stats["DEF"] = playerData.data.summary.losses;
		this.stats["SUR"] = playerData.data.summary.survived_battles;
		this.stats["FRG"] = playerData.data.battles.frags;
		this.stats["SPT"] = playerData.data.battles.spotted;
		this.stats["ACR"] = playerData.data.battles.hits_percents;
		this.stats["DMG"] = playerData.data.battles.damage_dealt;
		this.stats["CPT"] = playerData.data.battles.capture_points;
		this.stats["DPT"] = playerData.data.battles.dropped_capture_points;
		this.stats["EXP"] = playerData.data.experience.xp;
		
		this.joined = playerData.data.clan.member.since;
		this.score = 0;
		this.tierTotal = 0;
		this.tierNum = 0;
		
		for(i in playerData.data.vehicles){
			this.vehicles.push(new Vehicle(playerData.data.vehicles[i]));
			this.tierNum += _.last(this.vehicles).battles;
			this.tierTotal += _.last(this.vehicles).tier*_.last(this.vehicles).battles;
			if(this.tierNum > 0)this.averageTier = this.tierTotal/this.tierNum;else this.averageTier = 9e99;
			this.score += _.last(this.vehicles).getScore();
			if(this.bestTiers[_.last(this.vehicles).type] < _.last(this.vehicles).tier)this.bestTiers[_.last(this.vehicles).type] = _.last(this.vehicles).tier;
		}
		
		_.each(this.vehicles,function(vehicle){
			if(self.bestTiers[vehicle.type] == vehicle.tier)self.best[vehicle.type].tanks.push(vehicle);
			if(vehicle.type == 0 && vehicle.tier == 5 && vehicle.nation != 5 && vehicle.nation != 6)
				self.best[vehicle.type].scouts.push(vehicle);
		});

		_.each(this.bestTiers,function(tier,type){
			self.best[type].tier = tier;
			self.best[type].tier_roman = self.toRoman(tier,1);
		});
		
		f1 =  (10-this.averageTier)*20+150;
		if(this.averageTier > 0)f2 = 3/2/this.averageTier+0.2;
		else f2=0;
		if(this.stats['GPL'] > 0)
			efr = 	this.stats['FRG']/this.stats['GPL']*f1 + 
					this.stats['DMG']/this.stats['GPL']*f2 + 
					this.stats['SPT']/this.stats['GPL']*200 + 
					this.stats['CPT']/this.stats['GPL']*150 + 
					this.stats['DPT']/this.stats['GPL']*150;
		else efr = 0;
		
		this.stats['EFR'] = Math.round(efr*100)/100;
		this.stats['SCR'] = Math.round(efr/1200*this.score*100)/100;
	},
	
	show: function(){
		return {
			stats: this.stats,
			best: this.best,
			id: this.id,
			name: this.name
		};
	},
	
	toRoman: function(n,s){
		// Convert to Roman Numerals
		// copyright 25th July 2005, by Stephen Chapman http://javascript.about.com
		// permission to use this Javascript on your web page is granted
		// provided that all of the code (including this copyright notice) is
		// used exactly as shown
		var r = '';var d; var rn = new Array('IIII','V','XXXX','L','CCCC','D','MMMM'); for (var i=0; i< rn.length; i++) {var x = rn[i].length+1;var d = n%x; r= rn[i].substr(0,d)+r;n = (n-d)/x;} if (s) {r=r.replace(/DCCCC/g,'CM');r=r.replace(/CCCC/g,'CD');r=r.replace(/LXXXX/g,'XC');r=r.replace(/XXXX/g,'XL');r=r.replace(/VIIII/g,'IX');r=r.replace(/IIII/g,'IV');}
		return r;		                  
	}
});