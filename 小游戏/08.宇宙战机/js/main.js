/** 宇宙战机
*   Author: fdipzone
*   Date:   2013-02-12
*   Ver:    1.0
*/
window.onload = function(){
    var gameimg = [
        'images/fighter.png', 
        'images/fighter_p.png', 
        'images/fighter_s.png',
        'images/fighter_sp.png', 
        'images/shot.png', 
        'images/destroy.png', 
        'images/destroy_boss.png',
        'images/enemy.png', 
        'images/bullet.png', 
        'images/gift.png', 
        'images/bomb.png', 
        'images/boss1.png'];

    var callback = function(){
        var gameplane = $('gameplane');
        fighter.init();
        fighter.bgmove(gameplane);
    }
    img_preload(gameimg, callback);
};


/** fighter class */
var fighter = (function(){
    
    var hiscore = 10000;                    // 最高分
    var score = 0;                          // 当前分
    var fighternum = 3;                     // 战机数量
    var bombnum = 3;                        // 炸弹数量
    var ft = null;                          // 战机对象
    var is_start = 0;                       // 是否已开始游戏
    var is_bombing = 0;                     // 是否爆炸中
    var is_lock = 1;                        // 是否锁定
    var is_over = 0;                        // 是否已结束
    var is_clear = 0;                       // 清屏
    var is_pile = 0;                        // 是否已达成蓄力
    var is_protect = 0;                     // 是否保护状态
    var pilenum = 0;                        // 已蓄力数量
    var ackey = {};                         // 记录键是否按下
    var keypriority = {};                   // 冲突键优先级
    var gamekey = [37,38,39,40,83,65];      // 游戏的按键
    var scoretag = [0,20,30,40,50,60,500];  // 不同敌机的分数
    var level = 1;                          // 关数
    var power = 1;                          // 战机子弹威力
    var cheatcode = [];                     // 记录cheat输入
    var failtimes = 0;                      // 挑战失败次数
    
    // boss 数据
    var bossdata = [
                    {'armor':500, 'left':136, 'top':-169, 'step':30},
                    {'armor':1000, 'left':136, 'top':-169, 'step':30},
                    {'armor':1500, 'left':136, 'top':-169, 'step':30},
                    {'armor':2000, 'left':136, 'top':-169, 'step':30},
                    {'armor':2500, 'left':136, 'top':-169, 'step':30},
                    {'armor':3000, 'left':136, 'top':-169, 'step':30},
                   ];

    // 出现的敌机
    var enemydata = [];

    // 当前出现的boss
    var curboss = null;

    // 关卡数据
    var map = [
        // level 1
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        },
        // level 2
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        },
        // level 3
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        },
        // level 4
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        },
        // level 5
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        },
        // level 6
        {
            'ms50':[[3, 680, 1, -50, 10, 10],[3, 680, 1, -50, 290, 10]], 
            'ms2500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms3500':[[1, 10, 12, -23, 190, 10]],
            'ms5500':[[3, 800, 2, 100, -50, 10]],
            'ms7500':[[3, 800, 2, 200, 450, -10]],
            'ms8000':[[1, 10, 11, -23, 100, 10]],
            'ms9500':[[3, 800, 2, 100, -50, 10]],
            'ms11500':[[3, 800, 2, 200, 450, -10]],
            'ms13500':[[3, 800, 2, 100, -50, 10]],
            'ms15500':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms20000':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms25000':[[1, 10, 4, 150, -50, 10],[1, 10, 4, 250, 400, -10],[1, 10, 4, 100, 400, -10]],
            'ms30000':[[3, 800, 5, 692, 90, -10],[3, 800, 5, 692, 280, -10]],
            'ms35000':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms38000':[[1, 10, 11, -23, 10, 10]],
            'ms40000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms42500':[[3, 680, 1, -50, 70, 10],[3, 680, 1, -50, 220, 10]],
            'ms45500':[[3, 800, 2, 50, -50, 10]],
            'ms47500':[[3, 800, 2, 150, 450, -10]],
            'ms49500':[[3, 800, 2, 50, -50, 10]],
            'ms51500':[[3, 800, 2, 150, 450, -10]],
            'ms55500':[[3, 800, 3, -50, 90, 10],[3, 800, 3, -50, 280, 10]],
            'ms60000':[[3, 800, 3, -50, 30, 10],[3, 800, 3, -50, 340, 10]],
            'ms65000':[[1, 10, 4, 100, 400, -10],[1, 10, 4, 300, -50, 10]],
            'ms68000':[[3, 800, 5, 692, 110, -10],[3, 800, 5, 692, 260, -10]],
            'ms71000':[[1, 10, 13, -23, 220, 10]],
            'ms76000':[]
        }
    ];


    // 初始化
    init = function(){
        ft = $('fighter');
        reset();
        key_event();
    }


    // 开始游戏
    start = function(){
        is_clear = 0;
        is_protect = 0;
        disp(ft.id, 'show');
        reset_fighter();
        reset_pile();
        process();
        bgsound(level, true);
        bgchange(level);
        fighter_init();
    }


    // 设置事件
    key_event = function(){

        document.onkeydown = function(e){
            var e = e || window.event;
            var curkey = e.keyCode || e.which || e.charCode;

            if(is_start==0){ 
                if(cheatcode.length>12){
                    cheatcode.shift();
                }
                cheatcode.push(curkey); // 记录用户输入的cheatcode
            }
            
            if(is_start==1 && in_array(curkey,gamekey)){
                if(ackey[curkey.toString()]==0 || typeof(ackey[curkey.toString()])=='undefined' || !in_array(curkey,[83,65])){    // 射击与炸弹连按屏蔽
                    ackey[curkey.toString()] = 1;    // save key down
                    switch(curkey){
                        case 37:
                        case 39:
                            keypriority.left = curkey;    // left right
                            break;
                        case 38:
                        case 40:
                            keypriority.top = curkey;    // up down
                            break;
                    }
                }else{
                    return false;
                }
            }
            
            if(curkey==13 || is_start==1 && is_lock==0){    // game is start or key=13
                switch(curkey){
                    case 13: // enter
                        if(is_start==0){
                            is_start=1;
                            disp('op', 'hide');
                            msg_show();
                            setTimeout(function(){
                                msg_hide();
                                cheat();
                                start();
                            }, 1500);
                        }
                        break;

                    case 83: // 射击
                        shot();
                        break;

                    case 65: // 炸弹
                        bomb();
                        break;
                }
            }
        }

        document.onkeyup = function(e){
            var e = e || window.event;
            var curkey = e.keyCode || e.which || e.charCode;
            if(is_start==1 && in_array(curkey,gamekey)){
                ackey[curkey.toString()] = 0;    // release key down
                
                if(curkey==83){// 释放蓄力攻击
                    if(is_pile==1){
                        pile_shot();
                    }
                    reset_pile();
                }
            }
        }

    }


    // 循环执行的动作
    action = function(){
        var movestep = 5;    // 移动步长
        var et = setInterval(function(){
            if(is_start==0 || is_lock==1){
                clearInterval(et);
            }
            
            // 移动
            if(ackey['37']==1 && (ackey['39']==0 || keypriority.left==37)){    // 冲突时判断优先级
                if(getPosition(ft,'left')<movestep){
                    setPosition(ft, 'left', 0);    // left
                }else{
                    setPosition(ft, 'left', getPosition(ft,'left') - movestep);
                }
            }
            if(ackey['38']==1 && (ackey['40']==0 || keypriority.top==38)){
                if(getPosition(ft, 'top')<movestep){
                    setPosition(ft, 'top', 0);    // top
                }else{
                    setPosition(ft, 'top', getPosition(ft,'top') - movestep);
                }
            }
            if(ackey['39']==1 && (ackey['37']==0 || keypriority.left==39)){
                if(400-(getPosition(ft,'left')+50)<movestep){
                    setPosition(ft, 'left', 350);    //width-fighter.width
                }else{
                    setPosition(ft, 'left', getPosition(ft,'left') + movestep);
                }
            }
            if(ackey['40']==1 && (ackey['38']==0 || keypriority.top==40)){
                if(640-(getPosition(ft,'top')+50)<movestep){
                    setPosition(ft, 'top', 590);    // height-fighter.height
                }else{
                    setPosition(ft, 'top', getPosition(ft,'top') + movestep);
                }
            }

            // 蓄力攻击
            if(ackey['83']==1){
                if(pilenum<1000){
                    pilenum = pilenum + 20;
                }else if(is_pile==0){
                    is_pile = 1;
                    if(is_protect==1){
                        setClass(ft, 'fighter_sp');
                    }else{
                        setClass(ft, 'fighter_s');
                    }
                }
            }

        }, 20);
    }


    // 战机射击
    shot = function(){
        // 创建子弹
        var bullet = document.createElement('div');
        var offsetx;

        switch(power){
            case 1:
                offsetx = 20;
                break;
            case 2:
                offsetx = 15;
                break;
            case 3:
                offsetx = 10;
                break;
            case 4:
                offsetx = 4;
                break;
        }

        setClass(bullet, 'shot' + power);

        // 设置子弹初始位置
        setPosition(bullet, 'top', getPosition(ft, 'top')-30);
        setPosition(bullet, 'left', getPosition(ft, 'left') + offsetx);
        
        ft.parentNode.appendChild(bullet);
        
        // 设置子弹运动
        var et = setInterval(function(){
            if(getPosition(bullet,'top')<=-30 || is_lock==1){
                clearInterval(et);
                ft.parentNode.removeChild(bullet);    // 释放子弹
            }

            for(var i=0; i<enemydata.length; i++){
                if(enemydata[i]!=null){
                    if(impact(bullet, enemydata[i])){    // 打中敌机
                        destroy(enemydata[i]);
                        scoreup(enemydata[i].type);
                        enemydata[i] = null;
                        clearInterval(et);
                        ft.parentNode.removeChild(bullet);
                    }
                }
            }

            if(curboss!=null){    // boss 战
                if(impact(bullet, curboss['obj'])){ // 打中boss
                    curboss['armor']=parseInt(curboss['armor'])-power*10;
                    clearInterval(et);
                    ft.parentNode.removeChild(bullet);
                }
            }

            setPosition(bullet, 'top', getPosition(bullet, 'top')-15);

        }, 30)
    }


    // 蓄力射击
    pile_shot = function(){
        var pilebullet = document.createElement('div');
        setClass(pilebullet, 'pileshot');

        // 设置子弹初始位置
        setPosition(pilebullet, 'top', getPosition(ft, 'top')-30);
        setPosition(pilebullet, 'left', getPosition(ft, 'left'));
        
        ft.parentNode.appendChild(pilebullet);

        var et = setInterval(function(){
            if(getPosition(pilebullet,'top')<=-85 || is_lock==1){
                clearInterval(et);
                ft.parentNode.removeChild(pilebullet); // 释放子弹
            }

            for(var i=0; i<enemydata.length; i++){
                if(enemydata[i]!=null){
                    if(impact(pilebullet, enemydata[i])){    // 打中敌机
                        destroy(enemydata[i]);
                        scoreup(enemydata[i].type);
                        enemydata[i] = null;
                    }
                }
            }

            if(curboss!=null){    // boss 战
                if(impact(pilebullet, curboss['obj'])){ // 打中boss
                    curboss['armor']=parseInt(curboss['armor'])-100;
                    clearInterval(et);
                    ft.parentNode.removeChild(pilebullet); // 释放子弹
                }
            }

            setPosition(pilebullet, 'top', getPosition(pilebullet, 'top')-20);

        }, 30)
    }


    // 放炸弹
    bomb = function(){
        if(is_bombing==0 && bombnum>0){    // 不是爆炸中且有炸弹数
            is_bombing = 1;
            bombnum --;
            setHtml('bombnum', bombnum);    // 自减1

            var opacity = 100;
            setOpacity($('bomb'), opacity);
            disp('bomb', 'show');

            // 清除所有敌机及敌方子弹
            is_clear = 1;

            // 打击boss
            if(curboss!=null){
                curboss['armor'] = parseInt(curboss['armor'])-300;
            }

            var step = 0;
            var et = setInterval(function(){    // 炸弹效果
                if(step<11){
                    setBgPosition($('bomb'), 0, step*(-280));
                }else{
                    clearInterval(et);
                    disp('bomb', 'hide');
                    is_bombing = 0;
                    is_clear = 0;
                }
                step ++;
            }, 70);
        }
    }


    // 游戏进程
    process = function(){
        var leveldata = map[level-1], processed = 0, step = 10;
        var levelstep = 0;    // 每关开始清0
        var et = setInterval(function(){
            if(is_lock==0){
                processed += step;
                if(attrcount(leveldata)>levelstep){    // 未完成本关
                    if(leveldata['ms'+processed]){
                        for(var i=0; i<leveldata['ms'+processed].length; i++){
                            var msdata = leveldata['ms'+processed][i];
                            create(msdata);
                        }
                        levelstep ++;    // 进度
                    }
                }else{    // 已完成本关,进入Boss战
                    bosswar();
                    clearInterval(et);
                }
            }

            if(is_over==1){
                clearInterval(et);
            }

        }, step);
    }


    /* 创建关卡元素
    /* msdata:{
       num:出现的数量
       interval:间隔
       type:类型
       top:原始top坐标
       left:原始left坐标
       step:移动距离
       }
    */
    create = function(msdata){
        var num = msdata[0],
            interval = msdata[1],
            type = msdata[2],
            top = msdata[3],
            left = msdata[4],
            step = msdata[5];

        var et = setInterval(function(){
                if(num>0){
                    var enft = document.createElement('div');
                    setClass(enft, 'element' + type);
                    enft.type = type;
                    setPosition(enft, 'top', top);
                    setPosition(enft, 'left', left);
                    ft.parentNode.appendChild(enft);
                    if(type<=10){
                        enemydata.push(enft);
                    }
                    route(enft, type, step);
                    num--;
                }else{
                    clearInterval(et);
                }
            }, interval);
    }


    // 元素运动轨迹
    route = function(enft, type, step){
        var et = null;
        switch(type){
            case 1: // 曲线
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+Math.abs(step));
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<5? count++ : (count=0, step*=-1);
                        if(getPosition(enft, 'top')>640 || is_over==1 || is_clear==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        impact_handle(enft, et);
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;

            case 2: // 横向
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<9? count++ : (count=0, attack(enft,1,17,47));
                        if(getPosition(enft,'left')>400 && step>0 || getPosition(enft,'left')<-50 && step<0 || is_over==1 || is_clear==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        impact_handle(enft, et);
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;

            case 3: // 竖向
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+step);
                        count<9? count++ : (count=0, attack(enft,1,17,47));
                        if(getPosition(enft,'top')>640 || is_over==1 || is_clear==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        impact_handle(enft, et);
                    }else{
                        clearInterval(et);
                    }
                }, 75);
                break;

            case 4: // 左右循环移动攻击
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<10? count++ : (count=0, attack(enft,4,17,31));
                        
                        if(getPosition(enft,'left')>=350 && step>0 || getPosition(enft,'left')<=0 && step<0){
                            step*=-1;
                        }

                        if(is_over==1 || is_clear==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        impact_handle(enft, et);
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;

            case 5: // 从后面攻击
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+step);
                        count<9? count++ : (count=0, attack(enft,1,17,-17));
                        if(getPosition(enft,'top')<-32 || is_over==1 || is_clear==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        impact_handle(enft, et);
                    }else{
                        clearInterval(et);
                    }
                }, 75);
                break;

            case 11: // power gift
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+Math.abs(step));
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<5? count++ : (count=0, step*=-1);
                        if(getPosition(enft, 'top')>640 || is_over==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        if(impact(enft, ft) && is_lock==0){    // 奖励与战机相撞
                            powerup();
                            ft.parentNode.removeChild(enft);
                            clearInterval(et);
                        }
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;

            case 12: // bomb gift
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+Math.abs(step));
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<5? count++ : (count=0, step*=-1);
                        if(getPosition(enft, 'top')>640 || is_over==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        if(impact(enft, ft) && is_lock==0){    // 奖励与战机相撞
                            bombup();
                            ft.parentNode.removeChild(enft);
                            clearInterval(et);
                        }
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;

            case 13: // fighter gift
                var count = 0;
                et = setInterval(function(){
                    if(node_exist(enft)){
                        setPosition(enft, 'top', getPosition(enft,'top')+Math.abs(step));
                        setPosition(enft, 'left', getPosition(enft,'left')+step);
                        count<5? count++ : (count=0, step*=-1);
                        if(getPosition(enft, 'top')>640 || is_over==1){
                            clearInterval(et);
                            ft.parentNode.removeChild(enft);
                        }
                        if(impact(enft, ft) && is_lock==0){    // 奖励与战机相撞
                            fighterup();
                            ft.parentNode.removeChild(enft);
                            clearInterval(et);
                        }
                    }else{
                        clearInterval(et);
                    }
                }, 80);
                break;
        }
    }


    // 销毁
    destroy = function(dobj){    // dobj:被销毁的对象
        var dest = document.createElement('div');
        setClass(dest, 'destroy');
        setPosition(dest, 'top', getPosition(dobj, 'top'));
        setPosition(dest, 'left', getPosition(dobj, 'left'));
        ft.parentNode.appendChild(dest);

        if(dobj.id=='fighter'){    // 战机被击中
            disp(dobj.id, 'hide');
            power = 1;
            bombnum = 3;
            fighternum--;
            setHtml('fighternum', fighternum);
            setHtml('bombnum', bombnum);
            is_lock = 1;
        }else{
            dobj.parentNode.removeChild(dobj);
        }
        
        var step = 0;
        var et = setInterval(function(){
            if(step<11){
                setBgPosition(dest, step*(-48), 0);
                step++;
            }else{
                if(dobj.id=='fighter'){
                    setTimeout(function(){
                        if(fighternum>0){
                            levelcontinue();
                        }else{
                            if(curboss!=null){
                                obj = curboss['obj'];
                                obj.parentNode.removeChild(obj);
                            }
                            gameover();    //战机全部被击中,游戏结束
                        }
                    },1000);
                }
                dest.parentNode.removeChild(dest);
                clearInterval(et);
            }
        }, 50);
    }


    // boss war
    bosswar = function(){
        var boss = bossdata[level-1];
        var bossft = document.createElement('div');
        setClass(bossft, 'boss' + level);
        setPosition(bossft, 'left', boss['left']);
        setPosition(bossft, 'top', boss['top']);
        ft.parentNode.appendChild(bossft);
        
        curboss = {"armor":boss['armor'],"obj":bossft};

        switch(level){
            case 1: // boss 1
            case 2: // boss 2
            case 3: // boss 3
            case 4: // boss 4
            case 5: // boss 5
            case 6: // boss 6
                var step = -3;
                var count = 0;
                var et = setInterval(function(){
                    if(getPosition(bossft,'top')<50){    // boss 进场
                        setPosition(bossft, 'top', getPosition(bossft, 'top')+5);
                    }else{

                        if(curboss['armor']<=0){    // boss over
                            clearInterval(et);
                            bossover();
                        }else{

                            if(step<0){ // 左移动
                                if(getPosition(bossft,'left')>10){
                                    setPosition(bossft, 'left', getPosition(bossft, 'left')+step);
                                }else{
                                    step*=-1;
                                }
                            }

                            if(step>0){ // 右移动
                                if(getPosition(bossft,'left')<260){
                                    setPosition(bossft, 'left', getPosition(bossft, 'left')+step);
                                }else{
                                    step*=-1;
                                }
                            }

                            if(count>=35 && count%35==0){
                                 attack(bossft, 1, 30, 30);
                                 attack(bossft, 1, 80, 30);
                            }
                            
                            if(count>=60 && count%60==0){
                                attack(bossft, 2, 15, 75);
                                attack(bossft, 2, 105, 75);
                            }

                            if(count>=100 && count%100==0){
                                attack(bossft, 3, 60, 92);
                            }

                            count<8400? count++ : count=0;

                        }
                    }
                }, boss['step']);
                break;
        }
    }


    /* attack
    * obj  敌机
    * type 攻击类型
    * left 子弹初始left
    * top  子弹初始top
    */
    attack = function(obj, type, left, top){
        if(is_lock==1){
            return false;    // 如已锁定不射击
        }

        var oleft = getPosition(obj, 'left')+left;
        var otop = getPosition(obj, 'top')+top;

        switch(type){

            case 1: //向战机攻击

                // 子弹初始位置与战机位置
                var opoint = {x:oleft+7, y:otop+7};
                var dpoint = {x:getPosition(ft,'left')+25, y:getPosition(ft,'top')+25};
                var p = vector(opoint, dpoint, 8);

                enftbullet('bullet', oleft, otop, p[0], p[1], 35);
                break;

            case 2: //直线攻击
                var num = 3;
                var st = setInterval(function(){
                    if(num>0){
                        enftbullet('bullet', oleft, otop, 0, 8, 35);
                        num --;

                    }else{
                        clearInterval(st);
                    }
                }, 150);
                break;

            case 3: // 散开攻击
                var num = 3;
                var st = setInterval(function(){
                    if(num>0){
                        switch(num){
                            case 1:
                                enftbullet('sbullet', oleft, otop, 0, 8, 35);
                                break;

                            case 2:
                                enftbullet('sbullet', oleft, otop, 3, 8, 35);
                                break;

                            case 3:
                                enftbullet('sbullet', oleft, otop, -3, 8, 35);
                                break;
                        }

                        num --;

                    }else{
                        clearInterval(st);
                    }
                }, 0);
                break;

            case 4: // 小散开攻击
                var num = 3;
                var st = setInterval(function(){
                    if(num>0){
                        switch(num){
                            case 1:
                                enftbullet('bullet', oleft, otop, 0, 8, 35);
                                break;

                            case 2:
                                enftbullet('bullet', oleft, otop, 3, 8, 35);
                                break;

                            case 3:
                                enftbullet('bullet', oleft, otop, -3, 8, 35);
                                break;
                        }

                        num --;

                    }else{
                        clearInterval(st);
                    }
                }, 0);
                break;
        }
    }


    /* enft bullet
    * type 子弹类型
    * oleft,otop 子弹初始位置
    * left,top 子弹徧移
    * speed 速度
    */
    enftbullet = function(type, oleft, otop, left, top, speed){
        var bullet = document.createElement('div');
        setClass(bullet, type);
        setPosition(bullet, 'left', oleft);
        setPosition(bullet, 'top', otop);
        ft.parentNode.appendChild(bullet);

        var et = setInterval(function(){
            setPosition(bullet, 'top', getPosition(bullet,'top')+top);
            setPosition(bullet, 'left', getPosition(bullet,'left')+left);

            if(getPosition(bullet,'left')>400 || getPosition(bullet,'left')<-30 || getPosition(bullet,'top')<-30 || getPosition(bullet,'top')>640 || is_lock==1 || is_clear==1){
                clearInterval(et);
                ft.parentNode.removeChild(bullet);
            }

            impact_handle(bullet, et);
        }, speed);
    }


    // boss over
    bossover = function(){
        obj = curboss['obj'];
        obj.parentNode.removeChild(obj);

        scoreup(6); // boss score

        var dest = document.createElement('div');
        setClass(dest, 'destroyboss');
        setPosition(dest, 'top', getPosition(obj, 'top'));
        setPosition(dest, 'left', getPosition(obj, 'left'));
        ft.parentNode.appendChild(dest);

        var step = 0;
        var et = setInterval(function(){
            if(step<21){
                setBgPosition(dest, step*(-150), 0);
            }else if(step==21){
                dest.parentNode.removeChild(dest);
            }else if(step==50){
                clearInterval(et);
                levelup();
            }
            step++;
        }, 50);
    }


    // continue
    levelcontinue = function(){
        reset_fighter();
        disp(ft.id, 'show');
        setProtect();
        fighter_init();
    }


    // 过关
    levelup = function(){
        keypriority = {};
        enemydata = [];
        curboss = null;
        level ++;

        bgsound('pass', false);

        var processed = 0;
        var et = setInterval(function(){
            is_lock = 1;
            processed = processed + 15;
            
            if(getPosition(ft, 'top')>-50){
                setPosition(ft, 'top', getPosition(ft, 'top')-15);
            }
            
            if(processed>=2500){
                clearInterval(et);
                disp(ft.id, 'hide');
                
                if(level<=map.length){
                    bgchange(0);
                    msg_show();
                    setTimeout(function(){
                        msg_hide();
                        start();
                    }, 1500);
                }else{
                    gameclear();    // 通关
                }
            }
        }, 25);
    }


    // 更新分数
    scoreup = function(type){
        if(typeof(scoretag[type])!='undefined'){
            score = score + scoretag[type] * level;
            setHtml('score', score);
            if(score > hiscore){
                hiscore = score;
                setHtml('hiscore', hiscore);
            }
        }
    }


    // 子弹升级
    powerup = function(){
        power = power+1>4? 4 : power+1;
    }    


    // 炸弹增加
    bombup = function(){
        bombnum ++;
        setHtml('bombnum', bombnum);
    }


    // 战机增加
    fighterup = function(){
        fighternum ++;
        setHtml('fighternum', fighternum);
    }


    // 保护状态
    setProtect = function(){
        is_protect = 1;
        if(is_pile==1){
            setClass(ft, 'fighter_sp');
        }else{
            setClass(ft, 'fighter_p');
        }
        setTimeout(function(){
            is_protect = 0;
            if(is_pile==1){
                setClass(ft, 'fighter_s');
            }else{
                setClass(ft, 'fighter');
            }
        }, 3000)
    }


    // 碰撞处理
    impact_handle = function(obj, et){    // et 定时器
        if(impact(obj, ft) && is_lock==0){    // 产生碰撞
            if(is_protect==0){
                destroy(ft);
                clearInterval(et);
                ft.parentNode.removeChild(obj);
            }
        }
    }


    // 全部通关
    gameclear = function(){
        is_over = 1;
        disp('gameclear', 'show');
        setHtml('clearcon', 'Game Clear' + '<br>' + 'SCORE : ' + score);
        bgsound('clear', false);
        bgchange('clear');
        setTimeout(function(){
            bgsound();
            init();
        }, 16000);
    }


    // 游戏结束
    gameover = function(){
        is_over = 1;
        disp('gameover', 'show');
        setHtml('overcon', 'LEVEL : ' + level + '<br>' + 'SCORE : ' + score);
        bgsound('over', false);
        bgchange('over');
        failtimes++;
        setTimeout(function(){
            if(failtimes==3){
                alert('在游戏开始画面依次输入 ↑ ↑ ↓ ↓ ← → ← → a s a s，再开始游戏，会有惊喜^_^');
            }
            bgsound();
            init();
        }, 8000);
    }


    // 显示讯息
    msg_show = function(){
        setHtml('level', 'LEVEL - ' + level);
        disp('level', 'show');
        is_lock = 1;
    }


    // 隐藏讯息
    msg_hide = function(){
        disp('level', 'hide');
    }


    // 重置
    reset = function(){
        is_start = 0;
        is_bombing = 0;
        is_lock = 1;
        is_over = 0;
        is_clear = 0;
        is_protect = 0;
        level = 1;
        power = 1;
        ackey = {};
        keypriority = {};
        enemydata = [];
        score = 0;
        fighternum = 3;
        bombnum = 3;

        setHtml('hiscore', hiscore);
        setHtml('score', score);
        setHtml('fighternum', fighternum);
        setHtml('bombnum', bombnum);

        reset_fighter();
        reset_pile();

        disp('op', 'show');
        disp('gameover', 'hide');
        disp('gameclear', 'hide');

        bgchange(0);
    }


    // 重置战机位置
    reset_fighter = function(){
        setPosition(ft, 'top', 640);
        setPosition(ft, 'left', 175);
        setClass(ft, 'fighter');
    }


    // 重置蓄力
    reset_pile = function(){
        is_pile = 0;
        pilenum = 0;
        if(is_protect==1){
            setClass(ft, 'fighter_p');
        }else{
            setClass(ft, 'fighter');
        }
    }


    // 战机初始化
    fighter_init = function(){
        var et = setInterval(function(){
            if(getPosition(ft, 'top')>400){
                setPosition(ft, 'top', getPosition(ft, 'top')-12);
            }else{
                clearInterval(et);
                is_lock = 0;
                action();
            }
        }, 30);
    }


    // 密技30命
    cheat = function(){
        if(cheatcode.join(',')=='38,38,40,40,37,39,37,39,65,83,65,83,13'){
            fighternum = 30;
            setHtml('fighternum', fighternum);
        }
        cheatcode = [];
    }


    // 背景控制
    bgmove = function(obj){
        var step = 1;
        var et = setInterval(function(){
            var bgpos = getBgPosition(obj);
            if(bgpos['top']==640){
                setBgPosition(obj, 0, 0);    // reset
            }else{
                setBgPosition(obj, bgpos['left'], bgpos['top']+step);
            }
        }, 50);
    }


    // 背景切换
    bgchange = function(file){
        var obj = $('gameplane');
        setClass(obj, 'gameplane bg'+file);
    }


    // 音乐控制
    bgsound = function(file, loop){
        var id = 'audioplayer';
        
        if(typeof(file)!='undefined'){
            if(typeof(loop)=='undefined'){
                loop = false;
            }

            var audiofile = [];
            audiofile['mp3'] = 'music/' + file + '.mp3';
            audiofile['ogg'] = 'music/' + file + '.ogg';
            audioplayer(id, audiofile , loop);
        }else{
            audioplayer(id);
        }
    }

    return this;

})();