var CheckProductVersion = {
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
    //数据控制
    dataControl:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        function controlType(value, row, index){
            if(value==1){return "时间";}
            if(value==2){return "数量";}
        }
        var columnsObj = [
            {field: 'id',title:'参数ID',align: 'center',valign: 'middle'},
            {field: 'name',title:'参数名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'defaultValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
            {field: 'paramValue',title:'参数值',align: 'center',valign: 'middle'}
        ];
        function queryParams(params) {
            params.productionId = productionId;
            params.stage = stage;
            return params;  
        }
        $("#dataControlTable").bootstrapTable({
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
                return {
                    "data": res.dataMap.data  
                 };

            }
        });
    },
    //功能控制
    funcControl:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        var zTree;  
        var setting = { 
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback:{
           
            }
        };
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/get-features-by-id',"GET",{
            productionId:productionId,
            stage:stage
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                zTree = $.fn.zTree.init($("#treeDemo"), setting, data);
                zTree.expandAll(zTree);//展开树
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = treeObj.getNodes();
                for (var i=0; i < nodes.length; i++) {
                    treeObj.setChkDisabled(nodes[i], true,'',true);
                }
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    }
}