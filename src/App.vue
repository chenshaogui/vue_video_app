<template>
<div id="app">
    <div class="content-div">
       <keep-alive>      
      <router-view v-if="$route.meta.keepAlive"/>
       </keep-alive> 
       <router-view v-if="!$route.meta.keepAlive"/>
    </div>
    <footer-bar class="footer"></footer-bar>
  </div>
</template>

<script>
import Index from './components/index'
import Footer from './components/FooterBar.vue'
export default {
  name: 'App',
  data(){
      return {
       }
  },
  created() {
    },
  methods: {
  },
  mounted(){
  },
  components: {
    'app-index':Index,
    'footer-bar':Footer
  }


}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  background-color: #efefef;
  min-height: 100%;
}
body{
  margin:0px
}
</style>
<style scoped>
  .content-div {
    margin-bottom: 55px;
  }
  
</style>
