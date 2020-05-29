<template>
  <div >
    <div v-if="!loadingData">
      <ul v-if="lists.length > 0">
        <li class="item-box loginstics-box" v-for="item in lists" :key="item.id">
          <p class="item-title"  v-if="item.book && item.book.title && item.status === -1">{{item.book.title}}</p>
           <p class="item-title"  v-if="item.book && item.book.title && item.status === 0" @click="viewDetails(item.order_book_id,item.book_id)">{{item.book.title}}</p>
          <div class="item-cancel-box" v-if="item.status === -1">
            <div class="item-cancel">
              <span class="cancel-img"></span>
            </div>
          </div>
          <div class="item-func" v-else>
            <div class="btn-fn" @click="editAddress(item.id,item.order_book_id,item.book_id)">
              <x-button class="btn-plain-purple">
                修改地址
              </x-button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <no-data :tips="tips"></no-data>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { XButton } from 'vux';
import logisticsList from '@/mixins/logisticsList';
import Loading from '@/components/loading/Index';
import NoData from '@/components/logistics/nodata';

export default {
  name: 'notShipped',
  components: {
    XButton,
    Loading,
    NoData,
  },
  mixins: [logisticsList],
  data() {
    return {
      tips: '暂无数据',
      status: 0,
      isShowAdress: 0, // 1表示显示修改，0表示不显示修改
    };
  },
  methods: {
    editAddress(id, orderBookId, bookId) {
      this.$router.push({
        name: 'editeAddress',
        params: { id },
        query: {
          order_book_id: orderBookId,
          book_id: bookId,
          isShowAdress: this.isShowAdress,
        },
      });
    },
    // 查看商品详情
    viewDetails(orderBookId, bookId) {
      this.$router.push({
        name: 'goodsInfo',
        query: {
          order_book_id: orderBookId,
          book_id: bookId,
          isShowAdress: this.isShowAdress,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "./style.less";
</style>
