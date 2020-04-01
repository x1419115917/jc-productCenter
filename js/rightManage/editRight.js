var EditRight = {
    /* 初始化 */ 
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var type=JCPublicUtil.GetRequest(window.location).type;
        //type:1-版本   type:2-套餐
        if(type==1){
            EditRight.showAppTable();
            $(".mealDetail").css("display","none");
        } else if(type==2){
            EditRight.showMealTable();
            $(".appDetail").css("display","none");
        }
    },
    //应用列表
    showAppTable:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var authorizeId=JCPublicUtil.GetRequest(window.location).id;
        //数据回显
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/get-by-id?number='+Math.random(),"GET",{
            authorizeId:authorizeId
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                $("#enterpriseName").val(data.companyId);
                $("#rightProduct").val(data.productionName).attr("data-id",data.productionId);
                $("#rightDecribe").val(data.depict);
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});

        function controlType(value, row, index){
            if(value==1){return "时间";}
            if(value==2){return "数量";}
            if(value==3){return "其它";}
        }
        function setParam(value, row, index){
            if(row.type==2){
                return ["<input type='number' style='width:100%;'  oninput='if(value.length>6)value=value.slice(0,6)' id='numParam' value='"+row.paramValue+"'>"]
            } else if(row.type==1){
                return ["<input type='text' style='width:100%;' value='"+row.paramValue+"' readonly class='paramVal' onclick='EditRight.initDate(this)' />"]
            } else if(row.type==3){
            	return ["<input type='text' style='width:100%;'  value='"+row.paramValue+"' class='otherParam' />"]
            }
        }
        //应用信息
        var columnsObj = [
			{field: 'id',title:'授权点ID',align: 'center',valign: 'middle',class:"paramId"},
			{field: 'name',title:'授权点名称',align: 'center',valign: 'middle'},
		  	{field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
		  	{field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
		  	{field: 'defalutValue',title:'默认键值',align: 'center',valign: 'middle'},
		  	{field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
		  	{field: 'paramValue',title:'参数值',align: 'center',valign: 'middle',formatter:setParam,class:"paramValue"},
        ];
		function queryParams(params) {
			params.authorizeId = authorizeId;
		    return params;  
        }
        
        $("#appTable").bootstrapTable({
			url: ConfigURl.rootURL+"/mnt/authorize/get-by-id?number="+Math.random(),
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
                    "data": res.dataMap.data.params[0].params //数据
                 };
            }
        });
    },
    //套餐列表
    showMealTable:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var authorizeId=JCPublicUtil.GetRequest(window.location).id;
         //数据回显
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/get-by-id?number='+Math.random(),"GET",{
            authorizeId:authorizeId
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                $("#enterpriseName").val(data.companyId);
                $("#rightProduct").val(data.productionName).attr("data-id",data.id);
                $("#rightDecribe").val(data.depict);
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
        //套餐信息
        function productType(value, row, index){   
            if(value==1){return "版本";}
            if(value==2){return "套装";}
        }
        function productMode(value, row, index){ //产品模式（1-网售 2-定制）
            if(value==1){return "网售";}
            if(value==2){return "定制";}
        }
        var columnsObj = [
			{field: 'id',title:'id',visible:false},
			{field: 'code',title:'产品编号',align: 'center',valign: 'middle'},
			{field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
		  	{field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
		  	{field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
		  	{field: 'appName',title:'所属应用',align: 'center',valign: 'middle'},
		];
		function queryParams(params) {
			params.authorizeId = authorizeId;
		    return params;  
         }
        $("#mealTable").bootstrapTable({
			url: ConfigURl.rootURL+"/mnt/authorize/get-by-id?number="+Math.random(),
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
            responseHandler:function(data){
                return {
                    "data": data.dataMap.data.params //数据
                 };
            }
        });
    },
    //时间下拉框初始化
    initDate:function(that){
        $(".paramVal").datetimepicker({
            language:'zh-CN',
            format: 'yyyy-mm-dd hh:ii'
        });
        $(that).datetimepicker('show');
    },
    //保存
    save:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var tr=$("#appTable >tbody>tr");
        var arrParams=[];
        var params={};
        var obj={};
        obj.id=$("#rightProduct").attr("data-id");
        for(var i=0;i<tr.length;i++){
            var td=tr[i];
            var paramId = $(td).children(".paramId").text();
            var paramValue = $(td).children(".paramValue").find("input").val();
            params[paramId]=paramValue;
            }
        obj.params=params;
        arrParams.push(obj);
        var otherParam=$("#rightDetail >tbody>tr>td .otherParam").val();
        var authorizeId=JCPublicUtil.GetRequest(window.location).id;
        var depict=$("#rightDecribe").val();
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/update',"POST",{
            authorizeId:authorizeId,
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
                }else if(data==-1){
                    Common.message("error","数据过时，请刷新界面");
                }
            } else if (data.code == 'E00000') {
                var data=data.dataMap.data;
                if(data==0){
                    Common.message("error","操作异常");
                }else if(data==-1){
                    Common.message("error","数据过时，请刷新界面");
                }
            } else if(data.code=="E00001"){
                	var data = data.dataMap.data;
                    Common.message("error","非法参数");
                }
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    }
}