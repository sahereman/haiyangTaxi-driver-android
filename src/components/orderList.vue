<template id="contact">
  <div class="container">
    <div class="topBox">
      <img src="../assets/icon_backtop.png"  @click="backPag">
      接单记录
    </div>
    <div class="tabBtn">
      <div class="todayOrder  active" @click="tapToday" ref="todayOrder">今日</div>
      <div class="yesterdayOrder" @click="tapYesterday" ref="yesterdayOrder">昨日</div>
      <div class="monthOrder" @click="tapMonth" ref="monthOrder">近一月</div>
    </div>
    <div class="tabCon" ref="tabCon">
      <pull-to  class="file-lists" :bottom-load-method="loading">
        <div class="tabItem" v-for="(items,i) in orderList">
          <div class="tabItemOne">
            <img src="../assets/icon_time@2x.png"/>
            <span>{{items.createdAt}}</span>
            <span class="orderStateDone">{{items.statusText}}</span>
          </div>
          <div class="tabItemTwo">
            <span class="mustG"></span>
            <span>{{items.fromAddress}}</span>
          </div>
          <div class="tabItemThre">
            <span class="mustR"></span>
            <span>{{items.toAddress}}</span>
          </div>
        </div>
        <div v-show="showDone" class="notMore">没有更多</div>
        <div v-show="notOrder" class="notMore">暂时没有订单</div>
      </pull-to>
    </div>
    <!--<loading :text="loadText" v-model="ajaxIsLoading"></loading>-->
  </div>
</template>

<script>
  import PullTo from 'vue-pull-to'
export default {
  'name': 'contact',
  data(){
    return{
      url:"https://taxi.shangheweiman.com/api/driver/orders",
      routerParams:"",
      orderList:[],
      showDone:false,
      // ajaxIsLoading:false,
      // loadText:"加载中...",
      nextLink:null,
      notOrder:false
    }
  },
  created() {
    
  },
  //注册组件
  components: {
    PullTo
  },
  mounted(){
    var that = this;
    // 取到路由带过来的参数,从而判断返回哪个页面
    that.routerParams  =  that.$route.params.pageFrom;
    that.getOrder(that.url,"today");
  },
  methods:{
    //返回上一页面
    backPag:function () {
      var that = this;
      if(that.routerParams == "working"){
        that.$router.push({name:"working"});
      }else {
        that.$router.push({name:"Home"});
      }
    },
    tapToday:function(){
      var that = this;
      that.$refs.todayOrder.className = "active";
      that.$refs.yesterdayOrder.className = "";
      that.$refs.monthOrder.className = "";
      that.orderList=[];
      that.getOrder(that.url,"today");
    },
    tapYesterday:function(){
      var that = this;
      that.$refs.todayOrder.className = "";
      that.$refs.yesterdayOrder.className = "active";
      that.$refs.monthOrder.className = "";
      that.orderList=[];
      that.getOrder(that.url,"yesterday");
    },
    tapMonth:function(){
      var that = this;
      that.$refs.todayOrder.className = "";
      that.$refs.yesterdayOrder.className = "";
      that.$refs.monthOrder.className = "active";
      that.orderList=[];
      that.getOrder(that.url,"month");
    },
    //获取订单数据
    getOrder:function (url,time) {
        var that = this;
        that.showDone = false;
        that.$httpGetUrl(url,{date:time},function (data) {
        var orderArr = data.data.data;
        if(data.data.data!=null && data.data.data!=""){
          for(var i = 0;i<orderArr.length;i++){
            var created_at = orderArr[i].created_at;
            var from_address = orderArr[i].from_address;
            var to_address = orderArr[i].to_address;
            var status_text = orderArr[i].status_text;
            that.orderList.push({"createdAt":created_at,"fromAddress":from_address,"toAddress":to_address,"statusText":status_text});
          }
          if(data.data.meta.pagination.links != null){
            var nextLink = data.data.meta.pagination.links.next;
          }else{
            var nextLink = null;
          }
          if (nextLink!=null) {
            that.nextLink=nextLink
          }else{
            that.nextLink=null
          }
        }else {
          that.showDone = true;
        }
      });
    },
    loading:function (loaded) {
      var that = this;
      if(that.nextLink != null){
        that.getOrder(that.nextLink);
      }else{
        that.showDone = true;
      }
      loaded('done')
    },
  }
}
</script>
<style scoped>
  .container{
    width: 100%;
    font-size: 16px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0;
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
  .tabBtn{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 19;
  }
  .tabBtn>div{
    width: 33%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #a4a4a4;
    border-bottom: 2px solid #ebebeb;
  }
  .tabBtn .active{
    color: #fd985e;
    border-bottom: 3px solid #fd9153;
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
  .tabCon .tabItem  .orderState{
    padding: 3px;
    background: #a4a4a4;
    color: #fff;
    border-radius: 2px;
  }
  .tabCon .tabItem  .orderStateDone{
    padding: 3px;
    color: #a4a4a4;
    border: 1px solid #a4a4a4;
    border-radius: 2px;
  }
  .tabCon .tabItem .tabItemOne>span:nth-child(3){
    margin-left: 40px;
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
  }
  .notMore{
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
</style>


