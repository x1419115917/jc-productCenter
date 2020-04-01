// JavaScript Document
/*
data-type 			验证内容
phone				手机
email				邮箱
num					数字
num1   				1个数字
num1_8	    		1到8个数字
char1       		1个字符

方法setnum
当某个数字大于data-setnum的值时，自动转为data-setnum
...
*/

var VT={
	commentTest:function(){//聚焦失焦验证 id为按钮ID，按钮不能点
		$("[data-validate]").blur(function(){
			if($(this).attr("data-removeValidate") == "true"){ //特殊情况  勾选后才验证
				return;
			}
			var result = VT.validateFunc($(this));
			var successFuncStr = $(this).attr("func-success");
			var failFuncStr = $(this).attr("func-fail");
			if(result.validate == true){
				var thisErrorTip=$(this).siblings(".errorTip");
				thisErrorTip.text("").hide();	
				if(successFuncStr != undefined && successFuncStr != ""){
					setTimeout(successFuncStr,1);					
				}
			}else{
				if(failFuncStr != undefined && failFuncStr != ""){
					setTimeout(failFuncStr,1);					
				}else{
					var thisErrorTip=$(this).siblings(".errorTip");
					thisErrorTip.text(result.msg).show();	
				}
			}
		});
	},	
	formSubmit:function(id){
		var dataTypeArray=$("#"+id).find("[data-validate]");
		var bool = true;	
		for(var i = 0; i < dataTypeArray.length; i++){
			var dataTypeItem =dataTypeArray.eq(i);
			if(dataTypeItem.attr("data-removeValidate") == "true"){//勾选后才验证
				continue;
			}
			var result=VT.validateFunc(dataTypeItem);
			if(result.validate == false){
				var thisErrorTip=dataTypeItem.siblings(".errorTip");
//				thisErrorTip.text(result.msg).show();
				thisErrorTip.show();
				bool = false;
				continue;
			} else if(result.validate == true){
				var thisErrorTip=dataTypeItem.siblings(".errorTip");
//				thisErrorTip.text(result.msg).show();
				thisErrorTip.hide();
			}
		}
		
		return bool;
	},	
	validateFunc:function(controlObj){
			var _this=controlObj;
			var attr=_this.attr("data-validate");
			if( attr==undefined || attr==null ){
				return {validate:true,msg:"验证合法！"};
			}
			var dataTypeArray = attr.split(/\s+/);
			for(var i = 0; i < dataTypeArray.length; i++){
				var dataType = dataTypeArray[i];
				switch(dataType){
					case "require":
						var pattern = /^[\s]*$/g;
						if(!_this.val() || pattern.test(_this.val())){
							return {validate:false,msg:"必填项"};
						}
					break;
					//edp人员选择器的验证
					case "personRequire":
						var child=_this.find(".deleteObj span");
						if(child.length < 0 || child.length == 0 ){
							return {validate:false,msg:"必选项"};
						}else{
							return {validate:true};	
							}
					break;
					//数据    文件名、文件夹名
					case "cannotspecialChar":
						var pattern = new RegExp("[ ：/*?:\"<>|\\\\]");
						if(_this.val().length>0){
							if(pattern.test(_this.val())){
								return {validate:false,msg:"不能包含特殊字符"};	
							}
						}	
					break;
					case "noSpecialChar":
						var pattern = new RegExp("[ `~!@#$^&*()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_\"]");
						if(_this.val().length>0){
							if(pattern.test(_this.val())){	
								return {validate:false,msg:"不能包含特殊字符"};	
							}
						}	
					break;
					case "noNumChar":
						var pattern=/^[A-Za-z0-9]+$/g;
						if(_this.val().length>0){
							if(pattern.test(_this.val())){	
								return {validate:false,msg:"不能包含数字和字母"};	
							}
						}	
					break;
					case "numChar":
						var pattern=/^[A-Za-z0-9]+$/g;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){	
								return {validate:false,msg:"只能包含数字和字母"};	
							}
						}	
					break;
					case "num":
						var pattern=/^[0-9]*$/g;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){	
								return {validate:false,msg:"只能包含数字"};	
							}
						}	
					break;
					case "email":
						var pattern= /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
						if(_this.val().length>0){
							if( !pattern.test(_this.val()) || !pattern.test(_this.val()) ){	
								return {validate:false,msg:"邮箱格式不正确"};	
							}
						}
					break;
					case "phone":
						var pattern = /^(1[34578])\d{9}$/;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){
								return {validate:false,msg:"手机格式不正确"};	
							}
						}	
					break;
					case "color":
						var pattern = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){
								return {validate:false,msg:"颜色格式不正确"};	
							}
						}	
					break;	
					case "telephone":
						var pattern = /^\d+(\-\d+)*$/;
						//var pattern = /^0?\d{2,3}\-\d{7,8}$/;
						if(_this.val().length>0){
							if(_this.val().length>20 || _this.val().length<5){
								return {validate:false,msg:"手机格式不正确"};
							}
						}
					break;
					case "password":
						var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){
								return {validate:false,msg:"请输入8-32位字母+数字的组合"};	
							}
						}
					break;
					case "ip":
						var pattern = /^([1-9]|[1-9]\d|1\d\d|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/ig;
						if(_this.val().length>0){
							if(!pattern.test(_this.val())){
								return {validate:false,msg:"请输入正确的IP地址"};	
							}
						}
					break;
					case "zipcode":
						var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
						var patternElse = /^\d{6}$/;
						if(_this.val().length>0){
							if(!patternElse.test(_this.val())){
								return {validate:false,msg:"邮编格式不正确"};	
							}
						}
					break;
					case "num6":
						var myreg=/^\d{6}$/;
						if(_this.val().length>0){
							if(!myreg.test(_this.val())){
								return {validate:false,msg:"请输入6位数字"};
							}
						}
					break;
					case "num1_999":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 999){
								return {validate:false,msg:"请输入1-99之间的整数"};
							}
						}
					break;
					case "num1_99":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 99){
								return {validate:false,msg:"请输入1-99之间的整数"};
							}
						}
					break;
					case "num1_100":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 100){
								return {validate:false,msg:"请输入1-100之间的整数"};
							}
						}
					break;
					case "num1_256":
						var myreg=/^([1-9][0-9]?|[1][0-9][0-9]|[2]([0-4][0-9]|[5][0-6]))$/;
						if(_this.val().length>0){
							if(!myreg.test(_this.val())){
								return {validate:false,msg:"请输入1-256之间的整数"};
							}
						}
					break;
					case "num1_1000":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 1000){
								return {validate:false,msg:"请输入1-1000之间的整数"};
							}
						}
					break;
					case "num1_1024":
						var myreg=/^([1-9]|[\d]{2,3}|10[0-1]\d|102[1-4])$/;
						if(_this.val().length>0){
							if(!myreg.test(_this.val())){
								return {validate:false,msg:"请输入1-1024之间的整数"};
							}
						}
					break;
					case "num1_65535":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 65535){
								return {validate:false,msg:"请输入1-65535之间的整数"};
							}
						}
					break;
					case "num1_1000000":
						if(_this.val().length>0){
							if(_this.val() < 1 || _this.val() > 1000000){
								return {validate:false,msg:"请输入1-1000000之间的整数"};
							}
						}
					break;
					case "char1_6":
						if(_this.val().length>0){
							if(_this.val().length>6){
								return {validate:false,msg:"请输入1-6位字符"};
							}
						}
					break;
					case "char1_8":
						if(_this.val().length>0){
							if(_this.val().length>8){
								return {validate:false,msg:"请输入1-8位字符"};
							}
						}
					break;
					case "char1_10":
						if(_this.val().length>0){
							if(_this.val().length>10){
								return {validate:false,msg:"请输入1-10位字符"};
							}
						}
					break;
					case "char1_20":
						if(_this.val().length>0){
							if(_this.val().length>20){
								return {validate:false,msg:"请输入1-20位字符"};
							}
						}
					break;
					case "char1_40":
						if(_this.val().length>0){
							if(_this.val().length>40){
								return {validate:false,msg:"请输入1-40位字符"};
							}
						}
					break;
					case "char4_20":
						if(_this.val().length>0){
							if(_this.val().length>20 || _this.val().length<4){
								return {validate:false,msg:"请输入4-20位字符"};
							}
						}
					break;
