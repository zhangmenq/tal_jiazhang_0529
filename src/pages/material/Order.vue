<template>
  <div class="material-order">
    <loading v-if="isLoading"></loading>
    <template v-else>
      <div class="item-box-fluid">
        <h4>请选择是否需要教材</h4>
      </div>
      <div class="radio-box">
        <checker v-model="isBook" type="radio" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
          <checker-item :value="1" @on-item-click="selBook">
            <em class="radio-icon"></em><p>选择教材</p>
          </checker-item>
        </checker>
        <p class="tips">温馨提示：教材退费申请请在购买成功后30天内操作，并请保持教材完好，拆封后不予退费。</p>
      </div>
      <div class="item-box">
        <div class="material">
          <em class="cover" v-if="book.cover_url">
            <img :src="book.cover_url" />
          </em>
          <div class="content">
            <p class="name" v-if="book.title">{{book.title}}</p>
            <p class="price">
              <span>¥{{book.pay_fee | formatMoney}}</span>
              <em class="original" v-if="book.total_fee > book.pay_fee">{{book.total_fee | formatMoney}}</em>
            </p>
          </div>
        </div>
        <div class="intro-box">
          <dl>
            <dt>内容介绍：</dt>
            <dd class="intro" :class="{'active': introHeight > tempHeight && !isShow}"
              v-if="book.introduce">
              <p>
                {{book.introduce}}
              </p>
            </dd>
          </dl>
          <p class="change-show" v-if="introHeight > tempHeight">
            <span :class="{'active': isShow}" @click="changeShow">{{showTxt}}</span>
          </p>
        </div>
      </div>
      <loading v-if="loadingAddress"></loading>
      <div class="item-box" v-else-if="isBook == 1">
        <group class="form-group">
          <x-input title="收货人"
            placeholder="请输入收件人姓名"
            v-model="addressInfo.name"
            text-align="right"
            :max="20">
          </x-input>
        </group>
        <group class="form-group">
          <x-input title="联系电话"
            placeholder="请输入您的手机号码"
            v-model="addressInfo.mobile"
            text-align="right"
            :max="11">
          </x-input>
        </group>
        <group class="form-group area">
          <x-input title="所在地区"
            is-link
            v-model="selectCities"
            @click.native="selectCity()"
            text-align="right"
            :show-clear=false
            placeholder="城市，区域">
          </x-input>
        </group>
        <group class="form-group address">
          <!-- <x-input title="详细地址" placeholder="请输入详细地址" v-model="addressInfo.address" text-align="right"></x-input> -->
          <x-textarea
            title="详细地址"
            placeholder="请输入详细地址"
            v-model="addressInfo.address"
            :show-counter="false"
            :autosize="true"
            :rows="1">
          </x-textarea>
        </group>
      </div>
      <!--正常购课流程-->
      <div class="nav-next" v-if="!queryOrderId">
        <x-button
          class="btn-purple"
          @click.native="goConfirmOrder()"
          v-if="!isDisable"
        >
          下一步
        </x-button>
        <x-button
          class="btn-purple"
          :class="{'btn-disable-purple': isDisable}"
          v-else
        >
          下一步
        </x-button>
      </div>
      <!--单独购买教材-->
      <div class="nav-next" v-else>
        <x-button
          class="btn-purple"
          @click.native="goBookOrder()"
          v-if="!isBuyDisable"
        >
          下一步
        </x-button>
        <x-button
          class="btn-purple"
          :class="{'btn-disable-purple': isBuyDisable}"
          v-else
        >
          下一步
        </x-button>
      </div>
      <p class="temp">
        <br><br>
      </p>
    </template>
  </div>
</template>
<script>
import { Checker, CheckerItem, XButton, Group, XInput, XTextarea } from 'vux';
import {
  getCourseLists,
  getAddress,
  setAddress,
  getBook,
  setBookOrder,
  setPointLog,
} from '@/api';
import { isEmpty } from 'lodash';
import Picker from '@/utils/picker/picker.js';
import areas from '@/utils/areas.js';
import { formatMoney } from '@/filters';
import Loading from '@/components/loading/Index';
import getOrigin from '@/utils/origin';
import { setTimeout } from 'timers';

