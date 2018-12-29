import Vue from 'vue'
import Router from 'vue-router'
import working from '@/components/working'
import Home from '@/components/Home'
import orderList from '@/components/orderList'
import receivers from '@/components/receivers'
import deliver from '@/components/deliver'
import notReceive from '@/components/notReceive'
import error from '@/components/error'
import cancelTrip from '@/components/cancelTrip'

import 'bootstrap/dist/css/bootstrap.css'

Vue.use(Router)//使用路由依赖

//定义路由
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/working',
      name: 'working',
      component: working
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/receivers',
      name: 'receivers',
      component: receivers
    },
    {
      path: '/deliver',
      name: 'deliver',
      component: deliver
    },
    {
      path: '/notReceive',
      name: 'notReceive',
      component: notReceive
    },
    {
      path: '/error',
      name: 'error',
      component: error
    },
    {
      path: '/cancelTrip',
      name: 'cancelTrip',
      component: cancelTrip
    }
  ]
})
