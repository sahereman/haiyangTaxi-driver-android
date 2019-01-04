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
      locaTimer:""
    }
  },
  created() {
    console.log("this.isError",this.isError);
    //如果imei未在后台设置，跳转设备禁用页面
    if(this.isError){
      this.$router.push({name:"error"});
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
      console.log(data);
      if(data.status_code == 200)
      {
        switch (data.action) {
          case 'active' :
            //实时显示位置
            // that.setLocation();
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

    this.coordinate();


  },
  methods:{
    //上班
    tapWorking:function () {
      var that = this;
      // //发送上班请求
      that.wsSeed({
        "action":"active",
        "data":{
          "lat":"36.092484",
          "lng":"120.380966"
        }
      });
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
    /**用腾讯获取坐标**/
    coordinate:function (){
    var geolocation = new qq.maps.Geolocation("ETBBZ-TOMRF-MTPJB-NWRP2-BAGU5-D6FV5", "海阳出租车-司机端");
    var options = {timeout: 8000};
    geolocation.getLocation(that.sucCallback, that.showErr, options);
  },

  //定位成功回调
    sucCallback:function (position){
    var mapInfo = JSON.stringify(position, null, 4);
    var jsonMapInfo = eval('('+mapInfo+')');
    alert("腾讯经度为:"+jsonMapInfo.lng+",腾讯纬度为:"+jsonMapInfo.lat);
    // init();
    // var latLng = new qq.maps.LatLng(jsonMapInfo.lat, jsonMapInfo.lng);
    // citylocation.searchCityByLatLng(latLng);
  },

  //定位失败回调
    showErr:function (position){
    alert("定位失败"+JSON.stringify(position));
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
