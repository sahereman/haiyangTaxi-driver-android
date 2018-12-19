$(".offWork").on('click',function(){
	window.location.href = "home.html";
})

$(".orderList").on('click',function(){
	window.location.href = "order.html";
})
$(".orderCon .orderItem").on('click',function(){
	$(".orderCon>div").removeClass("addBorder");
	$(this).addClass("addBorder");
	$(".btnsBig").addClass("addColor");
})
$(".btnsBig").on('click',function(){
	console.log($(this).attr("class"));
	if($(this).attr("class").indexOf("addColor") !=-1){
		window.location.href = "receive.html";
	}else{
		alert("请先选择订单");
	}
});
//客户端接收服务端数据时触发
	    ws.onmessage = function(evt) {
		      console.log( "接收数据: " + evt.data);
	    };
