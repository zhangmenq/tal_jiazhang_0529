<template>
  <div class="address-details">
    <div class="content" v-if="!isLoading">
      <group class="form-group">
        <x-input
          title="收货人 "
          placeholder="请输入收件人姓名"
          :max="20"
          :readonly = isreadonly
          v-model="name"></x-input>
      </group>
      <group class="form-group">
        <x-input
          title="联系电话"
          placeholder="请输入您的手机号码"
          type="tel"
          :max="11"
          :readonly = isreadonly
          v-model="mobile"></x-input>
      </group>
      <group class="form-group">
        <x-input
          v-if="!isreadonly"
          class="weui-cell_access"
          title="所在地区"
          placeholder="请选择收货人所在地址"
          is-link
          :show-clear="false"
          v-model="selectCities"
          @click.native="selectCity()"
          ></x-input>
           <x-input v-else
          class="weui-cell_access"
          title="所在地区"
          placeholder="请选择收货人所在地址"
          is-link
          :show-clear="false"
          v-model="selectCities"
          :readonly = isreadonly
          ></x-input>
      </group>
      <group class="form-group">
        <x-textarea
          :readonly = isreadonly
          title="详细地址"
          placeholder="请输入收货人详细地址信息，如街道，门牌 号，小区，单元等"
          v-model="address"
          :max="200"
          :rows="1"
          :show-counter="false"
          :autosize="true"
          ></x-textarea>
      </group>
    </div>
      <loading v-else></loading>
    <x-button class="save"
    v-if="!isreadonly"
      :class="{'btn-purple': isSave}"
      :disabled="isDisable"
      @click.native="save()">保存</x-button>
  </div>
</template>

<script>
import { XButton, Group, XInput, XTextarea } from 'vux';
import { isEmpty } from 'lodash';
import Loading from '@/components/loading/Index';
import { saveLogisticsAddress, getLogisticsAddress, saveSingleLogisticsAddress } from '@/api/index.js';
import Picker from '@/utils/picker/picker.js';
import areas from '@/utils/areas.js';

