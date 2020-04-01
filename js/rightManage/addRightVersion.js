var AddRightVersion = {
    /* 初始化 */ 
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
    	JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/get-cache-list-by-all',"GET",{},function(data){
               	if(data!=null||data!=""){
                		var data=data.dataMap.data;
                		var html='';
                		for(var i=0;i<data.length;i++){
                			var code=data[i].code;
                			if(code!=null&&code!=undefined&&code!=''){
                				html+="<option value='"+data[i].name+"' data-type='"+data[i].type+"' data-id='"+data[i].id+"'>"+data[i].name+"（"+code+"）</option>";
                			} else {
                				html+="<option value='"+data[i].name+"' data-type='"+data[i].type+"' data-id='"+data[i].id+"'>"+data[i].name+"</option>";
                			}
                		}
                		$(".searchProduct").append(html);
                	}
            },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
            
        $('.searchProduct').val('').trigger('change');
        $('.searchProduct').select2({
            placeholder: '输入产品编号或名称（仅能授权版本）'
//          ajax:{
//              type:'GET',
//              url: ConfigURl.rootURL+'/mnt/production/get-cache-list-by-all',
//              dataType: 'json',
//              data: function (params) {
//                  return {
//                  };
//              },
//              headers:{"token":token},
//              processResults: function (data, params) {
//                  var itemList = [];
//                  var arr = data.dataMap.data;
//                  for(var i in arr){
//                      itemList.push({id: arr[i].id, text: arr[i].name,type:arr[i].type})
//                  }
//                  return {
//                      results: itemList,
//                  };
//              },
//              cache: true
//          }
        }).on("select2:select",function(data){	//选中之后触发
        	var item=$(".searchProduct option:selected")[0].dataset;
			var type=item.type;
			var id=item.id;
//      	var res=data.params.data;
//      	var type=res.type;		//1-版本	2-套餐
//      	var id=res.id;
        	if(type==1){
        		$("#rightDetail").bootstrapTable("destroy");
        		AddRightVersion.initVersionTab(id);
        	} else if(type==2){
        		$("#rightDetail").bootstrapTable("destroy");
        		AddRightVersion.initMealTab(id);
        	}
        });
        $('.searchProduct').val('').trigger('change');
    },
    initDate:function(that){
        $(".paramVal").datetimepicker({
            language:'zh-CN',
            format: 'yyyy-mm-dd hh:ii'
        });
        $(that).datetimepicker('show');
    },
    //初始化版本信息表格
    initVersionTab:function(productionId){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        function controlType(value, row, index){
            if(value==1){return "时间";}
            if(value==2){return "数量";}
            if(value==3){return "其它";}
        }
        //应用信息
        var columnsObj = [
			{field: 'id',title:'授权点ID',align: 'center',valign: 'middle',class:"paramId"},
			{field: 'name',title:'授权点名称',align: 'center',valign: 'middle'},
		  	{field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
		  	{field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
		  	{field: 'defaultValue',title:'默认键值',align: 'center',valign: 'middle'},
		  	{field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
		  	{field: 'paramValue',title:'参数值',align: 'center',valign: 'middle',formatter:setParam,class:"paramValue"}
		];
		function queryParams(params) {
			params.productionId = productionId;
			params.stage = 2;
		    return params;  
         }
        function setParam(value, row, index){
            if(row.type==2){
                return ["<input type='number' style='width:100%;' oninput='if(value.length>6)value=value.slice(0,6)' id='numParam' value='"+row.paramValue+"'>"]
            } else if(row.type==1){
                return ["<input type='text' style='width:100%;'  value='"+row.paramValue+"' readonly class='paramVal' onclick='AddRightVersion.initDate(this)' />"]
            } else if(row.type==3){
            	return ["<input type='text' style='width:100%;'  value='"+row.paramValue+"' class='otherParam' />"]
            }
        }
        $("#rightDetail").bootstrapTable({
			url: ConfigURl.rootURL+"/mnt/production/get-param-list-by-id?number="+Math.random(),
			cache: false,
			sortable:true,
			columns: columnsObj,
            queryParams: queryParams,
            method: "get",
        	dataType: "json",
        	contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        	formatNoMatches: function(){
                return "没有找到匹配的记录";
            },
            formatLoadingMessage: function(){
                return " ";
            },
            ajaxOptions:{
			    headers: {"token":token}
			},
            responseHandler:function(res){
            	if(res.dataMap.data!=null){
            		return {
	                    "data": res.dataMap.data //数据
	                };
            	} else {
            		return []
            	}
                
            }
        });
    },
    //初始化套餐信息表格
    initMealTab:function(productionId){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        function productType(value, row, index){   
            if(value==1){return "版本";}
            if(value==2){return "套装";}
        }
        function productMode(value, row, index){ //产品模式（1-网售 2-定制）
            if(value==1){return "网售";}
            if(value==2){return "定制";}
        }
        //套餐信息
        var columnsObj = [
			{field: 'id',title:'id',visible:false},
			{field: 'code',title:'产品编号',align: 'center',valign: 'middle'},
			{field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
		  	{field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
		  	{field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
		  	{field: 'appName',title:'所属应用',align: 'center',valign: 'middle'},
		];
		function queryParams(params) {
			params.productionId = productionId;
			params.stage = 2;
		    return params;   
         }
        $("#rightDetail").bootstrapTable({
			url: ConfigURl.rootURL+"/mnt/production/get-production-list-by-id?number="+Math.random(),
			cache: false,
			sortable:true,
			columns: columnsObj,
            queryParams: queryParams,
            method: "get",
        	dataType: "json",
        	contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        	formatNoMatches: function(){
                return "没有找到匹配的记录";
            },
            formatLoadingMessage: function(){
                return " ";
            },
            ajaxOptions:{
			    headers: {"token":token}
			},
            responseHandler:function(res){
                return {
                    "data": res.dataMap.data   //数据
                 };
            }
        });
    },
    //新增授权
    save:function(){
    	var ret = VT.formSubmit("addRightForm");
    	var token=JCPublicUtil.GetRequest(window.location).token;
    	var companyId=$("#enterpriseName").val();
        var productionId=$(".searchProduct option:selected").attr("data-id");
        var depict=$("#remarks").val();
        var tr=$("#rightDetail >tbody>tr");
        var arrParams=[];
        var params={};
        var obj={};
        obj.id=productionId;
        for(var i=0;i<tr.length;i++){
            var td=tr[i];
            var paramId = $(td).children(".paramId").text();
            var paramValue = $(td).children(".paramValue").find("input").val();
            params[paramId]=paramValue;
            }
        obj.params=params;
        arrParams.push(obj);
        var numParam=$("#rightDetail >tbody>tr>td #numParam").val();
        var otherParam=$("#rightDetail >tbody>tr>td .otherParam").val();
        if(ret){ 
            $("#enterpriseName").next(".errorTip").hide();
            $(".searchProduct").next().next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/add',"POST",{
                productionId:productionId,
                companyId:companyId,
                depict:depict,
                params:JSON.stringify(arrParams)
            },function(data){
               	if (data.code == '000000') {
                    var data=data.dataMap.data;
                    if(data==1){
                        Common.message("success","操作成功");
                        window.setInterval(function(){
                        	window.location.href='../../static/rightManage/rightManage.html?token='+token;
                        },1000);
                    } else if(data==0){
                        Common.message("error","操作异常");
                    } else if(data==-1){
                        Common.message("error","该授权已存在");
                    } else if(data==-2){
                        Common.message("error","企业不存在");
                    }
                } else if(data.code=="E00000"){
                	var data = data.dataMap.data;
                	if(data==0){
                		Common.message("error","操作异常");
                	} else if(data==-1){
                		Common.message("error","操作异常");
                	} else if(data==-2){
                        Common.message("error","企业不存在");
                    }
                } else if(data.code=="E00001"){
	                	var data = data.dataMap.data;
	                    Common.message("error","非法参数");
	                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
    }
    
}