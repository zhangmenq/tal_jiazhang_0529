<template>
<div class="logistics">
  <div  v-if="!loadingData">
    <div class="item-status" v-if="logisticsDetailsInfo.data">
      <h4 v-if="logisticsDetailsInfo.com_name.length>0"><span>配送公司：</span>{{logisticsDetailsInfo.com_name}}</h4>
      <h4 v-if="logisticsDetailsInfo.nu.length>0"><span>运单号：</span>{{logisticsDetailsInfo.nu}}</h4>
    </div>
    <div class="item-status" v-if="logisticsDetailsInfo.data && logisticsDetailsInfo.data.length > 0">
      <ul>
        <li  :class="{'current':index ==0}" v-for="(item,index) in logisticsDetailsInfo.data" :key="item.id">
          <p>{{item.context}}</p><em>{{item.time}}</em>
        </li>
      </ul>
    </div>
    <div v-else>
      <no-data :tips="tips"></no-data>
    </div>
  </div>
  <loading v-else></loading>
  </div>
</template>
<script>
import { getLogisticsDetails } from '@/api';
import Loading from '@/components/loading/Index';
import NoData from '@/components/logistics/nodata';

export default {
  data() {
    return {
      logisticsDetailsInfo: {},
      loadingData: true,
      tips: '抱歉，没有查询到符合条件的运单',
    };
  },
  components: {
    Loading,
    NoData,
  },
  methods: {
    getLogisticsDetail() {
      const refundId = this.$route.query.refund_id;
      getLogisticsDetails(refundId).then((res) => {
        this.loadingData = false;
        if (res.error_code !== 0) {
          return false;
        }
        this.logisticsDetailsInfo = res.data;
      });
    },
  },
  mounted() {
    this.getLogisticsDetail();
  },
};
</script>

<style lang="less" scoped>
  @import "../../../styles/basic.less";

  .logistics {
    padding: 0.2rem 0.2rem 0.3rem;
    width: 100%;
    min-height: 100%;
    background: @col-bg;
    .item-status {
      margin: 0 0 0.2rem;
      padding: 0.2rem 0.3rem 0.3rem;
      background: #fff;
      border-radius: 0.1rem;
      font-size: 0.3rem;
      h4 {
        width: 100%;
        .ellipsis-b;
        line-height: 0.42rem;
        span {
          display: inline-block;
          color: @col-gray;
          width: 1.8rem;
        }
      }
      ul {
        padding-left: 0.28rem;
        border-left: 0.01rem solid #f2f2f2;
        li {
          padding: 0.1rem 0 0.05rem;
          border-bottom: 0.01rem solid #f2f2f2;
          font-size: 0.24rem;
          em {
            font-size: 0.2rem;
            color: @col-gray;
          }
          p {
            position: relative;
            color: @col-gray;
            &::before {
              content: "";
              position: absolute;
              left: -0.35rem;
              top: 0.1rem;
              display: block;
              .wh(10px, 10px);
              background: @col-gray;
              border-radius: 50%;
            }
          }
          &.current {
            p {
              color: #1b223f;
              &::before {
                background: @col-purple;
                box-shadow: 0 0 0.04rem 0.04rem rgba(154, 87, 200, 0.3);
              }
            }
          }
        }
        li:nth-last-child(1) {
          border-bottom: none;
        }
      }
    }
  }
</style>
