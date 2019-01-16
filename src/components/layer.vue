<template>
  <div class="mask" v-if="layershow">
    <div class="layermbox">
      <div class="laymshade" :class="{'laymshadeBgNo': type >= 2 ? false : shade}" @click="laymshadeClose"></div>
      <div class="layermmain" :class="layermmain[type]">
        <template v-if="type == 1">
          <div class="section">
            <transition name="fade">
              <div class="layermchild layermPrompts" v-if="layershow">
                <section class="layermcont">
                  <img class="img" :src="imgurl"/>
                  <p class="text">{{content}}</p>
                </section>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        layershow: false, // 是否显示弹出框
        type: 0, // 显示类型
        shade: true, // 蒙层
        shadeClose: false, // 蒙层是否点击隐藏
        // imgurl: require('@/common/image/error.png'), // 默认类型是1的 图标
        imgurl: "", // 默认类型是1的 图标
        content: '全力加载中',  // 默认内容
        button: ['确定'], // 默认按钮
        time: 20, // 倒计时隐藏时间
        callback: '', // 是否回调-type大于1
        no: '', // 点击确认按钮回调
        yes: '' // 点击取消按钮回调
      }
    },
    created () {
      this.layermmain = ['layermmain0', 'layermmain1', 'layermmain2']
      this.imgurl_ = ['error', 'success', 'collection']
    },
    methods: {
      open (opt) {
        this.close()
        if (opt) {
          // console.log(opt)
          let cloneObj = JSON.parse(JSON.stringify(this.$data))
          for (var key in opt) {
            this.$data[key] = opt[key]
          }
          if (opt.imgurl) {
            // this.$data['imgurl'] = require('@/common/image/' + opt.imgurl)
          }
          this.layershow = true
          if (this.time && this.type === 1) {
            setTimeout(() => {
              this.close()
              this.callback && this.callback()
            }, this.time * 1000)
            return false
          }
        }
        this.callback && this.callback()
      },
      sure (index) {
        if (this.button.length > 1) {
          if (index === 0) {
            this.yes && this.yes()
          } else {
            this.no && this.no()
          }
          return false
        }
        this.no && this.no()
        this.close()
      },
      close () {
        this.layershow = false
        this.type = 0
        this.shade = true
        this.shadeClose = false
        // this.imgurl = require('@/common/image/error.png')
        this.imgurl =""
        this.content = '全力加载中'
        this.button = ['确定']
      },
      laymshadeClose () {
        this.shadeClose && this.close()
      }
    }
  }
</script>
<style scoped>
  .layermcont{
    font-size: 0.85rem;
    display: block;
    width: 150px;
    text-align: center;
    height: 70px;
    line-height: 70px;
    position: fixed;
    top: 40%;
    left: 30%;
    min-height: 5rem;
    box-sizing: border-box;
    background: rgba(0,0,0,0.3);
    color: #fff;
    font-size: 18px;
    border-radius: 6px;
  }
</style>

