<template>
  <div class="report_con">
    <!--数据展示页-->
    <div class="mid_page fullpage-container" v-if="showPage === 1 && reportInfo">
      <div class="fullpage-wp" v-fullpage="opts">
        <div class="mid_item start_page page-1 page" v-if="pageItem === 1">
          <img src="/static/imgs/report/bg_top.png" class="bg_top">
          <img src="/static/imgs/report/bg_foot.png" class="bg_foot">
          <div class="avatar_box"><img :src="reportInfo.student.avatar_url"></div>
          <div class="start_text">
            <p><span>{{reportInfo.student.enname}}</span><br>三周的阅读课已经结束啦~ 感谢你的努力付出！</p>
            <p class="two">我们邀请你搭乘“<span>阅读时光机</span>”，开启属于你自己的VIPX阅读课之旅吧！</p>
          </div>
          <img src="/static/imgs/report/ip.png" class="deer1">
          <img src="/static/imgs/report/ufo.png" class="ufo">
          <a href="javascript:;" class="start_btn" @click="playVoice"></a>
        </div>
        <!--第1页-->
        <div class="mid_item page-2 page" v-if="pageItem===2">
          <img src="/static/imgs/report/bg_top.png" class="bg_top">
          <img src="/static/imgs/report/bg_foot.png" class="bg_foot">
          <div class="mid_txt_box" v-animate="{value: 'bounceInDown'}">
            <div class="head_line"></div>
            <div class="txt_main">
              <div class="txt_box1">
                <p><span>{{reportInfo.start_at | formateDate}}</span></p>
                <p>你和<span>{{reportInfo.first_teacher_name}}</span>在VIPX第一次相遇，一起在书籍的时空穿梭了<span>{{reportInfo.learn_time}}</span>分钟！</p>
              </div>
            </div>
          </div>
          <div class="imgs">
            <img src="/static/imgs/report/ip2.png" class="deer2">
            <img src="/static/imgs/report/star1.png" class="star1">
            <img src="/static/imgs/report/star2.png" class="star2">
            <img src="/static/imgs/report/teacher.png" class="teacher">
          </div>
          <div class="next_arr_box"><img src="/static/imgs/report/next_arr.png?v=1" class="next_arr">上滑进入下一页</div>
        </div>
        <!--第2页-->
        <div class="mid_item page-3 page" v-if="pageItem===2">
          <img src="/static/imgs/report/bg_top.png" class="bg_top">
          <img src="/static/imgs/report/bg_foot.png" class="bg_foot">
          <div class="mid_txt_box" v-animate="{value: 'bounceInDown'}">
            <div class="head_line"></div>
            <div class="txt_main">
              <div class="txt_box1 txt_box2">
                <p>在<span>{{reportInfo.first_teacher_name}}</span>的指引下，你与<span>{{reportInfo.words}}</span>个单词相遇，阅读了<span>{{reportInfo.read_words}}</span>字的文章。与<span>{{reportInfo.read_name}}</span>和<span>{{reportInfo.think_name}}</span>成为好朋友！希望它们在今后的阅读旅程陪你走的更远！</p>
              </div>
            </div>
          </div>
          <img src="/static/imgs/report/lu.png" class="page2_img road" v-animate="{value: 'bounceInLeft'}">
          <img src="/static/imgs/report/ip3.png" class="page2_img deer3" v-animate="{value: 'bounceInRight'}">
          <img src="/static/imgs/report/page2_star.png" class="page2_img page2_star" v-animate="{value: 'rotateIn'}">
          <img src="/static/imgs/report/page2_star2.png" class="page2_img page2_star2" v-animate="{value: 'rotateIn'}">
          <div class="next_arr_box"><img src="/static/imgs/report/next_arr.png?v=1" class="next_arr">上滑进入下一页</div>
        </div>
        <!--第3页-->
        <div class="mid_item page-4 page" v-if="pageItem===2">
          <img src="/static/imgs/report/bg_top.png" class="bg_top">
          <img src="/static/imgs/report/bg_foot.png" class="bg_foot">
          <div class="mid_txt_box" v-animate="{value: 'bounceInDown'}">
            <div class="head_line"></div>
            <div class="txt_main">
              <div class="txt_box1 txt_box3">
                <p><span>{{reportInfo.first_teacher_name}}</span>觉得你棒极了！老师穿过时光隧道，给你发来一条信息：</p>
                <div class="message_box">
                  <p v-html="reportInfo.tags"></p>
                </div>
              </div>
            </div>
          </div>
          <div class="page3_img_box">
            <img src="/static/imgs/report/step.png" class="page3_img step">
            <img src="/static/imgs/report/jinbi.png" class="page3_img jinbi">
            <img src="/static/imgs/report/jinbi2.png" class="page3_img jinbi2">
            <img src="/static/imgs/report/jinbi3.png" class="page3_img jinbi3">
          </div>
          <a href="javascript:;" class="get_report_btn" @click="showPage=3">点击查看你的专属结业证书</a>
        </div>
      </div>
    </div>
    <!--结业证书-->
    <div class="certificate_page" v-if="showPage === 3 && reportInfo">
      <img src="/static/imgs/report/bg_top.png" class="bg_top">
      <img src="/static/imgs/report/bg_foot.png" class="bg_foot">
      <div>
        <div class="certificate_box" ref="imageWrapper">
          <div class="certificate_con">
            <div class="certificate_center">
              <img src="/static/imgs/report/deer.png" class="cer_deer">
              <div class="user_name">
                Dear {{reportInfo.student.enname}},
              </div>
              <div class="cer_txt">
                <p>你是第<span>{{reportInfo.student_id}}</span>位VIPX小学员，欢迎加入VIPX大家庭，与全国<span>1337537</span>位VIPXers一起阅读，看世界！</p>
                <p v-html="reportInfo.complete_comment"></p>
              </div>
              <div class="cer_txt">
                <p>恭喜你在阅读策略课结业啦！</p>
              </div>
              <div class="cer_qrcode_box">
                <img src="/static/imgs/report/qrcode.png">
                <p class="cer_qrcode_txt">扫码关注学而思VIPX</p>
              </div>
              <div class="cer_zhang_txt">{{create_at | formateDate}}<br>全体VIPX外教老师</div>
              <img src="/static/imgs/report/zhang.png" class="cer_zhang">
            </div>
          </div>
        </div>
        <div class="cer_buy_box">
          <img src="/static/imgs/report/buy_btn.png" class="cer_buy_btn" @click="gohome">
          <a href="javascript:;" class="download_btn" @click="toImage">下载结业证书</a>
        </div>
      </div>
    </div>
    <!--没有报告-->
    <div class="showImg" v-if="showImg">
      <div class="showImg_mask"></div>
      <div class="showImg_con">
        <img v-if="dataURL!==''" :src="dataURL">
        <a href="javascript:;" class="showImg_close" @click="showImg=false"></a>
        <div class="showImg_tips"><span>长按保存结业证书到手机</span></div>
      </div>
    </div>
    <audio id="audio" src="/static/imgs/report/time_bgmusic.mp3" autoplay loop="loop"></audio>
  </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';
