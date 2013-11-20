/** 
*	Author:	fdipzone
*	Date:	
*	Ver:	1.0
*/


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