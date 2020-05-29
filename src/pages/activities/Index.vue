<template>
  <div>
    <div class="activity-offline" v-if="introduceId">活动已下架</div>
    <div class="py-invite" :class="{'noscroll': dialogCurrent != -1}" v-else>
      <div class="banner">
        <img src="../../assets/activities-banner.png" />
      </div>
      <div class="py-invite-reg">
        <p class="reg-tit">报名价值<em>288</em>元英语能力诊断课 仅需<em>0</em>元</p>
        <p class="reg-sub"><span>仅限幼儿园大班及1-8年级学员</span></p>
        <template v-if="dialogChange === -1">
          <div class="form-wrap">
            <div class="form-group">
              <group class="comm-group">
                <x-input
                  type="tel"
                  v-model="mobile"
                  keyboard="number"
                  placeholder="请输入您的手机号"
                  :disabled="isDisabled"
                  :max="11"
                  @on-focus="clearErrorMsg()">
                </x-input>
              </group>
              <p class="error-tips" v-if="mobileMsg">{{mobileMsg}}</p>
            </div>
            <div class="form-group code">
              <group class="comm-group">
                <x-input
                  type="tel"
                  v-model="code"
                  placeholder="请输入短信验证码"
                  :max="6"
                  @on-focus="clearErrorMsg()">
                </x-input>
              </group>
              <a class="ver-code"
                :class="{'highlight': !showError}"
                @click="sendCode()">
                {{btnTxt}}
              </a>
              <p class="error-tips" v-if="codeMsg">{{codeMsg}}</p>
            </div>
          </div>
          <div class="btn-fn">
            <x-button class="py-invite-icon"
              :class="{'btn-highlight': !mobileMsg && mobile !== '' && !codeMsg && code !== ''}"
              @click.native="checkMobile()">
              0元报名
            </x-button>
          </div>
        </template>
        <template v-else>
          <div class="grade-list">
            <div class="inner">
              <a class="btn-sel" :class="{'active': gradeID === item.id}" v-for="(item,idx) in gradeList" :key="idx" @click="selectGrade(item.id)">{{item.name}}</a>
            </div>
          </div>
          <div class="btn-fn">
            <x-button class="py-invite-icon"
              :class="{'btn-highlight': gradeID > 0}"
              @click.native="presell()">
              0元报名
            </x-button>
          </div>
        </template>
      </div>
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
      <div class="item-box">
        <div class="title">北美外教1对1英语全能力诊断课</div>
        <p class="tit-sub"><span>一次诊断课包括</span></p>
        <ul class="include-list" v-if="courseType === 1">
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
        <ul class="include-list" v-if="courseType === 2">
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
              <p>根据课程学习情况，由授课外教多维度综合评估，专属个性化英语能力报告。</p>
            </div>
          </li>
        </ul>
        <div class="welfare">
          <div class="title">· 预约即可获得 ·</div>
          <ul v-if="courseType === 1">
            <li class="library py-invite-icon">
              <div class="content">
                <h5><span>一年在线有声图书馆阅读权限</span></h5>
                <p>精选美国原版教材，使用全美最具公信力的蓝思分级系统，科学匹配孩子不同学习阶段的需求。其内容同步课堂，题材广泛，孩子可看、可听、可跟读（纠正发音），是英语学习不可或缺的好帮手。</p>
              </div>
            </li>
            <li class="ear-training py-invite-icon">
              <div class="content">
                <h5><span>磨耳朵听英语权限</span></h5>
                <p>畅听美国小学原版教材Reach和RAZ读物：优美歌曲、获奖名篇、奇趣科普，完美匹配VIPX在线外教课程。每天20分钟，培养英文耳朵！</p>
              </div>
            </li>
          </ul>
          <ul v-if="courseType === 2">
            <li class="library py-invite-icon">
              <div class="content">
                <h5><span>1年图书馆绘本权限</span></h5>
                <p>精选自美国原版Reach教材，精选RAZ绘本，孩子可看、可听、可跟读（纠正发音），是英语学习不可或缺的好帮手。</p>
              </div>
            </li>
            <li class="ear-training py-invite-icon">
              <div class="content">
                <h5><span>1年磨耳朵听英语权限</span></h5>
                <p>畅听美国小学原版教材Reach和RAZ读物：优美歌曲、获奖名篇、奇趣科普。每天20分钟，培养英文耳朵。</p>
              </div>
            </li>
          </ul>
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
              <p class="special">“STAR TEST”美国教育部下属机构NCRTI和NCII授予“最佳评测系统”</p>
              <p class="special">同预习、上课、课后练习一起形成预学练评测学习闭环。</p>
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
              <p>严格遵循国际标准体系，目标MSE（剑桥主体五级考试）听口满分。</p>
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
              <p>根据学员语言能力及认知水平进行分层教学，针对性地调整课程难度及学习重点，因材施教，确保英语口语学习更加高效。</p>
            </div>
          </li>
        </ul>
      </div>
      <a class="arrow py-invite-icon"></a>
      <div class="tit-cooperation">
        <span>机构合作</span>
      </div>
      <div class="cooperation"><img src="../../assets/peiyou-invite-cooperation.png"/></div>
      <p class="advisory">详情请咨询：4008002211转9（8:00～21:00）</p>
      <div class="invite-bot" v-if="isFixed">
        <div class="txt">
          价值<em>288</em>元体验周<br>仅需<em>0</em>元
          <a class="btn-order" @click="goTop"><i>0</i>元预约</a>
        </div>
      </div>
      <transition name="fade">
        <div class="py-dialog skin-bg result" v-if="dialogCurrent >= 0 && dialogInfor[dialogCurrent]">
          <div class="dialog center">
            <a class="close py-invite-icon" @click="dialogClosed(dialogCurrent)"></a>
            <div class="dialog-header py-invite-icon side">
              <h2>{{dialogInfor[dialogCurrent].title}}</h2>
            </div>
            <div class="dialog-body">
              <div class="other" v-if="dialogCurrent === idx && dialogInfor[dialogCurrent].content" v-for="(state, idx) in dialogInfor" :key="idx">
                <p class="txt-center">{{dialogInfor[dialogCurrent].content}}</p>
                <x-button class="btn-purple py-invite-icon" @click.native="dialogClosed(dialogCurrent)">
                  我知道了
                </x-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { XInput, Group, XButton } from 'vux';
