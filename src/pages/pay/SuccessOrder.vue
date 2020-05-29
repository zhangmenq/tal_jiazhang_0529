<template>
  <div class="success-order">
    <div class="cover">
      <div class="pay-success">
        <em class="icon"><img src="../../assets/success-order-img1.png"/></em>
        <h3>支付成功<i><!-- +300金 币--></i></h3>
      </div>
      <div class="write-border paycont">
        <h2>{{ title }}</h2>
        <p class="bottom-line"></p>
        <!--购买课程-->
        <ul v-if="!orderInfo.buy_book">
          <li>
            <span>订单编号：</span>{{ orderInfo.order_sn }}
          </li>

          <li v-if="orderInfo.book && orderInfo.title">
            <span>课程金额：</span>{{ orderInfo.total_fee - orderInfo.book.total_fee | formatMoney }}元
          </li>
          <li v-else>
            <span>课程金额：</span>{{ orderInfo.total_fee | formatMoney }}元
          </li>

          <li v-if="orderInfo.book && orderInfo.title">
            <span>教材金额：</span>{{ orderInfo.book.total_fee | formatMoney }}元
          </li>
          <li v-if="(orderInfo.total_fee - orderInfo.pay_fee) > 0">
            <span>优惠金额：</span>{{ (orderInfo.total_fee - orderInfo.pay_fee) | formatMoney }}元
          </li>
          <li><span>实际支付：</span>{{ orderInfo.pay_fee | formatMoney }}元</li>
          <li><span>支付时间：</span>{{ orderInfo.paid_at }}</li>
          <li><span>支付方式：</span>{{ orderInfo.pay_way }}</li>
        </ul>
        <!--购买教材-->
        <ul v-if="orderInfo.buy_book">
          <li>
            <span>订单编号：</span>{{ orderInfo.order_sn }}
          </li>
          <li>
            <span>订单金额：</span>{{ orderInfo.total_fee | formatMoney }}元
          </li>
          <li v-if="(orderInfo.total_fee - orderInfo.pay_fee) > 0">
            <span>优惠金额：</span>{{ (orderInfo.total_fee - orderInfo.pay_fee) | formatMoney }}元
          </li>
          <li><span>实际支付：</span>{{ orderInfo.pay_fee | formatMoney }}元</li>
          <li><span>支付时间：</span>{{ orderInfo.paid_at }}</li>
          <li><span>支付方式：</span>{{ orderInfo.pay_way }}</li>
        </ul>
      </div>
      <p class="go-test" v-if="userInfo.level_id === 67">
        <i>!</i>
        <span>您当前无级别，请级别测试</span>&nbsp;&nbsp;
        <span @click="goTest()" class="purple">入学测>></span>
      </p>

      <div class="see-course" v-if="!orderInfo.buy_book">
        <x-button class="weui-btn" @click.native="course()" v-if="isExp">
        查看课程
        </x-button>
        <x-button class="weui-btn" @click.native="rulePop = true" v-else>查看课程细则</x-button>
      </div>
      <div class="see-course" v-else>
        <x-button class="weui-btn" @click.native="goOrderList()">
        查看订单
        </x-button>
      </div>

      <p class="presell-tips" v-if="isPresell">
        <span>
          注：关注公众号“学而思VIPX”，进入“预约报名-我的订单-已付款”查看订单；
          <br>
          我们的课程顾问老师会尽快联系您，请注意接听我们的电话哦~
        </span>
      </p>
    </div>
    <div class="rule" v-if="rulePop">
      <h1>调转补退规则</h1>
      <p><em>*</em><span>所有操作可在VIPX微信公众账号和学而思APP上进行。</span></p>
      <p><em>*</em><span>所有的调转补退机制都只针对1对1课程，TV课不支持单独的调转补退。</span></p>
      <p><em>*</em><span>插班报的调课、转班、退费规则与整期报的规则一致。</span></p>
      <p class="part">一、调课规则</p>
      <p><em>1、</em><span>调课定义：只可对某节课进行单次调课，允许换上课老师和上课时间点；</span></p>
      <p><em>2、</em><span>Reach课程和HE课程一学年课程分为第1、2、3、4四个学段。每学段可分别调课3次。</span></p>
      <p><em>3、</em><span>调课可操作距上课时间大于等于24小时，小于等于14天内（含操作当天）的课程。可调入范围为大于等于24小时，小于等于14天内（含操作当天）的时间段。操作调课后，一周内最多允许上3节课</span></p>
      <p class="part">二、转班规则</p>
      




      <p><em>1、</em><span>转班定义：可对剩下未开课的所有课节进行整体转班，允许换上课老师和上课时间点；</span></p>
      <p><em>2、</em><span>每学段课程开课前，可以随时转班，不消耗转班机会；每学段课程开课后，学员有2次转班机会，当学段内使用。</span></p>
      <p><em>3、</em><span>操作转班时，如距离最近一次课大于等于24h，剩余课节可进行转班，即时生效（以老师实际可授课时间为准）;如距离最近一次课小于24h，最近一次课无法变更。</span></p>
      <p><em>*</em>备注：</p>
      <p><span>若转班前操作了某节课的调课，不可对调过的课节进行转班，该课节以调课的老师和时间为准；</span></p>
      <p class="part">三、课程退费规则</p>
      <p><em>1、</em><span>同一级别，学员享有一次全额退款的权利，且全额退款指学员上完第一节课且在第二节课开课24小时之前可以全额退费</span></p>
      <p><em>2、</em><span>2、学员在第二次课开课后退费（含第二次课）</span></p>
      <p>应退金额 = 实际缴费课程金额 - 课单价（见备注1） ✖️ 实际消耗课次</p>
      <p>备注：</p>
      <p><em class="sub">1)</em><span>课单价 = ( 订单实际缴费金额 - 教材费 ) /  购买课节数</span></p>
      <p><em class="sub">2)</em><span>如若订单中未购买教材，则该订单中的教材费为0元。</span></p>
      <p><em class="sub">3)</em><span>学员在操作退费时，若最近一次课离上课时间小于24小时，该课节不予退费</span></p>
      <p class="part">四、Reach教材退费规则</p>
      <p>若学员购买了教材，在发生退费时规则如下：</p>
      <p><em class="sub">(1)</em><span>以学员购买成功当天计算，30天内且教材未拆封，可操作退费。</span></p>
      <p><em class="sub">(2)</em><span>以学员购买成功当天计算，超过30天，则不可操作退费。</span></p>
      <p><em class="sub">(3)</em><span>若教材已拆封，则不可操作退费。</span></p>
      <x-button class="weui-btn" @click.native="course()">
        查看课程
      </x-button>
    </div>
    <!--续报购买教材入口-->
    <div class="renewal_book" v-if="is_show_buy_bookbt">
      <a href="javascript:;" @click="buyBook()"><img :src="orderInfo.book_cover_url" class="book_img"></a>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
