/**
 * app调用web方法完成选择人员赋值
 * personSelList  包含id  和 人员 name
 */
function getPersonSel(personSelList){
	var selector = Common.personSelector;
	var orgId = Common.personOrgId;
	var personMultiselect = Common.personMultiselect;
	var attenCalendar = Common.personAttenCalendar;
    Common.personSelectDialog('',{

		callBack: function(person){
        	var appVal = [];
        	$(selector).html("");
    		//判断终端是否ios或者Android访问
    	    var terminal = navigator.userAgent;
    	    if(terminal.indexOf('Android') > -1 || terminal.indexOf('Adr') > -1){//android终端
    	    	for (var i = 0 ; i < personSelList.length; i++) {
                	appVal.push(personSelList[i].empId);
                	//$(selector).append('<option value="'+personSelList[i].empId+','+personSelList[i].avatar+'">'+personSelList[i].name+'</option>');
                	$(selector).append('<option value="'+personSelList[i].empId+'">'+personSelList[i].name+'</option>');
                 }
    	    }else if(/(iPhone|iPad|iPod|iOS)/i.test(terminal)){//ios终端	
    	    	var personSelArr = JSON.parse(personSelList);
    	    	for (var j = 0 ; j < personSelArr.length; j++) {
                	appVal.push(personSelArr[j].id);
                	$(selector).append('<option value="'+personSelArr[j].id+'">'+personSelArr[j].name+'</option>');
                }
    	    }
            if (appVal.indexOf(person.id) == -1) {
            	appVal.push(person.id);
            	$(selector).append('<option value="'+person.id+'">'+person.text+'</option>');
            }
            $(selector).val(appVal).trigger('change');
 		},
 		orgIdParam: orgId,
 		isMultiselect: personMultiselect,
 		paramsObj: attenCalendar
	});   
}
var Common = {
	
	/**
	 * 左边切换的函数
	 */
	bindSidebar: function(callBack){
//		var show=$(".page-content .page-content-inner .jc_sidebar li.active a").attr('data-href');
//		$('.page-content .page-content-inner .jc_sidebar_content #'+show).show().siblings().hide();
		$(".page-content .page-content-inner .jc_sidebar .nav a").click(function(){
			var a_href = $(this).attr('data-href');
			var a_fn = $(this).attr('data-onclick');
			$(this).parents("li").addClass("active").siblings().removeClass("active");
			if(a_href !=undefined && a_href!="")
			{
				$('.page-content .page-content-inner .jc_sidebar_content #'+a_href).show().siblings().hide();
			}
			if(a_fn!=undefined && a_fn!="")
			{
				eval(a_fn);
			}
		})
	},
	//tab切换以及改变提示标题
	/**
	 * _this : 当前对象
	 * event : 组织冒泡
	 */
	tabFunc:function(_this,event){
		event.stopPropagation();
		$(_this).tab('show');
		 var Text = $(_this).text();
		 $(".page-breadcrumb li span").text(Text);
		 $(".page-title h1 span").text(Text);
	},
	clickFunc:function(obj){
		$("[href='"+obj+"']").click();
	},
	//随机数
	randomNumber:function(){
		var random = Math.floor(Math.random()*10000+1);
        return random;
    },
    //字符串null格式化为空
    formatStringNull:function(str){
    	if(str == null || str == undefined){
    		str = "";
    	}
    	return str;
    },
	//初始化提示(在table上加上类名commonTipClass)
	initTooltips:function(){
		$(".commonTipClass").on('load-success.bs.table mouseenter',function(data){
             $(".tooltips").tooltip();
       });
	},
	//enter键触发事件
	focusEnterEvent: function(id,funcObj){
		$("#"+id).bind("keypress",function(event){  
		    if(event.keyCode == "13" && $("#"+id).is(":focus")){
		    	funcObj.click();
		    } 
		});
	},
	//国际区号 -验证
	/**
	 * selectId : select标签的id, InputId : 输入手机号的input的id
	 */
	validationCode:function(selectId,InputId){
		
		//区分验证（中国手机号是11位数字，其他国家是7-11位数字）
		var Istrue = $("#"+selectId).find('option:selected').attr('Istrue');
		$("#"+selectId).change(function(){
			var Istrue = $(this).find('option:selected').attr('Istrue');
			if(Istrue != undefined && Istrue == 1){
				$("#"+InputId).attr("data-validate","require noSpecialChar phone");
			}else{
				$("#"+InputId).attr("data-validate","require noSpecialChar nationalPhone");
			}
		});
		
	},
	
	//筛选 - 区号
	// countryCode : 国际区号select标签id
	screeningCode:function(countryCode){
		var countryCode = $("#"+countryCode).val();
		//var countryCodeNum = countryCode.split("+")[1];
		//var areaCode = "+"+countryCodeNum.substring(0,countryCodeNum.length-1);
		//return encodeURIComponent(areaCode);
		return countryCode;
	},
	//无数据提示图片和文字
	/**
	 * Content	: 显示该内容的容器
	 * text	： 提示文字
	 * status	： 'true'-是	区分容器是否是table
	 * IsAppend : 'true'-是 	区分是否是append进容器
	 * colspanNum : 所占列数
	 */
	noDataTip:function(Content,text,status,IsAppend,colspanNum){
		
		var stringBuilderH=JCPublicUtil.StringBuilder();
		if(status == 'true'){
			stringBuilderH.Append('<tr class="tip_no_hoverColor">');
			stringBuilderH.Append('	<td style="width: 100%;" colspan="'+colspanNum+'">');
		}
		stringBuilderH.Append('		<div class="no-data-Tip">');
		stringBuilderH.Append('			<figure class="text-center margin-top-30">');
		stringBuilderH.Append('   			<img src="../edp/asserts/layouts/layout/img/no-data.png"  class="img-rounded" style="width:70px;height:70px">');
		stringBuilderH.Append('   			<figcaption class="margin-top-10">'+text+'</figcaption>');
		stringBuilderH.Append(' 		</figure>');
		stringBuilderH.Append('		</div>');
		if(status == 'true'){
			stringBuilderH.Append('	</td>');
			stringBuilderH.Append('</tr>');
		}
		//是否是append
		if(IsAppend != undefined && IsAppend =='true'){
			$("#"+Content).append(stringBuilderH.ToString());
		}else{
			$("#"+Content).html(stringBuilderH.ToString());
		}
		
		
	},
    //全选
    selectAll:function(_this){
    	var inputCheckbox = $(_this).closest("table").find("input[type='checkbox']");
    	if($(_this).prop("checked")){
    		inputCheckbox.each(function(){
        		$(this).prop('checked', true);
        		$(this).parent().find('span').addClass('checked');
        	});
    	}else{
    		inputCheckbox.each(function(){
        		$(this).prop('checked', false);
        		$(this).parent().find('span').removeClass('checked');
        	});
    	}
    	
    },
    //列表复选框控制全选是否选中
    IsSelected:function(tbodyId,selectAllObj){
    	var status = true;//全选时
    	var checkbox = $("#"+tbodyId).find(".mt-checkbox").children("input[type='checkbox']");
    	checkbox.each(function(){
    		if($(this).prop("checked") == false){
    			status = false;
    		}
    	});
    	if(status == true){
    		$("."+selectAllObj).prop("checked",true);
    	}else{
    		$("."+selectAllObj).prop("checked",false);
    	}
    },
    //普通table选中的id
    selectedIdTab:function(parentObj){
    	var input = $("#"+parentObj).find("input[type='checkbox']");
    	var selectId = '';
    	input.each(function(){
    		if($(this).prop("checked") == true){
    			selectId += $(this).attr("data-id")+",";
    		}
    	});
    	return selectId;
    },
    
	//获取人员选择器或部门选择器  所有选中id
	//selectObj：select对象		icon：连接符号
	selectedId:function(selectObj,icon){
		var dataId = '';
		var character = ",";
		if(icon != undefined){
			character = icon;
		}
		
		var select2Obj = $("#"+selectObj).select2("data");
		for(var i = 0; i < select2Obj.length; i++){
			dataId += select2Obj[i].id+character;
		}

		return dataId;
	},

	//表格一般配置
	/**
	 * @param tableId	: 表格id
	 * @param url	:获取表格数据接口
	 * @param columns	: 表格行数据
	 * @param queryParams ： 参数
	 * @param extendObj	  ： 扩展参数
	 */
	getDataTableCommon:function(tableId,url,columns,queryParams,extendObj){
		if(url.indexOf("?")==-1){
			url+="?ajax=true&rnd="+Math.random();
		}else{
			if(url.indexOf("ajax=true")==-1){
				url+="&ajax=true&rnd="+Math.random();
			}
		} 
		var config = {
				url : basePath+url,
				columns : columns,
				method : "post",
				dataType: "json",
				pagination:true,
				pageNumber:1,
				pageSize: 10, 
				contentType:"application/x-www-form-urlencoded; charset=UTF-8",
				queryParams : queryParams
			};
		if(extendObj != undefined){
			$.extend(config,extendObj);
		}
		$("#"+tableId).bootstrapTable('destroy');
		$("#"+tableId).bootstrapTable(config);  
	},
	//跳转登录页
	//type : true 多企业选择时，“创建企业”跳转到登录页时显示创建企业页面
	ToLoginPage:function(type,userId, phone, productionId, token){
		JCPublicUtil.Ajax(basePath + "/pc/loginUI","POST",{},function(result){
    		if(result.resultCode == "000000"){
    			var ucSite = result.data.ucSite;
    			var appId = result.data.appId;
    			var appKey = result.data.appKey;
	       		var sld = result.data.sld;
	       		var lang = result.data.lang;
	       		if(!lang){
	       			lang="zh_CN";
	       		}
    			var redirect_uri = basePath + "/pc/login";
    			var url = '';
    			if(sld == undefined || sld == ""){
    				url = ucSite+"/pc/tologinview?appId="+appId+"&appKey="+encodeURIComponent(appKey)+"&redirect_uri="+redirect_uri+"&domainName="+sld+"&lang="+lang;
    			}else{
    				url = basePath+"/pc/index?sld="+sld;
    			}
    			//var url = ucSite+"/pc/oauth/loginOA?appId="+appId+"&appKey="+encodeURIComponent(appKey)+"&redirect_uri="+redirect_uri+"&sld="+sld+"&lang="+lang;
    			if(type != undefined && type == true){
    				url += "&create=1&userId="+userId+"&phone="+phone+"&productionId="+productionId+"&token="+encodeURIComponent(token);
    			}
    			location.href=url;
    		}
    	},function(){
    		window.location.href = basePath + "/pc/index";
    	},60000,false,"json",null,null);
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
	
	
	//部门选择器 - 单选（不是select2）
	UnitRadioSelector:function(_this,event){
		if(event){
			event.stopPropagation();
		}
		var selector = $(_this).closest(".js_departSelect").find(".selector-selection__rendered");
		var selectorObj = $(_this).closest(".newgroup").find("select.bs-select");
		Common.departmentSelectDialog('.unitRadioContent', {
			callBack: function(person){
				selector.html('<li class="selector-selection__choice" data-id="'+person.id+'" data-code="'+person.code+'"><span class="selector-selection__choice__remove" role="presentation" onclick="Common.deleteCloseSelector(this)">×</span>'+person.text+'</li>');
				Common.getJobFunc(person.id,selectorObj);
			},
			type:1
		})
	},
	//部门选择器 - 点击删除
	deleteCloseSelector:function(_this){
		$(_this).closest("li.selector-selection__choice").remove();
	},
	
	//切换部门获取职位
	//orgId : 部门id；selectorObj：存储职位的select标签
	getJobFunc:function(orgId,selectorObj){
		
		//切换部门 获取对应部门的职位
		selectorObj.html('');
		JCPublicUtil.Ajax(basePath+"/pc/getPositionList.do", "post", {orgId:orgId}, function(retdata) {
			if(retdata.resultCode == "000000"){
				var list = retdata.data;
				var posBuilder = JCPublicUtil.StringBuilder();
				posBuilder.Append('<option value="">'+Lang.common_no+'</option>');
				for(var j = 0; j < list.length; j++){
					posBuilder.Append('<option value="'+list[j].id+'">'+list[j].name+'</option>');
				}
				selectorObj.append(posBuilder.ToString());
			}
		}, function() {
			
		}, 6000, false, "json");
		
	},
	
	//多删
	/**
	 * containId : 表格id
	 * tipHtml : 提示语言
	 * url ：确定时执行方法的接口
	 * refreshPageFunc ： 刷新页面方法
	 * filterId    过滤删除的人员id
	 */
	multitudeDelete:function(containId,tipHtml,url,refreshPageFunc,filterId){
		var tabId = $("#" + containId);
		var selectedTr = tabId.bootstrapTable('getSelections');

    	if(selectedTr.length == 0){
    		bootbox.dialog({
    			message: '<div>'+Lang.common_choice_first_del+'+'+tipHtml+'!</div>',//class="commonTip"
                title: Lang.common_prompt,
                buttons: {
                    sure: {
                        label: Lang.common_sure,
                        className: "green",
                        callback: function() {
                        	
                        }
                    },
                    cancel: {
                        label: Lang.common_cancel,
                        className: "red",
                        callback: function() {
                        	
                        }
                    }
                }
    		});
    	}else{
    		bootbox.dialog({
    			message: '<div class="commonTip">'+Lang.common_choice_del+'+'+tipHtml+'!</div>',
                title: Lang.common_sure_del,
                buttons: {
                    sure: {
                        label: Lang.common_sure,
                        className: "green",
                        callback: function() {
                        	 var dataId = "";
                        	 var defaultRole = 'flase,'; //true-有默认角色不可删除  此外可以删除
                        	 for(var i = 0;i < selectedTr.length; i++){
                        		 if(filterId != undefined && eval(filterId) == selectedTr[i].id){
                        			 Common.message("error","不允许删除默认角色!");
                        		 }else{
                        			 dataId += selectedTr[i].id + ","; 
                        		 } 
                        	 }
                    	     if(dataId != ''){
                    	    	 JCPublicUtil.Ajax(basePath+url, "post", {
                                     ids: dataId
                                 }, function (data) {
                            		 if (data.resultCode == "000000") {
                                      	eval(refreshPageFunc);
                                      	Common.message("success",Lang.status_batch_del_success);
                                      }else if(data.resultCode=='E00002'){
                                     	 Common.message("error",Lang.status_operat_abnormal);
                                      }else if(data.resultCode=='E00004'){
                                     	 Common.message("error",Lang.status_parameter_error);
                                      }else{
                                      	Common.message("error",Lang.status_batch_del_fail);
                                      } 
                                 }, function () {
                                	 Common.message("error",Lang.common_server_error);
                                 }, 6000, false, "json");   
                    	     }	 
                        }
                    },
                    cancel: {
                        label: Lang.common_cancel,
                        className: "red",
                        callback: function() {
                        	
                        }
                    }
                }
    		});
    	}
	},
	/**
    * 公用右侧提示
    * @param type 提示信息类型 success成功 info提醒 warning警告 error错误
    * @param title 标题
    */
	message : function(type,title){
		toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-top-center",
				  "onclick": null,
				  "showDuration": "1000",
				  "hideDuration": "1000",
				  "timeOut": "7000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}

		toastr[type](title);
		
		
	},
	
	/**
	 * 确定框
	 * title 标题
	 * msg  提示信息
	 * okCallBack 确定回调事件
	 * cancelCallBack 取消回调事件
	 */
	confirm:function(title,msg,okCallBack,cancelCallBack){
		bootbox.confirm({
            title:title,
            buttons: {  
                confirm: {  
                    label: Lang.common_sure,  
                    className: 'green'
                },  
                cancel: {  
                    label: Lang.common_cancel,  
                    className: 'red'  
                }  
            },  
            message: msg,  
            callback: function (result) {
                if (result) {
                	if(okCallBack != undefined) okCallBack();
                }else{
                	if(cancelCallBack != undefined) cancelCallBack();
                }
            }
         });
	},
	
	/**
	 * 提示框
	 */
	alert:function(title,msg,okCallBack){
		bootbox.alert({  
            buttons: {  
               ok: {  
                    label: Lang.common_sure,  
                    className: 'green btn-primary'  
                }  
            },  
            message: msg,  
            callback: function() { 
            	if(okCallBack != undefined){
            		okCallBack();
            	}
            },  
            title: title,  
        });  
	},
	personSelector: 'select',
	personOrgId: '',
	personMultiselect: true,//是否单选  false 单选  true 多选
	personAttenCalendar: '',//考勤日历
	/**
	 * 人员选择器
	 * html上只需要：
	 * <div class="form-group js_departSelect">
       		<div class="input-group input-group-md select2-bootstrap-append">';
        		<select class="form-control js-data-example-ajax" multiple id="js_personSelect">';
            		<option value="'+split1[0]+'">'+split1[1]+'</option>';(如果初始化有值，则需要option)
            	</select>';
        	</div>';
       </div>";
       调用：Common.personSelect("#js_personSelect",{});
     * selector:select上的id
	 * changeFn：在change事件中调用的函数
	 * orgId:部门id。默认是全公司，当人员选择器或部门选择器选择了可选择范围后传入这个部门的id
	 * isMultiselect: 是否多选，默认多选
	 */
    personSelect:function(selector, parameter) {
    	
    	parameter = parameter || {};
    	var html = '';
    	if ($.fn.select2 == undefined) {
    		return;
    	}
    	$(selector).siblings('span.input-group-btn').remove();
    	//组装好button
    	html += '<span class="input-group-btn">';
		html += '	<button class="btn btn-default js_selectPersonBtn" type="button">';
		html += '		<span class="icon-user"></span>';
		html += '	</button>';
		html += '</span>';
    	$(selector).after(html)
    	
    	if (parameter.orgIdParam && parameter.orgIdParam != '') {
    		var orgId = parameter.orgIdParam;
    	} else {
    		var orgId = '';
    	}
    	$.fn.select2.defaults.set("theme", "bootstrap");
    	var inputPersonSelect = $(selector).select2({
    		language: "zh-CN",
            width: "off",
            placeholderOption: "first",
            allowClear: true,//允许清空
            ajax: {
                url: basePath+"/pc/getOrgUserDataOA.do?rnd="+Math.random(),
                dataType: 'json',
                delay: 800,
                type: 'POST',
                data: function(params) { 
                    return {
                        keyWord: params.term, //关键字
                        page: params.page,
                        orgId: orgId
                    };
                },
                processResults: function(data, page) { 
                	 var array = new Array();  
                	 var items = data.rows;
                     if (items) {  
                         for (var i = 0; i < items.length; i++) {  
                             var item = items[i];  
                             array.push({id:item.id, text:item.name});  
                         }  
                     }  
                     var ret = new Object();  
                     ret.results = array;                  
                     return ret; 
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: function(repo){
            	if (repo.loading) return repo.text;
            	return "<div class='select2-result-repository clearfix'>" +
                       "<div class='select2-result-repository__title'>" + repo.text + "</div></div>";
            },
            templateSelection: function(repo){
            	 return repo.text;
            }
        });
    	inputPersonSelect.change(function(){
    	
        	if (parameter.isMultiselect === false) {
        		var data = $(selector).select2("data");
            	if (data.length>1) {
            		$(selector).find("option:first").remove();
            		$(selector).val(data[1].id).trigger('change');
        		}
        	}
        });
    	//给更多按钮绑定事件
    	$(selector).each(function(){
    		var that = $(this);
    		//初始化数据
    		var val = [];
    		var data = that.find("option").each(function(){
	            val.push($(this).attr("value"));
    		});
            that.val(val).trigger('change');
    		var parent = that.parent();
        	var btn = parent.find(".js_selectPersonBtn");//搜索人员按钮
            	btn.click(function(e){
            		//app端
            		if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            			Common.personSelector = selector;
            			Common.personOrgId = orgId;
            			Common.personMultiselect = parameter.isMultiselect;
            			Common.personAttenCalendar = parameter.paramsObj;
            			//保存删除后的人员信息
                        var personArr = [];
                        var data = that.select2("data") || [];
                        //选择范围  0-全部（好友、群组、企业人员、最近联系人）  1-企业内部人员
                        var personRange;
                        if(orgId == '') {
                        	personRange = 0;
                        }else{
                        	personRange = 1;
                        }
                        var isMultiple;//是否多选 0-单选  1-多选
                        if(parameter.isMultiselect == false){
                        	isMultiple = 0;
                        }else{
                        	isMultiple = 1;
                        }
                		//判断终端是否ios或者Android访问
                	    var terminal = navigator.userAgent;
                	    //android终端
                	    if(terminal.indexOf('Android') > -1 || terminal.indexOf('Adr') > -1){
                	    	for (var i = 0 ; i < data.length; i++) {
                	    		    //var empIdArr = [];
                	    			//var empIdStr = data[i].id;
                	    			//if(empIdStr.indexOf(",") != -1){
                	    				//empIdArr = empIdStr.split(",");
                	    			//}
                	    			//personArr.push({empId:empIdArr[0],name:data[i].text,avatar:empIdArr[1]});
                                    personArr.push({empId:data[i].id,name:data[i].text});
                            }
                            //把数组对象转成json字符串 
                            var personStrList = JSON.stringify(personArr);
                	    	window.AndroidWebView.openPersonPicker(personRange,personStrList,isMultiple);
                	    }else if(/(iPhone|iPad|iPod|iOS)/i.test(terminal)){ //IOS端
                            for (var j = 0 ; j < data.length; j++) {
                         	   personArr.push({id:data[j].id,name:data[j].text});
                            }
                            //把数组对象转成json字符串 
                            var personStrList = JSON.stringify(personArr);
                            //组装person对象
                            var personObj = {
                            	personRange: personRange,
                            	personArr: personArr,
                            	isMultiple: isMultiple
                            }
                	    	window.webkit.messageHandlers.OLTransferValue.postMessage(personObj);
                	    }
            		}else{//pc端
	            		Common.personSelectDialog(this,{
	            			callBack: function(person){
	                			var data = that.select2("data") || [];
	                			var temp = 1;
	                			var val = [];
	                			that.html("");
	                            for (var i = 0 ; i < data.length; i++) {
	                            	if (data[i].id != person.id) {
	                            		val.push(data[i].id);
		                            	that.append('<option value="'+data[i].id+'">'+data[i].text+'</option>');
	                            	} else {
	                            		temp = 0;
	                            	}
	                            }
	                            if (val.indexOf(person.id) == -1) {
	                            	val.push(person.id);
	                            	that.append('<option value="'+person.id+'">'+person.text+'</option>');
	                            }
	                            that.val(val).trigger('change');
	                		},
	                		orgIdParam: orgId,
	                		isMultiselect: parameter.isMultiselect,
	                		paramsObj: parameter.paramsObj
	            		});
	            		e.stopPropagation();
            		}
            	});
	
	    	});
    	return inputPersonSelect;
    	
    },
    
    
    /**
	 * 部门选择器
	 * html上只需要：
	 * <div class="form-group js_departSelect">
       		<div class="input-group input-group-md select2-bootstrap-append">';
        		<select class="form-control js-data-example-ajax" multiple id="js_personSelect">';
            		<option value="'+split1[0]+'">'+split1[1]+'</option>';(如果初始化有值，则需要option)
            	</select>';
        	</div>';
       </div>";
       调用：Common.departSelect("#js_personSelect",{});
     * selector:select上的id
	 * orgId:部门id。默认是全公司，当人员选择器或部门选择器选择了可选择范围后传入这个部门的id
	 * isMultiselect: 是否多选
	 * type: 1为部门选择器， 2为合作伙伴选择器
	 * IsCode:1-需要生成机构码
	 */
    departSelect:function(selector, parameter) {
    	
    	parameter = parameter || {};
    	var html = '', url = '';
    	if ($.fn.select2 == undefined) {
    		return;
    	}
    	
    	//组装好button
    	$(selector).siblings('span.input-group-btn').remove();
		html += '<span class="input-group-btn">';
		html += '	<button class="btn btn-default js_selectPersonBtn" type="button">';
		html += '		<span class="fa fa-sitemap"></span>';
		html += '	</button>';
		html += '</span>';
    	$(selector).after(html);
    	
    	if (parameter.orgIdParam && parameter.orgIdParam != '')  {
    		var orgId = parameter.orgIdParam;
    	} else {
    		var orgId = companyId;
    	}
    	parameter.type = parameter.type || 1;
    	if (parameter.type == 1) {
    		url = "/pc/getOrgByKeyword.do?rnd=";//部门
    	} else if(parameter.type == 2){
    		url = "/pc/getCompanyPartnerListOA.do?rnd=";//合作伙伴
    	}
    	
    	$.fn.select2.defaults.set("theme", "bootstrap");
    	var calendarId = $(selector).attr("data-canlendar");//考勤-添加排班  日历id
    	$(selector).select2({
    		language: "zh-CN",
            width: "off",
            allowClear: true,//允许清空
            ajax: {
                url: basePath + url + Math.random(),
                dataType: 'json',
                delay: 800,
                type: 'POST',
                minimumResultsForSearch: "-1",
                data: function(params) { 
                    return {
                        keyWord: params.term, //关键字
                        page: params.page,
                        orgId: orgId,
                        calendarId: calendarId
                    };
                },
                processResults: function(data, page) { 
                	 var array = [];
                	 var items = data.rows;
                     if (items) {  
                         for (var i = 0; i < items.length; i++) {  
                             var item = items[i]; 
                             if (parameter.type == 1) {
                            	 array.push({id:item.id, text:item.name});
                             } else {
                            	 array.push({id:item.partnerId,text:item.partnerName});  
                             }
                         }  
                     }  
                     return {
                    	results: array
                     };  
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: function(repo){
            	if (repo.loading) return repo.text;
            	return  "<div class='select2-result-repository clearfix'>" +
                    	"<div class='select2-result-repository__title'>" + repo.text + "</div></div>";
            },
            templateSelection: function(repo){
            	 return repo.text;
            }
        });
        
    	$(selector).change(function(){
        	if (parameter.isMultiselect === false) {
        		var data = $(selector).select2("data");
        		if (data.length === 0) {
        			return false
        		}
        		if (parameter.IsCode != undefined && parameter.IsCode == 1) {
        			var getAttrObj = $("#storeData");
    				//添加部门：id、pid-不填，编辑部门：三个都填
    				var index = data.length*1 - 1*1;
    				var newPid = data[index].id;
    				var id = getAttrObj.attr("data-id"), pid = getAttrObj.attr("data-pid");
        		 	JCPublicUtil.Ajax(basePath+"/pc/getOrgMaxCodeOA.do", "post", {
        		 		id:id,
        		 		pid:pid,
        		 		newPid:newPid
        		 	}, function(retdata) {
    					if(retdata.resultCode == "000000"){
    						$("#orgCode").text(retdata.data);
    						var point = $("#orgCode").text().split(".");
    						$("#Institutional_level").val(point.length);
    					}else{
    						Common.message("error",retdata.resultMessage);	
    					}
    				}, function() {
    					Common.message("error",retdata.resultMessage);
    				}, 6000, false, "json");
        		 	if (data.length > 1) {
                		$(this).find("option:first").remove();
            		}
        		 	return false;
        		}
            	if (data.length>1) {
            		$(selector).find("option:first").remove();
            		$(selector).val(data[1].id).trigger('change');
        		}
        	}
        });
    	
    	
    	//给更多按钮绑定事件
    	$(selector).each(function(){
    		var that = $(this);
    		var val = [];
    		var data = that.find("option").each(function(){
	            val.push($(this).attr("value"));
    		});
            that.val(val).trigger('change');
    		var parent = that.parent();
        	var btn = parent.find(".js_selectPersonBtn");//搜索部门按钮
        	btn.click(function(e){
        		
//        		target, callBack, orgIdParam
        		Common.departmentSelectDialog(this,{
        			callBack: function(person){
        				var data = that.select2("data") || [];
            			var val = [];
            			that.html("");
                        for (var i = 0 ; i < data.length; i++) {
                        	val.push(data[i].id);
                        	that.append('<option value="'+data[i].id+'">'+data[i].text+'</option>');
                        }
                        if (val.indexOf(person.id) == -1) {
                        	val.push(person.id);
                        	that.append('<option value="'+person.id+'">'+person.text+'</option>');
                        }
                        that.val(val).trigger('change');
            		},
            		orgIdParam: orgId,
            		type: parameter.type,
            		isMultiselect: parameter.isMultiselect
        		});
        		e.stopPropagation();
        	});
    	});
    	
    },
    
    /**
     * 人员选择起弹框
     * orgIdParam:部门id。默认是全公司，当人员选择器或部门选择器选择了可选择范围后传入这个部门的id
     */
    personSelectDialog:function(target, parameter){
    	if(typeof target !='string'){
        	var left = $(target).offset().left + $(target).outerWidth() - 350;
        	var top =  $(target).offset().top + $(target).outerHeight();
    	}
    	parameter = parameter || {};
    	if ($("#personSelectDialog").length > 0) {
    		$("#personSelectDialog").remove();
    	} else {
    		var stringBuilder = JCPublicUtil.StringBuilder();
        	stringBuilder.Append('<div class="personSelectDialog row" id="personSelectDialog" style="left:'+left+'px; top:'+top+'px;">');
        	stringBuilder.Append(' 	 <div class="selectcontent">');
        	if (parameter.isMultiselect !== false) {
        		stringBuilder.Append(' 	 	<a href="javascript:;" id="personMultipBtn">批量选择</a>');
            	stringBuilder.Append(' 	 	<div style="display:none">');
            	stringBuilder.Append(' 	 		<a href="javascript:;" id="personMultipBtnSure" >确认</a>');
            	stringBuilder.Append(' 	 		<a style="margin-left:15px" href="javascript:;" id="personMultipCancle">取消</a>');
            	stringBuilder.Append(' 	 	</div>');
        	}
        	stringBuilder.Append(' 	 </div>');
        	stringBuilder.Append('   <div class="leftcontent"><div class="orgContent org_scroller" id="js_orgSelect" style="height:300px; width:320px;overflow-y:hidden; overflow-x:auto"></div></div>');
        	stringBuilder.Append('   <div class="rightcontent"><div class="personContent org_scroller" id="js_emSelect"  style="height:310px; width:158px;"></div></div>');
        	stringBuilder.Append('</div>');
        	if(target !=''){
        		$("body").append(stringBuilder.ToString());
        	}
        	
        	$(".personSelectDialog").click(function(e){
        		e.stopPropagation();
        	})
        	
        	$(".page-wrapper").bind("click",function(){
        		$("#personSelectDialog").remove();
        		$(".page-wrapper").unbind('click');
        	})
        	$("body").bind("click",function(){
        		$("#personSelectDialog").remove();
        		$("body").unbind('click');
        	})
        	
        	$("#personSelectDialog").show();
        	
        	//批量选择
        	$("#personMultipBtn").bind('click',function(){
        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
        		$(this).siblings('div').show();
        		$(this).hide();
        		$(this).parent().addClass('Multip');
        	})
        	
        	//取消
        	$("#personMultipCancle").bind('click',function(){
        		$('.jstree-icon.jstree-checkbox').hide();
        		$(this).parent('div').hide();
        		$(this).parent('div').siblings('a').show();
        		$(this).parents('.selectcontent').removeClass('Multip');
        	})
        	
        	//确定
        	$("#personMultipBtnSure").unbind('click').bind('click',function(){
        		$('.jstree-icon.jstree-checkbox').hide();
        		$(this).parent('div').hide();
        		$(this).parent('div').siblings('a').show();
        		$(this).parents('.selectcontent').removeClass('Multip');
        		var data = $("#js_orgSelect").jstree('get_selected');
        		var batchObj = {"orgIds":data.join(',')};
        		if(parameter.paramsObj != undefined){
    	        	$.extend(batchObj, {calendarId: parameter.paramsObj});
    	        }
        		JCPublicUtil.Ajax(basePath + "/pc/getEmployeeByOrgIds","GET",batchObj,function(data){
            		if(data.resultCode == "000000"){
            	        var data = data.data;
            	        //信息传阅人员列表
            	        if(parameter.empIdList != undefined){
            	        	if (parameter.callBack != undefined) {
                   	    		parameter.callBack(data);
                   	    	}
              	    	}else{
              	    		 for (var i = 0; i < data.length; i++) {
                 	        	var person = {};
                 	        	person.id = data[i].id;
                       	    	person.text = data[i].name;
                       	    	if (parameter.callBack != undefined) {
                       	    		parameter.callBack(person);
                       	    	}
                 	        }
              	    	}
        	        }
            		
            	},function(){},60000,false,"json");
        	})
        	
        	var demoDiv = document.getElementsByClassName('org_scroller');
        	if (demoDiv != undefined && demoDiv.length > 0) {
        		for(var i=0; i<demoDiv.length; i++){
        			var ps = new PerfectScrollbar(demoDiv[i]);
            		$(".ps__rail-x").css('opacity',1)
        		}
        	}
        	if(typeof target =='string'){
    			var person = {};
      	    	if(parameter.callBack != undefined){
      	    		parameter.callBack(person);
      	    	}
			}else{
	        	//加载数据  companyId 是个全局变量
	        	JCPublicUtil.Ajax(basePath + "/pc/getOrgTree.do","GET",{"orgId":parameter.orgIdParam},function(result){
	        		if(result.resultCode == "000000"){
	        			var data = $.parseJSON(result.data);
	        			if(data != undefined && data.length > 0){
	        				var nodeArray = [];
	        				for(var j = 0; j < data.length; j++){
	        					var item = data[j];
	        					if (j == 0) {
	        						var parent = "#";
	        					} else {
	        						var parent = item.pId;
	        					}
	        					var node = {"id" : item.id, "parent" : parent, "text" : item.orgName};
	        					nodeArray.push(node);
	        				}
	        			}
			       			
	        			//初始化tree
	        			$('#js_orgSelect').jstree({
		      				"plugins" : [ "checkbox" ],
		      	            "core":{
		      	            	"themes" : {
	        	                    "responsive": false
	        	                },
		      	            	"data" : nodeArray,
		      	            	"multiple": false
		      	            },
		      	            "checkbox" : {
		      	            	"whole_node": false
		      	            }
	        	       }).on('loaded.jstree',function(e, data){
	        	        	var inst = data.instance;  
	        	            var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);  
	        	            inst.select_node(obj); 
	        	        }).bind('select_node.jstree', function(node,selected,event) {
	        	        	if ($(".selectcontent").hasClass('Multip')) {
	        	        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
	        	        	}else{
	        	        		$('.jstree-icon.jstree-checkbox').css('display', 'none');
	        	        	}
	        	        	var params = {"orgId":selected.node.id,dataType:1};
	        	        	//考勤 - 添加排班第一步  根据日历获取该日历下的人员
	        	        	if(parameter.paramsObj != undefined){
	        	        		$.extend(params, {calendarId: parameter.paramsObj});
	        	        	}
	        	        	JCPublicUtil.Ajax(basePath + "/pc/getOrgUserDataOA.do","GET",params,function(result){
	                  	    var emlist = result.rows;
	                  	    var stringBuilder = JCPublicUtil.StringBuilder();
	                  	    if(emlist != undefined){
	                  	    	stringBuilder.Append('<ul class="list-group">');
	                  	    	for(var i = 0 ; i < emlist.length; i++){
	                  	    		var em = emlist[i];
	                  	    		stringBuilder.Append('<li class="list-group-item" data-id="'+em.id+'">'+em.name+'</li>');
	                  	    	}
	                  	    	stringBuilder.Append('</ul>');
	                  	    }
	                  	    $("#js_emSelect").html(stringBuilder.ToString());
	            			
	                  	    $("#js_emSelect .list-group-item").click(function(e){
	                  	    	var person = {id:"",text:""};
	                  	    	person.id = $(this).attr("data-id");
	                  	    	person.text = $(this).text();
	                  	    	if(parameter.callBack != undefined){
	                  	    		parameter.callBack(person);
	                  	    	}
	                  	    });
	
	
	                     },function(){},60000,false,"json");
	        	        	
	    	        }).bind('open_node.jstree', function(node){
	    	        	if ($(".selectcontent").hasClass('Multip')) {
	    	        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
	    	        	}else{
	    	        		$('.jstree-icon.jstree-checkbox').css('display', 'none');
	    	        	}
	    	        });
	    	        
	    	        $("#js_orgSelect").on("ready.jstree", function (event, data) {
	    	        	$("#js_orgSelect").jstree('open_all')
	                }); 
	        			
	        			
	        	}
	        		
	        	},function(){},60000,false,"json");
			}
    	}
    	
    },
    
    
    
    /**
     * 部门选择起弹框
     * target, callBack, orgIdParam
     */
    departmentSelectDialog:function(target, parameter){
    	var left = $(target).offset().left + $(target).outerWidth() - 350;
    	var top =  $(target).offset().top + $(target).outerHeight();
    	parameter =  parameter || {};
    	if($("#departSelectDialog").length > 0){
    		$("#departSelectDialog").remove();
    	} else {	
    		var stringBuilder = JCPublicUtil.StringBuilder();
        	stringBuilder.Append('<div class="departSelectDialog" id="departSelectDialog" style="left:'+left+'px; top:'+top+'px;">');
        	stringBuilder.Append(' 	 <div class="selectcontent">');
        	if (parameter.isMultiselect !== false) {
        		stringBuilder.Append(' 	 	<a href="javascript:;" id="personMultipBtn">批量选择</a>');
            	stringBuilder.Append(' 	 	<div style="display:none">');
            	stringBuilder.Append(' 	 		<a href="javascript:;" id="personMultipBtnSure" >确认</a>');
            	stringBuilder.Append(' 	 		<a style="margin-left:15px" href="javascript:;" id="personMultipCancle">取消</a>');
            	stringBuilder.Append(' 	 	</div>');
        	}
        	stringBuilder.Append(' 	 </div>');
        	stringBuilder.Append('   <div class="orgContent scroller" id="js_depSelect" style="height:300px;position:relative;"></div>');
        	stringBuilder.Append('</div>');
        	
        	$("body").append(stringBuilder.ToString());
        	
        	$(".departSelectDialog").click(function(e){
        		e.stopPropagation();
        	})
        	$(".page-wrapper").bind("click",function(){
        		$("#departSelectDialog").remove();
        		$(".page-wrapper").unbind('click');
        	})
        	$("body").bind("click",function(){
        		$("#departSelectDialog").remove();
        		$("body").unbind('click');
        	})
        	
        	//批量选择
        	$("#personMultipBtn").bind('click',function(){
        		$(this).parent().addClass('Multip');
        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
        		$(this).siblings('div').show();
        		$(this).hide();
        	})
        	
        	//取消
        	$("#personMultipCancle").bind('click',function(){
        		$('.jstree-icon.jstree-checkbox').hide();
        		$(this).parent('div').hide();
        		$(this).parent('div').siblings('a').show();
        		$(this).parents('.selectcontent').removeClass('Multip');
        	})
        	
        	//确定
        	$("#personMultipBtnSure").bind('click',function(){
        		$('.jstree-icon.jstree-checkbox').hide();
        		$(this).parent('div').hide();
        		$(this).parent('div').siblings('a').show();
        		$(this).parents('.selectcontent').removeClass('Multip');
        		var data = $("#js_depSelect").jstree('get_selected');
        		JCPublicUtil.Ajax(basePath + "/pc/getOrgByIds","GET",{"orgIds":data.join(',')},function(data){
            		if(data.resultCode == "000000"){
            	        var data = data.data;
            	        for (var i = 0; i < data.length; i++) {
            	        	var person = {id:"",text:"",code:""};
                	    	person.id = data[i].id;
                	    	person.text = data[i].name;
                	    	person.code = data[i].code;
                  	    	if (parameter.callBack != undefined) {
                  	    		parameter.callBack(person);
                  	    	}
            	        }
        	        }
            	},function(){},60000,false,"json");
        	})
        	
        	$("#departSelectDialog").show();
        	
        	var demoDiv = document.getElementsByClassName('scroller');
        	if (demoDiv != undefined && demoDiv.length > 0) {
        		for(var i=0; i<demoDiv.length; i++){
        			var ps = new PerfectScrollbar(demoDiv[i]);
            		$(".ps__rail-x").css('opacity',1)
        		}
        	}
        	
        	if (parameter.type == 1 || parameter.type == undefined){//部门
        		var url = "/pc/getOrgTree.do";
        		var obj = {"orgId":parameter.orgIdParam}
        	} else if(parameter.type == 2){//合作伙伴
        		var url = "/pc/getCompanyPartnerTreeOA.do";
        		var obj = {"type":3};
        	}
        	
        	//加载数据  companyId 是个全局变量
        	JCPublicUtil.Ajax(basePath + url,"GET", obj,function(result){
        		if(result.resultCode == "000000"){
        			var data = $.parseJSON(result.data);
        			if(data != undefined && data.length > 0){
        				var nodeArray = [];
        				for(var j = 0; j < data.length; j++){
        					var item = data[j];
        					if (parameter.type == 1) {
        						var parent = (j ==0 ? "#" : item.pId);
            					var node = {"id" : item.id, "parent" : parent, "text" : item.orgName , "data":item.code};
        					} else {
        						var parent = item.pId == 0 ? "#":item.pId;
                                var node = {"id" : item.id, "parent" : parent, "text" : item.name };
        					}
        					nodeArray.push(node);
        				}
        			}
        			//初始化tree
        			$('#js_depSelect').jstree({
	      				"plugins" : [ "checkbox" ],
	      	            "core":{
	      	            	"themes" : {
        	                    "responsive": false
        	                },
	      	            	"data" : nodeArray,
	      	            	"multiple": false
	      	            },
	      	            "checkbox" : {
	      	            	"whole_node": false
	      	            }
        	        }).bind('select_node.jstree', function(node,selected,event) {
        	        	if (!$(".selectcontent").hasClass('Multip')) {
        	        		$('.jstree-icon.jstree-checkbox').css('display', 'none');
        	        		var person = {id:"",text:"",code:""};
                	    	person.id = selected.node.id;
                	    	person.text = selected.node.text;
                	    	person.code = selected.node.data;
                	    	if (parameter.callBack != undefined) {
                	    		parameter.callBack(person);
                	    	}
        	        	}else{
        	        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
        	        	}
        	        }).bind('open_node.jstree', function(node){
        	        	if ($(".selectcontent").hasClass('Multip')) {
        	        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
        	        	}else{
        	        		$('.jstree-icon.jstree-checkbox').css('display', 'none');
        	        	}
        	        });
        		}
        	
        		$("#js_depSelect").on("ready.jstree", function (event, data) {
        			if ($(".selectcontent").hasClass('Multip')) {
    	        		$('.jstree-icon.jstree-checkbox').css('display', 'inline-block');
    	        	}else{
    	        		$('.jstree-icon.jstree-checkbox').css('display', 'none');
    	        	}
    	        	$("#js_depSelect").jstree('open_all')
                });
        		
        	},function(){
        	},60000,false,"json");
		}
    },
    
    
    //退出
    logoutFun : function() {
        Common.confirm(Lang.nav_exit_logon,Lang.common_sure_logout,function(){
        	Common.ToLoginPage();
        },function(){});
    },
    //附件上传 - 如果存在正在上传中，则不允许其他操作
    areUploading:function(formname){
    	
    	var loadlength=$(formname).find(".viewAttachment").length;
    	var hLength = $(formname).find(".creartorname").length;
    	if(loadlength != hLength){
    		Common.message("error",Lang.common_isnotuploadattachment);
    		return false;
    	}
    },
    
    //上传附件(uploadtype:0-审批单附件、1-信息传阅附件、2-新闻公告、3-考勤申诉)(formname:表单的类选择器)
	uploadAttach : function (uploadtype,formname) {
		if(uploadtype == 1){
			var id = $("#internalmailid").val();
		} else if(uploadtype == 0) {
			var id = $("#applicationFormId").val();
		} else if(uploadtype == 2) {
			var id = $("#currentArticleId").val();
		}else if(uploadtype == 3){
			var id = $("#currentcomplaintId").val();
			
		}else{
			return false;
		}
		var selectFileLenght = $(formname).find("#fileajax")[0].files.length;
		    var imgStrLen=$(formname).find(".viewAttachment").length;
		    var imgName=$(formname).find(".viewAttachment .creartorname");
		    if(imgStrLen + selectFileLenght > 10){
				Common.message("error",Lang.common_attachment_limit10);
				return false;
		    }
        //判断上传文件大小
		    for (var i = 0 ; i < selectFileLenght; i ++){
		    	var fileSizeLen = $(formname).find("#fileajax")[0].files[i].size;
	    		var fileSizeS = parseInt(fileSizeLen);
	    		var ruleFile = 52428800;
	  			if (fileSizeS > ruleFile) {
	  				  Common.message('error',Lang.common_attachment_limit50);
	  				  return false;
	  		    }else if (fileSizeS == 0){
	  		    	  Common.message('error',Lang.common_attachment_empty);
				      return false;
	  		    }
		    }
			function uploadAttach (i, randomNumber) {
				var fd = new FormData();
				var  html = '';
            fd.append("businessId", id);
            fd.append("type", uploadtype);
            fd.append("clientType", 'web');
    		fd.append("file", files[i]);   
            $.ajax({
                url: basePath + "/pc/uploadAttach.do?businessId="+id,
                type: 'post',
                cache: false,
                data: fd,
                processData: false,  // 告诉jQuery不要去处理发送的数据
                contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                success: function(data) {
                	if (data.resultCode == "E00000") {
 	    			   $('#loadfile_'+randomNumber).remove();
 	    			   Common.message("error",data.resultMessage);
 	    			   return false;
 				   	} else {
 				   		data = data.data;
 				   		var attachType = data.attachType;
  				   	    var uploadFileSize;
 				   	    if(data.size >= 1048576){
 				   		   uploadFileSize = (data.size/1048576).toFixed(1) + 'MB';
 				   	    }else{
 				   		   uploadFileSize = (data.size/1024).toFixed(1) + 'KB';
 				   	    }
 				   		html = '';
 				   		html += '	<div class="attach-upload-left">';
 				   	   	if(pictureType.indexOf(attachType.toLowerCase()+" ") != -1){
 				   	   		 var thumbNailUrl = basePath +"/pc/thumbNailAttach.do?docId="+data.attachPath+"&width=48&height=48";
 				   	   		 html += '	<img src="'+thumbNailUrl+'" class="attach-img"/>';
 				   	   	} else if (attachType=='bmp' && pictureType.indexOf(attachType.toLowerCase()) != -1){
 				   	   	     var thumbNailUrl = basePath +"/pc/thumbNailAttach.do?docId="+data.attachPath+"&width=48&height=48";
 			   	   		     html += '	<img src="'+thumbNailUrl+'" class="attach-img"/>';
 				   	   	}
 				   	   	else if (attachType == null || attachType == undefined || attachType == "" || defaultType.indexOf(attachType.toLowerCase()+" ") == -1){
 				   	   		 html += '<span class="file_normal"></span>';
 				   	   	} else {
 				   	   		 html += '<span class="file_'+attachType+'"></span>';
 				   	   	}
 				   	   html += '</div>';
 				   	   html += '	<div class="attach-upload-right">';
 			   	   	   html += '	<div class="margin-bottom-5 creartorname margin-top-10">'+data.attachName+'</div>';
 			   	   	   html += '	<div class="attach-file-size">'+uploadFileSize+'</div>';
 			   	   	   html += '	<div class="HoverIcon">';
 			   	   	   html += '		<div class="fa-item">';
 			   	   	   html += '			<input type="hidden" class="fileattachid" value="'+data.id+'">';
 			   	   	   html += '			<input type="hidden" class="fileattachPath" value="'+data.attachPath+'">';
 			   	   	   if(data.preview == 1){
  			   	    	 html += '			<i class="fa fa-eye" onclick="Common.preview(this)"></i>';
  			   	       }
 			   	   	   html += '			<i class="fa fa-download" onclick="Common.download(this)"></i>';
 			   	   	   html += '			<i class="fa fa-ellipsis-h" data-toggle="popover" data-content="'+data.creatorName+'<br>上传于：'+data.createDateString.substring(0,16)+'"></i>';
 			   	   	   html += '			<i class="fa fa-remove" data-id="'+id+'" onclick="Common.deleteFile(this);"></i>';
 			   	   	   html += '		</div>';
 			   	   	   html += '	</div>';
 	   				   html += '</div>';
 			   	   	    
 			   	   	   $('#loadfile_'+randomNumber).html(html);
 			   	   	   $(formname).find(".btn-upload-file").remove();
 			   	   	   var ahtml = '';
 			   	   	   
		   	   	   	    ahtml += '<div class="btn btn-upload btn-upload-file">';
		   	   		    ahtml += '	<div class="attach-upload-display">';
     			   	    ahtml += '	<input type="file" id="fileajax" name="file" multiple="multiple" class="fileInput_Upload" onchange="Common.uploadAttach('+uploadtype+',\''+formname+'\')">';
	     			   	ahtml += '			<i class="icon-paper-clip"></i><span>附件上传</span>';
	     			   	ahtml += '	</div>';
//	     			   	ahtml += '	<span class="dropdown" style="">';
//	     			   	ahtml += '		<span class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown">';
//	     			   	ahtml += '			<i class="caret"></i>';
//	     			   	ahtml += '		</span>';
//	     			   	ahtml += '		<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">';
//	     			   	ahtml += '			<li role="presentation">';
//	     			   	ahtml += '				<a role="menuitem" tabindex="-1" href="javscript:;">大附件上传</a>';
//	     			   	ahtml += '			</li>';
//	     			   	ahtml += '		</ul>';
//	     			   	ahtml += '	</span>';
	     			   	ahtml += '</div>';

 			   	   	   $(formname).append(ahtml);
 			   	   	   //省略提示
 						$("[data-toggle='popover']").popover({ 
 			                trigger: 'hover',
 			                container: 'body',
 			                placement: 'top',
 			                html:true
 			           });
 				   }
                },
                error:function(data){
   	    		    $('#loadfile_'+randomNumber).remove();
   	    		    Common.message('error',data.resultMessage);
      			    return false;
   	    	   }
            })    
            
            html += '<div class="btn btn-upload viewAttachment attach-upload loadfile" id="loadfile_'+randomNumber+'">';
	   		html += '		<div class="loading">';
	   		html += '			<div id="fileuploadload"></div>';
	   		html += '		</div>';
	   		html += '</div>';
	   		$(formname).find(".btn-upload-file").before(html);
		   		
			}
			//多文件上传
        var files = $(formname).find("#fileajax")[0].files;
        if (files.length > 1) {
        	for (var i = 0; i < files.length; i++) {
        		if(i < 10){
            		var randomNumber = Common.randomNumber();
            		uploadAttach(i, randomNumber);
        		}else{
        			Common.message("error",Lang.common_attachment_limit10);
  	   				return false;
        		}

        	}
        } else {
        	var randomNumber = Common.randomNumber();
        	uploadAttach(0, randomNumber);
        }
		
	},
	
	//附件预览that为预览的按钮
	preview : function(that){
	
		var docId = $(that).siblings(".fileattachPath").val();
		window.open(basePath+"/pc/previewAttach.do?docId="+docId+"&clientType=web");
		
	},
	
	//附件下载，that为预览的按钮
	download : function(that){
		
		var docIds = $(that).siblings(".fileattachPath").val();
		//window.open(basePath+"/pc/downLoadAttach.do?docIds="+docIds+"&clientType=web");
		
		var url = basePath+"/pc/downLoadAttach.do?docIds="+docIds+"&clientType=web";
		if($("#hiddenFrame").length > 0){
			$("#hiddenFrame").remove();
		}
		window.location.href = url;
		//$("body").append('<iframe id="hiddenFrame" src="'+url+'" frameborder="0" width="0px" height="0px"></iframe>');	
	},
	
//	删除附件
	deleteFile : function(that){
			
			var docIds = $(that).siblings(".fileattachPath").val();
			var ids = $(that).siblings(".fileattachid").val();
			Common.confirm("确认删除","确定删除该附件吗？",function(){
				JCPublicUtil.Ajax(basePath+"/pc/deleteAttach.do","get", {id : ids,docIds : docIds}, function(data) {
		            
					if(data.resultCode == "000000")
					{
						Common.message("success",data.resultMessage);
						$(that).closest(".viewAttachment").remove();
					}
					else
					{
						Common.message("error",data.resultMessage);	//附件不是您上传的，不能执行删除操作！
					}
		            
		        },null, 6000, false, "json");
			},function(){});
	},
	/**
	 * 获取上传附件的列表
	 * id : 表单id/信息传阅id
	 * showDelete :是否显示删除按钮 ，true-显示，false-不显示
	 * type: 0-审批单附件，1-信息传阅附件，3-考勤我的申诉/申诉管理
	 * formname:表单的类选择器
	 */
	getFilelist : function(id,showDelete,type,formname){
		$(".applicationFormUpload a.viewAttachment").remove();
		if (type == 1) {
			$("#internalmailid").val(id);//用于上传图片时需要的信息传阅id
		}
		//删除原来数据

		$('.applicationFormUpload').find(".btn-upload.viewAttachment").remove();
		JCPublicUtil.Ajax(basePath +"/pc/getAttachList.do","get", {businessId : id, width:"48", height:"48"}, function(data) {
			data = data.data;
			if(data != null)
			{
				var html = "";
				for(var i=0;i<data.length;i++)
				{
			   	    var uploadFileSize;
			   	    if(data[i].size >= 1048576){
			   		   uploadFileSize = (data[i].size/1048576).toFixed(1) + 'MB';
			   	    }else{
			   		   uploadFileSize = (data[i].size/1024).toFixed(1) + 'KB';
			   	    }
					html += '<div class="btn btn-upload attach-upload viewAttachment">';
					html += '	<div class="attach-upload-left">';
					var attachType =  data[i].attachType;
					 if(pictureType.indexOf(attachType.toLowerCase()+" ") != -1){
   		   	   		   	html += '	<img src="'+data[i].thumbNailUrl+'" class="attach-img"/>';
	   		   	   	 }else if(attachType=='bmp' && pictureType.indexOf(attachType.toLowerCase()) != -1){
	 		   	   	    html += '	<img src="'+data[i].thumbNailUrl+'" class="attach-img"/>';
	 		   	   	 }
	   		   	   	 else if(attachType == null || attachType == undefined || attachType == "" || defaultType.indexOf(attachType.toLowerCase()+" ") == -1){
	   		   	   		 html += '     	<span class="file_normal"></span>';
	   		   	   	 }else{
	   		   	   		 html += '     	<span class="file_'+attachType+'"></span>';
	   		   	   	 }
					html += '</div>';
					html += '	<div class="attach-upload-right">';
    		   		html += '	<div class="margin-bottom-5 creartorname margin-top-10" title="'+data[i].attachName+'">'+data[i].attachName+'</div>';
    		   		html += '   <div class="attach-file-size">'+uploadFileSize+'</div>';
    		   		html += '	<div class="HoverIcon">';
    		   		html += '		<div class="fa-item">';
    		   		html += '			<input type="hidden" class="fileattachid" value="'+data[i].id+'">';
    		   		html += '			<input type="hidden" class="fileattachPath" value="'+data[i].attachPath+'">';
    		   		html += '			<input type="hidden" class="companyId" value="'+data[i].companyId+'">';
			   	    if(data[i].preview == 1){
    			   	  html += '			<i class="fa fa-eye" onclick="Common.preview(this)"></i>';
    			   	}
    		   		html += '			<i class="fa fa-download" onclick="Common.download(this)"></i>';
			   	   	html += '			<i class="fa fa-ellipsis-h" data-toggle="popover" data-content="'+data[i].creatorName+'<br>上传于：'+data[i].createDateString.substring(0,16)+'"></i>';
    		   		if (showDelete) {
    		   			if (type == 0) {
    		   				var employeeId = $("#employeeId").val();
    		   				if (employeeId == data[i].creatorId) {
    		   					html += '		<i class="fa fa-remove" data-id="'+id+'" onclick="Common.deleteFile(this);"></i>';
    		   				}
    		   			} else {
    		   				html += '		<i class="fa fa-remove" data-id="'+id+'" onclick="Common.deleteFile(this);"></i>';
    		   			}
		   			}
    		   		html += '		</div>';
    		   		html += '	</div>';
    		   		html += '</div>';
    		   		html += '	</div>';
    		   		html += '</div>';
				}
			}
			if(type == 3){
				$('.applicationFormUpload').html(html);
			}else{
				if(formname != undefined){
					$(formname).find(".btn-upload-file").before(html);
				}else{
					$('.applicationFormUpload .btn-upload-file').before(html);
				}

			}
			//省略提示
			$("[data-toggle='popover']").popover({ 
                trigger: 'hover',
                container: 'body',
                placement: 'top',
                html:true
               
            });	
		},null, 6000, false, "json",null,{async:false});
		
	},
	
	
	/**
	 * 翻页功能
	 * comdata:数据
	 * paginationid:
	 * options:插件初始化选项
	 */
	turnPage : function(comdata,paginationid,extendOption){
		
		var total = comdata.total;//总共条数
		var pageSize = comdata.pageSize;//一页的条数
		var results = total % pageSize;
		if(results == 0){
			var totalPage = total / pageSize; //总页数 
		}else{
			var totalPage = parseInt(total / pageSize) + 1; //有余数的时候，总页数
		}
		var options = {
				   bootstrapMajorVersion:3,
	　　　　　　　　       currentPage: comdata.currentPage,//当前页数
	　　　　　　　　　    totalPages: totalPage,//总页数 注意不是总条数
				   shouldShowPage: true,
				   numberOfPages:3,
	          	   onPageClicked: function (event, originalEvent, type, page) {}
	        };
		
		if(extendOption != undefined){
			options = $.extend(options,extendOption)
		}
		
		$(paginationid).bootstrapPaginator(options);
		
	},
	
	/**
	 * 上传图片
	 * selector:初始化input的id或class
	 * extendOption:自定义初始化的选项
	 * fileuploaded:上传成功后执行的事件
	 * classTo : 不同类型的类名
	 */
	fileinput : function(selector,extendOption,fileuploaded,classTo){
		
		var fileIptId=Math.ceil(Math.random()*100000000);
    	var seqNo=fileIptId+"_"+Math.ceil(Math.random()*100000000);
    	var uploadUrl = JCPublicUtil.formatURL("upload/"+seqNo+"?ttl="+Math.random());
    	var options = {
    			language: 'zh', //设置语言
    	        uploadUrl: uploadUrl, //上传的地址
    	        showUpload: false,
    	        showRemove: false,
    			showCaption: false,
    			showPreview: false,
    			browseClass: "btn btn-primary",
    			//allowedFileExtensions: [],
    			//maxFileSize : '2040kb',
    	        uploadAsync:true,
    	        //previewSettings:{
		        	//image: {width: "200px", height: "200px"}
		        //},
    	        MAXFILECOUNT:1,
    	        layoutTemplates:{//隐藏进度条
    	        	progress:""
    	        },
    	        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
    	}
    	
    	if(extendOption != undefined){
			options = $.extend(options,extendOption)
		}
    	
    	$(selector).fileinput(options).on('filebatchselected', function (event, data, id, index) {
    		//自动上传 
    		$(this).fileinput("upload");

    	}).on('filepreupload',function(){
    		//预加载处理
    		var html = '';
    		var addappend = $(selector).closest(".common_addIcon");
    		var parentClass = classTo.parent;
    		var childrenClass = classTo.children;
    		
    		//添加视频的时候
    		if(parentClass == '' && childrenClass == ''){
    			parentClass = "video";
    			childrenClass = "videoitem";
	   			addappend = $("#addappendVideo");
	   		}
    		
    		html += '<div class="col-md-6 '+parentClass+'">';
    		html += '	<div class="'+childrenClass+'">';
    		html += '		<div class="loading">';
	   		html += '			<div id="fileuploadload" style="margin: 34px auto;"></div>';
	   		html += '		</div>';
	   		html += '	</div>';
	   		html += '</div>';

	   		addappend.after(html);
	   		
    	}).on('fileuploaded', fileuploaded).on('fileuploaderror', function(event, data, msg) {
    		//当文件类型以及文件大小超出限制时提示
    		if(data != undefined)
			{
    			Common.message("error",msg);
    			$(selector).fileinput('refresh');
			}
        });
	},
	//用户没有头像时用随机颜色填充
	randomColor : function() {
		 var color = Math.floor(Math.random() * 16777216).toString(16);
		 while (color.length < 6) {
			 color = '0' + color;
		 }
		 return '#' + color;
	},
	//获取网址上某个参数
	getUrlParam:function(name,Ishash){
		 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);  //匹配目标参数   url参数
		 if(Ishash != undefined && Ishash == true){
			 r = window.location.hash.substr(1).match(reg);  //匹配目标参数  #后面的参数
		 }
         if (r != null) return unescape(r[2]); return null;
	},
    //表格文本省略号
	textFormatter : function(value, row, index){
		return '<span title="'+Common.formatStringNull(value)+'" class="commonEllipsis">'+Common.formatStringNull(value)+'</span>';
	},
	/**
	 * 单个数据验证
	 * selectObj 验证数据所对应的选择器  比如$("#IssuedApply-keyword")
	 * 如果返回值是-1 表示验证不成功 1 表示成功
	 */
	validateOneDate:function(selectObj){
		var ret=VT.validateFunc(selectObj);
		if (ret.validate == false) {
			selectObj.siblings(".errorTip").text(ret.msg).show();
			return -1;
		}else{
			selectObj.siblings(".errorTip").text("").hide();
			return 1;
		}
	},
	
	/**
	 * resultCode : 后台返回的状态码
	 * messageType：success成功 info提醒 warning警告 error错误
	 */
	statusCodeMessage:function(resultCode,messageType){
		if(resultCode in Common.statusCodeObj){
			Common.message(messageType,Common.statusCodeObj[resultCode]);
		}
	},
	/**
	 * 状态码对象
	 */
	// statusCodeObj:{
	// 	"006014":Lang.common_revoked_success,
	// 	"E06027":Lang.process_entrust_revoke_error,
	// 	"E14002":Lang.signature_bund_other,
	// 	"014003":Lang.signature_bund_me,
	// 	"014004":Lang.signature_not_bund,
	// 	"E14005":Lang.signature_approve_close,
	// 	"E14006":Lang.signature_has_unbundling,
	// 	"014007":Lang.signature_device_enable,
	// 	"E17012":Lang.common_status_E17012,
	// 	"E00000":Lang.common_status_E00000,
	// 	"E17027":Lang.common_status_E17027,
	// 	"E17028":Lang.common_status_E17028,
	// 	"E17057":Lang.common_status_E17057,
	// 	"E17058":Lang.common_status_E17058,
	// 	"E17056":Lang.common_status_E17056,
	// 	"E00020":Lang.common_status_E00020,
	// 	"E00012":Lang.common_status_E00012,
	// 	"E14007":Lang.common_status_E14007,
	// 	"E14008":Lang.common_status_E14008,
	// 	"E05005":Lang.common_status_E05005,
	// 	"E05006":Lang.common_status_E05006,
	// 	"E05007":Lang.common_status_E05007,
	// 	"E05008":Lang.common_status_E05008,
	// 	"E05009":Lang.common_status_E05009,
	// 	"E06030":Lang.common_status_E06030

	// },
	/*显示隐藏密码
	 * _this 当前点击对象
	 * id    当前点击的密码框id
	 */
	pwdIsVisible:function(_this,id){
		if($(_this).hasClass("open_eye_Icon")){
			$(_this).removeClass("open_eye_Icon");
			$("#"+id).attr("type", "password");
		}else{
			$(_this).addClass("open_eye_Icon");
			$("#"+id).attr("type", "text");
		}
	},
	/**
	 * 重新登录弹窗
	 * countryCode:区号
	 * userName:用户名
	 * message:提示语句
	 */
	reLoggedin : function(countryCode,userName,message){
		
		var stringBuilder = JCPublicUtil.StringBuilder();
		
		stringBuilder.Append('<div id="loginFormId">');
		if(message != undefined)
		{
			stringBuilder.Append('<div style="padding:5px;" class="form-group margin-bottom-20 alert alert-warning">');
			stringBuilder.Append('	<p>'+message+'</p>');
			stringBuilder.Append('</div>');
		}
		stringBuilder.Append('<div class="form-group margin-bottom-20 margin-top-20">');
		stringBuilder.Append('	<div class="input-icon area-code">');
		stringBuilder.Append('  	<i aria-hidden="true" class="icon-globe"></i>');
		stringBuilder.Append('		<select class="selectpicker" id="countryCode_login"></select> ');
		stringBuilder.Append('	</div>');
		stringBuilder.Append('</div>');
		stringBuilder.Append('<div class="form-group margin-bottom-20">');
		stringBuilder.Append('	<label class="control-label visible-ie8 visible-ie9"></label>');
		stringBuilder.Append('	<div class="input-icon">');
		stringBuilder.Append('  	<i class="fa fa-user"></i>');
		if(userName != undefined)
		{
			stringBuilder.Append('  	<input class="form-control placeholder-no-fix" type="text" id="userName" autocomplete="off" placeholder="" name="username" value="'+userName+'" data-validate="require noSpecialChar phone" maxlength="11" />');
		}
		else{
			stringBuilder.Append('  	<input class="form-control placeholder-no-fix" type="text" id="userName" autocomplete="off" placeholder="" name="username" data-validate="require noSpecialChar phone" maxlength="11" />');
		}
		stringBuilder.Append('		<div class="errorTip"></div>');
		stringBuilder.Append('	</div>');
		stringBuilder.Append('</div>');
		stringBuilder.Append('<div class="form-group margin-bottom-20" style="position: relative;">');
		stringBuilder.Append('	<label class="control-label visible-ie8 visible-ie9"></label>');
		stringBuilder.Append('	<div class="input-icon">');
		stringBuilder.Append('  	<i class="fa fa-lock"></i>');
		stringBuilder.Append('    	<input class="form-control placeholder-no-fix" type="password" id="password" autocomplete="off" placeholder="" name="password" data-validate="require numChar char8_32" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,\'\')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9]/g,\'\')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9]/g,\'\')" maxlength="32"/> ');
		stringBuilder.Append('  	<span class="eyeIcon" onclick=Common.pwdIsVisible(this,"password")></span>');
		stringBuilder.Append('  	<div class="errorTip"></div>');
		stringBuilder.Append('	</div>');
		stringBuilder.Append('	<div id="CapitalTip" class="CapitalTip_text"></div>');
		stringBuilder.Append('</div>');
		stringBuilder.Append('</div>');
		
		bootbox.dialog({
			message: stringBuilder.ToString(),
            title: Lang.common_login,
            buttons: {
                sure: {
                    label: Lang.common_sure,
                    className: "green overtime-relogin",
                    callback: function() {
                    	var userName = $("#userName").val();
                    	var password = $("#password").val();
                    	var areaCode = $("#countryCode_login").val();
                    	var returnval = Common.loginByName(userName,password,areaCode);
                    	return returnval
                    }
                },
                cancel: {
                    label: Lang.common_cancel,
                    className: "red",
                    callback: function() {
                    	
                    }
                }
            }
		});
		
		JCPublicUtil.countryCode('countryCode_login',countryCode);
	    //调用密码大写提示
		Common.pwdCapitalTip('password');
		$('.selectpicker').selectpicker();
		//超时登录-按回车重新登录
    	$(document).unbind('keydown').bind('keydown',function(event){
			if(event.keyCode == 13) {
				$(".overtime-relogin").trigger("click"); 
    		 }
		});
	},
	/**
	 * 密码大写输入提示
	 * id: 密码所在容器的id
	 */
	pwdCapitalTip: function(id){
        $('#' + id).after('<div class="login-capital-tip" id="capital_'+id+'"><i class="fa fa-lightbulb-o" style="color: #fef551;margin-right: 6px;"></i><span>大写锁定已开启</span></div>');
        var capital = false; //聚焦初始化，防止刚聚焦时点击Caps按键提示信息显隐错误
        // 获取大写提示的标签，并提供大写提示显示隐藏的调用接口
        var capitalTip = {
        		$elem:document.getElementById('capital_'+id),   
	            toggle:function(s){   
	                var sy = this.$elem.style;   
	                var d = sy.display;   
	                if(s){   
	                    sy.display = s;   
	                }else{   
	                    sy.display = d =='none' ? '' : 'none';   
	                }   
	            }  
        }
        $('#' + id).on('keydown.caps',function(e){
            if (e.keyCode === 20 && capital) { // 点击Caps大写提示显隐切换
                capitalTip.toggle();
                return false;
            }
        }).on('focus.caps',function(){capital = false}).on('keypress.caps',function(e){capsLock(e)}).on('blur.caps',function(e){  
            //输入框失去焦点，提示隐藏
            capitalTip.toggle('none');
        });
        function capsLock(e){
            var keyCode = e.keyCode || e.which;// 按键的keyCode
            var isShift = e.shiftKey || keyCode === 16 || false;// shift键是否按住
            if(keyCode === 9){
                capitalTip.toggle('none');
            }else{
              //指定位置的字符的 Unicode 编码 , 通过与shift键对于的keycode，就可以判断capslock是否开启了
              // 90 Caps Lock 打开，且没有按住shift键
              if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
                  // 122 Caps Lock打开，且按住shift键
                  capitalTip.toggle('block'); // 大写开启时弹出提示框
                  capital = true;
              } else {
                  capitalTip.toggle('none');
              }
            }
        }

	},
	//登录
	loginByName : function(useName,password,areaCode) {
		var ret = VT.formSubmit("loginFormId");
		password = Common.aesEncode(password);
		var returnVal = true;
		if (ret == true) {
			var obj = {
					account : useName,
					password : password,
					areaCode : areaCode,
					sld : global_sld
			}
			//获取授权码
			JCPublicUtil.Ajax(basePath+"/pc/relogin.do", "post",obj,function(data){
					if(data != undefined && data.resultCode == "000000"){//参数错误
						if(data.data != undefined && global_account == useName && global_countryCode == areaCode && companyId == data.data.companyId){
							location.reload();
							returnVal = true;
							IM.start();
							Common.message("success",Lang.common_login_success);
							//检测js版本
							if(data.data.version != jsVersion){
								bootbox.dialog({
									message:Lang.common_contentUpdate_message,
						            title: Lang.common_contentUpdate,
						            buttons: {
						                sure: {
						                    label: Lang.common_sure,
						                    className: "green overtime-relogin",
						                    callback: function() {
						                    	location.reload();
						                    }
						                },
						                cancel: {
						                    label: Lang.common_cancel,
						                    className: "red",
						                    callback: function() {
						                    	
						                    }
						                }
						            }
								});
							}
						}else{
							WorkBench.goToUI('work_workflow','/pc/workPageUI');
							location.reload();
						}
					}else{
						returnVal = false;
						Common.message("error",Common.statusCodeObj[data.resultCode]);
					}
					
			}, function() {
				Common.message("error",data.resultMessage);
			}, 6000, false, "json",null,{async:false});
			    
			
		}
		else
		{
			returnVal = false;
		}
		return returnVal;
	},
	
	/**
     * 获取部门的数据
     * orgVal:当前选中的部门
     * 返回值是下拉框选项的html内容
     */
    getOrgTree : function(companyId,orgVal){
    	//获取组织架构
    	var html = '';
	    	JCPublicUtil.Ajax(basePath + "/pc/getOrgTree.do","GET",{"orgId":companyId},function(result){
	    		if(result.resultCode == "000000"){
	    			var data = $.parseJSON(result.data);
	    			if(data != undefined && data.length > 0){
	    				for(var j = 0; j < data.length; j++){
	    					var item = data[j];

	    					if(j == 0){
	    						html += '<option value="'+item.id+'" '+(orgVal == item.id?"selected":"")+'>'+item.orgName+'</option>';
	    						if(orgVal == ''){
	    							orgVal = item.id
	    						}
	    					}else{
	    						html += '<option value="'+item.id+'" '+(orgVal == item.id?"selected":"")+'>'+item.orgText+'</option>';
	    						if(orgVal == ''){
	    							orgVal = item.id
	    						}
	    					}
	    					
	    				}
	    			}
	    		}
	    	
	    	},function(){
	    	},60000,false,"json",null,{async:false});
	    	
	    	return {html:html,id:orgVal};
    },
    //判断浏览器内核
    browserCore : function() {
         if(navigator.userAgent.indexOf("MSIE")>0) {      // MSIE内核    旧IE    
                return "MSIE"; 
            }
        if(navigator.userAgent.indexOf("Firefox")>0) {     // Firefox内核       
                return "Firefox"; 
            }
        if(navigator.userAgent.indexOf("Opera")>0) {       // Opera内核       
                return "Opera"; 
            }
        if(navigator.userAgent.indexOf("Safari")>0) {     // Safari内核       
                return "Safari";  
            } 
        if(navigator.userAgent.indexOf("Camino")>0) {      // Camino内核       
                return "Camino"; 
            } 
        if(navigator.userAgent.indexOf("Gecko")>0) {       // Gecko内核     新IE   
                return "Gecko"; 
            } 
    },
    
    /**
     * 获取职位
     * posVal:当前选中的部门
     * 返回值是下拉框选项的html内容
     */
    getPosition : function(orgId,posVal){
    	var html;
      	JCPublicUtil.Ajax(basePath + "/pc/getPosition.do","post",{"orgId":orgId},function(result){
      		var row = result.rows;
    			if(result.rows != undefined && row.length != 0)
    			{
    				for(var i=0; i<row.length; i++)
    				{
    					if(posVal == row[i].id)
    					{
    						html += '<option selected value="'+row[i].id +'">'+row[i].name+'</option>';
    					}
    					else
    					{
    						html += '<option value="'+row[i].id +'">'+row[i].name+'</option>';
    					}
    				}
    			}
      		else
    			{
      				html +='<option value="">'+Lang.common_no+'</option>';
    			}
       	},function(){},60000,false,"json",null,{async:false});
      	return html;
    },
    
    /**
     * 查看别人的名片
     * personId：这个人的id
     * employeeId：当前账号的人员id
     * isOpen: 是否自动打开日程
     */
    checkOtherCard : function(personId, employeeId, isOpen){
    	
    	JCPublicUtil.trackEvent("日程","查看他人的名片","参与者",10);
    	
    	var myDate = new Date();
    	var CurrentTime = JCPublicUtil.DateFormat(myDate, 'YYYY-MM-dd');
    	var mine = (personId == employeeId ? true : false);

     	JCPublicUtil.Ajax(basePath+"/pc/settingDataOA.do", "post",{
     		empId:personId
		}, function(retdata) {
			if(retdata.resultCode == "000000"){
				
				var list = retdata.data;
				var userInfo = list.userInfo;
				var stringBuilder = JCPublicUtil.StringBuilder();
				stringBuilder.Append('<div class="row form-horizontal viewScheduleRow">');
				stringBuilder.Append('	<div class="col-md-8">');
				stringBuilder.Append('  	<img class="viewSchedule_img" onerror=this.src="../edp/asserts/themes/default/images/touxiang.png" src="'+basePath+'/visit?key='+userInfo.icon+'" />');
				stringBuilder.Append('      <div style="padding-left: 90px;">');
				if(userInfo.realName != undefined && userInfo.realName != null){
					stringBuilder.Append('      	<div class="margin-bottom-5 viewSchedule_name">'+userInfo.realName+'</div>');
				}
				
				var orgStr = '',positionStr = '';
				if(list.orgStr != undefined && list.orgStr != null){
					orgStr = list.orgStr + " - ";
				}
				if(list.position != undefined && list.position != null){
					positionStr = list.position;
				}
				var weChatNum = Common.formatStringNull(userInfo.wx); //微信号
				var personEmail = Common.formatStringNull(list.email); //邮箱
				var officeTel = Common.formatStringNull(list.tel); //办公电话
				var worknum = Common.formatStringNull(list.jobNo);//工号
				stringBuilder.Append('      	<div class="margin-bottom-5 viewSchedule_Com">'+orgStr+positionStr+'</div>');
				
				stringBuilder.Append('      	<div class="timeTip viewSchedule_Com">'+Common.formatStringNull(list.phone)+'</div>');
				stringBuilder.Append('      </div>');
				stringBuilder.Append('  </div>');
				//但mine == true时，表示是自己本身
				if(!mine){
					stringBuilder.Append('  <div class="col-md-4" style="text-align: right;">');
					//stringBuilder.Append('  	<div class="margin-bottom-20"><button type="button" class="btn blue btn-outline" style="width: 100px;">'+Lang.schedule_send_message+'</button></div>');
					stringBuilder.Append('     	<div><button type="button" class="btn blue btn-outline" style="width: 100px;" onclick=Common.checkScheduleCard("'+personId+'","'+CurrentTime+'")>'+Lang.schedule_see_schedule+'</button></div>');
					stringBuilder.Append('  </div>');
				}
				stringBuilder.Append('</div>');
				
				stringBuilder.Append('<div class="row form-group form-horizontal" style="padding-top:15px;">');
				if(officeTel == "已隐藏") {
					stringBuilder.Append('	<div class="col-md-6">'+Lang.common_office_phone+'：<span class="text-muted">'+officeTel+'</span></div>');
				}else {
					stringBuilder.Append('	<div class="col-md-6">'+Lang.common_office_phone+'：'+officeTel+'</div>');
				}
				if(personEmail == "已隐藏") {
					stringBuilder.Append('  <div class="col-md-6">'+Lang.common_mailbox+'：<span class="text-muted">'+personEmail+'</span></div>');
				}else {
					stringBuilder.Append('  <div class="col-md-6">'+Lang.common_mailbox+'：'+personEmail+'</div>');
				}
				stringBuilder.Append('</div>');
				stringBuilder.Append('<div class="row form-group form-horizontal">');
				if(weChatNum == "已隐藏") {
					stringBuilder.Append('	<div class="col-md-6">'+Lang.common_wechat_number+'：<span class="text-muted">'+weChatNum+'</span></div>');
				}else {
					stringBuilder.Append('	<div class="col-md-6">'+Lang.common_wechat_number+'：'+weChatNum+'</div>');
				}
				stringBuilder.Append('		<div class="col-md-6">工号：'+worknum+'</div>');
				stringBuilder.Append('</div>');
				
				stringBuilder.Append('<div class="row form-group form-horizontal" id="js_scheduleContent" style="display:none;border-top: 1px solid #ddd;">');
				stringBuilder.Append('	<div class="input-group input-medium date date-picker" data-date-format="yyyy-mm-dd" data-date-viewmode="years" id="js_datepicker_schedule" style="margin: 10px auto;">');      		
				stringBuilder.Append('		<input type="text" class="form-control" value="'+CurrentTime+'"  autocomplete="off" /> ');     		
				stringBuilder.Append('		<div class="input-group-addon">');
				stringBuilder.Append('			<span class="add-on"><i class="icon-remove"></i></span><span class="glyphicon glyphicon-th"></span>');
				stringBuilder.Append('		</div> ');     	
				stringBuilder.Append('	</div>');
				
				stringBuilder.Append('	<div style="margin-left: 30px;">'+Lang.schedule_day_schedule+'</div>');
				stringBuilder.Append('	<div class="timeline timeSchedule" id="js_timeSchedule"></div>');
				
				stringBuilder.Append('</div>');
				
	    		bootbox.dialog({
	    			message: stringBuilder.ToString(),
	                title: Lang.schedule_business_card
	    		});

	    		//改变时间获取日程
	    		$("#js_datepicker_schedule").datepicker({
	        		todayBtn: "linked",
					format: 'yyyy-mm-dd',
					language: 'cn',
		    		autoclose: true,
		            pickerPosition: "bottom-left"
				}).on('changeDate',function(ev){
	    			var val = new Date(ev.date.valueOf()).Format("yyyy-MM-dd");
	    			Common.checkScheduleCard(personId,val);
				});
	    		
	    		if (isOpen == 1) {
	    			Common.checkScheduleCard(personId, CurrentTime);
	    		}

			}
			
		}, function() {
			Common.message("error",Lang.common_server_error);
		}, 6000, false, "json");
    },
    
    /**
     * 查看名片中的日程
     */
    checkScheduleCard : function(personId,CurrentTime) {
    	
    	JCPublicUtil.trackEvent("日程","查看他人日程-查看日程","参与者-查看日程",10);
    	var scheduleContent = $("#js_scheduleContent");
    	if(scheduleContent.is(":hidden")){
    		scheduleContent.show();
    	}
    	
    	JCPublicUtil.Ajax(basePath+"/pc/getOtherSchedule.do", "post",{
    		empId:personId,
     		searchTime:CurrentTime
		}, function(retdata) {
			if(retdata.resultCode == "000000"){
				
				var list = retdata.data;
				var stringBuilder = JCPublicUtil.StringBuilder();
				if(list != undefined){
					for(var i = 0; i < list.length; i++){
						var id=list[i].id;
						stringBuilder.Append('	<div class="schedule-vertical">');
						stringBuilder.Append('		<div class="schedule-vertical-noline">');
						stringBuilder.Append('			<div>');
						stringBuilder.Append('				<div>'+new Date(list[i].startTime).Format("hh:mm")+'</div>');
						stringBuilder.Append('				<div>'+new Date(list[i].endTime).Format("hh:mm")+'</div>');
						stringBuilder.Append('			</div>');
						stringBuilder.Append('		</div>');
						stringBuilder.Append('		<div class="schedule-vertical-icon"></div>');
						if(list[i].isShow == 1){
							stringBuilder.Append('		<div class="timeline-body" data-dismiss="modal" style="cursor:pointer;" onclick=fullcalendar.ViewSchedule("'+id+'")>'+list[i].theme+'</div>');
						}else{
							stringBuilder.Append('		<div class="timeline-body">'+Lang.workbenck_noPublic_agenda+'</div>');
						}
						stringBuilder.Append('	</div>');
					}
					
				}
				$("#js_timeSchedule").html(stringBuilder.ToString());
				
			}
			
		}, function(retdata) {
			Common.message("error",Lang.common_server_error);
		}, 6000, false, "json");
    },
    /**
     * 列表上更多按钮的鼠标经过移开事件
     * tableId  移动单元格所对应的表格id
     */
    mobileMouseShow: function(tableId){
    	$("#"+tableId).on('load-success.bs.table',function(data){
			
			 $('.btn-readMore').on( 'mouseover', function(){
				 var that = $(this);
				 var thisHtml = $(this).children("ul").html();
				 var popoverUl = $("body >ul.popoverUl");
				 
			     if(popoverUl.length == 0){
			    	 $(this).children("ul").clone(true).appendTo("body");
		         }else{
		        	 popoverUl.html(thisHtml);
		         }
			     var offset = that.offset();
		         var left = offset.left-120;
			     var top = offset.top+34;
			     popoverUl.css({"left":left+"px","top":top+"px"});
			     popoverUl.show();
			     
			     popoverUl.on('mouseover', function(){
					$(this).show();
				}).on('mouseout', function(){  
					$(this).hide();
				});
			     
			}).on( 'mouseout', function(){
				var popoverUl = $("body >ul.popoverUl");
				popoverUl.hide();
			});
			 
	    });
    },
    /* 判断文本是否有表情包输入
     * substring  文本内容
     */
    isEmojiCharacter: function(substring) {  
        for ( var i = 0; i < substring.length; i++) {  
            var hs = substring.charCodeAt(i);  
            if (0xd800 <= hs && hs <= 0xdbff) {  
                if (substring.length > 1) {  
                    var ls = substring.charCodeAt(i + 1);  
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
                        if(regStr.test(substring)){
         
                    	}
                    	return true;  
                    }  
                }  
            } else if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                if (ls == 0x20e3) {  
                    return true;  
                }  
            } else {  
                if (0x2100 <= hs && hs <= 0x27ff) {  
                    return true;  
                } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                    return true;  
                } else if (0x2934 <= hs && hs <= 0x2935) {  
                    return true;  
                } else if (0x3297 <= hs && hs <= 0x3299) {  
                    return true;  
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50) {  
                    return true;  
                }  
            }  
        }  
    },
    /* 过滤html标签 空格
     * filterStr 过滤字符串内容
     */
    filterHTMLTag: function(filterStr) {
        var filterStr = filterStr.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        filterStr = filterStr.replace(/[|]*\n/, '') //去除行尾空格
        filterStr = filterStr.replace(/&npsp;/ig, ''); //去掉npsp
        return filterStr;
    },
    //流程公共状态显示图标
	setStatusIcon: function(value, row, index){
		if (value == Lang.process_approval_not_adopt) {//审批不通过
			return '<span title="'+Lang.process_approval_not_adopt+'" style="color:#e43a45" class="glyphicon glyphicon-remove"></span>'
		} else if(value == Lang.common_draftstatus) {//草稿
			return '<span title="'+Lang.common_draftstatus+'" style="color:#26c281" class="glyphicon glyphicon-file font-grey-cascade"></span>';
		} else if(value == Lang.process_approval_in) {//审批中
			return '<span title="'+Lang.process_approval_in+'" style="color:#fd6614" class="glyphicon glyphicon-time"></span>';
		} else if(value == Lang.process_approval_completion) {//审批通过
			return '<span title="'+Lang.process_approval_completion+'" style="color:#26c281" class="glyphicon glyphicon-ok"></span>';
		}else if(value == '已归档'){//已归档
			return '<span title="已归档" class="text-primary fa fa-file-text"></span>';
		}else if(value == '审批出现异常' || value == '判断节点错误' || value == '找不到指派人'){//审批出现异常
			return '<span title="审批出现异常" class="text-danger fa fa-minus-circle"></span>';
		}else if(value == '新建'){
			return '<span title="新建" class="text-info fa fa-folder-open"></span>';
		}
	},
	// 根据参数名称获取参数值
	getParamValue: function(name) {
        var paramsArray = Common.getUrlParams();
        if (paramsArray != null) {
            for (var i = 0 ; i < paramsArray.length ; i++) {
                for (var j in paramsArray[i]) {
                    if (j == name) {
                        return paramsArray[i][j];
                    }
                }
            }
        }
        return null;
     },
	 // 获取地址栏的参数数组
	 getUrlParams: function() {
        var search = window.location.search;
        // 写入数据字典
        var tmparray = search.substr(1, search.length).split("&");
        var paramsArray = new Array;
        if (tmparray != null) {
            for (var i = 0; i < tmparray.length; i++) {
                var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
                var set1 = tmparray[i].replace(reg, '&');
                var tmpStr2 = set1.split('&');
                var array = new Array;
                array[tmpStr2[0]] = tmpStr2[1];
                paramsArray.push(array);
            }
        }
        // 将参数数组进行返回
        return paramsArray;
    }, 
    //删除url中某个参数并跳转
    delUrlParamName: function(name){
        var loca = window.location;
        var baseUrl = loca.origin + loca.pathname + "?";
        var query = loca.search.substr(1);
        if (query.indexOf(name)>-1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return url
        };
    },
	/**
	 * 异地登录获取验证码
	 * currentId    当前点击容器id
	 * phoneNum  	手机号容器id
	 * asterisk     手机号中间4位*显示位置
	 * flag         0-表示没验证信息 1-有验证  2-点登录按钮阻止发生验证码
	 */
	getValidateCode: function(currentId,phoneNum,asterisk,flag){
		var that = '#'+currentId;
		$(that).removeClass("btn-primary").addClass("btn-default send-button");
		//防止重复点击
		$(that).prop('disabled',true);
		function animate(num) {
			num--;
			if (num > 0) {
				$(that).text("已发送（"+num + " s）");
			}
			if (num == 0) {
				$(that).prop("disabled",false);
				$(that).removeClass("btn-default send-button").addClass("btn-primary");
				$(that).text('').text(Lang.common_retransmission).show();
			}
			setTimerObj = setTimeout(function(){
				animate(num);
			},1000);
		}
		//点击时清除定时器
		if(flag == 1) {
			clearTimeout(setTimerObj);
		}
		// 手机号码未注册就获取验证码
		JCPublicUtil.Ajax(basePath+"/pc/getLoginVerifyCode", "post", {
			phone: $('#'+phoneNum).val()
		}, function(data) {
			if (data.resultCode == '000000') {
				$(that).text('').text("已发送（60 s）").show();
				animate(60);
			}else{
				$(that).text('').text("已发送（60 s）").show();
				animate(60);
				if(flag == 1) {
					if(data.resultMessage == '手机号当天发的短信超出限制数'){
						Common.message("error",'手机号当天发的短信超出限制数');
						clearTimeout(setTimerObj);
						$(that).text("发送");
						$(that).removeClass("btn-default send-button").addClass("btn-primary");
					}
				}
			}
		}, function() {}, 6000, false, "json");

	},
	/**
	 * 异地登录验证
	 * currentId    当前点击容器id
	 */
	remoteLogin: function(that){
			$(that).attr('disabled','disabled');
		   var code = $("#verifyCode").val();
		   if(code){
		       window.location.href = basePath+"/pc/remoteLogin?verifyCode="+code;
		   }else{
			   //Common.message("error","验证码不能为空！");
			   $(that).removeAttr('disabled');
			   $(".text-danger").text('验证码不能为空！');
			   return false;
		   }
	},
	
	
	/**
	 * 每三个数字自动以，分割
	 */
	getSplitNum: function(numVal){
		numVal = numVal.toString();
		var textArray = numVal.split(".");
		textArray[0] = textArray[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
		if(numVal.indexOf(".") != -1){
			numVal = textArray.join('.');
		}else{
			numVal = textArray[0];
		}
		return numVal;
	},
	
	
	/**
	 * 密码设置
	 */
	approvalPassword:function(){
		var stringBuilder  = JCPublicUtil.StringBuilder();
		stringBuilder.Append('<div class="password-cont">');
		stringBuilder.Append('	<input type="password" class="password-input" id="passwordinput1" maxlength="1" />');
		stringBuilder.Append('	<input type="password" class="password-input" maxlength="1" />');
		stringBuilder.Append('	<input type="password" class="password-input" maxlength="1" />');
		stringBuilder.Append('	<input type="password" class="password-input" maxlength="1" />');
		stringBuilder.Append('	<input type="password" class="password-input" maxlength="1" />');
		stringBuilder.Append('	<input type="password" class="password-input" maxlength="1" />');
		stringBuilder.Append('</div>');
		stringBuilder.Append('<label class="control-label" style="margin-top: 20px;color: #999;">'+Lang.process_reminder_pwd+'123456</label>');
		return stringBuilder.ToString();
	},
	//无权访问模块图标
	noRightVisit:function(){
		var stringBuilder  = JCPublicUtil.StringBuilder();
		stringBuilder.Append('<div class="noData-cont" style="margin-top: 10%;">');
		stringBuilder.Append('	<div class="text-center margin-top-10"><span class="glyphicon glyphicon-ban-circle" style="color: #e4e4e4;font-size: 85px;"></span></div>');
		stringBuilder.Append('	<p class="text-center" style="color: #999; font-size: 20px;">抱歉，您没有权限访问该模块</p>');
		stringBuilder.Append('	<p class="text-center" style="color: #999; font-size: 16px;">如有疑问请联系管理员</p>');
		stringBuilder.Append('</div>');
		return stringBuilder.ToString();
	},
	/**
	 * 读取Session中的AES密钥
	 */
	aesEncode: function(message) {

		var ase = "";
		JCPublicUtil.Ajax(basePath+"/pc/do-get-rsa-publickey", "post", {}, function(result) {
			if (result.resultCode == '000000') {
				var key = result.data;
				var Encrypt = new JSEncrypt();
				Encrypt.setPublicKey(key);
			    ase = Encrypt.encrypt(message);
			} 
		}, function(result) {
			Login.message("error",result.resultMessage);
		}, 6000, false, "json","",{async:false});
		return ase;

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
    }
    
	
}

