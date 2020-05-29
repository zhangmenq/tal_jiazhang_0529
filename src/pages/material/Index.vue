<template>
  <div class="material-details">
    <div class="item-box">
      <span class="cover">
        <img src="../../assets/material-cover.jpg" v-if="!bookInfo.cover">
        <img :src="bookInfo.cover_url" v-else>
      </span>
      <div class="infor-box">
        <p class="title">{{bookInfo.title}}</p>
        <p class="price">
          <span class="current">¥{{ bookInfo.price | formatMoney }}</span>
        </p>
      </div>
      <dl class="content-box">
        <dt>内容介绍：</dt>
        <dd>
          {{ bookInfo.introduce }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getBookInfo } from '@/api';
import { formatMoney } from '@/filters';

export default {
  name: 'material',
  data() {
    return {
      bookInfo: {},
    };
  },
  filters: {
    formatMoney,
  },
  computed: {
    bookId() {
      return this.$route.params.bookId;
    },
  },
  mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    getBookInfo(this.bookId).then(() => {
      this.bookInfo = this.$store.state.bookInfo;
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .material-details{
    padding: 1.5rem 0 .3rem;
    min-height: 100%;
    .bg-m('@{img-path}/teacher-details-img1.png');
    background-color: @col-bg;
    background-size: 100% 2.6rem;
    color: @col-darkgray;
    .item-box{
      .item-box;
      .cover{
        position: absolute;
        left: .3rem;
        top: -1.02rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .wh(2.1rem,2.97rem);
        .box-shadow(0 .06rem .24rem rgba(0,0,0,.06));
        img{
          .wh-img;
        }
      }
      .infor-box{
        padding-left: 2.3rem;
        min-height: 1.65rem;
        .title{
          font-size: .36rem;
          line-height: .48rem;
        }
        .price{
          margin-top: .1rem;
          font-size: .48rem;
          .original{
            text-decoration:line-through;
            color: @col-gray;
          }
          .current{
            color: @col-orange;
          }
        }
      }
      .content-box{
        margin-top: .6rem;
        font-size: .26rem;
        dt{
          line-height: .48rem;
          font-size: .3rem;
        }
        dd{
          line-height: .48rem;
        }
      }
    }
  }
</style>
