var AddApplication = {
    init:function(){
    var token=JCPublicUtil.GetRequest(window.location).token;
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
            image: {width: "100%", height: "60px"}
        },
        MAXFILECOUNT:1,
        layoutTemplates:{//隐藏进度条
            progress:""
        }
    }).on('filebatchselected', function (event, data, id, index) {
    	var token=JCPublicUtil.GetRequest(window.location).token;
        var file=data[0];
        var fileName=file.name;
        var fileSize = file.size;
        fileSize=(fileSize / (1024 * 1024)).toFixed(2);	//大小为1m以下
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if(fileSize>1){
        	Common.message("error",file.name+"超过了允许大小 1MB");
        	return false;
        } else if(fileExtension != 'jpg' && fileExtension != 'png'){
        	Common.message("error","不正确的文件扩展名 "+file.name+". 只支持 'jpg,png' 的文件扩展名");
        	return false;
        } else {
	        //选择图片后自动上传 
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
	                            html += '	<a href="javascript:;" onclick="AddApplication.deleteIcon(this)"><i class="close"></i></a>';
	                            html += '	<img id="imgicon" data-id="'+data.dataMap.data+'" src="'+ConfigURl.rootFileUrl+'/visit?fileId='+data.dataMap.data+'" />';
	                            html += '</div>';
	                        	$(".iconUpload").prepend(html);
							}else{}
						}
					};
					xhr.setRequestHeader('token',token);
					xhr.onerror =function(){
						// $("#span_message_"+containerId).html("<font color='red'>上传失败，请稍后重试!</font>");
						// $("#ipt_upload_file_"+containerId).show();
			        }; 
					xhr.send(file);


        // $(this).fileinput("upload");
       }
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
   save:function(){
   		var ret = VT.formSubmit("addApplicationForm");
   		var token=JCPublicUtil.GetRequest(window.location).token;
        var name = $("#appName").val();
        var type = $("#appCategory").val();
        var url = $("#callbackPath").val();
        var system=$("#systemIdentity").val();
        var icon = $("#imgicon").attr("data-id");
        var supports = AddApplication.supportChecked();
        var depict = $("#appDecribe").val();
        var obj={};
        obj.name = name;
        obj.type = type;
        obj.url = url;
        obj.system = system;
        obj.icon = icon;
        obj.supports = supports;
        obj.depict = depict;
        if(ret){ 
            $("#appName,#appCategory").next(".errorTip").hide();
            JCPublicUtil.Ajax(ConfigURl.rootURL+'/mnt/application/add',"POST",obj,function(data){
                if (data.code == '000000') {
                    var data = data.dataMap.data;
                    if(data==1){
                        Common.message("success","操作成功");
                        window.setInterval(function(){
                        	window.location.href='../../index.html?token='+token;
                        },1000);
                    } else if(data==0){
                        Common.message("error","操作异常");
                    } else if(data==-1){
                        Common.message("error","应用名称已存在");
                    }
                } else if(data.code=="E00000"){
                	var data = data.dataMap.data;
                	if(data==0){
                		Common.message("error","操作异常");
                	}else if(data==-1){
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