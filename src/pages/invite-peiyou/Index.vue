<template>
<div>
  <div class="py-invite"
    :class="{'v1': version == 'v1', 'v2': version == 'v2', 'v3': version == 'v3', 'noscroll': dialogCurrent != -1}"
    :style="{'--colorPrincipal': colorPrincipal}">
    <div class="summary">
      学不会、听不懂、不敢说、不自信……<br>
      孩子们的英语学习问题，<br>
      家长们也有心无力？<br>
      其实，学好英语重在方法。<br>
      而第一步——<br>
      正确评估孩子的英语水平至关重要。
    </div>
    <a class="arrow py-invite-icon"></a>
    <div class="course-tab">
      <div class="grade"
        :class="{'active': courseType === 1}"
        @click="courseType = 1">
        <p class="coure-type">Reach</p>
        <p>限幼儿园大班及1-4年级</p>
      </div>
      <div class="grade"
        :class="{'active': courseType === 2}"
        @click="courseType = 2">
        <p class="coure-type">HE</p>
        <p>限5-8年级</p>
      </div>
    </div>
    <div class="title">北美外教1对1英语全能力诊断课</div>
    <div class="item-box" v-if="courseType === 1">
      <div class="tit py-invite-icon">
        <p>价值<em>288</em>元1对1诊断<br>
        {{city}}特惠</p>
      </div>
      <p class="tit-sub"><span>一次诊断课包括</span></p>
      <ul class="include-list">
        <li class="mx py-invite-icon">
          <div class="content">
            <h5><span>1节20分钟1对1美国语文课</span></h5>
            <p class="tips">（正式课40分钟）</p>
            <p>专业美教1对1互动交流，全面了解孩子的口语和阅读水平</p>
          </div>
        </li>
        <li class="tv py-invite-icon">
          <div class="content">
            <h5><span>1节20分钟TV文学通识课</span></h5>
            <p class="tips">（正式课40分钟）</p>
            <p>藤校明星外教课，带孩子体验纯正的北美课堂，激发学习兴趣</p>
          </div>
        </li>
        <li class="report py-invite-icon">
          <div class="content">
            <h5><span>1份英语全能力个性诊断报告</span></h5>
            <p>根据课程学习情况，由授课外教多维度综合评估，专属个性化英语能力报告</p>
          </div>
        </li>
      </ul>
      <div class="welfare">
        <div class="tit py-invite-icon"><p>附加福利</p></div>
        <p>预约即可获得 ：<br>一年图书馆绘本阅读权限；一年磨耳朵听英语权限</p>
      </div>
    </div>
    <div class="item-box" v-if="courseType === 2">
      <div class="tit py-invite-icon">
        <p>价值<em>288</em>元1对1诊断<br>
        {{city}}特惠</p>
      </div>
      <p class="tit-sub"><span>一次诊断包含</span></p>
      <ul class="include-list">
        <li class="mx-he">
          <div class="content">
            <h5><span>1节20分钟美教HE听说课程</span></h5>
            <p class="tips">（正式课40分钟）</p>
            <p>专业美教1对1互动交流，全面了解孩子的口语和阅读水平。</p>
          </div>
        </li>
        <li class="report-he">
          <div class="content">
            <h5><span>1份英语全能力个性诊断报告</span></h5>
            <p>根据课程学习情况，由授课外教多维度综合评估，专属个性化英语能力报告</p>
          </div>
        </li>
      </ul>
      <div class="welfare">
        <div class="tit py-invite-icon"><p>附加福利</p></div>
        <p>预约即可获得 ：<br>一年图书馆绘本阅读权限；一年磨耳朵听英语权限</p>
      </div>
    </div>
    <a class="arrow py-invite-icon"></a>
    <div class="tit-why">
      <span>为什么选择学而思VIPX</span>
    </div>
    <div class="item-box" v-if="courseType === 1">
      <ul class="why-list">
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-img1.png"></span>
          <div class="content">
            <div class="tit">严苛选聘纯正北美外教</div>
            <p>美国、加拿大本土母语外教</p>
            <p>100%高等教育学历背景</p>
            <p>严格系统的教师培训</p>
          </div>
        </li>
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-img2.png"></span>
          <div class="content">
            <div class="tit">美国重点小学原版教材</div>
            <p>美国国家地理学习出版社原版Reach教材</p>
            <p>进阶式学习体验</p>
            <p>高效同步美国小学学习体系</p>
          </div>
        </li>
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-img3.png"></span>
          <div class="content">
            <div class="tit">特色双课堂+专属双外教</div>
            <p>1对1美国语文课+ TV文学通识课<br>每周80分钟纯正美式课堂浸泡<br>让孩子进入纯正英文学习情境</p>
            <p>优质北美外教+藤校明星外教</p>
            <p>确保双倍教学效果，专属学习体验</p>
          </div>
        </li>
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-img4.png"></span>
          <div class="content">
            <div class="tit">对标美国学生的专业检验</div>
            <p>“STAR TEST”美国教育部下属机构NCRTI和NCII授予“最佳评测系统”</p>
            <p>同预习、上课、课后练习一起形成预学练评测学习闭环。</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="item-box" v-if="courseType === 2">
      <ul class="why-list">
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-img1.png"></span>
          <div class="content">
            <div class="tit">匹配国际标准测评</div>
            <p>严格遵循国际标准体系，目标MSE（剑桥主体五级考试）听口满分</p>
          </div>
        </li>
        <li>
          <span class="cover"><img src="../../assets/peiyou-invite-he-img.png"></span>
          <div class="content">
            <div class="tit">原版订制教材</div>
            <p>基于剑桥大学出版社 Hello English 课程，结合中国学生在线口语学习特点订制的 Hello English 听说课程，内容、知识完美匹配学而思培优英语 Hello English 读写课程。</p>
          </div>
        </li>
        <li class="last">
          <span class="cover"><img src="../../assets/peiyou-invite-img3.png"></span>
          <div class="content">
            <div class="tit">分层教学</div>
            <p>根据学员语言能力及认知水平进行分层教学，<br>针对性地调整课程难度及学习重点，因材施教，确保英语口语学习更加高效</p>
          </div>
        </li>
      </ul>
    </div>
    <a class="arrow py-invite-icon"></a>
    <div class="tit-cooperation">
      <span>机构合作</span>
    </div>
    <!-- <div class="cooperation"></div> -->
    <div class="cooperation"><img src="../../assets/peiyou-invite-cooperation.png"/></div>
    <p class="advisory">详情请咨询：4008002211转9（8:00～21:00）</p>
    <div class="invite-bot">
      <!-- <a class="mouse py-invite-icon"></a> -->
      <div class="txt">
        价值<em>288</em>元<br>专业北美外教1对1诊断
      </div>
      <a class="btn-order" @click="getExp()" v-if="!isDisabled && !loading">
        <span class="text-price">0</span>
        <span class="text">元预约</span>
      </a>
      <a class="btn-order" v-else>
        <span class="text-price">0</span>
        <span class="text">元预约</span>
      </a>
    </div>
  </div>
  <transition name="fade">
    <div class="py-dialog skin-bg" :class="{'result': [0, 1, 2].indexOf(dialogCurrent) > -1}" v-if="dialogCurrent >= 0 && dialogInfor[dialogCurrent]">
      <div class="dialog center">
        <a class="close py-invite-icon" @click="dialogCurrent = -1"></a>
        <div class="dialog-header" :class="{'py-invite-icon': dialogCurrent !== 3, 'side': dialogCurrent !== 3}">
          <h2>{{dialogInfor[dialogCurrent].title}}</h2>
        </div>
        <div class="dialog-body">
          <!-- 不是手机号登录 -->
          <register-box
            v-if="dialogCurrent === 3"
            :py-uid="pyUid"
            @regCallback="regCallback"></register-box>
          <div class="other" v-if="dialogCurrent === idx && dialogInfor[dialogCurrent].content" v-for="(state, idx) in dialogInfor" :key="idx">
            <p :class="{'txt-center': dialogCurrent === 1}">{{dialogInfor[dialogCurrent].content}}</p>
            <x-button class="btn-purple py-invite-icon" @click.native="dialogCurrent = -1">
              我知道了
            </x-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<script>
