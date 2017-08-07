(function(window,undefined){
	
	function commonFn(){
		
        /**
		 * 加载页面
         * @param args.container 容器 jquery对象
         * @param {string}args.pageUrl 页面路径
         * @param {string}args.pageScript 页面对应的js文件
         * @param {function}args.onLoaded 页面记载完成后回调函数
         */
		this.loadPage = function(args){
			var _container = args.container;
			var pageUrl = args.pageUrl;
			var pageScript = args.pageScript;
			var onLoaded = args.onLoaded;

		/***ajax*******************************************************/
			$.ajax({
				url : pageUrl,
				type : 'GET',
				dataType : 'html',
				timeout : 10000,
				success : function(res){
					
//					加载html页面
					var _pageNode = $('<div></div>');
					var _pageNodeTmp = $('<div></div>');
                    _pageNodeTmp.html(res);
                    _pageNode.append(_pageNodeTmp.children());
                    _container.append(_pageNode.children());

//                  加载js文件
                    var pageScriptTmp = document.createElement("script");
                    pageScriptTmp.setAttribute('type','text/javascript');
                    pageScriptTmp.setAttribute("src", pageScript);
                    var documentHead = document.head;
                    if(documentHead == undefined) {
                        documentHead = document.getElementsByTagName("head")[0];
                    }
                    documentHead.appendChild(pageScriptTmp);
                    
//              	js脚本加载完成后回调函数
                    pageScriptTmp.onload = pageScriptTmp.onreadystatechange = function(){
                        if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                            onLoaded();
                        }
                    }
				},
				error : function(){
					alert('页面出错了');
				}
			});
		/***ajax END************************************************/
		};

        /**
		 * LOADING
         * @param obj jquery对象loading的目标
         */
		this.loadingStart = function(obj){
			if(obj.find('.loadingDiv').length>0){
                return;
            }
			var thisWidth = obj.width()/2-30;
            var thisHeight = obj.height()/2-30;
            obj.css('position','relative');
            var loadingDiv = '<div class="loadingDiv" style="width:'+obj.width()+'px;height:'+obj.height()+'px;background-color:rgba(0,0,0,0.3);"><div id="loading-center-absolute" ><div class="object" id="object_four"></div><div class="object" id="object_three"></div><div class="object" id="object_two"></div><div class="object" id="object_one"></div></div><div class="loading_tips">加载中，请稍后...</div></div>';
			obj.append(loadingDiv);
		};
		this.loadingStop = function(obj){
			obj.find('.loadingDiv').remove();
		};

        /**
		 * 判断是否存在
         * @param str
         * @returns {boolean}
         */
		this.isEmpty = function(str){
            return (!str || str.length == 0);
        };

        /**
		 * 判断为空返回""
         * @param str
         * @returns {*}
         */
		this.nullToEmpty = function(str){
            if(str==null){
                return "";
            }
            else{
                return str;
            }
        };

        /**
		 * 去除空格
         * @param str
         * @returns {XML|void|string}
         */
		this.trim = function(str){
			return str.replace(/(^\s*)|(\s*$)/g, "");
		};

        /**
		 * 去除逗号
         * @param str
         * @returns {XML|void|string}
         */
		this.delDou = function(str){
			if(typeof(str)=="number"){
				str = str.toString();
			}
			return str.replace(/,/g, "");
		};

        /**
		 * 格式化大数字
         * @param type
         * @param money
         * @returns {string}
         */
		this.formatMoneyUnit = function (type,money){
			// 表示为不需要保留2位小数
			if(type==0){
				if(money>100000000){
					return money*1000/100000000000 + '亿';
				}
				else if(money>=10000){
					return money/10000 + '万';
				}else{
					return money + '';
				}
			}else{
				if(money>100000000){
					return (money*1000/100000000000).toFixed(2) + '亿';
				}
				else if(money>=10000){
					return (money/10000).toFixed(2) + '万';
				}else{
					return (money).toFixed(2) + '';
				}
			}
		};

        /**
		 * 检查返回数据
         * @param result
         * @returns {boolean}
         */
		this.checkPageResult = function(result){
			var code = result.statusCode;
			var errorMsg = result.errorMsg;
			if(code == '0'){
				return true;
			}else{
				// alert(errorMsg);
				alert(errorMsg);
				return false;
			}
		};

        /**
		 * ajax封装
         * @param {string}json.url 请求地址
         * @param {object}json.data 请求入参
         * @param {function}json.success 请求成功回调函数
         * @param {function}json.complete 请求完成回调函数
         */
		this.loadAjax = function(json){
			var _this = this;
			var jsonUrl = json.url;
			var jsonData = json.data;
			var jsonSuccess = json.success;
			var jsonComplete = json.complete;
			$.ajax({
				url: jsonUrl,
				method: 'POST',
				timeout:20000,
                cache:true,
				data: jsonData,
				dataType:"html",
				contentType: 'application/json',
				success: function (result) {
					result = JSON.parse(result);
					jsonSuccess(result);
				},
				complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
					if(status=='timeout'){//超时,status还有success,error等值的情况
						alert('检索超时,请刷新页面重新加载!');
					}
				}
			});
		};

        /**
		 * JSON数组对象刷值
         * @param {object}args.sourceDataList 数据源
         * @param {jquery object}args.dataListRootNode 数据渲染一级根节点 针对整个数组
         * @param {jquery object}args.dataListChildNode 数据渲染二级根节点  针对数组对象里的一个对象
         * @param {string}args.dataAttrName 数据刷值的属性名称 根据哪一个属性名来刷值
         * @param {function}args.dataHandleFn 刷值过程中执行的回调函数  传入的参数:二级子节点 和 该对象在数组中的index
         */
		this.loadListData = function(args){
			var sourceDataList = args.sourceDataList;
            var dataListRootNode = args.dataListRootNode;
            var dataListChildNode = args.dataListChildNode;
            var dataAttrName  = args.dataAttrName;
            var dataHandleFn = args.dataHandleFn;

            //遍历JSON数组对象
            for(var w = 0;w<sourceDataList.length;w++){//外层循环
                var dataListChildNodeCopy = dataListChildNode.clone();
                var subDataList = sourceDataList[w];
                for(var z in subDataList){//内层循环
                    var _thisNode = dataListChildNodeCopy.find('['+dataAttrName+'='+z+']');
                    if(!$commonObj.isEmpty(_thisNode)){
                        if(_thisNode.get(0).tagName.toLowerCase()=="input"){
                            _thisNode.val(subDataList[z]);
                        }else{
                            _thisNode.text(subDataList[z]);
                        }
                    }
                }
                $(dataListRootNode).append(dataListChildNodeCopy);
                dataHandleFn(dataListChildNodeCopy,w);
            }
		};

        /**
		 * JSON对象刷值
         * @param {object}args.sourceData 数据源
         * @param {jquery object}args.dataRootNode 数据渲染根节点  整个对象
         * @param {string}args.dataAttrName 数据刷值的属性名称  根据哪一个属性名来刷值
         * @param {function}args.dataHandleFn 刷值完成后执行的回调函数
         */
		this.loadSingleData = function(args){
			var sourceData = args.sourceData;
			var dataRootNode = args.dataRootNode;
			var dataAttrName  = args.dataAttrName;
			var dataHandleFn = args.dataHandleFn;
//			遍历对象
			for(var w in sourceData){
				var _thisNode = dataRootNode.find('['+dataAttrName+'='+w+']');
				if(!$commonObj.isEmpty(_thisNode)){
                    if(_thisNode.get(0).tagName.toLowerCase()=="input"){;
                        _thisNode.val(this.nullToEmpty(sourceData[w]));
                    }
                    else{
                        _thisNode.text(this.nullToEmpty(sourceData[w]))
                    }
                }
			}
			dataHandleFn();
		};

        /**
		 * 解析url的传值
         * @returns {Object}
         */
		this.getRequestByUrl = function(){
			var url = location.search; //获取url中"?"符后的字串
   			var theRequest = new Object();
   			if (url.indexOf("?") != -1) {
      			var str = url.substr(1);
      			strs = str.split("&");
      			for(var i = 0; i < strs.length; i ++) {
         			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      			}
   			}
   			return theRequest;//返回一个对象 等号左边key右边value
		};

        /**
		 * 获取当前时间
         * @returns {string}
         */
		this.getCurrentTime = function(){
			var myDate = new Date();
			//获取当前年
			var year = myDate.getFullYear();
			//获取当前月
			var month = myDate.getMonth()+1;
			//获取当前日
			var wdate = myDate.getDate();
			var h = myDate.getHours();       //获取当前小时数(0-23)
			var m = myDate.getMinutes();     //获取当前分钟数(0-59)
			var s = myDate.getSeconds();  
			//时间格式
			var now = year+$commonObj.p(month)+$commonObj.p(wdate)+$commonObj.p(h)+$commonObj.p(m)+$commonObj.p(s);
			return now;//返回时间
		};
		//格式化时间 10以下的前面加个0
		this.p = function(s) {
		    return s < 10 ? '0' + s: s;
		};



	}
	var commonFnObj = new commonFn();
	window.$commonObj = commonFnObj;
})(window);
