// JavaScript Document
$(function () {
    Date.prototype.Format = function (format) { //currentTime = date.Format("yyyy-MM-dd hh:mm:ss");  格式化日期
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    
    CE.alldelet();

    CE.checkall();
})
var CE = {
	//计算滚动内容高度
	//1、parentElement  整个右侧的高度
	//2、childElement1  	右侧第一行高度
	//3、childElement2	右侧第二行高度
	//4、contElement 	滚动内容高度
	//5、num				内边距、外边距的高度   没有为0（注：数据->num值为数据条数提示的div高度）
	//	notice    		公告高度
	ScrollToheight:function(parentElement,contElement,num,childElement1,childElement2,childElement3){
		var scrollHight=$("#"+parentElement+"").outerHeight(true)-($("#"+parentElement+" ."+childElement1+"").outerHeight(true)+$("#"+parentElement+" ."+childElement2+"").outerHeight(true)+$("#"+parentElement+" ."+childElement3+"").outerHeight(true)+num);
		$("#"+parentElement+" ."+contElement+"").height(scrollHight);
		var siblingScroll = $("#"+parentElement+" ."+contElement+"").siblings(".detailCont");
		if(siblingScroll.length > 0){
			siblingScroll.height(scrollHight);
			CE.getCalssFun(siblingScroll);
		}	
		$(window).resize(function () {
			var scrollHight=$("#"+parentElement+"").outerHeight(true)-($("#"+parentElement+" ."+childElement1+"").outerHeight(true)+$("#"+parentElement+" ."+childElement2+"").outerHeight(true)+$("#"+parentElement+" ."+childElement3+"").outerHeight(true)+num);
			$("#"+parentElement+" ."+contElement+"").height(scrollHight);
			var siblingScroll = $("#"+parentElement+" ."+contElement+"").siblings(".detailCont");
			if(siblingScroll.length > 0){
				siblingScroll.height(scrollHight);
				CE.getCalssFun(siblingScroll);
			}
	    });
		CE.getCalssFun($("#"+parentElement+" ."+contElement+""));
	},
	//搜索  清空请求
	clearRequest:function(_this,perform,AjaxTo){
		$(_this).siblings("input").val("");
		$(_this).siblings("input").focus();
		$(_this).hide();
		if(perform == 0 && AjaxTo != undefined){
			AjaxTo(0);
		}
		else if(perform == undefined && AjaxTo != undefined){
			AjaxTo();
		}
	},
	//删除提示 
	deleteTipFuc:function(html){
		var stringBuilder = JCPublicUtil.StringBuilder();
			stringBuilder.Append('<div style="padding: 50px 0px 32px 0px;font-size: 14px;">'+html+'</div>');
		return stringBuilder.ToString();
	},
	//提示信息
	//title:提示标题
	//html:提示内容
	//OKFuc:点击确定触发的方法
	//CancelFuc:点击取消触发的方法
	confirmTipFuc:function(title,html,OKFuc,CancelFuc){
		var stringBuilder = JCPublicUtil.StringBuilder();
		stringBuilder.Append('<div style="padding: 50px 0px 32px 0px;font-size: 14px;">'+html+'</div>');
		return JCPublicUtil.dialogWindow(title,stringBuilder.ToString(),"确定",function(){ OKFuc;},"取消",function(){ CancelFuc;});
	},
	IconComMouse:function(){//图标提示 a标签统一加类名IconCom  以及自定义属性data-title为提示内容
	    $(".handleIcon > .IconCom").mouseover(function () {
	    	var that = $(this);
	        var thisval = $(this).children("a").attr("data-title");
	        if($(".arrow_box").length == 0){
	        	$("body").append('<div class="arrow_box">' + thisval + '</div>');
	        }else{
	        	$(".arrow_box").html(thisval);
	        }
	        var offset = that.offset();
	        var left = offset.left;
	        var top = offset.top;
	        var arrowBox =  $(".arrow_box").eq(0);
	        var iconComWidth = that.width();
	        var arrowBoxWidth = arrowBox.outerWidth();
	        var arrowBoxOffsetLeft = left + iconComWidth/2 - arrowBoxWidth/2;
	        var arrowBoxOffsetTop = top - 40;
	        $(".arrow_box").css({"left":arrowBoxOffsetLeft+"px","top":arrowBoxOffsetTop+"px"});
	        $(".arrow_box").show();
	        
	    }).mouseout(function () {
	       $(".arrow_box").hide();
	    });
	},
	//点击按钮或更多  显示下拉内容
	/**
	 * _this  当前更多按钮对象
	 * event 需要阻止冒泡
	 * category 一般为"true"   
	 * category="true"  列表的更多(数据  带有传过去重命名的数据)
	 * category="false" 列表的更多(管理)
 	 */
	dropdownEvent:function(_this,event,category){
		CE.piwikCom("更多");
		if(event){
			JCPublicUtil.stopPropagation(event);
		}
		var _thisObj=$(_this).find(".ReadMore");
		_thisObj.eq(0).show();
//		if(_thisObj.is(":hidden")){
//			_thisObj.eq(0).show();
//		}else{
//			_thisObj.eq(0).hide();
//		}

		//绑定鼠标移出后下拉菜单隐藏
		$(_this).bind("mouseleave",function(){
			_thisObj.hide();
			$(_this).unbind("mouseleave");
		});

		if(category == "true" || category == "false"){
			var thisHeight,thisWidth;
			var getUl = $(_this).children("ul");
			getUl.hide();
			$("body >.ReadMore").remove();
			if(category == "true"){
				//存列表 该行 的定位  以便重命名
				var parentTr = $(_this).closest("tr");
				var offsetTr = parentTr.offset();
				var offset_left = offsetTr.left;
				var offset_top = offsetTr.top;
				var txt = parentTr.find(".nameFor").text();
				var dataId = parentTr.find("input.magic-checkbox").attr("id");
				getUl.attr("data-left",offset_left);
				getUl.attr("data-top",offset_top);
				getUl.attr("data-text",txt);//当前行文件或文件夹名称（使用申请）
				getUl.attr("data-id",dataId);//当前行文件或文件夹id（使用申请）
				thisHeight = 60;
				thisWidth = 60;
			}
			else if(category == "false"){
				thisHeight = 47;
				thisWidth = 46;
			}
			getUl.clone(true).appendTo($("body"));
			var ReadMore = $("body >.ReadMore");
			if(ReadMore.length >1){
				return;
			}
			ReadMore.show();
			//定位更多的内容 显示在上面或在下面
			var screenHeight = $(window).height();
			var bodyHeight = $("body").height();
			var parentHeight = screenHeight > bodyHeight ?screenHeight:bodyHeight;
			var offset = $(_this).offset();
			var top = offset.top;
			var left = offset.left;
			var moreLeft = left-ReadMore.width() + thisWidth;	
			var offsetBottom = parentHeight - top - thisHeight;//"更多"距离底部的高度
			var moreHeight = ReadMore.height();//内容的高度

			if(moreHeight <= offsetBottom){//向上显示
				ReadMore.css({"top":(top+thisHeight)+"px","left":moreLeft+"px"});
			}else if(moreHeight <= top){//向下显示
				ReadMore.css({"top":(top-moreHeight)+"px","left":moreLeft+"px"});
			}else{//向左显示
				left = left-ReadMore.width();
				top = (parentHeight - moreHeight)/2;
				ReadMore.css({"top":top+"px","left":left+"px"});
			}
			
			$(_this).bind("mouseleave.hideReadMore",function(){
				var timeout = setTimeout(function(){
					ReadMore.remove();
				},200);
				ReadMore.bind("mouseenter",function(){
					clearTimeout(timeout);
				});
				
				$(_this).unbind("mouseleave.hideReadMore");
			})
			//绑定鼠标移出后下拉菜单隐藏
			ReadMore.bind("mouseleave",function(){
				$(this).remove();
			});
		}
		
		_thisObj.click(function(e){
			e.stopPropagation();
		});
		
	},
	//piwik 区分按钮是所属模块
	//eventName  事件名称
	piwikCom:function(eventName){
		var divObj = $(".contentContainer .rightBar >div");
		var doc = "";
		divObj.each(function(){
			if($(this).is(":visible")){
				var aObj = $(this).find(".leftText").children("a");
				doc = aObj.eq(0).text();
			}
		});
		return JCPublicUtil.trackEvent("数据-"+doc,eventName,"文件/文件夹",10);
	},
	emptyInputKeyup:function(_this){
		var emptyicon=_this.siblings(".emptyicon");//搜索清空  x按钮
		if(_this.val()){
			emptyicon.css("display","inline-block");
		}else{
			emptyicon.hide();
		}
	},
    alldelet: function () {//全删
        $(".icon11_3").click(function () {
            $(this).parents("tr").hide();
        })
    },
    handleMsg: function (type, msg, time, nextFunction) {//操作后的提示信息 type值:0->失败,1->成功  msg操作后的提示值
    	$(".handleMsg").remove();
    	var timeout = 2000;
    	if(time != undefined){
    		timeout = time;
    	}
        var html = "";
        var MsgId = "char" + parseInt(Math.random() * 10000000);
        var classStr = "";
        if (type == 0) {
        	classStr = "handleMsg0";
        }
        if (type == 1) {
        	classStr = "handleMsg1";
        }
        html += '<div class="handleMsg '+classStr+'" id=' + MsgId + ' >';
        if(type == 0 || type == 1){
        	html += '<span class="handleMsgIco"></span>';
        }
        
        html += '<span class="handleMsgCont">' + msg + '</span>';
      /*  html += '<span class="handleMsgCancle">x</span>';*/
        html += '</div>';
        $("body").append(html);
        function animate() {
            $("#" + MsgId).remove();
            if(nextFunction !=undefined){
            	nextFunction();
            }

        }

        if(timeout != 0){
        	setTimeout(animate,timeout);
        }
        
        /*$(".handleMsgCancle").click(function () {
            $(".handleMsg").remove();
            clearTimeout(animate);
        });*/
        
        return $("#" + MsgId);
    },
    //系统消息通知    中间
    systemMsg: function (time,url,postObj,nextFunction) {
    	/*Ajax.doRequest(Ajax.formatURL(url),
				"post", postObj, function(data) {
					if (data.resultCode == '000000') {*/
				    	if(time == undefined || time == "" || time == null){
				    		var timeout = 2000;
				    	}else if(time > 0){
				    		var timeout = time;
				    	}
    	 				var MsgId = "char" + parseInt(Math.random() * 10000000);
						var stringBuilder = JCPublicUtil.StringBuilder();
						//var list = data.list;
							stringBuilder.Append('<div class="system_Msg" id=' + MsgId + '>'); 
							stringBuilder.Append('	<div class="MsgTip"><span class="MsgTitle">系统消息</span><span class="IMClose"></span></div>');
							stringBuilder.Append('	<div class="MsgContent">');
							stringBuilder.Append('		<div class="contMain"><span><span style="vertical-align: top;">张三</span>分享文件给你：</span><span>需求文档.Doc</span></div>');
							stringBuilder.Append('		<div class="MsgBtn">点击<span class="toView">查看</span></div>');
							stringBuilder.Append('	</div>');
							stringBuilder.Append('</div>'); 
							$("body").append(stringBuilder.ToString());
							var animate = function() {
									$("#" + MsgId).remove();
							        if(nextFunction !=undefined){
							            nextFunction();
							        }
					        	}
							var setTime = setTimeout(animate,timeout);
							$(".system_Msg").bind("mouseenter",function(){
								clearTimeout(setTime);
							}).bind("mouseleave",function(){
						        setTimeout(animate,300);
							});
								
					        return $("#" + MsgId);
					        
					        /*} else {
				}
			}, function() {
					CE.handleMsg(0,"服务器连接异常");
		}, 6000, false, "json");*/
    },
    innit_account: function () {
        $(".hovercont").mouseover(function () {
            $(".hovercont .manageContent").show();
        });
        $(".hovercont").mouseout(function () {
            $(".hovercont .manageContent").hide();
        });
    },
    clickSwitch: function (_this, Obj) {
        if (_this != "" && _this != null && _this != undefined) {
            _this.parent("li").siblings("li").removeClass("leftBar_select");
            _this.parent("li").addClass("leftBar_select");
            if(Obj == "#my_network"){//特殊情况（公用一个内容）
        		$("#enterprise_document").siblings("div").hide();
        		$("#enterprise_document").show();
        	}else{
        		$(Obj).siblings("div").hide();
        		$(Obj).show();
        	}
        } else {
            return false;
        }
    },
    checkall: function () {
        $(".checkall").click(function () {//全选
            var che = $(this).parents("tr").siblings().find(".magic-checkbox[type='checkbox']");
            if (this.checked) {
                che.prop("checked", true);
            } else {
                che.prop("checked", false);
            }
        });
        $(".checkallObj").click(function () {
            var che = $(this).closest("ul").siblings("ul").children("li").find(".magic-checkbox[type='checkbox']");
            if ($(this).prop("checked")) {
            	che.each(function(){
            		$(this).prop("checked", "checked");
            	})
            } else {
                che.prop("checked", false);
            }
        });
    },
    checkallPro: function (obj, tbid,staticPro) {//全选       staticPro="true"时为工具条静态显示隐藏
    	var tabTr = $("#" + tbid).find("tr");
        var checkBox = $("#" + tbid).find("tr td .magic-checkbox[type='checkbox']");
        var thumbnail = $("#" + tbid).siblings("#thumbnail").children().children();
        var tabSelectInp = $(obj).parents(".leftTh").siblings(".select_bounced");
        if (obj.checked) {
        	checkBox.prop("checked", true);
        	tabTr.addClass("selected");
        	if(staticPro == "true"){
        		if(tabTr.length == 0){
        			return;
        		}
        		tabSelectInp.show();
        		var checkedlength = checkBox.length;
        		// 选中一个或多个input框，显示的按钮
        		EnterPrise.toolmultiple(tabSelectInp,checkedlength,checkBox);
        		
        	}else{// 有详细、缩略图、列表、权限
        		EnterPrise.toolbarObj={};
        		EnterPrise.filetype = '';
        		EnterPrise.numerical = 0;
                //列表显示  全选
                if($("#" + tbid).is(":visible")){
                	checkBox.each(function () {
                    	EnterPrise.intersectionData($(this),tbid,tabSelectInp);
                	});
                	//详细内容的显示
                	var selectedObj=$(".detailTop").find(".fontColor");
                	var dataNum=selectedObj.attr("data-num");
                	EnterPrise.latestId=EnterPrise.detailedFunc(checkBox,1,0);
                	EnterPrise.detailRequest('',dataNum);
                }
            	//缩略图形式  全选
                if($("#" + tbid).is(":hidden")){
                	var showObj=$("#" + tbid).closest(".publicMiddle").find(".comStl-show");
                	var seletImgObj=showObj.find(".selectImgFile-Input");
                	if(showObj.is(":visible")){
                		seletImgObj.show();
                		showObj.children("ul").children("li").addClass("selectImg-File selectIcon");
                		var mainId;
                		if(tbid == 'recordTab'){
                			mainId = "thumbnail";
                		}
                		thumbnail.each(function () {
            	    		if($(this).hasClass("selectIcon")){
            	    			EnterPrise.intersectionData($(this),mainId,tabSelectInp);
            	    		}
            	    	});
                	}
                }
        	}
        } else {
        	checkBox.prop("checked", false);
        	tabTr.removeClass("selected");
            if(tabSelectInp.length > 0){
            	tabSelectInp.hide();
            }
            if(staticPro != "true"){
                //列表  全选
                if($("#" + tbid).is(":visible")){
                	//详细内容的显示
                	var detailCont = $("#" + tbid).parents(".middleDiv").siblings(".detailCont");
                	if(detailCont.length > 0){
    	            	var selectedObj=$(".detailTop").find(".fontColor");
    	            	var dataNum=selectedObj.attr("data-num");
    	            	EnterPrise.latestId=EnterPrise.detailedFunc(checkBox,2,0);
    	            	EnterPrise.detailRequest('',dataNum);
                	}
                }
                //缩略图
                if($("#" + tbid).is(":hidden")){
                	var showObj=$("#" + tbid).closest(".publicMiddle").find(".comStl-show");
                	var seletImgObj=showObj.find(".selectImgFile-Input");
                	if(showObj.is(":visible")){
                		seletImgObj.hide();
                		showObj.children("ul").children("li").removeClass("selectImg-File selectIcon");
                	}
                }
            }
        }
    },
    deletRow: function (containId, url,html,deletFunc) {//全删
    	var contIdlength=$("#" + containId).find(".magic-checkbox:checked").length;
    	if(contIdlength == 0){
    		JCPublicUtil.dialogWindow("提示",CE.deleteTipFuc("请先选择要删除的"+html+"!"),"确定",null,"取消",null);
    	}else{
    		JCPublicUtil.dialogWindow("确定删除",CE.deleteTipFuc("你确定要删除所选中的"+html+"？"),"确定",function(){
        		var check = $("#" + containId);
                var che = check.find(".magic-checkbox:checked").not(".checkall");
                //var dataId=check.find(".magic-checkbox:checked").not(".checkall").attr("id");
                var dataId = "";
                check.find(".magic-checkbox:checked").not(".checkall").each(function () {
                    dataId += $(this).attr("id") + ",";
                })
                Ajax.doRequest(Ajax.formatURL(url), "post", {
                    ids: dataId
                }, function (data) {
                    if (data.resultCode == "000000") {
                        if (che.get(0).checked) {
                            //che.parents("tr").remove();
                        	var type=0;
                        	deletFunc(type);
                            CE.handleMsg(1,data.resultMessage);
                        }
                    } else {
                    	CE.handleMsg(0,data.resultMessage);
                    }
                }, function () {
                }, 6000, false, "json");
        	},"取消",null); 
    	}
    	
    },
    emptyOrRecover: function (title,containId, url,html,getDataFunc) {//清空或者恢复
    	CE.piwikCom(title);
		var dialogObj = JCPublicUtil.dialogWindow(title,CE.deleteTipFuc("你确定"+html+"？"),"确定",function(){
			CE.piwikCom(title);
    		var check = $("#" + containId);
            var che = check.find(".magic-checkbox").not(".checkall");
            var dataId = "";
            	che.each(function () {
                dataId += $(this).attr("id") + ",";
            })
            if(dataId == ""){//列表中没有数据就不要发起请求了
            	CE.handleMsg(0,"没有数据");
            	return ;
            }
            Ajax.doRequest(Ajax.formatURL(url), "post", {
                ids: dataId
            }, function (data) {
                if (data.resultCode == "000000") {
                	getDataFunc();
                    CE.handleMsg(1,data.resultMessage);
                } else {
                	CE.handleMsg(0,data.resultMessage);
                }
            }, function () {
            }, 6000, false, "json");
    	},"取消",function(){
    		CE.piwikCom(title);
    	}); 
    	return dialogObj;
    },
    /* 刷新触发点击事件 */
    showPageAtIndex:function(id){
    	if(id == "#my_network"){//特殊情况（公用一个内容）
    		$("#enterprise_document").siblings("div").hide();
    		$("#enterprise_document").show();
    	}else{
    		$(id).siblings("div").hide();
    		$(id).show();
    	}
		var _this = $("a[href="+id+"]");
		_this.trigger("click");
		
	},
	//组装人员选择器 ->  容器
	/**
	 * postObj = {
	 * 	classObj:{
	 * 		relativeObj:"addObject",	//用于绝对定位的相对定位父类  可不加此项 默认是classObj.parentObj
	 * 		parentObj:"FolderObject",	//限制范围的父类
	 * 		ObjAllAdd:"",				//ObjAll类名添加的地方   默认是在当前对象的父亲元素上  可不加此项	
	 * 		name:"author",				//复选框、单选框 name值
	 * 		selectAll_Id:"author_all",	//全选的id
	 * 		widthIs:0					//自定义宽度   可不加此项
	 * 		radio:0						//单选-> 0：右边数据单选  1：树形数据单选	可不加此项
	 * 	},
	 * 	dataTxt:{0:"人员",1:"部门"},			//容器中头部显示的内容标题  当需要切换时，下标就会想当于postObj.dataNum 无需切换时不加此项
	 * 	dataUrl:0,							//区分数据 1、 0:通过固定接口获取（人员、部门、组、角色接口）,2、 1:自定义（打印、预览等）, 3、 直接传获取的数据
	 * 	dataNum:0							//区分显示结构(0 -> 人员(左右结构,左边树形、右边列表), 1 -> 部门(带有复选框的树形), 2 -> 组(列表))
	 * 	showNum:3							//显示选中个数，超过显示更多
	 *  callBack:function(){},				//回调函数
	 * 	errorTip:true						//验证
	 * }
	 */
	AssembledContainer:function(_this,postObj,event){
		var classObj = postObj.classObj;
		var relativeObj = classObj.relativeObj;
		var parentObj0 = classObj.parentObj;
		var ObjAllAdd = classObj.ObjAllAdd;
		var name = classObj.name;
		var selectAll_Id = classObj.selectAll_Id;
		var widthIs = classObj.widthIs;
		var radio = classObj.radio;
		var dataTxt = postObj.dataTxt;
		var dataUrl = postObj.dataUrl;
		var dataNum = postObj.dataNum;
		var showNum = postObj.showNum;
		var callBack = postObj.callBack;
		var errorTip = postObj.errorTip;
		
		var data;
		var _thisParent = $(_this).parent();
		var parentObj = _thisParent.parent();
		var selectObj = $("."+parentObj0).find(".selectObj");
	//	selectObj.remove();
		//ObjAll此类名必须有，选中的内容才能显示在页面上
		if(ObjAllAdd != undefined){
			$("."+ObjAllAdd).addClass("ObjAll");
		}else{
			_thisParent.addClass("ObjAll");
		}
		
		if(selectObj.length == 0){
			var stringBuilder = JCPublicUtil.StringBuilder();
			stringBuilder.Append('				 <div class="selectObj" id="selectipObj">');
			if(dataTxt != undefined){
				stringBuilder.Append('					<div class="titleCont">');
		        stringBuilder.Append('						<ul class="title">');
		        for(var j in dataTxt){
		        	if(j == 0){
		        		stringBuilder.Append('							<li class="selectColor" data-txt="'+j+'" onclick=CE.clickslt($(this),"'+parentObj0+'","'+name+'","'+selectAll_Id+'")>'+dataTxt[j]+'</li>');
		        	}else{
		        		stringBuilder.Append('							<li data-txt="'+j+'" onclick=CE.clickslt($(this),"'+parentObj0+'","'+name+'","'+selectAll_Id+'")>'+dataTxt[j]+'</li>');
		        	}
				} 
		        stringBuilder.Append('						</ul>');
		        stringBuilder.Append('					</div>');
			}
	        stringBuilder.Append('					<div class="show_objcontent">');
	        
	        stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div class="operBtn">');
	        stringBuilder.Append('						<input type="button" class="BtnOk" value="确定">');
	        stringBuilder.Append('						<input type="button" class="BtnCancel" value="取消">');
	        stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div style="clear:both;"></div>');
	        stringBuilder.Append('				</div>');
	        if(relativeObj != undefined){//自定义相对定位元素
	        	$("."+relativeObj).append(stringBuilder.ToString());
	        }else{
	        	 parentObj.append(stringBuilder.ToString());
	        }
	        selectObj.slideToggle("fast");
		}else{
			selectObj.slideToggle("fast");
			return;
		}

        if(widthIs == undefined && widthIs != 0){//计算宽度
        	parentObj.find(".selectObj").css("width",parentObj.width());
        }

        //获取数据 初始化
        if(dataUrl == undefined){
        	data = '';
        }
        else if(dataUrl === 0){ //左右结构 ,默认数据     全等
        	var radioType;
			data = CE.get_personselector_data(dataNum);	
			if(radio != undefined && radio == 0){//单选
				radioType = 0;
			}
			CE.showOrgUser($("."+parentObj0),data[0].id, name,radioType);
		}
		else if(dataUrl == 1){ //列表结构,自定义数据
			data=[{id:"110104",text:Lang.dataInfo_context_print},{id:"110103",text:Lang.dataInfo_context_preview},{id:"110203",text:Lang.dataInfo_context_copy},{id:"110105",text:Lang.dataInfo_context_downloadPDF},{id:"110106",text:Lang.dataInfo_context_download_source}];
		}else{
			data = dataUrl;
			if(dataNum == 0){//左右结构,后台传输数据
				if(data[0] == undefined || data[0] == null){
					CE.handleMsg(0,Lang.dataInfo_context_nopartner);
					return;
				}
				CE.showOrgUser($("."+parentObj0), data[0].id, name,null,1);//外部接收人
			}
		}
        
        var radioTree;
		if(radio != undefined && radio == 1){//单选树形
			radioTree = 0;
		}
		CE.personselector(dataNum,data,$("."+parentObj0),name,selectAll_Id,'',radioTree);
		//按确定按钮操作
		CE.multiplechoice("." + parentObj0,showNum,callBack,event,errorTip);
		
	},
    //num=0 选择人员；num=1 选择部门、组 ；num=2 选择角色;
	//dataType 区分num == 1时，根据类型调用不同接口（dataType = 0：组）
    get_personselector_data:function(num,dataType){
    	var data = null;
        var url = "/pc/getOrgTree.do";
        if (num == 0 || num == 1) {
            url = "/pc/getOrgTree.do";
            if(dataType != undefined && dataType == 0){//组
        		url = "/pc/getGroupTree.do";
        	}
        } 
        else if (num == 2) {//角色
        	url = "/pc/getAllRole.do";
        }
    	$.ajax({
    		timeout : 6000,
    		type : "post",
    		async : false,
    		data : {
    		},
    		dataType : "json",
    		url :basePath+url,
    		success : function(retdata) {
    			if (retdata.resultCode == '000000') {
    				data = $.parseJSON( retdata.data );
    			}
    		},
    		error : function(){
    			Common.message("error","服务器异常");
    		}
    	});
    	return data;
    },
    showOrgUser:function(parentObj,orgId,ObjName,type,partnerUrl){
    	var org = {orgId:orgId, companyId:null,dataType:1};
    	var url = "/pc/getOrgUserData.do";
    	if(partnerUrl == 1){
    		url = "/pc/getCompanyPartnerContact.do";
    	}
    	JCPublicUtil.Ajax(basePath+url, "post", org, function(retdata) {
			if(retdata.resultCode == "000000"){
				var data = retdata.data.emlist;
				var currentPage = 1;
				if(partnerUrl == 1){
					currentPage = retdata.data.currentPage;
				}else{
					currentPage = retdata.data.orgUserVo.currentPage;
				}
				//将json字符串转换为json对象
				var stringBuilder = JCPublicUtil.StringBuilder();
				if(type == 0){
					stringBuilder.Append('			<ul id="listRadio" class="listInput">');
		            for (var i in data) {
		                stringBuilder.Append('				<li>');
		                stringBuilder.Append('					<input class="magic-checkbox" type="radio" name="'+ObjName+'" data-type="0" id="'+ObjName+i+'" data-id="' +data[i].id + '" value="' + data[i].name + '" />');
		                stringBuilder.Append('					<label for="'+ObjName+i+'">' + data[i].name + '</label>');
		                stringBuilder.Append('				</li>');
		            }
		            stringBuilder.Append('			</ul>');
				}else{
					stringBuilder.Append('			<ul>');
		            stringBuilder.Append('				<li>');
		            stringBuilder.Append('					<input type="hidden" id="currentPage" value="'+currentPage+'" />');
		            stringBuilder.Append('					<input class="magic-checkbox checkallObj" type="checkbox" name="'+ObjName+'" id="'+ObjName+'_all" value="" />');
		            stringBuilder.Append('					<label for="'+ObjName+'_all" style="color: #478de4;">全选</label>');
		            stringBuilder.Append('				</li>');
		            stringBuilder.Append('			</ul>');
		            stringBuilder.Append('			<ul id="list" class="listInput">');
		            for (var i in data) {
		                stringBuilder.Append('				<li>');
		                stringBuilder.Append('					<input class="magic-checkbox" type="checkbox" name="'+ObjName+'" data-type="0" id="'+ObjName+i+'" data-id="' +data[i].id + '" value="' + data[i].name + '" data-partnerId="'+orgId+'" />');
		                stringBuilder.Append('					<label for="'+ObjName+i+'">' + data[i].name + '</label>');
		                stringBuilder.Append('				</li>');
		            }
		            stringBuilder.Append('			</ul>');
				}	
				parentObj.find("#orgUserUl").html(stringBuilder.ToString());
	            CE.checkall();
	            CE.loadpages("empScroll","orgUserUl",CE.addEmpData);
			}
		}, function() {
			CE.handleMsg(0,"error");
		}, 6000, false, "json");
		
    },
    /**
     * 
     * @param num -> num=0 人员(左右结构->左边树形，右边列表); num=1 部门、组（dataType=0） (带有复选框的树形); num=2 角色 (列表);    必填
     * @param data -> data 数据
     * @param parentObj -> 父级
     * @param ObjName -> ObjName checkbox的name值
     * @param selectAllId -> 全选 id
     * @param radioTo -> 判断是否是单选树形
     */
    personselector: function (num,data,parentObj,ObjName,selectAllId,dataType,radioTo) {
        if(data == undefined || data == null || data === ""){
            data = CE.get_personselector_data(num,dataType);
        }
        if(ObjName == undefined || ObjName==null || ObjName==""){
        	ObjName="ObjName";
        }
        if(selectAllId == undefined || selectAllId == null || selectAllId == ""){
        	selectAllId = "SelectAll";
        }
      //  var newObjAdd = ObjAdd.substring(1); 
        var stringBuilder = JCPublicUtil.StringBuilder();
        stringBuilder.Append('<div class="contentmain">');
        if (num == 0) {
            stringBuilder.Append('	<div class="personnelContent">');
            stringBuilder.Append('		<div class="showTree scrollCont">');
            stringBuilder.Append('			<ul id="list" class="ztree listInput">');
            
            stringBuilder.Append('			</ul>');
            stringBuilder.Append('		</div>');
            stringBuilder.Append('		<div class="nameobj scrollCont" id="empScroll">');
            stringBuilder.Append('			<ul id="orgUserUl">');

            stringBuilder.Append('			</ul>');
            stringBuilder.Append('		</div>');
            stringBuilder.Append('	</div>');
        }
        else if (num == 1) {
            stringBuilder.Append('	<div class="departmentContent" style="height: 100%;">');
            stringBuilder.Append('		<div class="showTree scrollCont roleRight">');
            stringBuilder.Append('			<ul id="list" class="ztree listInput">');
            
            stringBuilder.Append('			</ul>');
            stringBuilder.Append('		</div>');
            stringBuilder.Append('	</div>');
        }
        else if (num == 2) {
            stringBuilder.Append('	<div class="docuContent" style="height: 100%;text-align: left;">');
            stringBuilder.Append('		<div class="groupobj scrollCont">');
            stringBuilder.Append('			<ul>');
            stringBuilder.Append('				<li>');
            stringBuilder.Append('					<input class="magic-checkbox checkallObj" type="checkbox" name="'+ObjName+'" id="'+selectAllId+'" value="" />');
            stringBuilder.Append('					<label for="'+selectAllId+'" style="color: #478de4;">全选</label>');
            stringBuilder.Append('				</li>');
            stringBuilder.Append('			</ul>');
            stringBuilder.Append('			<ul id="doculist" class="listInput">');
            for (var i in data) {
                stringBuilder.Append('				<li>');
                if(dataType == undefined || dataType == ""){
                	stringBuilder.Append('					<input class="magic-checkbox" type="checkbox" name="'+ObjName+'" id="'+ObjName+i+'" data-type="3" data-id="' +data[i].id + '" value="' + data[i].text + '"/>');
                }else{
                	stringBuilder.Append('					<input class="magic-checkbox" type="checkbox" name="'+ObjName+'" id="'+ObjName+i+'" data-type="'+dataType+'" data-id="' +data[i].id + '" value="' + data[i].text + '"/>');
                }
                stringBuilder.Append('					<label for="'+ObjName+i+'">' + data[i].text + '</label>');
                stringBuilder.Append('				</li>');
            }
            stringBuilder.Append('			</ul>');
            stringBuilder.Append('		</div>');
            stringBuilder.Append('	</div>');
        }
        stringBuilder.Append('</div>');
        parentObj.find(".show_objcontent").append(stringBuilder.ToString());

        CE.checkall();

        var zNodes=data;
		var setting1 = {
			 view: { 
				 showLine: false
			 },
             check: {  
                enable: true,
                chkStyle : "checkbox",
                chkboxType:{ "Y": "s", "N": "s" }
             },  
             data: {  
                simpleData: {  
                    enable: true  
                }, 
                view: {
                	fontCss : {color:"#333", background:"fff"}
         		}
             } 
		};
		var setting2 = { 
			 view: { 
				 showLine: false				
			 },
             data: {  
                simpleData: {  
                    enable: true  
                }
	        },
	        callback:{
            	onClick:callbackUl
            }  
		};
		//树形单选框
		var setting4={
			 view: { 
				 showLine: false
			 },
	         check: {  
	            enable: true,
	            chkStyle : "radio",
	            radioType:"all"
	         },  
	         data: {  
	            simpleData: {  
	                enable: true  
	            }, 
	            view: {
	            	fontCss : {color:"#333", background:"fff"}
	     		}
	         } 	
		}
		var obj = parentObj.find(".listInput");
		if(num==1){ //部门
			var setting = setting1;
			if(radioTo == 0){//带有树形的单选框
				setting = setting4;
			}
			var ztree=$.fn.zTree.init(obj,setting,zNodes);//生成带有checkbox的ztree树 
			zTree_Menu = $.fn.zTree.getZTreeObj("list");
			zTree_Menu.expandAll(true);
        }
		else if(num==0){ //人员
			var ztree=$.fn.zTree.init(obj,setting2,zNodes);//生成普通ztree树 
        	zTree_Menu = $.fn.zTree.getZTreeObj("list");
    		zTree_Menu.expandAll(true);
			//默认选中根节点
			var nodes = zTree_Menu.getNodes();
			if (nodes.length>0){
		        var node = zTree_Menu.selectNode(nodes[0]);
		        zTree_Menu.selectNode(node);
			}
		}
		function callbackUl(event, treeId, treeNode){
			var parentNode = $("#"+treeId).closest("tr");
			var AdminparentNode = $("#"+treeId).closest(".radioToget");
		    if(parentNode.hasClass("closestZtree")){//区分接口
				CE.showOrgUser(parentObj,treeNode.id,ObjName,"",1);
			}
			else if(AdminparentNode.length > 0){
				CE.showOrgUser(parentObj,treeNode.id,ObjName,0);//移交管理员  单选框
			}else{
				CE.showOrgUser(parentObj,treeNode.id,ObjName);
			}
		}
    },
    /**
     * postObj = {
	 * 	classObj:{
	 * 		parentObj:"FolderObject",	//限制范围的父类
	 * 		name:"author",				//复选框、单选框 name值
	 * 		selectAll_Id:"author_all",	//全选的id
	 * 	},
	 * dataObj:data,	//左侧树形数据
	 * pageUrl:"",		//接口
	 * selectId:{id:selectId} //选中左侧树形的节点id 
	 * }
     */
    //添加文档
    addDocumentFunc:function(postObj){
    	var parentObj = postObj.classObj.parentObj;
    	var name = postObj.classObj.name;
    	var selectAll_Id = postObj.classObj.selectAll_Id;
    	var dataObj = postObj.dataObj;
    	var pageUrl = postObj.pageUrl;
    	var selectId = postObj.selectId;
    	var selectObj = $("."+parentObj).find(".selectObj");
		if(selectObj.length == 0){
			var stringBuilder = JCPublicUtil.StringBuilder();
			stringBuilder.Append('				 <div class="selectObj" id="selectipObj">');
			stringBuilder.Append('					<div class="titleCont">');
	        stringBuilder.Append('						<ul class="title">');
    		stringBuilder.Append('							<li class="selectColor" data-flag=0 onclick=CE.documentshow(this,"'+parentObj+'")>'+Lang.dataInfo_docCirculatedChild_document+'</li>');
    		stringBuilder.Append('							<li data-flag=1 onclick=CE.documentshow(this,"'+parentObj+'")>'+Lang.dataInfo_docCirculatedChild_localupload+'</li>');
	        stringBuilder.Append('						</ul>');
	        stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div class="show_objcontent">');
	        
	        stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div class="localupdata" id="localupdata" style="display:none;height:180px">');
			stringBuilder.Append('						<div class="localupdataTip">'+Lang.dataInfo_docCirculatedChild_tip+'</div>');
			stringBuilder.Append('						<input type="button" value="'+Lang.dataInfo_docCirculatedChild_localupload+'" class="localupdataBtn" style="display:none;" />');
			stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div class="operBtn">');
	        stringBuilder.Append('						<input type="button" class="BtnOk" value="'+Lang.common_button_sure+'">');
	        stringBuilder.Append('						<input type="button" class="BtnCancel" value="'+Lang.common_button_cancel+'">');
	        stringBuilder.Append('					</div>');
	        stringBuilder.Append('					<div style="clear:both;"></div>');
	        stringBuilder.Append('				</div>');
	        $("."+parentObj).append(stringBuilder.ToString());
	        selectObj.slideToggle("fast");
		}else{
			selectObj.slideToggle("fast");
			return;
		}
		CE.fileselector(dataObj,parentObj,pageUrl);
		DocumentCircul.addFileRightData("."+parentObj,selectId,name);
		CE.multiplechoice("."+parentObj);
		//滚动条
		var ObjAll = $("."+parentObj).find(".ObjAll");
		CE.getCalssFun(ObjAll);
    },
    //点击切换   文档/本地上传
    documentshow:function(_this,parentObj){
    	$(_this).siblings("li").removeClass("selectColor");
    	$(_this).addClass("selectColor");
    	var dataFlag = $(_this).attr("data-flag");
    	var show_objcontent = $("."+parentObj).find(".show_objcontent");
    	var localupdata = $("."+parentObj).find(".localupdata");
    	if(dataFlag == 0){
    		show_objcontent.show();
    		localupdata.hide();
    	}
    	else if(dataFlag == 1){
    		localupdata.show();
    		show_objcontent.hide();
    	}
    },
    //文件选择器
    fileselector: function (data,parentObj,pageUrl) {
    	 var stringBuilder = JCPublicUtil.StringBuilder(); 
		 stringBuilder.Append('<div class="contentmain">');
	     stringBuilder.Append('	<div class="personnelContent">');
	     stringBuilder.Append('		<div class="showTree scrollCont">');
	     stringBuilder.Append('			<ul id="filelist" class="ztree listInput flieZtree">');
	     stringBuilder.Append('			</ul>');
	     stringBuilder.Append('		</div>');
	     stringBuilder.Append('		<div class="nameobj scrollCont" id="empScroll">');
	     stringBuilder.Append('			<ul id="orgUserUl">');
	
	     stringBuilder.Append('			</ul>');
	     stringBuilder.Append('		</div>');
	     stringBuilder.Append('	</div>');
	     stringBuilder.Append('</div>');
        $("."+parentObj).find(".show_objcontent").html(stringBuilder.ToString());
        CE.checkall();
        CE.getCalssFun($('.scrollCont'));
        var zNodes=data;
        var setting = { 
			    view: { 
					showLine: false,
					addDiyDom:Bounced.replaceId
			    },
		        check: {  
		            enable: true,
		            chkStyle : "checkbox",
		            chkboxType:{ "Y": "", "N": "" }
		        },
		        data: {  
		            simpleData: {  
		                enable: true  
		            }, 
		            view: {
		                fontCss : {color:"#333", background:"fff"}
		         	}
		        },
		        async: {
		    		enable: true,
		    		url: Ajax.formatURL(pageUrl),
		    		autoParam: ["id=pid"]
		    	},
		    	callback:{
		            onClick:callbackUlEsp
		        }  
		    };
        var ztree=$.fn.zTree.init($("#filelist"),setting,zNodes);//生成普通ztree树 
    	var zTree_Menu = $.fn.zTree.getZTreeObj("filelist");

    	//生成右边数据
        function callbackUlEsp(event, treeId, treeNode){
        	var selectId = Bounced.getReplaceId("filelist");
        	DocumentCircul.addFileRightData("."+parentObj,{id:selectId});
		}
    },
    //自定义滚动条
    getCalssFun: function (obj) {
        obj.niceScroll({
            cursorcolor: "#ccc",
            cursoropacitymax: 1,
            touchbehavior: false,
            cursorwidth: "5px",
            cursorborder: "0",
            cursorborderradius: "5px",
            autohidemode: false,
            horizrailenabled: true
        });
    },
    //切换0、1、2三种情况
    clickslt: function (_this,parentObj0,name,selectAll_Id) {
    	var parentObj = $("."+parentObj0);
        var num = '',dataType;
        _this.siblings("li").removeClass("selectColor");
        _this.addClass("selectColor");
        parentObj.find(".contentmain").remove();
        var dataTxt = _this.attr("data-txt");
        if (dataTxt == 0) {//人员
            num = 0;
            //默认显示公司的数据
            var data=CE.get_personselector_data(0);
    		CE.showOrgUser(parentObj,data[0].id,name);
        }
        else if (dataTxt == 1 || dataTxt == 2) {//部门、组
            num = 1;
            if(dataTxt == 2){//组
            	dataType = 0;
            }
        }
        else if (dataTxt == 3) {//角色
            num = 2;
        }
        CE.personselector(num,'',parentObj,name,selectAll_Id,dataType);
    },
    //人员多选相关操作     ObjParent为指定的父类（整个tr的）     showNum显示个数	callBack回调函数
    multiplechoice: function (ObjParent,showNum, callBack,event,errorTip) {//添加或其他的弹框  事件
    	var dataId = {};
    	var ObjAll = $(ObjParent).find(".ObjAll");
    	var deleteObj = ObjAll.find(".deleteObj");
    	var operateObjUl = $(ObjParent).find("#operateObjUl");
    	var selectObj = $(ObjParent).find(".selectObj");
    	var listInput = $(ObjParent).find(".listInput");
    	//点击确认事件
        $(".BtnOk").unbind("click").click(function () {
        	if(event){
        		JCPublicUtil.stopPropagation(event);
        	}
        	
        	var rightsObjArray = [];

        	$(this).parents(".dialogWindow").css("margin-top","auto");
        	//获取旧数据的id
        	deleteObj.each(function(){
        		var datatype = $(this).attr("data-type");
        		var data_id = $(this).attr("data-id");
        		dataId[data_id] = $(this).attr("title");
        	});
        	
        	//获取input框的数据(单选/复选框)
        	var checkbox = $(ObjParent).find(".listInput").find("input.magic-checkbox");
        	if(checkbox.length > 0){
        		var InputType = checkbox.attr("type");
        		$(ObjParent+" .listInput input:"+InputType+":checked").each(function (index) {
                    if (dataId[$(this).attr("data-id")] == undefined) {
                    	var dataIdval = $(this).attr("data-id");
                    	var dataval = $(this).val();
                    	var datatype = $(this).attr("data-type");
                    	var datapart = $(this).attr("data-partnerid");
                        dataId[$(this).attr("data-id")] = $(this).val();

                        if(callBack != undefined){//组装json数组格式数据
                        	var obj = {};
                        	obj.parentObj = ObjParent;
                        	obj.dataIdval = dataIdval;
                        	obj.dataval = dataval;
                        	obj.datatype = datatype;
                        	rightsObjArray.push(obj);

                    	}else{
                    		if(InputType == "radio"){
                            	deleteObj.remove();
                            }
                            operateObjUl.append('<li data-type="' + datatype + '" data-id="' + dataIdval + '">' + dataval + '</li>');
                            ObjAll.append('<div class="deleteObj" style="display:none;"  data-belong="'+datapart+'" data-type="' + datatype + '" data-id="' + dataIdval + '" title="'+ dataval +'"><span>' + dataval + '</span><a>×</a></div>');
                            //显示个数，多余的隐藏
                            if(showNum == ''){
                            	var deleLength = ObjAll.find(".deleteObj").length;
                            	ObjAll.find(".deleteObj").slice(0, deleLength).show();
                            }else{
                            	 ObjAll.find(".deleteObj").slice(0, showNum).show();
                            }
                    	} 
                    }
                });
        	}
        	
        	//获取checkbox的树形数据
        	var treeObj=$.fn.zTree.getZTreeObj("list");
        	if(treeObj != undefined && treeObj != null && treeObj != ""){
        		var nodes=treeObj.getCheckedNodes(true);
            	if(nodes != undefined || nodes != null || nodes != ""){
            		for(var i=0;i<nodes.length;i++){
                		if(dataId[nodes[i].id] == undefined){
                			var dataRadio = $(ObjParent).attr("data-radio");
                			if(dataRadio != undefined && dataRadio == "true"){//单选树形  只显示一个选项
                				deleteObj.remove();
                			}
                			var dataIdval = nodes[i].id;
                        	var dataval = nodes[i].name;
                        	var datatype = nodes[i].dataType;
                        	if(datatype == 2){
                        		if(nodes[i].ifGroup == 0){continue;}
                        	}
                        	
                        	if(callBack != undefined){//组装json数组格式数据
                        		var obj = {};
                        		obj.parentObj = ObjParent;
                        		obj.dataIdval = dataIdval;
                        		obj.dataval = dataval;
                        		obj.datatype = datatype;
                            	rightsObjArray.push(obj);
                        	}else{
                        		dataId[nodes[i].id] = nodes[i].name;
                                
                                ObjAll.append('<div class="deleteObj" style="display:none;" data-type="' + datatype + '" data-id="' + dataIdval + '" title="'+ dataval +'"><span>' + dataval + '</span><a>×</a></div>');
                                ObjAll.find(".deleteObj").slice(0, showNum).show();
                        	}  
                		}
        	        }
            	}
        	}

        	if(callBack != undefined && Object.prototype.toString.call(callBack) == "[object Function]"){
        		callBack(rightsObjArray);
        	}
        	
        	if(errorTip == true){//验证
        		if(ObjAll.find(".deleteObj").length > 0){
        			$(ObjParent).find(".errorTip").hide();
        		}
        	}
        	
        	selectObj.find("ul.title").children("li[data-txt='0']").click();//一个页面同时存在input框和树形checkbox时,先执行树形checkbox后执行input框，会把树形checkbox的值带入（时间限制-限制对象、重复-每周）
        	ObjAll.find(".evenMoreLevel").remove();
        	if(showNum != ''){
        		if (ObjAll.find(".deleteObj").length > showNum) {
                	//生成省略号
                	var stringBuilder = JCPublicUtil.StringBuilder();
                	stringBuilder.Append('<a class="evenMore evenMoreLevel"><span>...</span></a>');
                	ObjAll.append(stringBuilder.ToString());
                	CE.ComMultipleOperation(ObjParent,showNum);//相关操作
                }
        	}
            CE.ComMultipleDelet(ObjParent,showNum);//删除对象
            $(".titleCont ul").not(".circluTitle").find("li").removeClass("selectColor");
            selectObj.slideToggle("fast",function(){$(this).remove();});
        });
        
        //点击取消事件
        $(".BtnCancel").unbind("click").click(function () {
        	var selectObj = $(this).parents(".selectObj");
            $(".titleCont ul").not(".circluTitle").find("li").removeClass("selectColor");
            $(this).parents(".dialogWindow").css("margin-top","auto"); 
            selectObj.slideToggle("fast",function(){$(this).remove();});
        });
        CE.getCalssFun($(".ContMain"));//滚动条
    },
    //编辑
    multipleEditReveal:function(ObjParent,showNum,list){
    	var ObjAll = $(ObjParent).find(".ObjAll");
    	var deleteObj = ObjAll.find(".deleteObj");
    	deleteObj.remove();
    	$(ObjParent+" .ContMain").html('');
    	var listType='';
    	for (var i = 0; i < list.length; i++) {
			var str = '<div class="deleteObj" style="display:none;" data-type="'+ list[i].type + '" data-id="' +list[i].id+ '" title="'+ list[i].name + '"><span>' + list[i].name + '</span><a>×</a></div>';
			ObjAll.append(str);
    	}
    	//显示个数，多余的隐藏
        if(showNum == ''){
        	var deleLength = ObjAll.find(".deleteObj").length;
        	ObjAll.find(".deleteObj").slice(0, deleLength).show();
        }else{
        	 ObjAll.find(".deleteObj").slice(0, showNum).show();
        }
        
        if(showNum != ''){
        	if (ObjAll.children(".deleteObj").length > showNum) {
        		var stringBuilder = JCPublicUtil.StringBuilder();
            	stringBuilder.Append('<a class="evenMore evenMoreLevel"><span>...</span></a>');
            	ObjAll.append(stringBuilder.ToString());
            	CE.ComMultipleOperation(ObjParent,showNum);
        	}
        }
    	CE.ComMultipleDelet(ObjParent,showNum);
    },
    //删除对象
    ComMultipleDelet:function(ObjParent,showNum){
        $(ObjParent+" .ObjAll .deleteObj >a").click(function () {
        	var deleteClosest = $(this).closest(".deleteObj");
            var ObjId = deleteClosest.attr("data-id");
            $(ObjParent+' .ContMain .deleteObj[data-id="'+ObjId+'"]').remove();
            deleteClosest.remove();
            $(ObjParent+" .ObjAll .deleteObj").slice(0, showNum).show();
            if ($(ObjParent+" .ObjAll").children(".deleteObj").length <= showNum) {
            	$(ObjParent+" .evenMore").hide();
            }
        });
    },
    //相关操作
    ComMultipleOperation:function(ObjParent,showNum){
	    //展示更多
	    $(ObjParent+" .evenMore").unbind("click").click(function () {
	    	//生成点击…的下拉框
	    	$(ObjParent+" .MoreCont").remove();
        	var stringBuilder1 = JCPublicUtil.StringBuilder();
	        stringBuilder1.Append('				<div class="MoreCont" style="display:none;width: 310px;top: 38px;">');
	        stringBuilder1.Append('					<div class="moreAll" style="position:relative;">');
	        stringBuilder1.Append('						<div class="ContMain" style="width:260px;">');
	        stringBuilder1.Append('						</div>');
	        stringBuilder1.Append('						<div class="narrowed"><span> << </span></div>');
	        stringBuilder1.Append('					</div>');
	        stringBuilder1.Append('					<div class="RemoveCont">');
	        stringBuilder1.Append('						<input class="clearBtn" type="button" value="'+Lang.common_button_clean+'"/>');
	        stringBuilder1.Append('					</div>');
	        stringBuilder1.Append('				</div>');
	        $(ObjParent+" .ObjAll").after(stringBuilder1.ToString());
	        CE.getCalssFun($(".ContMain"));
	        
	        $(this).siblings(".deleteObj").each(function(index){
	        	var stringBuilder = JCPublicUtil.StringBuilder();
	        	$(ObjParent+" .ContMain").append('<div class="deleteObj" data-type="' + $(this).attr("data-type") + '" data-id="' + $(this).attr("data-id") + '" title="'+ $(this).attr("title") +'"><span>' + $(this).find("span").text() + '</span><a>×</a></div>');
	        });
	        
	    	var MoreCont= $(this).closest("td").find(".MoreCont");
	    	MoreCont.slideToggle("fast");
	    	
		    //收起
		    $(ObjParent+" .narrowed").unbind("click").click(function () {
		        $(ObjParent+" .MoreCont").slideToggle("fast");
		        if ($(ObjParent+" .ObjAll .deleteObj").length <= showNum) {
		            $(ObjParent+" .evenMore").hide();
		        }
		    });
		    
		    //清除全部
		    $(ObjParent+" .clearBtn").click(function () {
		        $(ObjParent+" .ObjAll").children(".deleteObj").remove();
		        $(ObjParent+" .ContMain").children(".deleteObj").remove();
		    });
		    
		    //删除按钮
		    $(ObjParent+" .ContMain .deleteObj >a").click(function () {
	            var ObjId = $(this).closest(".deleteObj").attr("data-id");
	            $(ObjParent+' .ObjAll .deleteObj[data-id="'+ObjId+'"]').remove();
	            $(ObjParent+" .ObjAll .deleteObj").slice(0, showNum).show();
	            $(this).closest(".deleteObj").remove();
	        });

	    });
	    
    },
    setImagePreview: function (selfid, imgid) {//上传图片
        var docObj = document.getElementById(selfid);
        var imgObjPreview = document.getElementById(imgid);
        if (docObj.files && docObj.files[0]) {
            imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            imgObjPreview.style.display = "block";
        }
    },
    //下拉加载分页
    loadpages:function(winId,douId,ajaxFuc,extendAjaxFun){
		 $("#"+winId).off("scroll").on("scroll",function(){
			 if($("#"+winId).attr("data-scroll") != "false"){
				var srollPos = $("#"+winId).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度) 
				if(($("#"+douId).height()-parseFloat($("#"+winId).height()) - 3) < srollPos) {
					$("#"+winId).attr("data-scroll","false");
					//用于人员选择器中，分页加载使用
					var ztreeId = $("#"+winId).closest("tr").find(".ztree").attr("id");//获取部门树的id
					var treeObj=$.fn.zTree.getZTreeObj(ztreeId);//获取树
					var parame = {};//回调函数参数
					if(treeObj != undefined && treeObj != null && treeObj != ""){
						var selectedNodes = treeObj.getSelectedNodes();
						var orgId = "";
						var currentPage = $("#"+winId).find("#currentPage").val()*1+1;
						if(selectedNodes != undefined && selectedNodes != null && selectedNodes != ""){
							orgId = selectedNodes[0].id;
						}
						var ObjName = $("#"+winId).find(".checkallObj").attr("name");
						var ObjAdd = $("#"+winId).closest("tr").attr("class");;
						parame.ObjAdd = ObjAdd;
						parame.orgId = orgId;
						parame.ObjName = ObjName;
						parame.currentPage = currentPage;
					}
					//ajax请求 
					if(ajaxFuc != "" && ajaxFuc != null && ajaxFuc != undefined){
						ajaxFuc(null,"",parame);
					}
					if(extendAjaxFun != "" && extendAjaxFun != null && extendAjaxFun != undefined){
						setTimeout(extendAjaxFun,1);
					}
				} 	
			}
			
		 });
    },
    loadfail:function(type,extendObj){ //加载显示  nullsearch->没有搜索到匹配结果   nulldata->页面上没有数据   loading->加载中  str->描述文字
    	var ObjId=extendObj.id;
    	var ObjTipStr=extendObj.str;
    	var StrId=extendObj.StrId;
    	var ContentHtml=extendObj.ContentHtml;
    	var upload=extendObj.upload;
    	var uploadFunc=extendObj.uploadFunc;
    	//$("#"+ObjId+" "+"."+ContentHtml).hide();
    	switch(type){
			case "nullsearch":
				var stringBuilder = JCPublicUtil.StringBuilder();
				stringBuilder.Append('<div id='+StrId+' class="uploadMsg" style="width:100%;">');
				stringBuilder.Append('	<div class="TipContIcon">');
				stringBuilder.Append('		<div class="dicon11_7" style="margin:0 auto;"></div>');
				stringBuilder.Append('		<div class="Tiptext">'+ObjTipStr+'</div>');
				stringBuilder.Append('	</div>');
				stringBuilder.Append('</div>');
				$("#"+ObjId).append(stringBuilder.ToString());
			break;
			case "nulldata":
				var stringBuilder = JCPublicUtil.StringBuilder();
				stringBuilder.Append('<div id='+StrId+' class="uploadMsg" style="width:100%;">');
				stringBuilder.Append('	<div class="TipContIcon">');
				stringBuilder.Append('		<div class="dicon11_8" style="margin:0 auto;"></div>');
				stringBuilder.Append('		<div class="Tiptext">'+ObjTipStr+'</div>');
				stringBuilder.Append('	</div>');
				stringBuilder.Append('</div>');
				$("#"+ObjId).append(stringBuilder.ToString());
				//CE.ScrollToheight(ObjId, "search_container","scrollTableHead", "uploadMsg", 24);
			break;
			case "loading":
				var stringBuilder = JCPublicUtil.StringBuilder();
				stringBuilder.Append('<div id='+StrId+' class="uploadMsg" style="width:100%;">');
				stringBuilder.Append('	<div class="TipContIcon">');
				stringBuilder.Append('<div style="margin:0 auto;width:42px;height:42px;"><img src="../edp/asserts/themes/default/images/smallload.gif" alt="loading"></img></div>');
				stringBuilder.Append('<div class="Tiptext">'+ObjTipStr+'</div>');
				stringBuilder.Append('	</div>');
				stringBuilder.Append('</div>');
				$("#"+ObjId).append(stringBuilder.ToString());
				CE.ScrollToheight(ObjId, "search_container","scrollTableHead", "uploadMsg", 24);
			break;
			case "upload":
				var stringBuilder = JCPublicUtil.StringBuilder();
				stringBuilder.Append('<div id='+StrId+' class="uploadMsg" style="width:100%;z-index:999">');
				stringBuilder.Append('	<div class="TipContIcon">');
				stringBuilder.Append('		<div class="dicon9_2" style="margin:0 auto;"></div>');
				stringBuilder.Append('		<div class="Tiptext">');
				stringBuilder.Append('			<span>拖拽到空白处上传，或点击</span>');
				stringBuilder.Append('			<span style="color:#478de4;cursor:pointer" onclick="'+uploadFunc+'">'+ObjTipStr+'</span>');
				stringBuilder.Append('			<span>按钮</span>');
				stringBuilder.Append('		</div>');
				stringBuilder.Append('	</div>');
				stringBuilder.Append('</div>');
				$("#"+ObjId).append(stringBuilder.ToString());
				//CE.ScrollToheight(ObjId, "search_container","scrollTableHead", "uploadMsg", 24);
			break;
    	}
    },
    //加载结束   删除提示的图标
    loadsuccess:function(extendObj){
    	var ObjId=extendObj.id;
    	var StrId=extendObj.StrId;
    	var ContentHtml=extendObj.ContentHtml;
    	if(StrId != null && StrId != undefined && StrId != ""){
    		if(StrId == "loadingNull"){
    			$("#"+StrId).remove();
    			//$("#"+ObjId+" "+"."+ContentHtml).show();
    		}else{return false;}
    	}
    },
    
    //获取人员选择器选择对象ids
    //ObjParent 选择框父类
    //type:0-选择人员;1-选择部门;2-选择组;3-文档密级
    //返回ids格式：id1_id2_id3_
    getpersonselectorIds:function(ObjParent, type){
    	var dataIds = "";
    	$(""+ObjParent+" .ObjAll .deleteObj").each(function(){
    		var datatype = $(this).attr("data-type");
    		if(datatype == type){
    			var data_id = $(this).attr("data-id");
    			dataIds += data_id + "_";
    		}
    	});
    	return dataIds;
    },
    onCheck:function (event, treeId, treeNode){//class="tree"所在标签的id  获取ztree所有选中的复选框的id
        var treeObj=$.fn.zTree.getZTreeObj(treeId),
        	nodes=treeObj.getCheckedNodes(true),
        	selectId="";
        for(var i=0;i<nodes.length;i++){
        	selectId+=nodes[i].id + "_";
        }
        return selectId; 
    },
    //字符串null格式化为空
    formatStringNull:function(str){
    	if(str == null || str == undefined){
    		str = "";
    	}
    	return str;
    },
    //格式化人员选择器list，加type类型
    //0-选择人员;1-选择部门;2-选择组;3-文档密级
    formatpersonselectorlist:function(datalist, type){
    	if(datalist != null && datalist.length > 0){
    		for(var i in datalist){
    			datalist[i].type = type;
    		}
    	}
    	return datalist;
    },
	//格式化提示
	formatTipFuc:function(msg){
		var stringBuilder = JCPublicUtil.StringBuilder();
			stringBuilder.Append('<div style="padding: 50px 0px 32px 0px;font-size: 14px;">'+msg+'</div>');
		return stringBuilder.ToString();
	},
	addEmpData:function(_this,nameStyle,treeObj){
		var currentPage = treeObj.currentPage;
    	var org = {orgId:treeObj.orgId, companyId:null,dataType:1,currentPage:currentPage};
		Ajax.doRequest(Ajax.formatURL("/pc/getOrgUserData.do"), "post", org, function(retdata) {
			if(retdata.resultCode == "000000"){
				var data = retdata.data.emlist;
				//将json字符串转换为json对象
				var stringBuilder = JCPublicUtil.StringBuilder();
	            for (var i in data) {
	                stringBuilder.Append('				<li>');
	                stringBuilder.Append('					<input class="magic-checkbox" type="checkbox" name="'+treeObj.ObjName+'" data-type="0" id="' +data[i].id + '" value="' + data[i].name + '" />');
	                stringBuilder.Append('					<label for="' +data[i].id + '">' + data[i].name + '</label>');
	                stringBuilder.Append('				</li>');
	            }
	            $(treeObj.ObjAdd+" #orgUserUl").append(stringBuilder.ToString());
	            CE.checkall();
			}
			//滚动条 定义自定义属性
			$("#empScroll").attr("data-scroll","true");
		}, function() {
			//滚动条 定义自定义属性
			$("#empScroll").attr("data-scroll","true");
			CE.handleMsg(0,"error");
		}, 6000, false, "json");
		
    },
    onlySelectId:function(containerId){
    	var checkBox = '';
    	var magic = $("#"+containerId).find(".magic-checkbox");
    	checkBox = $("#"+containerId).find(".magic-checkbox:checked").not(".checkall");
    	if(magic.length == 0){//缩略图
    		checkBox = $("#"+containerId).find(".selectIcon");
    	}
        var dataId = "";
        checkBox.each(function () {
    		dataId += $(this).attr("id") + ",";
    	});
    	dataId=dataId.substring(0,dataId.length-1);
        return 	dataId;
    },
    //删除或恢复或撤销
    //单删直接调用
	handlefile:function(title,msg,url,id,getDataFunc,type,event){ // type:状态（锁定/解锁、收藏/取消收藏等）  event:阻止冒泡
		CE.piwikCom(title);
		if(event){
			JCPublicUtil.stopPropagation(event);
		}
		var status;
		if(type != null){
			status = type;
		}
    	var obj = JCPublicUtil.dialogWindow(title, CE.deleteTipFuc("你确定要"+msg+"？"), "确定",function(){
    	   CE.piwikCom("确定-"+title);
	       Ajax.doRequest(Ajax.formatURL(url), "post", {
	            ids: id +",",
	            type:status
	        }, function (data) {
	            if (data.resultCode == "000000") {
	            	setTimeout(getDataFunc,1);
	            	CE.handleMsg(1, data.resultMessage);
	            } else {
	            	CE.handleMsg(0, data.resultMessage);
	            }
	        }, function () {
	        		CE.handleMsg(0,"服务器连接异常");
	        }, 6000, false, "json");
    	},"取消",function(){
    		CE.piwikCom("取消-"+title);
    	});
    	return obj;
	},
	//删除或恢复或撤销选中
	//多删调用
	handlefileSelect:function(title,msg,url,tabid,getDataFunc){
		CE.piwikCom(title);
		var ids = CE.onlySelectId(tabid);
		CE.handlefile(title,msg,url,ids,getDataFunc);
	},
	//生成6位随机自然数
	randomNumber6:function(id){
		var num="";
		for(var i=0;i<6;i++){
			num+=Math.floor(Math.random()*10);
		}
		$("#"+id).val(num);
	},
	//随时提示所剩字数 
	remainNum:function(id){
		var result;
		var _this = $("#"+id);
		var numTipTop = _this.outerHeight(true)+12;
		var validate = _this.attr("data-validate");
		if(_this.siblings(".numTip").length == 0){
			_this.after('<div class="numTip"></div>');
		}
		var validateArray = validate.split(' ');
		for(var i = 0; i < validateArray.length; i++){
			var validateStr = validateArray[i];
			if(validateStr.indexOf("char") != -1){
				var resultStr = validateStr.substring(4,validateStr.length);
				var resultStrArray = resultStr.split('_');
			    result = resultStrArray[1];
			}
		}
		var currentLength = _this.val().length;
		var remainLength = parseInt(result) - parseInt(currentLength);
		_this.siblings(".numTip").css("top",numTipTop+"px").text(remainLength).show();
				
	},
	//转换显示容量大小：B、KB、M、G
	formatSize:function(size,space){
		var retSize = "";
		if(space == "true"){
			if(size < 1024){//B
					retSize = size + "B";
			}else if((size >= 1024) && size < 1024*1024){//KB
					size = (size/1024.0).toFixed(2);
					retSize = size + "KB";
			}else if((size >= 1024*1024) && size < 1024*1024*1024){//M
					size = (size/(1024*1024.0)).toFixed(2);
					retSize = size + "M";
			}else if((size >= 1024*1024*1024) && size < 1024*1024*1024*1024){//G
					size = (size/(1024*1024*1024.0)).toFixed(2);
					retSize = size + "G";
			}else if((size >= 1024*1024*1024*1024) && size < 1024*1024*1024*1024*1024){//T
				size = (size/(1024*1024*1024*1024.0)).toFixed(2);
				retSize = size + "T";
			}else{
				retSize = size + "B";
			}
		}else{
			if(size < 1024){//B
					retSize = size + " B";
			}else if((size >= 1024) && size < 1024*1024){//KB
					size = (size/1024.0).toFixed(2);
					retSize = size + " KB";
			}else if((size >= 1024*1024) && size < 1024*1024*1024){//M
					size = (size/(1024*1024.0)).toFixed(2);
					retSize = size + " M";
			}else if((size >= 1024*1024*1024) && size < 1024*1024*1024*1024){//G
					size = (size/(1024*1024*1024.0)).toFixed(2);
					retSize = size + " G";
			}else if((size >= 1024*1024*1024) && size < 1024*1024*1024*1024){//G
				size = (size/(1024*1024*1024*1024.0)).toFixed(2);
				retSize = size + " T";
			}else{
				retSize = size + " B";
			}
		}
		return retSize;
	},
	//富文本框
	crichText : function(id){
	  $("#"+id).htmlarea({
		  toolbar: [
                    ["bold", "italic", "underline", "|", "subscript", "superscript"],
					["increasefontsize", "decreasefontsize"],
					["orderedlist", "unorderedlist"],
					["indent", "outdent"],
					["justifyleft", "justifycenter", "justifyright"],
					["link", "unlink", "image", "horizontalrule"],
                    ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
                    ["cut", "copy", "paste"]
                ],
	         toolbarText: $.extend({}, jHtmlArea.defaultOptions.toolbarText, {
	        	 "html": "切换html视图",
				 "bold": "加粗",
				 "italic": "斜体 ",
				 "underline": "下划线",
				 "strikethrough":"删除线",
				 "subscript":"下标",
				 "superscript":"上标",
				 "forecolor": "字体颜色",
				 "increasefontsize":"增大字体",
				 "decreasefontsize":"减少字体",
				 "orderedlist":"项目列表",
				 "unorderedlist":"项目符号",
				 "indent":"增加缩进",
				 "outdent":"减少缩进",
				 "justifyleft":"左对齐",
				 "justifycenter":"居中对齐",
				 "justifyright":"右对齐",
				 "link":"插入链接",
				 "unlink":"删除链接",
				 "image":"插入图片",
				 "horizontalrule":"插入水平线",
				 "p": "分段",
				 "h1":"一级标题",
				 "h2":"二级标题", 
				 "h3":"三级标题", 
				 "h4":"四级标题", 
				 "h5":"五级标题", 
				 "h6":"六级标题",
				 "cut":"剪切", 
				 "copy":"复制", 
				 "paste":"粘贴"
			 }),
	        css: "../edp/asserts/libs/jHtmlArea-0.8.0.ExamplePlusSource/style/jHtmlArea.Editor.css"
	    });
	},
	/*退出登录*/
	logout:function() {
		JCPublicUtil.dialogWindow("退出登录", CE.deleteTipFuc("你确定要退出登录？"), "确定",function(){
			 Ajax.doRequest(Ajax.formatURL("/pc/loginUI"), "post", null, function(data) {
				 if (data.resultCode == "000000") {
 	       			var ucSite = data.data.ucSite;
 	       			var appId = data.data.appId;
 	       			var appKey = data.data.appKey;
 	       			var redirect_uri = basePath + "/pc/login";
 	       			var url=ucSite+"/pc/oauth/login?appId="+appId+"&appKey="+encodeURIComponent(appKey)+"&redirect_uri=" + redirect_uri;
 	       			window.location.href = url;
 			    }else {
 	        	    CE.handleMsg(0, data.resultMessage);
 	        	    window.location.href = basePath + "/pc/index";
 	            }
		        }, function () {
		        		CE.handleMsg(0,"服务器连接异常");
		     }, 6000, false, "json");
		},"取消",null);
    },
    /*顶部>更多>新建企业*/
    topNewEnterprise : function (num) {
    	var url = Ajax.formatURL("/pc/getIndustry.do");
		Ajax.doRequest(url, "post", {}, function(data) {
			var stringBuilder = JCPublicUtil.StringBuilder();
	        stringBuilder.Append('<div style="margin:10px 0px 5px 0px">');
	        stringBuilder.Append('	 <table border="0" class="topNewEnterpriseTab" id="topNewEnterpriseTab" style="text-align: left;">');
	        stringBuilder.Append('        <tr>');
	        stringBuilder.Append('	         <td style="width:15%;padding-left:0px;">企业名</td>');
	        stringBuilder.Append('	         <td style="width:85%;">');
	        stringBuilder.Append('	        	<input type="text" placeholder="请输入企业名称" id="companyName" class="topEnterpriseInput" data-validate="require noSpecialChar char1_50" style="width:390px;" />');
	        stringBuilder.Append('	        	<div class="errorTip"></div>');
	        stringBuilder.Append('	         </td>');
	        stringBuilder.Append('	      </tr>');
	        stringBuilder.Append('	      <tr>');
	        stringBuilder.Append('	         <td style="padding-left:0px;">行业</td>');
	        stringBuilder.Append('	         <td class="topNewEnterpriseTd">');
	        stringBuilder.Append('	        	<select id="industry" data-validate="require" style="height:32px;width:390px" class="topEnterpriseInput jcui-dropdownlist">');
	        var list=data.data.list;
	        for(var i=0;i<list.length;i++){
		        stringBuilder.Append('	            	<option value="'+list[i].id+'">'+list[i].name+'</option>');
	        }	        	 
	        stringBuilder.Append('	            </select>');
	        stringBuilder.Append('				<div class="errorTip"></div>');
	        stringBuilder.Append('	         </td>');
	        stringBuilder.Append('	      </tr>');
	        stringBuilder.Append('	</table>');
	        stringBuilder.Append('</div>');
	        var companyId = data.data.companyId;
	        var accessToken = data.data.accessToken;
	        var dw = JCPublicUtil.dialogWindow("新建企业", stringBuilder.ToString(), "完成",function(dialog){
	        	// 验证表单
	     		var ret = VT.formSubmit("topNewEnterpriseTab");
	     		// 判断表单验证合法性，如果为true，则提交后台
	     		if (ret == true){    
	     			var companyName = dw.find("#companyName").val();
	     			var industryId = $("#industry").val();
	    			var edpFileSite = $("#edpFileSite").val();
	    			var url=edpFileSite+"/storage/register";
	    			Ajax.doRequest(url, "post", {
	    				accessToken : accessToken
	    			}, function(data) {
	    				if (data.resultCode == '000000') {
		     			var url = Ajax.formatURL("/pc/registerCompany.do");
			     			Ajax.doRequest(url, "post", {
								userId : '$!{session.getAttribute("x_user").id}',
								companyName : companyName,
								industryId : industryId,
								phone : '$!{session.getAttribute("x_user").phone}',
								companyId : companyId
			     			}, function(data) {
			     				if (data.resultCode == '000000') {
		     						if(num ==1){
		     							$("#LAmyMsgTab").empty();
		     							loginAfter.myEnterGetData();
		    				    	}else{
				     					$("#type").val(1);
				     					$("#companyId").val(data.data);
				     					$("#registerTb2").hide();
				     					$("#iconcol").removeClass("icon15_1").addClass("icon14_1");
				     					$("#registerTb3").show();
				     					CE.newEnterpriseSuccess(data.data);
			     					}
		     						dialog.find(".dialogClose").click();
			     				} else {
			     					CE.handleMsg(0, data.resultMessage);
			     				}
			     			}, function() {
			     				CE.handleMsg(0, "服务器连接异常");
			     			}, 6000, false, "json");
	    				} else {
	    					CE.handleMsg(0, data.resultMessage);
	    				}
	    			}, function() {
	    				CE.handleMsg(0,Lang.common_context_serverexception);
	    			}, 6000, false, "json");
	     		}else{
	     			return false;
	     		}
	     		return false;
	         },"","");
	        dw.width(508);
	        dw.find(".dialogOK").css({"width":"200px","height":"32px","line-height":"30px"});
	        dw.find(".max-content").css({"overflow-x":"inherit","overflow-y":"inherit"});
	        VT.commentTest();
	        
	        $("#companyName").blur(function(){
	        	// 验证表单
	     		var ret = VT.formSubmit("topNewEnterpriseTab");
	     		// 判断表单验证合法性，如果为true，则提交后台
	     		if (ret == true){    
//	        	if($(this).val() != null && $(this).val() != undefined && $(this).val() != ""){
	        		var url = Ajax.formatURL("/pc/checkCompany.do");
		     		Ajax.doRequest(url, "post", {
		     			companyName : $("#companyName").val()
		     		}, function(data) {
		     			if (data.resultCode != '000000') {
		     				CE.handleMsg(0, data.resultMessage);
		     			}
		     		}, function() {
		     			CE.handleMsg(0, "服务器连接异常");
		     		}, 6000, false, "json");
	        	}else{
	        		return false;
	        	}
	        	
	        });
			
			$("#industry").empty();
			for (var i = 0; i < list.length; i++) {
				var str = "<option value=" + list[i].id + ">"
						+ list[i].name + "</option>";
				$("#industry").append(str);
			}
			$("#registerTb1").hide();
			$("#iconcol").removeClass("icon16_1").addClass("icon15_1");
			$("#registerTb2").show();
		}, function() {
			CE.handleMsg(1, data.resultMessage);
		}, 6000, false, "json");
    },
    /*顶部>更多>新建企业成功*/
    LAnewEnterpriseSuccess : function (companyId) {
    	Ajax.doRequest(Ajax.formatURL("/pc/loginFromEdp"), "post", {
			 companyId : companyId,
			 lang : '$!{session.getAttribute("key_lang")}'
		}, function(data) {
			if (data.resultCode == '000000') {
				var emp = data.data;
				if(emp.auth==0){
			 		CE.handleMsg(0, "用户未授权");
				}else if(emp.status!=0){
					CE.handleMsg(0, "用户未加入");
				}else{
					location.href=Ajax.formatURL("/pc/toWorkBenchUI"); 
				}
		 	}else{
		 		CE.handleMsg(0, data.resultMessage);
		 	}
	    	JCPublicUtil.stopPropagation(event);
		 }, function() {
		 	CE.handleMsg(0,Lang.common_context_serverexception);
	 	 }, 6000, false, "json");
    },
    /*顶部>更多>新建企业成功*/
    newEnterpriseSuccess : function (companyId) {
    	Ajax.doRequest(Ajax.formatURL("/pc/getCompanyById.do"), "post", {
 			id : companyId
 		}, function(data) {
 			if (data.resultCode == '000000') {
 				var obj=data.data;
 				var stringBuilder = JCPublicUtil.StringBuilder();
 		        stringBuilder.Append('<div id="registerTb3">');
 		        stringBuilder.Append('    <div class="icon10_4" style="margin:22px auto;margin-bottom:32px;"></div>');
 		        stringBuilder.Append('        <div class="welcomeMsg">');
 		        stringBuilder.Append('        	 <p style="color:#333;font-size:14px;margin-bottom: 30px;">您已成功创建企业</p>');
 		        stringBuilder.Append('           <p style="margin-top:8px;">企业号：<span>'+obj.code+'</span></p>');
 		        stringBuilder.Append('           <p style="margin-top:8px;margin-bottom:32px">企业名称：<span>'+obj.name+'</span></p>');
 		        stringBuilder.Append('        </div>');
 		        stringBuilder.Append('</div>');
 		        var dw = JCPublicUtil.dialogWindow("新建企业", stringBuilder.ToString(), "进入系统",function(){   		
 		            Ajax.doRequest(Ajax.formatURL("/pc/loginFromEdp"), "post", {
 		  			    companyId : obj.id
 		  		    }, function(data) {
 		  			    if (data.resultCode == '000000') {
 		  				    var emp = data.data;
 		  				    if(emp.auth==0){
 		  			 		    CE.handleMsg(0, "用户未授权");
 		  				    }else if(emp.status!=0){
 		  					    CE.handleMsg(0, "用户未加入");
 		  				    }else{
 		  					    location.href=Ajax.formatURL("/pc/toWorkBenchUI"); 
 		  				    }
 		  		 	    }else{
 		  		 		    CE.handleMsg(0, data.resultMessage);
 		  		 	    }
 		  		     }, function() {
 		  		 	    CE.handleMsg(0,Lang.common_context_serverexception);
 		  	 	     }, 6000, false, "json");	        	 		        	
 		        }, "","");
 		        dw.width(508);
 		        dw.find(".dialogOK").css({"width":"200px","height":"32px","line-height":"30px"});
 			}else{
 				CE.handleMsg(0, data.resultMessage);
 			}
 		}, function() {
 			CE.handleMsg(0, "服务器连接异常");
 		}, 6000, false, "json");
    },
    /*顶部>更多>加入企业*/
    topAddEnterprise : function () {
		var stringBuilder = JCPublicUtil.StringBuilder();
		stringBuilder.Append('<input type="hidden" id="companyId">');
		stringBuilder.Append('<table class="topAddEnterpriseTab" id="topAddEnterpriseTab" border="0">');
		stringBuilder.Append('   <tr onmouseover="this.style.backgroundColor=\'#fff\'">');
		stringBuilder.Append('      <td style="width:17%;">企业名</td>');
		stringBuilder.Append('      <td style="width:83%">');
		stringBuilder.Append('           <div class="searchCtain" id="searchCtain" style="position: relative; border: 1px solid #ccc;height: 34px;width:360px;">');
		stringBuilder.Append('           	<input class="searchBox topAddEnterpriseInput" id="searchBox" data-validate="require" type="text" placeholder="请输入企业名称" style="position: absolute;left:0px;">');
		stringBuilder.Append('           	<div class="errorTip dropbox" style="top: 32px;">必填项</div>');
		stringBuilder.Append('				<span class="icon1_2 headSearchIcon" style="position: absolute;right: 0px;top: 4px;"></span>');
		stringBuilder.Append('       	 </div>');
//		stringBuilder.Append('           <div id="searchTxt" class="searchTxt" style="top:49px;">');
//		stringBuilder.Append('						');
//		stringBuilder.Append('			 </div>');
		stringBuilder.Append('       </td>');
		stringBuilder.Append('    </tr>');
		stringBuilder.Append('</table>');
        var dw = JCPublicUtil.dialogWindow("加入企业", stringBuilder.ToString(), "申请加入",function(){
        	// 验证表单
     		var ret = VT.formSubmit("topAddEnterpriseTab");
     		// 判断表单验证合法性，如果为true，则提交后台
     		if (ret == true){
     			CP.createEmp($("#companyId").val());
     		}else{
     			return false;
     		}
        }, "取消",null);
        dw.width(508);
        CE.getCalssFun($("#searchTxt"));
        dw.find(".max-content").css({"overflow-x":"initial","overflow-y":"initial"});
        VT.commentTest();
        $("#searchBox").keyup(function(){
        	CP.searchCompany();
        });
    },
    /*切换企业*/
    topDropLi : function(){
    	var url = Ajax.formatURL("/pc/getCompanyByUserId.do");
    	Ajax.doRequest(url, "post", {
 		}, function(data) {
 			if (data.resultCode == '000000') {
 				var list=data.data;
 				if(list != null){
 					var stringBuilder = JCPublicUtil.StringBuilder();
 					$("#topDropdownEvent").empty();
 					for(var i=0;i<list.length;i++){
 						if(list[i].isCurrent == 1){
	 						stringBuilder.Append('<li class="headBtnTagLi" id="'+list[i].id+'">'); 
	 						stringBuilder.Append('	<span class="gou"></span>');
	 						stringBuilder.Append('	<span>'+list[i].name+'</span>');
	 						stringBuilder.Append('</li>');
 						}else{		
	 						stringBuilder.Append('<li id="'+list[i].id+'">');  
	 						stringBuilder.Append('	<span style="margin-right:7px"></span>');
	 						stringBuilder.Append('	<span>'+list[i].name+'</span>');
	 						stringBuilder.Append('</li>');
 						}
 					}
 					$("#topDropdownEvent").append(stringBuilder.ToString());
 					$("#topDropdownEvent").prepend($(".headBtnTagLi"));
 			        CE.getCalssFun($("#topDropdownEvent"));
 			        $("#topDropdownEvent li").click(function(){
 			        	var id = $(this).attr("id");
 			        	Ajax.doRequest(Ajax.formatURL("/pc/loginFromEdp"), "post", {
 	 		  			    companyId : id
 	 		  		    }, function(data) {
 	 		  			    if (data.resultCode == '000000') {
 	 		  				    var emp = data.data;
 	 		  				    if(emp.auth==0){
 	 		  			 		    CE.handleMsg(0, "用户未授权");
 	 		  				    }else if(emp.status!=0){
 	 		  					    CE.handleMsg(0, "用户未加入");
 	 		  				    }else{
 	 		  					    location.href=Ajax.formatURL("/pc/toWorkBenchUI"); 
 	 		  				    }
 	 		  		 	    }else{
 	 		  		 		    CE.handleMsg(0, data.resultMessage);
 	 		  		 	    }
 	 		  		     }, function() {
 	 		  		 	    CE.handleMsg(0,Lang.common_context_serverexception);
 	 		  	 	     }, 6000, false, "json");	 			        	
 			        });
 				} 						             
 			}else{
 				CE.handleMsg(0, data.resultMessage);
 			}
 		}, function() {
 			CE.handleMsg(0, "服务器连接异常");
 		}, 6000, false, "json");
    	/*Ajax.doRequest(url, "post", {
			id : id
		}, function(data) {
			if (data.resultCode != '000000') {*/
				
			/*}else{
				CE.handleMsg(0, data.resultMessage);
			}
		}, function() {
			CE.handleMsg(0, "服务器连接异常");
		}, 6000, false, "json");*/
    },
	//全部选完自动勾全选
	autoSelectAll: function(containerObj,obj){
		var boolstr = true;
		var checkBox = containerObj.find(".magic-checkbox");
		checkBox.each(function () {
    		if($(this).prop("checked") == false){
    			boolstr = false;
    		}
    	});
		if(boolstr == true){
			obj.prop("checked",true);
        }else if(boolstr == false){
        	obj.prop("checked",false);
        }
	},
	focusEnterEvent : function(id,event,funcObj){
		$("#"+id).bind("keypress",function(event){  
		    if(event.keyCode == "13" && $("#"+id).is(":focus")){
		    	funcObj.click();
		    } 
		});
	},
	toMB : function(value) {
		return value / 1024 / 1024;
	},
	//获取下拉框   选中项
	selectedItem:function(parentObj){
		var parentClass = $("."+parentObj);
		var media = parentClass.find(".Scroll").children("li");
		var mediaType = '';
		media.each(function(){
			var _this = $(this);
			if(_this.hasClass("selected")){
				mediaType = _this.attr("data-value");
			}
		});
		return mediaType;
	}
}














