<template>
  <div class="comp-teacher-details" v-if="info">
    <h4>{{titleList[0]}}</h4>
    <div class="specialty-box" v-if="info.team && info.team.length > 0">
      <a v-for="(item, idx) in info.team" :key="idx">{{item}}</a>
    </div>
    <p class="nocontent-tips" v-else>还未整理好哦~</p>
    <h4>{{titleList[1]}}</h4>
    <div class="specialty-box" v-if="info.tag && info.tag.length > 0">
      <a v-for="(item, idx) in info.tag" :key="idx">{{item}}</a>
    </div>
    <p class="nocontent-tips" v-else>还未整理好哦~</p>
    <h4>{{titleList[2]}}<span class="change-show" :class="{'active': currentIdx === 2}" @click="changeShow(2)" v-if="introHeight > tempHeight">{{showTxt[2]}}</span></h4>
    <div class="intro-box" :class="{'active': introHeight > tempHeight && currentIdx !== 2}" v-if="info.intro_cn">
      <p ref="introHeight">{{info.intro_cn}}</p>
    </div>
    <p class="nocontent-tips" v-else>还未整理好哦~</p>
    <h4>{{titleList[3]}}<span class="change-show" :class="{'active': currentIdx === 3}" @click="changeShow(3)" v-if="commentHeight > tempHeight">{{showTxt[3]}}</span></h4>
    <div class="intro-box" ref="commentHeight" :class="{'active': commentHeight > tempHeight && currentIdx !== 3}" v-if="info.intro_official">
      <p v-html="info.intro_official"></p>
    </div>
    <p class="nocontent-tips" v-else>还未整理好哦~</p>
    <p class="tempHeight" ref="tempHeight"><br><br><br><br><br></p>
  </div>
</template>
<script>
import Player from '@/components/common/Player.vue';

export default {
  components: {
    Player,
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      titleList: ['教学特点', '个性特点', '自我介绍', 'VIPX评语'],
      currentIdx: -1,
      introHeight: null,
      commentHeight: null,
      tempHeight: null,
      introList: [],
      dialog: {
        diaLogState: false,
        index: -1,
      },
      showTxt: {
        2: '展开',
        3: '展开',
      },
    };
  },
  watch: {
    info(newInfo) {
      if (newInfo) {
        this.introHeight = null;
        this.commentHeight = null;
        this.introList = [];
        this.$nextTick(() => {
          this.introList = this.info.video_and_phont;
          if (this.info.intro_cn || this.info.intro_official) {
            setTimeout(() => {
              this.getHeight();
            }, 0);
          }
        });
      }
    },
  },
  methods: {
    getHeight() {
      if (this.info.intro_cn) {
        this.introHeight = this.$refs.introHeight.offsetHeight;
      }
      if (this.info.intro_official) {
        this.commentHeight = this.$refs.commentHeight.offsetHeight;
      }
      this.tempHeight = this.$refs.tempHeight.offsetHeight;
    },
    changeShow(idx) {
      if (idx === this.currentIdx) {
        this.currentIdx = -1;
        this.showTxt[idx] = '展开';
        return false;
      }
      if (idx !== -1) {
        this.showTxt[this.currentIdx] = '展开';
      }
      this.currentIdx = idx;
      this.showTxt[idx] = '收起';
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.comp-teacher-details{
    background: @new-col-white;
    box-shadow: 0px 4px 20px 0px rgba(163,163,163,0.15);
    border-radius: 0.1rem;
    margin: 0.2rem .4rem 0;
  .nocontent-tips{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 1.3rem;
    font-size: .26rem;
    color: @col-gray;
  }
  .tempHeight{
    position: absolute;
    line-height: .42rem;
    z-index: -1;
  }
  h4{
    font-size: 0.36rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(28,34,61,1);
    line-height: 0.5rem;
    position: relative;
    display: flex;
    padding: 0.13rem 0.18rem 0;
    .change-show{
      position: absolute;
      right: .4rem;
      padding-right: .3rem;
      font-size: .24rem;
      color: @new-col-purple;
      &:after{
        content: '';
        .pos-box-hc(.22rem,.12rem);
        right: 0;
        .bg-m('@{img-path}arrow-icon-purple.png');
        background-size: .22rem .12rem;
        transition: transform .3s;
      }
      &.active:after{
        transform: rotate(180deg);
      }
    }
    small {
      padding-left: .1rem;
      font-size: .26rem;
      color: @col-purple;
    }
  }
  .specialty-box{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.36rem;
    a{
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @new-col-purple;
      line-height: 0.4rem;
      background: @new-col-bg-purple;
      border-radius: 0.05rem;
      margin: .2rem 0 0 0.28rem;
      padding: 0.07rem .1rem;
      text-align: center;
    }
  }
  .intro-box{
    font-size: 0.28rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: @new-col-title-dark;
    padding: 0.16rem 0.28rem 0.52rem 0.28rem;
    p{
      line-height: 0.4rem;
      .wordbreak;
    }
    &.active{
      p{
        .ellipsis-m(5);
      }
    }
  }
}
</style>

