// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//引入VUE框架
import App from './App'//引入根组件
import router from './router'//引入路由设置
// import Home from '.src/components/Home'

import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.config.productionTip = false;


// 常量
Vue.prototype.isError = false;
Vue.prototype.wsStatus = false;
Vue.prototype.myImei = '';
Vue.prototype.tapWorkingIsClick = false;



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

    //alert("连接成功，请再次点击上班按钮");
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
  var geolocation = new qq.maps.Geolocation("ETBBZ-TOMRF-MTPJB-NWRP2-BAGU5-D6FV5", "海阳出租车-司机端");
  var options = {timeout: 8000};
  geolocation.getLocation(Vue.prototype.sucCallback, Vue.prototype.showErr, options);
  geolocation.watchPosition(Vue.prototype.sucCallback);
},
//定位成功回调
Vue.prototype.sucCallback=function (position){
  var mapInfo = JSON.stringify(position, null, 4);
  var jsonMapInfo = eval('('+mapInfo+')');
  console.log("进入定位成功回调"+JSON.stringify(jsonMapInfo));
  if(jsonMapInfo.accuracy<=200){
    window.localStorage.setItem("lat",jsonMapInfo.lat);
    window.localStorage.setItem("lng",jsonMapInfo.lng);
  }
  console.log("腾讯经度为:"+jsonMapInfo.lng+",腾讯纬度为:"+jsonMapInfo.lat);
},
//定位失败回调
  Vue.prototype.showErr=function (){
    console.log("定位失败");
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

//判断是否已经有token值，有的话连接socket，没有的话获取登录授权token
Vue.prototype.token = window.localStorage.getItem('token');
Vue.prototype.nowTime = parseInt(new Date().getTime());
Vue.prototype.expiresIn = window.localStorage.getItem('expiresIn');

// token存在 && 在有效期内
if(Vue.prototype.token != null && Vue.prototype.nowTime < Vue.prototype.expiresIn) {
  Vue.prototype.ws =  new WebSocket("wss://taxi.shangheweiman.com:5302?token="+window.localStorage.getItem('token'));

  //封装scoket 打开函数
  Vue.prototype.ws.onopen=function (evt) {
    console.log("建立连接");
    Vue.prototype.wsStatus = true;

    //打开心跳包计时器
    Vue.prototype.setBeat();
  };

  //封装scoket 关闭函数
  Vue.prototype.ws.onclose=function (evt) {
    console.log("关闭连接");
    Vue.prototype.wsStatus = false;
    // 关闭心跳包计时器
    clearInterval(Vue.prototype.bTimer);
  };

  /* 定义实例 */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  });

  // 重新获取token
}else {
  // H5 plus事件处理
  Vue.prototype.plusReady = function (){
    // Vue.prototype.myImei =  '123456';
    Vue.prototype.myImei =  window.AndroidWebView.getImei();
    if(Vue.prototype.myImei !=null && Vue.prototype.myImei !=undefined){
      if(Vue.prototype.myImei.indexOf(",") != -1){
        Vue.prototype.myImei = Vue.prototype.myImei.split(",")[0];
      }
    }
    try{
      //原生js获取后台接口数据
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 ) {

          if(xmlhttp.status == 201)
          {
            Vue.prototype.isError = false;
            var data = JSON.parse(xmlhttp.responseText);
            window.localStorage.setItem("token",data.access_token);
            //将有效期（现在的时间戳+秒数）存到localStorage，用于判断token值是否过期
            window.localStorage.setItem("expiresIn",parseInt(data.expires_in)*1000+parseInt(new Date().getTime()));
            Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302?token="+window.localStorage.getItem('token'));

            //封装scoket 打开函数
            Vue.prototype.ws.onopen=function (evt) {
              console.log("建立连接");
              Vue.prototype.wsStatus = true;
              //打开心跳包计时器
              Vue.prototype.setBeat();
            };

            //封装scoket 关闭函数
            Vue.prototype.ws.onclose=function (evt) {
              console.log("关闭连接");
              Vue.prototype.wsStatus = false;
              // 关闭心跳包计时器
              clearInterval(Vue.prototype.bTimer);
            };

            /* 定义实例 */
            new Vue({
              el: '#app',
              router,
              template: '<App/>',
              components: { App }
            });
          }
          else if(xmlhttp.status == 422 || xmlhttp.status == 401)
          {
            //跳转设备禁用页面的判断依据
            Vue.prototype.isError = true;
            Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302");

            /* 定义实例 */
            new Vue({
              el: '#app',
              router,
              template: '<App/>',
              components: { App }
            });
          }


        }

      };
      xmlhttp.open("POST",'https://taxi.shangheweiman.com/api/driver/authorizations',false);
      xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send("imei="+Vue.prototype.myImei);
    }catch (e) {
      console.log(e);
      //跳转设备禁用页面的判断依据
      Vue.prototype.isError = true;
      Vue.prototype.ws = new WebSocket("wss://taxi.shangheweiman.com:5302");

      /* 定义实例 */
      new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: { App }
      });
    }
  }

  if(window.AndroidWebView){
    Vue.prototype.plusReady();
  }else{
    // Vue.prototype.plusReady();
    console.log("window.AndroidWebView未定义");
  }

}




