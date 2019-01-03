<template>
  <div class="container">
    <div class="topBox">
      <img src="../assets/icon_backtop.png" class="backPag" @click="backPage">
      未接到乘客
    </div>
    <div class="causeList">
      <div class="listHead">
        请选择一个未接到乘客的原因:
      </div>
      <ul>
        <li v-for="(item,i) in reasonArr" @click="tapReaItem(item,i)" v-bind:class="{activeCause:i==current}">{{item.title}}</li>
      </ul>
    </div>
    <div class="btns">
      <button class="btnsBigMore" v-bind:class="{addBage:selected}" @click="subRea" ref="addBage">提交</button>
    </div>
    <layer ref="layer"></layer>
  </div>
</template>

<script>
  import layer from "../components/layer"
    export default {
        name: "notReceive",
      //注册组件
      components: {
        layer
      },
        data(){
          return{
            current:-1,
            selected:false,
            reaItem:"",
            reasonArr:[
              {"title":"乘客行程有变，不需用车"},
              {"title":"未找到乘客上车地点"},
              {"title":"车辆故障或意外，无法到达"},
              {"title":"与乘客商量，一致取消行程"}
            ]
          }
        },
      mounted:function(){
        var that = this;
        let layer = this.$refs.layer;
        that.ws.onmessage = function(evt)
        {
          let data = JSON.parse(evt.data);
          console.log("receiver:",data);
          if(data.status_code == 200)
          {
            switch (data.action) {
              //提交未接到原因订单
              case 'driverCancel' :
                that.$router.push({name:"working"});
                break;
            }
          }
          else if (data.status_code == 422){
            switch (data.action) {
              case 'driverCancel' :
                layer.open({
                  type: 1,
                  content: 'driverCancel Error',  // 内容
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
        tapReaItem:function(item,i){
          var that = this;
          that.current = i;
          that.selected = true;
          that.reaItem = item.title;
        },
        //提交
        subRea:function(){
          var that = this;
          var orderInfo = JSON.parse(window.localStorage.getItem("orderInfo"));
          var order_id = orderInfo.order.id;
          if(that.$refs.addBage.className.indexOf("addBage")!=-1){
            that.wsSeed({
              "action":"driverCancel",
              "data":{
                "close_reason":that.reaItem,
                "order_id":order_id
              }
            });
          }else{
            let layer = this.$refs.layer;
            layer.open({
              type: 1,
              content: '请先选择取消原因',  // 内容
              time: 3, // 几秒后自动关闭 默认 2
              callback () {  // 几秒后自动关闭 回掉
                console.log('弹框消失')
              }
            })
          }
        },
        //返回上一页
        backPage:function () {
          this.$router.push({name:"receivers"});
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
    font-size: 16px;
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
  .causeList{
    margin-top: 61px;
  }
  .causeList .listHead{
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 17px;
    font-weight: bold;
    border-bottom: 1px solid #ebebeb;
  }
  .causeList ul{
    margin: 0;
    padding-left: 30px;
  }
  .causeList ul li{
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #ebebeb;
    list-style: none;
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
    height: 80px;
    line-height: 80px;
    background: #a4a4a4;
    color: #fff;
    border: none;
    float: left;
    font-size: 30px;
    font-weight: bold;
  }
  .activeCause{
    color: #fd9153!important;
  }
  .addBage{
    background: #fd9153!important;
  }
</style>
