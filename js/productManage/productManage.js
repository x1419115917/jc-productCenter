var ProductManage = {
    //查看，编辑界面跳转
    goToCheckOrEdit:function(that,item,stage){    //item:1-查看 2-编辑   type:1-版本 2-套装  stage:1-产品定义阶段  2-产品缓冲  3-产品发布
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var id = $(that).attr("data-id");
        var type=$(that).attr("data-type");
        var url;
        if(item==1 && type=='1'){ //查看版本界面
            url ="../../static/productManage/checkProductVersion.html?id="+id+"&stage="+stage+"&token="+token;
        } else if(item ==1 && type=='2'){//查看套餐界面
            url ="../../static/productManage/checkProductMeal.html?id="+id+"&stage="+stage+"&token="+token;
        } else if(item ==2 && type=='1'){//编辑版本界面
            url ="../../static/productManage/editProductVersion.html?id="+id+"&stage="+stage+"&token="+token;
        } else if(item ==2 && type=='2'){//编辑套餐界面
            url ="../../static/productManage/editProductMeal.html?id="+id+"&stage="+stage+"&token="+token;
        }
        window.location.href=url;
    },
    //初始化 
    init:function(){
        ProductManage.getPlatformAndApp();
        var appId_=JCPublicUtil.GetRequest(window.location).id;	//应用ID
    	var type_=JCPublicUtil.GetRequest(window.location).type;	//应用-平台-接口
    	if(appId_!=""||appId_!=null){
    		ProductManage.findProductList(1,appId_,type_);
    	} else {
    		ProductManage.findProductList(1);
    	}
    },
    //获取平台和应用
    getPlatformAndApp:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        //应用分类 （1-应用，2-平台，3-接口）
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
    },
    //查询产品
    findProductList:function(stage,appId_,type_){ //item:1-产品定义  2-产品缓冲  3-产品在线
    	var token=JCPublicUtil.GetRequest(window.location).token;
        if(stage==1){
        	$(".newAdd").css("display","block");
            var type = $("#proDifine .productType").val();
            if(appId_==""||appId_==null||appId_==undefined){
            	var platformId = $("#proDifine .productPlatform").val();
            	var appId = $("#proDifine .productApp").val();
            } else {
        		if(type_==1){ //应用
        			var optionId=$("#proDifine .productApp").find("option");
					for(var i=0;i<optionId.length;i++){
						if(appId_==optionId[i].value){
		                		$("#proDifine .productApp").val(appId_);
		                	}
					}
        		} else if(type_==2){	//平台
					var optionId=$("#proDifine .productPlatform").find("option");
					for(var i=0;i<optionId.length;i++){
						if(appId_==optionId[i].value){
		                		$("#proDifine .productPlatform").val(appId_);
		                	}
					}
        		} 
        	}
            function showOperate(value, row, index){
                var html = "";
                html += '<a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="查看" onclick="ProductManage.goToCheckOrEdit(this,1,1)" >查看</a>';
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="编辑" onclick="ProductManage.goToCheckOrEdit(this,2,1)" >编辑</a>';
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-id="'+ row.id +'"  title="发布"  onclick="ProductManage.publish(this)" >发布</a>';
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-id="'+ row.id +'"  title="删除" onclick="ProductManage.deleteProduct(this,1)" >删除</a>';
                return html;
            }
            function dateFormat(value, row, index){
                return JCPublicUtil.DateFormat(new Date(value),'YYYY-MM-dd hh:mm');
            }
            function productType(value, row, index){
                if(value==1){return "版本";}
                if(value==2){return "套餐";}
            }
            function productMode(value, row, index){
                if(value==1){return "网售";}
                if(value==2){return "定制";}
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
                {field: 'code',title:'产品编码',align: 'center',valign: 'middle'},
                {field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
                {field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
                {field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
                {field: 'appName',title:'所属应用',align: 'center',valign: 'middle',formatter:belongApp},
                {field: 'platformName',title:'所属平台',align: 'center',valign: 'middle'},
                {field: 'createDate',title:'创建时间',align: 'center',valign: 'middle',formatter:dateFormat},
                {field: 'updateDate',title:'修改时间',align: 'center',valign: 'middle',formatter:dateFormat},    
                {field: '',title:'操作',align: 'center',valign: 'middle',width:'15%',formatter:showOperate}
            ];
            function queryParams(params) {
            	if(appId_==""||appId_==null||appId_==undefined){
	            	var platformId = $("#proDifine .productPlatform").val();
	            	var appId = $("#proDifine .productApp").val();
	            } else {
	        		if(type_==1){ //应用
	        			var platformId = $("#proDifine .productPlatform").val();
						appId=appId_;
	        		} else if(type_==2){	//平台
	        			var appId = $("#proDifine .productApp").val();
						platformId=appId_;
	        		} else if(type_==3){	//接口
	        			
	        		}
	        	}
            	var temp = {   
			            pageSize: params.limit,                         
			            currentPage: (params.offset / params.limit) + 1,
			            stage:1,
			            type:type,
			            platformId:platformId,
			            appId:appId
			    };
			    return temp;
            }
            $("#proManageTable").bootstrapTable('destroy');
            $("#proManageTable").bootstrapTable({
                locales:'zh-CN',
                pagination:true,
                sidePagination: 'server',
	            currentPage:1,
	            pageSize: 20, 
	            pageList: [10, 20],
                url: ConfigURl.rootURL+"/mnt/production/get-list-by-page",
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
                    var data = {};
					data.total =  res.dataMap.data.total;
					data.rows = res.dataMap.data.rows;
					return data;  
                }
            });


        } else if(stage==2){
        	$(".newAdd").css("display","none");
            var type = $("#proBuffer .productType").val();
            var platformId = $("#proBuffer .productPlatform").val();
            var appId = $("#proBuffer .productApp").val();
            function showOperate(value, row, index){
                var html = "";
                html += '<a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="查看" onclick="ProductManage.goToCheckOrEdit(this,1,2)" >查看</a>';
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-id="'+ row.id +'"  title="上架"  onclick="ProductManage.buffer(this)" >上架</a>';
//                          html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-id="'+ row.id +'"  title="删除" onclick="ProductManage.deleteProduct(this,2)" >删除</a>';
                return html;
            }
            function dateFormat(value, row, index){
                return JCPublicUtil.DateFormat(new Date(value),'YYYY-MM-dd hh:mm');
            }
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
                {field: 'code',title:'产品编码',align: 'center',valign: 'middle'},
                {field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
                  {field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
                  {field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
                  {field: 'appName',title:'所属应用',align: 'center',valign: 'middle'},
                  {field: 'platformName',title:'所属平台',align: 'center',valign: 'middle'},
                  {field: 'createDate',title:'创建时间',align: 'center',valign: 'middle',formatter:dateFormat},
                  {field: 'updateDate',title:'修改时间',align: 'center',valign: 'middle',formatter:dateFormat},    
                  {field: '',title:'操作',align: 'center',valign: 'middle',width:'15%',formatter:showOperate}
            ];
            function queryParams(params) {
            	var temp = {   
		            pageSize: params.limit,                         
		            currentPage: (params.offset / params.limit) + 1,
		            stage:2,
		            type:type,
		            platformId:platformId,
		            appId:appId
			    };
			    return temp;
             }
            $("#proBufferTable").bootstrapTable('destroy');
            $("#proBufferTable").bootstrapTable({
                locales:'zh-CN',
                pagination:true,
                sidePagination: 'server',
	            currentPage:1,
	            pageSize: 20, 
	            pageList: [10, 20],
                url: ConfigURl.rootURL+"/mnt/production/get-list-by-page",
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
                    var data = {};
					data.total =  res.dataMap.data.total;
					data.rows = res.dataMap.data.rows;
					return data;  
    
                }
            });
        } else if(stage==3){
        	$(".newAdd").css("display","none");
            var type = $("#proPublish .productType").val();
            var platformId = $("#proPublish .productPlatform").val();
            var appId = $("#proPublish .productApp").val();
            function showOperate(value, row, index){
                var html = "";
                html += '<a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+ row.type +'" data-id="'+ row.id +'"  title="下架" onclick="ProductManage.downSale(this)" >下架</a>';
                return html;
            }
            function productType(value, row, index){
                if(value==1){return "版本";}
                if(value==2){return "套餐";}
            }
            function dateFormat(value, row, index){
                return JCPublicUtil.DateFormat(new Date(value),'YYYY-MM-dd hh:mm');
            }
            function productMode(value, row, index){
                if(value==1){return "网售";}
                if(value==2){return "定制";}
            }
            
            var columnsObj = [
                {field: 'id',title:'id',visible:false},
                {field: 'code',title:'产品编码',align: 'center',valign: 'middle'},
                {field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
                {field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
                {field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
                {field: 'appName',title:'所属应用',align: 'center',valign: 'middle'},
                {field: 'platformName',title:'所属平台',align: 'center',valign: 'middle'},
                {field: 'createDate',title:'创建时间',align: 'center',valign: 'middle',formatter:dateFormat},
                {field: 'updateDate',title:'修改时间',align: 'center',valign: 'middle',formatter:dateFormat},    
                {field: '',title:'操作',align: 'center',valign: 'middle',width:'15%',formatter:showOperate}
            ];
            function queryParams(params) {
            	var temp = {   
		            pageSize: params.limit,                         
		            currentPage: (params.offset / params.limit) + 1,
		            stage:3,
		            type:type,
		            platformId:platformId,
		            appId:appId
			    };
			    return temp;
             }
            $("#proPublishTable").bootstrapTable('destroy');
            $("#proPublishTable").bootstrapTable({
                locales:'zh-CN',
                pagination:true,
                sidePagination: 'server',
	            currentPage:1,
	            pageSize: 20, 
	            pageList: [10, 20],
                url: ConfigURl.rootURL+"/mnt/production/get-list-by-page",
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
                    var data = {};
					data.total =  res.dataMap.data.total;
					data.rows = res.dataMap.data.rows;
					return data;  
                }
            });
        }
    },
    //发布产品
    publish:function(item){
        var productionId = $(item).attr("data-id");
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要发布该产品？',
            title: '发布产品',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/issue","get",{
                            productionId:productionId
                        },function(data){
                			if (data.code == '000000') {
                                if(data.dataMap.data==1){
                                    Common.message("success","操作成功");
                                    $("#proManageTable").bootstrapTable('refresh');
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                }
                				
                			} else if (data.code == 'E00000') {
                               	if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
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
                    callback: function() {}
                }
            }
        });
    },
    //上架产品
    buffer:function(item){
        var productionId = $(item).attr("data-id");
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要上架该产品？',
            title: '上架产品',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/online","get",{
                            productionId:productionId
                        },function(data){
                			if (data.code == '000000') {
                                if(data.dataMap.data==1){
                                    Common.message("success","操作成功");
                                    $("#proBufferTable").bootstrapTable('refresh');
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                }
                				
                			} else if (data.code == 'E00000') {
                                 if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
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
                    callback: function() {}
                }
            }
        });
    },
    //下架产品
    downSale:function(item){
        var productionId = $(item).attr("data-id");
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要下架该产品？',
            title: '下架产品',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/offline","get",{
                            productionId:productionId
                        },function(data){
                			if (data.code == '000000') {
                                if(data.dataMap.data==1){
                                    Common.message("success","操作成功");
                                    $("#proPublishTable").bootstrapTable('refresh');
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                }
                			} else if (data.code == 'E00000') {
                                if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
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
                    callback: function() {}
                }
            }
        });
    },
    /* 删除产品 */
    deleteProduct:function(item,stage){ //stage:1-产品定义阶段  2-产品缓冲  3-产品发布
        var productionId = $(item).attr("data-id");
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要删除该产品？',
            title: '删除产品',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/remove-by-id","get",{
                            productionId:productionId,
                            stage:stage
                        },function(data){
                			if (data.code == '000000') {
                                var data=data.dataMap.data;
                                if(data==1){
                                    Common.message("success","操作成功");
                                    	$("#proManageTable").bootstrapTable('refresh');
                                    	$("#proBufferTable").bootstrapTable('refresh');
                                } else if(data==0){
                                    Common.message("error","产品已发布，无法删除");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                } else if(data==-2){
                                	Common.message("error","操作异常");
                                }
                			} else if (data.code == 'E00000') {
                                var data=data.dataMap.data;
                                if(data==0){
                                    Common.message("error","产品已发布，无法删除");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			}  else if(data.code=="E00001"){
			                	var data = data.dataMap.data;
			                    Common.message("error","非法参数");
			                }
                		},function(){},6000,false,"json",'',{headers:{'token':token}});
                    	
                	}
                },
                cancel: {
                    label: '取消',
                    className: "red",
                    callback: function() {}
                }
            }
        });
    }
       
}