import axios from '@/utils/http';
import getOrigin from '@/utils/origin';
import { getItem } from '@/utils/localStorage.js';
import html2canvas from 'html2canvas';
import wechatMenu from '@/mixins/wechatMenu.js';
export default {
  name: 'readingReport',
  components: {

  },
  data() {
    return {
      dataURL: '',
      showImg: false,
      showPage: 1,
      pageItem: 1,
      user_id: 0,
      reportInfo: null,
      courseId: 0,
      create_at: '',
      opts: {
        start: 0,
        dir: 'v',
        loop: false,
        duration: 500,
        preventWechat: true,
        beforeChange: function (prev, next) {
          console.log(prev, next);
        },
        afterChange: function (prev, next) {
          console.log(prev, next);
        }
      }
    };
  },
  mixins: [wechatMenu],
  created(){
    const user_id = atob(this.$route.params.userId);
    this.user_id = user_id;
    const courseId = this.$route.query.courseId;
    if(courseId) {
      this.courseId = courseId;
    }
  },
  mounted(){
    this.getReport();
  },
  filters: {
    formateDate(time){
      var arr = time.split('-');
      return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
    }
  },
  methods: {
    playVoice() {
      this.pageItem = 2;
      var myAudio = document.getElementById('audio');
      myAudio.play();
    },
    //生成图片
    toImage() {
      if(this.dataURL!==''){
        this.showImg = true;
      }else{
        html2canvas(this.$refs.imageWrapper,{
            backgroundColor: null
        }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            this.dataURL = dataURL;
            this.showImg = true;
        });
      }
      const url = `${this.apiConfig.host}short_courses/download_picture-log`
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          console.log('sucesse'); 
        }
      })  
    },
    //跳首页
    gohome() {
      this.$router.push({
        name: 'home',
      });
    },
    //获取学习报告
    getReport() {
      let url = `${this.apiConfig.host}short_courses/read_report?student_id=${this.user_id}`;
      if(this.courseId !== 0){
        url += `&course_id=${this.courseId}`;
      }
      axios.get(url).then((res) => {
        if(res.error_code === 0){
          if(res.data){
            this.reportInfo = res.data;
            this.create_at = res.data.created_at.substring(0, 10);
          }else{
            this.$vux.toast.show({
              type: 'text',
              text: '没有该学员报告',
              position: 'middle',
              time: 3000,
              width: '10em',
            })
            return;
          }
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../../styles/basic.less';
@import '../../../styles/readingReport.less';

</style>
