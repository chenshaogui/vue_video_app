// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);

import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'; 

import VueResource from 'vue-resource';
Vue.use(VueResource);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
