var RightManage = {
     /* 初始化 */ 
    init:function(){
        RightManage.getPlatformAndApp();
//      RightManage.initProductTable();
        var appId_=JCPublicUtil.GetRequest(window.location).id;	//应用ID
    	var type_=JCPublicUtil.GetRequest(window.location).type;	//1应用-2平台-3接口
    	if(appId_!=""||appId_!=null){
    		RightManage.findProductList(appId_,type_);
    	} else {
    		RightManage.findProductList();
    	}
    },
    //查看，编辑界面跳转
    goToCheckOrEdit:function(that,item){   //item:1-查看 2-编辑  type:1-版本 2-套装
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var id = $(that).attr("data-id");
        var type=$(that).attr("data-type");
        var url;
        if(item==1){ //查看授权界面
            url ="../../static/rightManage/checkRight.html?id="+id+"&type="+type+"&token="+token;
        } else if(item ==2){//编辑授权界面
            url ="../../static/rightManage/editRight.html?id="+id+"&type="+type+"&token="+token;
        }
        window.location.href=url;
    },
    //获取平台和应用和产品列表
    getPlatformAndApp:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        //应用分类 （1-应用，2-平台，3-接口）
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-list-by-type","get",{
            type:1
        },function(data){
            if (data.code == '000000') {
                var data=data.dataMap.data;
                var html="";
                for(var i=0;i<data.length;i++){
                    html += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
                }
                $(".productApp").append(html);
            } else {}
        },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
        
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-list-by-type","get",{
            type:2
        },function(data){
            if (data.code == '000000') {
                var data=data.dataMap.data;
                var html="";
                for(var i=0;i<data.length;i++){
                    html += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
                }
                $(".productPlatform").append(html);
            } else {}
        },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
        
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/get-cache-list-by-all","get",{},function(data){
            if (data.code == '000000') {
                var data=data.dataMap.data;
                var html="";
                for(var i=0;i<data.length;i++){
                    html += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
                }
                $(".productType").append(html);
            } else {}
        },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
    },
    //查询产品列表
    findProductList:function(appId_,type_){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var productionId = $("#rightManage .productType option:selected").val();
        if(appId_==""||appId_==null||appId_==undefined){
            	var platformId = $("#rightManage .productPlatform option:selected").val();
        		var appId = $("#rightManage .productApp option:selected").val();
           } else {
        		if(type_==1){ //应用
            		var platformId = $("#rightManage .productApp option:selected").val();
					appId=appId_;
					var optionId=$(".productApp").find("option");
					for(var i=0;i<optionId.length;i++){
						if(appId_==optionId[i].value){
		                		$(".productSelect .productApp").val(appId_);
		                	}
					}
        		} else if(type_==2){	//平台
        			var appId = $("#rightManage .productPlatform option:selected").val();
					platformId=appId_;
					var optionId=$(".productPlatform").find("option");
					for(var i=0;i<optionId.length;i++){
						if(appId_==optionId[i].value){
		                		$(".productSelect .productPlatform").val(appId_);
		                	}
					}
        		}
        	}
        RightManage.initProductTable(platformId,appId,productionId);
    },
    //初始化表格
    initProductTable:function(platformId,appId,productionId){   //productionId:产品 platformId:平台 appId：应用
    	var token=JCPublicUtil.GetRequest(window.location).token;
            function showOperate(value, row, index){
                var html = "";
                	html += '<a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="查看"  onclick="RightManage.goToCheckOrEdit(this,1)">查看</a>';
                if(row.type!=2){
                	html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="编辑"  onclick="RightManage.goToCheckOrEdit(this,2)">编辑</a>';
                }
                if(row.status == 0){
                    html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-status="'+ row.status +'" data-id="'+ row.id +'"  title="停用"  onclick="RightManage.stopAndUse(this)">停用</a>';
                } else if(row.status == 1) {
                    html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-status="'+ row.status +'" data-id="'+ row.id +'"  title="启用"  onclick="RightManage.stopAndUse(this)">启用</a>';
                }
                	html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-id="'+ row.id +'"  title="删除" onclick="RightManage.delete(this)">删除</a>';
                	return html;
            }
            function dateFormat(value, row, index){
            	if(value==""||value==null){
            		return '-'
            	} else {
            		return JCPublicUtil.DateFormat(new Date(value),'YYYY-MM-dd hh:mm');
            	}
            }
            function showState(value, row, index){
                if(value == 0){
                    return "<span style='color:#339900;'>正常<span>";
                } else if(value == 1) {
                    return "<span style='color:#FF3300;'>停用<span>";
                }
            }
            function belongApp(value){
            	if(value == ''||value == null){
                    return "-";
               } else {
               		return value;
               }
            }
            var columnsObj = [
                {field: 'id',title:'id',visible:false},
                {field: 'companyName',title:'企业',align: 'center',valign: 'middle'},
                {field: 'productionName',title:'产品',align: 'center',valign: 'middle'},
                {field: 'platformName',title:'所属平台',align: 'center',valign: 'middle'},
                {field: 'appName',title:'所属应用',align: 'center',valign: 'middle',formatter:belongApp},
                {field: 'authorizedUserLimit',title:'授权人数',align: 'center',valign: 'middle'},
                {field: 'authorizedExpiration',title:'到期时间',align: 'center',valign: 'middle',formatter:dateFormat},
                {field: 'status',title:'状态',align: 'center',valign: 'middle',formatter:showState},
                {field: 'createDate',title:'创建时间',align: 'center',valign: 'middle',formatter:dateFormat},
                {field: 'updateDate',title:'修改时间',align: 'center',valign: 'middle',formatter:dateFormat},    
                {field: '',title:'操作',align: 'center',valign: 'middle',width:'15%',formatter:showOperate}
            ];
            function queryParams(params) {
            	var temp = {   
			            pageSize: params.limit,                         
			            currentPage: (params.offset / params.limit) + 1,
			            productionId:productionId,
			            platformId:platformId,
			            appId:appId
				    };
				    return temp;
             }
            $("#rightManageTable").bootstrapTable("destroy");
            $("#rightManageTable").bootstrapTable({
                locales:'zh-CN',
                pagination:true,
                sidePagination: 'server',
	            currentPage:1,
	            pageSize: 20, 
	            pageList: [10, 20],
                url: ConfigURl.rootURL+"/mnt/authorize/get-list-by-page?number="+Math.random(),
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
                    var data = {};
					data.total =  res.dataMap.data.total;
					data.rows = res.dataMap.data.rows;
					return data;  
                }
            });
    },
    
    
    /* 停用/启用 */
    stopAndUse:function(item){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var authorizeId = $(item).attr("data-id");
        var nowStatus = $(item).attr("data-status");
        var status,title,message;
        if(nowStatus=="0"){ //0-启用    1-停用
            status=1;
            title='停用授权？';
            message='你确定要停用该授权？';
        } else if(nowStatus=="1"){
            status=0;
            title='启用授权？';
            message='你确定要启用该授权？';
        }
        bootbox.dialog({
            message: message,
            title: title,
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/authorize/on-or-off","get",{
                            authorizeId:authorizeId,
                            status:status
                        },function(data){
                			if (data.code == '000000') {
                                var data=data.dataMap.data;
                                if(data==1){
                                	$("#rightManageTable").bootstrapTable("refresh");
                                    Common.message("success","操作成功");
                                } else if(data==0){
                                    Common.message("error","操作异常");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if (data.code == 'E00000') {
                                var data=data.dataMap.data;
                               if(data==0){
                                    Common.message("error","操作异常");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if(data.code=="E00001"){
			                	var data = data.dataMap.data;
			                    Common.message("error","非法参数");
			                }
                		},function(){},6000,false,"json",'',{headers:{'token':token}});
                    }
                },
                cancel: {
                    label: '取消',
                    className: "red",
                    callback: function() {
                    }
                }
            }
        });
    },
    /* 删除 */
    delete:function(item){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var authorizeId = $(item).attr("data-id");
        bootbox.dialog({
            message: '你确定要删除该应用？',
            title: '删除应用',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/authorize/remove-by-id","get",{authorizeId:authorizeId},function(data){
                			if (data.code == '000000') {
                                var data=data.dataMap.data;
                				if(data==1){
//              					$("#rightManageTable").bootstrapTable("destroy");
//      							RightManage.initProductTable();
                					$("#rightManageTable").bootstrapTable("refresh");
                                    Common.message("success","操作成功");
                                } else if(data==0){
                                    Common.message("error","操作异常");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if (data.code == 'E00000') {
                                var data=data.dataMap.data;
                				if(data==0){
                                    Common.message("error","操作异常");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if(data.code=="E00001"){
			                	var data = data.dataMap.data;
			                    Common.message("error","非法参数");
			                }
                		},function(){},6000,false,"json",'',{headers:{'token':token}});
                    	
                	}
                },
                cancel: {
                    label: '取消',
                    className: "red",
                    callback: function() {
                    }
                }
            }
        });
    }
       
}