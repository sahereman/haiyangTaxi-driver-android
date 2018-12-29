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
      <button class="btnsBigMore">已激活</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "error"
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
