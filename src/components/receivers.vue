<template>
  <div class="container">
    <div class="topBox">
      接客中
    </div>
    <div class="receMain">
      <div class="receItem">
        <div class="toAddress">
          <p>乘客起始地</p>
          <div>
            {{fromLocation}}
          </div>
        </div>
        <div class="Navigation" @click="navigationBtn">
          导航
        </div>
      </div>
      <div class="receItem">
        <div class="toAddress">
          <p>乘客手机号</p>
          <div>
            {{phone}}
          </div>
        </div>
        <div class="Navigation" style="background: #3cbca3;" @click="tapPhone({phone})">
          拨号
        </div>
      </div>
    </div>
    <div class="btns">
      <button class="btnsBig" @click="tapDeliver">已上车</button>
      <button class="btnsSmall" @click="tapNoReceive">未接到</button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "receivers",
      data(){
          return{
            fromLocation:"",
            phone:""
          }
      },
      mounted(){
        var that = this;
        var orderInfo = JSON.parse(window.localStorage.getItem("orderInfo"));
        that.fromLocation = orderInfo.order.from_address;
        that.phone = orderInfo.user.phone;
        that.ws.onmessage = function(evt)
        {
          let data = JSON.parse(evt.data);
          console.log("receiver:",data);
          if(data.status_code == 200)
          {
            switch (data.action) {
              //乘客取消了订单
              case 'userCancel' :
                var userCancelInfo =JSON.stringify(data);
                window.localStorage.setItem("userCancelInfo",userCancelInfo);
                that.$router.push({name:"cancelTrip"});
                break;
                //已上车
              case 'received' :
                that.$router.push({name:"deliver"});
                break;
            }
          }
          else if (data.status_code == 422){
            switch (data.action) {
              case 'userCancel' :
                alert('userCancel Error');
                break;
            }
          }
          else{
            alert('系统错误');
          }
        }
      },
      methods: {
        //点击已上车
        tapDeliver:function () {
          var that = this;
          var order_id = JSON.parse(window.localStorage.getItem("orderInfo")).order.id;
          that.wsSeed({
            "action":"received",
            "data":{
              "order_id":order_id
            }
          });
        },
        //拨号
        tapPhone:function(phoneNumber){
          window.location.href = 'tel://' + phoneNumber;
          console.log("待真机测试");
        },
        //点击未接到
        tapNoReceive:function () {
          var that = this;
          that.$router.push({name:"notReceive"});
        },
        //导航
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
