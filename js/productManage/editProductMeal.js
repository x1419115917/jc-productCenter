var EditProductMeal = {
    init:function(){
    	EditProductMeal.getPlatformAndApp();
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        var token=JCPublicUtil.GetRequest(window.location).token;
        //此处url和obj记得换
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/get-by-id',"GET",{
            productionId:productionId,
            stage:stage
        },function(data){
            if (data.code == '000000') {
                var data = data.dataMap.data;
                var pattern=data.pattern;
                $("#proName").val(data.name);
                $(".code").text(data.code);
                $(".proType").val(data.type);
                if(pattern==1){
                    $("#netPro").prop("checked",true)
                }else if(pattern==2){
                    $("#customPro").prop("checked",true)
                }
                $("#belongPlatform").val(data.platformId);
                $("#remarks").val(data.depict);
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
        
        $('.searchProduct').select2({
            placeholder: '输入产品编号或名称',
            language: {
		             noResults: function (params) {
		             return "暂无数据";
		         }
		     },
            formatNoMatches:'aaa',
            ajax:{
                type:'GET',
                url: ConfigURl.rootURL+'/mnt/production/get-list-by-search',
                dataType: 'json',
                headers:{"token":token},
                data: function (params) {
                    return {
                        stage: 1, 
                        keywords:params.term,
                        platformId:$(".belongPlatform").val()
                    };
                },
                processResults: function (data, params) {
                   	var itemList = [];
                    var arr = data.dataMap.data;
                    for(var i in arr){
                        if(arr[i].type!=2){		//sousuobanben
                            itemList.push({id: arr[i].id, text: arr[i].name})
                        }
                    }
                    return {
                        results: itemList,
                    };
                },
                cache: true
            }
        });
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
    //产品列表
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
        function showOperate(value, row, index){
            var html="";
            html += '<a href="javascript:void(0)" class="btn" data-id="'+ row.id +'"  title="删除"  onclick="EditProductMeal.deletePro(this)">删除</a>';
            return  html;
        }
        var columnsObj = [
            {field: 'id',title:'id',visible:false},
            {field: 'code',title:'产品编号',align: 'center',valign: 'middle'},
            {field: 'name',title:'产品名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'产品类型',align: 'center',valign: 'middle',formatter:productType},
            {field: 'pattern',title:'产品模式',align: 'center',valign: 'middle',formatter:productMode},
            {field: 'appName',title:'所属应用',align: 'center',valign: 'middle'},
            {field: '',title:'操作',align: 'center',valign: 'middle',formatter:showOperate},
        ];
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var stage=JCPublicUtil.GetRequest(window.location).stage;
        function queryParams(params) {
            params.productionId = productionId;
            params.stage = stage;
            return params;  
        }
        $("#productListTable").bootstrapTable("destroy");
        $("#productListTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
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
            ajaxOptions:{
			    headers: {"token":token}
			},
            formatLoadingMessage: function(){
                return " ";
            },
            responseHandler:function(res){
                return {
                    "data": res.dataMap.data  
                 };

            }
        });
    },
    deletePro:function(that){
        var childId=$(that).attr("data-id");
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要删除该产品？',
            title: '删除产品',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/production/update-suite-remove","get",{
                            childId:childId,
                            productionId:productionId
                        },function(data){
                			if (data.code == '000000') {
                                if(data.dataMap.data==1){
                                    Common.message("success","操作成功");
									EditProductMeal.productList();
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                } else if(data.dataMap.data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if (data.code == 'E00000') {
                                if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                } else if(data.dataMap.data==-1){
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
    //添加产品
    addProduct:function(){
    	var productionId=JCPublicUtil.GetRequest(window.location).id;
    	var token=JCPublicUtil.GetRequest(window.location).token;
    	var childId=$('.searchProduct').val();
           JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update-suite-add',"GET",{
	           	productionId:productionId,
	           	childId:childId
           },function(data){
                   if (data.code == '000000') {
                       var data=data.dataMap.data;
                       if(data==1){
                            Common.message("success","操作成功");
							$('.searchProduct').val('').trigger('change');
                            $("#productListTable").bootstrapTable("refresh");
                           
                       } else if(data==0){
                           Common.message("error","操作异常");
                       }else if(data==-1){
                           Common.message("error","该产品已存在");
                       }else if(data==-2){
                           Common.message("error","已存在同应用的其他产品");
                       }
                   } else if (data.code == 'E00000') {
                       var data=data.dataMap.data;
                       if(data==0){
                           Common.message("error","操作异常");
                       }else if(data==-1){
                           Common.message("error","该产品已存在");
                       }else if(data==-2){
                           Common.message("error","已存在同应用的其他产品");
                       }
                   } else if(data.code=="E00001"){
			                	var data = data.dataMap.data;
			                    Common.message("error","非法参数");
			                }
               },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //基本信息保存
    save:function(){
        var productionId=JCPublicUtil.GetRequest(window.location).id;
        var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#proName").val();
        var platformId=$("#belongPlatform").val();
        var type=$("#proType").val();
       	var pattern=$(".proMode input[type='radio']:checked").val();
        var depict = $("#remarks").val();
        var obj={};
        obj.productionId = productionId;
        obj.name = name;
        obj.platformId = platformId;
        obj.type = type;
        obj.pattern = pattern;
        obj.depict = depict;
        if(proName==""){ 
            $("#proName").next(".errorTip").show();
        } else {
            $("#proName").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update',"post",obj,function(data){
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
                    if(data.dataMap.data==0){
                        Common.message("error","操作异常");
                    } else if(data.dataMap.data==-1){
                        Common.message("error","参数异常");
                    } else if(data.dataMap.data==-2){
                        Common.message("error","产品名称已存在");
                    }
                } else if(data.code=="E00001"){
	                	var data = data.dataMap.data;
	                    Common.message("error","非法参数");
	                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
            
    }
}