import { isEmpty } from 'lodash';
import { sendSmsCode, register } from '@/api';
import wechatMenu from '@/mixins/wechatMenu.js';

export default {
  components: {
    XInput,
    XButton,
    Group,
  },
  data() {
    return {
      dialogInfor: [
        { title: '领取成功！', content: '我们会在3-7个工作日为您安排体验，请保持电话通畅。' },
        { title: '已预约', content: '您已预约，感谢选择！' },
        { title: '敬请期待', content: '暂无适合您的诊断课，感谢您选择我们！' },
        { title: '温馨提示', content: '当前账号已生成VIPX账号，初始密码为vipx666666' },
        { title: '温馨提示', content: '在读学员本次体验不能领取哦！' },
        { title: '领取成功！', content: '感谢您选择VIPX，春节期间课程暂停，我们将于年初八（2月12日）后与您联系安排上课时间，请保持手机畅通。' },
      ],
      gradeList: [
        { id: 58, name: '幼儿园大班' },
        { id: 8, name: '一年级' },
        { id: 9, name: '二年级' },
        { id: 10, name: '三年级' },
        { id: 11, name: '四年级' },
        { id: 12, name: '五年级' },
        { id: 13, name: '六年级' },
        { id: 14, name: '七年级' },
        { id: 15, name: '八年级' },
      ],
      screenHeight: 0,
      scrollTop: 0,
      isFixed: false,
      mobile: '',
      mobileMsg: '',
      code: '',
      codeMsg: '',
      codeMsgStatus: 0,
      btnTxt: '发送验证码',
      showError: true,
      isDisabled: false,
      gradeID: 0,
      dialogChange: -1, // -1输手机号 0/1/2选择年级
      dialogCurrent: -1, // 弹框状态
      timer: '',
      checkDisabled: false,
      presellDisabled: false,
      courseType: 1,
    };
  },
  mixins: [wechatMenu],
  watch: {
    mobile(val) {
      console.log(val);
      if (val.length === 11 && /1\d{10}/.test(val)) {
        this.showError = false;
        this.mobileMsg = '';
      } else {
        this.showError = true;
        if (isEmpty(val)) {
          this.mobileMsg = '';
        } else {
          this.mobileMsg = '请输入正确的手机号';
        }
      }
    },
    code(val) {
      if ((val.length > 3 && val.length < 7) || isEmpty(val)) {
        this.codeMsg = '';
      } else {
        this.codeMsgStatus = 0;
        this.codeMsg = '请输入4-6位的验证码';
      }
    },
  },
  computed: {
    cityId() {
      return Number(this.$route.query.id) || 7;
    },
    channel() {
      return Number(this.$route.query.channel) || 6;
    },
    introduceId() {
      return Number(this.$route.query.introduce_id) || 0;
    },
  },
  methods: {
    handleScroll() {
      this.scrollTop = (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop);
      if (this.scrollTop > this.screenHeight) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    goTop() {
      if (document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      } else if (document.body.scrollTop) {
        document.body.scrollTop = 0;
      } else if (window.pageYOffset) {
        window.pageYOffset = 0;
      }
    },
    dialogClosed(val) {
      this.dialogCurrent = -1;
      if (val === 3) {
        this.dialogChange = 0;
      } else {
        this.dialogChange = -1;
        this.mobile = '';
        this.code = '';
        this.showError = false;
        this.isDisabled = false;
        clearInterval(this.timer);
        this.btnTxt = '发送验证码';
        this.checkDisabled = false;
        this.presellDisabled = false;
      }
    },
    clearErrorMsg() {
      if (!isEmpty(this.codeMsg) && this.codeMsgStatus !== 0) {
        this.codeMsg = '';
      }
    },
    sendCode() {
      if (this.showError || (this.codeMsg && this.codeMsgStatus === 1)) {
        return false;
      }
      sendSmsCode(this.mobile, 4).then((response) => {
        if (response.error_code !== 0) {
          this.codeMsgStatus = 1;
          this.codeMsg = response.error_msg;
          return false;
        }
        this.showError = true;
        this.isDisabled = true;
        this.$vux.toast.show({
          type: 'text',
          text: '验证码已发送',
          position: 'middle',
          time: 3000,
          width: '10em',
        });
        this.countdown();
      });
    },
    countdown() {
      let seconds = 60;
      this.timer = setInterval(() => {
        this.btnTxt = `已发送(${seconds})`;
        if (seconds === 0) {
          this.showError = false;
          this.isDisabled = false;
          this.btnTxt = '重新发送';
          clearInterval(this.timer);
        }
        seconds -= 1;
      }, 1000);
    },
    checkMobile() {
      if (isEmpty(this.mobile) ||
        !isEmpty(this.mobileMsg) ||
        isEmpty(this.code) ||
        !isEmpty(this.codeMsg) ||
        this.checkDisabled) {
        return false;
      }
      this.checkDisabled = true;
      const checkData = {
        mobile: this.mobile,
        code: this.code,
        is_promotion: 1,
      };
      const url = `${this.apiConfig.host}/student/exist`;
      this.$http.post(url, checkData).then((response) => {
        if (response.error_code === 0) { // 老用户
          this.gradeID = response.data.grade_id;
          this.presell(1);
        } else if (response.error_code === 20203) { // 新用户去注册
          const data = {
            mobile: this.mobile,
            password: 'vipx666666',
            code: this.code,
            grade_id: this.gradeID,
            is_promotion: 1,
            from: 1,
            source_id: 8,
          };
          register(data).then((res) => {
            if (res.error_code === 0) {
              this.dialogCurrent = 3;
            } else {
              this.codeMsg = res.error_msg;
              this.codeMsgStatus = 2;
            }
          });
        } else {
          this.checkDisabled = false;
          this.codeMsg = response.error_msg;
          this.codeMsgStatus = 2;
        }
      });
    },
    selectGrade(index) {
      if (this.gradeID > 0 && this.dialogChange === 1) {
        return false;
      }
      this.gradeID = index;
    },
    presell(type = 0) { //创建预售单
      if ((this.gradeID <= 0 || this.presellDisabled) && type === 0) {
        return false;
      }
      if (type === 0) {
        this.presellDisabled = true;
      }
      let isOld = 1;
      if (this.dialogChange === 0) {
        isOld = 0;
      }
      const url = `${this.apiConfig.host}/order/orders/presell`;
      const data = {
        mobile: this.mobile,
        grade_id: this.gradeID,
        city_id: [1, 7].indexOf(this.channel) > -1 ? 0 : this.cityId,
        channel: this.channel,
        introduce_id: this.introduceId,
        is_old: isOld,
        is_check: type === 1 ? 1 : 0,
      };
      this.$http.post(url, data).then((res) => {
        if (res.error_code === 0 && type === 0) {
          this.dialogCurrent = moment() >= moment('2019-02-02') && moment() <= moment('2019-02-11') ? 5 : 0;
        } else if (res.error_code === 20302 || res.error_code === 20401) {
          this.dialogCurrent = 1;
        } else if (res.error_code === 20305) {
          this.dialogCurrent = 2;
        } else if (res.error_code === 20307) {
          this.dialogCurrent = 4;
        } else if (this.gradeID > 0 && type === 1) {
          this.dialogChange = 1; // 已有年级不可再选
        } else {
          this.dialogChange = 2;
        }
      });
    },
  },
  mounted() {
    this.screenHeight = window.screen.height + 200;
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

@col-pri-purple: #7923BF;
@col-ori: #f8c410;
@col-pri-gray: #606060;
.activity-offline{
  padding-top: 75%;
  font-size: 30px;
  text-align: center;
}
.py-invite{
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .mx-he:before{
    content: '';
    .pos-box(1.28rem, 1.28rem);
    .bg-m("@{img-path}/peiyou-invite-he-clock2.png");
    background-size: 1.28rem 1.28rem;
  }
  .report-he:before{
    content: '';
    .pos-box(1.3rem, 1.3rem);
    .bg-m("@{img-path}/peiyou-invite-he-report2.png");
    background-size: 1.3rem 1.3rem;
  }
}
.py-invite-icon{
  &:before{
    content: '';
    .bg-m("@{img-path}/activities-bg.png");
    background-size: 2.1rem 5.9rem;
  }
  &.btn-purple:before{
    position: absolute;
    left: .1rem;
    top: .1rem;
    .wh(.2rem,.2rem);
    background-position: -1.46rem -2.4rem;
  }
  &.sel:before{
    .pos-box-hc(.24rem,.16rem);
    right: .4rem;
    background-position: -1.46rem -2.6rem;
    z-index: 5;
    transition: all .5s;
  }
  &.selected:before{
    transform: rotate(180deg);
  }
  &.close:before{
    .pos-box(.5rem,.5rem);
    background-position: -1.46rem -2.76rem;
  }
  &.side:before, &.side:after{
    position: absolute;
    top: .37rem;
    .wh(.41rem,.8rem);
  }
  &.side:before{
    left: -.4rem;
    background-position: -1.46rem -1.22rem;
  }
  &.side:after{
    content: '';
    right: -.4rem;
    .bg-m("@{img-path}/peiyou-invite-bg.png");
    background-size: 2.1rem 5.9rem;
    background-position: -1.46rem -.41rem;
  }
  &.arrow:before{
    display: block;
    margin: .3rem auto 0;
    .wh(.36rem,.23rem);
    background-position: -1.49rem -2.1rem;
  }
  &.tit:before{
    position: absolute;
    top: .44rem;
    left: 50%;
    margin-left: -1.6rem;
    .wh(2.1rem,.4rem);
  }
  &.mx:before{
    .pos-box(1.46rem,1.6rem);
    background-position: 0 -.4rem;
  }
  &.tv:before{
    .pos-box(1.46rem,1.6rem);
    background-position: 0 -3.6rem;
  }
  &.report:before{
    .pos-box(1.46rem,1.6rem);
    background-position: 0 -2rem;
  }
  &.mouse:before{
    .pos-box-hc(1.14rem,.7rem);
    right: -.3rem;
    background-position: 0 -5.2rem;
    animation: mouse .5s infinite alternate;
  }
  &.library:before{
    .pos-box(2.04rem,2.21rem);
    .bg-m("@{img-path}/activities-library.png");
    background-size: 2.04rem auto;
  }
  &.ear-training:before{
    .pos-box(2.04rem,2.21rem);
    .bg-m("@{img-path}/activities-ear-training.png");
    background-size: 2.04rem auto;
  }
}
.invite-bot{
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  padding: .5rem .4rem .4rem .5rem;
  .l-gradient(-45deg,rgba(142,31,191,1),rgba(71,43,192,1));
  color: #fff;
  .txt{
    position: relative;
    min-height: .94rem;
    line-height: .38rem;
    font-size: .28rem;
    font-weight: bold;
    em{
      position: relative;
      top: .04rem;
      color: @col-ori;
      font-size: .47rem;
      &:first-of-type{
        color: #fff;
      }
    }
  }
  .btn-order{
    .pos-box-r(3.7rem,.94rem);
    top: 0rem;
    right: 0rem;
    line-height: .76rem;
    background: @col-ori;
    text-align: center;
    border-radius: .9rem;
    color: @col-pri-purple;
    font-size: .36rem;
    i{
      position: relative;
      top: .06rem;
      font-size: .55rem;
      font-weight: bold;
    }
  }
}
.py-invite{
  padding: 0 0 2.4rem;
  min-height: 100%;
  background: #fff;
  // .bg-m('@{img-path}/activities-banner.png');
  // background-size: 100% 6.55rem;
  &.noscroll{
    .wh(100%,100%);
    overflow: hidden;
  }
  .banner{
    height: auto;
    img{
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .arrow{
    display: block;
    &:first-of-type{
      margin-bottom: .4rem;
    }
  }
  .py-invite-reg{
    margin: 0 .28rem;
    padding: .6rem .3rem .9rem;
    .l-gradient(-45deg,rgba(142,31,191,1),rgba(71,43,192,1));
    .reg-tit{
      font-size: .33rem;
      color: #fff;
      text-align: center;
      em{
        font-size: .45rem;
        color: @col-ori;
      }
    }
    .reg-sub{
      margin: .1rem 0 .3rem;
      color: #fff;
      text-align: center;
      span{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        &:before,&:after{
          content: '';
          .pos-box-hc(.4rem,.02rem);
          background: #fff;
        }
        &:before{
          left: -.6rem;
        }
        &:after{
          right: -.6rem;
        }
      }
    }
    .grade-list{
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: wrap;
      text-align: center;
      padding: 0 .3rem;
      height: 3rem;
    }
    .btn-sel{
      display: inline-block;
      vertical-align: middle;
      margin: .04rem;
      .wh(1.66rem,.53rem);
      line-height: .51rem;
      border: .01rem solid #fff;
      text-align: center;
      color: #fff;
      &.active{
        background: #fff;
        color: @col-pri-purple;
      }
    }
    .btn-fn{
      padding: .1rem .5rem 0;
    }
    .weui-btn{
      .l-h(.9rem);
      border-radius: .9rem;
      background: #C5A9D4;
      font-size: .34rem;
      color: @col-pri-purple;
      &:active{
        color: @col-pri-purple;
        background: #C5A9D4;
      }
      &:before,&:after{
        display: none;
      }
      &.btn-highlight:before{
        display: block;
      }
      &.btn-highlight,&.btn-highlight:active{
        background: #fff;
      }
    }
    .weui-cells{
      .weui-cells;
      background-color: transparent;
      .weui-cell{
        .l-h(1rem);
        .placeholder-c(#fff);
      }
    }
    .form-wrap{
      height: 3rem;
    }
    .form-group{
      position: relative;
      margin: 0 .5rem .4rem;
      border: .01rem solid #fff;
      border-radius: .5rem;
      &.code{
        padding-right: 2.3rem;
        border-radius: .45rem;
        .weui-cells{
          .weui-cell{
            .l-h(.9rem);
          }
        }
      }
      .ver-code{
        position: absolute;
        right: .16rem;
        top: 50%;
        margin-top: -.56rem/2;
        .wh(2rem,.56rem);
        line-height: .54rem;
        color: #fff;
        font-size: .3rem;
        background: #C5A9D4;
        border-radius: .56rem;
        text-align: center;
        color: @col-pri-purple;
        &.highlight{
          background:#fff;
        }
        &:before{
          content: '';
          .pos-box-hc(.02rem,.7rem);
          left: -.16rem;
          background: #fff;
        }
      }
      &.sel{
        .weui-cells{
          // background: transparent;
          border-radius: .9rem/2;
        }
      }
      .sel-list{
        position: absolute;
        left: .02rem;
        right: .02rem;
        top: .45rem;
        padding: .7rem .23rem .3rem;
        border: .02rem solid @col-light-purple;
        border-bottom-left-radius: .4rem;
        border-bottom-right-radius: .4rem;
        background: #fff;
        border-top: none;
        text-align: center;
        z-index: 2;
        li{
          .l-h(.68rem);
          border-top: .01rem solid rgba(149,55,172,.2);
          &:first-of-type{
            border: none;
          }
        }
      }
      .error-tips{
        position: absolute;
        left: 0;
        right: 0;
        bottom: -.38rem;
        padding: 0 .3rem;
        line-height: .38rem;
        font-size: .24rem;
        color: @col-ori;
      }
    }
    .comm-group{
      position: relative;
      z-index: 3;
      .vux-x-input{
        // border: .02rem solid @col-light-purple;
        // border-radius: .45rem;
        color: #fff;
      }
      .weui-input{
        .l-h(.9rem);
      }
    }
  }
  .summary{
    position: relative;
    margin: .8rem .8rem .1rem;
    border: .16rem solid #8A20BF;
    line-height: .42rem;
    text-align: center;
    color: @col-pri-gray;
    &:before, &:after{
      content: '';
      position: absolute;
      .wh(94%,.2rem);
      background: #fff;
    }
    &:before{
      top: -.18rem;
      right: 0;
    }
    &:after{
      bottom: -.18rem;
      left: 0;
    }
  }
  .title{
    position: relative;
    margin-top: .4rem;
    .l-h(.75rem);
    text-align: center;
    font-size: .4rem;
    color: @col-pri-purple;
    font-weight: bold;
  }
  .tit-why{
    position: relative;
    margin: .6rem 0;
    font-size: .47rem;
    text-align: center;
    color: #fff;
    font-weight: bold;
    &:before,&:after{
      content: '';
      position: absolute;
      top: -.32rem;
    }
    &:before{
      left: 0;
      .wh(1.36rem,1.98rem);
      .bg-m('@{img-path}/peiyou-invite-bg1.png');
      background-size: 100% 100%;
    }
    &:after{
      right: 8%;
      .wh(1.01rem,1.72rem);
      .bg-m('@{img-path}/peiyou-invite-bg2.png');
      background-size: 100% 100%;
    }
    span{
      display: block;
      margin: 0 auto;
      .wh(76.4%,.9rem);
      line-height: .84rem;
      // background: @col-pri-purple;
      .l-gradient(-45deg,rgba(142,31,191,1) 0%,rgba(71,43,192,1));
      border-radius: .9rem;
    }
  }
  .tit-cooperation{
    .tit-why;
    margin-bottom: .4rem;
    &:before{
      top: -.3rem;
      left: 9.4%;
      .wh(1.38rem,.88rem);
      .bg-m('@{img-path}/peiyou-invite-bg3.png');
      background-size: 100% 100%;
    }
    &:after{
      right: 0;
      top: -1.7rem;
      .wh(1.29rem,3.09rem);
      .bg-m('@{img-path}/peiyou-invite-bg4.png');
      background-size: 100% 100%;
    }
  }
  .cooperation{
    margin: 0 auto;
    display: block;
    width: 97%;
    img{
      width: 100%;
      height: auto;
    }
    // .wh(7.13rem,3.13rem);
    // .bg-m('@{img-path}/peiyou-invite-cooperation.png');
    // background-size: 7.13rem 3.12rem;
  }
  .advisory{
    color: @col-pri-gray;
    text-align: center;
  }
  .course-tab{
    display: flex;
    justify-content: center;
    margin: .56rem 0 .5rem 0;
    border-bottom: .04rem solid @col-pri-purple;
    .grade{
      .wh(3.4rem, 1.2rem);
      border-radius:.3rem .3rem 0 0;
      background-color: #eee;
      color: #ccc;
      font-size: .24rem;
      text-align: center;
      margin: 0 .045rem;
      &.active{
        background-color: @col-ori;
        color: @col-pri-purple;
      }
      .coure-type{
        font-size: .48rem;
        font-weight: 600;
      }
    }
  }
  .item-box{
    margin: 0 .3rem .3rem;
    padding: .01rem 0;
    padding-bottom: .6rem;
    box-shadow: 0 0 .1rem rgba(0,0,0,.4);
    .tit{
      position: relative;
      padding-left: .16rem;
      color: @col-pri-purple;
      font-size: .39rem;
      text-align: center;
      p{
        position: relative;
        font-weight: bold;
      }
      em{
        position: relative;
        top: .06rem;
        font-size: .65rem;
      }
    }
    .tit-sub{
      position: relative;
      margin: .1rem .4rem 0;
      font-size: .39rem;
      text-align: center;
      color: @col-pri-gray;
      &:before{
        content: '';
        .pos-box-hc(100%,.02rem);
        left: 0;
        background: @col-pri-purple;
      }
      span{
        position: relative;
        padding: 0 .35rem;
        display: inline-block;
        vertical-align: middle;
        background: #fff;
      }
    }
    .include-list{
      margin: 0 .4rem;
      li{
        position: relative;
        margin: .3rem 0;
        padding: .2rem 0 0 1.5rem;
        min-height: 1.8rem;
        h5{
          span{
            display: inline-block;
            vertical-align: middle;
            padding: 0 .08rem;
            .l-h(.38rem);
            border-radius: .38rem;
            background: @col-pri-purple;
            color: #fff;
            font-weight: bold;
            font-size: .27rem;
          }
        }
        p{
          line-height: .42rem;
          color: #606060;
        }
        .tips{
          color: @col-pri-gray;
        }
      }
    }
    .welfare{
      padding: .3rem .15rem 0;
      border-top: .01rem dashed @col-pri-purple;
      font-size: .27rem;
      color: @col-pri-purple;
      // p{
      //   line-height: .41rem;
      // }
      ul{
        margin: 0 .4rem;
        li{
          position: relative;
          margin: .4rem 0 0;
          padding: 0 0 0 2.3rem;
          min-height: 2.3rem;
          h5{
            span{
              .l-h(.38rem);
              color: @col-pri-purple;
            }
          }
          p{
            margin-top: .16rem;
            line-height: .36rem;
            color: #606060;
            font-size: .22rem;
          }
        }
      }
    }
    .why-list{
      padding: 0 .25rem;
      li{
        position: relative;
        padding: .4rem 0 .6rem;
        border-top: .01rem dashed @col-pri-purple;
        min-height: 4rem;
        &:first-of-type{
          // padding-left: .2rem;
          border: none;
        }
        &:nth-child(even){
          padding-left: 2.6rem;
          .cover{
            left: -.5rem;
          }
        }
        &:nth-child(odd){
          padding-right: 2.6rem;
           .cover{
            right: -.5rem;
          }
        }
        &:last-of-type{
          padding-left: 2.5rem;
        }
        &.last{
          padding-left: 0;
        }
        .cover{
          top: .4rem;
          position: absolute;
          .wh(3.13rem,3.13rem);
          img{
            .wh-img;
          }
        }
      }
      .content{
        padding-top: .4rem;
      }
      .tit{
        margin-bottom: .2rem;
        font-size: .35rem;
        color: @col-pri-purple;
        text-align: left;
        font-weight: bold;
        width: 110%;
      }
      p{
        position: relative;
        line-height: .45rem;
        color: #606060;
        padding: 0 .16rem;
        &.special{
          padding-left: .25rem;
        }
      }
    }
  }
}
.py-dialog{
  .cus-dialog-box;
  &.skin-bg{
    .dialog{
      &-header{
        .l-gradient(-45deg,rgba(142,31,191,1) 0%,rgba(71,43,192,1));
      }
    }
  }
  &.result{
    &:before{
      content: '';
      .pos-box-lc(7.33rem,5.84rem);
      top: 20%;
      .bg-m('@{img-path}/peiyou-invite-light.png');
      background-size: 7.33rem 5.84rem;
    }
    .dialog:before{
      content: '';
      .pos-box-lc(4.2rem,1.66rem);
      top: -.7rem;
      .bg-m('@{img-path}/peiyou-invite-ribbon.png');
      background-size: 4.2rem 1.66rem;
    }
  }
  .dialog{
    position: relative;
    .close{
      .pos-box-lc(.5rem,.5rem);
      bottom: -.9rem;
    }
    .dialog-body{
      padding: .6rem .24rem;
    }
    .weui-btn{
      .l-h(.8rem);
      border-radius: .8rem;
      background: #EAEAED;
      font-size: .34rem;
      color: #909090;
      &:before,&:after{
        display: none;
      }
      &.btn-purple:before{
        display: block;
      }
      &.btn-purple{
        background:linear-gradient(110deg,rgba(199,104,214,.9) 0%,rgba(149,55,172,.9) 20%);
        box-shadow:0px 9px 10px 0px rgba(218,206,221,1);
        color: #fff;
      }
    }
  }
  .other{
    .weui-btn{
      margin-top: .6rem;
      width: 1.8rem;
      .l-h(.7rem);
      font-size: .26rem;
      &.btn-purple{
        background:linear-gradient(163deg,rgba(181,77,206,1) 0%,rgba(149,55,172,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(231,189,241,0.34);
      }
    }
    .txt-center{
      text-align: center;
    }
    p{
      padding: 0 .2rem;
    }
  }
}
@keyframes mouse{
  50%{
    right: -.2rem;
  }
}
.sk-circle {
  margin: 40px auto;
  width: 40px;
  height: 40px;
  position: relative; }
  .sk-circle .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; }
  .sk-circle .sk-child:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #333;
    border-radius: 100%;
    -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
            animation: sk-circleBounceDelay 1.2s infinite ease-in-out both; }
  .sk-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
            transform: rotate(30deg); }
  .sk-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
            transform: rotate(60deg); }
  .sk-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg); }
  .sk-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
            transform: rotate(120deg); }
  .sk-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
            transform: rotate(150deg); }
  .sk-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
            transform: rotate(180deg); }
  .sk-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
            transform: rotate(210deg); }
  .sk-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
            transform: rotate(240deg); }
  .sk-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
            transform: rotate(270deg); }
  .sk-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
            transform: rotate(300deg); }
  .sk-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
            transform: rotate(330deg); }
  .sk-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s; }
  .sk-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
            animation-delay: -1s; }
  .sk-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s; }
  .sk-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s; }
  .sk-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
            animation-delay: -0.7s; }
  .sk-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
            animation-delay: -0.6s; }
  .sk-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s; }
  .sk-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
            animation-delay: -0.4s; }
  .sk-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
            animation-delay: -0.3s; }
  .sk-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
            animation-delay: -0.2s; }
  .sk-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
            animation-delay: -0.1s; }

@-webkit-keyframes sk-circleBounceDelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  40% {
    -webkit-transform: scale(1);
            transform: scale(1); } }

@keyframes sk-circleBounceDelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  40% {
    -webkit-transform: scale(1);
            transform: scale(1); } }

</style>


