var EditApplication = {
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
            	var html =  '<div id="imgdiv">';
                    html += '	<a href="javascript:;" onclick="EditApplication.deleteIcon(this)"><i class="close"></i></a>';
                    html += '	<img id="imgicon" data-id="'+fileIds+'" src="'+ConfigURl.rootFileUrl+'/visit?fileId='+fileIds+'" />';
                    html += '</div>';
                    $(".iconUpload").prepend(html);
            }
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
    var fileIptId=Math.ceil(Math.random()*100000000);
    var seqNo=fileIptId+"_"+Math.ceil(Math.random()*100000000);
    $("#img_file").fileinput({
        language: 'zh', //设置语言
        uploadUrl: '', //上传的地址
        showUpload: false,
        showRemove: false,
        showCaption: false,
        showPreview: false,
        browseClass: "btn btn-primary",
        allowedFileExtensions: [],
        maxFileSize : '2048kb',
        uploadAsync:true,
        layoutTemplates: {
            footer: ''
        },
        previewSettings:{
            image: {width: "auto", height: "60px"}
        },
        MAXFILECOUNT:1,
        layoutTemplates:{//隐藏进度条
            progress:""
        }
    }).on('filebatchselected', function (event, data, id, index) {
    	var token=JCPublicUtil.GetRequest(window.location).token;
        //选择图片后自动上传 
        var file=data[0];
        var fileSize = file.size;
        var fileName=file.name;
        fileSize=(fileSize / (1024 * 1024)).toFixed(2);	//大小为1m以下
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if(fileSize>1){
        	Common.message("error",file.name+"超过了允许大小 1MB");
        	return false;
        } else if(fileExtension != 'jpg' && fileExtension != 'png'){
        	Common.message("error","不正确的文件扩展名 "+file.name+". 只支持 'jpg,png' 的文件扩展名");
        	return false;
        } else {
	        var url=ConfigURl.rootFileUrl+"/upload?fileName="+ file.name +"&ttl="+Math.random();
					var xhr = new XMLHttpRequest();
					xhr.open("POST", encodeURI(encodeURI(url)),false);
					xhr.overrideMimeType("application/octet-stream");
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4 && xhr.status == 200) {
							var data = jQuery.parseJSON(xhr.responseText);  
							if(data && data.code=="000000"){
								$("#imgdiv").remove();
	                            var html =  '<div id="imgdiv">';
	                            html += '	<a href="javascript:;" onclick="EditApplication.deleteIcon(this)"><i class="close"></i></a>';
	                            html += '	<img id="imgicon" data-id="'+data.dataMap.data+'" src="'+ConfigURl.rootFileUrl+'/visit?fileId='+data.dataMap.data+'" />';
	                            html += '</div>';
	                        	$(".iconUpload").prepend(html);
								
							}else{}
						}
					};
					xhr.setRequestHeader('token',token);
					xhr.onerror =function(){
			        }; 
					xhr.send(file);
	
	        // $(this).fileinput("upload");
       }
    }).on('fileuploaded', function(event, data) {
        //上传成功后保存图片的信息，并显示图片
    });
    },
    //删除图标
    deleteIcon:function(that){
        $(that).parent('#imgdiv').remove();
        $("#img_file").attr("data-id",'');
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
    dataControl:function(){
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var token=JCPublicUtil.GetRequest(window.location).token;
        function showOperate(value, row, index){
            var html = "";
                html += '<a href="javascript:void(0)" class="btn" data-id="'+ row.id +'"  title="编辑" onclick="EditApplication.edit(this)" >编辑</a>';
            if(row.fixed!=1){
                html += '<a href="javascript:void(0)" class="btn" data-id="'+ row.id +'"  title="删除" onclick="EditApplication.delete(this)" >删除</a>';
            }
            return html;
        }
        function typeFormat(value,row,index){
            if(value==1){ return "时间控制"}
            if(value==2){ return "数量控制"}
            if(value==3){ return "其他"}
        }
        var columnsObj = [
            {field: 'fixed',title:'fixed',visible:false},
            {field: 'id',title:'参数ID',align: 'center',valign: 'middle'},
            {field: 'name',title:'参数名称',align: 'center',valign: 'middle'},
            {field: 'type',title:'控制方式',align: 'center',valign: 'middle',formatter:typeFormat},
            {field: 'paramKey',title:'参数键',align: 'center',valign: 'middle'},
            {field: 'paramValue',title:'默认键值',align: 'center',valign: 'middle'},
            {field: 'depict',title:'参数说明',align: 'center',valign: 'middle'},
            {field: '',title:'操作',align: 'center',valign: 'middle',width:'15%',formatter:showOperate}
        ];
        function queryParams(params) {
            params.appId = appId;
            return params;  
        }
        $("#dataControlTable").bootstrapTable({
            locales:'zh-CN',
            pagination:true,
            url: ConfigURl.rootURL+"/mnt/application/get-param-list-by-app-id?number="+Math.random(),
            cache: false,
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
    //功能控制
    funcControl:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        $("#xml_file").fileinput({
            language: 'zh', //设置语言
            uploadUrl: '', //上传的地址
            showUpload: false,
            showRemove: false,
            showCaption: false,
            showPreview: false,
            browseClass: "btn btn-primary",
            allowedFileExtensions: [],
            maxFileSize : '2048kb',
            uploadAsync:false,
            layoutTemplates: {
                footer: ''
            },
            // previewSettings:{
            //     image: {width: "auto", height: "60px"}
            // },
            MAXFILECOUNT:1,
            layoutTemplates:{//隐藏进度条
                progress:""
            }
        }).on('filebatchselected', function (event, data, id, index) {
        	var token=JCPublicUtil.GetRequest(window.location).token;
            var file=data[0];
            var fileName=file.name;
            var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(fileExtension != 'xml'){
	        	Common.message("error","格式有误，请选择XML文件");
	        	return false;
	        } else {
	            //上传xml文件
	            var appId=JCPublicUtil.GetRequest(window.location).appId;
	            var url=ConfigURl.rootFileUrl+"/upload?fileName="+ file.name +"&ttl="+Math.random();
					var xhr = new XMLHttpRequest();
					xhr.open("POST", encodeURI(encodeURI(url)),false);
					xhr.overrideMimeType("application/octet-stream");
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4 && xhr.status == 200) {
							var data = jQuery.parseJSON(xhr.responseText);  
							if(data && data.code=="000000"){
	                            $("#xml_file").attr("data-id",data.dataMap.data);
							}else{}
						}
					};
					xhr.setRequestHeader('token',token);
					xhr.onerror =function(){}; 
					xhr.send(file);
	                //指定应用导入功能文件清单
	                JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/update-features","GET",{
	                    appId:appId,
	                    fileId:$("#xml_file").attr("data-id")
	                },function(data){
	                    if (data.code == '000000') {
	                    	var res =data.dataMap.data;
		                    	if(res==1){
		                    	//导入后先去除treedemo节点，再拿到功能数据渲染
		                    	$("#treeDemo").children().remove();
		                    	var zTree;
						        var setting = {
						//          check: {
						//              enable: true
						//          },
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
						        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-features-by-id","GET",{appId:appId},function(data){
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
						            } else {}
						        },function(){},6000,false,"json",'',{headers:{'token':token}});
						    } else if(res==-1){
						    	Common.message("error","文件不存在或者文件格式非法");
						    }
	                    } else if(data.code=='E00000'){
	                    	var data=data.dataMap.data;
	                    	if(data==0){
	                    		Common.message("error","操作失败，系统异常导致");
	                    	}
	                    }
	                },function(){},6000,false,"json",'',{headers:{'token':token}});
	                
	            // $(this).fileinput("upload");
            }
        })
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var zTree;
        var setting = {
//          check: {
//              enable: true
//          },
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
        JCPublicUtil.Ajax(ConfigURl.rootURL+"/mnt/application/get-features-by-id","GET",{appId:appId},function(data){
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
            } else {}
        },function(){},6000,false,"json",'',{headers:{'token':token}});
    },
    //导出功能表
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
    //新增控制点
    add:function(){
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var message = "";
        message += "<form id='addControlPoint'>";
        message +="     <div class='row margin-bottom-20 form-horizontal'>";
        message +="         <label class='control-label col-md-2'><span class='required'> * </span>参数名称</label>";
        message +="         <div class='col-md-10'>";
        message +="             <input type='text' class='form-control' data-validate='require' onkeydown='if(event.keyCode==32) return false' maxlength='20' name='paramName' id='paramName' autocomplete='off'>";
        message +="             <div class='errorTip'>必填项</div>";
        message +="         </div>";
        message +="     </div>";
        message +="     <div class='row margin-bottom-20 form-horizontal'>";
        message +="         <label class='control-label col-md-2'><span class='required'> * </span>控制方式</label>";
        message +="         <div class='col-md-10'>";
        message +="             <select class='bs-select form-control controlWay' onchange='EditApplication.changeContro(this)' id='controlWay' data-validate='require'>";
        message +="                 <option value='1'>时间控制</option>";
        message +="                 <option value='2'>数值控制</option>";
        message +="                 <option value='3'>其他</option>";
        message +="             </select>";
        message +="             <div class='errorTip'>必填项</div>";
        message +="         </div>";
        message +="     </div>";
        message +="     <div class='row margin-bottom-20 form-horizontal'>";
        message +="         <label class='control-label col-md-2'><span class='required'> * </span>参数键</label>";
        message +="         <div class='col-md-10'>";
        message +="             <input type='text' maxlength='40' class='form-control' data-validate='require' onkeydown='if(event.keyCode==32) return false' maxlength='40' name='paramKey' id='paramKey' autocomplete='off'>";
        message +="             <div class='errorTip'>必填项</div>";
        message +="         </div>";
        message +="     </div>";
        message +="     <div class='row margin-bottom-20 form-horizontal'>";
        message +="         <label class='control-label col-md-2'><span class='required'> * </span>默认键值</label>";
        message +="         <div class='col-md-10' id='conWay'>";
        message +="             <input type='text' style='width:100%;'  value='' readonly 'class='paramValue' onclick='EditApplication.initDate(this)' data-validate='require' />";
        message +="             <div class='errorTip'>必填项</div>";
        message +="         </div>";
        message +="     </div>";
        message +="     <div class='row margin-bottom-20 form-horizontal'>";
        message +="         <label class='control-label col-md-2'>参数说明</label>";
        message +="         <div class='col-md-10'>";
        message +="             <textarea class='form-control' id='decribe' style='height:96px;resize:none' maxlength='200'></textarea>";
        message +="         </div>";
        message +="     </div>";
        message += "</form>";
        bootbox.dialog({
            message: message,
            title: '添加控制点',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	var ret = VT.formSubmit("addControlPoint");
                        var appId=JCPublicUtil.GetRequest(window.location).appId;
                    	var name = $("#paramName").val();
                        var type = $("#controlWay").val();
                        var paramKey = $("#paramKey").val();
                        var paramValue = $("#conWay input").val();
                        var depict = $("#decribe").val();
                        var obj={};
                        obj.appId = appId;
                        obj.name = name;
                        obj.type = type;
                        obj.paramKey = paramKey;
                        obj.paramValue = paramValue;
                        obj.depict = depict;
                        if(ret==false){
                        	return false;
                        } else {
                        	var stateCode=null;
                            $("#paramName,#paramKey").next(".errorTip").hide();
                            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/add-param',"POST",obj,function(data){
                                if (data.code == '000000') {
                                    var data=data.dataMap.data;
                                    stateCode=data;
                                    if(data==1){
                                    	$("#dataControlTable").bootstrapTable('refresh');
                                        Common.message("success","操作成功");
                                    } else if(data==0){
                                        Common.message("error","操作异常");
                                    } else if(data==-1){
                                        Common.message("error","控制点名称已存在");
                                    } else if(data==-2){
                                        Common.message("error","该参数名已存在");
                                    }
                                } else if(data.code == 'E00000'){
                                    var data=data.dataMap.data;
                                   	if(data==0){
                                        Common.message("error","操作异常");
                                    } else if(data==-1){
                                        Common.message("error","控制点名称已存在");
                                    } else if(data==-2){
                                        Common.message("error","该参数名已存在");
                                    }
                                }else if(data.code == 'E00001'){
                                    Common.message("error","参数默认值不能为空");
                                }
                            },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
                            if(stateCode==-1||stateCode==-2){
                            	return false;
                            }
                        }
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
    //改变控制方式
    changeContro:function(that){
    	$("#conWay").children().remove();
    	var val = $(that).val();
    	var html="";
    	if(val==1){		//时间
    		html +="<input type='text' maxlength='40' style='width:100%;' data-validate='require'  value='' readonly 'class='paramValue' onclick='EditApplication.initDate(this)' />";
    		html +="             <div class='errorTip'>必填项</div>";
    		$("#conWay").append(html);
    	} else if(val==2){//数量
    		html +="<input type='number' oninput='if(value.length>6)value=value.slice(0,6)' class='form-control' data-validate='require' name='paramValue' id='paramValue' autocomplete='off'>";
    		html +="             <div class='errorTip'>必填项</div>";
    		$("#conWay").append(html);
    	} else if(val==3){//其他
    		html +="<input type='text' class='form-control' data-validate='require' name='paramValue' id='paramValue' autocomplete='off'>";
    		html +="             <div class='errorTip'>必填项</div>";
    		$("#conWay").append(html);
    	}
    },
    initDate:function(that){
        $(".paramValue").datetimepicker({
            language:'zh-CN',
            format: 'yyyy-MM-dd hh:mm',
            
        });
        $(that).datetimepicker('show');
    },
    //编辑控制点
    edit:function(item){
        var paramId = $(item).attr("data-id");  //参数IddataControl
        var appId=JCPublicUtil.GetRequest(window.location).appId;   //应用Id
        var token=JCPublicUtil.GetRequest(window.location).token;
        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/get-param-by-id',"GET",{
            paramId:paramId,
            appId:appId
        },function(data){
                if (data.code == '000000') {
                    var data = data.dataMap.data;
                    var message = "";
                    message += "<form id='editControlPoint'>";
                    message +="     <div class='row margin-bottom-20 form-horizontal'>";
                    message +="         <label class='control-label col-md-2'><span class='required'> * </span>参数名称</label>";
                    message +="         <div class='col-md-10'>";
                    if(data.fixed==1){	
                    message +="             <input type='text' class='form-control' data-validate='require' onkeydown='if(event.keyCode==32) return false' disabled maxlength='20' name='editParamName' id='editParamName' value='"+data.name+"' autocomplete='off'>";
                    } else {
                    message +="             <input type='text' class='form-control'data-validate='require' maxlength='20' onkeydown='if(event.keyCode==32) return false' name='editParamName' id='editParamName' value='"+data.name+"' autocomplete='off'>";
                    }
                    message +="             <div class='errorTip'>必填项</div>";
                    message +="         </div>";
                    message +="     </div>";
                    message +="     <div class='row margin-bottom-20 form-horizontal'>";
                    message +="         <label class='control-label col-md-2'><span class='required'> * </span>控制方式</label>";
                    message +="         <div class='col-md-10'>";
                    if(data.fixed==1){	//自己添加的控制方式和参数键可修改
                    	message +="             <select class='bs-select form-control controlWay' onchange='EditApplication.changeContro(this)' disabled id='editControlWay' data-validate='require'>";
                    } else if(data.fixed==0){
                    	message +="             <select class='bs-select form-control controlWay' onchange='EditApplication.changeContro(this)' id='editControlWay' data-validate='require'>";
                    }
                    
                    if(data.type==1){
                        message +="                 <option selected value='1'>时间控制</option>";
                        message +="                 <option value='2'>数值控制</option>";
                        message +="                 <option value='3'>其他</option>";
                    } else if(data.type==2){
                    	message +="                 <option value='1'>时间控制</option>";
                        message +="                 <option selected value='2'>数值控制</option>";
                        message +="                 <option value='3'>其他</option>";
                    } else if(data.type==3){
                    	message +="                 <option value='1'>时间控制</option>";
                        message +="                 <option value='2'>数值控制</option>";
                        message +="                 <option selected value='3'>其他</option>";
                    }
                    message +="             </select>";
                    message +="             <div class='errorTip'>必填项</div>";
                    message +="         </div>";
                    message +="     </div>";
                    message +="     <div class='row margin-bottom-20 form-horizontal'>";
                    message +="         <label class='control-label col-md-2'><span class='required'> * </span>参数键</label>";
                    message +="         <div class='col-md-10'>";
                    if(data.fixed==1){
                    	message +="             <input type='text' data-validate='require' class='form-control' value='"+data.paramKey+"' disabled maxlength='40' name='editParamKey' id='editParamKey' autocomplete='off'>";
                    } else if(data.fixed==0){
                    	message +="             <input type='text' data-validate='require' class='form-control' value='"+data.paramKey+"' onkeydown='if(event.keyCode==32) return false' maxlength='40' name='editParamKey' id='editParamKey' autocomplete='off'>";
                    }
                    message +="             <div class='errorTip'>必填项</div>";
                    message +="         </div>";
                    message +="     </div>";
                    message +="     <div class='row margin-bottom-20 form-horizontal'>";
                    message +="         <label class='control-label col-md-2'><span class='required'> * </span>默认键值</label>";
                    message +="         <div class='col-md-10' id='conWay'>";
                	if(data.type==1){
                		message +="     <input type='text' data-validate='require' readonly style='width:100%;' maxlength='40'  value='"+data.paramValue+"' id='editParamValue' 'class='paramValue' onclick='EditApplication.initDate(this)' />";
                	} else if(data.type==2){
                		message +="     <input type='number'  oninput='if(value.length>6)value=value.slice(0,6)' data-validate='require' class='form-control'  value='"+data.paramValue+"' maxlength='40' name='editParamValue' id='editParamValue' autocomplete='off'>";
                	} else if(data.type==3){
                		message +="     <input type='text' data-validate='require' style='width:100%;' class='form-control' value='"+data.paramValue+"' id='editParamValue' 'class='paramValue' />";
                	}
                    message +="             <div class='errorTip'>必填项</div>";
                    message +="         </div>";
                    message +="     </div>";
                    message +="     <div class='row margin-bottom-20 form-horizontal'>";
                    message +="         <label class='control-label col-md-2'>参数说明</label>";
                    message +="         <div class='col-md-10'>";
                    message +="             <textarea class='form-control' id='editParamDecribe' style='height:96px;resize:none' maxlength='200'></textarea>";
                    message +="         </div>";
                    message +="     </div>";
                    message += "</form>";
                    var config={
                        message: message,
                        title: '编辑控制点',
                        buttons: {
                            sure: {
                                label: '确定',
                                className: "green",
                                callback: function() {
                                	var ret = VT.formSubmit("editControlPoint");
                                    var appId=JCPublicUtil.GetRequest(window.location).appId;
                                    var name = $("#editParamName").val();
                                    var type = $("#editControlWay").val();
                                    var paramKey = $("#editParamKey").val();
                                    var paramValue = $("#conWay input").val();
                                    var depict = $("#editParamDecribe").val();
                                    var obj={};
                                    obj.appId = appId;
                                    obj.paramId = paramId;
                                    obj.name = name;
                                    obj.type = type;
                                    obj.paramKey = paramKey;
                                    obj.paramValue = paramValue;
                                    obj.depict = depict;
                                    if(ret==false){
                                    	return false;
                                    } else {
                                    	var stateCode=null;
                                        $("#editParamValue").next(".errorTip").hide();
                                        JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/update-param',"POST",obj,function(data){
                                            if (data.code == '000000') {	
                                                var data=data.dataMap.data;
                                                stateCode=data;
                                                if(data==1){
                                                	$("#dataControlTable").bootstrapTable('refresh');
                                                    Common.message("success","操作成功");
                                                } else if(data==0){
                                                    Common.message("error","操作异常");
                                                } else if(data==-1){
                                                    Common.message("error","控制点名称已存在");
                                                    
                                                } else if(data==-2){
			                                        Common.message("error","该参数名已存在");
			                                    }
                                            } else if(data.code == 'E00000'){
                                                var data=data.dataMap.data;
                                                if(data==0){
                                                    Common.message("error","操作异常");
                                                } else if(data==-1){
                                                    Common.message("error","控制点名称已存在");
                                                } else if(data==-2){
			                                        Common.message("error","该参数名已存在");
			                                    }
                                            } else if(data.code=="E00001"){
							                	var data = data.dataMap.data;
							                    Common.message("error","非法参数");
							                }
                                        },function(){},6000,false,"json",'',{async:false,headers:{'token':token}});
                                        if(stateCode==-1||stateCode==-2){
                                        	return false;
                                        }
                                    }
                                }
                            },
                            cancel: {
                                label: '取消',
                                className: "red",
                                callback: function() {
                                }
                            }
                        }
                       
                    }
                    bootbox.dialog(config);
                    //参数说明
                    $("#editParamDecribe").val(data.depict);
                } else {}
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        
    },
    //删除控制点
    delete:function(item){
        var paramId = $(item).attr("data-id");
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var token=JCPublicUtil.GetRequest(window.location).token;
        bootbox.dialog({
            message: '你确定要删除该控制点？',
            title: '删除控制点',
            buttons: {
                sure: {
                    label: '确定',
                    className: "green",
                    callback: function() {
                    	JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/remove-param-by-id',"GET",{
                            paramId:paramId,
                            appId:appId
                        },function(data){
                            if (data.code == '000000') {
                                var data=data.dataMap.data;
                                if(data==1){
                                    $("#dataControlTable").bootstrapTable('refresh');
                                    Common.message("success","操作成功");
                                } else if(data==0){
                                    Common.message("error","操作异常");
                                } else if(data==-1){
                                    Common.message("error","数据过时，请刷新界面");
                                }
                            } else if(data.code == 'E00000'){
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
    save:function(){
    	var ret = VT.formSubmit("addApplicationForm");
        var appId=JCPublicUtil.GetRequest(window.location).appId;
        var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#appName").val();
        var type = $("#appCategory option:selected").val();
        var url = $("#callbackPath").val();
        var system = $("#systemIdentity").val();
        var supports = EditApplication.supportChecked();
        var icon = $("#imgicon").attr("data-id");
        var depict = $("#appDecribe").val();
        var obj={};
        obj.appId = appId;
        obj.name = name;
        obj.type = type;
        obj.url = url;
        obj.system = system;
        obj.supports=supports;
        obj.icon = icon;
        obj.depict = depict;
        if(ret){ 
            $("#appName,#callbackPath").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/update',"POST",obj,function(data){
                if (data.code == '000000') {
                    var data=data.dataMap.data;
                    if(data==1){
                        Common.message("success","操作成功");
                    } else if(data==0){
                        Common.message("error","操作异常");
                    } else if(data==-1){
                        Common.message("error","应用名称已存在");
                    }
                } else if(data.code == 'E00000'){
                	var data=data.dataMap.data;
                    if(data==0){
                        Common.message("error","操作异常");
                    } else if(data==-1){
                        Common.message("error","应用名称已存在");
                    }
                } else if(data.code=="E00001"){
	                	var data = data.dataMap.data;
	                    Common.message("error","非法参数");
	                }
            },function(){},6000,false,"json",'',{headers:{'token':token}});
        }
            
    }
}