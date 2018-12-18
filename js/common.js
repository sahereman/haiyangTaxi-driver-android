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