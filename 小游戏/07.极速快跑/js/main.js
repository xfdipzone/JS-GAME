/** 极速快跑
*	Author:	fdipzone
*	Date:	2012-07-15
*	Ver:	1.0
*/

var gameimg = ['images/start.png', 'images/start_over.png', 'images/go.png', 'images/go_over.png', 'images/running.gif', 'images/run_start1.gif', 'images/run_start2.gif', 'images/run_start3.gif'];
var speed_obj = new SpeedClass();

window.onload = function(){
	var callback = function(){
		speed_obj.init();
	}
	img_preload(gameimg, callback);
}


// Speed Class
function SpeedClass(){
	this.levelset = [8,5,8,12];	// 难度参数
	this.playerlist = null;		// 选手列表
	this.player = 0;			// 选中的选手
	this.level = 2;				// 难度
	this.lock = 0;				// 锁定
	this.isstart = 0;			// 是否开始
	this.isover = 0;			// 是否结束
}


// init
SpeedClass.prototype.init = function(){
	this.reset();
	this.create_player();
	this.create_event();
}


// reset
SpeedClass.prototype.reset = function(){
	this.player = 0;
	this.level = $('level').value;	// level
	this.playerlist = $_tag('li', 'playerlist');
	for(var i=0; i<this.playerlist.length; i++){
		this.playerlist[i].className = '';
	}
	disp('start_btn', 'show', 'start_btn');
	disp('go_btn', 'hide', 'go_btn');
	this.lock = 0;		// unlock
	this.isstart = 0;	// unstart
	this.isover = 0;	// unover
}


// create player
SpeedClass.prototype.create_player = function(){
	var runway = [];
	var playerlist = [];
	for(var i=1; i<=8; i++){
		runway[i] = '<li><div id="player' + (9-i) + '" class="run_status1"></div></li>';
		playerlist[i] = '<li>' + i + '</li>';
	}
	$('runway').innerHTML = runway.join('');
	$('playerlist').innerHTML = playerlist.join('');
	runway = null;
	playerlist = null;
}


// create event
SpeedClass.prototype.create_event = function(){
	var self = this;
	this.playerlist = $_tag('li', 'playerlist');
	for(var i=0; i<this.playerlist.length; i++){
		this.playerlist[i].onmouseover = function(){
			if(this.className!='on'){
				this.className = 'over';
			}
		}
		this.playerlist[i].onmouseout = function(){
			if(this.className!='on'){
				this.className = '';
			}
		}
		this.playerlist[i].onclick = function(o,c){
			return function(){
				if(self.lock==0){
					o.playerlist[c].className = 'on';
					if(o.player!=0 && o.player!=c+1){	// 不等於0且不等於自己
						o.playerlist[o.player-1].className = '';
					}
					o.player = c + 1;
				}
			}
		}(self, i);
	}

	$('start_btn').onmouseover = function(){
		this.className = 'start_over_btn';
	}
	$('start_btn').onmouseout = function(){
		this.className = 'start_btn';
	}
	$('start_btn').onclick = function(){
		if(self.player==0){
			return alert('请选择要支持的选手');
		}else{
			self.lock = 1; // locked
			disp('start_btn','hide');
			disp('go_btn','show');
			for(var i=1; i<=8; i++){
				self.start(i);
			}
		}
	}

	$('go_btn').onmouseover = function(){
		this.className = 'go_over_btn';	
	}
	$('go_btn').onmouseout = function(){
		this.className = 'go_btn';
	}
	$('go_btn').onclick = function(){
		self.go();
	}
}


// start game
SpeedClass.prototype.start = function(c){
	var o = $('player' + c);
	var step = 1;
	var self = this;
	var exert = 0;

	o.style.marginLeft = '62px'; // init
	
	var et = setInterval(function(){
		if(step<4){	// step 1-3 is ready
			o.className = 'run_status' + step;
		}else{
			// run
			if(o.className!='running'){
				o.className = 'running';
			}
			// start can go
			if(self.isstart==0){
				self.isstart = 1;
			}
			// 已有一名选手到达终点
			if(self.isover==1){
				clearInterval(et);
			}else{
				if(self.player!=c){ // 其他选手
					exert = Math.floor(Math.random()* self.levelset[self.level])+3;	// 根据level调整
				}
				o.style.marginLeft = parseInt(o.style.marginLeft) + Math.floor(Math.random()*8)+4 + exert + 'px';
				// 到达终点
				if(parseInt(o.style.marginLeft)>=745){ 
					clearInterval(et);
					self.isover = 1;
					self.gameover(o.id);
				}
			}
		}
		step ++;
	}, 350)
}


// go
SpeedClass.prototype.go = function(){
	if(this.isstart==1 && this.isover==0){
		var o = $('player' + this.player);
		var exert = Math.floor(Math.random()*3)+2; // 2-5
		o.style.marginLeft = parseInt(o.style.marginLeft) + exert + 'px';
	}
	return false;
}


// gameover
SpeedClass.prototype.gameover = function(id){
	id = id.replace('player','');
	var self = this;
	var msg = '';
	if(id==this.player){
		msg = "恭喜你,你支持的选手获得胜利\n\n";
	}else{
		msg = "很遗憾,你支持的选手没有获得胜利,获胜的是" + id + "号选\n\n";
	}
	if(confirm(msg + '是否重新开始?')==true){
		setTimeout(function(){
			self.init();
		},1000);
	}else{
		return false;
	}
}


/** common function */

// get document.getElementBy(id)
function $(id){
	return document.getElementById(id);
}


// get document.getElementsByTagName
function $_tag(name, id){
	if(typeof(id)!='undefined'){
		return $(id).getElementsByTagName(name);
	}else{
		return document.getElementsByTagName(name);	
	}
}


/* div show and hide
* @param id dom id
* @param handle show or hide
* @param classname
*/
function disp(id, handle, classname){
	if(handle=='show'){
		$(id).style.display = 'block';
	}else{
		$(id).style.display = 'none';
	}
	if(typeof(classname)!='undefined'){
		$(id).className = classname;
	}
}


/* img preload
* @param img		要加载的图片数组
* @param callback	图片加载成功后回调方法
*/
function img_preload(img, callback){
	var onload_img = 0;
	var tmp_img = [];
	for(var i=0,imgnum=img.length; i<imgnum; i++){
		tmp_img[i] = new Image();
		tmp_img[i].src = img[i];
		if(tmp_img[i].complete){
			onload_img ++;
		}else{
			tmp_img[i].onload = function(){
				onload_img ++;
			}
		}
	}
	var et = setInterval(
		function(){
			if(onload_img==img.length){	// 定时器,判断图片完全加载后调用callback
				clearInterval(et);
				callback();
			}
		},200);
}