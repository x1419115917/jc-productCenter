var EditProductVersion = {
    init:function(){
    	EditProductVersion.getPlatformAndApp();
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
                $(".code").text(data.code);
                $("#name").val(data.name);
                if(pattern==1){
                    $("#netPro").prop("checked",true)
                }else if(pattern==2){
                    $("#customPro").prop("checked",true)
                }
                $(".proType").val(data.type);
                $("#belongApp").val(data.appId);
                $("#belongPlatform").val(data.platformId);
                
                $("#remarks").val(data.depict);
                
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //获取平台和应用
    getPlatformAndApp:function(){
        //应用分类 （1-应用，2-平台，3-接口）
        var token=JCPublicUtil.GetRequest(window.location).token;
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-list-by-type","get",{
            type:2
        },function(data){
            if (data.code == '000000') {
                var data=data.dataMap.data;
                var html="";
                for(var i=0;i<data.length;i++){
                    html += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
                }
                $(".belongPlatform").append(html);
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
        
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-list-by-type","get",{
            type:1 
        },function(data){
            if (data.code == '000000') {
                var data=data.dataMap.data;
                var html="";
                for(var i=0;i<data.length;i++){
                    html += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
                }
                $(".belongApp").append(html);
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
            if(value==3){return "其他";}
        }
        function inputParam(value, row, index){
                if(row.type==2){
                    if(row.paramValue==undefined ||row.paramValue==null){
                        return ["<input type='number' oninput='if(value.length>6)value=value.slice(0,6)' style='width:100%;'  id='numParam'  value=''>"]
                    } else {
                        return ["<input type='number' oninput='if(value.length>6)value=value.slice(0,6)' style='width:100%;'  id='numParam'  value='"+row.paramValue+"'>"]
                    }
                } else if(row.type==1){
                    if(row.paramValue==undefined ||row.paramValue==null){
                        return ["<input type='text' maxlength='40' style='width:100%;' value='' readonly class='paramVal' onclick='EditProductVersion.initDate(this)' />"]
                    } else {
                        return ["<input type='text' maxlength='40' style='width:100%;' value='"+row.paramValue+"' readonly class='paramVal' onclick='EditProductVersion.initDate(this)' />"]
                    }
                   
                } else if(row.type==3){
                    if(row.paramValue==undefined ||row.paramValue==null){
                        return ["<input type='text' style='width:100%;' value='' class='otherparam' />"]
                    } else {
                        return ["<input type='text' style='width:100%;' value='"+row.paramValue+"'  class='otherparam' />"]
                    }
                   
                }
        }
        var columnsObj = [
            {field: 'id',title:'参数ID',align: 'center',valign: 'middle',class:'paramId'},
            {field: 'name',title:'参数名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'defaultValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
            {field: '',title:'参数值',align: 'center',valign: 'middle',formatter:inputParam,class:"paramValue"}
        ];
        function queryParams(params) {
            params.productionId = productionId;
            params.stage = stage;
            return params;  
        }
        $("#dataControlTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
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
    //时间下拉框初始化
    initDate:function(that){
        $(".paramVal").datetimepicker({
            language:'zh-CN',
            format: 'yyyy-mm-dd hh:ii'
        });
        $(that).datetimepicker('show');
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
                zTree.expandAll(zTree);
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //基本信息保存
    save:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#name").val();
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var platformId=$("#belongPlatform").val();
        var appId=$("#belongApp").val();
        var type=$("#proType").val();
        var pattern=$(".proMode input[type='radio']:checked").val();
        var depict = $("#remarks").val();
        var obj={};
        obj.name = name;
        obj.productionId = productionId;
        obj.platformId = platformId;
        obj.appId = appId;
        obj.type = type;
        obj.pattern = pattern;
        obj.depict = depict;
        if(name==""){ 
            $("#name").next(".errorTip").show();
        } else {
            $("#name").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update',"POST",obj,function(data){
                if (data.code == '000000') {
                    if(data.dataMap.data==1){
                        Common.message("success","操作成功");
                    } else if(data.dataMap.data==0){
                        Common.message("error","操作异常");
                    } else if(data.dataMap.data==-1){
                        Common.message("error","参数异常");
                    } else if(data.dataMap.data==-2){
                        Common.message("error","产品名称已存在");
                    }
                } else if (data.code == 'E00000') {
                    if(data.dataMap.data==1){
                        Common.message("success","操作成功");
                    } else if(data.dataMap.data==0){
                        Common.message("error","操作异常");
                    } else if(data.dataMap.data==-1){
                        Common.message("error","参数异常");
                    } else if(data.dataMap.data==-2){
                        Common.message("error","产品名称已存在");
                    }
                }  else if(data.code=="E00001"){
	                	var data = data.dataMap.data;
	                    Common.message("error","非法参数");
	                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
    },
    //数据控制保存
    dataControlSave:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var tr=$("#dataControlTable >tbody>tr");
        var params={};
        for(var i=0;i<tr.length;i++){
            var td=tr[i];
            var paramId = $(td).children(".paramId").text();
            var paramValue = $(td).children(".paramValue").find("input").val();
            params[paramId]=paramValue;
            }
        var productionId=JCPublicUtil.GetRequest(window.location).id;
//      var numParam=$("#dataControlTable >tbody>tr>td #numParam").val();
        	JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update-params',"POST",{
            productionId:productionId,
            params:JSON.stringify(params)
		        },function(data){
		            if (data.code == '000000') {
		                var data = data.dataMap.data;
		                if(data==1){
		                    Common.message("success","操作成功");
		                } else if(data==0){
		                    Common.message("error","操作异常");
		                } else if(data==-1){
		                    Common.message("error","参数异常");
		                }
		            } else if (data.code == 'E00000') {
		                var data = data.dataMap.data;
		                if(data==1){
		                    Common.message("success","操作成功");
		                } else if(data==0){
		                    Common.message("error","操作异常");
		                } else if(data==-1){
		                    Common.message("error","参数异常");
		                }
		                
		            } else if(data.code=="E00001"){
		                	var data = data.dataMap.data;
		                    Common.message("error","非法参数");
		                }
		        },function(){},6000,false,"json",'',{headers:{'token':token}});
        
    },
    //功能控制保存
    funcSave:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var checkNodes = treeObj.getCheckedNodes(true); //获取勾选的节点
        var checkArr=[];
        for (var i=0; i < checkNodes.length; i++) {
            checkArr.push(checkNodes[i].id);
        }
        var features=checkArr.join(",");
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update-features',"GET",{
            productionId:productionId,
            features:features
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                if(data==1){
                    Common.message("success","操作成功");
                } else if(data==0){
                    Common.message("error","操作异常");
                } else if(data==-1){
                    Common.message("error","参数异常");
                } 
            } else if (data.code == 'E00000') {
                var data = data.dataMap.data;
                if(data==1){
                    Common.message("success","操作成功");
                } else if(data==0){
                    Common.message("error","操作异常");
                } else if(data==-1){
                    Common.message("error","参数异常");
                }
            } else if(data.code=="E00001"){
                	var data = data.dataMap.data;
                    Common.message("error","非法参数");
	            }
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    }
}