import moment from 'moment';
import { XInput, Group, XButton } from 'vux';
import { isEmpty } from 'lodash';
import { getPyInfo } from '@/api';
import RegisterBox from '@/components/invite-peiyou/Register.vue';

const XesJSBridge = require('@/utils/pyJSBridge').XesJSBridge;
/**
city: "010"
event_initiated_obj_value: "ff80808164f477760164f4c5af2f0055"
grade: "3"
gradeName: "小学三年级"
isLogin: true
sex: "2"

city: "010"
event_initiated_obj_value: "8ed770cf2d284cb2b4283db1c0955da2"
grade: "7"
gradeName: "初中一年级"
isLogin: true
sex: "2"
 */
export default {
  components: {
    XInput,
    XButton,
    Group,
    RegisterBox,
  },
  data() {
    return {
      dialogInfor: [
        { title: '领取成功！', content: '我们会在3-7个工作日为您安排体验，请保持电话通畅。' },
        { title: '已预约', content: '您已预约，感谢选择！' },
        { title: '敬请期待', content: '暂无适合您的诊断课，感谢您选择我们！' },
        { title: '请完善信息' },
        { title: '请登录', content: '感谢您选择VIPX，请先登录学而思APP后领取~' },
        { title: '领取成功！', content: '感谢您选择VIPX，春节期间课程暂停，我们将于年初八（2月12日）后与您联系安排上课时间，请保持手机畅通。' },
      ],
      dialogCurrent: -1,
      pyStuId: '',
      pyMobile: '',
      pyUid: 0,
      city: '',
      cityName: '',
      cityId: 7,
      isDisabled: false,
      loading: false,
      colorPrincipal: '#6B1980',
      courseType: 1, // 1-reach 2-he
    };
  },
  computed: {
    version() {
      return this.$route.query.version || '';
    },
  },
  methods: {
    getExp() {
      if (!this.pyUid) {
        this.dialogCurrent = 4;
        return;
      }
      this.isDisabled = true;
      // 1.判断是否注册
      const url = `${this.apiConfig.host}/peiyou/check-uid?uid=${this.pyUid}`;
      this.$http.get(url).then((response) => {
        // 已注册 领取体验课
        if (response.error_code === 0) {
          this.presell(response.data.mobile);
          return;
        }
        // 培优手机号为空 弹框注册
        if (isEmpty(this.pyMobile)) {
          this.dialogCurrent = 3;
          this.isDisabled = false;
          return;
        }
        // 注册并绑定
        this.$http.post(`${this.apiConfig.host}/peiyou/new-user`, {
          mobile: this.pyMobile,
          uid: this.pyUid,
          code: '100000',
        }).then((res) => {
          if (res.error_code > 0) {
            this.isDisabled = false;
            return;
          }
          this.presell(this.pyMobile);
        });
      });
    },
    presell(mobile) { //创建预售单
      const url = `${this.apiConfig.host}order/orders/presell`;
      const presellParams = {
        mobile,
        city_id: this.cityId,
        channel: 3,
      };
      this.$http.post(url, presellParams).then((res) => {
        this.isDisabled = false;
        if (Number(res.error_code) === 20305) {
          this.dialogCurrent = 2;
          return;
        }
        if (res.error_code > 0) {
          this.dialogCurrent = 1;
          return;
        }
        this.dialogCurrent = moment() >= moment('2019-02-02') && moment() <= moment('2019-02-11') ? 5 : 0;
      });
    },
    regCallback(mobile) {
      this.dialogCurrent = -1;
      this.presell(mobile);
    },
    getPyInfo() {
      this.loading = true;
      XesJSBridge.ready(() => {
        XesJSBridge.getUserInfo((response) => { // 获取培优pyStuId
          console.log(response);
          if (!response.event_initiated_obj_value) {
            this.loading = false;
            return;
          }
          this.pyStuId = response.event_initiated_obj_value;
          getPyInfo(this.pyStuId).then((res) => { // 获取培优用户信息
            this.loading = false;
            if (res.data.error_code > 0) {
              console.log(res.data.error_code);
              return;
            }
            this.pyMobile = res.data.data.phone || '';
            this.pyUid = Number(res.data.data.id);
            const citys = ['深圳', '广州', '南京', '上海', '杭州', '北京'];
            this.cityName = res.data.data.city_list[0].cityName;
            if (this.cityName && citys.indexOf(this.cityName) > -1) {
              this.city = `${this.cityName}地区`;
              this.cityId = citys.indexOf(this.cityName) + 1;
            }
          });
        });
      });
    },
  },
  mounted() {
    this.getPyInfo();
    if (this.version === 'v2') {
      this.colorPrincipal = '#7721DB';
    }
    if (this.version === 'v3') {
      this.colorPrincipal = '#B11AFF';
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
@import '../../styles/invitePeiyou.less';
</style>

