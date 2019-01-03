<template>
  <div class="container">
    <div class="topBox">
      设备禁用
    </div>
    <div class="errMain">
      <img src="../assets/warning@3x.png"/>
      <p>您的设备因到期已被禁用</p>
      <div>请联系客服<span>400-100-5646</span></div>
      <div>已进行激活</div>
    </div>
    <div class="btns">
      <button class="btnsBigMore" @click="activated">已激活</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "error",
        data(){
          return{
            imei:""
          }
        },
      create(){
        // H5 plus事件处理
        function plusReady(){
          var that = this;
          that.imei = plus.device.imei;
          // alert( "IMEI: " + plus.device.imei );
        }
        if(window.plus){
          plusReady();
        }else{
          document.addEventListener("plusready",plusReady,false);
        }
      },
      method:{
        activated:function(){
          this.getLoginToken();
        },
        // 登录授权token
        getLoginToken:function () {
          var that = this;
          // var myImei = "123456,121212121";//用于测试的imei
          var myImei = that.imei;//真实的imei
          if(myImei !=null && myImei !=undefined){
            if(myImei.indexOf(",") != -1){
              myImei = myImei.split(",")[0];
              var seImei = myImei.split(",")[1];
            }else{
              myImei = myImei;
            }
          }
          this.$httpPost("/authorizations",{"imei":myImei},function (data) {
            window.localStorage.removeItem("token");
            window.localStorage.setItem("token",data.data.access_token);
            that.$router.push({name:'Home'});
            //如果后台没有设置相关imei，返回401，跳转设备禁用页面
            if(data.status == 401){
              alert("请先去激活该设备");
            }
          });
        },
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
  }
  .container .topBox{
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
    font-weight: bold;
    font-size: 20px;
  }
  .errMain{
    text-align: center;
    padding-top: 30px;
  }
  .errMain>p{
    font-weight: bold;
    margin: 10px 0;
  }
  .errMain>div{
    color: #a4a4a4;
  }
  .btns{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .btns .btnsBigMore{
    width: 100%;
    height: 100px;
    line-height: 70px;
    background: #fd9153;
    color: #fff;
    border: none;
    float: left;
    font-size: 28px;
    font-weight: bold;
  }
</style>
