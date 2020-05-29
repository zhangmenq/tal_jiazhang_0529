<template>
  <div class="banner">
    <swiper v-model="imgIndex" @click.native="clickImg()" :list="imgs" loop auto style="width:100%;margin:0 auto;" height="3rem" :show-dots="imgs.length > 1" dots-class="custom-bottom" dots-position="center"></swiper>
    <!-- <swiper @click.native="clickImg()" v-model="imgIndex" :list="imgs" loop auto style="width:84%;margin:0 auto;" height="3rem" :show-dots="imgs.length > 1" dots-class="custom-bottom" dots-position="center"></swiper> -->
  </div>
</template>
<script>
  import { Swiper, SwiperItem } from 'vux';
  import getOrigin from '@/utils/origin';
  import { setApilog } from '@/api';

  export default {
    props: ['imgs', 'imgUrls'],
    components: {
      Swiper,
      SwiperItem,
    },
    data() {
      return {
        imgsList: [],
        imgIndex: 0,
      };
    },
    computed: {
      //所在平台
      origin() {
        return getOrigin();
      },
    },
    methods: {
      clickImg() {
        const bannerIndex = `banner${this.imgIndex + 1}`;
        setApilog({
          event_type: 20001,
          route: '/index',
          ext1: '1',
          ext2: bannerIndex,
          ext5: 'indexbanner',
        }).then(() => {
          location.href = this.imgUrls[this.imgIndex];
        });
      },
    },
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .banner{
    height:3.4rem;
    padding-bottom: 0.2rem;
    background:#fff;
    overflow: hidden;
    .vux-slider{
      overflow: visible;
      & > .vux-swiper{
        margin:0 auto;
        overflow: visible;
        .vux-swiper-item{
          width:100%;
          top:0.25rem;
          height:2.5rem;
          &.active{
            top:0;
            height:3rem;
            &:after{
              position: absolute;
              bottom: 0;
              left:20%;
              content:'';
              width:60%;
              height:3rem;
              height: 0;
              .box-shadow(0 0.3rem 0 rgba(0,0,0,1));
            }
          }
          .vux-img{
            overflow: hidden;
          }
        }
        .vux-swiper-desc{
          display:none;
        }
      }
      .vux-indicator {
        a {
          .vux-icon-dot{
            .wh(0.08rem,0.08rem);
            border-radius: 0.04rem;
            background-color: rgba(225,255,255,0.6);
            &.active{
              width: 0.3rem;
              background-color: rgba(255,255,255,1);
            }
          }
        }
      }
    }
  }
</style>
