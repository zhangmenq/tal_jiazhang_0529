<template>
  <div>
    <scroll-data v-if="!loadingData"
      :lists="lists"
      :busy="busy"
      :distance="100"
      :total="total"
      :currentPage="currentPage"
      :isReorderTime="isReorderTime"
      listType="order"
      tips="暂无订单"
      @loadMore="loadMore"
      @cancelOrder="cancelOrder"
      @cancelSuccess="cancelSuccess">
    </scroll-data>
    <loading v-else></loading>
    <vx-dialog
      :show="dialogData.show"
      :tips="dialogData.tips"
      @onConfirm="confirm()"
      @onCancel="cancel()">
    </vx-dialog>
  </div>
</template>

<script>
import orderLists from '@/mixins/orderLists';
import Loading from '@/components/loading/Index';
import VxDialog from '@/components/dialog/Index';

export default {
  name: 'unpayOrder',
  mixins: [orderLists],
  data() {
    return {
      status: 0,
      dialogData: {
        show: false,
        tips: '您确认取消订单吗？',
      },
      cancelOrderId: 0,
      timer: '',
    };
  },
  components: {
    Loading,
    VxDialog,
  },
  destroyed() {
    this.$vux.toast.hide();
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    cancel() {
      this.dialogData.show = false;
    },

    async confirm() {
      const url = `${this.apiConfig.host}/order/orders/${this.cancelOrderId}`;
      await this.$http.delete(url).then((res) => {
        if (res.error_code === 0) {
          this.dialogData.show = false;
        }
      });
      await this.$vux.toast.show({
        time: 10000,
        type: 'cancel',
        isShowMask: true,
        position: 'middle',
        text: '正在取消订单...',
        width: '17.6em',
      });
      await this.polling(this.cancelOrderId);
    },
    polling(orderId) {
      let count = 0;
      const url = `${this.apiConfig.host}/order/orders/${orderId}/cancel-status`;

      this.timer = setInterval(() => {
        if (count >= 3) {
          clearInterval(this.timer);
          this.cancelError();
        } else {
          this.$http.get(url).then((res) => {
            clearInterval(this.timer);
            if (res.error_code === 0) { //取消成功
              this.cancelSuccess(orderId);
            } else { //取消失败
              this.cancelError();
            }
          });
        }
        count += 1;
      }, 3000);
    },

    cancelOrder(data) {
      this.dialogData.show = true;
      this.cancelOrderId = data.order_id;
    },

    cancelSuccess(orderId) {
      this.$vux.toast.hide();
      this.$vux.toast.show({
        time: 2000,
        type: 'success',
        isShowMask: true,
        position: 'middle',
        text: '订单取消成功',
        width: '17.6em',
      });
      this.lists = this.lists.filter(item => item.id !== orderId);
      if (this.lists.length === 0) {
        this.total = 0;
      }
    },

    cancelError() {
      this.$vux.toast.hide();
      this.$vux.toast.show({
        time: 2000,
        type: 'cancel',
        isShowMask: false,
        position: 'middle',
        text: '订单取消失败，请稍后再试',
      });
    },
  },
};
</script>
