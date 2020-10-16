import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入
import AtComponents from 'at-ui'
import 'at-ui-style' // 引入组件样式
import axios from 'axios'
import {
  getToken
} from './utils/auth'
import dayjs from 'dayjs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$http = axios
Vue.prototype.dayjs = dayjs;

Vue.use(AtComponents)
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router, //挂载
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (getToken()) {
    next()
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next()
    } else {
      next('/login')
    }
  }
})