//					case "realmName4_20":
//						if(_this.val().length>0){
//							if(_this.val().length>20 || _this.val().length<4){
//								return {validate:false,msg:Lang.common_word_num20};
//							}
//						}
//					break;
					case "char1_50":
						if(_this.val().length>0){
							if(_this.val().length>50){
								return {validate:false,msg:"请输入1-50位字符"};
							}
						}
					break;
					case "char8_32":
						if(_this.val().length>0){
							if(_this.val().length>32 || _this.val().length<8){
								return {validate:false,msg:"请输入8-32位字符"};
							}
						}
					break;
					case "char1_200":
						if(_this.val().length>0){
							if(_this.val().length>200){
								return {validate:false,msg:"请输入1-200位字符"};
							}
						}
					break;
					case "char1_300":
						if(_this.val().length>0){
							if(_this.val().length>300){
								return {validate:false,msg:"请输入1-300位字符"};
							}
						}
					break;
					case "char1_256":
						if(_this.val().length>0){
							if(_this.val().length>256){
								return {validate:false,msg:"请输入1-256位字符"};
							}
						}
					break;
					case "char1_500":
						if(_this.val().length>0){
							if(_this.val().length>500){
								return {validate:false,msg:"请输入1-500位字符"};
							}
						}
					break;
					case "capital":
						var myreg=/^[A-Z]+$/;
						if(_this.val().length>0){
							if(!myreg.test(_this.val())){
								return {validate:false,msg:"请输入大写字母"};
							}
						}
					break;
				} 
			}
			return {validate:true,msg:"验证合法！"};
	}
}