import { isEmpty } from 'lodash';
import { orderDetail, getUserInfo, getBook, setPointLog } from '@/api';
import { formatMoney } from '@/filters';
import { goTest } from '@/utils';

/* eslint-disable */
export default {
  name: 'successOrder',
  components: {
    XButton,
  },
  filters: { formatMoney },
  data() {
    return {
      orderInfo: {
        course: {},
      },
      midCourse: false, //插班报
      title: '',
      userInfo: {
        level_id: 0,
      },
      rulePop: false,
      isExp: false,
      is_show_buy_bookbt: false,
    };
  },
  computed: {
    orderId() {
      return this.$route.query.order_id;
    },
    isPresell() {
      return Boolean(this.$route.query.presell);
    },
  },
  watch: {
    rulePop(newVal) {
      if (newVal) {
        document.title = '课程细则';
      } else {
        document.title = '支付成功';
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await getUserInfo().then(() => {
      this.userInfo = this.$store.state.userInfo;
    });
    await orderDetail(this.orderId).then((res) => {
      if (res.error_code === 0) {
        this.orderInfo = res.data;
        if(res.data.buy_book === 1){
          this.title = res.data.book.title;
        }else{
          if (this.isPresell) {
            this.title = '美国小学体验课';
          } else {
            if (isEmpty(res.data.package)) {
              this.title = res.data.course[0].title;
              this.isExp = Boolean([3, 5].indexOf(res.data.course[0].type) > -1);
            } else {
              this.title = res.data.package.title;
            }
            // isEmpty(res.data.package) ? this.title = res.data.course[0].title : this.title = res.data.package.title;
          }
        }
        
        if (res.data.is_show_buy_bookbt){
          this.is_show_buy_bookbt = true;
        }
      }
    });
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
  methods: {
    course() {
      if (this.isPresell) {
        this.$router.push({
          name: 'paidOrder',
        });
        return;
      }
      this.$router.push({
        name: this.midCourse ? 'learning' : 'notyet',
      });
    },
    goTest() {
      goTest(this.userInfo.grade_id, this.userInfo.level_id);
    },
    goOrderList() {
      this.$router.push({
        path: '/mine/order/paid'
      })
    },
    buyBook() {
      getBook(this.orderInfo.order_id).then((res) => {
        if (res.error_code === 0){
          this.$router.push({
            name: 'orderMaterial',
            query: {
              order_id: this.orderInfo.order_id
            },
          })
        } else {
          this.$vux.toast.show({
            text: res.error_msg,
            type: 'warn',
            time: 2000,
            width: '17.6em',
          });
          return;
        }
      });
      setPointLog(124, '/mine/order/paid', 2);
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.renewal_book{
  height: 1.24rem;
  width: 100%;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  padding-top: .05rem;
  a{
    display: block;
    width: 6.88rem;
    height: 1.13rem;
    background: url(/static/imgs/renewal/book_buy_btn.png) no-repeat 0 0;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
    .book_img{
      display: block;
      width: .87rem;
      height: 1.21rem;
      position: absolute;
      left: .2rem;
      bottom: .04rem;
    }
  }
}
.success-order{
  position: relative;
  background: @col-bg;
  font-size: .3rem;
  color: @col-darkgray;
  height: 100%;
  .cover{
    .bg-m('@{img-path}/success-order-img1.jpg',0,0,no-repeat);
    background-size: 100%;
    .pay-success{
      text-align: center;
      color: @col-white;
      font-size: .36rem;
      height: 4.2rem;
      padding-top: .5rem;
      em{
        .wh(1.36rem,1.36rem);
        background: @col-white;
        border-radius: 100%;
        margin: 0 auto 0.1rem;
        display: flex;
        align-items: center;
        justify-content:center;
      }
      i{
        font-size: .26rem;
        display: block;
        margin: .1rem 0 0 0;
      }
    }
    .write-border{
      padding: 0 .3rem;
      background: @col-white;
      border-radius: .2rem;
      margin: .2rem .2rem 0 .2rem;
    }
    .paycont{
      margin: -.8rem .2rem 0 .2rem;
      box-shadow: 0 .1rem .1rem #efefef;
      h2{
        font-size: .36rem;
        color: @col-darkgray;
        padding: .3rem 0;
        // min-height: .96rem;
        // .l-h(.96rem);
      }
      ul{
        padding-bottom: .3rem;
        &.cost-details{
          li{
            display: flex;
            justify-content: space-between;
          }
        }
        li{
          margin-top: .3rem;
          font-size: .26rem;
          color: @col-darkgray;
          span{
            color: @col-gray;
          }
        }
      }
      .bottom-line{
        border-bottom: .01rem solid @col-gray;
      }
    }
    .see-course{
      margin: .9rem .9rem .5rem;
      .weui-btn, .btn-view{
        display: block;
        font-size: .36rem;
        .l-h(.9rem);
        border-radius: .1rem;
        .btn-purple;
        text-align: center;
      }
    }
    .see-course-gray{
      margin: .9rem .9rem .5rem;
      .weui-btn{
        font-size: .36rem;
        .l-h(.9rem);
        border-radius: .1rem;
        .btn-plain;
        background: none;
        color: @col-darkgray;
      }
    }
    .presell-tips {
      margin: .05rem 1rem;
      font-size: .24rem;
      line-height: .4rem;
      text-align: left;
      color: #fd1a1f;
    }
    .go-test{
      text-align: center;
      font-size: .26rem;
      i{
        display: block;
        margin: .6rem auto .4rem;
        border-radius: 100%;
        color: @col-white;
        font-size: .6rem;
        .wh(.9rem,.9rem);
        line-height: .9rem;
        background: @col-yellow;
      }
      span{
        padding: .5rem 0;
        &.purple{
          color: @col-purple;
        }
      }
    }
  }
}
.rule{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  padding: .4rem .2rem 1.1rem;
  line-height: .46rem;
  background: #fff;
  font-size: .26rem;
  color: #1C223D;
  h1{
    text-align: center;
    font-size: .36rem;
    &:after{
      content: '';
      display: block;
      margin: .3rem;
      height: .01rem;
      background:rgba(234,231,229,1);
    }
  }
  .part{
    margin-top: .36rem;
  }
  p{
    display: flex;
    em{
      width: .3rem;
      &.sub{
        width: .45rem;
      }
    }
    span{
      flex: 1;
    }
  }
  .weui-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    .wh(100%,.9rem);
    line-height: .9rem;
    font-size: .36rem;
    text-align: center;
    .btn-purple;
  }
}
</style>
