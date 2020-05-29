<template>
  <div class="int_con">
    <div class="int_banner_box">
      <img src="../../../assets/introduce/banner.png" class="int_banner">
      <div class="red_box">
        <img src="../../../assets/introduce/red_header.png" class="red_header">
        <!--未领取-->
        <div class="red_main" v-if="status===1">
          <div v-if="loginStatus === 1">
            <div class="red_form_item" v-if="formType === 1">
              <input type="number" placeholder="请输入手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model="mobile">
            </div>
            <div class="red_form_item" v-if="formType === 2">
              <input type="number" class="code" placeholder="请输入验证码" oninput="if(value.length>6)value=value.slice(0,6)" v-model="code">
              <span class="line"></span>
              <a href="javascript:;" class="get_code" @click="sendCode()">{{btnTxt}}</a>
            </div>
            <div class="red_form_item" v-if="formType === 2">
              <input placeholder="请输入学生姓名" v-model="name">
            </div>
            <a href="javascript:;" class="red_form_btn" @click="getScholarship()">领取新生奖学金</a>
          </div>
          <div v-else>
            <a href="javascript:;" class="red_form_btn" @click="getMoney();setBtnLog(2);">领取新生奖学金</a>
          </div>
        </div>
        <!--已领取-->
        <div class="red_main s2" v-else>
          <img src="../../../assets/introduce/invite_tips.png" class="invite_tips">
          <a href="javascript:;" class="red_form_btn mt0" @click="getPoster()">立即邀请好友</a>
        </div>
        <div class="game_rule" v-if="status===1">
          <a href="javascript:;" class="rule" @click="isRuleShow=true;"><em>我已阅读并同意<span>《详细规则》</span></em></a>
          <p>注册表示您同意
            <router-link class="avatar" :to="{name: 'agreement'}">《VIPX用户协议》</router-link>及
            <router-link class="avatar" :to="{name: 'privacy'}">《隐私条款》</router-link>
          </p>
        </div>
        <div class="game_rule" v-else>
          <a href="javascript:;" class="rule sp" @click="isRuleShow=true;">《详细规则》</a>
        </div>
      </div>
    </div>
    <div class="int_main" v-if="status===2">
      <!--奖学金信息-->
      <div class="scholarship_con" v-if="scholarShipInfo.detail">
        <div class="scholarship_item item_sp">
          <div class="scholarship_item_center">
            <div class="my_scholarship">
              <img src="../../../assets/introduce/deer_avatar.png" alt="">
              <h2>我的奖学金</h2>
              <p>{{scholarShipInfo.detail.student.realname}}</p>
              <span class="total_money">￥<em>{{scholarShipInfo.detail.total}}</em></span>
            </div>
            <div class="yellow_line"></div>
            <div class="scholarship_flex mt28">
              <div class="num">{{scholarShipInfo.detail.friends_coupon_num}}</div>
              <div class="num">{{scholarShipInfo.detail.friends_pay_num}}</div>
              <div class="num">{{scholarShipInfo.detail.return_coupon_num}}</div>
              <div class="num">{{scholarShipInfo.detail.friends_refund_num}}</div>
            </div>
            <div class="scholarship_flex">
              <div class="num_name">好友领取</div>
              <div class="num_name">好友报课</div>
              <div class="num_name">返券成功</div>
              <div class="num_name">好友退费</div>
            </div>
          </div>
        </div>
      </div>
      <!--邀请列表-->
      <div class="scholarship_con" v-if="scholarShipInfo.list">
        <div class="scholarship_item">
          <div class="scholarship_item_center">
            <img src="../../../assets/introduce/list_title.png" class="list_title">
            <div class="scholarship_flex mt60">
              <div class="num_name">我邀请的好友</div>
              <div class="num_name">好友状态</div>
              <div class="num_name">邀请奖励</div>
            </div>
            <div v-if="scholarShipInfo.list.length > 0">
              <div class="scholarship_flex" v-for="(item, index) in scholarShipInfo.list" :key="index">
                <div class="friends">{{item.student.realname}}</div>
                <div class="friends" :class="{'red_color': item.friend_status===0, 'gray_color': item.friend_status===2}">{{friendsArr[item.friend_status]}}</div>
                <div class="friends" :class="{'red_color': item.issue_status===1, 'gray_color': item.issue_status===2 || item.issue_status===3}">{{issueArr[item.issue_status]}}</div>
              </div>
            </div>
            <div v-else>
              <div class="scholarship_flex" style="margin-top:.3rem;"><div class="friends">暂无邀请好友数据~</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="int_main" v-if="status===1">
      <!--为什么选择学而思VIPX-->
      <div class="planc_info_box planc_sp">
        <img src="../../../assets/import/t1.png" class="planc_info_title t1">
        <div class="place_info_item">
          <div class="img_info">
            <div class="img_info_con">
              <h4>美国小学原版教材</h4>
              <p>美国国家地理出版社原版Reach教材</p>
            </div>
          </div>
          <div class="img_box">
            <img src="../../../assets/import/b1.png">
          </div>
        </div>
        <div class="place_info_item">
          <div class="img_box">
            <img src="../../../assets/import/b2.png">
          </div>
          <div class="img_info">
            <div class="img_info_con sp">
              <h4>严格选聘北美外教</h4>
              <p>美国、加拿大高等学历纯正外教</p>
            </div>
          </div>
        </div>
        <div class="place_info_item">
          <div class="img_info">
            <div class="img_info_con">
              <h4>专业教研团队</h4>
              <p>学而思15年教研团队</p>
            </div>
          </div>
          <div class="img_box">
            <img src="../../../assets/import/b3.png">
          </div>
        </div>
      </div>
      <!--四大安心承诺-->
      <div class="planc_info_box">
        <img src="../../../assets/import/t2.png" class="planc_info_title t2">
        <p class="planc_info_subtitle">— 做教育有态度更有温度 —</p>
        <div class="four_promise first">
          <div class="promise_item">
            <img src="../../../assets/import/promise1.png">
            <h4>专属辅导老师</h4>
            <p>7*24专属私人辅导老师，全程跟进学习效果。</p>
          </div>
          <div class="promise_item">
            <img src="../../../assets/import/promise2.png">
            <h4>无理由退费</h4>
            <p>首次课程不满意，可全额退费。</p>
          </div>
        </div>
        <div class="four_promise">
          <div class="promise_item">
            <img src="../../../assets/import/promise3.png">
            <h4>安心透明课堂</h4>
            <p>100%透明课堂，提供课程回看，随时掌握孩子学习情况。</p>
          </div>
          <div class="promise_item">
            <img src="../../../assets/import/promise4.png">
            <h4>调课转班</h4>
            <p>课前一键轻松调转，紧急调换课有专属辅导老师贴心安排。</p>
          </div>
        </div>
      </div>
      <!--15年教学经验-->
      <div class="planc_info_box">
        <img src="../../../assets/import/t3.png" class="planc_info_title t3">
        <p class="planc_info_subtitle">— 获得社会广泛认可 —</p>
        <img src="../../../assets/import/certificate.png" class="certificate">
      </div>
      <!--关于vipx-->
      <div class="planc_info_box">
        <img src="../../../assets/import/t4.png" class="planc_info_title t4">
        <div class="about_vipx">学而思VIPX是学而思旗下在线外教品牌。学而思VIPX秉承学而思15年对教学品质与服务的严格要求，专注为全国5-14岁中国孩子提供最优质的在线北美外教课程，学而思VIPX将始终秉承着“纯正美式课堂，把世界带进我家“的教育理念，让孩子成为具备双语能力，融知识、思维和价值观于一体的新时代未来公民。 </div>
      </div>
    </div>
    <!--领取成功弹窗-->
    <div class="getSuccessPop" v-if="isSuccessPopShow">
      <div class="getSuccessPop_con">
        <a href="javascript:;" class="close_ico" @click="isSuccessPopShow=false;"></a>
        <p>您已经领取了<span>{{inviteName}}</span>的奖学金</p>
        <p>分享活动领取更多奖学金！</p>
        <div class="btn_group">
          <a href="/home" class="home_btn">去首页</a>
          <a href="javascript:;" class="share_btn" @click="isSuccessPopShow=false;getPoster();">去分享</a>
        </div>
      </div>
    </div>
    <!--老用户提醒弹窗-->
    <div class="getSuccessPop" v-if="isOldPopShow">
      <div class="getSuccessPop_con">
        <a href="javascript:;" class="close_ico" @click="isOldPopShow=false;"></a>
        <p>仅新学员可以领取新生优惠券，老学员可以邀请好友获取老学员优惠券</p>
        <div class="btn_group">
          <a href="/home" class="home_btn">去首页</a>
          <a href="javascript:;" class="share_btn" @click="isOldPopShow=false;getPoster();">去分享</a>
        </div>
      </div>
    </div>
    <!--loading-->
    <div class="loadingPop" v-if="!canClick">
      <loading></loading>
    </div>
    <!--海报弹窗-->
    <div class="getSuccessPop" v-if="isPosterShow" @click="isPosterShow=false;">
      <div class="poster_con" @click.stop>
        <img :src="posterUrl">
        <p>长按图片保存或发送给好友</p>
      </div>
    </div>
    <!--活动规则弹窗-->
    <div class="getSuccessPop" v-if="isRuleShow">
      <div class="getSuccessPop_con rule_con">
        <div class="rule_main">
          <a href="javascript:;" class="close_ico" @click="isRuleShow=false;"></a>
          <h3>详细规则</h3>
          <h4>参与规则</h4>
          <p class="rule_item">1.点击【立即邀请好友】，将海报发送给好友；</p>
          <p class="rule_item">2.好友（自2018年11月1日至今未购买过长期班的课程）通过扫码领取新生优惠券；</p>
          <p class="rule_item">3.好友通过服务号【VIPX】用券购买长期班课程；</p>
          <p class="rule_item">4.待好友上完两次课程后奖励到账；</p>
          <h4>奖励规则</h4>
          <p class="rule_item">1.每邀请一位好友用券购课上完两次后，均可获得100元老学员优惠券；</p>
          <h4>优惠券说明</h4>
          <p class="rule_item">1.课程价格大于优惠券面额才可以使用，当前活动内的优惠券可以叠加使用；</p>
          <p class="rule_item">2.老学员优惠券有效期为2020年10月31日；</p>
          <p class="rule_item">3.新生优惠券仅能领取一次，邀请奖学金领取无上限，多邀多得；</p>
          <p class="rule_item">4.优惠券按照购买时的课次进行分摊结算；</p>
          <p class="rule_item">5.退款后优惠券不退回；</p>
          <p class="rule_item">6.优惠券不可转赠；</p>
          <p class="rule_item">7.在法律许可范围内，活动最终解释权归学而思VIPX所有；</p>
          <p class="rule_item">8.优惠券按照购买时的课次进行分摊结算；</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isEmpty } from 'lodash';
