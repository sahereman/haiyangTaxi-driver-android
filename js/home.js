var url ="https://taxi.shangheweiman.com/api/driver";
var working=false;
var ws = null;
var bTimer;
var lTimer;
var token = localStorage.getItem("token");
	//跳转订单列表
	$(".btnsSmall").click(function(){
		window.location.href="order.html";
	})
	//上班
	$(".btnsBig").click(function(){
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
	        	var obj = {
					    "action":"active",
					    "data":{
					        "lat":"36.092484",
					        "lng":"120.380966"
					    }
					}
	        	ws.send(JSON.stringify(obj));
	        }
	    };
		//客户端接收服务端数据时触发
	    ws.onmessage = function(evt) {
		      console.log( "接收数据: " + evt.data);
		     //如果返回的上班成功，跳转上班中页面
		     if( JSON.parse(evt.data).action == "active" && JSON.parse(evt.data).status_code == 200){
		     	window.location.href="working.html";
		     }
	    };	
	})
		plusReady();
//		if(window.plus){
//			plusReady();
//		}else{
//			document.addEventListener("plusready",plusReady,false);
//			//	跳转到系统错误页面
//			window.location.href = "error.html";	
//		}
		
		getUserInfo();
		getIndexOrder();
//		beatTimer();
//		updateLocation();
		
	//发送心跳包检测	
	function beatTimer(){
		bTimer= setInterval(function(){
			var obj = {
				"action":"beat"
			}
			ws.send(JSON.stringify(obj));
			ws.onmessage=function(evt){
				console.log("返回的心跳包数据",evt.data);
				//如果检测到断开连接，重新连接TODO
//				if(){
//					 ws = new WebSocket("ws://taxi.shangheweiman.com:5302?token=1");
//				}
			}
		},10000);
	}
	//更新位置
	function updateLocation(){
		lTimer= setInterval(function(){
			var obj = {
						    "action":"location",
						    "data":{
						        "lat":"36.111114",
						        "lng":"120.444444"
						    }
						}
			ws.send(JSON.stringify(obj));
			ws.onmessage=function(evt){
				console.log("返回的更新位置",evt.data);
			}
		},3000);
	}
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
			window.location.href = "error.html";	
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
		


	
   
	
	
	
	
	/**用腾讯获取坐标**/
	function coordinate(){
        var geolocation = new qq.maps.Geolocation("ETBBZ-TOMRF-MTPJB-NWRP2-BAGU5-D6FV5", "mapqq");
	    geolocation.getLocation(sucCallback, showErr);
	}
	//定位成功回调
	function sucCallback(position){
		var mapInfo = JSON.stringify(position, null, 4);
		var jsonMapInfo = eval('('+mapInfo+')');
		console.log("腾讯经度为lng:"+jsonMapInfo.lng+",腾讯纬度为lat:"+jsonMapInfo.lat);
	}
	//定位失败回调
	function showErr(){
		alert("定位失败");	
	}
