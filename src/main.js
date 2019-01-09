// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//引入VUE框架
import App from './App'//引入根组件
import router from './router'//引入路由设置
// import Home from '.src/components/Home'

import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.config.productionTip = false;

alert("浏览器内核:"+navigator.appVersion);
//公共方法
//post请求数据方法
Vue.prototype.httpPost = function (url,data,callBack) {
  var token = window.localStorage.getItem("token");
  this.$http.post(
    "https://taxi.shangheweiman.com/api/driver"+url,
    {
      params : data
    }
    )
    .then(data => {
      console.log('请求数据成功:' + url + ':', data);
      callBack(data);
    }, response => {
      console.log('接口请求数据失败'+ url + ':', data);
    });
};
//get请求数据方法
Vue.prototype.$httpGet = function (url,data,callBack) {
  var token = window.localStorage.getItem("token");
  this.$http.get(
    "https://taxi.shangheweiman.com/api/driver"+url,
    {
      params : data,
      headers :{
        'Authorization': "Bearer " + token
      }
    }
    )
    .then(data => {
      console.log('请求数据成功:' + url + ':', data);
      callBack(data);
    }, response => {
      console.log('接口请求数据失败'+ url + ':', data);
    });
};
//get请求数据方法(url为全部输入)
Vue.prototype.$httpGetUrl = function (url,data,callBack) {
  var token = window.localStorage.getItem("token");
  this.$http.get(
    url,
    {
      params : data,
      headers :{
        'Authorization': "Bearer " + token
      }
    }
  )
    .then(data => {
      console.log('请求数据成功:' + url + ':', data);
      callBack(data);
    }, response => {
      console.log('接口请求数据失败'+ url + ':', data);
    });
};
Vue.prototype.isError = false;
//判断是否已经有token值，有的话连接socket，没有的话获取登录授权token
Vue.prototype.token = window.localStorage.getItem('token');
alert("token:"+Vue.prototype.token);
  if(Vue.prototype.token != null) {
    Vue.prototype.ws =  new WebSocket("wss://taxi.shangheweiman.com:5302?token="+window.localStorage.getItem('token'));
  }else {
    //原生js获取后台接口数据
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      console.log(xmlhttp);
      if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
        Vue.prototype.isError = false;
        var data = JSON.parse(xmlhttp.responseText);
        alert("获取登录授权token:",data);
        window.localStorage.setItem("token",data.access_token);
        alert(window.localStorage.getItem('token'));
        Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302?token="+window.localStorage.getItem('token'));
      }else
      {
        //跳转设备禁用页面的判断依据
        Vue.prototype.isError = true;
      }
    };
    xmlhttp.open("POST",'https://taxi.shangheweiman.com/api/driver/authorizations',false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    Vue.prototype.myImei = "855109030017439,1121212";//用于测试的imei 627943    867109030017439 898859
      try{
        alert("myImei1:"+Vue.prototype.myImei);
        xmlhttp.send("imei="+Vue.prototype.myImei);
      }catch (e) {
        //跳转设备禁用页面的判断依据
        Vue.prototype.isError = true;
        Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302");
      }
    // H5 plus事件处理
    // alert(JSON.stringify(window.plus));
    // if(window.plus){
    //   Vue.prototype.myImei = plus.device.imei;
    //   alert("456===="+Vue.prototype.myImei);
    //   if(Vue.prototype.myImei !=null && Vue.prototype.myImei !=undefined){
    //     if(Vue.prototype.myImei.indexOf(",") != -1){
    //       Vue.prototype.myImei = Vue.prototype.myImei.split(",")[0];
    //       var seImei = Vue.prototype.myImei.split(",")[1];
    //     }
    //   }
    //   try{
    //     alert("myImei1:"+Vue.prototype.myImei);
    //     xmlhttp.send("imei="+Vue.prototype.myImei);
    //   }catch (e) {
    //     //跳转设备禁用页面的判断依据
    //     Vue.prototype.isError = true;
    //     Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302");
    //   }
    // }else{
    //   document.addEventListener("plusready",function(){
    //     Vue.prototype.myImei = plus.device.imei;
    //     alert('123==='+Vue.prototype.myImei);
    //     if(Vue.prototype.myImei !=null && Vue.prototype.myImei !=undefined){
    //       if(Vue.prototype.myImei.indexOf(",") != -1){
    //         Vue.prototype.myImei = Vue.prototype.myImei.split(",")[0];
    //         var seImei = Vue.prototype.myImei.split(",")[1];
    //       }
    //     }
    //     try{
    //       alert("myImei2:"+Vue.prototype.myImei);
    //       xmlhttp.send("imei="+Vue.prototype.myImei);
    //     }catch (e) {
    //         //跳转设备禁用页面的判断依据
    //         Vue.prototype.isError = true;
    //         Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302");
    //       }
    //     },false);
    //   }
  }