import { setItem, getItem } from '@/utils/localStorage';
import { introduceRegister, getMoney, getMoneyList, sendSmsCode, checkIntroduceAuth, getPoster, setApilog } from '@/api';
import Loading from '@/components/loading/Index';
import wechatMenu from '@/mixins/wechatMenu.js';
import validateMixin from '@/mixins/validateMixin';

export default {
  components: {
    Loading,
  },
  // mixins: [wechatMenu],
  data() {
    return {
      mobile: '', //手机号
      code: '', //验证码
      name: '', //姓名
      formType: 1, //表单类型
      userInfo: null, //登录后返回的用户信息
      canClick: true, //是否可点击
      isSuccessPopShow: false, //是否显示领取成功弹窗
      btnTxt: '获取验证码',
      isDisabled: false, //验证码按钮状态
      inviteName: '', //邀请人信息
      status: 1,  //领取状态
      loginStatus: 0, //登录态
      studentId: 0, //我的学生id
      studentName: '', //我的姓名
      isOld: null, //是否老用户
      hasNew: null, //是否已领取
      scholarShipInfo: {}, //我的奖学金信息
      isPosterShow: false, //海报弹窗
      posterUrl: '', //海报地址
      friendsArr: ['未购课', '已购课', '已退费'], //好友状态
      issueArr: ['待发放', '已发放', '不发放', '活动结束'], //优惠券状态
      isRuleShow: false, //活动规则
      isOldPopShow: false, //老用户弹窗
      isEnd: 0, //活动是否已结束 0未结束，1已结束
    };
  },
  mixins: [wechatMenu, validateMixin],
  computed: {
    activity_id() {
      return Number(this.$route.query.activity_id) || 1;
    },
    version_id() {
      return Number(this.$route.query.version) || 1;
    },
    invite_student_id() {
      return Number(this.$route.query.student_id) || 0;
    },
  },
  watch: {
    status() {
      if (this.status === 2) {
        this.$wechat.ready((() => {
          this.$wechat.showMenuItems({
            menuList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline',
              'menuItem:copyUrl',
            ],
          });
          this.share({
            title: 'VIPX-好课分享，共同成长',
            desc: `${this.studentName}邀请你一起学习`,
            link: `${this.host}/activity/new-introduce?activity_id=1&student_id=${this.studentId}&version=1`,
            imgUrl: `${this.host}/static/imgs/logo.jpg`,
            type: 'link',
            dataUrl: '',
            success: () => {},
            fail: () => {},
          });
        }));
      }
    },
  },
  mounted() {
    //检测登录状态
    this.isLoginFunc();
    //未领取时不可以分享
    this.$wechat.ready((() => {
      if (this.status === 1) {
        this.$wechat.hideMenuItems({
          menuList: [
            'menuItem:share:appMessage',
            'menuItem:share:timeline',
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:favorite',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:editTag',
            'menuItem:delete',
            'menuItem:copyUrl',
            'menuItem:originPage',
            'menuItem:readMode',
            'menuItem:openWithQQBrowser',
            'menuItem:openWithSafari',
            'menuItem:share:email',
            'menuItem:share:brand',
          ],
        });
      }
    }));
  },
  methods: {
    //页面埋点
    setPageLog(loginType) {
      setApilog({
        event_type: 20012,
        ext1: this.activity_id,
        ext2: this.version_id,
        ext3: loginType,
        ext4: this.invite_student_id,
        ext5: '转介绍页面',
      });
    },
    //按钮埋点
    setBtnLog(btnType) {
      setApilog({
        event_type: 20013,
        ext1: this.activity_id,
        ext2: this.version_id,
        ext3: btnType,
        ext4: this.invite_student_id,
        ext5: '转介绍页面按钮',
      });
    },
    //判断是否登录
    isLoginFunc() {
      if (getItem('token')) {
        this.checkIntroduceAuth('no');
      } else {
        this.loginStatus = 1;
        this.setPageLog(0);
      }
    },
    //确认是否有资格
    checkIntroduceAuth(param) {
      const data = {
        activity_id: this.activity_id,
        version_id: this.version_id,
      };
      checkIntroduceAuth(data).then((res) => {
        if (res.error_code === 0) {
          this.loginStatus = 2;
          this.isOld = res.data.is_old;
          this.hasNew = res.data.has_new;
          this.inviteName = res.data.student.student;
          this.userInfo = res.data.me;
          this.studentId = res.data.me.id;
          this.studentName = res.data.me.realname;
          this.canClick = true;
          if (res.data.has_new === 1 || this.isOld === 1) {
            if (res.data.has_new === 1) {
              this.isSuccessPopShow = true;
            } else {
              this.isOldPopShow = true;
            }
            this.status = 2;
            this.getMoneyList();
            this.setPageLog(2);
            return;
          }
          if (res.data.is_end === 1) {
            this.isEnd = res.data.is_end;
          }
          if (param === 'get') {
            this.getMoney();
          }
          this.setPageLog(1);
        } else {
          this.canClick = true;
          this.$vux.toast.show({
            type: 'text',
            text: res.error_msg,
            position: 'middle',
            time: 3000,
            width: '16em',
          });
        }
      });
    },
    //领取奖学金
    getScholarship() {
      if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入正确的手机号',
          position: 'middle',
          time: 3000,
          width: '16em',
        });
        return false;
      }
      if (this.formType === 1) {
        this.formType = 2;
        this.setBtnLog(0);
        return false;
      }
      if (this.code.length < 4 || this.code.length > 6 || isEmpty(this.code)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入4-6位的验证码',
          position: 'middle',
          time: 3000,
          width: '16em',
        });
        return false;
      }
      if (!this.validChinese(this.name).valid) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入中文姓名，不包含字符和空格',
          position: 'middle',
          time: 3000,
          width: '22em',
        });
        return false;
      }
      this.introduceReg();
      this.setBtnLog(1);
    },
    //注册登录
    introduceReg() {
      if (!this.canClick) {
        return false;
      }
      this.canClick = false;
      const data = {
        mobile: this.mobile,
        code: this.code,
        name: this.name,
      };
      introduceRegister(data).then((res) => {
        if (res.error_code === 0) {
          setItem('token', res.data.token);
          this.checkIntroduceAuth('get');
        } else {
          this.canClick = true;
          this.$vux.toast.show({
            type: 'text',
            text: res.error_msg,
            position: 'middle',
            time: 3000,
            width: '16em',
          });
        }
      });
    },
    // 获取验证码
    sendCode() {
      if (this.mobile.length !== 11 && !/1\d{10}/.test(this.mobile)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入正确的手机号',
          position: 'middle',
          time: 3000,
          width: '16em',
        });
        return false;
      }
      if (this.isDisabled) {
        return false;
      }
      sendSmsCode(this.mobile, 1).then((response) => {
        if (response.error_code !== 0) {
          this.$vux.toast.show({
            type: 'text',
            text: response.error_msg,
            position: 'middle',
            time: 3000,
            width: '12em',
          });
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: '验证码已发送',
            position: 'middle',
            time: 3000,
            width: '12em',
          });
        }
        this.isDisabled = true;
        this.countdown();
      });
    },
    // 倒计时
    countdown() {
      let seconds = 60;
      this.timer = setInterval(() => {
        this.btnTxt = `已发送(${seconds})`;
        if (seconds === 0) {
          this.isDisabled = false;
          this.btnTxt = '重新发送';
          clearInterval(this.timer);
        }
        seconds -= 1;
      }, 1000);
    },
    //领取奖学金
    getMoney() {
      // if (this.isEnd === 1) {
      //   this.$vux.toast.show({
      //     type: 'text',
      //     text: '活动已结束',
      //     position: 'middle',
      //     time: 3000,
      //     width: '16em',
      //   });
      //   return;
      // }
      const data = {
        activity_id: this.activity_id,
        version_id: this.version_id,
        invite_student_id: this.invite_student_id,
      };
      getMoney(data).then((res) => {
        if (res.error_code === 0) {
          this.isSuccessPopShow = true;
          this.inviteName = res.data.student;
          this.status = 2;
          this.getMoneyList();
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.error_msg,
            position: 'middle',
            time: 3000,
            width: '16em',
          });
        }
        this.canClick = true;
      });
    },
    //获取列表
    getMoneyList() {
      const data = {
        activity_id: this.activity_id,
        version_id: this.version_id,
      };
      getMoneyList(data).then((res) => {
        if (res.error_code === 0) {
          this.scholarShipInfo = res.data.data;
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.error_msg,
            position: 'middle',
            time: 3000,
            width: '16em',
          });
        }
        this.canClick = true;
      });
    },
    //获取海报
    getPoster() {
      if (!this.canClick) {
        return false;
      }
      this.canClick = false;
      const data = {
        activity_id: this.activity_id,
        version_id: this.version_id,
      };
      getPoster(data).then((res) => {
        if (res.error_code === 0) {
          this.isPosterShow = true;
          this.posterUrl = res.data.invite_img_url;
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.error_msg,
            position: 'middle',
            time: 3000,
            width: '16em',
          });
        }
        this.canClick = true;
      });
      this.setBtnLog(3);
    },
    //滑动限制
    stop() {
      const mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', mo, { passive: false });//禁止页面滑动
    },
    //取消滑动限制
    move() {
      const mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = 'scroll';//出现滚动条
      document.removeEventListener('touchmove', mo, { passive: false });
    },
  },
};
</script>


