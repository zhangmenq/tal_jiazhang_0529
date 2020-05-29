<template>
  <div class="address">
    <loading v-if="isLoading"></loading>
    <div class="list" v-else-if="list.length > 0">
      <div class="content" v-for="(item, index) in list" :key="index">
        <div class="address-info">
          <p class="name-mobile">
            <span class="name">{{item.name}}</span>
            <span>{{item.mobile}}</span>
          </p>
          <p class="details">
            {{getAddress(item.area.tree_path, item.address)}}
          </p>
        </div>
        <div class="line"></div>
        <div class="edit" @click="goDetail(item.id)">编辑</div>
      </div>
    </div>
    <div v-else class="no-address">
      <no-content
        :tips="'暂无收货地址<br>请点击下方按钮，添加收货地'"
        :defaultImg="'nofiltrateteacher'">
      </no-content>
      <x-button class="btn-purple" @click.native="goDetail(0)">+新增收货地址</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';
import { isEmpty } from 'lodash';
import NoContent from '@/components/common/NoContent';
import Loading from '@/components/loading/Index';
import { getAddressList, setApilog } from '@/api/index';

export default {
  name: 'address',
  components: {
    XButton,
    NoContent,
    Loading,
  },
  data() {
    return {
      list: [],
      isLoading: true,
    };
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        name: 'addressDetails',
        params: { id },
      });
    },
    getAddress(treePath, address) {
      if (isEmpty(treePath)) {
        return;
      }
      const str = treePath.replace(/,/g, '');
      return str + address;
    },
  },
  mounted() {
    getAddressList().then((res) => {
      this.isLoading = false;
      if (res.error_code > 0) {
        return;
      }
      this.list = res.data;
    });
    setApilog({
      event_type: 70010,
      route: '/mine/address',
    });
  },
};
</script>

<style lang="less" scoped>
@import '../../../styles/basic.less';

@address-gray: #D8D8D8;
.address{
  min-height: 100%;
  background: @col-bg;
  overflow: hidden;
  .list {
    margin-top: .1rem;
    .content {
      display: flex;
      justify-content: space-between;
      margin: .1rem 0;
      padding: .3rem 0;
      background-color: #fff;
      font-size: .3rem;
      color: @col-darkgray;
      .address-info {
        margin-left: .4rem;
        width: 5.27rem;
        p {
          line-height: .42rem;
          &.details {
            margin-top: .12rem;
            .ellipsis-b;
          }
          .name{
            padding-right: .6rem;
          }
        }
      }
      .line {
        .wh(.02rem, .5rem);
        margin-top: .52rem;
        background-color: @address-gray;
      }
      .edit {
        margin-top: .52rem;
        margin-right: .4rem;
        line-height: .42rem;
        color: @col-purple;
      }
    }
  }
  .btn-purple{
    .wh(70%, .9rem);
    position: fixed;
    bottom: 1.17rem;
    left: 15%;
    .btn-purple-shadow;
    font-size: .36rem;
  }

}

</style>
