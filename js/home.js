var url ="https://taxi.shangheweiman.com/api/driver";
		$(".btnsSmall").click(function(){
			window.location.href="order.html";
		})
		
		$(".btnsBig").click(function(){
			window.location.href="working.html";
		})
			plusReady();
	//		if(window.plus){
	//			plusReady();
	//		}else{
	//			document.addEventListener("plusready",plusReady,false);
	//跳转到系统错误页面TODO
	//		}
			getUserInfo();
			getIndexOrder();
			
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
		// 登录授权token
		function plusReady(){
			var myImei = "123456,121212121";//用于测试的imei
//			var myImei = plus.device.imei;//真实的imei
			if(myImei !=null && myImei !=undefined){
				if(myImei.indexOf(",") != -1){
					myImei = myImei.split(",")[0];
					var seImei = myImei.split(",")[1];
				}else{
					myImei = myImei;
				}
			}
			ajaxRequest("https://taxi.shangheweiman.com/api/driver/authorizations","post",{"imei":myImei},function(data){
				console.log("authorizations接口调用成功：",data);
        		var token = data.access_token;
        		localStorage.setItem("token",token);
			},function(data){
				console.log("authorizations接口调用失败",data);
			});
		}
		//获取用户信息
		function getUserInfo(){
			ajaxRequest("https://taxi.shangheweiman.com/api/driver/drivers/me","get",{},function(data){
				console.log("drivers/me接口调用成功：",data);
				$(".cartNum span").html(data.cart_number);
			},function(data){
				console.log("drivers/me接口调用失败：",data);
			});
		}
		//获取首页统计订单
		function getIndexOrder(){
			ajaxRequest("https://taxi.shangheweiman.com/api/driver/index/stats","get",{},function(data){
				console.log("index/stats接口调用成功：",data);
                	$(".orderNumLeft div").html(data.today_order_count);
                	$(".orderNumRight div").html(data.yesterday_order_count);
                	$(".orderTotle div").html(data.order_count);
			},function(data){
				//错误处理，跳转到系统错误页面
		           console.log("发生错误："+ jqXHR.status);
			});
		}