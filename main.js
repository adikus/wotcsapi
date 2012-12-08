var http = require('http'),
	url = require('url'),
	net = require('net'),
	_ = require('underscore');

var wids = [];
var clans = {};

http.createServer(function (request, response) {
	 
    response.writeHead(200, {'Content-Type': 'text/plain'}); 
    
    request.on('data', function(chunk) {
		console.log(chunk.toString('utf8'));
		client.write(chunk);
    });
    
    var url_parts = url.parse(request.url,true);
    path_parts = url_parts.path.split("/");
    switch(path_parts[1]){
    	case 'load':
    		wid = path_parts[2];
    		if(!_.include(wids, wid) && !_.include(_.keys(clans), wid)){
    			wids.push(wid);
    		}
			response.write(JSON.stringify({status:'OK'}));
    		break;
    	case 'show':
    		wid = path_parts[2];
    		if(clans[wid]){response.write(JSON.stringify(clans[wid]));}   
    		break;
    	case 'status':
    		wid = path_parts[2];
    		if(clans[wid]){
    			size = _.size(clans[wid].members);
    			response.write(JSON.stringify({done:clans[wid].done, size:size, status:clans[wid].status}));
    		}
    		break;
    }
    
    response.end();
     
}).listen(process.env.PORT || 3000);

setInterval(function(){
	
	if(wids.length > 0){
		wid = wids.pop();
		options = {
				  host: 'worldoftanks.eu',
				  port: 80,
				  path: '/community/clans/'+wid+'/api/1.1/?source_token=Intellect_Soft-WoT_Mobile-unofficial_stats',
				  method: 'GET',
				};
		var data = '';
		clans[wid] = {members:{},wids:[],done:0,status:'loading'};
		var req = http.request(options, function(res) {
			var timeout = res.statusCode == 504;
			
			res.on('data', function (chunk) {
				if(!timeout)data += chunk.toString('utf8');
			});
			
			res.on('end', function (chunk) {
				if(!timeout){
					if(chunk)data += chunk.toString('utf8');
					clanData = JSON.parse(data);
					for(i in clanData.data.members){
						id = clanData.data.members[i].account_id;
						clans[wid].members[id] = {name:clanData.data.members[i].account_name};
						clans[wid].wids.push(id);
					}
					console.log('Clan '+wid+' request finished');
				}else {
					console.log('Clan '+wid+' request timeout');	
					clans[wid].status = 'timeout';
				}
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		req.end();
	}else{
		cwid = -1;
		for (var i in clans) {
		    if(clans[i].wids.length > 0){
		    	cwid = i;
		    	break;
		    }
		}
		if(cwid > -1){
			pwid = clans[cwid].wids.pop();
			options = {
					  host: 'worldoftanks.eu',
					  port: 80,
					  path: '/community/accounts/'+pwid+'/api/1.6/?source_token=Intellect_Soft-WoT_Mobile-unofficial_stats',
					  method: 'GET',
					};
			var data = '';
			var req = {};
			(function(currentPWID,currentCWID){
				req = http.request(options, function(res) {
					var timeout = res.statusCode == 504;
					
					res.on('data', function (chunk) {
						if(!timeout)data += chunk.toString('utf8');
					});
					
					res.on('end', function (chunk) {
						if(!timeout){
							if(chunk)data += chunk.toString('utf8');
							playerData = JSON.parse(data);
							stats = {};
							stats["GPL"] = playerData.data.summary.battles_count;
							stats["WIN"] = playerData.data.summary.wins;
							stats["DEF"] = playerData.data.summary.losses;
							stats["SUR"] = playerData.data.summary.survived_battles;
							stats["FRG"] = playerData.data.battles.frags;
							stats["SPT"] = playerData.data.battles.spotted;
							stats["ACR"] = playerData.data.battles.hits_percents;
							stats["DMG"] = playerData.data.battles.damage_dealt;
							stats["CPT"] = playerData.data.battles.capture_points;
							stats["DPT"] = playerData.data.battles.dropped_capture_points;
							stats["EXP"] = playerData.data.experience.xp;
							vehicles = [];
							for(i in playerData.data.vehicles){
								newVehicle = {};
								newVehicle.name = playerData.data.vehicles[i].name;
								newVehicle.lname = playerData.data.vehicles[i].localized_name;
								newVehicle.tier = playerData.data.vehicles[i].level;
								newVehicle.battles = playerData.data.vehicles[i].battle_count;
								newVehicle.nation = playerData.data.vehicles[i].nation;
								newVehicle.image = playerData.data.vehicles[i].image_url;
								newVehicle.wins = playerData.data.vehicles[i].win_count;
								newVehicle.type = playerData.data.vehicles[i]["class"];
								vehicles.push(newVehicle);
							}
							clans[currentCWID].members[currentPWID].stats = stats;
							clans[currentCWID].members[currentPWID].vehicles = vehicles;
							clans[currentCWID].done++;
							console.log('Player '+currentPWID+' request finished');
							if(clans[currentCWID].done == _.size(clans[currentCWID].members))clans[currentCWID].status = 'done';
						}else console.log('Player '+currentPWID+' request timeout');						
					});
			});})(pwid,cwid);

			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
			});

			req.end();
		}
	}
},500);
 
//Put a friendly message on the terminal of the server.
console.log('Server running at port '+(process.env.PORT || 3000));