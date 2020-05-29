<template>
  <div class="mine-w" ref="mine">
    <div class="item">
      <router-link class="avatar" :to="{name: 'profile'}">
        <img v-if="resData.avatar_url" :src="resData.avatar_url"/>
        <img v-else src="../../assets/default-photo.png"/>
      </router-link>
      <p class="name">
        {{resData.realname}}
        <span v-if="resData.sex === 1" class="male"></span>
        <span v-if="resData.sex === 2" class="female"></span>
      </p>
      <div class="infor">
        <span class="level">
          <i>级别：</i>
          <!-- {{resData.level_id != 67 ? (resData.grade_name_en + resData.level_name) : '无级别'}} -->
          {{ resData.grade_level_name }}
        </span>
      </div>
    </div>
    <div class="item">
      <group>
        <cell title="我的订单" link="/mine/order">
          <span slot="icon" class="mine-icon ifont-mine-order"></span>
        </cell>
        <!-- <cell title="我的钱包" link="/mine/wallet">
          <span slot="icon" class="mine-icon wallet-icon"></span>
        </cell> -->
        <cell title="我的优惠券" link="/mine/coupon">
          <span slot="icon" class="mine-icon ifont-mine-coupon"></span>
        </cell>
        <cell title="收货地址" link="/mine/address">
          <span slot="icon" class="mine-icon ifont-mine-address"></span>
        </cell>
        <cell title="快递查询" link="/mine/logistics">
          <span slot="icon" class="mine-icon ifont-mine-logistics"></span>
        </cell>
        <!-- <cell title="我的积分" link="/mine">
          <span slot="icon" class="mine-icon integral-icon"></span>
        </cell> -->
      </group>
    </div>
    <div class="item">
      <group>
        <cell title="我的课程" link="/mine/course">
          <span slot="icon" class="mine-icon ifont-mine-course"></span>
        </cell>
        <cell title="入学测" is-link value="无级别，请点击测试" @click.native="enterTest()" v-if="resData.level_id == 67">
          <span slot="icon" class="mine-icon ifont-mine-test"></span>
        </cell>
        <cell title="入学测" is-link @click.native="enterTest()" v-else>
          <span slot="icon" class="mine-icon ifont-mine-test"></span>
        </cell>
        <cell title="调课记录" link="/mine/record/adjust">
          <span slot="icon" class="mine-icon ifont-circle-adjusting"></span>
        </cell>
        <cell title="转班记录" link="/mine/record/classroom">
          <span slot="icon" class="mine-icon ifont-mine-transfer"></span>
        </cell>
      </group>
    </div>
    <div class="item">
      <group>
        <!-- <cell title="推荐有奖" is-link @click.native="recommended(1)">
          <span slot="icon" class="mine-icon ifont-mine-recommended-prize"></span>
        </cell> -->
        <cell title="我的推荐" is-link @click.native="recommended(2)">
          <span slot="icon" class="mine-icon ifont-mine-recommended"></span>
        </cell>
      </group>
    </div>
    <div class="item">
      <group>
         <cell title="我的报告" link="/mine/report">
          <span slot="icon" class="mine-icon ifont-mine-report"></span>
        </cell>
        <cell
          title="绑定手机号"
          :value="resData.ism || '未绑定'"
          v-if="pyUid">
          <span slot="icon" class="mine-icon ifont-mine-bindmob"></span>
        </cell>
        <cell title="我关注的老师" link="/mine/favorite">
          <span slot="icon" class="mine-icon ifont-mine-favorite"></span>
        </cell>
        <cell title="修改密码" link="/modify-password">
          <span slot="icon" class="mine-icon ifont-mine-modpwd"></span>
        </cell>
      </group>
    </div>
    <x-button class="btn-exit" @click.native="btnExit()" v-if="!pyUid">
      <span>退出当前账户</span>
    </x-button>
    <p class="hotline">
      客服电话：
      <a href="tel:4008002211">4008002211 </a>转9
    </p>
    <pop-up v-show="popUp" popType="qualification" @close="popUp = false"></pop-up>
  </div>
</template>

<script>
import { Cell, Group, XButton } from 'vux';
// import { Base64 } from 'js-base64';
// import { getUserInfo, getReport } from '@/api';
import { getUserInfo } from '@/api';
import getOrigin from '@/utils/origin';
import { goTest } from '@/utils/index.js';
import setPaddingBottom from '../../mixins/setPaddingBottom';
import { clearLocalStorage, getItem, setItem } from '../../utils/localStorage';
import { clearSessionStorage } from '../../utils/sessionStorage';
import PopUp from '../activities/introduce/PopUp';

