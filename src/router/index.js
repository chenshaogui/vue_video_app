import Vue from 'vue'
import Router from 'vue-router'
import NetVideo from '@/components/NetVideo'
import Index from '@/components/index'
import VideoList from '@/components/VideoList'
import VideoPlayer from '@/components/VideoPlayer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      component: Index,
      meta: {
        title: 'root',
        keepAlive: true
      }
    },
    {
      path: '/videoList',
      name: 'videoList',
      component: VideoList,
       meta: {
        title: 'videoList',
        keepAlive: true
      }
    },
    {
      path: '/netVideo',
      name: 'netVideo',
      component: NetVideo,
       meta: {
        title: 'netVideo',
        keepAlive: true
      }
    },
    {
      path: '/video',
      name: 'video',
      component: VideoPlayer
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {        
          return savedPosition    
    } else {      
          if (from.meta.keepAlive) {        
               from.meta.savedPosition = document.body.scrollTop;      
          }        
          return { x: 0, y: to.meta.savedPosition || 0 }   
    }  
}
  
})
