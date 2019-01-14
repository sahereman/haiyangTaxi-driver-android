<template id="contact">
  <div class="container workingCon">
    <div class="topBox">
      上班中
    </div>
    <div class="orderMain" v-show="!Waiting">
      <p>您附近有<span>{{nearOrderCount}}</span>个订单</p>
      <div class="orderCon">
        <div class="orderItem" @click="acceptOrder(item,index)" v-bind:class="{ addBorder:index == current}" v-for="(item,index) in wOrderList">
          <div class="tabItemTwo">
            <span class="mustG"></span>
            <span>{{item.from_address}}</span>
          </div>
          <div class="disDetail">
            <div class="disDetailLeft">据您<span>{{item.distance}}</span>公里</div>
            <div class="disDetailTime">{{item.needTime}}s</div>
          </div>
        </div>
      </div>
    </div>
    <div class="noneOrder" v-show="Waiting">
      <p>等待派单中</p>
      <img src="../assets/icon_Paidan.png"/>
    </div>
    <div class="btns" v-show="!Waiting">
      <button class="btnsSmallx offWork" style="float:left;" @click="tapEndWork()">下班</button>
      <span class="btnsBigx" v-bind:class="{ addColor:acceptOrd}" @click="acceptOrdBtn" ref="acceptOrdBtn">接单</span>
      <button class="btnsSmallx orderList" @click="tapOrderList()">接单<br/>记录</button>
    </div>
    <div class="btnTwo btns" v-show="Waiting">
      <button class="btnsBigs" @click="tapEndWork()">下班</button>
      <button class="btnsSmall orderList" @click="tapOrderList()">接单<br/>记录</button>
    </div>
    <layer ref="layer"></layer>
    <audio controls="controls"
           preload="auto"
           src="../assets/music.mp3" ref="audio" style="display: none;">
    </audio>
  </div>
</template>
<script>
  import layer from "../components/layer"
