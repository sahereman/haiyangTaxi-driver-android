//ajax请求数据方法
		function ajaxRequest(url,type,data,callbackSuccess,callbackError){
			var token = localStorage.getItem("token");
			$.ajax({
                url: url,
                type: type,
                data: data,
                dataType: "json",
                headers: {
			        'Authorization': "Bearer " + token
			      },
                success: function (data) {
                	callbackSuccess(data);
                },
                error:function(jqXHR){
                	callbackError(jqXHR);
                }
           });
		}
//判断当前浏览器是否支持WebSocket
	     if ('WebSocket' in window) {
	        ws = new WebSocket("ws://taxi.shangheweiman.com:5302?token=1");
	    }
	    else {
	        alert('当前浏览器 Not support websocket')
	    }		
	    //连接建立时触发
	    ws.onopen = function(evt) { 
	        if(evt.currentTarget.readyState == 1){
	        	console.log("WebSocket连接成功");
	        	
	        }
	    };