export default {
  name: 'addressDetails',
  components: {
    XButton,
    Group,
    XInput,
    XTextarea,
    Loading,
  },
  data() {
    return {
      selectCities: '',
      areaId: '',
      name: '',
      mobile: '',
      address: '',
      isDisable: false,
      isLoading: true,
      orderBookId: '',
      bookId: '',
      isRead: 0,
      logisticsId: '',
      isSingleSave: 1, // 0表示待发货的列表修改，1表示详情单条地址修改
    };
  },
  computed: {
    isSave() {
      if (isEmpty(this.name)
        || isEmpty(this.mobile)
        || isEmpty(this.address)
        || isEmpty(this.areaId)) {
        return false;
      }
      return true;
    },
    isreadonly() {
      return this.isRead > 0;
    },
  },
  methods: {
    /* eslint-disable */
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
    // 保存收货地址
    saveLogisticsAddressFun() {
       const params = {
        order_book_id: this.orderbookId ,
        book_id: this.bookId ,
        mobile: this.mobile,
        name: this.name,
        area_id: this.areaId,
        address: this.address,
      };
      saveLogisticsAddress(params).then((res) => {
        let text = '保存成功';
        let type = 'success';
        if (res.error_code !== 0) {
          this.isDisable = true;
          text = '保存失败';
          type = 'warn';
        }
        this.$vux.toast.show({
          text,
          type,
          time: 2000,
          isShowMask: true,
          position: 'middle',
          width: '17.6em',
        });
        if (res.error_code === 0) {
          setTimeout(() => {
            this.$router.go(-1);
          }, 2000);
        }
      });
    },
     // 保存单条收货地址
    saveSingleLogisticsAddressFun() {
       const params = {
        mobile: this.mobile,
        name: this.name,
        area_id: this.areaId,
        address: this.address,
      };
      saveSingleLogisticsAddress(params,this.logisticsId).then((res) => {
        let text = '保存成功';
        let type = 'success';
        if (res.error_code !== 0) {
          this.isDisable = true;
          text = '保存失败';
          type = 'warn';
        }
        this.$vux.toast.show({
          text,
          type,
          time: 2000,
          isShowMask: true,
          position: 'middle',
          width: '17.6em',
        });
        if (res.error_code === 0) {
          setTimeout(() => {
            this.$router.go(-1);
          }, 2000);
        }
      });
    },
    save() {
      if (!this.isSave || this.isDisable) {
        return;
      }
      const cityArr = this.selectCities.split(' ');
      if (cityArr.length < 3) {
        this.$vux.toast.show({
          type: 'warn',
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: '【所在地区】填写有误，需要重新选择',
          width: '17.6em',
        });
        return;
      }
      if (!/^1\d{10}$/.test(this.mobile)) {
        this.$vux.toast.show({
          type: 'warn',
          time: 2000,
          isShowMask: true,
          position: 'middle',
          text: '手机号码格式不正确',
          width: '17.6em',
        });
        return;
      }
      this.isDisable = true;
     if(this.isSingleSave > 0) {
       this.saveSingleLogisticsAddressFun();
       return 
     };
      this.saveLogisticsAddressFun();
    },
  //获取当前收货地址
  getlogisticsAddress(id) {
     this.isLoading = true;
      getLogisticsAddress(id).then((res) => {
      this.isLoading = false;
      if (res.error_code > 0 || isEmpty(res.data)) {
        this.$vux.toast.show({
          text: res.error_msg || '操作失败',
          type: 'warn',
          time: 2000,
          isShowMask: true,
          position: 'middle',
          width: '17.6em',
        });
        setTimeout(() => {
         this.$router.go(-1);
        }, 2000);
        return;
      }
      this.mobile = res.data.mobile;
      this.name = res.data.user_name;
      this.areaId = String(res.data.area_id);
      this.address = res.data.address;
      // this.student_id = res.data.order_book.student_id;
      if (!isEmpty(res.data.area) && !isEmpty(res.data.area.tree_path)) {
        const selectCities = res.data.area.tree_path;
        this.selectCities = selectCities.replace(/,/g, ' ');
      }
    });
  },
},
  created() {
    this.orderbookId = this.$route.query.order_book_id;
    this.bookId = this.$route.query.book_id;
    this.logisticsId = this.$route.params.id;
    this.isRead = this.$route.query.isreadonly;
    this.isSingleSave = Number(this.$route.query.isShowAdress);
    this.getlogisticsAddress(this.logisticsId)
  },
  mounted() {},
};
</script>
<style lang="less" >
@import '../../../styles/basic.less';

.address-details {
  min-height: 100%;
  background: @col-bg;
  .content {
    margin-top: .2rem;
    padding-bottom: .3rem;
    background: #fff;
    .box-shadow(0 0 .03rem rgba(0,0,0,0.15));
    .form-group{
      margin: 0 .4rem;
      border-bottom: .01rem solid #ECE8E7;
      .weui-cells {
        .weui-cells;
        font-size: .3rem;
        .weui-cell {
          padding: 0 .1rem 0 0;
        }
        .weui-input{
          .ellipsis-b;
        }
        .weui-textarea{
          padding: .2rem 0;
          line-height: .4rem;
        }
      }
      &:last-child{
        border: none;
      }
      &.textarea:disabled{
        background: transparent;
      }
    }
  }
  .save {
    .wh(77%, .9rem);
    position: fixed;
    bottom: 1.17rem;
    left: 50%;
    transform: translate(-50%,0);
    font-size: .36rem;
    .btn-disable-white;
    .box-shadow(.05rem .05rem .1rem .04rem rgba(117,0,139,0.15));
    &.btn-purple{
      .btn-purple-shadow;
    }
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: @col-gray;
    font-size: .26rem;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: @col-gray;
    font-size: .26rem;
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