export default {
  components: {
    Checker,
    CheckerItem,
    XButton,
    Group,
    XInput,
    XTextarea,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      isDisable: false,
      isBook: 0,
      isShow: false,
      book: {},
      tempHeight: null,
      introHeight: null,
      addressInfo: {
        area_id: '',
        name: '',
        address: '',
        mobile: '',
        area: {},
      },
      errorFlag: false,
      errorInfo: '',
      selectCities: '',
      areaId: '',
      selCount: 0,
      loadingAddress: false,
      queryOrderId: null,
      isBuyDisable: true,
    };
  },
  filters: { formatMoney },
  computed: {
    orderQuery() {
      return this.$route.query;
    },
    showTxt() {
      return this.isShow ? '收起' : '展开';
    },
  },
  /* eslint-disable */
  methods: {
    changeShow() {
      this.isShow = !this.isShow;
      // this.showState.showTxt = this.showState.isShow ? '收起' : '展开';
    },
    getHeight() {
      if (this.book.introduce) {
        this.introHeight = document.querySelector('.intro').offsetHeight;
      }
      this.tempHeight = document.querySelector('.temp').offsetHeight;
    },
    selectCity() {
      new Picker({
        title: '地址',
        defaultValue: this.selectCities,
        type: 3,
        data: areas,
        keys: {
          id: 'id',
          value: 'name',
          childData: 'childData',
        },
        callBack: (item) => {
          this.selectCities = '';
          this.areaId = '';

          if (Array.isArray(item)) {
            item.forEach((city) => {
              this.selectCities += city.name + ' ';
              this.areaId = String(city.id);
            });
          }
        },
      });
    },
    checkInfo() {
      this.errorFlag = false;
      this.errorInfo = '';
      const cityArr = this.selectCities.split(' ');
      if (cityArr.length < 3) {
        this.errorFlag = true;
        this.errorInfo = '【所在地区】填写有误，需要重新选择';
      }
      if (isEmpty(this.addressInfo.name)) {
        this.errorFlag = true;
        this.errorInfo = '请填写收货人';
      } else if (isEmpty(this.addressInfo.mobile)) {
        this.errorFlag = true;
        this.errorInfo = '请填写手机号';
      } else if (!/^1\d{10}$/.test(this.addressInfo.mobile)) {
        this.errorFlag = true;
        this.errorInfo = '请填写正确的手机号';
      } else if (isEmpty(this.areaId)) {
        this.errorFlag = true;
        this.errorInfo = '请填写所在地区';
      } else if (isEmpty(this.addressInfo.address)) {
        this.errorFlag = true;
        this.errorInfo = '请填写详细地址';
      }
    },
    selBook() { // 第一次选择教材获取地址
      if (this.isShow && this.isBook == 0) {
        this.isShow = false;
      }
      if(this.isBook == 1){
        this.isBuyDisable = true;
      }else{
        this.isBuyDisable = false;
      }
      if (this.selCount > 0) {
        return;
      }
      this.selCount += 1;
      this.loadingAddress = true;
      getAddress().then((res) => {
        this.loadingAddress = false;
        if (res.error_code !== 0 || !res.data) {
          return false;
        }
        this.addressInfo = {
          area_id: res.data.area_id,
          name: res.data.name,
          mobile: res.data.mobile,
          address: res.data.address,
          area: {
            id: res.data.area.id,
            tree_path: res.data.area.tree_path.replace(/,/g, ' '),
          },
        };
        this.selectCities = this.addressInfo.area.tree_path;
        this.areaId =  String(this.addressInfo.area.id);
      });
    },
    goConfirmOrder() {
      this.$set(this.orderQuery, 'is_book', Number(this.isBook) || 0);
      // 未选择教材
      if (Number(this.isBook) !== 1) {
        this.$router.push({
          name: 'confirmOrder',
          query: this.orderQuery,
        });
        return;
      }
      // 校验教材
      this.checkInfo();
      if (this.errorFlag) {
        this.$vux.toast.show({
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: this.errorInfo,
          width: '17.6em',
          type: 'warn',
        });
        return;
      }
      this.isDisable = true;
      const params = {
        area_id: this.areaId,
        name: this.addressInfo.name,
        mobile: this.addressInfo.mobile,
        address: this.addressInfo.address,
      };
      setAddress(params).then((res) => {
        this.isDisable = false;
        if (res.error_code !== 0) {
           this.$vux.toast.show({
            time: 2000,
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
            type: 'warn',
          });
          return;
        }
        this.$router.push({
          name: 'confirmOrder',
          query: this.orderQuery,
        });
      });
      setPointLog(125, '/material', 1);
    },
    getCourseLists() {
      this.isLoading = true;
      let orders = {
        id: Number(this.orderQuery.type) === 1 ? this.orderQuery.course_id : this.orderQuery.package_id,
        teacher_id: this.orderQuery.teacher_id,
        type: this.orderQuery.type,
        week: this.orderQuery.week,
        time: this.orderQuery.time,
      };
      if (this.orderQuery.exp) {
        this.$set(orders, 'date', this.orderQuery.date);
      }
      getCourseLists(orders).then((res) => {
        this.isLoading = false;
        if (res.error_code !== 0 || isEmpty(res.data.book)) {
          this.$set(this.orderQuery, 'is_book', 0);
          this.$router.push({
            name: 'confirmOrder',
            query: this.orderQuery,
          });
          return;
        }
        this.book = res.data.book;
        this.$nextTick(() => {
          this.getHeight();
        });
      });
    },
    //单独购买教材--获取教材信息
    getBookById() {
      this.isLoading = true;
      getBook(this.queryOrderId).then( (res) => {
        this.isLoading = false;
        if(res.error_code === 0){
          this.book = res.data.book;
          this.$nextTick(() => {
            this.getHeight();
          });
        } else if (res.error_code === 10307){
          this.$vux.toast.show({
            time: 2000,
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
            type: 'warn',
          });
          setTimeout( () => {
            this.$router.push({
              name: 'unpayOrder',
            });
          }, 2000);
        } else if (res.error_code === 10317){
          this.$vux.toast.show({
            time: 2000,
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
            type: 'warn',
          });
          setTimeout( () => {
            this.$router.push({
              name: 'paidOrder',
            });
          }, 2000);
        }
      })
    },
    //单独购买教材去订单页
    goBookOrder() {
      // 校验教材
      this.checkInfo();
      if (this.errorFlag) {
        this.$vux.toast.show({
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: this.errorInfo,
          width: '17.6em',
          type: 'warn',
        });
        return;
      }
      this.isBuyDisable = true;
      const params = {
        area_id: this.areaId,
        name: this.addressInfo.name,
        mobile: this.addressInfo.mobile,
        address: this.addressInfo.address,
      };
      setAddress(params).then((res) => {
        this.isBuyDisable = false;
        if (res.error_code !== 0) {
          this.$vux.toast.show({
            time: 2000,
            isShowMask: true,
            position: 'middle',
            text: res.error_msg,
            width: '17.6em',
            type: 'warn',
          });
          return;
        }
        let refer = 2;
        if(getOrigin() === 'wechat'){
          refer = 3;
        }
        const orderData = {
          'book_id': this.book.id,
          'order_id': this.queryOrderId,
          'refer': refer,
          'coupon_id': 0,
        }
        setBookOrder(orderData).then((res)=>{
          if(res.error_code === 0){
            this.$router.push({
              name: 'waitPay',
              query: {
                order_id: res.data.order_id,
              },
            });
          }else{
            this.$vux.toast.show({
              time: 2000,
              isShowMask: true,
              position: 'middle',
              text: res.error_msg,
              width: '17.6em',
              type: 'warn',
            });
          }
        })
        // this.$router.push({
        //   name: 'confirmOrder',
        //   query: this.orderQuery,
        // });
      });
    },
  },
  created() {
    var queryOrderId = this.$route.query.order_id;
    this.queryOrderId = queryOrderId;
  },
  mounted() {
    if(this.queryOrderId){
      this.getBookById();
    }else{
      this.getCourseLists();
    }
    
    // this.getAddress();
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.material-order{
  position: relative;
  padding: 0 0 1.2rem;
  min-height: 100%;
  background: @col-bg;
  // color: @col-darkgray;
  .nav-next{
    .nav-next;
    .weui-btn.btn-purple.btn-disable-purple{
      background: #bbb;
      color: #fff;
    }
  }
  .temp{
    line-height: .42rem;
    position: absolute;
    z-index: -1;
  }
  .item-box-fluid{
    .item-box-fluid;
    box-shadow:0 0 .03rem 0 rgba(0,0,0,0.15);
    h4{
      line-height: .5rem;
      font-size: .36rem;
      text-align: center;
    }
  }
  .radio-box{
    margin-bottom: .2rem;
    padding: 0 .3rem;
    .cus-checker;
    p{
      line-height: .5rem;
    }
    .tips{
      margin-top: .1rem;
      padding-left: .5rem;
      line-height: .3rem;
      font-size: .22rem;
      color: @col-orange;
    }
    em.radio-icon{
      top: .07rem;
    }
  }
  .item-box{
    margin: 0 .3rem .2rem;
    padding: .2rem .2rem .3rem;
    background: #fff;
    border-radius: .15rem;
    box-shadow:0 0 .03rem 0 rgba(0,0,0,0.15);
    .material{
      position: relative;
    }
    .cover{
      .pos-box(2.1rem,2.1rem);
      img{
        .wh-img;
      }
    }
    .content{
      padding: .15rem 0 .15rem 2.4rem;
      min-height: 2.1rem;
      .name{
        min-height: 1.2rem;
        line-height: .45rem;
        font-size: .32rem;
        .wordbreak;
      }
      .price{
        color: @col-orange;
        font-size: .38rem;
        .original{
          padding-left: .1rem;
          text-decoration: line-through;
          font-size: .28rem;
          color: @col-gray;
        }
      }
    }
    .intro-box{
      margin-top: .3rem;
      padding-top: .1rem;
      border-top: .01rem solid @col-border;
      dl{
        font-size: .3rem;
      }
      dt{
        font-weight: bold;
      }
      dd{
        line-height: .42rem;
        p{
          line-height: .42rem;
          .wordbreak;
        }
        &.active{
          p{
            .ellipsis-m(2);
          }
        }
      }
    }
    .change-show{
      margin-top: .2rem;
      text-align: right;
      color: @col-gray;
      span{
        position: relative;
        padding-right: .3rem;
        &:after{
          content: '';
          .pos-box-hc(.14rem,.24rem);
          right: 0;
          .bg-m('@{img-path}arrow-icon.png');
          background-size: .14rem .24rem;
          transform: rotate(90deg);
          transition: transform .3s;
        }
        &.active:after{
          transform: rotate(270deg);
        }
      }
    }
    .form-group{
      border-top: .01rem solid @col-border;
      &:first-of-type{
        border-top: none;
      }
      &.area{
        .weui-cells{
          .weui-input{
            padding-right: .5rem;
          }
          .vux-x-input{
            position: relative;
            &:after{
              content: '';
              .pos-box-hc(.14rem,.24rem);
              right: .1rem;
              .bg-m('@{img-path}arrow-icon.png');
              background-size: .14rem .24rem;
              transform: rotate(90deg);
            }
          }
          .weui-input{
            .ellipsis-b;
          }
        }
      }
    }
    .weui-cells{
      .weui-cells;
      font-size: .26rem;
      .weui-cell{
        padding: 0;
      }
      .vux-cell-value,.vux-popup-picker-placeholder{
        color: @col-darkgray;
      }
      color: @col-darkgray;
      font-size: .24rem;
      .weui-label{
        color: @col-gray;
        font-size: .3rem;
      }
      .weui-cell__bd{
        .placeholder-c(@col-darkgray)
      }
      .weui-input{
        .l-h(.9rem);
      }
      .weui-textarea{
        padding: .25rem 0;
        line-height: .4rem;
        text-align: right;
      }
    }
  }
}
.weui-toast_forbidden{
  .weui-icon_toast.weui-icon-success-no-circle:before{
    color: #fff;
  }
  .weui-toast__content{
    color: #fff;
  }
}
</style>