Vue.prototype.wsStatus = false;
Vue.prototype.ws.onopen=function (evt) {
  console.log("建立连接");
  Vue.prototype.wsStatus = true;
  //打开心跳包计时器
  Vue.prototype.setBeat();
};
//封装scoket关闭函数
Vue.prototype.ws.onclose=function (evt) {
  console.log("关闭连接");
  Vue.prototype.wsStatus = false;
  // 关闭心跳包计时器
  clearInterval(Vue.prototype.bTimer);
};
//封装scoket发送函数
Vue.prototype.wsSeed = function (obj) {
  if(Vue.prototype.wsStatus == true)
  {
    Vue.prototype.ws.send(JSON.stringify(obj));
  }
  else
  {
    console.log("重新连接Socket");
    let oldmsg = Vue.prototype.ws.onmessage;
    let oldopen = Vue.prototype.ws.onopen;
    let oldclose = Vue.prototype.ws.onclose;
    Vue.prototype.ws =new WebSocket("wss://taxi.shangheweiman.com:5302?token="+window.localStorage.getItem('token'));
    Vue.prototype.ws.onopen = oldopen;
    Vue.prototype.ws.onmessage = oldmsg;
    Vue.prototype.ws.onclose = oldclose;
    alert("连接成功，请再次点击上班按钮");
  }
};
//心跳包定时器
Vue.prototype.bTimer = "";
Vue.prototype.setBeat = function(){
  Vue.prototype.bTimer = setInterval(function () {
    var obj = {
      "action":"beat"
    };
    Vue.prototype.wsSeed(obj);

  },3000);
};
/**用腾讯获取坐标**/
Vue.prototype.coordinate=function (){
  alert("进入用腾讯获取坐标");
  var geolocation = new qq.maps.Geolocation("ETBBZ-TOMRF-MTPJB-NWRP2-BAGU5-D6FV5", "海阳出租车-司机端");
  var options = {timeout: 8000};
  geolocation.watchPosition(Vue.prototype.sucCallback, Vue.prototype.showErr, options);
},
//定位成功回调
Vue.prototype.sucCallback=function (position){
  var mapInfo = JSON.stringify(position, null, 4);
  var jsonMapInfo = eval('('+mapInfo+')');
  window.localStorage.setItem("lat",jsonMapInfo.lat);
  window.localStorage.setItem("lng",jsonMapInfo.lng);
  alert("腾讯经度为:"+jsonMapInfo.lng+",腾讯纬度为:"+jsonMapInfo.lat);
},
//定位失败回调
  Vue.prototype.showErr=function (){
  alert("定位失败");
},
  //更新位置定时器
Vue.prototype.locaTimer = "";
Vue.prototype.setLocation = function(){
  //获取手机位置经纬度
  Vue.prototype.coordinate();
  Vue.prototype.locaTimer = setInterval(function () {
    var obj = {
      "action":"location",
      "data":{
        "lat":window.localStorage.getItem("lat"),
        "lng":window.localStorage.getItem("lng")
      }
    };
    Vue.prototype.wsSeed(obj);
  },3000);
}
/* 定义实例 */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
