import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { IDB } from '../utils/idb'
import { Kits } from '../utils/kits'
import { TabLst } from '../logic/tabLst'

Vue.use(ElementUI);
 
Vue.prototype.$idb = new IDB()
Vue.prototype.$kits = new Kits()
Vue.prototype.$tl = new TabLst()
Vue.prototype.$chrome = chrome

new Vue({
  el: '#app',
  render: h => h(App)
})
