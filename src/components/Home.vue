<template id="contact">
  <div class="container indexCon">
    <div class="topBox">
      首页
    </div>
    <div class="indexMain">
      <div class="cartNum">
        <img src="../assets/icon_bigyellowcar.png">
        <span>{{cartNum}}</span>
      </div>
      <div class="orderNum">
        <div class="orderNumLeft">
          <div>{{todayOrder}}</div>
          <p>今日接单</p>
        </div>
        <div class="orderNumRight">
          <div>{{yesterdayOrder}}</div>
          <p>昨日接单</p>
        </div>
      </div>
      <div class="orderTotle">
        <div>{{totalOrder}}</div>
        <p>总接单数</p>
      </div>
    </div>
    <div class="btns">
      <button class="btnsBigS" @click="tapWorking()">上班</button>
      <button class="btnsSmallS" @click="tapOrderList()">接单<br/>记录</button>
    </div>
    <layer ref="layer"></layer>
  </div>
</template>
<script>
  import layer from "../components/layer"
  export default {
  //注册组件
  components: {
    layer
  },
  name: 'Home',
  data () {
    return {
      cartNum:"",
      todayOrder:"",
      yesterdayOrder:"",
      totalOrder:"",
      locaTimer:null,
      lng:"",
      lat:"",
      routerParams:"",
    }
  },
  created() {
    console.log("this.isError",this.isError);
    //如果imei未在后台设置，跳转设备禁用页面
    if(this.isError){
      this.$router.push({name:"error"});
      return false;
    }
    this.getUserInfo();
    this.getIndexOrder();
  },
  mounted () {
    var that = this;
    let layer = this.$refs.layer;
    that.ws.onmessage = function(evt)
    {
      let data = JSON.parse(evt.data);
      console.log("data:"+JSON.stringify(data));
      if(data.status_code == 200)
      {
        switch (data.action) {
          case 'active' :
            //实时显示位置
            that.tapWorkingIsClick = false;
            layer.close();

            that.setLocation();
            that.$router.push({name:"working"});
            break;
        }
      }
      else if (data.status_code == 422){
        switch (data.action) {
          case 'active' :
            layer.open({
              type: 1,
              content: 'active Error',  // 内容
              time: 3, // 几秒后自动关闭 默认 2
              callback () {  // 几秒后自动关闭 回掉
                console.log('弹框消失')
              }
            })
            break;
        }
      }
      else{
        layer.open({
          type: 1,
          content: '系统错误'+data.status_code,  // 内容
          time: 3, // 几秒后自动关闭 默认 2
          callback () {  // 几秒后自动关闭 回掉
            console.log('弹框消失')
          }
        })
      }
    };
    //获取手机坐标,用于发送上班请求
    that.coordinate();

  },
  methods:{
    //上班
    tapWorking:function () {
      let layer = this.$refs.layer;
      var that = this;

      if(!that.tapWorkingIsClick){
        that.tapWorkingIsClick = true;

        if(that.wsStatus == true)
        {
          layer.open({
            type: 1,
            content: '加载中...',
          });
        }
        else
        {
          layer.open({
              type: 1,
              content: '加载中...',  // 内容
              time: 1, // 几秒后自动关闭 默认 2
              callback () {  // 几秒后自动关闭 回掉
                that.tapWorkingIsClick = false;
                console.log("几秒后自动关闭 回掉,可以点击上班");
              }
            })
        }
        if(window.localStorage.getItem("lat")!=null && window.localStorage.getItem("lng")!=null){
          // 发送上班请求
          that.wsSeed({
            "action":"active",
            "data":{
              "lat":window.localStorage.getItem("lat"),
              "lng":window.localStorage.getItem("lng")
            }
          });
        }else{
          layer.open({
            type: 1,
            content: '正在定位中，请稍后重试',  // 内容
            time: 3, // 几秒后自动关闭 默认 2
            callback () {  // 几秒后自动关闭 回掉
              that.tapWorkingIsClick = false;
              console.log("几秒后自动关闭 回掉,可以点击上班");
            }
          })
        }


      }

    },
    //获取用户信息
    getUserInfo:function(){
      var that = this;
      this.$httpGet("/drivers/me",{},function (data) {
        if(data.data!=null && data.data!=""){
          that.cartNum = data.data.cart_number;
        }
      });
    },
    //获取首页统计订单
    getIndexOrder:function (){
      var that = this;
      this.$httpGet("/index/stats",{},function (data) {
        if(data.data!=null && data.data!=""){
          that.todayOrder = data.data.today_order_count;
          that.yesterdayOrder = data.data.yesterday_order_count;
          that.totalOrder = data.data.order_count;
        }
      });
    },
    //点击接单记录
    tapOrderList:function () {
      var that = this;
      that.$router.push({name:'orderList',params:{pageFrom:"home"}});
    },
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
  }
  .container .topBox{
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
    font-weight: bold;
    font-size: 24px;
  }
  .container .indexMain{
    padding: 0 20px;
  }
  .container .indexMain .cartNum{
    border-bottom: 1px solid #ebebeb;
    padding: 13px 0 15px;
  }
  .container .indexMain .cartNum>span{
    padding: 3px 21px;
    border: 1px solid #494b5a;
    border-radius: 5px;
    font-size: 16px;
    float: right;
    margin-top: 5px;
    font-weight: bolder;
  }

  .container .indexMain .orderNum{
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid #ebebeb;
  }
  .container .indexMain .orderNum .orderNumLeft{
    text-align: left;
    width: 50%;
    border-right: 1px solid #ebebeb;
  }
  .container .indexMain .orderNum .orderNumLeft>div,.container .indexMain .orderNum .orderNumRight>div,.container .indexMain .orderTotle>div{
    color: #fd9153;
    font-size: 34px;
    font-weight: bold;
  }
  .container .indexMain .orderNum .orderNumLeft>p,.container .indexMain .orderNum .orderNumRight>p,.container .indexMain .orderTotle>p{
    color: #494b5a;
    font-size: 18px;
  }
  .container .indexMain .orderNum .orderNumRight{
    text-align: right;
    width: 50%;
  }
  .container .indexMain .orderTotle{
    text-align: center;
    padding-top: 10px;
  }
  .btns{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .btns .btnsBigS{
    width: 70%;
    height: 80px;
    line-height: 80px;
    background: #fd9153;
    color: #fff;
    border: none;
    float: left;
    font-size: 28px;
    font-weight: bold;
  }
  .btns .btnsSmallS{
    width: 30%;
    height: 80px;
    border: none;
    color: #fff;
    background: #494b5a;
    font-size: 18px;
    font-weight: bold;
  }
</style>
