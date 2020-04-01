var CheckProductMeal = {
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/get-by-id',"GET",{
            productionId:productionId,
            stage:stage
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                var pattern=data.pattern;
                if(pattern==1){
                    $("#netPro").prop("checked",true)
                }else if(pattern==2){
                    $("#customPro").prop("checked",true)
                }
                $("#name").val(data.name);
                $(".code").text(data.code);
                $(".proType").val(data.type);
                $("#remarks").val(data.depict);
                
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    productList:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        function productType(value, row, index){
            if(value==1){return "版本";}
            if(value==2){return "套餐";}
        }
        function productMode(value, row, index){
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
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        function queryParams(params) {
            params.productionId = productionId;
            params.stage = stage;
            return params;  
        }
        /* 此处记得更换url */
        $("#dataControlTable").bootstrapTable({
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
                    "data": res.dataMap.data  
                 };

            }
        });
    }
}