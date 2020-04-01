var AddProduct = {
    init:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        //获取应用列表
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
        //获取平台列表
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
        },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
        //搜索产品-只能搜索版本
        $('.searchProduct').select2({
            placeholder: '输入产品编号或名称',
            ajax:{
                type:'GET',
                url: ConfigURl.rootURL+'/mnt/production/get-list-by-search',
                dataType: 'json',
                data: function (params) {
                    return {
                        stage: 1, 
                        productionId: $("#belongPlatform").val()
                    };
                },
                header:{'token':token},
                processResults: function (data, params) {
                    var itemList = [];
                    var arr = data.dataMap.data;
                    for(var i in arr){
                        if(arr[i].type!=2){
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
    /* 支持平台 */
    supportChecked:function(){
            var str="";
            var a = $("#android").is(':checked')?"1":"0";
            var b = $("#ios").is(':checked')?"1":"0";
            var c = $("#browser").is(':checked')?"1":"0";
            var d = $("#win").is(':checked')?"1":"0";
            var e = $("#mac").is(':checked')?"1":"0";
            var f = $("#other").is(':checked')?"1":"0";
            str = a+b+c+d+e+f;
            return str;
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
        function inputParam(value, row, index){
            if(row.type==2){
                return ["<input type='text' style='width:100%;' id='numParam'  value='"+row.paramValue+"'>"]
            } else if(row.type==1){
                return ["<input type='text' style='width:100%;' value='"+row.paramValue+"' readonly class='paramVal' onclick='AddProduct.initDate(this)' />"]
            }
        }
        var columnsObj = [
            {field: 'id',title:'参数ID',align: 'center',valign: 'middle',class:"paramId"},
            {field: 'name',title:'参数名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:controlType},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'paramValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
            {field: '',title:'参数值',align: 'center',valign: 'middle',formatter:inputParam,class:'paramValue'}
        ];
        function queryParams(params) {
            params.productionId = productionId;
            params.stage = stage;
            return params;  
        }
        $("#dataControlTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
            url: ConfigURl.commonURL + '/mnt/production/get-param-list-by-id',
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
            format: 'yyyy-mm-dd hh:ii:ss'
        });
        $(that).datetimepicker('show');
    },
    //功能控制      此处调用编辑产品版本
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
            html += '<a href="javascript:void(0)" class="btn" data-id="'+ row.id +'"  title="删除"  onclick="AddProduct.deletePro(this)">删除</a>';
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
        $("#productListTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
            url: ConfigURl.rootURL+"/mnt/production/get-production-list-by-id",
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
    //删除产品
    deletePro:function(that){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var childId=$(that).attr("data-id");
        var productionId=JCPublicUtil.GetRequest(window.location).id;
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
                                } else if(data.dataMap.data==0){
                                    Common.message("error","操作异常");
                                } else if(data.dataMap.data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                			} else if(data.code == 'E00000'){
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
    //新增版本或套餐 type：1-版本  2-套餐
    selectProType:function(){
        var type=$("#proType").val();
        if(type==1){
            $(".dataControl,.funcControl,.belongAppWrap").css("display","block");
            $(".productList").css("display","none");
        } else if(type==2){
            $(".dataControl,.funcControl,.belongAppWrap").css("display","none");
//             $(".productList").css("display","block");
        }
    },
    // 套餐搜索框增加产品
    addProduct:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var obj;
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/add',"POST",obj,function(data){
                if (data.code == '000000') {
                    var data=data.dataMap.data;
                    if(data==1){
                        Common.message("success","操作成功");
                    } else if(data==0){
                        Common.message("error","操作异常");
                    }else if(data==-1){
                        Common.message("error","参数异常");
                    }else if(data==-2){
                        Common.message("error","产品名称已存在");
                    }
                } else if(data.code == 'E00000'){
                	var data=data.dataMap.data;
                    if(data==0){
                        Common.message("error","操作异常");
                    }else if(data==-1){
                        Common.message("error","参数异常");
                    }else if(data==-2){
                        Common.message("error","产品名称已存在");
                    }
                } else if(data.code=="E00001"){
	                	var data = data.dataMap.data;
	                    Common.message("error","非法参数");
	                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //新增产品-保存
    save:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#proName").val();
        var pattern = $(".proMode input[name='modelPro']:checked").val();
        var type = $("#proType").val();
        var appId = $("#belongApp").val();
        var platformId = $("#belongPlatform").val();
        var depict = $("#remarks").val();
        var obj={};
        obj.name = name;
        obj.pattern = pattern;
        obj.type = type;
        obj.appId = appId;
        obj.platformId = platformId;
        obj.depict = depict;
        if(name=="" ||name==" "){ 
            $("#proName").next(".errorTip").show();
        } else {
            $("#proName").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/add',"POST",obj,function(data){
                if (data.code == '000000') {
                    var data=data.dataMap.data;
                    if(data==1){
                        Common.message("success","操作成功");
                        window.setInterval(function(){
                        	window.location.href='../../static/productManage/productManage.html?token='+token;
                        },1000);
                    } else if(data==0){
                        Common.message("error","操作异常");
                    }else if(data==-1){
                        Common.message("error","参数异常");
                    }else if(data==-2){ 
                        Common.message("error","产品名称已存在");
                    }
                } else if(data.code == 'E00000'){
                	var data=data.dataMap.data;
                    if(data==0){
                        Common.message("error","操作异常");
                    }else if(data==-1){
                        Common.message("error","参数异常");
                    }else if(data==-2){ 
                        Common.message("error","产品名称已存在");
                    }
                } else if(data.code=="E00001"){
                	var data = data.dataMap.data;
                    Common.message("error","非法参数");
                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
            
    },
    //数据控制保存
//  dataControlSave:function(){
//  	var token=JCPublicUtil.GetRequest(window.location).token;
//      var tr=$("#dataControlTable >tbody>tr");
//      var params={};
//      for(var i=0;i<tr.length;i++){
//          var td=tr[i];
//          var paramId = $(td).children(".paramId").text();
//          var paramValue = $(td).children(".paramValue").find("input").val();
//          params[paramId]=paramValue;
//          }
//          console.log(params);
//      var productionId;
//      var params;
//      JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update-params',"POST",{
//          productionId:productionId,
//          params:params
//      },function(data){
//          if (data.code == '000000') {
//              var data = data.dataMap.data;
//              if(data==1){
//                  Common.message("success","操作成功");
//              } else if(data==0){
//                  Common.message("error","操作异常");
//              } else if(data==-1){
//                  Common.message("error","参数异常");
//              }
//          } else {}
//      },function(){},6000,false,"json",'',{headers:{'token':token}});
//  },
    //功能控制保存
//  funcSave:function(){
//  	var token=JCPublicUtil.GetRequest(window.location).token;
//      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
//      var checkNodes = treeObj.getCheckedNodes(true); //获取勾选的节点
//      var checkArr=[];
//      for (var i=0; i < checkNodes.length; i++) {
//          checkArr.push(checkNodes[i].id);
//      }
//      var features=checkArr.join(",");
//      var productionId=JCPublicUtil.GetRequest(window.location).id;
//      JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/production/update-features',"GET",{
//          productionId:productionId,
//          features:features
//      },function(data){
//          if (data.code == '000000') {
//              var data = data.dataMap.data;
//              if(data==1){
//                  Common.message("success","操作成功");
//              } else if(data==0){
//                  Common.message("error","操作异常");
//              } else if(data==-1){
//                  Common.message("error","参数异常");
//              }
//          } else {}
//      },function(){},6000,false,"json",'',{headers:{'token':token}});
//  }

}