<style lang="less">
@import '../../../styles/basic.less';
.int_con{
  background: #FD2352;
  .int_banner_box{
    position: relative;
    .int_banner{
      display: block;
      width: 100%;
      height: auto;
    }
    .red_box{
      width: 6.65rem;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      .game_rule{
        position: absolute;
        left: 0;
        right: 0;
        bottom: .64rem;
        text-align: center;
        line-height: 1.5;
        z-index: 2;
        .rule{
          display: block;
          font-size: .28rem;
          color: #FFA59D;
          &.sp{
            font-weight: bold;
            text-align: right;
            padding-right: 1.3rem;
            color: #F4DF32;
          }
          em{
            display: inline-block;
            font-style: normal;
            padding-left: .3rem;
            background: url('../../../assets/introduce/check_cur.png') no-repeat 0 center;
            background-size: .23rem;
            font-weight: bold;
            span{
              color: #F4DF32;
            }
          }
          
        }
        p{
          font-size: .24rem;
          color: #FBAC2F;
          a{
            color: #FBAC2F;
          }
        }
      }
      .red_header{
        display: block;
        width: 7.23rem;
        margin-left: -.58rem;
      }
      .red_main{
        padding: 0 1rem 1.5rem .91rem;
        margin-top: -.02rem;
        background: url('../../../assets/introduce/repeat_bg.png') repeat-y 0 0;
        background-size: 100% auto;
        height: auto;
        overflow: hidden;
        &.s2{
          padding-bottom: 1.1rem;
        }
        .red_form_item{
          height: .7rem;
          background: #FDF8E8;
          border-radius: .35rem;
          margin-top: .2rem;
          position: relative;
          input{
            width: 100%;
            height: 100%;
            padding: 0 .3rem;
            font-size: .3rem;
            line-height: 100%;
            background: none;
            border: none;
            outline: none;
            &::-webkit-input-placeholder {
              color: #A16954;
            }
            &.code{
              width: 55%;
            }
          }
          .get_code{
            display: block;
            width: 45%;
            line-height: .7rem;
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            font-size: .3rem;
            color: #A16954;
          }
          .line{
            display: block;
            width: .02rem;
            height: .3rem;
            background: #A16954;
            position: absolute;
            left: 55%;
            top: .2rem;
          }
        }
        .invite_tips{
          display: block;
          width: 3.77rem;
          height: .87rem;
          margin: .2rem auto 0;
        }
        .red_form_btn{
          display: block;
          width: 4.02rem;
          height: 1.08rem;
          padding: .1rem 0;
          line-height: .88rem;
          font-size: .4rem;
          color: #FF1746;
          text-align: center;
          font-weight: bold;
          margin: .2rem auto 0;
          background: url('../../../assets/introduce/form_btn.png') no-repeat 0 0;
          background-size: 100%;
          &.mt0{
            margin-top: -.1rem;
          }
        }
      }
    }
  }
  .int_main{
    padding: 1.34rem .3rem .56rem;
    margin-top: -.7rem;
    position: relative;
    z-index: 1;
    background:url('../../../assets/introduce/gradient_bg.png') no-repeat 0 0;
    background-size: 100% auto;
    .scholarship_con{
      padding: 0 .2rem;
      height: auto;
      overflow: hidden;
      .scholarship_item{
        background:linear-gradient(0deg,rgba(255,183,0,1),rgba(255,218,147,1));
        border-radius:.2rem;
        padding: .15rem;
        margin-top: .4rem;
        &.item_sp{
          margin-top: 0;
        }
        .scholarship_item_center{
          padding: .4rem .3rem;
          background: #fff;
          border: .08rem solid #F38727;
          box-shadow:inset 0 .07rem .38rem 0 rgba(231,180,69,0.71);
          border-radius:.2rem;
          .my_scholarship{
            height: 1.13rem;
            padding: 0 2rem 0 1.25rem;
            position: relative;
            img{
              display: block;
              width: 1.1rem;
              position: absolute;
              left: 0;
              top: 0;
            }
            h2{
              line-height: 0.64rem;
              font-size: .36rem;
              font-weight: bold;
            }
            p{
              line-height: .4rem;
              font-size: .24rem;
            }
            .total_money{
              display: block;
              line-height: 1.13rem;
              font-size: .36rem;
              font-weight: bold;
              color: #FF3457;
              position: absolute;
              right: 0;
              top: 0;
              em{
                font-weight: bold;
                font-size: .72rem;
                font-style: normal;
              }
            }
          }
          .yellow_line{
            margin: .4rem .1rem 0;
            height: 1px;
            background: #FFD777;
          }
          .scholarship_flex{
            display: flex;
            text-align: center;
            &.mt28{
              margin-top: .28rem;
            }
            &.mt60{
              margin-top: .6rem;
            }
            .num{
              flex: 1;
              font-size: .48rem;
              line-height: .72rem;
            }
            .num_name{
              flex: 1;
              font-size: .24rem;
              line-height: .48rem;
              color: #999999;
            }
            .friends{
              flex: 1;
              font-size: .3rem;
              line-height: .68rem;
              &.red_color{
                color:#FF3457;
              }
              &.gray_color{
                color:#999;
              }
            }
          }
          .list_title{
            display: block;
            width: 5.1rem;
            height: .44rem;
            margin: 0 auto;
          }
        }
      }
    }
    .planc_info_box{
      padding: .6rem .3rem .5rem;
      background: #fff;
      box-shadow:0 .08rem .19rem .02rem rgba(149,51,0,0.27);
      border-radius:.2rem;
      margin-top: .6rem;
      &.planc_sp{
        margin-top: 0;
      }
      .planc_info_title{
        display: block;
        margin: 0 auto;
        &.t1{
          width: 6.3rem;
          height: .44rem;
        }
        &.t2{
          width: 3.84rem;
          height: .43rem;
        }
        &.t3{
          width: 4.04rem;
          height: .43rem;
        }
        &.t4{
          width: 4.84rem;
          height: .44rem;
        }
      }
      .planc_info_subtitle{
        font-size: .24rem;
        color: #FF7C00;
        line-height: .3rem;
        margin-top: .2rem;
        text-align: center;
      }
      .place_info_item{
        display: flex;
        padding: .6rem 0;
        border-bottom: .02rem dashed #FE763A;
        &:last-child{
          border-bottom: none;
          padding-bottom: .1rem;
        }
        .img_box{
          width: 3.12rem;
          height: 3.12rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .img_info{
          flex: 1;
          position: relative;
          .img_info_con{
            position: absolute;
            left: 0;
            right: .2rem;
            top: 50%;
            transform: translate(0, -50%);
            &.sp{
              left: .2rem;
              right: 0;
            }
            h4{
              color: #FF4153;
              font-size: .36rem;
              font-weight: bold;
              line-height: .36rem;
              margin-bottom: .2rem;
            }
            p{
              font-size: .24rem;
              line-height: .32rem;
              color: #606060;
            }
          }
        }
      }
      .four_promise{
        padding-top: .3rem;
        display: flex;
        &.first{
          padding-top: .6rem;
        }
        .promise_item{
          flex: 1;
          margin-left: .3rem;
          height: 3.7rem;
          background: #F8F8F8;
          border-radius: .1rem;
          padding: .2rem .2rem 0;
          &:first-child{
            margin-left: 0;
          }
          img{
            display: block;
            width: 1.51rem;
            height: 1.51rem;
            margin: 0 auto;
          }
          h4{
            font-weight: bold;
            color: #504746;
            line-height: .5rem;
            padding: .05rem 0 .1rem;
            text-align: center;
          }
          p{
            color: #6C6C6C;
            font-size: .22rem;
            line-height: .36rem;
          }
        }
      }
      .certificate{
        display: block;
        width: 6.34rem;
        height: auto;
        margin: .5rem auto 0;
      }
      .about_vipx{
        color: #504746;
        font-size: .24rem;
        line-height: .44rem;
        margin-top: .44rem;
      }
    }
  }
  .getSuccessPop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 999;
    .getSuccessPop_con{
      width: 6.2rem;
      background: #fff;
      border-radius: .2rem;
      padding: .74rem .5rem .5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      &.rule_con{
        width: 6.9rem;
        height: 70%;
        .rule_main{
          height: 100%;
          overflow-y: auto;
        }
        h3{
          font-size: .3rem;
          font-weight: bold;
          text-align: center;
        }
        h4{
          font-size: .28rem;
          font-weight: bold;
          margin-top: .2rem;
        }
      }
      .close_ico{
        display: block;
        width: .75rem;
        height: .75rem;
        position: absolute;
        right: 0;
        top: 0;
        background: url('../../../assets/close.png') no-repeat center;
        background-size: .25rem;

      }
      p{
        text-align: center;
        font-size: .28rem;
        line-height: .52rem;
        span{
          color: #FF3457;
        }
        &.rule_item{
          line-height: 1.5;
          text-align: left;
        }
      }
      .btn_group{
        margin: .38rem 0 0;
        display: flex;
        a{
          display: block;
          flex: 1;
          margin: 0 .3rem;
          line-height: .6rem;
          border-radius: .3rem;
          text-align: center;
          font-size: .3rem;
          &.share_btn{
            background: #FF3457;
            color: #fff;
          }
          &.home_btn{
            border: .02rem solid #FF3457;
            background: #fff;
            color: #FF3457;
          }
        }
      }
      
    }
    .poster_con{
      width: 80%;
      left: 10%;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);
      img{
        display: block;
        width: 100%;
        height: auto;
      }
      p{
        margin-top: .2rem;
        text-align: center;
        font-size: .28rem;
        color: #fff;
      }
    }
  }
}
.loadingPop{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  padding: 0 1rem;
  background: rgba(0,0,0,0.7);
  border-radius: .1rem;
}
.pulldow-loading{
  color: #fff;
}
</style>