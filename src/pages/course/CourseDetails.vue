<template>
<div>
   <loading v-if="loading"></loading>
  <div class="course-details" v-else>
    <span class="cover" v-if="info.cover">
      <img :src="info.cover_url" />
    </span>
    <span class="cover" v-else>
      <img src="../../assets/cover-default.jpg" />
    </span>
    <div class="item-box" :class="{'server-box-border':classType === 1}">
      <div class="title">{{ info.title }}</div>
      <div class="details-box">
        <p class="time">
          <i class="icon time"></i>{{ info.start_at }} - {{ info.end_at }}
        </p>
        <p class="lessons"><i class="icon lessons"></i>共{{ info.lessons_sum || info.lessons }}节</p>
        <p class="price">
          <em class="current">¥{{ info.price | formatMoney }}</em>
        </p>
      </div>
      <ul class="servers-box" @click="showPop = true" v-if="classType!==1">
        <li v-if="contentType !== 3"><i class="icon exclusive"></i>双外教服务</li>
        <li><i class="icon playback"></i>全透明教室</li>
        <li><i class="icon return-premium"></i>无理由随时退</li>
      </ul>
    </div>
    <div v-transfer-dom class="cus-dialog">
      <popup v-model="showPop">
        <div class="Service note">
          <h2>服务说明</h2>
          <ul class="servers-box" >
            <li v-if="contentType !== 3">
              <i class="icon exclusive"></i>双外教服务
              <p>藤校明星外教与北美优质外教强强联合，引领能力进阶。</p>
            </li>
            <li>
              <i class="icon playback"></i>全透明教室
              <p>家长随时查看孩子上课状态，了解孩子学习情况。</p>
            </li>
            <li>
              <i class="icon return-premium"></i>无理由随时退
              <p>不满意可随时申请退费，第二次课前可无条件全额退款。</p>
            </li>
          </ul>
        </div>
      </popup>
    </div>
    <!-- 主辅课：包含内容 -->
    <div class="item-box" v-if="info.relation">
      <div class="comm-tit">包含内容</div>
      <ul class="content-box content-column">
        <li>
          <p class="title">{{ info.content_type_name }}</p>
          <p class="intro">
            <span class="lessons">
              <i class="icon lessons"></i>共{{info.lessons}}节
            </span>
          </p>
        </li>
        <li>
          <p class="title">{{ info.relation.content_type_name }}</p>
          <p class="intro">
            <span class="lessons">
              <i class="icon lessons"></i>共{{info.relation.lessons}}节
            </span>
          </p>
        </li>
        <!-- <li v-if="info.book && info.book.id" @click="bookDetails(info.book.id)">
          <p class="title">{{ info.book.title }}</p>
          <p class="intro">
            <span class="price">
              <em class="original" v-if="discount > 0">¥{{book_origin | formatMoney}}</em>
              <em class="current">¥{{book_current | formatMoney}}</em>
            </span>
          </p>
        </li> -->
      </ul>
    </div>

    <!-- 主修课 -->
    <!-- <div class="item-box" v-if="type === 'course' && info.book && info.book.id">
      <div class="comm-tit">包含内容</div>
      <ul class="content-box content-list">
        <li @click="bookDetails(info.book.id)">
          <p class="title">{{ info.book.title }}</p>
          <p class="intro">
            <span class="price">
              <em class="original" v-if="discount > 0">¥{{book_origin | formatMoney}}</em>
              <em class="current">¥{{book_current | formatMoney}}</em>
            </span>
          </p>
        </li>
      </ul>
    </div> -->

    <div class="item-box" v-if="info.course_images">
      <div class="comm-tit">课程介绍</div>
      <div class="intro-box" v-for="image in info.course_images" :key="image.id">
        <img :src="image.img_url" @click="previewImg"/>
        <!-- <img src="../../assets/cover-default.jpg" alt="课程简介"> -->
      </div>
    </div>
    <div class="nav-pay">
      <span class="price">¥{{ total_price | formatMoney }}</span>
      <!-- btn-disable btn-purple -->
      <div>
        <x-button class="btn-signup"
        :class="{'btn-disable': !canBuy, 'btn-purple': canBuy}"
        @click.native="bookCourse()">
        {{ classroomId > 0 ? '已购买' : (orderId > 0 ? '未支付' : '立即报名') }}
        </x-button>
      </div>
    </div>
    <vx-dialog
      :show="dialogData.show"
      :tips="dialogData.tips"
      @onConfirm="goTest()"
      @onCancel="cancelTest()"
      class="test-dialog">
    </vx-dialog>
    <div v-show="showPreview.show" class="show-preview" @click="closePreview">
      <img :src="showPreview.src" alt="课程详情">
    </div>
  </div>
  </div>
</template>
<script>
  import { TransferDom, Popup, XButton } from 'vux';
  import courseDetails from '@/mixins/courseDetails';
  import VxDialog from '@/components/dialog/Index';
  import Loading from '@/components/loading/Index';

  export default{
    components: {
      TransferDom,
      Popup,
      XButton,
      VxDialog,
      Loading,
    },
    directives: { TransferDom },
    mixins: [courseDetails],
    data() {
      return {
        showPop: false,
        dialogData: {
          show: false,
          tips: '您离开好久了呢，为保证孩子上课质量，需要参加级别测试',
          confirmText: '参加',
          cancelText: '不参加',
        },
        showPreview: {
          show: false,
          src: '',
        },
      };
    },
    methods: {
      previewImg(e) {
        this.showPreview.show = true;
        this.showPreview.src = e.target.currentSrc;
      },
      closePreview() {
        this.showPreview.show = false;
        this.showPreview.src = '';
      },
    },
    mounted() {},
    created() {},
  };
