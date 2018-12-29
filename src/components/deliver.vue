<template>
  <div class="container">
    <div class="topBox">
      送客中
    </div>
    <div class="receMain">
      <div class="receItem">
        <div class="toAddress">
          <p>乘客目的地</p>
          <div>
            {{toAddress}}
          </div>
        </div>
        <div class="Navigation" @click="navigationBtn">
          导航
        </div>
      </div>
    </div>
    <div class="btns">
      <button class="btnsBigMore" @click="tapServed">已送达</button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "deliver",
      data(){
        return{
          toAddress:""
        }
      },
      mounted:function(){
        var that = this;
        var orderInfo = JSON.parse(window.localStorage.getItem("orderInfo"));
        that.toAddress = orderInfo.order.to_address;
        that.ws.onmessage = function(evt)
        {
          let data = JSON.parse(evt.data);
          console.log("deliver:",data);
          if(data.status_code == 200)
          {
            switch (data.action) {
              //已送达
              case 'reach' :
                that.$router.push({name:"working"});
                break;
            }
          }
          else if (data.status_code == 422){
            switch (data.action) {
              case 'reach' :
                alert('reach Error');
                break;
            }
          }
          else{
            alert('系统错误');
          }
        }
      },
      methods:{
        tapServed:function () {
          var that = this;
          var order_id = JSON.parse(window.localStorage.getItem("orderInfo")).order.id;
          that.wsSeed({
            "action":"reach",
            "data":{
              "order_id":order_id
            }
          });
        },
        navigationBtn:function () {
          alert("功能建设中...");
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    background: #ebebeb;
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
  .receMain{
    margin-top: 61px;
  }
  .receMain .receItem{
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
  }
  .receMain .receItem .toAddress{
    width: 68%;
    padding: 10px 15px 10px  25px;
  }
  .receMain .receItem .toAddress>p{
    font-weight: bold;
  }
  .receMain .receItem .toAddress>div{
    color: #484848;
    font-size: 17px;
    margin-top: 5px;
  }
  .receMain .receItem .Navigation{
    width: 32%;
    height: 100%;
    line-height: 100px;
    text-align: center;
    background: #fd9153;
    color: #fff;
  }
  .btns{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .btns .btnsBig{
    width: 70%;
    height: 100px;
    line-height: 70px;
    background: #fd9153;
    color: #fff;
    border: none;
    float: left;
    font-size: 28px;
    font-weight: bold;
  }
  .btns .btnsSmall{
    width: 30%;
    height: 100px;
    border: none;
    color: #fff;
    background: #494b5a;
    font-size: 18px;
    font-weight: bold;
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
