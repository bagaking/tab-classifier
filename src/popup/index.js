import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { IDB } from '../utils/idb'

Vue.use(ElementUI);
Vue.prototype.$db = new IDB()

new Vue({
  el: '#app',
  render: h => h(App)
})
