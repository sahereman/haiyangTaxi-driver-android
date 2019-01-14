<template>
  <div class="container">
    <div class="topBox">
      设备禁用
    </div>
    <div class="errMain">
      <img src="../assets/warning@3x.png"/>
      <p>您的设备因到期已被禁用!</p>
      <div>请联系客服<span>400-100-5646</span></div>
      <div>已进行激活</div>
      <div class="imeiBox">
        <table>设备ID:</table>
        <div>
          <div>{{imei}}</div>
        </div>
      </div>
    </div>
    <div class="btns">
      <button class="btnsBigMore" onclick="window.AndroidWebView.restartApp()">已激活</button>
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
      mounted(){
        this.plusReady = function () {
          var that = this;
          var testImei = window.AndroidWebView.getImei();
          var imeiArr = testImei.split(",");
          that.imei = imeiArr[0];
        }
        if(window.AndroidWebView){
          this.plusReady();
        }else{
          console.log("window.AndroidWebView未定义");
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    font-size: 17px;
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
    padding-top: 20px;
  }
  .errMain>img{
    width: 45px;
  }
  .errMain>p{
    font-weight: bold;
    margin: 15px 0;
  }
  .errMain>div{
    color: #a4a4a4;
  }
  .errMain .imeiBox{
    padding-left: 30%;
    font-size: 14px;
    margin-top: 10px;
    color: #717171;
  }
  .errMain .imeiBox>table{
    float: left;
    margin-right: 10px;
  }
  .errMain .imeiBox>div{
    float: left;
  }
  .errMain .imeiBox>div>div:not(:first-child){
    margin-top: 5px;
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
