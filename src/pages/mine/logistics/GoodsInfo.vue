<template>
  <div class="logistics">
    <div  v-if="!loadingData">
      <div class="item-status" v-for="(item, idx) in logisticsInfo" :key="idx">
        <div class="good-name" v-if="item.goods_name">{{item.goods_name}}</div>
        <div class="tit">
          <span v-if="item.status == 0">待发货</span>
          <span v-if="item.status == 1">已发货</span>
          <span  v-if="item.status == 2">已签收</span>
           <span v-if="item.status == -1">已取消</span>
          <i class="tit-time" v-if="item.logistics_confirm_at">{{item.logistics_confirm_at}}</i></div>
        <!--status:0表示待发货，1已发货，2是已签收 -->
        <ul v-if="item.status >  0">
          <li>
            <span>配送公司：</span>
            <p>{{item.logistics_name}}</p>
          </li>
          <li class="order">
            <span>运单号：</span>
            <p>{{item.logistics_num}}</p>
          </li>
        </ul>
        <p class="tips" v-if="item.status === 0">商品会陆续发出，请耐心等待哦！如有疑问，请联系班主任或4008002211转9！</p>
          <div class="item-cancel-box" v-if="item.status === -1">
            <div class="item-cancel" >
              <span class="cancel-img"></span>
            </div>
          </div>
        <div v-if="isShowEdite">
           <div class="item-box good-info" v-if="item.status === 0">
          <div class="item-func">
            <div class="btn-fn">
              <x-button class="btn-plain-purple" @click.native="editeAddress(item.id,0)">修改地址</x-button>
            </div>
          </div>
        </div>
        <div class="item-box good-info" v-if="item.status > 0">
          <div class="item-func">
            <div class="btn-fn">
              <x-button class="btn-plain-purple" @click.native="checkLogisticsDetails(item.id)">查看物流</x-button>
              <x-button class="btn-plain-purple" @click.native="editeAddress(item.id,1)">查看地址</x-button>
            </div>
          </div>
        </div>
        </div>
       
        
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>
<script>
import { getLogistics } from '@/api';
import Loading from '@/components/loading/Index';
import { XButton } from 'vux';

export default {
  components: {
    Loading,
    XButton,
  },
  data() {
    return {
      logisticsInfo: [],
      loadingData: true,
      isShowAdress: 1,
    };
  },
  computed: {
    isShowEdite() {
      return this.isShowAdress > 0;
    },
  },
  methods: {
    getLogistics() {
      const orderbookId = this.$route.query.order_book_id;
      const bookId = this.$route.query.book_id;
      getLogistics(orderbookId, bookId).then((res) => {
        this.loadingData = false;
        if (res.error_code !== 0) {
          return false;
        }
        this.logisticsInfo = res.data;
      });
    },
    // 查看物流详情
    checkLogisticsDetails(id) {
      this.$router.push({
        name: 'logisticsDetails',
        query: {
          refund_id: id,
        },
      });
    },
    // 修改地址
    editeAddress(id, isreadonly) {
      this.$router.push({
        name: 'editeAddress',
        params: { id },
        query: {
          isreadonly: isreadonly,
          isShowAdress: this.isShowAdress,
        },
      });
    },
  },
  mounted() {
    const showAdress = Number(this.$route.query.isShowAdress);
    this.isShowAdress = showAdress === 0 ? showAdress : 1;
    this.getLogistics();
  },
};
</script>

<style lang="less" scoped>
  @import "./style.less";
  @import "../../../styles/basic.less";

  .logistics {
    padding: 0.3rem 0;
    width: 100%;
    min-height: 100%;
    background: @col-bg;
    .item-status {
      margin: 0 0 0.2rem;
      padding: 0.2rem 0.5rem 0.3rem .5rem;
      background: #fff;
      // border-radius: 0.1rem;
      font-size: 0.3rem;
      box-shadow:0px 0px .02rem 0px rgba(0,0,0,0.15);
      .good-name {
        line-height: 0.5rem;
        .wordbreak;
        .wordbreak-en;
        font-size: 0.3rem;
        font-weight: 500;
        padding-bottom: 10px;
        border-bottom: 0.02rem solid rgba(236, 232, 231, 1);
      }
      p {
        line-height: 0.42rem;
      }
      .tips {
        margin-top: 0.2rem;
        margin-left: 0.6rem;
        padding-bottom: 0.14rem;
        text-align: center;
        color: @col-gray;
        font-size: 0.24rem;
        line-height: 0.3rem;
        text-align: left;
      }
      .good-info {
        padding: 0;
        margin: 0;
        .item-func {
          margin: 0;
           border-top: 0.02rem solid rgba(236, 232, 231, 1);
          .btn-fn {
            padding: 0;
            .weui-btn {
              .l-h(0.56rem);
              .weui-btn(1.4rem, 0.24rem);
              &.btn-plain-purple {
                border-width: 0.02rem;
              }
            }
          }
        }
      }
      .tit {
        position: relative;
        margin-top: 0.2rem;
        padding-left: 0.6rem;
        color: #6b758c;
        font-size: 0.3rem;
        &:before {
          content: "";
          .pos-box(0.38rem, 0.3rem);
          top: 0.06rem;
          .bg-m("@{img-path}logistics-icon.png");
          background-size: 100% 100%;
        }
        .tit-time {
          font-size: 0.24rem;
          color: @col-darkgray;
          font-weight: 500;
          display: inline-block;
          line-height: .4rem;
          height: .4rem;
        }
      }
      ul {
        margin-top: 0.2rem;
        padding-left: 0.6rem;
        padding-bottom: 0.16rem;
        li {
          display: flex;
          line-height: 0.42rem;
          span {
            flex: 0 0 1.4rem;
            color: @col-gray;
            font-size: 0.24rem;
          }
          p {
            flex: 1;
            .wordbreak;
            font-size: 0.24rem;
          }
          &.order {
            span {
              letter-spacing: 0.03rem;
            }
          }
        }
      }
      // &.waiting{
      //   padding: 1.6rem 0 0;
      //   .status-img{
      //     display: block;
      //     margin: 0 auto;
      //     .wh(1.73rem,1.73rem);
      //     .bg-m('@{img-path}logistics-waiting.png');
      //     background-size: 100% 100%;
      //   }
      // }
    }
  }
</style>