export default {
  'name': 'working',
  //注册组件
  components: {
    layer
  },
  data () {
    return{
      current:-1,
      nearOrderCount:"",
      Waiting:false,
      acceptOrd:false,
      orderKey:"",
      wOrderList:[],
      timerArr:[]
    }
  },
  mounted(){
    var that = this;
    let layer = this.$refs.layer;
    that.Waiting = true;
    that.ws.onmessage = function(evt)
    {
      let data = JSON.parse(evt.data);
      console.log("working:",data);
      if(data.status_code == 200)
      {
        switch (data.action) {
          case 'notify' :
                that.Waiting = false;
                var needTime = 20;
                var from_address = data.data.from_address;
                var distance =String(data.data.distance/1000).substr(0,3);
                var orderKey = data.data.order_key;
                that.wOrderList.push(
                  {"from_address":from_address,"distance":distance,"orderKey":orderKey,"needTime":needTime,"Interval":null}
                  );
                that.nearOrderCount = that.wOrderList.length;
                console.log("that.wOrderList",that.wOrderList);
                if(that.nearOrderCount > 0){
                  that.orderTimer(orderKey);
                }
                that.$refs.audio.play();
            break;
          case 'accept' :
            //将接收的order_id存起来，用于用户已上车和已到达的时候作为参数传过去
            var orderInfo = JSON.stringify(JSON.parse(evt.data).data);
            window.localStorage.setItem("orderInfo",orderInfo);
            that.$router.push({name:"receivers"});
            break;
          case 'close' :
            that.$router.push({name:"Home"});
            break;
        }
      }
      else if (data.status_code == 422){
        switch (data.action) {
          case 'notify' :
            layer.open({
              type: 1,
              content: 'notify Error',  // 内容
              time: 3, // 几秒后自动关闭 默认 2
              callback () {  // 几秒后自动关闭 回掉
                console.log('弹框消失')
              }
            })
            break;
          case 'accept' :
            let res = JSON.parse(evt.data);
            for(let obj in res.data)
            {
              if(obj == 'data.order_key')
              {
                layer.open({
                  type: 1,
                  content: res.data[obj][0],  // 内容
                  time: 3, // 几秒后自动关闭 默认 2
                  callback () {  // 几秒后自动关闭 回掉
                    console.log('弹框消失')
                  }
                })
                //（已被抢单）将这笔订单在页面删除,关掉这笔订单的定时器
                //用for循环写
                var order="";
                for(var i=0; i<that.wOrderList.length; i++ ){
                  if(that.wOrderList[i].orderKey == that.orderKey){
                    order = that.wOrderList[i];
                  }
                }
                let index = that.wOrderList.indexOf(order);
                window.clearInterval(that.wOrderList[index].Interval);
                that.wOrderList.splice(index,1);
                if(that.wOrderList.length == 0){
                  that.Waiting = true;
                }
              }
            }
            break;
        }
      }
      else{
        layer.open({
          type: 1,
          content: '系统错误',  // 内容
          time: 3, // 几秒后自动关闭 默认 2
          callback () {  // 几秒后自动关闭 回掉
            console.log('弹框消失')
          }
        })
      }
    }
  },
  methods:{
    //点击订单选项
    acceptOrder:function(item,index){
      var that = this;
      that.current=index;
      that.acceptOrd = true;
      that.orderKey =item.orderKey
    },
    //点击接单按钮
    acceptOrdBtn:function(){
      var that = this;
      if(that.$refs.acceptOrdBtn.className.indexOf("addColor")!=-1){
        //发送接单信息
        that.wsSeed({
          "action":"accept",
          "data":{
            "order_key":that.orderKey
          }
        });
      }else {
        let layer = this.$refs.layer;
        layer.open({
          type: 1,
          content: '请先选择订单',  // 内容
          time: 3, // 几秒后自动关闭 默认 2
          callback () {  // 几秒后自动关闭 回掉
            console.log('弹框消失')
          }
        })
      };
      //只有选中订单按接单时才把所有的定时器关掉
      if(that.acceptOrd){
        //跳转页面之前把所有的定时器都关掉
        for(var i=0; i<that.wOrderList.length; i++){
          var itemInterval = that.wOrderList[i].Interval;
          window.clearInterval(itemInterval);
        }
      }
    },
    //下班
    tapEndWork:function () {
      var that = this;
      that.wsSeed({
        "action":"close"
      });
      clearInterval(that.bTimer);
      clearInterval(that.locaTimer);

      this.$router.push({name:"Home"});
    },
    //点击接单记录
    tapOrderList:function () {
      var that = this;
      that.$router.push({name:"orderList",params:{pageFrom:"working"}});
    },
    //订单20秒定时器
    orderTimer:function (orderKey) {
      var that = this;
      if(that.wOrderList.length>0){
        //用for循环写
        var order="";
        for(var i=0; i<that.wOrderList.length; i++ ){
          if(that.wOrderList[i].orderKey == orderKey){
            order = that.wOrderList[i];
          }
        }
        var orderIndex = that.wOrderList.indexOf(order);
        that.wOrderList[orderIndex].Interval = setInterval(function () {
          //用for循环写
          var order="";
          for(var i=0; i<that.wOrderList.length; i++ ){
            if(that.wOrderList[i].orderKey == orderKey){
              order = that.wOrderList[i];
            }
          }
          var index = that.wOrderList.indexOf(order);
          var needTime = that.wOrderList[index].needTime;
          if(needTime <= 0)
          {
            //清除倒计时为零的计时器，将这一条订单从页面删除，将选中状态清除
            clearInterval(that.wOrderList[index].Interval);
            that.current=-1;
            that.acceptOrd = false;
            that.wOrderList.splice(index,1);
            if(that.wOrderList.length == 0){
              that.Waiting = true;
            }
          }
          else
          {
            that.wOrderList[index].needTime--;
          }
        },1000);
      }
    },
  }
}
</script>
<style scoped>
  .container{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .workingTip{
    width: 100%;
    text-align: center;
  }
  .container .topBox{
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
    height: 60px;
    line-height: 60px;
    font-weight: bold;
    font-size: 24px;
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
  .orderMain,.noneOrder{
    width: 100%;
    margin-top: 61px;
  }
  .noneOrder{
    text-align: center;
    padding-top: 30px;
  }
  .noneOrder>p{
    margin-bottom: 30px;
    font-size: 18px;
  }
  .orderMain>p{
    height: 45px;
    line-height: 45px;
    font-weight: bold;
    padding-left: 10px;
    font-size: 16px;
  }
  .orderMain .orderCon{
    width: 100%;
    height: 220px;
    overflow-y: scroll;
    position: relative;
    top: 1px;
    left: 0;
  }
  .orderMain .orderItem{
    width: 100%;
    padding: 10px;
    border: 1px solid #ebebeb;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .orderMain .orderItem .tabItemTwo{
    font-size: 18px;
  }
  .orderMain .orderItem .tabItemTwo .mustG{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #3cbca3;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 10px;
  }
  .orderMain .orderItem .disDetail{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
  }
  .orderMain .orderItem .disDetail .disDetailLeft{
    font-weight: bold;
    font-size: 16px;
  }
  .orderMain .orderItem .disDetail .disDetailLeft>span{
    color: #fd9153;
    font-size: 24px;
  }
  .orderMain .orderItem .disDetail .disDetailTime{
    color: #fd9153;
    font-size: 24px;
    font-weight: bold;
  }
  .btns{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .btns .btnsBigx{
    width: 40%;
    height: 80px;
    line-height: 80px;
    background: #747474;
    color: #fff;
    border: none;
    float: left;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
  .btns .btnsSmallx{
    width: 30%;
    height: 80px;
    border: none;
    color: #fff;
    background: #494b5a;
    font-size: 18px;
    font-weight: bold;
  }
  .btnsSmall{
    width: 30%;
    height: 80px;
    border: none;
    color: #fff;
    background: #494b5a;
    font-size: 18px;
    font-weight: bold;
  }
  .btnTwo  .btnsBigs{
    width: 70%;
    height: 80px;
    line-height: 60px;
    background: #fd9153;
    color: #fff;
    border: none;
    float: left;
    font-size: 28px;
    font-weight: bold;
  }
  .addBorder{
    border: 1px solid #fd9153!important;
  }
  .addColor{
    background: #fd9153!important;
  }
</style>

