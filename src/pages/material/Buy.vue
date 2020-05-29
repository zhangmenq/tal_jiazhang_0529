<template>
  <div class="material-buy">
    <div class="item-box">
      <div class="comm-tit">购买教材</div>
      <p class="title" @click="material()">
        {{ bookInfo.title }}
      </p>
      <p class="price">
        <span class="current">¥{{ bookInfo.price | formatMoney }}</span>
      </p>
    </div>
    <div class="item">
      <group>
        <x-input title="收货人" placeholder="请输入收件人姓名" v-model="info.name" text-align="right"></x-input>
      </group>
      <group>
        <x-input title="地址"
            is-link
            v-model="selectCities"
            @click.native="selectCity()"
            text-align="right"
            :show-clear=false
            placeholder="请选择地址">
        </x-input>
      </group>
      <group>
        <x-input title="详细地址" placeholder="请输入详细地址" v-model="info.address" text-align="right"></x-input>
      </group>
      <group>
        <x-input title="手机号码" placeholder="请输入您的手机号码" v-model="info.mobile" text-align="right" :max="11"></x-input>
      </group>
    </div>
    <x-button class="btn-confirm btn-purple" @click.native="saveInfo()">
      确认
    </x-button>
  </div>
</template>

<script>
import { Checker, CheckerItem, Cell, Group, XButton, XInput } from 'vux';
import { isEmpty } from 'lodash';
import { getAddress, setAddress, updateAddress, getBookInfo, orderDetail } from '@/api';
import { formatMoney } from '@/filters';
import Picker from '@/utils/picker/picker.js';
import areas from '@/utils/areas.js';

export default {
  name: 'buyBook',
  components: {
    Checker,
    CheckerItem,
    Cell,
    Group,
    XButton,
    XInput,
  },
  computed: {
    from() {
      return this.$store.state.route.from.name;
    },
    orderId() {
      if (this.$route.query.order_id) {
        return this.$route.query.order_id;
      }
      return 0;
    },
  },
  data() {
    return {
      bookInfo: {
        price: 0,
      },
      info: {
        area_id: '',
        name: '',
        address: '',
        mobile: '',
        area: {},
      },
      errorInfo: '',
      errorFlag: false,
      selectCities: '北京市 市辖区 东城区',
      areaId: '3',
    };
  },
  filters: { formatMoney },
  /* eslint-disable */
  methods: {
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
          this.areaId = '3';

          if (Array.isArray(item)) {
            item.forEach((city) => {
              this.selectCities += city.name + ' ';
              this.areaId = String(city.id);
            });
          }
        },
      });
    },
    getBookInfo() {
      getBookInfo(this.$route.params.bookId).then(() => {
        this.bookInfo = this.$store.state.bookInfo;
      });
    },
    getInfo() {
      if (this.orderId) {
        orderDetail(this.orderId).then((res) => {
          if (res.error_code === 0 && res.data.book) {
            this.info = {
              area_id: res.data.book.area_id,
              name: res.data.book.name,
              mobile: res.data.book.mobile,
              address: res.data.book.address,
              area: {
                id: res.data.book.area_id,
                tree_path: res.data.book.area.replace(/,/g, ' '),
              },
            };
          }
          if (this.info.area_id) {
            this.selectCities = this.info.area.tree_path;
            this.areaId = String(this.info.area.id);
          }
        });
      } else {
        getAddress().then((res) => {
          if (res.error_code === 0 && res.data !== null) {
            this.info = res.data;
          }
          if (this.info.area_id) {
            this.selectCities = this.info.area.tree_path;
            this.areaId = String(this.info.area.id);
          }
        });
      }
    },
    checkInfo() {
      this.errorFlag = false;
      this.errorInfo = '';
      const cityArr = this.selectCities.split(' ');
      if (cityArr.length < 3) {
        this.errorFlag = true;
        this.errorInfo = '【所在地区】填写有误，需要重新选择';
      }
      if (isEmpty(this.info.name)) {
        this.errorFlag = true;
        this.errorInfo = '请填写收货人';
      } else if (isEmpty(this.info.address)) {
        this.errorFlag = true;
        this.errorInfo = '请填写详细地址';
      } else if (isEmpty(this.areaId)) {
        this.errorFlag = true;
        this.errorInfo = '请填写详细地址';
      } else if (isEmpty(this.info.mobile)) {
        this.errorFlag = true;
        this.errorInfo = '请完整填写联系方式';
      } else if (!isEmpty(this.info.mobile) && !/^1\d{10}$/.test(this.info.mobile)) {
        this.errorFlag = true;
        this.errorInfo = '请正确填写联系方式';
      }
    },
    saveInfo() {
      this.checkInfo();
      if (this.errorFlag) {
        const errorInfo = this.errorInfo;
        this.$vux.toast.show({
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: errorInfo,
          width: '17.6em',
          type: 'warn',
        });
        return;
      }
      if (this.from === 'orderDetails') {
        const data = {
          order_id: this.orderId,
          name: this.info.name,
          mobile: this.info.mobile,
          address: this.info.address,
          area_id: String(this.areaId),
        };
        updateAddress(this.$route.query.order_id, data).then((res) => {
          if (res.error_code === 0) {
            this.$router.go(-1);
          } else {
            this.$vux.toast.show({
              time: 1500,
              type: 'warn',
              isShowMask: true,
              position: 'middle',
              text: '物流已发货，不允许再修改地址',
              width: '17.6em',
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          }
        });
      } else{
        const data = {
          name: this.info.name,
          mobile: this.info.mobile,
          address: this.info.address,
          area_id: String(this.areaId),
        };
        setAddress(data).then((res) => {
          if (res.error_code === 0) {
            this.$router.go(-1);
          }
        });
      }
    },
    material() {
      this.$router.push({
        name: 'material',
        params: {
          bookId: this.$route.params.bookId,
        },
      });
    },
  },
  destroyed() {
    this.$vux.toast.hide();
  },
  async mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await this.getBookInfo();
    await this.getInfo();
    await this.$store.dispatch('updateLoading', {
      loading: false,
    });
  },
};
</script>

<style lang="less">
  @import '../../styles/basic.less';

  .material-buy{
    padding-top: .2rem;
    background: @col-bg;
    min-height: 100%;
    .item-box{
      .item-box;
      font-size: .24rem;
    }
    .item{
      .item-box(0rem);
      overflow: hidden;
      .weui-cells{
        .weui-cells;
        .vux-cell-value,.vux-popup-picker-placeholder{
          color: @col-darkgray;
        }
        color: @col-darkgray;
        font-size: .24rem;
        .weui-label{
          color: @col-gray;
        }
        .weui-cell__bd{
          .placeholder-c(@col-darkgray)
        }
      }
    }
    .title{
      margin-top: .2rem;
      line-height: .4rem;
      font-size: .3rem;
    }
    .comm-tit{
      .comm-tit(.36rem,@col-darkgray);
    }
    .check-box{
      margin-top: .2rem;
      .cus-checker;
      .checkbox-item{
        .checkbox-icon{
          top: .06rem;
        }
      }
    }
    .price{
      text-align: right;
      line-height: .36rem;
      font-size: .3rem;
      .original{
        font-size: .26rem;
        text-decoration:line-through;
        color: @col-gray;
      }
      .current{
        padding-left: .16rem;
        color: @col-orange;
      }
    }
    .btn-confirm{
      margin-top: 1rem;
      width: 76.8%;
      border-radius: .08rem;
      font-size: .36rem;
      .btn-purple;
    }
  }
</style>
