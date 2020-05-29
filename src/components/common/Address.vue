<template>
  <div class="address-box">
    <div class="item-box-logistics" v-if="address" @click="editAddress(1)">
      <div class="icon-box"><em class="address-icon"></em></div>
      <div class="logistics-address-info">
        <p>
          <span class="user-name">{{address.name}}</span>
          <span class="mobile" v-if="address.mobile">{{address.mobile | formatMobile}}</span>
        </p>
        <p class="address">{{address.area.tree_path}}{{address.address}}</p>
        <p class="address_tips">为了保证您及时收到学习资料，请准确填写。 </p>
      </div>
      <a href="javascript:;" class="address_btn edit_ico" @click="editAddress(1)">修改</a>
    </div>
    <div class="item-box-logistics sp" v-else @click="editAddress(0)">
      <div class="address-null">
        <p>您还没有填写收货地址~</p>
        <p class="address_tips">为了保证您及时收到学习资料，请准确填写。 </p>
      </div>
      <a href="javascript:;" class="address_btn add_ico" @click="editAddress(0)">添加</a>
    </div>
    <p class="address-bar"></p>
    <!--没有地址提示-->
    <div class="address_pop" v-if="addressTipsShow">
      <div class="address_pop_mask"></div>
      <div class="address_con">
        <div class="address_con_txt">为了保证您及时收到学习资料，请准确填写。</div>
        <div class="address_con_btn">
          <a href="javascript:;" class="address_pop_cancel" @click="cancelPop()">取消</a>
          <a href="javascript:;" class="address_pop_confirm" @click="editAddress(0)">确认</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMobile } from '@/filters';

export default {
  props: {
    address: {
      type: Object,
      default: {},
    },
    addressTipsShow: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatMobile,
  },
  data() {
    return {
      add: false,
    };
  },
  watch: {
    addressTipsShow(newValue, oldValue) {
      console.log(oldValue);
      return newValue;
    },
  },
  methods: {
    //编辑地址
    editAddress(editType) {
      let id = 0;
      if (editType === 1) {
        id = this.address.id;
      }
      this.$router.push({
        name: 'addressDetails',
        query: { edit_source: 'back' },
        params: { id },
      });
    },
    cancelPop() {
      this.$emit('cancelAddressTips', false);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.address-bar{
  .wh(100%, .06rem);
  .bg-m('@{img-path}/address-bar.png');
  background-size: 100% 100%;
}
.item-box-logistics{
  background-color: @col-bg-address;
  padding: .3rem .9rem .3rem .4rem;
  display: flex;
  flex-direction: row;
  font-size: .3rem;
  position: relative;
  &.sp{
    padding: .5rem .9rem .5rem .4rem;
  }
  .icon-box{
    margin-right: .2rem;
    .address-icon{
      margin-top: .2rem;
      display: inline-block;
      .wh(.3rem,.36rem);
      .bg-m('@{img-path}/address-icon.png');
      background-size: 100% 100%;
    }
  }
  .logistics-address-info{
    flex: 1;
    .user-name{
      padding-right: .6rem;
    }
    .address{
      .wordbreak;
    }
  }
  .address-null{
    
  }
}
.address_tips{
  margin-top: .14rem;
  color: #FE763A;
  font-size: .26rem;
}
.address_btn{
  display: block;
  width: .5rem;
  line-height: .3rem;
  position: absolute;
  right: .3rem;
  top: 50%;
  transform: translate(0, -50%);
  font-size: .24rem;
  text-align: center;
  color: #4A4A4A;
  &.add_ico{
    padding-top: .43rem;
    background:url('../../assets/add_address_ico.png') no-repeat center top;
    background-size: .33rem;
  }
  &.edit_ico{
    padding-top: .4rem;
    background:url('../../assets/edit_address_ico.png') no-repeat center top;
    background-size: .16rem .3rem;
  }
}
.address_pop{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  .address_pop_mask{
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .address_con{
    width: 5.25rem;
    height: 3.8rem;
    background: #fff;
    border-radius:10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: .7rem .45rem;
    .address_con_txt{
      font-size: .3rem;
      color: #1B223F;
      line-height: .5rem;
      text-align: center;
    }
    .address_con_btn{
      margin-top: .7rem;
      height: .7rem;
      padding: 0 .25rem;
      a{
        display: block;
        width: 1.4rem;
        border: 1px solid #9A57C8;
        font-size: .3rem;
        line-height: .68rem;
        border-radius:10px;
        text-align: center;
        &.address_pop_cancel{
          float: left;
          color: #9A57C8;
        }
        &.address_pop_confirm{
          float: right;
          color: #fff;
          background: #9A57C8;
        }
      }
    }
  }
}
</style>

