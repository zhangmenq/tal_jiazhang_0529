<template>
 <div>
    <ul
      v-if="total > 0"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="distance"
      infinite-scroll-immediate-check="false"
      infinite-scroll-throttle-delay="500">
      <course-item v-if="listType === 'course'"
        v-for="(item, index) in lists"
        :key="index"
        :course="item">
      </course-item>
      <order-item v-if="listType === 'order'"
        v-for="(item, index) in lists"
        :key="index"
        :order="item"
        :status="item.status"
        :isReorderTime="isReorderTime"
        @cancelSuccess="cancelSuccess"
        @cancelOrder="cancelOrder">
      </order-item>
      <my-course v-if="listType === 'section' || listType === 'change'"
        v-for="(item, index) in lists"
        :key="index"
        :course="item"
        @showTurns="showTurns"
        :courseType="courseType">
      </my-course>
      <adjust-item v-if="listType === 'adjust'"
        v-for="(item, index) in lists"
        :key="index"
        :adjust="item">
      </adjust-item>
      <coupon-item v-if="listType === 'coupon'"
        v-for="(item, index) in lists"
        :key="index"
        :idx="index"
        :coupon="item"
        :couponType="couponType">
      </coupon-item>
      <recommended-item v-if="listType === 'recommended'"
        v-for="(item, index) in lists"
        :key="index"
        :recommended="item">
      </recommended-item>
      <load-more
        :show-loading="busy && this.lists.length != total"
        v-if="total > 8">
      </load-more>
    </ul>
    <div v-else>
      <no-content :tips="tips" :vertical="listType !== 'course'">
        <div v-if="showBuy==1" class="buyCourse" @click="buyCourse">购买课程</div>
      </no-content>
      
    </div>
    <adjust-dialog
      :type="2"
      :show="showPop"
      :turn-info="turnsParams.turnInfo"
      :is-package="turnsParams.isPackage"
      :course-date="turnsParams.courseDate"
      @onConfirm="goTime()"
      @onCancel="cancel()">
    </adjust-dialog>
 </div>
</template>

<script>
import { TransferDom, Popup } from 'vux';
import infiniteScroll from 'vue-infinite-scroll';
import CourseItem from '@/components/home/CourseItem';
import OrderItem from '@/components/order/OrderItem';
import MyCourse from '@/components/course/MyCourse';
import AdjustItem from '@/components/record/AdjustItem';
import CouponItem from '@/components/coupon/CouponItem';
import RecommendedItem from '@/components/recommended/RecommendedItem';
import LoadMore from '@/components/loadmore/Index';
import PopAdjust from '@/components/common/PopAdjust';
import VxDialog from '@/components/dialog/Index';
import AdjustDialog from '@/components/dialog/AdjustDialog';
import NoContent from './NoContent.vue';

export default {
  name: 'scrollData',
  props: {
    lists: {
      type: Array,
      default: [],
    },
    busy: {
      type: Boolean,
      default: false,
    },
    distance: {
      type: Number,
      default: 100,
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    tips: {
      type: String,
      default: '暂无课程，敬请期待~',
    },
    listType: {
      type: String,
      default: 'course',
    },
    courseType: {
      type: String,
      default: 'coursePage',
    },
    couponType: {
      type: String,
      default: '1',
    },
    isReorderTime: {
      type: Boolean,
      default: false,
    },
    showBuy: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      itemLists: [],
      turnsParams: {},
      showPop: false,
      dialogData: {
        show: false,
        tips: '您操作的课程为组合课程，本课程将与下学期课程一同转班',
        confirmText: '转班',
        cancelText: '取消',
      },
    };
  },
  components: {
    CourseItem,
    OrderItem,
    LoadMore,
    MyCourse,
    AdjustItem,
    CouponItem,
    NoContent,
    PopAdjust,
    Popup,
    VxDialog,
    AdjustDialog,
    RecommendedItem,
  },
  directives: {
    infiniteScroll,
    TransferDom,
  },
  methods: {
    loadMore() {
      if (this.lists.length === this.total) {
        return false;
      }
      this.$emit('loadMore');
    },
    cancelSuccess(data) {
      this.$emit('cancelSuccess', data);
    },
    showTurns(item) {
      this.showPop = true;
      this.turnsParams = item;
    },
    cancel() {
      this.showPop = false;
    },
    goTime() {
      if (this.turnsParams.turns === 0) {
        return;
      }
      this.$router.push({
        name: 'turnsTime',
        params: {
          courseId: this.turnsParams.courseId,
          classroomId: this.turnsParams.classroomId,
        },
        query: {
          turns: this.turnsParams.turns,
        },
      });
    },
    cancelOrder(data) {
      this.$emit('cancelOrder', data);
    },
    buyCourse() {
      location.href = '/home';
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/basic.less';
.buyCourse {
  background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
  border-radius: 0.3rem;
  width: 1.7rem;
  height: 0.6rem;
  color: @new-col-white;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  font-size: 0.28rem;
  line-height: 0.6rem;
  text-align: center;
  margin: .1rem auto 0;
}
</style>
