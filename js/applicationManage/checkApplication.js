var CheckApplication = {
    /* 初始化 */
   init:function(){
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var token=JCPublicUtil.GetRequest(window.location).token;
    	var type=JCPublicUtil.GetRequest(window.location).type;
        
        if(type==1){	//非应用类型隐藏数据控制和功能控制tab
    		$(".nav li").removeClass("none").css("display","block !important");
	    }
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/get-by-id',"GET",{appId:appId},function(data){
                if (data.code == '000000') {
                    var data = data.dataMap.data;
                    var picUrl='';
                    var fileIds=data.icon;
                    $(".appSign").text(data.id);
                    $(".secretKey p").text(data.publicKey);
                    $("#appName").val(data.name);
                    $("#systemIdentity").val(data.system);
                    $("#appCategory").val(data.type);
                    $("#callbackPath").val(data.url);
                    //图标
                    if(fileIds){
                    	$(".icon_img").attr("src",ConfigURl.rootFileUrl+'/visit?fileId='+fileIds);
                    }
                    
//                  JCPublicUtil.Ajax(ConfigURl.rootFileUrl+'/visit',"GET",{
//                      fileIds:fileIds
//                  },function(data){
//                      if (data.code == '000000') {
//                          var data=data.dataMap.data;
//                          var res=JSON.parse(data);
//                          picUrl=res[0].site;
//                      } else {}
//                  },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
//                  $(".icon_img").attr("src",picUrl);
                    $("#appDecribe").val(data.depict);
                    var support = data.supports.split('');
                    if(support[0]=='1'){
                        $("#android").prop('checked',true);
                    } else{
                        $("#android").prop('checked',false);
                    }
                    if(support[1]=='1'){
                        $("#ios").prop('checked',true)
                    } else {
                        $("#ios").prop('checked',false);
                    }
                    if(support[2]=='1'){
                        $("#browser").prop('checked',true)
                    } else {
                        $("#browser").prop('checked',false);
                    }
                    if(support[3]=='1'){
                        $("#win").prop('checked',true)
                    } else {
                        $("#win").prop('checked',false);
                    }
                    if(support[4]=='1'){
                        $("#mac").prop('checked',true)
                    } else {
                        $("#mac").prop('checked',false);
                    }
                    if(support[5]=='1'){
                        $("#other").prop('checked',true)
                    } else {
                        $("#other").prop('checked',false);
                    }
                } else {}
            },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    dataControl:function(){
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var token=JCPublicUtil.GetRequest(window.location).token;
        function typeFormat(value,row,index){
            if(value==2){ return "数量控制"}
            if(value==1){ return "时间控制"}
            if(value==3){ return "其他"}
        }
        // function showOperate(value,row,index){
        //     return [
        //         '<a href="javascript:void(0);" data-id="'+row.id+'" onclick="CheckApplication.checkDetail(this)">查看</a>'
        //     ]
        // }
        
        var columnsObj = [
            {field: 'id',title:'id',visible:false},
            {field: 'fixed',title:'fixed',visible:false},/* 是否固定参数 */
            {field: 'appId',title:'参数ID',align: 'center',valign: 'middle'},
            {field: 'name',title:'参数名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:typeFormat},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'paramValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'}
            // {field: '',title:'操作',align: 'center',valign: 'middle',formatter:showOperate}
        ];
        function queryParams(params) {
            params.appId = appId;
            return params;  
        }
        $("#dataControlTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
            url: ConfigURl.rootURL+"/mnt/application/get-param-list-by-app-id",
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
            ajaxOptions:{
			    headers: {"token":token}
			},
            formatLoadingMessage: function(){
                return " ";
            },
            responseHandler:function(res){
                return {
                    "data": res.dataMap.data   //数据
                 };

            }
        });
    },
   
    /* 查询功能控制 */
    funcControl:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var appId=JCPublicUtil.GetRequest(window.location).appId;
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
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/get-features-by-id',"GET",{appId:appId},function(data){
            if (data.code == '000000') {
            	$("#xml_file").attr("data-id",data.dataMap.data.featuresFileId);
                var data = data.dataMap.data.features;
                zTree = $.fn.zTree.init($("#treeDemo"), setting, data);
                zTree.expandAll(zTree);
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = treeObj.getNodes();
                for (var i=0; i < nodes.length; i++) {
                    treeObj.setChkDisabled(nodes[i], true,'',true);
                }
                treeObj.removeClass("curSelectedNode");
			$(".curSelectedNode").removeClass("curSelectedNode");
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //导出功能列表
    exportFuns:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
    	var fileId=$("#xml_file").attr("data-id");
    	if(fileId==""||fileId==null){	
    		Common.message("info","暂无可导出功能表");
    	} else {
    		var url = ConfigURl.rootFileUrl+"/download?fileId="+fileId;
			window.location.href = url;
    	}
    },
    save:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#appName").val();
        var system = $("#systemIdentity").val();
        var type = $("#appCategory option:selected").val();
        var url = $("#callbackPath").val();
        var icon = '12345';
        var supports = AddApplication.supportChecked();
        var depict = $("#appDecribe").val();
        var obj={};
        obj.name = name;
        obj.system = system;
        obj.type = type;
        obj.url = url;
        obj.icon = icon;
        obj.supports = supports;
        obj.depict = depict;
        if(name==""){ 
            $("#appName").next(".errorTip").show();
        } else if(system==""){
            $("#systemIdentity").next(".errorTip").show();
        } else if(url==""){
            $("#callbackPath").next(".errorTip").show();
        } else {
            $("#appName,#systemIdentity,#callbackPath").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/add',"GET",obj,function(data){
                if (data.code == '000000') {
                } else {}
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
            
    }
}