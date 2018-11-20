<template>
  <div id="content">
    <mt-header fixed title="视频浏览">
     <router-link to="$router.back(-1)" slot="left">
        <mt-button icon="back" @click="goback()">返回</mt-button>
      </router-link>
    </mt-header>
   <div class="custom-video-outer-box">  
      <video-player  class="video-player-box"  
                 ref="videoPlayer"  
                 :options="playerOptions"  
                 :playsinline="true"  
                 customEventName="customstatechangedeventname"  
                 @play="onPlayerPlay($event)"  
                 @pause="onPlayerPause($event)"  
                 @ended="onPlayerEnded($event)"  
                 @waiting="onPlayerWaiting($event)"  
                 @playing="onPlayerPlaying($event)"  
                 @loadeddata="onPlayerLoadeddata($event)"     
                 @timeupdate="onPlayerTimeupdate($event)"  
                 @statechanged="playerStateChanged($event)"  
                 @ready="playerReadied"  
                 >  
       </video-player>  
       </div>  
  </div>
</template>
<style lang="scss">
  .content {
    margin-top: 40px;
    height: auto;
    background-color: #efefef;
    min-height: 100%;
  }
   .video-player-box{  
        height: 100% !important;  
        width: 100% !important;  
    }  
    //底部进度条  
    .bottomCtrl{  
        line-height: 60px;  
        height: 60px;  
        overflow: visible;  
        position: absolute;  
        bottom: 0;  
        left: 0;  
        background-color: rgba(45, 45, 45, .92);  
        width: 100%;  
        padding: 0 50px;  
        color: #fff;  
        z-index: 999999999999999;  
  
        .icon{  
            font-size: 16px;  
            line-height: 60px;  
            cursor: pointer;  
        }  
  
        .icon+.icon{  
            margin-left: 20px;  
        }  
    }  
    .custom-video-outer-box{  
        position: relative;  
        height: 100%;  
        width: 100%;  
    }  
    .progress-slider{  
        position: absolute;  
        width: 100%;  
        top: 0;  
        left: 0;  
        height: 18px;  
        line-height: 18px;  
        .ivu-slider-wrap{  
            margin: 0 !important;  
            border-radius: 0 !important;  
        }  
        .ivu-slider-button-wrap{  
             line-height: normal !important;  
        }  
        .ivu-slider-button{  
            height: 8px !important;  
            width: 8px !important;  
             
        }  
    }  
    .voice-box{  
        .voice-slider{  
            width: 100px;  
            margin-left: 20px;  
        }  
        .ivu-slider-wrap{  
            margin: 27px 0 !important;  
        }  
  
    }  
    .time{  
        margin-left: 25px;  
    }  
    .full-screen{  
       margin-left: 25px;  
        line-height: 60px;  
    }  
    
    .ivu-progress-outer{  
        padding: 0 10px !important;  
    }  
      
    .vjs-big-play-button{  
        height: 80px !important;  
        width: 80px !important;  
        line-height: 80px !important;  
        text-align: center;  
        background:rgba(0, 0, 0, 0.8) !important;  
        border-radius: 50% !important;  
        top: 50% !important;  
        left: 50% !important;  
        margin-left: -40px !important;  
        margin-top: -40px !important;  
    }  
    #vjs_video_3{  
        max-height: 100% !important;  
        width: 100% !important;  
        height: 100% !important;  
    }  
    .video-player-box>div{  
        height: 100% !important;  
        width: 100% !important;  
    }  
    .video-js .vjs-big-play-button{  
        font-size: 5em !important;  
    }  
    video{  
        max-height: 100% !important;  
  
    }  
</style>
<script>
  import { videoPlayer } from 'vue-video-player';
  import $ from 'jquery';

  export default {
    data(){
      return {
        muted:false,//开始声音
        playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",
          src: this.$route.params.url //你的m3u8地址（必填）
        },{
          type:"video/webm",
          src: this.$route.params.url
        },
        {
          type: "video/3gp",
          src: this.$route.params.url
        },
        {
          type: "video/ogg",
          src: this.$route.params.url
        },
        {
          type: "application/x-mpegURL",
          src: this.$route.params.url
        },{
          type: 'video/x-flv',
          src: this.$route.params.url
        }],
        poster: this.$route.params.img, //你的封面地址
        //techOrder: ['flash'],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
      }
    },
    methods: {
        // 播放  
         play(){  
             this.player.play();  
         },  
         // 暂停  
         onPlayerPause(){  
              this.player.pause();  
         },  
         //下一曲  
         nextClick(){  
             console.log("自定义","下一曲点击");  
              
         },  
         goback(){
              window.history.back()
         },
         //全屏  
         fullScreenHandle(){  
             console.log("全屏");  
             if(!this.player.isFullscreen()){  
                 this.player.requestFullscreen();  
                 this.player.isFullscreen(true);  
             }else{  
                  this.player.exitFullscreen();  
                  this.player.isFullscreen(false);  
             }  
         },
         onPlayerTimeupdate(player){  
               //this.playerCtrl.currentTime=timeUtil.secondToDate(player.currentTime());  
               //this.playerCtrl.currentTimeInt=Math.floor(player.currentTime());  
               //console.log("当前音量",player.volume());  
         },
        progressChange(val){  
             //this.player.currentTime(val);  
             //this.playerCtrl.currentTimeInt=val;  
             //this.playerCtrl.currentTime=timeUtil.secondToDate(val);  
         },
         // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerEnded(player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        // seek to 10s
        //console.log('example player 1 readied', player)
        //player.currentTime(10)
        // console.log('example 01: the player is readied', player)
      } 
    },
    mounted(){
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    created(){
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
    }
  }
</script>
