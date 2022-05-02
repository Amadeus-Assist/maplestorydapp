// 引入其他js文件中的函数
// window是object
// global user info, used for initialization
var oldhp = 50; // default
var oldmp = 30;
var oldexp = 0;
var oldbackpack=[];
var level = 1; 
var token = "";
var username = ""

window.resource = new Resource();
window.music_manager = new MusicManager();

window.monster_factory = new MonsterFactory();
window.monster_skill_effect_factory = new MonsterSkillEffectFactory();
window.monster_skill_hit_factory = new MonsterSkillHitFactory();

window.number_factory = new NumberFactory();
window.skill_effect_factory = new SkillEffectFactory();
window.skill_hit_factory = new SkillHitFactory();
window.skill_action_factory = new SkillActionFactory();

window.money_factory = new MoneyFactory();
window.things_factory = new ThingsFactory();
window.tips_factory = new TipsFactory();
window.des_factory = new DesFactory();
window.properties_factory = new PropertiesFactory();
window.player_attr = new PlayerAttr(oldhp, oldmp, oldexp, level);
window.skills_attr = new SkillsAttr().getSkillsAttr();
window.monsters_attr = new MonstersAttr().getMonstersAttr();

window.percent = new Percent();


// TODO: check other things in the character_info

function $(id) {
	return document.getElementById(id);
}

window.onload = function() {
	// 开始
	$("start_btn").onclick = function() {
		window.switchUI("login");
	}
	//log in button
	$("login_btn").onclick = function() {
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var xhr = new XMLHttpRequest();
		var url = "http://localhost:8080/api/maplestorydapp/login";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		var data = JSON.stringify({"username": username, "password": password});
		xhr.onload = function(e) {
			if (this.status == 200) {
				//TODO: load character info
				var text = this.responseText
				var jsonResponse = JSON.parse(text);
				oldcharacter = jsonResponse.character_info
				token = jsonResponse.token
				oldhp = oldcharacter.hp 
				oldmp = oldcharacter.mp 
				oldexp = oldcharacter.exp 
				level = oldcharacter.level
				oldbackpack = oldcharacter.equipment
				window.player_attr = new PlayerAttr(oldhp, oldmp, oldexp, level);
				window.switchlogin("select","login");
			} else {
				window.alert("Password not match, please try again");
			}
		  };
		xhr.send(data);
	}
	$("connect_btn").onclick = function() {
		window["aleereum"] && window["aleereum"].connect();
		$("connect_btn").style.display = "none"
		$("addfund_btn").style.display = "block"
	}
	$("addfund_btn").onclick = function() {
		
		// window.addFund();
	}
	// sign up button
	$("signup_btn").onclick = function() {
		window.switchlogin("signup","login");
	}
	$("login_btn2").onclick = function() {
		var username = document.getElementById("username2").value;
		var password = document.getElementById("password2").value;
		var address = document.getElementById("walletaddress2").value;
		var xhr = new XMLHttpRequest();
		var url = "http://localhost:8080/api/maplestorydapp/register";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		var data = JSON.stringify({"username": username, "password": password, "bundle_address": address});
		xhr.onload = function(e) {
			if (this.status == 200) {
				window.alert("Sign Up Successfully! Please go back to the log in page.");
			} else {
				window.alert("Username Duplicated, Please sign up again");
			}
		  };
		xhr.send(data);
	}
	$("back_to_login_btn").onclick = function() {
		window.switchlogin("login","signup");
	}
	// 帮助
	$("help_btn").onclick = function() {
		window.switchUI("help");
	}
	// 选择角色
	$("left_img").onclick = function() {
		start("male");
	}

	$("right_img").onclick = function() {
		start("female");
	}

	$("logout_btn").onclick = function() {
		var characterInfo = {
			'currhp' : window.player_attr.curr_hp,
			'currmp' : window.player_attr.curr_mp,
			'currexp' : window.player_attr.curr_exp,
			'currlevel' : window.player_attr.level
		}
		var xhr = new XMLHttpRequest();
		var url = 'http://localhost:8080/api/maplestorydapp/logout';
		//POST
		xhr.open("POST", url, true);
		//设置请求头的Content-Type
		xhr.setRequestHeader("Content-Type", "application/json");
		//请求数据
		var data = JSON.stringify({"username":username, "token":token,"character_indo": characterInfo});
		//when request completes
		xhr.onload = function(e){
			if (this.status == 200) {
				window.alert("Data Saved! You can close the window!");
			} else{
				window.alert("Invalid Token. Please restart the game. Your record is not saved.");
			}
		};
		//send request
		xhr.send(data);
	}
	
	var canvas = $("canvas");
	//获取作用于画布的API，获取canvas的一些属性
	var ctx = canvas.getContext("2d");
		ctx.textAlign = "center";
		ctx.textBaseLine = "top";
		ctx.font = "14px 微软雅黑 bold";
		ctx.fillStyle = "black";

		// 开始载入 - 有百分比
	this.thread = setInterval(function() {
		if (window.resource.curr_amount == window.resource.total_amount) {
			clearInterval(thread);
			$("home_audio").play();
			
			version.style.display = "block";
			help_btn.style.display = "block";
			start_btn.style.display = "block";
			
			ctx.drawImage(window.resource.bg["bg"][3], 0, 0, window.WIDTH, window.HEIGHT);
		} else {
			ctx.clearRect(0, 0, window.WIDTH, window.HEIGHT);
			ctx.fillText("正在载入游戏资源，请稍后...  " + (window.resource.curr_amount / window.resource.total_amount * 100).toFixed(2) + "%", window.WIDTH / 2,  window.HEIGHT / 2);
		}
	}, 1000 / window.FPS, false);
	resource.load();
}


