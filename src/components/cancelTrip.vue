<template>
  <div class="container">
    <div class="topBox">
      行程取消
    </div>
    <div class="tabCon" style="top: 61px;">
      <div class="tabItem">
        <div class="tabItemOne">
          <img src="../assets/icon_time@2x.png"/>
          <span>{{createdAt}}</span>
        </div>
        <div class="tabItemTwo">
          <span class="mustG"></span>
          <span>{{fromAddress}}</span>
        </div>
        <div class="tabItemThre">
          <span class="mustR"></span>
          <span>{{toAddress}}</span>
        </div>
      </div>
      <div class="cancelMain">
        <p>乘客已取消行程</p>
        <div>原因:<span>{{cancelRea}}</span></div>
      </div>
    </div>
    <div class="btns">
      <button class="btnsBigMore" @click="backHome">继续上班</button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "cancelTrip",
      data(){
        return{
          createdAt:"",
          fromAddress:"",
          toAddress:"",
          cancelRea:""
        }
      },
      mounted:function(){
        var that = this;
        var userCancelInfo = JSON.parse(window.localStorage.getItem("userCancelInfo")).data.order;
        that.createdAt = userCancelInfo.closed_at;
        that.fromAddress = userCancelInfo.from_address;
        that.toAddress = userCancelInfo.to_address;
        that.cancelRea = userCancelInfo.close_reason;
      },
      methods:{
          //继续上班
        backHome:function () {
          this.$router.push({name:"working"});
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
  }
  .container .topBox{
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
    height: 60px;
    line-height: 60px;
    font-weight: bold;
    font-size: 20px;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 19;
  }
  .container .topBox>img{
    float: left;
    width: 11px;
    height: 18px;
    margin-top: 20px;
    margin-left: 15px;
  }
  .tabBtn>div{
    width: 33%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #a4a4a4;
    border-bottom: 2px solid #ebebeb;
  }
  .tabCon{
    position: relative;
    top: 120px;
    left: 0;
    width: 100%;
    height: 300px;
  }
  .tabCon .tabItem{
    padding: 10px 20px;
  }
  .tabCon .tabItem:not(:last-child){

    border-bottom: 1px solid #ebebeb;
  }
  .tabCon .tabItem .tabItemOne>img{
    vertical-align:  baseline;
    margin-right: 6px;
    width: 15px;
    height: 15px;
  }
  .tabCon .tabItem .tabItemOne>span:nth-child(3){
    margin-left: 30px;
  }
  .tabCon .tabItem  .tabItemTwo{
    margin: 10px 0;
  }
  .tabCon .tabItem  .tabItemTwo span{
    vertical-align: middle;
  }
  .tabCon .tabItem  .tabItemTwo .mustG{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #3cbca3;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 10px;
  }
  .mustR{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #fd9153;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 10px;
  }
  .cancelMain{
    text-align: center;
    padding-top:50px;
  }
  .cancelMain>p{
    font-weight: bold;
    margin-bottom: 5px;
  }
  .cancelMain>div{
    color: #b6b6b6;
    letter-spacing: 2px;
  }
  .btns .btnsBigMore{
    width: 100%;
    height: 90px;
    line-height: 90px;
    background: #fd9153;
    color: #fff;
    border: none;
    float: left;
    font-size: 30px;
    font-weight: bold;
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>
