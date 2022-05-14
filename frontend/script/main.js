// 引入其他js文件中的函数
// window是object
// global user info, used for initialization
// import services from "./services.js"
// import Big from "bignumber.js";

const Mcp = require('mcp.js')
// import mcp from 'mcp.js'
const abi = require('./abi.json')

var oldhp = 50; // default
var oldmp = 30;
var oldexp = 0;
var oldbackpack = [];
var level = 1;
window.token = "";
window.username = ""
window.address = ""

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

window.onload = function () {
    // 开始
    $("start_btn").onclick = function () {
        window.switchUI("login");
    }
    //log in button
    $("login_btn").onclick = function () {
        window.username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000/api/maplestorydapp/login/";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({"username": window.username, "password": password});
        xhr.onload = function (e) {
            if (this.status == 200) {
                //TODO: load character info
                var text = this.responseText
                var jsonResponse = JSON.parse(text);
                var oldcharacter = jsonResponse.character_info
                console.log(oldcharacter)
                window.token = jsonResponse.token
                window.address = jsonResponse.bundle_address
                oldhp = oldcharacter.hp
                oldmp = oldcharacter.mp
                oldexp = oldcharacter.exp
                level = oldcharacter.level
                oldbackpack = oldcharacter.equipment
                var point = oldcharacter.point
                var strr = oldcharacter.str
                var dex = oldcharacter.dex
                var intt = oldcharacter.int
                var luk = oldcharacter.luk
                var defense = oldcharacter.defense
                var magic_defense = oldcharacter.magic_defense
                var max_hp = oldcharacter.max_hp
                var max_mp = oldcharacter.max_mp
                if (Object.keys(oldcharacter).length !== 0) {
                    console.log("get here")
                    window.player_attr = new PlayerAttr(oldhp, oldmp, oldexp, level, strr, dex, intt, luk, defense, magic_defense, max_hp, max_mp, point);
                }

                window.switchlogin("select", "login");
            } else {
                window.alert("Password not match, please try again");
            }
        };
        xhr.send(data);
    }
    $("connect_btn").onclick = function () {
        window["aleereum"] && window["aleereum"].connect();
        $("connect_btn").style.display = "none"
        $("addfund_btn").style.display = "block"
        $("addfundclass").style.display = "block"
    }
    $("addfund_btn").onclick = async function () {
        var amount = document.getElementById("addfundtext").value;
        console.log("amount: " + amount)
        const provider = window["aleereum"]
        const account = provider.account
        // let Mcp = require("../mcp.js");
        const options = {
            host: "18.182.45.18",
            port: "8765"
        }
        let mcp = new Mcp(options)
        mcp.Contract.setProvider('https//18.182.45.18:8765/', account)
        let myContract = new mcp.Contract(abi, '0x22C593597fDF424b966D6684Ca96864624AC343C')

        var decimal = amount.toString().split('.')
        var count = 15
        if (decimal.length > 1) {
            count -= decimal[1].length
        }
        var zeros = ""
        for (let i = 0; i < count; i++) {
            zeros += "0"
        }

        const approveAmount = decimal[0] + (decimal[1] ? decimal[1] : "") + zeros

        // console.log(approveAmount)

        const response = await myContract.methods.depositMoney(window.address).sendToBlock({
            from: account,
            amount: approveAmount
        });

        console.log("response=" + response)
        if (response) {
            document.getElementById("addfundtext").value = "";
            window.alert("Add fund successfully! Please pick up the equipment again!");
        }
    }
    // sign up button
    $("signup_btn").onclick = function () {
        window.switchlogin("signup", "login");
    }
    $("login_btn2").onclick = function () {
        var username = document.getElementById("username2").value;
        var password = document.getElementById("password2").value;
        var address = document.getElementById("walletaddress2").value;
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000/api/maplestorydapp/register/";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({"username": username, "password": password, "bundle_address": address});
        xhr.onload = function (e) {
            if (this.status == 200) {
                window.alert("Sign Up Successfully! Please go back to the log in page.");
            } else {
                window.alert("Username Duplicated, Please sign up again");
            }
        };
        xhr.send(data);
    }
    $("back_to_login_btn").onclick = function () {
        window.switchlogin("login", "signup");
    }
    // 帮助
    $("help_btn").onclick = function () {
        window.switchUI("help");
    }
    // 选择角色
    $("left_img").onclick = function () {
        start("male");
    }

    $("right_img").onclick = function () {
        start("female");
    }

    $("logout_btn").onclick = function () {
        var characterInfo = {
            'hp': window.player_attr.curr_hp,
            'mp': window.player_attr.curr_mp,
            'exp': window.player_attr.curr_exp,
            'level': window.player_attr.level,
            'point': window.player_attr.point,
            'str': window.player_attr.STR,
            'dex': window.player_attr.DEX,
            'int': window.player_attr.INT,
            'luk': window.player_attr.LUK,
            'defense': window.player_attr.defense,
            'magic_defense': window.player_attr.magic_defense,
            'max_hp': window.player_attr.max_hp,
            'max_mp': window.player_attr.max_mp,
        }
        var xhr = new XMLHttpRequest();
        var url = 'http://localhost:8000/api/maplestorydapp/logout/';

        //POST
        xhr.open("POST", url, true);
        //设置请求头的Content-Type
        xhr.setRequestHeader("Content-Type", "application/json");
        //请求数据
        var data = JSON.stringify({
            "username": window.username,
            "token": window.token,
            "character_info": characterInfo
        });
        //when request completes
        xhr.onload = function (e) {
            if (this.status == 200) {
                window.alert("Data Saved! You can close the window!");
                location.reload();
                window.switchUI("login");
            } else {
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
    this.thread = setInterval(function () {
        if (window.resource.curr_amount == window.resource.total_amount) {
            clearInterval(thread);
            $("home_audio").play();

            version.style.display = "block";
            help_btn.style.display = "block";
            start_btn.style.display = "block";

            ctx.drawImage(window.resource.bg["bg"][3], 0, 0, window.WIDTH, window.HEIGHT);
        } else {
            ctx.clearRect(0, 0, window.WIDTH, window.HEIGHT);
            ctx.fillText("正在载入游戏资源，请稍后...  " + (window.resource.curr_amount / window.resource.total_amount * 100).toFixed(2) + "%", window.WIDTH / 2, window.HEIGHT / 2);
        }
    }, 1000 / window.FPS, false);
    resource.load();
}


// switchUI的函数定义，
window.switchUI = function (e_id) {
    var e = $(e_id);
    if ((e.style.display == "none" || e.style.display == "") && $("select").style.display != "block" && $("signup").style.display != "block") {
        e.style.display = "block";
    } else {
        e.style.display = "none";
    }
}
//loginswitch
window.switchlogin = function (e_id, last_id) {
    var e = $(e_id);
    var login = $(last_id)
    if (e.style.display == "none" || e.style.display == "") {
        e.style.display = "block";
        login.style.display = "none";

    } else {
        e.style.display = "none";
    }
}

// window.addFund = function () {
//     var username = "";
//     var token = "";
//     var value = 0;
//     var xhr = new XMLHttpRequest();
//     var url = 'http://localhost:8000/api/maplestorydapp/add_balance/';
//
//     //POST
//     xhr.open("POST", url, true);
//     //设置请求头的Content-Type
//     xhr.setRequestHeader("Content-Type", "application/json");
//     //请求数据
//     var data = JSON.stringify({"value": value, "username": username, "token": token});
//     //when request completes
//     xhr.onload = function (e) {
//
//         if (this.status == 200) {
//             window.alert("Addiing fund successfully!");
//         } else {
//             window.alert("Addiing fund Failed, please try again.");
//         }
//     };
//     //send request
//     xhr.send(data);
// }
// start函数定义，选择角色
window.start = function (gender) {
    var e = $("logout_btn")
    e.style.display = "block"
    $("market_btn").style.display = "block"
    var provider = window["aleereum"]

    if (provider.isConnected) {
        $("addfund_btn").style.display = "block";
        $("addfundclass").style.display = "block";
    } else {
        $("connect_btn").style.display = "block"
    }

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
    ctx.drawRightImage = function (img, x, y) {
        ctx.save();
        ctx.translate(x + img.width / 2, y + img.height / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(img, img.width / -2, img.height / -2);
        ctx.restore();
    }
    ctx.roundRect = function (x, y, width, height, radius, fill, stroke) {
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
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
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

    onkeyup = function (event) {
        game_scene.keyUpEvent(event);
    }
    onkeydown = function (event) {
        game_scene.keyDownEvent(event);
    }
    onmousemove = function (event) {
        game_scene.mouseMoveEvent(event);
    }
    onmousedown = function (event) {
        game_scene.mouseDown(event);
    }
    setInterval(function () {
        if (game_scene.is_finish) {
            game_scene = new GameScene(getGameData(game_scene.next_map), ctx);
        }
        // console.log("trigger interval")
        game_scene.update();
    }, 1000 / window.FPS, false);

    function getGameData(next_map) {
        var map_basic_data = new MapData(next_map);
        player.x = map_basic_data.player_x;
        player.y = map_basic_data.player_y;

        var map_data = map_basic_data.getMapData();
        var bg_data = {x: 0, y: 0, res: window.resource.bg["bg"][map_basic_data.bg]};

        var scene_obj = {};

        // backpack + equipment

        scene_obj.music_src = map_basic_data.music_src;
        scene_obj.backpack = backpack;
        scene_obj.ability = ability;
        scene_obj.equipment = equipment;
        scene_obj.ui = ui;
        scene_obj.player = player;
        scene_obj.map = new Map(map_data);
        scene_obj.bg = new Bg(bg_data);
        scene_obj.username = window.username;
        scene_obj.token = window.token;


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
        ability = new Ability();
        equipment = new Equipment();
        ui = new UI();

        var player_data = {
            x: 0,
            y: 0,
            width: window.resource.player["stand1"][0].width,
            height: window.resource.player["stand1"][0].height,
            rect_height: 10,
            is_right: true,
            curr_res: window.resource.player["stand1"][0],
            jump_max_height: 120,
            walk_speed: 8,
            rope_speed: 8,
            jump_speed: 15,
            stand_animation: new Animation(window.resource.player["stand1"], 800),
            walk_animation: new Animation(window.resource.player["walk1"], 800),
            jump_animation: new Animation(window.resource.player["jump"], 800),
            rope_animation: new Animation(window.resource.player["rope"], 500),
            ladder_animation: new Animation(window.resource.player["ladder"], 500)
        };
        player_data.defense = 0;
        player_data.min_attack = 1;
        player_data.max_attack = 500;
        player = new Player(player_data);
    }

    //600ms

    setInterval(function () {
        updateInfo(window.username, window.token)
    }, 10000)

    // clearInterval(updateInterval)

    async function updateInfo(username, token) {
        //every 1 min update character info
        // console.log("update user info begins")
        var characterInfo = {
            'hp': window.player_attr.curr_hp,
            'mp': window.player_attr.curr_mp,
            'exp': window.player_attr.curr_exp,
            'level': window.player_attr.level,
            'point': window.player_attr.point,
            'str': window.player_attr.STR,
            'dex': window.player_attr.DEX,
            'int': window.player_attr.INT,
            'luk': window.player_attr.LUK,
            'defense': window.player_attr.defense,
            'magic_defense': window.player_attr.magic_defense,
            'max_hp': window.player_attr.max_hp,
            'max_mp': window.player_attr.max_mp,
        }
        // console.log("chara_info: "+JSON.stringify(characterInfo, null, 4))
        var xhr = new XMLHttpRequest();
        var url = 'http://localhost:8000/api/maplestorydapp/update/';

        //POST
        xhr.open("POST", url, true);
        //设置请求头的Content-Type
        xhr.setRequestHeader("Content-Type", "application/json");
        //请求数据
        var data = JSON.stringify({"username": username, "token": token, "character_info": characterInfo});
        //when request completes
        xhr.onload = function (e) {
            const data = JSON.parse(xhr.responseText);
            if (this.status == 200) {
            } else {
                window.alert("Invalid Token. Please and restart the game. Your record is not saved.");
                location.reload();
                window.switchUI("login");
            }
        };
        //send request
        xhr.send(data);
    }

    //every 5 min query for equipment - how to implement
    setInterval(function () {
        queryEquip(window.username, window.token)
    }, 5000)

    async function queryEquip(username, token) {
        //TODO: update this backpack array to user's backpack

        var xhr = new XMLHttpRequest();
        var url = 'http://localhost:8000/api/maplestorydapp/query_equipment/';

        //POST
        xhr.open("POST", url, true);
        //设置请求头的Content-Type
        xhr.setRequestHeader("Content-Type", "application/json");
        //请求数据
        var data = JSON.stringify({"username": username, "token": token});
        //when request completes
        xhr.onload = function (e) {
            const data = JSON.parse(xhr.responseText);
            // console.log(game_scene.backpack.backpack)
            console.log("equip data: " + xhr.responseText)
            // console.log(window.resource.things)
            if (this.status == 200) {
                //成功收到则初始化背包
                game_scene.backpack.backpack["装备"] = []
                game_scene.backpack.empty_list["装备"] = []

                for (var j = 0; j < 24; j++) {
                    game_scene.backpack.backpack["装备"].push(null);
                    game_scene.backpack.empty_list["装备"].push(j);
                }

                var stillHaveWeapon = false
                var stillHaveCloth = false

                //开始添加物品，based on current data from back end    
                for (var i of data.equipment_list) {
                    //TODO: load in equipment + 属性
                    var attack = i.attack;
                    var defense = i.defense;
                    var magic_defense = i.magic_defense;
                    var power_hit = (i.power_hit) / 100.0;
                    var equip_id = i.id;
                    console.log("id: " + equip_id)
                    // console.log(game_scene.backpack.backpack)
                    // console.log(game_scene.backpack.empty_list)
                    var posi = game_scene.backpack.empty_list["装备"].splice(0, 1)
                    // console.log("insert pos: "+posi)

                    console.log("attack: " + attack);

                    if (window.player_attr.weapon && window.player_attr.weapon["id"] === equip_id) {
                        stillHaveWeapon = true
                        continue;
                    }

                    if (window.player_attr.clothes && window.player_attr.clothes["id"] === equip_id) {
                        stillHaveCloth = true
                        continue;
                    }

                    game_scene.backpack.backpack["装备"][posi] = new EquipmentItem(i.name, new Animation(getRess(i.name), 1000, 0).getCurrFrame(), attack, defense, magic_defense, power_hit, equip_id)
                }
                if (!stillHaveWeapon) {
                    window.player_attr.weapon = null;
                    game_scene.equipment.weapon = null;
                }
                if(!stillHaveCloth){
                    window.player_attr.clothes = null;
                    game_scene.equipment.clothes = null;
                }
                // console.log(newbackpack_equip)
                console.log(window.player_attr)
                console.log(game_scene)
                game_scene.draw();
            } else {

            }
        };
        //send request
        xhr.send(data);

        // this.backpack["装备"][pos] = new EquipmentItem(thing.name, thing.curr_res);
    }

    function getRess(name) {
        switch (name) {
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

window.discardEquipment = async function(id) {
    const provider = window["aleereum"]
    const account = provider.account
    // let Mcp = require("../mcp.js");
    const options = {
        host: "18.182.45.18",
        port: "8765"
    }
    let mcp = new Mcp(options)
    mcp.Contract.setProvider('https//18.182.45.18:8765/', account)
    let myContract = new mcp.Contract(abi, '0x22C593597fDF424b966D6684Ca96864624AC343C')

    const response = await myContract.methods.discardEquipment(id).sendToBlock({
        from: account,
        amount: "0"
    });
    console.log(response)

    if (response.success) {
        console.log("respons success!" + response)
    }
} 