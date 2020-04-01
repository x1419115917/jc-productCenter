/**
 * 修订于2014-06-13
 */
//JC公用组件
var JCPublicUtil = {
    //提示框类型
    alertType: {
        warnType: 0,
        okType: 1
    },

  //alert提示框
    alertWindow: function (alertType, title, msg, okBtnText, okFunction) {
        var randowSuffix = JCPublicUtil.DateFormat(new Date(), "YYYYMMddhhmmss");
        var dialogId = "dialogWindow_" + randowSuffix;
        var dialogOverlayId = "dialogOverlay_" + randowSuffix;

        var stringBuilder = this.StringBuilder();
        switch (alertType) {
            case this.alertType.okType:
                stringBuilder.Append('<div class="dialogWindow" id="' + dialogId + '"  style="display:none;">');
                break;
            case this.alertType.warnType:
                stringBuilder.Append('<div class="dialogWindow warnDialog" id="' + dialogId + '"  style="display:none;">');
                break;
        }

        stringBuilder.Append('<div class="dialogHeader">');
        stringBuilder.Append('    <span class="dialogTitle">' + title + '</span>');
        stringBuilder.Append('    <a href="javascript:void(0);" class="dialogClose"></a>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialogBody">');
        stringBuilder.Append('    <table cellspacing="0px" border="0px" cellpadding="0px">');
        stringBuilder.Append('        <tr>');
        stringBuilder.Append('            <td><span class="dialogIcon"></span></td>');
        stringBuilder.Append('            <td>');
        stringBuilder.Append('                <span class="dialogMsg">' + msg + '</span>');
        stringBuilder.Append('            </td>');
        stringBuilder.Append('        </tr>');
        stringBuilder.Append('    </table>');
        stringBuilder.Append('    <div class="dialogFooter">');
        stringBuilder.Append('    <input type="button" class="dialogOK newOk_Btn" value="' + okBtnText + '" />');
        stringBuilder.Append('   </div>');
        stringBuilder.Append('    <div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div style="clear:both;"></div>');
        stringBuilder.Append('</div>');

        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
        }
        $("body").append(stringBuilder.ToString());
        var zIndex = 999;
        //设置层次关系
        var currentCount = $(".dialogWindow").length + 1;
        zIndex += currentCount;

        $("html").css("overflow", "hidden");
        var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
        var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();  
        $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
        var overlayTop=$(document).scrollTop();
        var overlayLeft=$(document).scrollLeft();
        $("#" + dialogOverlayId).css({
        	'left': overlayLeft+"px", 'top': overlayTop+"px",
            'width': $(window).width()+"px",
            'height': $(window).height()+"px",
            'z-index': zIndex,
            'position': 'absolute'
        })

        $("#" + dialogId + " .dialogClose").click(function (e) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
            if($(".dialogWindow").length==0){
            	$("html").css("overflow", "");
                $(window).unbind("resize.dialogwindow");
            }
            e.stopPropagation();
        })
        $("#" + dialogId + " .dialogOK").click(function (e) {
            if (okFunction != null && okFunction != undefined) {
                okFunction();
            }
            if ($("#" + dialogId).length > 0) {
                $("#" + dialogId + " .dialogClose").click();
            }
            e.stopPropagation();
        });
        
        //阻止冒泡
        $("#" + dialogId).click(function (e) {
            e.stopPropagation();
        });
        
        $(window).bind("resize.dialogwindow", function () {
            var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
            var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
            $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
            var overlayTop=$(document).scrollTop();
            var overlayLeft=$(document).scrollLeft();
            $("#" + dialogOverlayId).css({
            	'left': overlayLeft+"px", 'top': overlayTop+"px",
                'width': $(window).width()+"px",
                'height':$(window).height()+"px"
            })
        })
        $("#" + dialogOverlayId).show();
        $("#" + dialogId).show();
    },


    /*内容可以自定义的弹出框  返回框对象
     *title 标题
     *content 弹出框中的内容
     *okBtnText  确定按钮的文字     为空时则不显示该按钮
     *okFunction 确定按钮的事件    无事件就为null
     *cancelBtnText 取消按钮的文字      为空时则不显示该按钮
     *cancelFunc  取消按钮的事件      无事件就为null
     */
    okBtnOnClick:false,
    dialogWindow: function (title, content, okBtnText, okFunction, cancelBtnText, cancelFunc, closeBtnFunc) {
    	JCPublicUtil.okBtnOnClick=false;
        var randowSuffix = JCPublicUtil.DateFormat(new Date(), "YYYYMMddhhmmss");
        var dialogId = "dialogWindow_" + randowSuffix;
        var dialogOverlayId = "dialogOverlay_" + randowSuffix;

        var stringBuilder = this.StringBuilder();
        stringBuilder.Append('<div class="dialogWindow" id="' + dialogId + '" style="display:none;">');
        stringBuilder.Append('<div class="dialogHeader">');
        stringBuilder.Append('    <span class="dialogTitle">' + title + '</span>');
        stringBuilder.Append('    <a href="javascript:void(0);" class="dialogClose"></a>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialogBody">');
        stringBuilder.Append('    <div class="max-content" style="max-height:350px;overflow-x:hidden; overflow-y:auto;">');
        stringBuilder.Append(content);
        stringBuilder.Append('    </div>');
        stringBuilder.Append('    <div class="dialogFooter">');
        if(okBtnText instanceof Array){
        	for(var i=0;i<okBtnText.length;i++){
        	if(okBtnText[i] != ""){
        		stringBuilder.Append('<input type="button" class="dialogOK newOk_Btn" value="' + okBtnText[i] + '" />');
        		}
        	}
        }else if (okBtnText != ""){
        	stringBuilder.Append('<input type="button" class="dialogOK newOk_Btn" value="' + okBtnText + '" />');
        }
        if (cancelBtnText != "") {
            stringBuilder.Append('<input type="button" class="dialogCancel newCancel_Btn" value="' + cancelBtnText + '" />');
        }
        stringBuilder.Append('   </div>');
        stringBuilder.Append('    <div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialog-overlay"  id="' + dialogOverlayId + '"><iframe frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe></div>');
        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
        }
        $("body").append(stringBuilder.ToString());
        var zIndex = 999;
        //设置层次关系
        var currentCount = $(".dialogWindow").length + 1;
        zIndex += currentCount;
        $("html").css("overflow", "hidden");
        var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
        var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
        $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });

        var overlayTop=$(document).scrollTop();
        var overlayLeft=$(document).scrollLeft();
        $("#" + dialogOverlayId).css({
        	'left': overlayLeft+"px", 'top': overlayTop+"px",
            'width': $(window).width()+"px",
            'height': $(window).height()+"px",
            'z-index': zIndex,
            'position': 'absolute'
        })
        $("#" + dialogId + " .dialogClose").click(function (e) {
        	//在ie9下，包含flash的div无法remove掉的处理方法
        	try{
        		if (closeBtnFunc != null && closeBtnFunc != undefined && JCPublicUtil.okBtnOnClick == false) {
        			closeBtnFunc();
        		}
        		$("#" + dialogId).get(0).innerHTML="";
        	}catch(e){}
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
            if($(".dialogWindow").length==0){
            	$("html").css("overflow", "");
                $(window).unbind("resize.dialogwindow");
            }
            e.stopPropagation();
        })
        if(okFunction instanceof Array){
        	$("#" + dialogId + " .dialogOK").each(function(index){
            	$(this).click(function (e) {
            		JCPublicUtil.okBtnOnClick = true;
                   if (okFunction[index] != null && okFunction[index] != undefined) {
                        if(okFunction[index]($("#" + dialogId))==false){
                        	return;
                        }
                    }
                   if ($("#" + dialogId).length > 0) {
                        $("#" + dialogId + " .dialogClose").click();
                    }
                    e.stopPropagation();
                });
            });
        }else{
        	$("#" + dialogId + " .dialogOK").click(function (e) {
        		JCPublicUtil.okBtnOnClick = true;
            	if (okFunction != null && okFunction != undefined) {
            		if(okFunction($("#" + dialogId))==false){
                    	return;
                    }
                }
                if ($("#" + dialogId).length > 0) {
                    $("#" + dialogId + " .dialogClose").click();
                }
                e.stopPropagation();
            });
        }
        $("#" + dialogId + " .dialogCancel").click(function (e) {   
            if (cancelFunc != null && cancelFunc != undefined) {
                cancelFunc();
            }
            $("#" + dialogId + " .dialogClose").click();
            e.stopPropagation();
        });
        
        //阻止冒泡
        $("#" + dialogId).click(function (e) {
            e.stopPropagation();
        });
        
        $(window).bind("resize.dialogwindow", function () {
            var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
            var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
            $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
            var overlayTop=$(document).scrollTop();
            var overlayLeft=$(document).scrollLeft();
            $("#" + dialogOverlayId).css({
            	'left': overlayLeft+"px", 'top': overlayTop+"px",
            	'width': $(window).width()+"px",
                'height':$(window).height()+"px"
            })
        });
        //拖动
        var mouse={x:0,y:0};
		$("#" + dialogId + " .dialogHeader").mousedown(function (event) {
		            var e = window.event || event;
		            var offset = $("#" + dialogId).offset();
		            mouse.x = e.clientX - offset.left;
		            mouse.y = e.clientY - offset.top;
		            $(document).bind('mousemove', moveDialog).bind("mouseup",function(){
		            	$(document).unbind('mousemove', moveDialog);
		            	$(document).unbind('mouseup');
		            	if(window.releaseEvents){     
				               window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
				        }
				        else if($("#" + dialogId + " .dialogHeader")[0].releaseCapture){
				        	$("#" + dialogId + " .dialogHeader")[0].releaseCapture();  
				        } 
		            });
		            if(window.captureEvents){     
		               window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
		            }
		            else if($("#" + dialogId + " .dialogHeader")[0].setCapture){
		            	$("#" + dialogId + " .dialogHeader")[0].setCapture();  
		            } 
		        });
		function moveDialog(event) {
            var e = window.event || event;
            var top = e.clientY - mouse.y-$(document).scrollTop();
            var left = e.clientX - mouse.x-$(document).scrollLeft();
            
            if(top+$("#" + dialogId).height()<=$(window).height()){
            	if(top<=0){
            		top=$(document).scrollTop();
            	}else{
            		top=top+$(document).scrollTop();
            	}
            	
            }else if(top+$("#" + dialogId).height()>$(window).height()){
            	top=$(window).height()-$("#" + dialogId).height()+$(document).scrollTop();
            }
            
            if(left+$("#" + dialogId).width()<=$(window).width()){
            	if(left<=0){
            		left=$(document).scrollLeft();
            	}else{
            		left=left+$(document).scrollLeft();
            	}
            }else if(left+$("#" + dialogId).height()>$(window).height()){
            	left=$(window).width()-$("#" + dialogId).width()+$(document).scrollLeft();
            }
            $("#" + dialogId).css({"top": top+"px", "left": left+"px"});
        };
        $("#" + dialogId).show();
        //渲染
        JCUI.dropDownList($("#" + dialogId));
        return $("#" + dialogId);
    },
    dialogWindow2: function (title, content, okBtnText, okFunction, cancelBtnText, cancelFunc) {
    	JCPublicUtil.okBtnOnClick=false;
        var randowSuffix = JCPublicUtil.DateFormat(new Date(), "YYYYMMddhhmmss");
        var dialogId = "dialogWindow_" + randowSuffix;
        var dialogOverlayId = "dialogOverlay_" + randowSuffix;

        var stringBuilder = this.StringBuilder();
        stringBuilder.Append('<div class="dialogWindow" id="' + dialogId + '" style="display:none;">');
//        stringBuilder.Append('<div class="dialogHeader">');
//        stringBuilder.Append('    <span class="dialogTitle">' + title + '</span>');
//        stringBuilder.Append('    <a href="javascript:void(0);" class="dialogClose"></a>');
//        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialogBody">');
        stringBuilder.Append('    <div class="max-content" style="max-height:350px;overflow-x:hidden; overflow-y:auto;">');
        stringBuilder.Append(content);
        stringBuilder.Append('    </div>');
        stringBuilder.Append('    <div class="dialogFooter">');
        if(okBtnText instanceof Array){
        	for(var i=0;i<okBtnText.length;i++){
        	if(okBtnText[i] != ""){
        		stringBuilder.Append('<input type="button" class="dialogOK newOk_Btn" value="' + okBtnText[i] + '" />');
        		}
        	}
        }else if (okBtnText != ""){
        	stringBuilder.Append('<input type="button" class="dialogOK newOk_Btn" value="' + okBtnText + '" />');
        }
        if (cancelBtnText != "") {
            stringBuilder.Append('<input type="button" class="dialogCancel newCancel_Btn" value="' + cancelBtnText + '" />');
        }
        stringBuilder.Append('   </div>');
        stringBuilder.Append('    <div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialog-overlay"  id="' + dialogOverlayId + '"><iframe frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe></div>');
        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
        }
        $("body").append(stringBuilder.ToString());
        var zIndex = 999;
        //设置层次关系
        var currentCount = $(".dialogWindow").length + 1;
        zIndex += currentCount;
        $("html").css("overflow", "hidden");
        var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
        var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
        $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });

        var overlayTop=$(document).scrollTop();
        var overlayLeft=$(document).scrollLeft();
        $("#" + dialogOverlayId).css({
        	'left': overlayLeft+"px", 'top': overlayTop+"px",
            'width': $(window).width()+"px",
            'height': $(window).height()+"px",
            'z-index': zIndex,
            'position': 'absolute'
        })
        if(okFunction instanceof Array){
        	$("#" + dialogId + " .dialogOK").each(function(index){
            	$(this).click(function (e) {
            		JCPublicUtil.okBtnOnClick = true;
                   if (okFunction[index] != null && okFunction[index] != undefined) {
                        if(okFunction[index]($("#" + dialogId))==false){
                        	return;
                        }
                    }
                   if ($("#" + dialogId).length > 0) {
                        $("#" + dialogId + " .dialogClose").click();
                    }
                    e.stopPropagation();
                });
            });
        }else{
        	$("#" + dialogId + " .dialogOK").click(function (e) {
        		JCPublicUtil.okBtnOnClick = true;
            	if (okFunction != null && okFunction != undefined) {
            		if(okFunction($("#" + dialogId))==false){
                    	return;
                    }
                }
                if ($("#" + dialogId).length > 0) {
                    $("#" + dialogId + " .dialogClose").click();
                }
                e.stopPropagation();
            });
        }
        $("#" + dialogId + " .dialogCancel").click(function (e) {   
            if (cancelFunc != null && cancelFunc != undefined) {
                cancelFunc();
            }
            $("#" + dialogId + " .dialogClose").click();
            e.stopPropagation();
        });
        
        //阻止冒泡
        $("#" + dialogId).click(function (e) {
            e.stopPropagation();
        });
        
        $(window).bind("resize.dialogwindow", function () {
            var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
            var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
            $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
            var overlayTop=$(document).scrollTop();
            var overlayLeft=$(document).scrollLeft();
            $("#" + dialogOverlayId).css({
            	'left': overlayLeft+"px", 'top': overlayTop+"px",
            	'width': $(window).width()+"px",
                'height':$(window).height()+"px"
            })
        });
        //拖动
        var mouse={x:0,y:0};
		$("#" + dialogId + " .dialogHeader").mousedown(function (event) {
		            var e = window.event || event;
		            var offset = $("#" + dialogId).offset();
		            mouse.x = e.clientX - offset.left;
		            mouse.y = e.clientY - offset.top;
		            $(document).bind('mousemove', moveDialog).bind("mouseup",function(){
		            	$(document).unbind('mousemove', moveDialog);
		            	$(document).unbind('mouseup');
		            	if(window.releaseEvents){     
				               window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
				        }
				        else if($("#" + dialogId + " .dialogHeader")[0].releaseCapture){
				        	$("#" + dialogId + " .dialogHeader")[0].releaseCapture();  
				        } 
		            });
		            if(window.captureEvents){     
		               window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
		            }
		            else if($("#" + dialogId + " .dialogHeader")[0].setCapture){
		            	$("#" + dialogId + " .dialogHeader")[0].setCapture();  
		            } 
		        });
		function moveDialog(event) {
            var e = window.event || event;
            var top = e.clientY - mouse.y-$(document).scrollTop();
            var left = e.clientX - mouse.x-$(document).scrollLeft();
            
            if(top+$("#" + dialogId).height()<=$(window).height()){
            	if(top<=0){
            		top=$(document).scrollTop();
            	}else{
            		top=top+$(document).scrollTop();
            	}
            	
            }else if(top+$("#" + dialogId).height()>$(window).height()){
            	top=$(window).height()-$("#" + dialogId).height()+$(document).scrollTop();
            }
            
            if(left+$("#" + dialogId).width()<=$(window).width()){
            	if(left<=0){
            		left=$(document).scrollLeft();
            	}else{
            		left=left+$(document).scrollLeft();
            	}
            }else if(left+$("#" + dialogId).height()>$(window).height()){
            	left=$(window).width()-$("#" + dialogId).width()+$(document).scrollLeft();
            }
            $("#" + dialogId).css({"top": top+"px", "left": left+"px"});
        };
        $("#" + dialogId).show();
        //渲染
        JCUI.dropDownList($("#" + dialogId));
        return $("#" + dialogId);
    },
    //确定提示框
    confirmWindow: function (alertType, title, msg, okBtnText, okFunction, cancelBtnText, cancelFunc) {
        var randowSuffix = JCPublicUtil.DateFormat(new Date(), "YYYYMMddhhmmss");
        var dialogId = "dialogWindow_" + randowSuffix;
        var dialogOverlayId = "dialogOverlay_" + randowSuffix;

        var stringBuilder = this.StringBuilder();
        switch (alertType) {
            case this.alertType.okType:
                stringBuilder.Append('<div class="dialogWindow" id="' + dialogId + '" style="display:none;">');
                break;
            case this.alertType.warnType:
                stringBuilder.Append('<div class="dialogWindow warnDialog" id="' + dialogId + '"  style="display:none;">');
                break;
        }

        stringBuilder.Append('<div class="dialogHeader">');
        stringBuilder.Append('    <span class="dialogTitle">' + title + '</span>');
        stringBuilder.Append('    <a href="javascript:void(0);" class="dialogClose"></a>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialogBody">');
        stringBuilder.Append('    <table cellspacing="0px" border="0px" cellpadding="0px">');
        stringBuilder.Append('        <tr>');
        stringBuilder.Append('            <td><span class="dialogIcon"></span></td>');
        stringBuilder.Append('            <td>');
        stringBuilder.Append('                <span class="dialogMsg">' + msg + '</span>');
        stringBuilder.Append('            </td>');
        stringBuilder.Append('        </tr>');
        stringBuilder.Append('    </table>');
        stringBuilder.Append('    <div class="dialogFooter">');
        stringBuilder.Append('    <input type="button" class="dialogOK newOk_Btn" value="' + okBtnText + '" />');
        stringBuilder.Append('    <input type="button" class="dialogCancel newCancel_Btn" value="' + cancelBtnText + '" />');
        stringBuilder.Append('   </div>');
        stringBuilder.Append('    <div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div style="clear:both;"></div>');
        stringBuilder.Append('</div>');
        stringBuilder.Append('<div class="dialog-overlay"  id="' + dialogOverlayId + '"   style="display:block;"><iframe frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0); opacity:0;"></iframe></div>');
        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
        }
        $("body").append(stringBuilder.ToString());
        var zIndex = 999;
        //设置层次关系
        var currentCount = $(".dialogWindow").length + 1;
        zIndex += currentCount;

        $("html").css("overflow", "hidden");
        var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
        var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
        $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
        var overlayTop=$(document).scrollTop();
        var overlayLeft=$(document).scrollLeft();
        $("#" + dialogOverlayId).css({
        	'left': overlayLeft+"px", 'top': overlayTop+"px",
            'width': $(window).width()+"px",
            'height': $(window).height()+"px",
            'z-index': zIndex,
            'position': 'absolute'
        })

        $("#" + dialogId + " .dialogClose").click(function (e) {
            $("#" + dialogId).remove();
            $("#" + dialogOverlayId).remove();
            if($(".dialogWindow").length==0){
            	$("html").css("overflow", "");
                $(window).unbind("resize.dialogwindow");
            }
            e.stopPropagation();
        })
        $("#" + dialogId + " .dialogOK").click(function (e) {
        	if (okFunction != null && okFunction != undefined) {
        		if(okFunction($("#" + dialogId))==false){
                	return;
                }
            }
            if ($("#" + dialogId).length > 0) {
                $("#" + dialogId + " .dialogClose").click();
            }
            e.stopPropagation();
        });
        $("#" + dialogId + " .dialogCancel").click(function (e) {
            $("#" + dialogId + " .dialogClose").click();
            if (cancelFunc != null && cancelFunc != undefined) {
                cancelFunc();
            }
            e.stopPropagation();
        });
        
        //阻止冒泡
        $("#" + dialogId).click(function (e) {
            e.stopPropagation();
        });
        
        $(window).bind("resize.dialogwindow", function () {
            var top = ($(window).height() - $("#" + dialogId).height()) / 2 + $(document).scrollTop();
            var left = ($(window).width() - $("#" + dialogId).width()) / 2 + $(document).scrollLeft();
            $("#" + dialogId).css({ "z-index": zIndex + 1, "top": top+"px", "left": left+"px" });
            var overlayTop=$(document).scrollTop();
            var overlayLeft=$(document).scrollLeft();
            $("#" + dialogOverlayId).css({
                'left': overlayLeft+"px", 'top': overlayTop+"px",
            	'width': $(window).width()+"px",
                'height':$(window).height()+"px"
            })
        })
        $("#" + dialogOverlayId).show();
        $("#" + dialogId).show();
    },
    //字符串对象
    StringBuilder: function () {
        //实体对象
        var StringBuilderObj = function (args) {
            this._buffers = [];
            this._length = 0;
            this._splitChar = args.length > 0 ? args[args.length - 1] : '';
            if (args.length > 0) {
                for (var i = 0, iLen = args.length - 1; i < iLen; i++) {
                    this.Append(args[i]);
                }
            }
        }

        //append方法
        StringBuilderObj.prototype.Append = function (str) {
            this._length += str.length;
            this._buffers[this._buffers.length] = str;
        }

        //向对象中添加字符串
        //参数：一个字符串值
        StringBuilderObj.prototype.Add = StringBuilderObj.prototype.append;

        //向对象附加格式化的字符串
        //参数：参数一是预格式化的字符串，如：'{0} {1} {2}'
        //格式参数可以是数组，或对应长度的arguments,
        StringBuilderObj.prototype.AppendFormat = function () {
            if (arguments.length > 1) {
                var TString = arguments[0];
                if (arguments[1] instanceof Array) {
                    for (var i = 0, iLen = arguments[1].length; i < iLen; i++) {
                        var jIndex = i;
                        var re = eval("/\\{" + jIndex + "\\}/g;");
                        TString = TString.replace(re, arguments[1][i]);
                    }
                }
                else {
                    for (var i = 1, iLen = arguments.length; i < iLen; i++) {
                        var jIndex = i - 1;
                        var re = eval("/\\{" + jIndex + "\\}/g;");
                        TString = TString.replace(re, arguments[i]);
                    }
                }
                this.Append(TString);
            }
            else if (arguments.length == 1) {
                this.Append(arguments[0]);
            }
        }

        //字符串长度（相当于ToString()后输出的字符串长度
        StringBuilderObj.prototype.Length = function () {
            if (this._splitChar.length > 0 && (!this.IsEmpty())) {
                return this._length + (this._splitChar.length * (this._buffers.length - 1));
            }
            else {
                return this._length;
            }
        }

        //字符串是否为空
        StringBuilderObj.prototype.IsEmpty = function () {
            return this._buffers.length <= 0;
        }

        //清空
        StringBuilderObj.prototype.Clear = function () {
            this._buffers = [];
            this._length = 0;
        }

        //输出
        //参数：可以指定一个字符串（或单个字符），作为字符串拼接的分隔符
        StringBuilderObj.prototype.ToString = function () {
            if (arguments.length == 1) {
                return this._buffers.join(arguments[1]);
            }
            else {
                return this._buffers.join(this._splitChar);
            }
        }

        return new StringBuilderObj(arguments);
    },

    //时间格式转换
    DateFormat: function (dateObj, format) {
        try {
            /*
             * eg:format="YYYY-MM-dd hh:mm:ss";
             */
            var o = {
                "Y+": dateObj.getFullYear(),
                "M+": dateObj.getMonth() + 1,  //month
                "d+": dateObj.getDate(),     //day
                "h+": dateObj.getHours(),    //hour
                "m+": dateObj.getMinutes(),  //minute
                "s+": dateObj.getSeconds(), //second
                "q+": Math.floor((dateObj.getMonth() + 3) / 3),  //quarter
                "S": dateObj.getMilliseconds() //millisecond
            }

            if (/(Y+)/.test(format)) {
                format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        } catch (e) {
            return "";
        }
    },

    //初始化几个模块的事件绑定。
    initModuleFunc: function () {
        $(function () {
            //绑定高级搜索的事件
            if ($("#SearchDiv").length > 0) {
                $("#SearchDiv").click(function (e) { e.stopPropagation(); });

                //高级搜索按钮的事件
                $("#topDivBtn").click(function (e) {
                    if ($("#topDiv").hasClass("TopSearchSelected")) {
                        $("#topDiv").removeClass().addClass("TopSearch");
                        $("#SearchDiv").hide();
                    }
                    else {
                        $("#topDiv").removeClass().addClass("TopSearchSelected");
                        $("#SearchDiv").show();
                    }
                    $(document).bind("click", function () {
                        if ($("#topDiv").hasClass("TopSearchSelected")) {
                            $("#topDiv").removeClass().addClass("TopSearch");
                            $("#SearchDiv").hide();
                        }
                        $(document).unbind("click");
                    })
                    e.stopPropagation();
                });

                //取消高级搜索
                $("#cancelBtn").click(function () { $("#topDivBtn").click(); });
            }


            //绑定列表行的颜色和鼠标移动上去的事件----------------------------------------
            if ($(".cyListContent").length > 0) {
                $(".ListItem").hover(function () { $(this).addClass("selectUL") }, function () { $(this).removeClass("selectUL"); })
                //给列表行的奇数行添加背景颜色
                $(".cyListContent>ul>li:odd").css("background", "#f2f2f2");
            }


            //全选----------------------------------------------
            var cbList = document.getElementsByName("cb");
            var all = document.getElementById("checkAll");
            if (all != null) {
                all.onclick = function () {
                    for (var i = 0; i < cbList.length; i++) {
                        cbList[i].checked = all.checked;
                    }
                };
            }

            //导航选择------------------------------------------------------
            if ($(".daohang").length > 0) {
                $(".daohang>ul>li").click(function () {
                    $(this).parent().find("li").removeClass();
                    $(this).addClass("selectedLi");
                });
            }

            //流程定制-------------------------------------------------------
            $(".listContent").each(function(){
            	$(this).find("table tr.listtr:even").addClass("evenTr");
            	$(this).find("table tr.listtr:odd").addClass("oddTr");
            	$(this).find("table tr.listtr").mouseover(function () {
                    $(this).addClass("selectedTR");
                }).mouseout(function () {
                    $(this).removeClass("selectedTR");
                });
            })
        });
    },

    /*某个字符串中是否包含另一个字符串或者包含另一个字符串以特殊字符分割的字符串，注意英文为英文单词
     * mainStr 为主字符串
     * strContained 被包含的字符串
     * splitMark 被包含字符串的分隔符，如果没有分隔符可以为空字符串
     * 返回实体对象{"isContain":true,"msg":""},true为都包含否则不全部包含或者全部不包含
     * */
    containsStr:function(mainStr,strContained,splitMark){
    	var isContain=true;
    	var msg="";
    	var strArray=new Array();
    	if(strContained==""){
    		return {"isContain":false,"msg":"0"};
    	}
    	if(splitMark!=""){
    		strArray=strContained.split(splitMark);
    	}else{
    		strArray.push(strContained);
    	}
    	
    	for(var i=0;i<strArray.length;i++){
    		//中文
    		if(/[\u4e00-\u9fa5]+/g.test(strArray[i])){
    			if(mainStr.indexOf(strArray[i])==-1){
    				isContain=false;
    				msg+=strArray[i]+"\r\n";
    			}
    		}else{
    			//英文单词
    			var regex=new RegExp("\\b"+strArray[i]+"\\b","g");
    			if(!regex.test(mainStr)){
    				isContain=false;
    				msg+=strArray[i]+"\r\n";
    			}
    		}
    	}
    	
    	return {"isContain":isContain,"msg":msg};
    },
    
    //流程表单模板实体类
    FlowFormTemplate: {
        prefixStr: "flowPropMap['",
        suffixStr: "']",
        fiexNum: 2,
        initFunc: function () {
            //绑定新增列表事件
            $(".addTableRow").not("[disabled]").click(function () {
                JCPublicUtil.FlowFormTemplate._addRow($(this));
            });

            //删除列表
            $(".delTableRow").not("[disabled]").click(function (e) {
                JCPublicUtil.FlowFormTemplate._delRow($(this)[0]);
                e.stopPropagation();
                return false;
            });

            //绑定输入框事件
            $("input[data-calculate-to-variable]").keyup(function () {
                JCPublicUtil.FlowFormTemplate.calculateOperate($(this)[0]);
            });


            //样式绑定
            $(".dynamic-form-table-body,.dynamic-form-table-body table").css({ "border-collapse": "collapse", "border": "solid 1px #cccccc" }).attr({ "cellpadding": "0", "cellspacing": "0" });
            $(".dynamic-form-table-body  td,.dynamic-form-table-body  th").css({ "border": "solid 1px #cccccc" });
            $(".delTableRow").html('<img src="' + JCPublicUtil.Location.getRootPath() + '/images/funcation_ico/delete.png" style="border:0px;"/>');
            $(".addTableRow").html('<img src="' + JCPublicUtil.Location.getRootPath() + '/images/funcation_ico/add.gif" style="border:0px;"/>');
            $("table[tableType='JCTABLE']").find("thead tr").css({ "background-color": "#cccccc" });


            //控制列表的新增和删除按钮是否显示
            $("table[tableType='JCTABLE']").each(function () {
                var isShowAddBtn = $(this).attr("data-showAddBtn") != undefined && $(this).attr("data-showAddBtn") == "true" ? true : false;
                var isShowDelBtn = $(this).attr("data-showDelBtn") != undefined && $(this).attr("data-showDelBtn") == "true" ? true : false;
                var AddBtns = $(this).find(".addTableRow");
                var DelBtns = $(this).find(".delTableRow");
                if (!isShowAddBtn) {
                    AddBtns.hide();
                }
                if (!isShowDelBtn) {
                    DelBtns.hide();
                }

                if (isShowAddBtn && isShowDelBtn) {
                    $(this).find("tr").each(function () {
                        $(this).find("td:last").hide();
                        $(this).find("th:last").hide();
                    })
                }
                //        		var disableAddBtns=$(this).find(".addTableRow:disabled");
                //        		var disableDelBtns=$(this).find(".delTableRow:disabled");
                //        		//存在没作用的新增按钮
                //        		if(disableAddBtns.length>0){
                //        			if(!isShowAddBtn){
                //        				$(this).find(".addTableRow").hide();
                //        			}
                //        		}
                //        		
                //        		//存在没作用删除按钮
                //        		if(disableDelBtns.length>0){
                //        			if(!isShowDelBtn){
                //        				$(this).find(".delTableRow").hide();
                //        			}
                //        		}
                //        		
                //        		//如果两者都存在,就隐藏最后一列
                //        		if(disableAddBtns.length>0&&disableDelBtns.length>0){
                //        			$(this).find("tr").each(function(){
                //        				$(this).find("td:last").hide();
                //        				$(this).find("th:last").hide();
                //        			})
                //        		}



            })

        },

        //新增列表事件
        _addRow: function (obj) {
            var prefix = this.prefixStr;
            var suffix = this.suffixStr;
            var tr = obj.closest("tr").clone(true);
            var table = obj.closest("table['tabletype'='JCTABLE']");
            var currentRowNum = $('input[name="' + prefix + table.attr("name") + '_HiddenField' + suffix + '"]');
            var maxRowNum = table.attr("data-maxRowNum");
            if (isNaN(Number(maxRowNum))) {
                maxRowNum = 20;
            }

            if (Number(currentRowNum.val()) >= maxRowNum) {
                alert("最多只能添加" + maxRowNum + "行!");
                return;
            }
            //给控件名称加上序号
            tr.find('[name^="' + prefix + '"]').each(function () {
                var name = $(this).attr("name").replace(prefix, "").replace(suffix, "");
                name = name + "_" + currentRowNum.val();
                $(this).attr("name", prefix + name + suffix);
                $(this).val("");
                //同时修改操作目标名称
                if ($(this).attr("data-calculate-to-variable") != undefined) {
                    var calculateTo = $(this).attr("data-calculate-to-variable");
                    //如果他的计算值在同一行内，则修改属性值
                    if (tr.find('[name="' + prefix + calculateTo + suffix + '"]').length > 0) {
                        $(this).attr("data-calculate-to-variable", calculateTo + "_" + currentRowNum.val())
                    }


                    //添加计算事件
                    $(this).keyup(function () {
                        JCPublicUtil.FlowFormTemplate.calculateOperate($(this)[0]);
                    })
                }
            });
            var isShowDelBtn = table.attr("data-showDelBtn") != undefined && table.attr("data-showDelBtn") == "true" ? true : false;
            if (isShowDelBtn) {
                //添加删除按钮
                tr.children("td:last").html('<a href="javascript:void(0);" class="delTableRow" onclick="JCPublicUtil.FlowFormTemplate._delRow(this);return false;"><img src="' + JCPublicUtil.Location.getRootPath() + '/images/funcation_ico/delete.png" style="border:0px;"/></a>');
            } else {
                tr.children("td:last").html("");
            }
            table.children("tbody").find("tr.JCTABLE_Row:last").after(tr);
            currentRowNum.val(table.find(".JCTABLE_Row").length);
        },

        //删除行 同时重新计算
        _delRow: function (delObj) {
            var prefix = this.prefixStr;
            var suffix = this.suffixStr;
            var tr = $(delObj).closest("tr");
            var table = $(delObj).closest("table['tabletype'='JCTABLE']");
            var dataCalculateToVariable = tr.find("[data-calculate-to-variable]");
            dataCalculateToVariable.each(function (index) {
                var calculateTo = $(this).attr("data-calculate-to-variable");
                //如果他的计算值在同一行内，则不重新计算
                if (tr.find('[name="' + prefix + calculateTo + suffix + '"]').length > 0) {
                    if (index == dataCalculateToVariable.length - 1) {
                        removeTr(tr);
                    }
                    return true;
                } else {
                    $(this).val("");
                    JCPublicUtil.FlowFormTemplate.calculateOperate($(this)[0]);
                    if (index == dataCalculateToVariable.length - 1) {
                        removeTr(tr);
                    }
                }
            })

            table.find('input[name="' + prefix + table.attr("name") + '_HiddenField' + suffix + '"]').val(table.find(".JCTABLE_Row").length);

            //移除行私有方法 trObj jquery对象
            function removeTr(trObj) {
                var controls = trObj.find('[name^="' + prefix + '"]');
                if (controls.length > 0) {
                    var inputName = controls.eq(0).attr("name").replace(prefix, "").replace(suffix, "");
                    var index = parseInt(inputName.split("_")[1], 10);
                    var nextAllTr = trObj.nextAll();
                    //修改即将删除行后的所有行name值
                    nextAllTr.each(function (i) {
                        if ($(this).hasClass("JCTABLE_Row")) {
                            var currentTr = $(this);
                            //给控件名称加上序号
                            $(this).find('[name^="' + prefix + '"]').each(function () {
                                var name = $(this).attr("name").replace(prefix, "").replace(suffix, "");
                                name = name.split("_")[0];
                                name = name + "_" + (index + i);
                                $(this).attr("name", prefix + name + suffix);
                                //同时修改操作目标名称
                                if ($(this).attr("data-calculate-to-variable") != undefined) {
                                    var calculateTo = $(this).attr("data-calculate-to-variable");
                                    //如果他的计算值在同一行内，则修改属性值
                                    if (currentTr.find('[name="' + prefix + calculateTo + suffix + '"]').length > 0) {
                                        calculateTo = calculateTo.split("_")[0];
                                        $(this).attr("data-calculate-to-variable", calculateTo + "_" + (index + i))
                                    }
                                }
                            });
                        }
                    });
                    trObj.remove();
                }
            }
        },

        //计算事件
        //currentObj是dom对象
        calculateOperate: function (currentObj) {
            var prefix = this.prefixStr;
            var suffix = this.suffixStr;
            if ($(currentObj).attr("data-calculate-to-variable") != undefined) {
                var calculateTo = $(currentObj).attr("data-calculate-to-variable");
                var calculateOp = $(currentObj).attr("calculate-op");
                var resultStr = "";
                switch (calculateOp) {
                    case "plus":
                        var sum = 0;
                        var fixedCount = 0;
                        $("input[data-calculate-to-variable='" + calculateTo + "']").each(function () {
                            var valStr = $.trim($(this).val());
                            if (valStr != "" && !isNaN(Number(valStr))) {
                                sum += Number(valStr);
                                if (valStr.indexOf(".") != -1) {
                                    var tempCount = valStr.split(".")[1].length;
                                    if (tempCount > fixedCount) {
                                        fixedCount = tempCount;
                                    }
                                }
                            }
                        })
                        resultStr = sum.toFixed(JCPublicUtil.FlowFormTemplate.fiexNum);
                        break;
                    case "minus":
                        var minusResult = 0;
                        var fixedCount = 0;
                        $("input[data-calculate-to-variable='" + calculateTo + "']").each(function (i) {
                            var valStr = $.trim($(this).val());
                            if (valStr != "" && !isNaN(Number(valStr))) {
                                if (i == 0) {
                                    minusResult = Number(valStr);
                                } else {
                                    minusResult -= Number(valStr);
                                }

                                if (valStr.indexOf(".") != -1) {
                                    var tempCount = valStr.split(".")[1].length;
                                    if (tempCount > fixedCount) {
                                        fixedCount = tempCount;
                                    }
                                }
                            }
                        })
                        resultStr = minusResult.toFixed(JCPublicUtil.FlowFormTemplate.fiexNum);
                        break;
                    case "multiply":
                        var product = 0;
                        $("input[data-calculate-to-variable='" + calculateTo + "']").each(function (i) {
                            var valStr = $.trim($(this).val());
                            if (valStr != "" && !isNaN(Number(valStr))) {
                                if (i == 0) {
                                    product = Number(valStr);
                                } else {
                                    product *= Number(valStr);
                                }
                            }
                        })
                        resultStr = product.toFixed(JCPublicUtil.FlowFormTemplate.fiexNum);
                        break;
                    case "divide":
                        var divideResult = 0;
                        $("input[data-calculate-to-variable='" + calculateTo + "']").each(function (i) {
                            var valStr = $.trim($(this).val());
                            if (valStr != "" && !isNaN(Number(valStr))) {
                                if (i == 0) {
                                    divideResult = Number(valStr);
                                } else if (Number(valStr) != 0) {
                                    divideResult /= Number(valStr);
                                }
                            }
                        })
                        resultStr = divideResult.toFixed(JCPublicUtil.FlowFormTemplate.fiexNum);
                        break;
                    case "toUpper":
                        var toUpperStr = JCPublicUtil.NumberFormat.numberToChinese($(currentObj).val());
                        if (toUpperStr != "error") {
                            resultStr = toUpperStr;
                        }
                        break;
                    case "average":
                        var sum = 0;
                        var num = 0;
                        $("input[data-calculate-to-variable='" + calculateTo + "']").each(function () {
                            var valStr = $.trim($(this).val());
                            if (valStr != "" && !isNaN(Number(valStr))) {
                                sum += Number(valStr);
                                num++;
                            }
                        })
                        if (num != 0) {
                            resultStr = (sum / num).toFixed(JCPublicUtil.FlowFormTemplate.fiexNum);
                        }
                        break;
                }

                var resultInput = $('input[name="' + prefix + calculateTo + suffix + '"]')
                resultInput.val(resultStr);
                //如果计算结果的输入框也有计算要求则计算
                if (resultInput.attr("data-calculate-to-variable") != undefined) {
                    JCPublicUtil.FlowFormTemplate.calculateOperate(resultInput[0]);
                }
            }
        },

        //验证表单
        validateForm: function () {
            var result = true;
            $("input[regexstr]").not("[disabled]").not("[readonly]").each(function () {
                var regStr = $(this).attr("regexstr");
                if (regStr == "") { return true; }
                var regex = new RegExp(regStr);
                var valueStr = $(this).val();
                //去掉逗号后是数字的，则获取去掉逗号后的值来验证
                var tempValue = valueStr.replace(/,/g, "");
                if (JCPublicUtil.NumberFormat.testNumber(tempValue) == true) {
                    valueStr = tempValue;
                }
                if (!regex.test(valueStr)) {
                    $(this).attr("style", "border:solid 1px red;");
                    result = false;
                    $(this).focus();
                } else {
                    $(this).removeAttr("style");
                }
            });
            return result;
        }

    },

    //数字格式化
    NumberFormat: {
        //以某个分隔符分开
        splitMarkFormat: function (numberStr, fixedNumber, markStr) {
            if (isNaN(Number(numberStr))) {
                return "";
            }
            fixedNumber = fixedNumber > 0 && fixedNumber <= 20 ? fixedNumber : 2;
            numberStr = parseFloat((numberStr + "").replace(/[^\d\.-]/g, "")).toFixed(fixedNumber) + "";
            var l = numberStr.split(".")[0].split("").reverse(),
            r = numberStr.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? markStr : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },


        //移除分割符号
        removeSplitMark: function (str) {
            return str.replace(/[^\d\.-]/g, "");
        },

        //数字转中文大写
        numberToChinese: function (n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
                return "error";
            var unit = "仟佰拾亿仟佰拾万仟佰拾圆角分", str = "";
            n += "00";
            var p = n.indexOf('.');
            if (p >= 0)
                n = n.substring(0, p) + n.substr(p + 1, 2);
            unit = unit.substr(unit.length - n.length);
            for (var i = 0; i < n.length; i++)
                str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            str = str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(
    				/零(万|亿|圆)/g, "$1").replace(/(亿)万|(壹拾)/g, "$1$2").replace(
    				/^圆零?|零分/g, "").replace(/圆$/g, "圆整");
            return str;
        },

        //验证是否是数字或浮点型数字(包括0)
        testNumber: function (numberStr) {
            if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(numberStr)) {
                return true;
            } else {
                return false;
            }
        },
        //验证是否是数字或浮点型数字（不包括0）
        testPositiveNumber: function (numberStr) {
        	if (/^-?([1-9]\d*)(\.\d+)?$/.test(numberStr)) {
        		return true;
        	} else {
        		return false;
        	}
        },
        //验证是否正整数
        testPositiveInteger: function (numberStr) {
        	if (/^-?([1-9]\d*)$/.test(numberStr)) {
        		return true;
        	} else {
        		return false;
        	}
        },
        //验证是否整数
        testInteger: function (numberStr) {
        	if (/^-?(0|[1-9]\d*)$/.test(numberStr)) {
        		return true;
        	} else {
        		return false;
        	}
        },
        
        //保留几位有效数字
        toFixed:function(numStr,fixnum){
        	if (!isNaN(Number(numStr))) {
        		if(numStr.indexOf(".")!=-1){
        			var numStrSplitArray=numStr.split(".");
        			if(numStrSplitArray[1].length>fixnum){
        				return numStrSplitArray[0]+"."+numStrSplitArray[1].substr(0,fixnum);
        			}
        		}
        	}
        	return numStr;
        }

    },
    //获取地址栏参数
    GetRequest:function(url){/* eg:var url=window.location; */
        var url = url.search; //获取url中"?"符后的字串 
        var theRequest = new Object(); 
        if (url.indexOf("?") != -1) { 
            var str = url.substr(1); 
            strs = str.split("&"); 
            for(var i = 0; i < strs.length; i ++) { 
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
            } 
        } 
        return theRequest; 
    },
    //地址相关类  http://localhost:8080/JC/
    Location: {
        getRootPath: function () {
            var strFullPath = window.document.location.href;
            var strPath = window.document.location.pathname;
            var pos = strFullPath.indexOf(strPath);
            var prePath = strFullPath.substring(0, pos);
            var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
            return (prePath + postPath);
        }
    },
    
    //触摸屏的的相关事件
    touchScreen:{
    	//鼠标滚动界面
    	mouseScroll:function(){
    		var x=0,y=0,isDown=false,top=0,left=0;//记录鼠标点击的坐标
    		$(document).mousedown(function(e){
    			   x=e.clientX;
    			   y=e.clientY;  
    			   top=$(document).scrollTop();
    			   left=$(document).scrollLeft();
    			   isDown=true;
    		 }).mousemove(function(e){
    			    if(isDown){
    			    	var offsetX=e.clientX-x;
    			      var offsetY=e.clientY-y;
    			      $(document).scrollTop(top+offsetY*-1);
    			      $(document).scrollLeft(left+offsetX*-1);
    			    }
    		 }).mouseup(function(){
    			       isDown=false;
    	   })
    	   
    	   
    	   //禁止选中文字
    	   $("body").css({"-moz-user-select":"none","-webkit-user-select":"none","user-select":"none"});
    	   $("html").css({"overflow":"hidden"});
    	   //禁止出现滚动条
    	   $("body").attr("scroll","no");
    	   //禁用右键
    	   $(document).bind("contextmenu",function(e){return false;}).bind("selectstart",function(e){return false;});  
      }
    },
    	
    Ajax:function(url,method,data,successFunc,errorFunc,timeout,cache,datatype,showLoadingType,extendObj){
    	if(url.indexOf("?")==-1){
			url+="?ajax=true&rnd="+Math.random();
		}else{
			if(url.indexOf("ajax=true")==-1){
				url+="&ajax=true&rnd="+Math.random();
			}
		}
		//异常提示
		var errorFunc2;
		if(errorFunc == null){
			errorFunc2 = function(){
				Common.message("error",Lang.common_server_error);
			}
		}else{
			errorFunc2 = errorFunc;
		}
		
		if(timeout < 60000){
			timeout = 60000;
		}
		
		var defaultObj ={
	   		  type: method,
	   		  url: url,
	   		  data: data,
	   		  timeout:timeout,
	   		  cache:cache,
	   		  dataType:datatype,
	   		  success: successFunc,
	   		  error:errorFunc2
	    };
		
		if(extendObj != undefined){
			defaultObj = $.extend(defaultObj,extendObj)
		}
    	var successFunc = defaultObj.success;
    	//获取当前的时间time1
    	var callTime = new Date().getTime();
    	
    	defaultObj.success = function(data){
    		//获取当前的时间time2
    		if(data != "" && data != null && data != undefined) {
    			var currTime = new Date().getTime();
    			var time = currTime - callTime;
        		var passTime = parseInt((currTime - callTime)/1000);
        		if(passTime > 3) {
        			var stringBuilder = JCPublicUtil.StringBuilder();
					stringBuilder.Append("慢请求："+ time + "ms"+"<br/>");
//					stringBuilder.Append("ajax地址："+url+"<br/>");
					stringBuilder.Append("ajax参数：" + JSON.stringify(defaultObj.data) + "<br/>")
					stringBuilder.Append("ajax结果：" + JSON.stringify(data) + "<br/>")
					var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),url);
					JCPublicUtil.sendErrorMsg(browserObj);
        		}
    		}
    		
    		try{
    			if(App != undefined){
        			App.unblockUI('body');
        		}
    		}catch(e){}
    		
    		//如果是返回的字符串，那么就转json,否则是json和html
    		if(typeof(data) == "string" && (data.indexOf("resultCode") != -1 || data.indexOf("LOGOUT") != -1 || data.indexOf("TIMEOUT") != -1)){
    			data = $.parseJSON(data);
    		}
			if (data != null && (data.LOGOUT == "YES" || data.resultCode == "E00101" || data.TIMEOUT == "YES")) {//已退出
				$(".bootbox").remove();
				$(".modal-backdrop").remove();
				//account 全局变量手机号，countryCode 全局变量 国家编号
				try{
					if(data.LOGOUT == "YES"){
						Common.reLoggedin(global_countryCode,global_account,"用户已退出，请重新登录");
					}else if(data.resultCode == "E00101"){
						Common.reLoggedin(global_countryCode,global_account,"用户未登录，请登录");
					}else{
						Common.reLoggedin(global_countryCode,global_account,"登录已失效，请重新登录");
					}
				}catch(e){}
			} else if(data != null && data.resultCode == "E00103"){//没有相关操作权限！
				Common.message("error",Lang.common_no_relevant_power);
//				bootbox.dialog({
//		            message: Lang.common_no_relevant_power,
//		            title: Lang.common_message,
//		            buttons: {
//		            	sure: {
//		                    label: Lang.common_sure,
//		                    className: "green",
//		                    callback: function() {
//		                    	
//		                    }
//		                }
//		            }
//		        });
			}else if(data != null && data.resultCode == "E00104") { //无操作权限
				Common.message("error","当前时间或IP受限制！");
			}else{
				if(successFunc != undefined){
					try{
						successFunc(data);
					}catch(e){
						var stringBuilder = JCPublicUtil.StringBuilder();
//						stringBuilder.Append("来自【ajax请求】的js错误捕获：<br/>");
//						stringBuilder.Append("ajax地址："+url+"<br/>");
						stringBuilder.Append("调用后端接口错误：<br/>");
						stringBuilder.Append("ajax参数：" + JSON.stringify(defaultObj.data) + "<br/>")
						stringBuilder.Append("ajax结果：" + JSON.stringify(data) + "<br/>")
						stringBuilder.Append("消息内容："+e.message+"<br/>");
						stringBuilder.Append("消息堆："+e.stack+"<br/>");
						var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),url);
						JCPublicUtil.sendErrorMsg(browserObj);
					}
				}
			}
    	}
	   	$.ajax(defaultObj);
	   	try{ 
	   		//增加ajax请求跟踪
		   	if(_paq != undefined && url.indexOf("pc/getMessage.do") == -1 ){
			   		_paq.push(['setCustomUrl', url]);   
			   		_paq.push(['trackPageView']);  
		   	}
	   	}catch(err){
	   		
   		}
	   	
	},
	
	formatURL:function(url){
		if(JCPublicUtil.startWith(url,"/")){
			return basePath+url;
		}else{
			return basePath+"/"+url;
		}
	},
	
	startWith : function(str, target) {
		if (JCPublicUtil.isEmpty(str) || JCPublicUtil.isEmpty(target)) {
			return false;
		}
		if (target.length > str.length) {
			return false;
		}
		if (str.substr(0, target.length) == target) {
			return true;
		}
		return false;
	},
	
	isEmpty : function (str) {
		if (str == null || str == undefined || str == '') {
			return true;
		}
		return false;
	},
   
   /*
    *浮动表头
    *@param floatHeaderContent  表头中的浮动内容
    */
   floatHeader:function(floatHeaderContent){
	   $(".floatHeader").html(floatHeaderContent);
	   $(window).scroll(function(){
			$(".floatContent>.floatHeader").each(function(){
				var floatContent=$(this).parent();
				if($(document).scrollTop()>=floatContent.offset().top){
					var top=$(document).scrollTop()-floatContent.offset().top;
					floatContent.children(".floatHeader").css("top",top+"px");
					floatContent.children(".floatHeader").show();
				}else{
					$(this).hide();
					$(this).css("top","0px");
				}
			})
		});
	   
		$(window).resize(function(){
			$(window).scroll();
		});
   },
   
   /**
    * 公用提示框
    * @param url
    */
   confirmDialog:function(url,msg,successCallBack){
	   JCPublicUtil.confirmWindow(JCPublicUtil.alertType.warnType, "提醒", msg, "确定", function(){
		   JCPublicUtil.Ajax(url, "POST", null, function(data){
			   if(data.code=="0000"){
				   if(successCallBack==undefined){
					   JCPublicUtil.alertWindow(JCPublicUtil.alertType.okType, "提醒", "操作成功！", "确定", function(){
						   location.reload();
					   });
				   }else{
					   successCallBack(data);
				   }
			   }else{
				   var errorMsg=data.msg==undefined?"操作失败":data.msg;
				   JCPublicUtil.alertWindow(JCPublicUtil.alertType.warnType, "提醒", errorMsg, "确定", null);
			   }
			   
		   }, function(){
			   JCPublicUtil.alertWindow(JCPublicUtil.alertType.warnType, "提醒", "操作失败！", "确定", null);
		   }, 60000, false, "json", false);
	   }, "取消", null);
   },
   /**
	  * 加减数量  input:middlenum (data-minnum=减操作最小值) (data-maxnum=加操作最大值) (data-type="00"/"01"/"10"/11 第一位对应最小值 第二位对应最大值 0:不限制最终,1:限制最值) 
	  * @param wrap  	  包裹加号和减号的元素id
	  * @param minusClass 减号的class
	  * @param addClass   加号的class
	  * @param errortips  提示信息,为数组(只有设置了最大值或最小值才有效)。[a,b] a 为最小值的提示信息,没有则填null，b为最大值的提示信息
	  */ 
	minusoradd: function(wrap,minusClass,addClass,errortips) {
		$("#"+wrap).on("click","."+minusClass,changenum);
		$("#"+wrap).on("click","."+addClass,changenum);
		function changenum() {
			var $target=$(this);
			var type = $target.parent().find(".middlenum").attr("data-type");
			var minnum = null;
			var maxnum = null;
			if(type == "10" || type== '11'){
				minnum = Number($target.parent().find(".middlenum").attr("data-minnum"));
				if(isNaN(minnum)){
					return ;
				}
			}
			if(type == "01" || type == "11"){
				maxnum = Number($target.parent().find(".middlenum").attr("data-maxnum"));
				if(isNaN(maxnum)){
					return ;
				}
			}
			
			if($target.hasClass(minusClass)){//点击的是减号
				if(type == "00" || type == "01" || Number($target.next().val())-1 >= minnum ){
					var currentval = $target.next().val();
					var retain = 0;
					if(currentval.toString().indexOf('.')!=-1){
						retain = currentval.toString().split(".")[1].length;
					}
					$target.next().val(Number(Number($target.next().val())-1).toFixed(retain));
				}
				else {
				}	
			}
			else if($target.hasClass(addClass)) {//点击的是加号
				if(type == "00" || type == "10" || Number($target.prev().val())+1 <= maxnum){
					var currentval = $target.prev().val();
					var retain = 0;
					if(currentval.toString().indexOf('.')!=-1){
						retain = currentval.toString().split(".")[1].length;
					}
					$target.prev().val(Number(Number($target.prev().val())+1).toFixed(retain));
				}
				else {	
					//$target.parent().find("span.error.max").fadeIn("fast").delay("1000").fadeOut("fast");
				}
			}
		}	
		
	 },
   /**
	 * 异步加载外部js
	 * url 为 相对路径  可以是数组，  callback是回调方法
	 * 例如：
	 * JCPublicUtil.requestJs(["js/test.js", "js/test1.js"], function () {
               Test.say("test");
               Test1.say("test1");
       });
	*/
	requestJs: function (url, callback) {
       var loadSuccessNum = 0;
       var urlArray = [];
       if (Object.prototype.toString.call(url) == "[object String]") {
           urlArray.push(url);
       }
       if (Object.prototype.toString.call(url) == "[object Array]") {
           urlArray = url;
       }

       var isLoaded = true;//是否加载完毕

       for (var i = 0 ; i < urlArray.length; i++) {
           if (window[urlArray[i]] == undefined) {
               isLoaded = false;
           }else{
           	loadSuccessNum ++;//如果方法之间调用相同的js，也有不同的js，那么就加载没有加载过的js，记录已经存在的js
           }
       }

       if (isLoaded == true) {
           if (callback != undefined) {
               callback();
               return;
           }
       }

       function addOnload(node, urlItem) {
           function onload() {
               loadSuccessNum++;
               window[urlItem] = urlItem;
               // Ensure only run once and handle memory leak in IE
               node.onload = node.onerror = node.onreadystatechange = null;
               // Remove the script to reduce memory leak
               document.body.removeChild(node);
               // Dereference the node
               node = null;
               if (callback != undefined && loadSuccessNum == urlArray.length) {
                   callback();
               }
           }

           var supportOnload = "onload" in node;
           if (supportOnload) {
               node.onload = onload;
               node.onerror = function () {
                   loadSuccessNum++;
               }
           }
           else {
               node.onreadystatechange = function () {
                   if (/loaded|complete/.test(node.readyState)) {
                       onload();
                   }
               }
           }
       }


       for (var i = 0 ; i < urlArray.length; i++) {
       	if (window[urlArray[i]] != undefined) {
       		continue;
       	}
           var node = document.createElement("script");
           addOnload(node,urlArray[i]);
           node.async = true;
           node.src = urlArray[i]+"?rnd="+Math.random();
           document.body.appendChild(node);  
       }   
   },
   //阻止冒泡
	stopPropagation:function(e){
		var e= e || window.event;
	    if(e.stopPropagation) { //W3C阻止冒泡方法
	        e.stopPropagation();
	    } else {
	        e.cancelBubble = true; //IE阻止冒泡方法
	    }
	},
	
	/**
	 * 获取hash
	 * hashObj  参数对象 #a=b  改为 #a=c  则 hashObj = {a:c}
	 * dataType 1:返回字符串 #a=b     2:返回对象 {a:b}
	 */
	getUrlHash:function(hashObj,dataType){
		if(hashObj == null){
			return location.hash;
		}else if(location.hash.length > 1){
			var resultObj = {};
			var hashStr = location.hash.substr(1,location.hash.length-1);
			var hashStrArray = hashStr.split("&");
			if(hashStrArray.length > 0){
				for(var i =0 ; i < hashStrArray.length; i++){
					var hashStrItemArray = hashStrArray[i].split("=");
					if(hashStrItemArray.length == 2 ){
						resultObj[hashStrItemArray[0]] = hashStrItemArray[1];
					}else{
						resultObj[hashStrItemArray[0]] = "";
					}
				}
				
				var hashObjNew = $.extend(resultObj,hashObj);
				if(dataType == undefined || dataType == 1){
					var stringBuilder = JCPublicUtil.StringBuilder();
					for(var p in hashObjNew){
						if(hashObjNew[p] == ""){
							stringBuilder.Append(p+"&");
						}else{
							stringBuilder.Append(p+"="+hashObjNew[p]+"&");
						}
						
					}
					
					var resultStr = stringBuilder.ToString();
					resultStr = "#"+resultStr.substr(0,resultStr.length - 1);
					return resultStr;
				}else if(dataType == 2){
					return hashObjNew;
				}
			}	
		}
		return "";
	},
	/**
	 * piwik客户端事件跟踪
	 * @param Documentary 所在模块
	 * @param eventName 事件名称
	 * @param elementName 事件对象
	 * @param worth 事件价值  0-10
	 * 例子：
	 * JCPublicUtil.trackEvent("企业文档","收藏","文件",10);
	 */
	trackEvent:function(Documentary,eventName,elementName,worth){
		if(_paq != undefined){			
			//_paq.push(['setDocumentTitle',Documentary+"_"+eventName+"_"+elementName]);
			_paq.push(['trackEvent', Documentary, eventName, elementName, worth]);
		}
	},
	
	/**
	 * 滚动条
	 */
	initSlimScroll: function (el) {
        $(el).each(function () {
            if ($(this).attr("data-initialized")) {
                return; // exit
            }

            var width,height;
            
            if ($(this).attr("data-height")) {
                height = $(this).attr("data-height");
            } else {
                height = $(this).css('height');
            }
            
            $(this).slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
                wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
                position: 'right',
                height: height,
                width:'auto',
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: true
            });

            $(this).attr("data-initialized", "1");
        });
    },
    
    
    /**
	 * 123 转为 一二三
	 */
    convertToChinese : function(num){
    	var N = [  
                 "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"  
             ];
    	var str = num.toString();  
        var len = num.toString().length;  
        var C_Num = [];  
        for(var i = 0; i < len; i++){  
            C_Num.push(N[str.charAt(i)]);  
        }  
        return C_Num.join('');
    },
    
    /**
	 * 滚动条(解决横向滚动条)
	 */
    niceScroll : function(el,extendObj){
    	
    	var obj = {
            	cursorcolor: "#424242", // 改变滚动条颜色，使用16进制颜色值
                cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
                cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
                cursorwidth: "8px", // 滚动条的宽度，单位：便素
                cursorborder: "1px solid #fff", // CSS方式定义滚动条边框
                cursorborderradius: "5px", // 滚动条圆角（像素）
                scrollspeed: 60, // 滚动速度
                mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素)
                boxzoom: false, // 激活放大box的内容
                dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
                gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
                preservenativescrolling: true, // 你可以用鼠标滚动可滚动区域的滚动条和增加鼠标滚轮事件
                horizrailenabled: true, // nicescroll可以管理水平滚动
                enabletranslate3d: true, // nicescroll 可以使用CSS变型来滚动内容
                enablemousewheel: true, // nicescroll可以管理鼠标滚轮事件
                enablekeyboard: true, // nicescroll可以管理键盘事件
                smoothscroll: true, // ease动画滚动
                sensitiverail: true, // 单击轨道产生滚动
                enablescrollonselection: true, // 当选择文本时激活内容自动滚动
                rtlmode: "auto", // DIV的水平滚动从左边开始
                cursordragontouch: false, // 使用触屏模式来实现拖拽
                oneaxismousemode: "auto", // 当只有水平滚动时可以用鼠标滚轮来滚动，如果设为false则不支持水平滚动，如果设为auto支持双轴滚动
                preventmultitouchscrolling: true // 防止多触点事件引发滚动
            };
    	if(extendObj != undefined){
			$.extend(obj,extendObj);
		}
    	$(el).each(function() {
            $(this).niceScroll(obj);

        });
    },
    
  //国家区号
	countryCode:function(selectId,countryCode){
		var Json = [
		            /*{name:"阿尔巴尼亚（+355）",value:"+355",selected:0},
		            {name:"阿尔及利亚（+213）",value:"+213",selected:0},
		            {name:"阿富汗（+93）",value:"+93",selected:0},
		            {name:"阿根廷（+54）",value:"+54",selected:0},
		            {name:"爱尔兰（+353）",value:"+353",selected:0},
		            {name:"埃及（+20）",value:"+20",selected:0},
		            {name:"埃塞俄比亚（+251）",value:"+251",selected:0},
		            {name:"爱沙尼亚（+372）",value:"+372",selected:0},
		            {name:"阿拉伯联合酋长国（+971）",value:"+971",selected:0},
		            {name:"阿鲁巴（+297）",value:"+297",selected:0},
		            {name:"阿曼（+968）",value:"+968",selected:0},
		            {name:"安道尔（+376）",value:"+376",selected:0},
		            {name:"安哥拉（+244）",value:"+244",selected:0},
		            {name:"安圭拉（+1264）",value:"+1264",selected:0},
		            {name:"安提瓜和巴布达（+1268）",value:"+1268",selected:0},
		            {name:"澳大利亚（+61）",value:"+61",selected:0},
		            {name:"奥地利（+43）",value:"+43",selected:0},
		            {name:"澳门（中国）（+853）",value:"+853",selected:0},
		            {name:"阿塞拜疆（+994）",value:"+994",selected:0},
		            {name:"阿森松岛（+247）",value:"+247",selected:0},
		            
		            {name:"巴巴多斯（+1246）",value:"+1246",selected:0},
		            {name:"巴布亚新几内亚（+675）",value:"+675",selected:0},
		            {name:"巴哈马（+1242）",value:"+1242",selected:0},
		            {name:"白俄罗斯（+375）",value:"+375",selected:0},
		            {name:"百慕大（+1441）",value:"+1441",selected:0},
		            {name:"巴基斯坦（+92）",value:"+92",selected:0},
		            {name:"巴拉圭（+595）",value:"+595",selected:0},
		            {name:"巴林（+973）",value:"+973",selected:0},
		            {name:"巴拿马（+507）",value:"+507",selected:0},
		            {name:"保加利亚（+359）",value:"+359",selected:0},
		            {name:"巴西（+55）",value:"+55",selected:0},
		            {name:"北马里亚纳群岛（+1670）",value:"+1670",selected:0},
		            {name:"贝宁（+229）",value:"+229",selected:0},
		            {name:"比利时（+32）",value:"+32",selected:0},
		            {name:"冰岛（+354）",value:"+354",selected:0},
		            {name:"博茨瓦纳（+267）",value:"+267",selected:0},
		            {name:"波多黎各（+1787）",value:"+1787",selected:0},
		            {name:"波多黎各（+1939）",value:"+1939",selected:0},
		            {name:"波兰（+48）",value:"+48",selected:0},
		            {name:"玻利维亚（+591）",value:"+591",selected:0},
		            {name:"伯利兹（+501）",value:"+501",selected:0},
		            {name:"波斯尼亚和黑塞哥维那（+387）",value:"+387",selected:0},
		            {name:"不丹（+975）",value:"+975",selected:0},
		            {name:"布基纳法索（+226）",value:"+226",selected:0},
		            {name:"布隆迪（+257）",value:"+257",selected:0},
		            
		            {name:"朝鲜（+850）",value:"+850",selected:0},
		            {name:"赤道几内亚（+240）",value:"+240",selected:0},
		            
		            {name:"丹麦（+45）",value:"+45",selected:0},
		            {name:"德国（+49）",value:"+49",selected:0},
		            {name:"东帝汶（+670）",value:"+670",selected:0},
		            {name:"多哥（+228）",value:"+228",selected:0},
		            {name:"多米尼加共和国（+1809）",value:"+1809",selected:0},
		            {name:"多米尼加共和国（+1829）",value:"+1829",selected:0},
		            {name:"多米尼加共和国（+1849）",value:"+1849",selected:0},
		            {name:"多米尼克（+1767）",value:"+1767",selected:0},
		            
		            {name:"厄瓜多尔（+593）",value:"+593",selected:0},
		            {name:"厄立特里亚（+291）",value:"+291",selected:0},
		            {name:"俄罗斯（+7）",value:"+7",selected:0},
		            
		            {name:"法国（+33）",value:"+33",selected:0},
		            {name:"法罗群岛（+298）",value:"+298",selected:0},
		            {name:"梵蒂冈（+379）",value:"+379",selected:0},
		            {name:"法属波利尼西亚（+689）",value:"+689",selected:0},
		            {name:"法属圣马丁（+590）",value:"+590",selected:0},
		            {name:"法属圭亚那（+594）",value:"+594",selected:0},
		            {name:"斐济（+679）",value:"+679",selected:0},
		            {name:"菲律宾（+63）",value:"+63",selected:0},
		            {name:"芬兰（+358）",value:"+358",selected:0},
		            {name:"佛得角（+238）",value:"+238",selected:0},
		            {name:"福克兰群岛（+500）",value:"+500",selected:0},
		            
		            {name:"冈比亚（+220）",value:"+220",selected:0},
		            {name:"刚果（布）（+242）",value:"+242",selected:0},
		            {name:"刚果（金）（+243）",value:"+243",selected:0},
		            {name:"格陵兰（+299）",value:"+299",selected:0},
		            {name:"格林纳达（+1473）",value:"+1473",selected:0},
		            {name:"格鲁吉亚（+995）",value:"+995",selected:0},
		            {name:"哥伦比亚（+57）",value:"+57",selected:0},
		            {name:"根西岛（+44）",value:"+44",selected:0},
		            {name:"哥斯达黎加（+506）",value:"+506",selected:0},
		            {name:"瓜德罗普岛（+590）",value:"+590",selected:0},
		            {name:"关岛（+1671）",value:"+1671",selected:0},
		            {name:"古巴（+53）",value:"+53",selected:0},
		            {name:"圭亚那（+592）",value:"+592",selected:0},
		            
		            {name:"海地（+509）",value:"+509",selected:0},
		            {name:"韩国（+82）",value:"+82",selected:0},
		            {name:"哈萨克斯坦（+7）",value:"+7",selected:0},
		            {name:"黑山共和国（+382）",value:"+382",selected:0},
		            {name:"荷兰（+31）",value:"+31",selected:0},
		            {name:"荷属安的列斯群岛（+599）",value:"+599",selected:0},
		            {name:"洪都拉斯（+504）",value:"+504",selected:0},
		            
		            {name:"加勒比荷兰（+599）",value:"+599",selected:0},
		            {name:"加纳（+233）",value:"+233",selected:0},
		            {name:"加拿大（+1）",value:"+1",selected:0},
		            {name:"柬埔寨（+855）",value:"+855",selected:0},
		            {name:"加蓬（+241）",value:"+241",selected:0},
		            {name:"吉布提（+253）",value:"+253",selected:0},
		            {name:"捷克共和国（+420）",value:"+420",selected:0},
		            {name:"吉尔吉斯斯坦（+996）",value:"+996",selected:0},
		            {name:"基里巴斯（+686）",value:"+686",selected:0},
		            {name:"津巴布韦（+263）",value:"+263",selected:0},
		            {name:"几内亚（+224）",value:"+224",selected:0},
		            {name:"几内亚比绍（+245）",value:"+245",selected:0},
		            
		            {name:"开曼群岛（+1345）",value:"+1345",selected:0},
		            {name:"喀麦隆（+237）",value:"+237",selected:0},
		            {name:"卡塔尔（+974）",value:"+974",selected:0},
		            {name:"科科斯群岛（+61）",value:"+61",selected:0},
		            {name:"克罗地亚（+385）",value:"+385",selected:0},
		            {name:"科摩罗（+269）",value:"+269",selected:0},
		            {name:"肯尼亚（+254）",value:"+254",selected:0},
		            {name:"科特迪瓦（+225）",value:"+225",selected:0},
		            {name:"科威特（+965）",value:"+965",selected:0},
		            {name:"库克群岛（+682）",value:"+682",selected:0},
		            
		            {name:"莱索托（+266）",value:"+266",selected:0},
		            {name:"老挝人民民主共和国（+856）",value:"+856",selected:0},
		            {name:"拉脱维亚（+371）",value:"+371",selected:0},
		            {name:"黎巴嫩（+961）",value:"+961",selected:0},
		            {name:"利比里亚（+231）",value:"+231",selected:0},
		            {name:"利比亚（+218）",value:"+218",selected:0},
		            {name:"列支敦士登（+423）",value:"+423",selected:0},
		            {name:"立陶宛（+370）",value:"+370",selected:0},
		            {name:"罗马尼亚（+40）",value:"+40",selected:0},
		            {name:"卢森堡（+352）",value:"+352",selected:0},
		            {name:"卢旺达（+250）",value:"+250",selected:0},
		            
		            {name:"马达加斯加（+261）",value:"+261",selected:0},
		            {name:"马尔代夫（+960）",value:"+960",selected:0},
		            {name:"马耳他（+356）",value:"+356",selected:0},
		            {name:"马来西亚（+60）",value:"+60",selected:0},
		            {name:"马拉维（+265）",value:"+265",selected:0},
		            {name:"马里（+223）",value:"+223",selected:0},
		            {name:"曼岛（+44）",value:"+44",selected:0},
		            {name:"毛里求斯（+230）",value:"+230",selected:0},
		            {name:"毛里塔尼亚（+222）",value:"+222",selected:0},
		            {name:"马其顿（+389）",value:"+389",selected:0},
		            {name:"马绍尔群岛（+692）",value:"+692",selected:0},
		            {name:"马提尼克（+596）",value:"+596",selected:0},
		            {name:"马约特（+262）",value:"+262",selected:0},
		            {name:"美国（+1）",value:"+1",selected:0},
		            {name:"美属萨摩亚（+1684）",value:"+1684",selected:0},
		            {name:"美属维京群岛（+1340）",value:"+1340",selected:0},
		            {name:"蒙古（+976）",value:"+976",selected:0},
		            {name:"孟加拉国（+880）",value:"+880",selected:0},
		            {name:"蒙塞拉特群岛（+1664）",value:"+1664",selected:0},
		            {name:"缅甸（+95）",value:"+95",selected:0},
		            {name:"密克罗尼西亚联邦（+691）",value:"+691",selected:0},
		            {name:"秘鲁（+51）",value:"+51",selected:0},
		            {name:"摩尔多瓦（+373）",value:"+373",selected:0},
		            {name:"摩洛哥（+212）",value:"+212",selected:0},
		            {name:"摩纳哥（+377）",value:"+377",selected:0},
		            {name:"莫桑比克（+258）",value:"+258",selected:0},
		            {name:"墨西哥（+52）",value:"+52",selected:0},
		            
		            {name:"纳米比亚（+264）",value:"+264",selected:0},
		            {name:"南非（+27）",value:"+27",selected:0},
		            {name:"南苏丹（+211）",value:"+211",selected:0},
		            {name:"瑙鲁（+674）",value:"+674",selected:0},
		            {name:"尼泊尔（+977）",value:"+977",selected:0},
		            {name:"尼加拉瓜（+505）",value:"+505",selected:0},
		            {name:"尼日尔（+227）",value:"+227",selected:0},
		            {name:"尼日利亚（+234）",value:"+234",selected:0},
		            {name:"纽埃（+683）",value:"+683",selected:0},
		            {name:"诺福克岛（+672）",value:"+672",selected:0},
		            {name:"挪威（+47）",value:"+47",selected:0},
		            
		            {name:"帕劳（+680）",value:"+680",selected:0},
		            {name:"葡萄牙（+351）",value:"+351",selected:0},
		            
		            {name:"日本（+81）",value:"+81",selected:0},
		            {name:"瑞典（+46）",value:"+46",selected:0},
		            {name:"瑞士（+41）",value:"+41",selected:0},
		            
		            {name:"萨尔瓦多（+503）",value:"+503",selected:0},
		            {name:"塞尔维亚（+381）",value:"+381",selected:0},
		            {name:"塞拉利昂（+232）",value:"+232",selected:0},
		            {name:"塞内加尔（+221）",value:"+221",selected:0},
		            {name:"塞浦路斯（+357）",value:"+357",selected:0},
		            {name:"塞舌尔群岛（+248）",value:"+248",selected:0},
		            {name:"萨摩亚（+685）",value:"+685",selected:0},
		            {name:"沙特阿拉伯（+966）",value:"+966",selected:0},
		            {name:"圣巴泰勒米（+590）",value:"+590",selected:0},
		            {name:"圣诞岛（+61）",value:"+61",selected:0},
		            {name:"圣多美和普林西比（+239）",value:"+239",selected:0},
		            {name:"圣赫勒拿（+290）",value:"+290",selected:0},
		            {name:"圣基茨和尼维斯（+1869）",value:"+1869",selected:0},
		            {name:"圣卢西亚（+1758）",value:"+1758",selected:0},
		            {name:"圣马丁（+1721）",value:"+1721",selected:0},
		            {name:"圣马力诺（+378）",value:"+378",selected:0},
		            {name:"圣皮埃尔和密克隆（+508）",value:"+508",selected:0},
		            {name:"圣文森特和格林纳丁斯（+1784）",value:"+1784",selected:0},
		            {name:"斯里兰卡（+94）",value:"+94",selected:0},
		            {name:"斯洛伐克（+421）",value:"+421",selected:0},
		            {name:"斯洛文尼亚（+386）",value:"+386",selected:0},
		            {name:"斯瓦尔巴和扬马延（+47）",value:"+47",selected:0},
		            {name:"斯威士兰（+268）",value:"+268",selected:0},
		            {name:"苏丹（+249）",value:"+249",selected:0},
		            {name:"所罗门群岛（+677）",value:"+677",selected:0},
		            {name:"索马里（+252）",value:"+252",selected:0},
		            
		            {name:"泰国（+66）",value:"+66",selected:0},
		            {name:"台湾（中国）（+886）",value:"+886",selected:0},
		            {name:"塔吉克斯坦（+992）",value:"+992",selected:0},
		            {name:"汤加（+676）",value:"+676",selected:0},
		            {name:"坦桑尼亚（+255）",value:"+255",selected:0},
		            {name:"特克斯和凯科斯群岛（+1649）",value:"+1649",selected:0},
		            {name:"特立尼达和多巴哥（+1868）",value:"+1868",selected:0},
		            {name:"特里斯坦-达库尼亚（+290）",value:"+290",selected:0},
		            {name:"土耳其（+90）",value:"+90",selected:0},
		            {name:"土库曼斯坦（+993）",value:"+993",selected:0},
		            {name:"突尼斯（+216）",value:"+216",selected:0},
		            {name:"托克劳（+690）",value:"+690",selected:0},
		            {name:"图瓦卢（+688）",value:"+688",selected:0},
		            
		            {name:"瓦利斯和富图纳（+681）",value:"+681",selected:0},
		            {name:"瓦努阿图（+678）",value:"+678",selected:0},
		            {name:"危地马拉（+502）",value:"+502",selected:0},
		            {name:"委内瑞拉（+58）",value:"+58",selected:0},
		            {name:"文莱（+673）",value:"+673",selected:0},
		            {name:"乌干达（+256）",value:"+256",selected:0},
		            {name:"乌克兰（+380）",value:"+380",selected:0},
		            {name:"乌拉圭（+598）",value:"+598",selected:0},
		            {name:"乌兹别克斯坦（+998）",value:"+998",selected:0},
		            
		            {name:"香港（中国）（+852）",value:"+852",selected:0},
		            {name:"西班牙（+34）",value:"+34",selected:0},
		            {name:"希腊（+30）",value:"+30",selected:0},
		            {name:"新加坡（+65）",value:"+65",selected:0},
		            {name:"新喀里多尼亚（+687）",value:"+687",selected:0},
		            {name:"新西兰（+64）",value:"+64",selected:0},
		            {name:"匈牙利（+36）",value:"+36",selected:0},
		            {name:"西撒哈拉（+212）",value:"+212",selected:0},
		            {name:"叙利亚（+963）",value:"+963",selected:0},
		            
		            {name:"牙买加（+1876）",value:"+1876",selected:0},
		            {name:"亚美尼亚（+374）",value:"+374",selected:0},
		            {name:"也门（+967）",value:"+967",selected:0},
		            {name:"意大利（+39）",value:"+39",selected:0},
		            {name:"伊拉克（+964）",value:"+964",selected:0},
		            {name:"伊朗（+98）",value:"+98",selected:0},
		            {name:"印度（+91）",value:"+91",selected:0},
		            {name:"印度尼西亚（+62）",value:"+62",selected:0},
		            {name:"英国（+44）",value:"+44",selected:0},
		            {name:"英属维京群岛（+1284）",value:"+1284",selected:0},
		            {name:"英属印度洋领地（+246）",value:"+246",selected:0},
		            {name:"以色列（+972）",value:"+972",selected:0},
		            {name:"约旦（+962）",value:"+962",selected:0},
		            {name:"越南（+84）",value:"+84",selected:0},
		            
		            {name:"赞比亚（+260）",value:"+260",selected:0},
		            {name:"泽西岛（+44）",value:"+44",selected:0},
		            {name:"乍得（+235）",value:"+235",selected:0},
		            {name:"直布罗陀（+350）",value:"+350",selected:0},
		            {name:"智利（+56）",value:"+56",selected:0},
		            {name:"中非共和国（+236）",value:"+236",selected:0},*/
		            {name:"中国（+86）",value:"+86",selected:1}
		           
	            ];
		
		$("#"+selectId).html('');
		for(var j = 0; j < Json.length; j++){
			
			var name = Json[j].name;
			var val = Json[j].value;
			var selected = Json[j].selected;
			if(countryCode != undefined)
			{
				if(val == countryCode)
				{
					$("#"+selectId).append('<option selected value="'+val+'" Istrue="1">'+name+'</option>');
				}
				else
				{
					$("#"+selectId).append('<option value="'+val+'">'+name+'</option>');
				}
			}
			else
			{
				if(selected == 1){
					$("#"+selectId).append('<option selected value="'+val+'" Istrue="1">'+name+'</option>');
				}else{
					$("#"+selectId).append('<option value="'+val+'">'+name+'</option>');
				}
			}
			
		}
	},
	
	//发送捕获异常
	sendErrorMsg: function(msg){
		// var pathName = window.location.pathname.substring(1);
		// var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
		// var url = urlErrorMsg + '/JUCHAOSOFT-OPERATIONS/exp/collect';
		// $.ajax({
		// 	type:'post',
		// 	url:url,
		// 	contentType:'application/json;charset=utf-8',
		// 	data:JSON.stringify(msg),
		// 	success:function(data){//返回json结果
		// 		//不处理数据
		// 	}
		// });
	},
	
	
	/**
	 * 获取浏览器信息
	 */
	getBrowserInfo:function(data,url){
		var stringBuilder = JCPublicUtil.StringBuilder();
		var name = "OLinking";
		var component = "web-browser";
		var appName = navigator.appName; //浏览器的正式名称
        var appVersion = navigator.appVersion; //浏览器的版本号
        var cookieEnabled = navigator.cookieEnabled; // 返回用户浏览器是否启用了cookie
        var mimeType = navigator.mimeTypes; // 浏览器支持的所有MIME类型的数组
        var platform = navigator.platform; // 浏览器正在运行的操作系统平台，包括Win16(windows3.x)   Win32(windows98,Me,NT,2000,xp),Mac68K(Macintosh 680x0)   和ＭacPPC(Macintosh PowerPC)
        var userLanguage = navigator.userLanguage; // 用户在自己的操作系统上设置的语言（火狐没有）
        var userAgent = navigator.userAgent; //包含以下属性中所有或一部分的字符串：appCodeName,appName,appVersion,language,platform
        var systemLanguage = navigator.systemLanguage; // 用户操作系统支持的默认语言（火狐没有）
		
        stringBuilder.Append("浏览器的正式名称：" + appName + "<br/>");
        stringBuilder.Append("浏览器属性信息：" + userAgent + "<br/>");
        stringBuilder.Append("浏览器的版本号：" + appVersion + "<br/>");
        stringBuilder.Append("浏览器的是否启用了cookie：" + cookieEnabled + "<br/>");
        stringBuilder.Append("浏览器的MIME类型：" + mimeType.length + "<br/>");
        stringBuilder.Append("系统平台：" + platform + "<br/>");
        stringBuilder.Append("用户设置的操作系统语言：" + userLanguage + "<br/>");
        stringBuilder.Append("操作系统支持的默认语言：" + systemLanguage + "<br/>");
        stringBuilder.Append("屏幕分辨率高度：" + window.screen.height + "<br/>");
        stringBuilder.Append("屏幕分辨率宽度：" + window.screen.width + "<br/>");
        stringBuilder.Append("颜色质量：" + window.screen.colorDepth + "位<br/>");
        var obj = {
				name: name,					//应用名称
				component: component,		//应用组件
				build: 100,					//build号
				flowNo: "",					//业务ID
				// userId: userId,				//用户ID
				// teamId: companyId,			//企业ID
				os: platform,				//操作系统平台
				osVersion: "",				//操作系统版本
				browse: appName,			//浏览器名称
				browseVersion: appVersion,	//浏览器版本
				device: "",					//设备信息
				ext: url,					//接口地址
				data: data
		};
        return obj;
	} 
    
    
};