export default {
  name: 'mine',
  components: {
    Cell,
    Group,
    XButton,
    PopUp,
  },
  mixins: [setPaddingBottom],
  data() {
    return {
      resData: '',
      pyUid: '',
      popUp: false,
      testId: 0,
      // private: 0, // 个人报告
      // composite: 0, // 综合报告
    };
  },
  computed: {
    origin() {
      if (getOrigin().startsWith('peiyou')) {
        return true;
      }
      return false;
    },
  },
  methods: {
    btnExit() {
      const openId = getItem('openid') || '';
      const bookPop = getItem('book_pop');
      this.$http.delete(`${this.apiConfig.host}/tal/login/password?open_id=${openId}`).then((res) => {
        if (res.error_code === 0) {
          clearLocalStorage();
          clearSessionStorage();
          if (bookPop) {
            setItem('book_pop', 1);
          }
          window.location.href = '/login';
        }
      });
    },
    getUserInfor() {
      return getUserInfo().then(() => {
        this.resData = this.$store.state.userInfo;
        this.$http.get(`${this.apiConfig.host}content/papers/test-result-verify?student_id=${this.resData.id}&grade_id=${this.resData.grade_id}&level_id=${this.resData.level_id}`).then((res) => {
          if (res.data.id) {
            this.testId = res.data.id;
          }
        });
      });
    },
    enterTest() {
      if (this.testId === 0 || this.resData.level_id === 67) {
        goTest(this.resData.id, this.resData.grade_id, this.resData.level_id, this.testId);
      } else {
        this.$router.push({
          name: 'testRecord',
        });
      }
    },
    recommended(type) {
      this.$http.get(`${this.apiConfig.host}student/introduce-qualification`).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        if (res.data === 1) {
          if (type === 1) {
            if (this.origin) { // 培优统计
              this.$http.get(`${this.apiConfig.host}student/active-count?type=peiyou_recommend_click`);
            } else {
              this.$http.get(`${this.apiConfig.host}student/active-count?type=my_recommend_click`);
            }
            this.$router.push({ // 推荐有奖
              name: 'introduceRecommendedPrize',
            });
          } else {
            this.$router.push({ // 我的推荐
              name: 'introduceMyRecommended',
            });
          }
        } else {
          this.popUp = true;
        }
      });
    },
    // 查看是否有报告，个人报告和综合报告
    // async checkReport() {
    //   const res = await getReport(this.resData.id, 1);
    //   const ret = await getReport(this.resData.id, 2);
    //   if (res.error_code === 0) {
    //     this.private = 1;
    //   }
    //   if (ret.error_code === 0) {
    //     this.composite = 1;
    //   }
    // },
    // goReport() {
    //   this.$router.push({
    //     name: 'stageTest',
    //     query: {
    //       private: this.private,
    //       composite: this.composite,
    //       student_id: Base64.encode(this.resData.id),
    //     },
    //   });
    // },
  },
  async mounted() {
    this.pyUid = getItem('peiyou-uid');
    await this.getUserInfor();
    // await this.checkReport();
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.mine-w{
  min-height: 100%;
  padding: 1.5rem .2rem 1.2rem;
  .bg-m('@{img-path}/mine-bg.jpg');
  background-color: @col-bg;
  background-size: 100% auto;
  .item{
    margin-bottom: .2rem;
    border-radius: .08rem;
    background: #fff;
    .avatar{
      display: block;
      .pos-box-lc(1.6rem,1.6rem);
      top: -.8rem;
      border-radius: 100%;
      overflow: hidden;
      .box-shadow(0 .08rem .24rem rgba(77,112,245,.2));
      img{
        .wh-img;
      }
    }
    .name{
      font-size: .36rem;
      .male,.female{
        .wh(.26rem,.26rem);
        display: inline-block;
        .bg-m('@{img-path}/sex-icon.png');
        background-size: .26rem .52rem;
        vertical-align: middle;
      }
      .male{
        background-position: 0 -.26rem;
      }
    }
    .infor{
      display: flex;
      margin-top: .1rem;
      span{
        flex: 1;
        line-height: .6rem;
        i{
          color: @col-gray;
        }
        &:before{
          content: '';
          position: relative;
          top: -.04rem;
          display: inline-block;
          .wh(.6rem,.6rem);
          margin-right: .2rem;
          .bg-m('@{img-path}/mine-type-icon.png');
          background-size: .6rem 1.2rem;
          vertical-align: middle;
        }
        &.level:before{
          background-position: 0 0;
        }
        &.integral:before{
          background-position: 0 -.6rem;
        }
      }
    }
    &:first-of-type{
      position: relative;
      padding: .8rem .3rem .2rem;
      text-align: center;
      .box-shadow(0 .06rem .24rem rgba(0,0,0,.06));
    }
    .weui-cells{
      margin: 0;
      border-radius: .08rem;
      &:before,&:after{
        border: none;
      }
      .weui-cell{
        padding: 0 .2rem;
        font-size: .3rem;
        line-height: .9rem;
      }
      .weui-cell_access .weui-cell__ft{
        padding-right: .3rem;
      }
      .weui-cell_access .weui-cell__ft:after{
        right: 0rem;
        margin-top: -.08rem;
        .wh(.18rem,.18rem);
      }
    }
  }
  .refund-icon {
    display: block;
    margin-right: .16rem;
    .wh(.3rem,.3rem);
    .bg-m('@{img-path}/refund-icon.png');
    background-size: .3rem .3rem;
  }
  .mine-icon{
    display: block;
    margin-right: .16rem;
    .wh(.3rem,.3rem);
    line-height: .3rem;
    text-align: center;
    color: @col-light-purple;
  };
  // .ifont-mine-stage {
  //   display: block;
  //   margin-right: .16rem;
  //   .wh(.3rem,.3rem);
  //   .bg-m('@{img-path}/report.jpg');
  // }
  .btn-exit{
    margin-top: .4rem;
    width: 81%;
    border: .01rem solid @col-gray;
    border-radius: .8rem;
    font-size: .36rem;
    color: @col-gray;
  }
  .hotline{
    margin-top: .2rem;
    font-size: .3rem;
    color: @col-gray;
    text-align: center;
    a{
      color: @col-purple;
    }
    &:before{
      content: '';
      display: inline-block;
      margin-right: .1rem;
      vertical-align: middle;
      .wh(.4rem,.4rem);
      .bg-m('@{img-path}/hotline-icon.png');
      background-size: .4rem .4rem;
    }
  }
}
</style>
