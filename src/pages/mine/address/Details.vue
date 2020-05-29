<template>
  <div class="address-details">
    <div class="content" v-if="!isLoading">
      <group class="form-group">
        <x-input
          title="收货人 "
          placeholder="请输入收件人姓名"
          :max="20"
          v-model="name"></x-input>
      </group>
      <group class="form-group">
        <x-input
          title="联系电话"
          placeholder="请输入您的手机号码"
          type="tel"
          :max="11"
          v-model="mobile"></x-input>
      </group>
      <group class="form-group">
        <x-input
          class="weui-cell_access"
          title="所在地区"
          placeholder="请选择收货人所在地址"
          is-link
          :show-clear="false"
          v-model="selectCities"
          @click.native="selectCity()"
          ></x-input>
      </group>
      <group class="form-group">
        <x-textarea
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
    <x-button class="save"
      :class="{'btn-purple': isSave}"
      :disabled="isDisable"
      @click.native="save()">保存</x-button>
  </div>
</template>

<script>
import { XButton, Group, XInput, XTextarea } from 'vux';
import { isEmpty } from 'lodash';
import { saveAddress, getAddressInfo } from '@/api/index.js';
import Picker from '@/utils/picker/picker.js';
import areas from '@/utils/areas.js';

export default {
  name: 'addressDetails',
  components: {
    XButton,
    Group,
    XInput,
    XTextarea,
  },
  data() {
    return {
      selectCities: '',
      areaId: '',
      name: '',
      mobile: '',
      address: '',
      isDisable: false,
      isLoading: false,
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
    addressId() {
      return this.$route.params.id || 0;
    },
    editSource() {
      return this.$route.query.edit_source || '';
    },
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
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
      const params = {
        mobile: this.mobile,
        name: this.name,
        area_id: this.areaId,
        address: this.address,
      };
      saveAddress(params, this.addressId).then((res) => {
        let text = '保存成功';
        let type = 'success';
        if (res.error_code > 0) {
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
            if (this.editSource) {
              if (this.editSource === 'back') {
                this.$router.go(-1);
              } else {
                this.$router.push({
                  name: 'waitPay',
                  query: {
                    order_id: this.editSource,
                  },
                });
              }
              
            } else {
              this.$router.push({ name: 'address' });
            }
          }, 3000);
        }
      });
    },
  },
  mounted() {
    if (this.addressId > 0) {
      this.isLoading = true;
      getAddressInfo(this.addressId).then((res) => {
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
            this.$router.push({ name: 'address' });
          }, 2000);
          return;
        }
        this.mobile = res.data.mobile;
        this.name = res.data.name;
        this.areaId = String(res.data.area_id);
        this.address = res.data.address;
        if (!isEmpty(res.data.area) && !isEmpty(res.data.area.tree_path)) {
          const selectCities = res.data.area.tree_path;
          this.selectCities = selectCities.replace(/,/g, ' ');
        }
      });
    }
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';

.address-details {
  min-height: 100%;
  background: @col-bg;
  .content {
    margin-top: .1rem;
    padding-bottom: .2rem;
    background: #fff;
    .box-shadow(0 0 .03rem rgba(0,0,0,0.15));
    .form-group{
      margin: 0 .4rem;
      border-bottom: .01rem solid @col-border;
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
    }
  }
  .save {
    .wh(70%, .9rem);
    position: fixed;
    bottom: 1.17rem;
    left: 15%;
    font-size: .36rem;
    .btn-disable-white;
    .box-shadow(0 .07rem .16rem rgba(147,147,147,0.15));
    &.btn-purple{
      .btn-purple-shadow;
    }
    &:active{
      .btn-disable-white;
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
