<template>
<div>
  <div v-if="!loadingData">
    <ul v-if="lists.length > 0">
    <li class="item-box loginstics-box"  v-for="item in lists" :key="item.id">
      <p class="item-title"  v-if="item.book && item.book.title" @click="checkLogistics(item.order_book_id,item.book_id)">{{item.book.title}}</p>
      <div class="item-func">
        <div class="btn-fn"  @click="checkLogistics(item.order_book_id,item.book_id)">
          <x-button
            class="btn-plain-purple" >
            查看详情
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
      status: 1,
      tips: '暂无数据',
    };
  },
  methods: {
    checkLogistics(orderBookId, bookId) {
      this.$router.push({
        name: 'goodsInfo',
        query: {
          order_book_id: orderBookId,
          book_id: bookId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
