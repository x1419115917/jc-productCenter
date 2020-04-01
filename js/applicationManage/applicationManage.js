var ApplicationManage = {
// 	rootFile:"html-pcenter",
   	rootFile:"productCenter",
   	 /*查看/编辑 界面跳转*/
    goToCheckOrEdit:function(that,item){   /* item:1-查看 2-编辑*/
   		var token=JCPublicUtil.GetRequest(window.location).token;
        var id = $(that).attr("data-id");
        var type=$(that).attr("data-type");
        var url;
        if(item==1){
            url ="../"+ApplicationManage.rootFile+"/static/applictionManage/checkApplication.html"+"?appId="+id+"&token="+token+"&type="+type;
        } else if(item ==2){
            url ="../"+ApplicationManage.rootFile+"/static/applictionManage/editApplication.html"+"?appId="+id+"&token="+token+"&type="+type;
        }
        window.location.href=url;
    },
    // 产品/授权 界面跳转
    goToProduct:function(that){
    	var id=$(that).attr("data-id");
    	var type=$(that).attr("data-type");
    	var that=$(that).parent();
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var url ="../"+ApplicationManage.rootFile+"/static/productManage/productManage.html"+"?token="+token+"&id="+id+"&type="+type;
        window.location.href=url;
    },
    goToRight:function(that){	
    	var id=$(that).attr("data-id");
    	var type=$(that).attr("data-type");
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var url ="../"+ApplicationManage.rootFile+"/static/rightManage/rightManage.html"+"?token="+token+"&id="+id+"&type="+type;
        window.location.href=url;
    },
    /* 初始化 */ 
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        function showIcon(value, row, index){
            var fileIds = value;
            var picUrl='';
            if(fileIds){
            	return [
                    '<img style="width:55%;height:38px;" src="'+ConfigURl.rootFileUrl+'/visit?fileId='+fileIds+'">'
                ]
            } else {
            	return '-'
            }
            
            
        }
        function showOperate(value, row, index){
            var html = "";
            html += '<a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+row.type+'" data-id="'+ row.id +'"  title="查看"  onclick="ApplicationManage.goToCheckOrEdit(this,1)">查看</a>';
            html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-type="'+row.type+'" data-id="'+ row.id +'"  title="编辑"  onclick="ApplicationManage.goToCheckOrEdit(this,2)" >编辑</a>';
            if(row.status==0){  //0-正常状态    1-停用状态
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-status="'+ row.status +'" data-id="'+ row.id +'"  title="停用"  onclick="ApplicationManage.stopAndUse(this)" >停用</a>';
            } else if(row.status==1){
                html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" data-status="'+ row.status +'" data-id="'+ row.id +'"  title="启用"  onclick="ApplicationManage.stopAndUse(this)" >启用</a>';
            }
            
            html += '<span>|<span><a href="javascript:void(0)" style="padding:6px 3px;" class="btn" data-id="'+ row.id +'"  title="删除" onclick="ApplicationManage.delete(this)" >删除</a>';
            return html;
        }
        function dateFormat(value, row, index){
            return JCPublicUtil.DateFormat(new Date(value),'YYYY-MM-dd hh:mm');
        }
        function typeFormat(value){
            if(value==1){return "应用";}
            if(value==2){return "平台";}
            if(value==3){return "接口";}
        }
        function goToProduct(value,row,index) {
            return [
                '<a class="province" data-type="'+row.type+'" data-id="'+row.id+'" onclick="ApplicationManage.goToProduct(this)">'+value+'</a>'
            ]
        }
        function goToRight(value,row,index) {
            return [
                '<a class="province" data-type="'+row.type+'" data-id="'+row.id+'" onclick="ApplicationManage.goToRight(this)">'+value+'</a>'
            ]
        }
        function showState(value, row, index){
            if(value == 0){
                return "<span style='color:#339900;'>正常<span>";
            } else if(value == 1) {
                return "<span style='color:#FF3300;'>停用<span>";
            }
        }
        var columnsObj = [
			{field: 'id',title:'id',visible:false},
			{field: 'icon',title:'图标',align: 'center',valign: 'middle',formatter:showIcon,width:'6%'},
			{field: 'name',title:'名称',align: 'center',valign: 'middle',width:'10%'},
		  	{field: 'system',title:'系统标识',align: 'center',valign: 'middle'},
		  	{field: 'type',title:'类型',align: 'center',valign: 'middle',formatter:typeFormat,width:'6%'},
		  	{field: 'productAmount',title:'版本数量',align: 'center',valign: 'middle',formatter:goToProduct},
		  	{field: 'licenseAmount',title:'授权数量',align: 'center',valign: 'middle',formatter:goToRight},
		  	{field: 'status',title:'状态',align: 'center',valign: 'middle',formatter:showState,width:'6%'},
		  	{field: 'createDate',title:'创建时间',align: 'center',valign: 'middle',formatter:dateFormat},
		  	{field: 'updateDate',title:'修改时间',align: 'center',valign: 'middle',formatter:dateFormat},    
		  	{field: '',title:'操作',align: 'center',valign: 'middle',width:'20%',formatter:showOperate}
		];
		function queryParams(params) {
			var temp = {   
		            pageSize: params.limit,                         
		            currentPage: (params.offset / params.limit) + 1
		    };
		    return temp;
         }
		$("#appManageTable").bootstrapTable('destroy');
        $("#appManageTable").bootstrapTable({
            locales:'zh-CN',
			url: ConfigURl.rootURL+"/mnt/application/get-list-by-page?number="+Math.random(),
            columns: columnsObj,
            pagination:true,
            sidePagination: 'server',
            currentPage:1,
            pageSize: 20, 
            pageList: [10, 20],
            method: "get",
        	dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            queryParams: queryParams,
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
        var appId = $(item).attr("data-id");
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
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/update-status","get",{
                            appId:appId,
                            status:status
                        },function(data){
                			if (data.code == '000000') {
                				var data=data.dataMap.data;
                				if(data==1){
                					$("#appManageTable").bootstrapTable('refresh');
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
                			}else if(data.code=="E00001"){
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
    /* 删除应用 */
    delete:function(item){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var appId = $(item).attr("data-id");
        bootbox.dialog({
            message: '你确定要删除该应用？',
            title: '删除应用',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/remove-by-id","get",{appId:appId},function(data){
                			if (data.code == '000000') {
                                $("#appManageTable").bootstrapTable('refresh');
                                if(data.dataMap.data==1){
                                    Common.message("success","操作成功");
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                } else if(data.dataMap.data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                } else if(data.dataMap.data==-2){
                                    Common.message("error","该应用已存在产品");
                                } 
                				
                			} else if(data.code == 'E00000'){
                				$("#appManageTable").bootstrapTable('refresh');
                				 if(data.dataMap.data==0){
                                    Common.message("error","操作失败，系统异常导致");
                                } else if(data.dataMap.data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                } else if(data.dataMap.data==-2){
                                    Common.message("error","该应用已存在产品");
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