//初始化操作
JCPublicUtil.initModuleFunc();

/**
 * 捕获异常信息
 */
//过滤地址
var errorFilterUrlGlobal = ['//localhost:8443/CLodopfuncs.js?priority=1','//api.map.baidu.com/api'];

(function(){
	window.onerror = function(msg, url, line, col, error){
		var stringBuilder = JCPublicUtil.StringBuilder();
		stringBuilder.Append("前端js报错[window.onerror]:<br/>");
		stringBuilder.Append("错误信息：" + msg + "<br/>");
//		stringBuilder.Append("出错文件：" + url + "<br/>");
		stringBuilder.Append("出错行号：" + line + "<br/>");
		stringBuilder.Append("出错列号：" + col + "<br/>");
		stringBuilder.Append("错误详情：" + error + "<br/>"); 
		var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),url);
		JCPublicUtil.sendErrorMsg(browserObj);
	}
	
	//捕获加载错误异常
	window.addEventListener('error', function (event) {
        if (event) {
            var target = event.target || event.srcElement;
            var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
            if (!isElementTarget) return; // js error不再处理
            
            var url = target.src || target.href;
            var isSend = true;
    		for(var i = 0; i < errorFilterUrlGlobal.length; i++){
    			var errorUrl = errorFilterUrlGlobal[i];
    			if(url.indexOf(errorUrl) != -1){
    				isSend = false;
    				break;
    			}
    		}
    		if(isSend == false){
    			return;
    		}
    		
            var stringBuilder = JCPublicUtil.StringBuilder();
    		stringBuilder.Append("前端js报错[error]:<br/>");
    		stringBuilder.Append("节点名称：" + target.nodeName + "<br/>");
//    		stringBuilder.Append("加载错误地址：" + url + "<br/>");
    		
    		//被过滤的
    		stringBuilder.Append("当前地址：" + window.location.href + "<br/>");
    		stringBuilder.Append("level：" + "error" + "<br/>");
    		var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),url);
    		JCPublicUtil.sendErrorMsg(browserObj);
        }
    }, true);
	
	//当promise被reject并且错误信息没有被处理的时候，会抛出一个unhandledrejection，并且这个错误不会被window.onerror以及window.addEventListener('error')捕获，需要用专门的window.addEventListener('unhandledrejection')捕获处理
	window.addEventListener('unhandledrejection', function(event) 
    { 
		var stringBuilder = JCPublicUtil.StringBuilder();
 		stringBuilder.Append("来自前端报错[unhandledrejection]:<br/>");
 		stringBuilder.Append("当前地址：" + window.location.href + "<br/>");
 		stringBuilder.Append("内容：" + event.reason + "<br/>");
 		var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),window.location.href);
		JCPublicUtil.sendErrorMsg(browserObj);
    });
	
	//一些特殊情况下，还需要捕获处理console.error，捕获方式就是重写window.console.error
	var consoleError = window.console.error; 
	window.console.error = function () { 
		var stringBuilder = JCPublicUtil.StringBuilder();
 		stringBuilder.Append("来自前端报错[console.error]:<br/>");
 		stringBuilder.Append("当前地址：" + window.location.href + "<br/>");
 		stringBuilder.Append("内容：" + JSON.stringify(arguments) + "<br/>");
 		var browserObj = JCPublicUtil.getBrowserInfo(stringBuilder.ToString(),window.location.href);
		JCPublicUtil.sendErrorMsg(browserObj);
//	    consoleError && consoleError.apply(window, arguments); 
	};
})();