// switchUI的函数定义，
window.switchUI = function(e_id) {
	var e = $(e_id);
	if ((e.style.display == "none" || e.style.display == "") && $("select").style.display != "block" && $("signup").style.display != "block") {
		e.style.display = "block";
	} else {
		e.style.display = "none";
	}
}
//loginswitch
window.switchlogin = function(e_id,last_id) {
	var e = $(e_id);
	var login = $(last_id)
	if (e.style.display == "none" || e.style.display == "") {
		e.style.display = "block";
		login.style.display = "none";

	} else {
		e.style.display = "none";
	}
}

window.addFund = function(){
	var username = "";
	var token = "";
	var value = 0;
	var xhr = new XMLHttpRequest();
	var url = 'http://localhost:8080/api/maplestorydapp/add_balance';
	//POST
	xhr.open("POST", url, true);
	//设置请求头的Content-Type
	xhr.setRequestHeader("Content-Type", "application/json");
	//请求数据
	var data = JSON.stringify({"value":value, "username":username, "token":token});
	//when request completes
	xhr.onload = function(e){
		
		if (this.status == 200) {
			window.alert("Addiing fund successfully!");
		}else{
			window.alert("Addiing fund Failed, please try again.");
		}
		};
	//send request
	xhr.send(data);
}
// start函数定义，选择角色
window.start = function(gender) {
	var e = $("logout_btn")
	e.style.display = "block"
	var provider = window["aleereum"]
	// if (provider.isConnected) {
	// 	$("addfund_btn").style.display = "block"
	// } else {
	// 	$("connect_btn").style.display = "block"
	// }
	document.body.removeChild($("home"));
	document.body.removeChild($("home_audio"));
	// 选择角色
	if (gender == "male") {
		window.PLAYER_OFFSET_Y = 0;
		window.resource.player = window.resource.male_player;
	} else {
		window.PLAYER_OFFSET_Y = 8;
		window.resource.player = window.resource.female_player;
	}

	//移动方式
	var ctx = $("canvas").getContext("2d");
	ctx.drawRightImage = function(img, x, y) {
		ctx.save();
		ctx.translate(x + img.width / 2, y + img.height / 2);
		ctx.scale(-1, 1);
		ctx.drawImage(img, img.width / -2, img.height / -2);
		ctx.restore();
	}
	ctx.roundRect = function(x, y, width, height, radius, fill, stroke) {  
		if (typeof stroke == "undefined") {  
			stroke = true;  
		}  
		if (typeof radius === "undefined") {  
			radius = 5;  
		}  
		this.beginPath();  
		this.moveTo(x + radius, y);  
		this.lineTo(x + width - radius, y);  
		this.quadraticCurveTo(x + width, y, x + width, y + radius);  
		this.lineTo(x + width, y + height - radius);  
		this.quadraticCurveTo(x + width, y + height, x + width - radius, y+ height);  
		this.lineTo(x + radius, y + height);  
		this.quadraticCurveTo(x, y + height, x, y + height - radius);  
		this.lineTo(x, y + radius);  
		this.quadraticCurveTo(x, y, x + radius, y);  
		this.closePath();  
		if (stroke) {  
			this.stroke();  
		}  
		if (fill) {  
			this.fill();  
		}  
	};  
  
	//属性
	var player;
	var backpack;
	var ability;
	var equipment;
	var ui;

	
	initSingle();

	var game_scene = new GameScene(getGameData({position: "红枫树", orientation: window.EAST}), ctx);
	this.onkeyup = function(event) { game_scene.keyUpEvent(event);}
	this.onkeydown = function(event) { game_scene.keyDownEvent(event); }
	this.onmousemove = function(event) {game_scene.mouseMoveEvent(event);}
	this.onmousedown = function(event) {game_scene.mouseDown(event);}
	this.setInterval(function() {
		if (game_scene.is_finish) {
			game_scene = new GameScene(getGameData(game_scene.next_map), ctx);
		}
		game_scene.update();
	}, 1000 / window.FPS, false);

	function getGameData(next_map) {
		var map_basic_data = new MapData(next_map);
			player.x = map_basic_data.player_x;
			player.y = map_basic_data.player_y;

		var map_data = map_basic_data.getMapData();
		var bg_data = {x: 0, y: 0, res: window.resource.bg["bg"][map_basic_data.bg]};

		var scene_obj = {};
			// 这里有backpack，equipment信息
			scene_obj.music_src = map_basic_data.music_src;
			scene_obj.backpack = backpack;
			scene_obj.ability = ability;
			scene_obj.equipment = equipment;
			scene_obj.ui = ui;
			scene_obj.player = player;
			scene_obj.map = new Map(map_data);
			scene_obj.bg = new Bg(bg_data);
			scene_obj.username = username;
			scene_obj.token = token;	


			scene_obj.is_open_ability_window = map_basic_data.is_open_ability_window;
			scene_obj.is_open_equipment_window = map_basic_data.is_open_equipment_window;
			scene_obj.is_open_thing_window = map_basic_data.is_open_thing_window;

			scene_obj.doors = map_basic_data.doors;
			scene_obj.normal_monsters_stack = map_basic_data.normal_monsters_stack;
			scene_obj.skill_attack_monsters_stack = map_basic_data.skill_attack_monsters_stack;
		return scene_obj;
	}

	function initSingle() {
		backpack = new Backpack();
		// var newbackpack_equip = []
		// var newempty_list_equip = []
		// for (var i in this.newempty_list_equip) {
		// 	for (var j = 0; j < 24; j++) {
		// 		newbackpack_equip[i].push(null);
		// 		newempty_list_equip[i].push(j);
		// 	}
		// }
		// if (oldbackpack.length != 0) {
		// 	for (i of oldbackpack){
		// 		var pos = (newempty_list_equip.splice(0, 1))[0];
		// 		//TODO: load in equipment + 属性
		// 		var attack = i.attack;
		// 		var defense = i.defense;
		// 		var magic_defense = i.defense;
		// 		var power_hit = i.power_hit;
		// 		newbackpack_equip[pos] = new EquipmentItem(i.name, getRess(i.name), attack, defense, magic_defense, power_hit)
		// 	}
		// 	backpack["装备"] = newbackpack_equip
		// 	backpack.empty_list["装备"] = newempty_list_equip
		// }
		
		ability = new Ability();
		equipment = new Equipment();
		ui = new UI();

		var player_data = {x: 0, y: 0, width: window.resource.player["stand1"][0].width, height: window.resource.player["stand1"][0].height, 
						   rect_height: 10, is_right: true, curr_res: window.resource.player["stand1"][0],
						   jump_max_height: 120, walk_speed: 8, rope_speed: 8, jump_speed: 15,
						   stand_animation: new Animation(window.resource.player["stand1"], 800),
						   walk_animation: new Animation(window.resource.player["walk1"], 800),
						   jump_animation: new Animation(window.resource.player["jump"], 800),
						   rope_animation: new Animation(window.resource.player["rope"], 500),
						   ladder_animation: new Animation(window.resource.player["ladder"], 500)};
			player_data.defense = 0;
			player_data.min_attack = 1;
			player_data.max_attack = 500;
		player = new Player(player_data);
	}

	//600ms
	this.update_characinfo = setInterval(updateInfo(this.username, this.token),600)
	
	function updateInfo(username, token){
			//every 1 min update character info
		var characterInfo = {
			'currhp' : window.player_attr.curr_hp,
			'currmp' : window.player_attr.curr_mp,
			'currexp' : window.player_attr.curr_exp,
			'currlevel' : window.player_attr.level
		}
		var xhr = new XMLHttpRequest();
		var url = 'http://localhost:8080/api/maplestorydapp/update';
		//POST
		xhr.open("POST", url, true);
		//设置请求头的Content-Type
		xhr.setRequestHeader("Content-Type", "application/json");
		//请求数据
		var data = JSON.stringify({ "username":username, "token":token,"character_indo": characterInfo});
		//when request completes
		xhr.onload = function(e){
			const data = JSON.parse(xhr.responseText);
			if (this.status == 200) {
			} else{
				window.alert("Invalid Token. Please and restart the game. Your record is not saved.");
			}
		};
		//send request
		xhr.send(data);
	}


	//every 5 min query for equipment - how to implement
	this.query_equipment = setInterval(queryEquip(this.username, this.token),3000)

	function queryEquip(username, token){
		//TODO: update this backpack array to user's backpack
		var newbackpack_equip = [];

		var xhr = new XMLHttpRequest();
		var url = 'http://localhost:8080/api/maplestorydapp/query_equipment';
		//POST
		xhr.open("POST", url, true);
		//设置请求头的Content-Type
		xhr.setRequestHeader("Content-Type", "application/json");
		//请求数据
		var data = JSON.stringify({ "username":username, "token":token});
		//when request completes
		xhr.onload = function(e){
			const data = JSON.parse(xhr.responseText);
			if (data.status == 200) {
				pos = 0
				for (i of data.equipment_list){
					//TODO: load in equipment + 属性
					var attack = i.attack;
					var defense = i.defense;
					var magic_defense = i.defense;
					var power_hit = i.power_hit;
					newbackpack_equip[pos] = new EquipmentItem(i.name, getRess(i.name), attack, defense, magic_defense, power_hit)
					pos += 1
				}
				scene_obj.backpack["装备"] = newbackpack_equip
			}else{
				
			}
		};
		//send request
		xhr.send(data);

		// this.backpack["装备"][pos] = new EquipmentItem(thing.name, thing.curr_res);
	}
	function getRess(name) {
		switch(name) {
			case "蓝色蜗牛壳":
				return window.resource.things["lansewoniuke"];
			case "蘑菇芽孢":
				return window.resource.things["moguyabao"];
			case "绿液球":
				return window.resource.things["lvyeqiu"];
			case "绿水灵珠":
				return window.resource.things["lvshuilingzhu"];
			case "刺蘑菇盖":
				return window.resource.things["cimogugai"];
			case "猪头":
				return window.resource.things["zhutou"];
			case "蝴蝶结":
				return window.resource.things["hudiejie"];
			case "钢铁块":
				return window.resource.things["gangtiekuai"];
			case "钢铁猪的蹄子":
				return window.resource.things["gangtiezhudetizi"];
			case "钢铁猪盔甲碎片":
				return window.resource.things["gangtiezhukuijiasuikuai"];
			case "黑石块":
				return window.resource.things["heishikuai"];
			case "石块":
				return window.resource.things["shikuai"];
			case "花蘑菇盖":
				return window.resource.things["huamogugai"];
			case "猫皮":
				return window.resource.things["maopi"];
			case "星光精灵的碎块":
				return window.resource.things["xingkuai"];
			case "月光精灵的碎块":
				return window.resource.things["yuekuai"];
			case "日光精灵的碎块":
				return window.resource.things["rikuai"];
			case "蛇皮":
				return window.resource.things["shepi"];

			case "红色药水":
				return window.resource.things["hong50"];
			case "橙色药水":
				return window.resource.things["hong150"];
			case "白色药水":
				return window.resource.things["hong300"];
			case "蓝色药水":
				return window.resource.things["lan100"];
			case "活力神水":
				return window.resource.things["huolishenshui"];

			case "青梦":
				return window.resource.things["qingmeng"];
			case "黑唐衫":
				return window.resource.things["heitangshan"];
			case "刮胡刀":
				return window.resource.things["guahudao"];
			case "凤凰刃":
				return window.resource.things["fenghuangren"];
			case "双翼刃":
				return window.resource.things["shuangyiren"];
			case "枫叶刃":
				return window.resource.things["fengyeren"];
		}
	}
}

// window.addEventListener('beforeunload', (event) => {
//     event.returnValue = 'You have unfinished changes!';
// });