$(".backPag").on("click",function(){
			window.location.href="home.html";
		});
		$(".tabBtn div").on('click',function(){
			$(".tabBtn div").removeClass("active");
			$(this).addClass("active");
		});
		//请求后台订单列表数据
		function requestOrderData(time){
			ajaxRequest("https://taxi.shangheweiman.com/api/driver/orders","get",{"date":time},function(data){
			console.log("orders接口成功",data);
			var orderArr = data.data;
			var str = "";
			if(orderArr!=""){
				
				$.each(orderArr,function(i){
					str += "<div class='tabItem'><div class='tabItemOne'><img src='../image/icon_time@2x.png'/><span>"+orderArr[i].created_at+"</span><span class='orderStateDone'>"+orderArr[i].status_text+"</span></div>";
					str += "<div class='tabItemTwo'><span class='mustG'></span><span>"+orderArr[i].from_address+"</span></div>"
					str += "<div class='tabItemThre'><span class='mustR'></span><span>"+orderArr[i].to_address+"</span></div>";
					str += "</div>";
					$(".tabCon").html(str);
				});
			}else{
				str+="<div style='padding-top:20px;margin-left:30%;'>暂无接单记录</div>"
				$(".tabCon").html(str);
			}
			
		},function(data){})
		}
		
		requestOrderData("today");
		$(".todayOrder").on('click',function(){
			$(".tabCon").html('');
			requestOrderData("today");
			console.log("123");
		});
		$(".yesterdayOrder").on('click',function(){
			$(".tabCon").html('');
			requestOrderData("yesterday");
			console.log("456");
		});
		$(".monthOrder").on('click',function(){
			$(".tabCon").html('');
			requestOrderData("month");
			console.log("678");
		});
//		$(".tabCon").dropload({
//			    scrollArea : window,
//			   domDown : {
//		            domClass   : 'dropload-down',
//		            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
//		            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
//		            domNoData  : '<div class="dropload-noData">暂无数据</div>'
//		        },
//		        loadDownFn : function(me){
//		        	console.log("+++++++++++++++");
//		        	requestOrderData("today");
//		        },
//		        threshold : 50
//		});
