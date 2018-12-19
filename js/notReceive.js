$(".causeList ul li").on("click",function(){
	$(".causeList ul li").removeClass("activeCause");
	$(this).addClass("activeCause");
	$(".btnsBigMore").addClass("addBage");
})
$(".btnsBigMore").on('click',function(){
	console.log($(this).attr("class"));
	if($(this).attr("class").indexOf("addBage") !=-1){
		window.location.href="working.html";
	}else{
		alert("请先选择原因");
	}
})
