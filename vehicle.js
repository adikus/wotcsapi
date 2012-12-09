var cls = require("./lib/class"),
    _ = require("underscore");

module.exports = Vehicle = cls.Class.extend({
	init: function(data){
		this.name = data.name;
		this.lname = data.localized_name;
		this.tier = parseInt(data.level);
		this.battles = parseInt(data.battle_count);
		this.nation = parseInt(this.parseNation(data.nation));
		//this.image = data.image_url;
		this.wins = parseInt(data.win_count);
		this.type = parseInt(this.parseType(data["class"]));
	},
	
	getScore: function(){
		if(	this.tier == 10 && this.type == 1 ){
			return 1000+(this.wins/10);
		}else if( this.tier == 10 && this.type == 2){
			return 1000+(this.wins/10);
		}else if( this.tier == 10 && this.type == 3 ){
			return 900+(this.wins/10);
		}else if( this.tier == 8 && this.type == 4 ){
			return 900+(this.wins/10);
		}else return 0;
	},
	
	parseNation: function(n){
		switch (n) {
			case 'ussr':
				return 1;
				break;
			case 'germany':
				return 2;
				break;
			case 'usa':
				return 3;
				break;
			case 'china':
				return 4;
				break;
			case 'france':
				return 5;
				break;
			case 'uk':
				return 6;
				break;
		}
	},
	
	parseType: function(t){
		switch (t) {
			case 'lightTank':
				return 0;
				break;
			case 'mediumTank':
				return 1;
				break;
			case 'heavyTank':
				return 2;
				break;
			case 'AT-SPG':
				return 3;
				break;
			case 'SPG':
				return 4;
				break;
			default: return 5;
		}
	}
});