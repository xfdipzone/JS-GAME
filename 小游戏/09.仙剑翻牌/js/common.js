/** common function */

// get document.getElementBy(id)
function $(id) {
    return document.getElementById(id);
}


// get document.getElementsByTagName
function $_tag(name, id) {
    if (typeof(id) != 'undefined') {
        return $(id).getElementsByTagName(name);
    } else {
        return document.getElementsByTagName(name);
    }
}


// set class
function setClass(obj, classname){
    if(typeof(obj)!='undefined'){
        obj.className = classname;
    }else{
        obj.className = '';
    }
}


// get class
function getClass(obj){
    var classname = '';
    if(typeof(obj)!='undefined'){
        classname = obj.className;
    }
    return classname;
}


// set html
function setHtml(id, val){
    var obj = document.getElementById(id);
    obj.innerHTML = val;
}


// get html
function getHtml(id){
    var obj = document.getElementById(id);
    return obj.innerHTML;
}


/* div show and hide
 * @param id dom id
 * @param handle show or hide
 * @param classname
 */
function disp(id, handle, classname) {
    if (handle == 'show') {
        $(id).style.display = 'block';
    } else {
        $(id).style.display = 'none';
    }
    if (typeof(classname) != 'undefined') {
        $(id).className = classname;
    }
}


/* img preload
 * @param img        要加载的图片数组
 * @param callback   图片加载成功后回调方法
 */
function img_preload(img, callback) {
    var onload_img = 0;
    var tmp_img = [];
    for (var i = 0, imgnum = img.length; i < imgnum; i++) {
        tmp_img[i] = new Image();
        tmp_img[i].src = img[i];
        if (tmp_img[i].complete) {
            onload_img++;
        } else {
            tmp_img[i].onload = function() {
                onload_img++;
            }
        }
    }
    var et = setInterval(
        function() {
            if (onload_img == img.length) { // 定时器,判断图片完全加载后调用callback
                clearInterval(et);
                callback();
            }
        }, 200);
}


/* 判断元素是否存在指定数组
 * @param str    要判断的元素
 * @param arr    检测的数组
 */
function in_array(str, arr) {
    for (var i = 0, max = arr.length; i < max; i++) {
        if (str == arr[i]) {
            return true;
        }
    }
    return false;
}


/** 将数组内元素打乱 */
function shuffle(arr){
    var tmparr = [];
    var num = arr.length;
    for(var i=0; i<num; i++){
        tmparr.push(arr.splice(Math.random()*arr.length,1).pop());
    }
    return tmparr;
}


/** 设置对象位置
 * @param obj    对象
 * @param type   类型
 * @param val    数值
 */
function setPosition(obj, type, val) {
    switch (type) {
    case 'top':
        obj.style.top = val + 'px';
        break;
    case 'left':
        obj.style.left = val + 'px';
        break;
    }
}


/** 获取对象位置
 * @param obj    对象
 * @param type   类型
 */
function getPosition(obj, type) {
    var val = 0;
    switch (type) {
    case 'top':
        val = obj.style.top;
        break;
    case 'left':
        val = obj.style.left;
        break;
    }
    return parseInt(val);
}


/** 设置透明度
 * @param obj    对象
 * @param val    数值
 */
function setOpacity(obj, val) {
    obj.style.filter = "alpha(opacity=" + val + ")";
    obj.style.opacity = parseFloat(val / 100);
}


/** 获取对象属性
 * @param obj        对象
 * @param attribute  属性
 * @param covert     是否转为数字,默认0
 */
function getDefaultStyle(obj, attribute, covert) {
    var attribute = obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
    if(covert==1){
        attribute = parseInt(attribute);
    }
    return attribute;
}


/** 音乐播放器
* @param obj     播放器id
* @param file    音频文件 mp3: ogg:
* @param loop    是否循环
*/
function audioplayer(id, file, loop){
    var audioplayer = document.getElementById(id);
    if(audioplayer!=null){
        document.body.removeChild(audioplayer);
    }

    if(typeof(file)!='undefined'){
        if(navigator.userAgent.indexOf("MSIE")>0){    // IE
    
            var player = document.createElement('bgsound');
            player.id = id;
            player.src = file['mp3'];
            player.setAttribute('autostart', 'true');
            if(loop){
                player.setAttribute('loop', 'infinite');
            }
            document.body.appendChild(player);

        }else{    // Other FF Chome Safari Opera

            var player = document.createElement('audio');
            player.id = id;
            player.setAttribute('autoplay','autoplay');
            if(loop){
                player.setAttribute('loop','loop');
            }
            document.body.appendChild(player);

            var mp3 = document.createElement('source');
            mp3.src = file['mp3'];
            mp3.type= 'audio/mpeg';
            player.appendChild(mp3);

            var ogg = document.createElement('source');
            ogg.src = file['ogg'];
            ogg.type= 'audio/ogg';
            player.appendChild(ogg);

        }
    }
}