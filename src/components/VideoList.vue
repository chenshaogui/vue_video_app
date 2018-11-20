<template>
  <div id="video">
    <mt-header fixed title="视频浏览">
     <mt-button style="margin-right: 150px;" icon="mint-toast-icon mintui mintui-search" size="large" slot="right" @click.native="query()">
     搜索
     </mt-button>
    </mt-header>
    <mt-popup
    v-model="popupVisible"
    position="center"
    :modal=false>
    <mt-cell title="本地播放" @click.native='openVideo'></mt-cell>
    <mt-cell title="插件播放" @click.native='createVideoPlayer'></mt-cell>
    <mt-cell title="直播流播放" @click.native='createLivePusher'></mt-cell>
  </mt-popup>
  <div class="page-search" style="height: 50px;">
    <mt-search v-model="value" placeholder="搜索" style="height: 100%;">
      <!-- <i class="mint-toast-icon mintui mintui-search"></i> -->
    </mt-search>
  </div>
  <div id="loadmore">
      <mt-loadmore 
        :top-method="loadTop"
                   :bottom-all-loaded="bottomAllLoaded"
                   :auto-fill="false"
                   @bottom-status-change="handleBottomChange"
                   @top-status-change="handleTopChange"
                   :bottom-method="loadBottom" ref="loadmore">

        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus === 'loading'">
            数据加载中<i class="fa fa-spinner fa-pulse"></i>
          </span>
          <span v-show="topStatus === 'drop'">我在加载数据</span>
          <span v-show="topStatus === 'pull'">下拉我就更新给你看</span>
        </div>
        <div slot="bottom" class="mint-loadmore-bottom" v-show="!bottomAllLoaded">
          <span v-show="bottomStatus === 'drop'">释放更新</span>
          <span v-show="bottomStatus === 'pull'">上拉加载更多</span>
          <span v-show="bottomStatus === 'loading'">
            数据加载中<i class="fa fa-spinner fa-pulse"></i>
          </span>
        </div>  
     <el-row :gutter="0" style="background-color: white;">
      <el-col :span="12" v-for="(item,index) in historylist" :key="index">
       <el-card :body-style="{ padding: '0px'}" >
           <img :src=item.img class="image" @click="openVideo(item.videoUrl,item.img)" onerror="javascript:this.src='http://192.168.0.113:8082/video/static/img/baseimg.jpg'">
            <div style="padding: 14px;" @click="openVideo(item.videoUrl,item.img)">
              <span class="pname">{{item.name}}</span>
              <div class="bottom">
                <el-button type="text" class="button">播放</el-button>
              </div>
            </div>
        </el-card>
      </el-col>
    </el-row>
          </mt-loadmore> 

    </div>
  </div>
</template>
<style lang="scss">
  #loadmore {
  position: absolute;
    left:0;
    top:0;
    width:auto;
    height:100%;
    overflow:auto;
    padding-top: 6rem;
    box-sizing:border-box;
    padding-bottom: 3.0rem;
    -webkit-overflow-scrolling: touch
  }
  .el-col {
    border-radius: 4px;
    padding: 0.2em;
    width: 11rem;
    height:18.4rem;
    text-align: center;
  }
  .time {
    font-size: 13px;
    color: #999;
    white-space: nowrap; //文本强制不换行；
    text-overflow:ellipsis; //文本溢出显示省略号；
    overflow:hidden; //溢出的部分隐藏
    display: block;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    text-align: center;
  }
  .image {
    width: 160px;
    height:150px;
    display: block;
    margin-left: 5px;
  }
  .pname{
    font-size: 13px;
    color: #999;
    white-space: nowrap; //文本强制不换行；
    text-overflow:ellipsis; //文本溢出显示省略号；
    overflow:hidden; //溢出的部分隐藏
    display: block;
  }