</script>
<style lang="less">
  @import '../../styles/basic.less';

  .course-details{
    position: relative;
    background: @col-bg;
    min-height: 100%;
    padding: 3rem 0 1.1rem 0;
    .cover{
      .pos-box(100%,4.68rem);
      img{
        .wh-img;
      }
    }
    .item-box{
      .item-box;
      img{
        width: 100%;
        margin-top: .2rem;
      }
      .comm-tit{
        .comm-tit;
      }
      & > .title{
        margin-bottom: .1rem;
        line-height: .64rem;
        font-size: .48rem;
        color: @col-darkgray;
        .ellipsis-m(2);
      }
      .price{
        position: absolute;
        right: 0;
        bottom: .2rem;
        .original{
          font-size: .26rem;
          text-decoration:line-through;
          color: @col-gray;
        }
        .current{
          padding-left: .16rem;
          color: @col-orange;
        }
      }
      .details-box{
        position: relative;
        padding-bottom: .2rem;
        border-bottom: .01rem solid @col-border;
        p{
          line-height: .44rem;
          &:before{
            margin-right: .2rem;
          }
        }
        .price{
          font-size: .36rem;
        }
      }
      .servers-box{
        margin-top: .2rem;
        .l-h(.45rem);
        width: 100%;
        overflow: hidden;
        li{
          margin:0 .1rem 0 0;
          display: inline-block;
          color: @col-gray;
        }
      }
      .content-box{
        color: @col-gray;
        .title{
          font-size: .26rem;
          color: @col-darkgray;
          a{
            color: @col-darkgray;
          }
        }
        li{
          position: relative;
          background-color: @col-bg;
        }
        p{
          line-height: .44rem;
        }
        .intro{
          span{
            display: inline-block;
            vertical-align: middle;
            padding-right: .25rem;
            &.price{
              padding-right: 0;
              font-size: .3rem;
            }
          }
        }
        &.content-column{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: .2rem;
          .title{
            position: relative;
            top: .04rem;
            padding-right: .1rem;
          }
          li{
            width: 49%;
            display: flex;
            justify-content: center;
            margin-bottom: .1rem;
            padding: .13rem .16rem;
          }
          .intro{
            span{
              padding-right: 0;
            }
          }
        }
        &.content-list{
          li{
            padding: .13rem 0 .2rem;
            border-top: .01rem solid @col-border;
            background-color: transparent;
            &:first-of-type{
              border-top: none;
            }
            &:last-of-type{
              padding-bottom: 0;
              .intro{
                .price{
                  bottom: 0;
                }
              }
            }
            .intro{
              min-height: .44rem;
            }
          }
        }
      }
      &.server-box-border{
        .details-box{
          border:none;
          padding-bottom: 0;
        }
        
      }
    }
    .nav-pay{
      .nav-pay;
    }
  }
.cus-dialog{
  .vux-popup-dialog{
    background: #fff;
    padding:.3rem;
    h2{
      text-align: center;
      line-height: .5rem;
      margin:0 0 0.1rem 0;
      font-size: .3rem;
      color: @col-darkgray;
    }
    li{
      p{
        color: @col-gray;
        font-size: .24rem;
        padding:0.05rem 0 0.1rem 0;
      }
    }
  }
}
i.icon{
  display: inline-block;
  vertical-align: middle;
  .wh(.4rem,.27rem);
  margin-right: .04rem;
  .bg-m('@{img-path}/course-details-icon.png');
  background-size: .4rem 4.5rem;
  &.time{
    background-position: center 0;
  }
  &.lessons{
    background-position: center -.28rem;
  }
  &.return-premium{
    background-position: center -1.33rem;
    .wh(.4rem,.24rem);
  }
  &.exclusive{
    background-position: center -1.58rem;
  }
  &.playback{
    .wh(.4rem,.24rem);
    background-position: center -1.88rem;
  }
}
.show-preview {
  width: 100%;
  height: 100%;
  z-index: 101;
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  img{
    display: block;
    width: 100%;
  }
}
.test-dialog {
  .dialog-box{
  background: @col-white;
  border-radius: .2rem;
  font-size: .3rem;
  color: @col-darkgray;
  text-align: center;
  position: fixed;
  z-index: 99999;
  padding-bottom: .3rem;
  &.hintbutton-box{
    position: fixed;
    left: 50%;
    margin-left: -6.5rem/2;
    top: 4.5rem;
    width: 6.5rem;
    p{padding: .9rem .2rem .7rem;}
    .close{
      position: absolute;
      display: block;
      .wh(.34rem,.34rem);
      line-height: .34rem;
      top: .3rem;
      right: .3rem;
      font-size: .34rem;
      color: @col-lightblue;
    }
  }
  &.hint-box{
    .pos-box-cc(6.5rem,2.4rem,@pos:absolute);
    p{
      line-height: 2.4rem;
    }
  }
  .weui-btn{
    .wh(1.8rem,.7rem);
    font-size: .3rem;
    padding: 0;
    color: @col-white;
    margin: 0 .2rem;
    &.gray{
      background: @col-gray;
    }
  }
  i{
    font-size: .5rem;
    color: @col-white;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    .wh(.9rem,.9rem);
    margin-right: .1rem;
    line-height: .9rem;
    border-radius: 100%;
    &.warn{
      background: @col-yellow;
    };
    &.succeed{
      background: @col-blue;
      &::before{
        content: "";
        display: inline-block;
        .wh(.42rem,.28rem);
        margin: -.2rem 0 0 .1rem;
        .bg-m('@{img-path}/dialog-img1.png',0,0,repeat);
      }
    }
  }
}
}
</style>
