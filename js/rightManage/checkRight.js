var CheckRight = {
    /* 初始化 */ 
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var type=JCPublicUtil.GetRequest(window.location).type;
        //type:1-版本   type:2-套餐
        if(type==1){
            CheckRight.showAppTable();
            $(".mealDetail").css("display","none");
        } else if(type==2){
            CheckRight.showMealTable();
            $(".appDetail").css("display","none");
        }
    },
    //应用列表
    showAppTable:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var authorizeId=JCPublicUtil.GetRequest(window.location).id;
        //数据回显
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/get-by-id',"GET",{
            authorizeId:authorizeId
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                $("#enterpriseName").val(data.companyId);
                $("#rightProduct").val(data.productionName);
                $("#rightDecribe").val(data.depict);
                
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});


        function controlType(value, row, index){
            if(value==1){return "时间";}
            if(value==2){return "数量";}
        }
        //应用信息
        var columnsObj = [
            {field: 'id',title:'授权点ID',align: 'center',valign: 'middle'},
            {field: 'name',title:'授权点名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'defalutValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
            {field: 'paramValue',title:'参数值',align: 'center',valign: 'middle'}
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
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/authorize/get-by-id?number='+Math.random(),"GET",{
            authorizeId:authorizeId
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                $("#enterpriseName").val(data.companyId);
                $("#rightProduct").val(data.productionName);
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
            {field: 'code',title:'产品编号',align: 'center',valign: 'middle'},
            {field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
            {field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
            {field: 'appName',title:'所属应用',align: 'center',valign: 'middle'}
        ];
        function queryParams(params) {
            params.authorizeId = authorizeId;
            return params;  
        }
        $("#mealTable").bootstrapTable({
            url: ConfigURl.rootURL+"/mnt/authorize/get-by-id",
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
	                    "data": data.dataMap.data.params
                };
            }
        });
    }
}