</style>
<script>
  import {Toast} from 'mint-ui'
  import { videoPlayer } from 'vue-video-player';
  import $ from 'jquery';

  export default {
    data(){
      return {
        bottomAllLoaded: false,
        topStatus: '',
        bottomStatus:'',
        list: [],
        currentDate: new Date(),
        historylist : [],
        allLoaded: false,//若为真，loadmore 会自动检测并撑满其容器
        currentpageNum: 1,//当前页数
        limit: 10,//每页条数
        totalNum: null,//总数
        bottomStatus: '',
        scroll:0,
        value:'',
        popupVisible:false,
        url:'',
        img:'',

      }
    },
    methods: {
      govideo(url,img){
        this.popupVisible = true;
        this.url=url;
        this.img=img;
        //this.$router.push({name:'video',params:{url:url,img:img}});
          },
      loadTop(){
        setTimeout(() => {
                if (this.currentpageNum > 0 && this.currentpageNum!=1) {
                    //alert(this.totalNum - this.currentpageNum * this.limit)
                     this.currentpageNum--;
                    var that=this;
                    $.ajax({
                          url:'http://192.168.0.113:8082/video/api/findByPage',
                          type:'GET', //GET、PUT、DELETE
                          async:false,    //是否异步
                          data:{pageSize:that.limit,pageNow:that.currentpageNum,value:that.value},
                          timeout:5000,    //超时时间
                          dataType:'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
                          jsonp:'callback',
                          crossDomain: true,
                          beforeSend:function(xhr){
                              // 发送前处理
                          },
                          success:function(data,textStatus,jqXHR){
                              // 调用成功，解析response中的data到自定义的data中
                              //that.historylist=[];
                              //data.data.forEach(function(a,i){
                              //that.historylist.pop(a);
                              //})
                              that.historylist=data.data;  
                          },
                          error:function(xhr,textStatus){
                              // 调用时，发生错误
                              console.log(textStatus)
                          },
                          complete:function(){
                              // 交互后处理
                          }
                      })
                } else {
                    this.topAllLoaded = true;
                }
                this.$refs.loadmore.onTopLoaded();

            }, 1500);
       
      },

      loadBottom(){
        setTimeout(() => {
                if (this.totalNum - this.currentpageNum * this.limit > 0) {
                    //alert(this.totalNum - this.currentpageNum * this.limit)
                    this.currentpageNum++;
                    var that=this;
                    $.ajax({
                          url:'http://192.168.0.113:8082/video/api/findByPage',
                          type:'GET', //GET、PUT、DELETE
                          async:false,    //是否异步
                          data:{pageSize:that.limit,pageNow:that.currentpageNum,value:that.value},
                          timeout:5000,    //超时时间
                          dataType:'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
                          jsonp:'callback',
                          crossDomain: true,
                          beforeSend:function(xhr){
                              // 发送前处理
                          },
                          success:function(data,textStatus,jqXHR){
                              // 调用成功，解析response中的data到自定义的data中
                              that.historylist=[];
                              data.data.forEach(function(a,i){
                              that.historylist.push(a);
                              })
                              //that.historylist=data.data;  
                          },
                          error:function(xhr,textStatus){
                              // 调用时，发生错误
                              console.log(textStatus)
                          },
                          complete:function(){
                              // 交互后处理
                          }
                      })
                } else {
                    this.bottomAllLoaded = true;

                }
                this.$refs.loadmore.onBottomLoaded();

            }, 1500);

        },

      handleTopChange(status){
        this.topStatus = status;
        },

      handleBottomChange(status) {
        this.bottomStatus = status;
       },

      query(){
        this.currentpageNum=1;
        this.comInitData();
      },

      handelscroll() {
       this.scroll  = document.body.scrollTop || document.documentElement.scrollTop
       console.log(this.scroll)
      },
      comInitData: function() { 
        var that=this;
        $.ajax({
              url:'http://192.168.0.113:8082/video/api/findByPage',
              type:'GET', //GET、PUT、DELETE
              async:false,    //是否异步
              data:{pageSize:that.limit,pageNow:that.currentpageNum,value:that.value},
              timeout:5000,    //超时时间
              dataType:'jsonp',    //返回的数据格式：json/xml/html/script/jsonp/text
              jsonp:'callback',
              crossDomain: true,
              beforeSend:function(xhr){
                  // 发送前处理
              },
              success:function(data,textStatus,jqXHR){
                //console.log(data)
                  // 调用成功，解析response中的data到自定义的data中
                 // data.data.forEach(function(a,i){
                 // var data={}
                  //data.source=a;
                  //that.historylist.push(data);
                //  })
                  that.historylist=data.data;
                  that.totalNum = data.page.totalCount;
                  console.log(that.historylist)  
              },
              error:function(xhr,textStatus){
                  // 调用时，发生错误
                  console.log(textStatus+'ajax')
              },
              complete:function(){
                  // 交互后处理
              }
          })
      },
      getURL(url) {  
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");  
        xmlhttp.open("GET", url, false);  
        xmlhttp.send();  
        if (xmlhttp.readyState == 4) {  
            if (xmlhttp.Status != 200)  
                alert("不存在");  
            return xmlhttp.Status == 200;  
        }  
        return false;  
      },
      openVideo(urls,img) {
        var htmlUrl=$.trim(urls);
        var Intent = plus.android.importClass("android.content.Intent");
        var Uri = plus.android.importClass("android.net.Uri");
        var main = plus.android.runtimeMainActivity();
        var intent=new Intent(Intent.ACTION_VIEW);
        var uri=Uri.parse(htmlUrl);
        intent.setDataAndType(uri,"video/*");
        main.startActivity(intent);
      },
      createVideoPlayer() {
            var videoUrl=this.url;
            var player = plus.video.createVideoPlayer('videoplayer', {
            src:videoUrl,
            top:'100px',
            left:'0px',
            width: '100%',
            height: '200px',
            position: 'static'
          });
          plus.webview.currentWebview().append(player);
      },
      createLivePusher() {
            var videoUrl=this.url;
            var pusher = plus.video.createLivePusher('livepusher', {
            url:videoUrl,
            top:'100px',
            left:'0px',
            width: '100%',
            height: '300px',
            position: 'static'
          });
          plus.webview.currentWebview().append(pusher);
      }


    },
    mounted(){
      this.comInitData();
      window.addEventListener('scroll', this.handelscroll());
      //this.getURL('http://192.168.0.113:8082/load/2.jpg');
    },
    created(){
      //this.comInitData();
      let _footer = this.$store.state.footerVisible;
      if (!_footer) {
        this.$store.commit('TOGGLE_FOOTER');
      }
    },
    deactivated (){
      window.removeEventListener('scroll', this.handlescroll);
    },
    activated () {
    //var set=$('#loadmore').scrollTop();
     //console.log($('#loadmore').scrollTop)
      if(this.scroll > 0){
       window.scrollTo(0, this.scroll);
       this.scroll = 0;
       window.addEventListener('scroll', this.handlescroll);
      }
    }
  }
</script>