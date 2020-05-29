<template>
<div>
  <div v-if="!loadingData" >
    <ul v-if="lists.length > 0">
      <li class="item-box loginstics-box" v-for="item in lists" :key="item.id">
        <p class="item-title"  v-if="item.book && item.book.title" @click="getDetails(item.order_book_id,item.book_id)">{{item.book.title}}</p>
        <div class="item-func">
          <div class="btn-fn">
            <!-- 是否有退回 &&item.logistics_refunds.show_status === 1 -->
            <div  v-if='item.logistics_refund_id > 0 &&  item.logistics_refunds.show_status > 0 '>
              <x-button v-if="item.logistics_refunds.review_status===0" class="btn-purple" @click.native="sendBack(item.logistics_refund_id)">
                退回
              </x-button>
              <x-button v-if="(item.logistics_refunds.review_status !== 0 &&  item.logistics_refunds.review_status !== 2)&& item.logistics_refunds.refunds_status === 0" class="btn-purple input-btn" @click.native="sendBack(item.logistics_refund_id)">
                退回中
              </x-button>
              <x-button v-if="item.logistics_refunds.review_status === 2" class="btn-purple" @click.native="sendBack(item.logistics_refund_id)">
                退回失败
              </x-button>
              <x-button v-if="item.logistics_refunds.refunds_status === 1" class="btn-purple" @click.native="sendBack(item.logistics_refund_id)">
                已寄回
              </x-button>
            </div>
            <x-button @click.native="getDetails(item.order_book_id,item.book_id)" class="btn-plain-purple">
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
  name: 'signed',
  components: {
    XButton,
    Loading,
    NoData,
  },
  mixins: [logisticsList],
  data() {
    return {
      status: 2,
      tips: '暂无数据',
    };
  },
  methods: {
    getDetails(orderBookId, bookId) {
      this.$router.push({
        name: 'goodsInfo',
        query: {
          order_book_id: orderBookId,
          book_id: bookId,
        },
      });
    },
    sendBack(refundId) {
      this.$router.push({
        name: 'sendBack',
        query: {
          id: refundId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "./style.less";
</style>