var JCUI={
		/*
		 重新定义下拉框
		 <select class="jcui-dropdown" style="width:200px;">
		   <option value="a" data-icon="http://www.baidu.com/img/baidu_jgylogo3.gif">s</option>
		   <option value="b" selected="selected">b</option>
		   <option value="c">c</option>
		  </select>
		  
		  调用方法：JCUI.dropDownList();
         */
		dropDownList:function(content){
			var jcui_dropdownlist = null;
			if(content == undefined){
				jcui_dropdownlist = $(".jcui-dropdownlist");
			}else{
				jcui_dropdownlist = $(".jcui-dropdownlist",content);
			}
			jcui_dropdownlist.each(function(index){
				var currentObj=$(this);
				//清空已经生成过的下拉框
				var data_ddlid = currentObj.attr("data-ddlid");
				if($("#"+data_ddlid).length > 0){
					$("#"+data_ddlid).remove();
				}
				if(currentObj.get(0).tagName.toLowerCase()=="select"){
					var suffix = JCPublicUtil.DateFormat(new Date(), "YYYYMMddhhmmssS");
					var dorpdownid = "dropdownlist"+suffix;
					currentObj.attr("data-ddlid",dorpdownid);
					if($("#"+dorpdownid).length > 0 ){
						return false;
					}
					var scroll = "scroll"+suffix;
					var stringBuilder=JCPublicUtil.StringBuilder();
					stringBuilder.Append('<div class="jcui-dropdownlist-control" id="'+dorpdownid+'">');
					stringBuilder.Append('  <div class="selectedItem" style="cursor:pointer;">');
					stringBuilder.Append('     <div class="selectedContent"></div>');
					stringBuilder.Append('     <a href="javascript:void(0);" class="dropdownBtn fa fa-sort-down"></a>');
					stringBuilder.Append('  </div>');
					stringBuilder.Append('  <ul id="'+scroll+'">');
					stringBuilder.Append('  	<div class="Scroll" style="max-height:200px;overflow:hidden;position:relative">');
					currentObj.find("option").each(function(){
						var value=$(this).attr("value");
						var text=$(this).text();
						var imgUrl=$(this).attr("data-icon");
						var selectedClass=$(this).prop("selected")==true?"selected":"";
						if(imgUrl==undefined){
							stringBuilder.Append('     <li data-value="'+value+'" class="'+selectedClass+'"><a href="javascript:void(0);" title="'+text+'"><span>'+text+'</span></a></li>');
						}else{
							stringBuilder.Append('     <li data-value="'+value+'" class="'+selectedClass+'"><a href="javascript:void(0);" title="'+text+'"><img src="'+imgUrl+'"><span>'+text+'</span></a></li>');
						}
					});
					stringBuilder.Append('  	</div>');
				    stringBuilder.Append('  </ul>');
				    stringBuilder.Append('</div>');
				    currentObj.after(stringBuilder.ToString());
				    currentObj.hide();
				    
				    var config = {
			                cursorcolor: "#ccc",
			                cursoropacitymax: 1,
			                touchbehavior: false,
			                cursorwidth: "5px",
			                cursorborder: "0",
			                cursorborderradius: "5px",
			                autohidemode: false,
			                horizrailenabled: true
			            };
				    $("#"+scroll+" .Scroll").niceScroll(config);
				    
				    var dorpdownObj=$("#"+dorpdownid);
				    if(dorpdownObj.find(".selected").length>0){
				    	dorpdownObj.find(".selectedContent").html(dorpdownObj.find(".selected a").html());
				    }else{
				    	if(dorpdownObj.find("li").length>0){
				    		dorpdownObj.find(".selectedContent").html(dorpdownObj.find("li").eq(0).html());
				    	}
				    }
				    var width=currentObj.width();
				    dorpdownObj.width(width+"px");
				    dorpdownObj.find(".selectedContent").width((width-22)+"px");
				    
				    //选项
				    dorpdownObj.on("click","li",function(e){
				    	dorpdownObj.find(".selectedContent").html($(this).find("a").html());
				    	dorpdownObj.find("ul").hide();
				    	dorpdownObj.find(".selectedItem").removeClass("dropdownBtnUp");
				    	$(this).siblings().removeClass("selected");
				    	$(this).addClass("selected");
				    	
				    	var index=dorpdownObj.find("ul li").index($(this));
				    	currentObj.find("option").eq(index).prop("selected",true);
				    	currentObj.change();
				    	$("#"+scroll+" .Scroll").getNiceScroll().hide();
				    	e.stopPropagation();
				    })
				    
				    //下拉
				    dorpdownObj.on("click",".selectedItem",function(e){
				    	if(currentObj.prop("disabled") == true){
				    		return;
				    	}
	                    if($(this).hasClass("dropdownBtnUp")){
	                    	dorpdownObj.find("ul").hide();
	                    	$(this).removeClass("dropdownBtnUp");
	                    }else{
					    	$(".jcui-dropdownlist-control ul").hide();
					    	$(".jcui-dropdownlist-control .selectedItem").removeClass("dropdownBtnUp");
	                    	dorpdownObj.find("ul").show();
	                    	$(this).addClass("dropdownBtnUp");
	                    }
	                    e.stopPropagation();
				    })
				    
				    //如果是存在弹框里面的下拉框，则在弹框上绑定事件，因为弹框上阻止了冒泡，所以不能绑定在document上
				    var parentWindow = dorpdownObj.closest(".dialogWindow");
				    if(parentWindow != undefined && parentWindow.length > 0){
				    	parentWindow.bind("click."+dorpdownid,function(){
				    		if($("#"+dorpdownid+" .selectedItem").hasClass("dropdownBtnUp")){
		                    	dorpdownObj.find("ul").hide();
		                    	dorpdownObj.find(".selectedItem").removeClass("dropdownBtnUp");
		                    }
				    	});
				    }else{
				    	$(document).bind("click."+dorpdownid,function(){
					    	if($("#"+dorpdownid+" .selectedItem").hasClass("dropdownBtnUp")){
		                    	dorpdownObj.find("ul").hide();
		                    	dorpdownObj.find(".selectedItem").removeClass("dropdownBtnUp");
		                    }
					    });	
				    }
				    
				    	
			   }
		     });
	},
	
	/*
	菜单
	@parame menuItems  菜单项 
		[{"imgurl":basePath+"themes/default/Images/paymanage/ccb.png","text":"建行 （1111213132123123）","value":"0"},
	  	{"imgurl":basePath+"themes/default/Images/paymanage/cmb.png","text":"招行 （1111213132123123）","value":"1"},
	  	{"imgurl":basePath+"themes/default/Images/paymanage/icbc.png","text":"工行 （1111213132123123）","value":"2"}];
     @parame event   为js鼠标事件对象
     @parame callBackFunc  是回调函数，点击每项的时候调用，会传入三个参数  text,value,imgurl
     
                调用方法：
        JCUI.menu(menuItems,event,function(text,value,url){
				$(obj).removeClass("aControl").removeClass("settingIcon");
				$(obj).html('<img src="'+url+'"><span>'+text.split(" ")[0]+'</span>');
			});
	 */
	menu:function(menuItems,event,callBackFunc){
		var stringBuilder=JCPublicUtil.StringBuilder();
		if($("#menuControl").length==0){
			stringBuilder.Append('<ul class="jcui-menuControl" id="menuControl">');;
			for(var i=0;i<menuItems.length;i++){
				if(menuItems[i].imgurl!=undefined&&menuItems[i].imgurl!=""){
					stringBuilder.Append(' <li data-value="'+menuItems[i].value+'"><a href="javascript:void(0);" title="'+menuItems[i].text+'"><img src="'+menuItems[i].imgurl+'"><span>'+menuItems[i].text+'</span></a></li>');
				}
				else{
					stringBuilder.Append(' <li data-value="'+menuItems[i].value+'"><a href="javascript:void(0);" title="'+menuItems[i].text+'"><span>'+menuItems[i].text+'</span></a></li>');
				}
			}
			stringBuilder.Append('</ul>');
			$("body").append(stringBuilder.ToString());
		}
		var x=event.x||event.clientX;
		var y=event.y||event.clientY;
		var left=x-$("#menuControl").width()-10;
		var top=y-10;
		$("#menuControl").css({"top":top+"px","left":left+"px","display":"block"});
		$("#menuControl").on("click","li",function(e){
			var value=$(this).attr("data-value");
			var text=$(this).find("span").text();
			var imgurl="";
			if($(this).find("img").length>0){
				imgurl=$(this).find("img").attr("src");
			}
			callBackFunc(text,value,imgurl);
			$("#menuControl").remove();
			e.stopPropagation();
		});
		
		$(document).bind("click.menuControl",function(){
			$("#menuControl").remove();
			$(document).unbind("click.menuControl");
		});
	},
	
	/*
	 *气泡，只要标签上加入class="jcui-tooltip" 且配置title属性就可以在鼠标移上去的时候就会出现气泡
	 *调用方法：
	 *JUCI.toolTip();
	 *如果不配置class，也可以调用，只需要再调用  $(".tipRedIcon").toolTip() 即可
	 */
	toolTip:function(){
		(function($){ $.fn.toolTip = function(){
		    return this.each(function() {
		        var text = $(this).attr("title");
		        $(this).attr("title", "");
		        if(text != undefined) {
		            $(this).hover(function(e){
		                var tipX = e.pageX + 12;
		                var tipY = e.pageY + 12;
		                $(this).attr("title", ""); 
		                $("body").append("<div id='jcuitooltip' class='jcui-tooltip-control'>" + text + "</div>");
		                var tipWidth = $("#simpleTooltip").outerWidth(true)
		                $("#jcuitooltip").width(tipWidth);
		                $("#jcuitooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
		            }, function(){
		                $("#jcuitooltip").remove();
		                $(this).attr("title", text);
		            });
		            $(this).mousemove(function(e){
		                var tipX = e.pageX + 12;
		                var tipY = e.pageY + 12;
		                var tipWidth = $("#jcuitooltip").outerWidth(true);
		                var tipHeight = $("#jcuitooltip").outerHeight(true);
		                if(tipX + tipWidth > $(window).scrollLeft() + $(window).width()) tipX = e.pageX - tipWidth;
		                if($(window).height()+$(window).scrollTop() < tipY + tipHeight) tipY = e.pageY - tipHeight;
		                $("#jcuitooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
		            });
		        }
		    });
		}})(jQuery);
		$(".jcui-tooltip").toolTip();
	}
	
	
}



 

