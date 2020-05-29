<template>
<div class="learning-report">
  <div
    v-for="(item, index) in info"
    :key="item.id"
    v-if="!noContent">
    <div>
      <div class="collapse-title">
      <span class="time">{{ item.start_at | formatDate('YYYY.MM.DD HH:mm') }}</span>
      <span class="status"
        :class="{'active': showCollapse === index}"
        @click="collapseShow(item, index)"
        v-if="info.length > 1 && isSingle === 0">
        {{ isSingle === 1 ? '' : (showCollapse === index ? '收起报告': '展开报告') }}
      </span>
    </div>
    <div class="collapse-conent" v-show="showCollapse === index">
      <div class="profile-box">
        <a class="avatar">
          <img :src="item.student.avatar_url" v-if="item.student.avatar"/>
          <img src="../../assets/default-photo.png" v-else>
        </a>
        <p class="name">{{ item.student.enname || item.student.realname }}</p>
        <div class="statistics-item">
          <!-- <span>
            <em class="times">上榜次数</em>
            <em class="num">{{item.rank_times}}</em>
          </span> -->
          <span>
            <em class="times">本次得星</em>
            <em class="num">{{item.star}}</em>
          </span>
          <span>
            <em class="times">累计得星</em>
            <em class="num">{{item.total_stars}}</em>
          </span>
        </div>
        <div class="total-item">
          <span v-if="item.duration > 0">
            <em>互动</em>{{item.duration}}分钟
          </span>
          <span v-if="item.duration == 0">
            <em>互动</em>生成中
          </span>
          <span class="exc">
            <em>答题</em>{{item.answer_times}}次
          </span>
           <span class="exc">
            <em>语音</em>{{item.opening_times}}个
          </span>
        </div>
      </div>
      <div class="item-box">
        <p class="evaluate">{{ item.student.enname || item.student.realname }} {{item.ranking | formatRank}}，超越<i>{{item.ranking}}%</i>的学员，再接再厉~</p>
      </div>
      <div class="item-box" v-if="lists.length > 0">
        <div class="ranking-title">本次排行榜</div>
        <p class="ranking-tit">
          <span class="num">排名</span>
          <span class="name">名称</span>
          <span class="winstars">得星</span>
          <!-- <span class="times">上榜次数</span> -->
        </p>
        <ul class="ranking-list">
          <li
            v-for="(stuItem, idx) in lists" :key="stuItem.id"
            :class="{'active': stuItem.student_id === item.student.id}">
            <span class="num">{{idx + 1}}</span>
            <span class="name">
              <em class="avatar">
                <img :src="stuItem.student.avatar_url" v-if="stuItem.student.avatar"/>
                <img src="../../assets/default-photo.png" v-else>
              </em>
              <p>{{stuItem.student.enname || stuItem.student.realname}}</p>
            </span>
            <span class="winstars">{{stuItem.star}}</span>
            <!-- <span class="times">{{stuItem.rank_times}}</span> -->
          </li>
        </ul>
        <a class="more" v-show="show" @click="showMore(index)">查看更多</a>
      </div>
    </div>
    </div>
  </div>
  <no-content v-if="noContent" :tips="tips"></no-content>
</div>
</template>
<script>
  import { getMinorReport, getMinorRanking } from '@/api';
  import { formatDate } from '@/filters';
  import NoContent from '../../components/common/NoContent.vue';

  export default{
    data() {
      return {
        info: [],
        cacheRank: {},
        showCollapse: 0,
        tips: '暂无报告',
        noContent: false,
        lists: [],
        show: false,
      };
    },
    components: {
      NoContent,
    },
    filters: {
      formatDate,
      formatRank(ranking) {
        return Number(ranking) > 70
         ? '学习很棒'
         : (Number(ranking) > 40 ? '学习很不错' : '学习很认真');
      },
    },
    computed: {
      minorId() {
        return this.$route.params.minor_id;
      },
      isSingle() {
        return Number(this.$route.query.single);
      },
      roomId() {
        return this.$route.query.room_id;
      },
    },
    methods: {
      getInfo() {
        return getMinorReport(this.minorId, this.isSingle, this.roomId).then((res) => {
          if (res.error_code !== 0) {
            this.noContent = true;
          } else {
            this.info = res.data;
            getMinorRanking(this.info[0].room_id).then((ret) => {
              this.cacheRank[0] = ret.data;
              if (ret.error_code > 0) {
                return;
              }
              if (ret.data.length > 5) {
                this.lists = ret.data.splice(0, 5);
                this.show = true;
              } else {
                this.lists = ret.data;
              }
            });
          }
        });
      },
      changeSchedule(id, index) {
        if (typeof this.cacheRank[`${index}`] === 'undefined') {
          this.lists = [];
          getMinorRanking(id).then((res) => {
            this.cacheRank[`${index}`] = res.data;
            if (res.error_code > 0) {
              return;
            }
            if (res.data.length > 5) {
              this.lists = res.data.splice(0, 5);
              this.show = true;
            } else {
              this.show = false;
              this.lists = res.data;
            }
          });
        } else {
          this.lists = this.cacheRank[`${index}`];
        }
      },
      collapseShow(item, idx) {
        this.show = false;
        if (this.showCollapse === idx) {
          this.showCollapse = -1;
        } else {
          this.showCollapse = idx;
          this.changeSchedule(item.room_id, idx);
        }
      },
      showMore(index) {
        this.show = false;
        this.lists = this.lists.concat(this.cacheRank[`${index}`]);
        this.cacheRank[`${index}`] = this.lists;
      },
    },
    mounted() {
      this.getInfo();
    },
  };
</script>

<style lang="less">
@import '../../styles/basic.less';

.learning-report{
  min-height: 100%;
  padding-bottom: .3rem;
  background-color: @col-bg;
  color: @col-darkgray;
  .collapse-title{
    .item-box-fluid;
    display: flex;
    justify-content: space-between;
    padding: .26rem;
    margin-bottom: .2rem;
    line-height: .34rem;
    font-size: .26rem;
    .time{
      &:before{
        content: '';
        .wh(.3rem,.3rem);
        display: inline-block;
        vertical-align: middle;
        margin-top: -.04rem;
        margin-right: .2rem;
        .bg-m('@{img-path}/time-icon.png');
        background-size: 100% 100%;
      }
    }
    .status{
      color: @col-gray;
      &:after{
        content: '';
        .wh(.24rem,.24rem);
        display: inline-block;
        vertical-align: middle;
        margin-top: -.04rem;
        margin-left: .16rem;
        .bg-m('@{img-path}/arrow-icon.png',center,center);
        background-size: .14rem .24rem;
        .transitionMob(all .3s);
      }
      &.active{
        &:after{
          transform: rotate(90deg);
        }
      }
    }
  }
  .collapse-conent{
    padding-top: 1rem;
    font-size: .26rem;
    .profile-box{
      position: relative;
      margin: 0 .2rem .2rem;
      padding: .9rem .2rem .4rem;
      .bg-m('@{img-path}/ranking-profile-bg.png');
      background-size: 100% 100%;
      color: #fff;
      .avatar{
        overflow: hidden;
        .pos-box-lc(1.6rem,1.6rem);
        top: -.8rem;
        border-radius: 100%;
        .box-shadow(0 .08rem .24rem rgba(77,112,245,.2));
        img{
          .wh-img;
        }
      }
      .name{
        margin-top: .08rem;
        line-height: .44rem;
        text-align: center;
        font-size: .36rem;
      }
      .statistics-item{
        display: flex;
        justify-content: space-around;
        margin-top: .16rem;
        span{
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        .times{
          font-size: .3rem;
        }
        .num{
          font-size: .36rem;
        }
      }
      .total-item{
        display: flex;
        justify-content: center;
        margin: .1rem -.2rem 0;
        padding: .3rem 0 0;
        line-height: .4rem;
        border-top: .01rem dashed @col-border;
        span{
          border-left: .01rem solid #fff;
          text-align: center;
          font-size: .36rem;
          &.exc{
            flex: 1;
          }
          &:first-of-type{
            width: 36%;
            border-left: none;
          }
          em{
            padding-right: .2rem;
            font-size: .3rem;
          }
        }
      }
    }
    .item-box{
      .item-box;
      .evaluate{
        line-height: .36rem;
        // font-size: .26rem;
        i{
          font-size: .36rem;
          color: @col-orange;
        }
      }
      .ranking-title{
        .pos-box-lc(3.48rem,.91rem);
        top: -7px;
        line-height: .91rem;
        .bg-m('@{img-path}/ranking-title-bg.png');
        background-size: 100% 100%;
        font-size: .36rem;
        text-align: center;
        color: #fff;
      }
      .ranking-tit{
        display: flex;
        margin-top: .5rem;
        .l-h(.86rem);
        text-align: center;
        color: @col-gray;
      }
      .num{
        width: 1rem;
      }
      .name{
        margin-left: .5rem;
        margin-right: 0rem;
        width: 3rem;
        padding-left: .9rem;
        text-align: left;
      }
      .winstars{
        flex: 1;
      }
      .times{
        flex: 1;
      }
      .ranking-list{
        text-align: center;
        font-size: .3rem;
        li{
          display: flex;
          padding: .2rem 0;
          line-height: .8rem;
          .num{
            margin-top: .07rem;
            .l-h(.65rem);
          }
          &:nth-child(1) .num{
            text-indent: -9999px;
            .bg-m('@{img-path}/ranking-icon.png',center,0);
            background-size: .4rem 1.95rem;
          }
          &:nth-child(2) .num{
            text-indent: -9999px;
            .bg-m('@{img-path}/ranking-icon.png',center,-.65rem);
            background-size: .4rem 1.95rem;
          }
          &:nth-child(3) .num{
            text-indent: -9999px;
            .bg-m('@{img-path}/ranking-icon.png',center,-1.3rem);
            background-size: .4rem 1.95rem;
          }
          &.active{
            background: #f2f2f2;
          }
        }
        .name{
          position: relative;
          padding-left: .9rem;
          text-align: left;
          .avatar{
            display: block;
            border-radius: 100%;
            .pos-box(.8rem,.8rem);
            img{
              .wh-img;
            };
            overflow: hidden;
            .box-shadow(0 .08rem .24rem rgba(77,112,245,.2));
          }
          p{
            .ellipsis-b;
          }
        }
      }
      .more{
        margin-top: .1rem;
        padding-top: .2rem;
        display: block;
        border-top: .01rem solid @col-border;
        text-align: center;
        font-size: .3rem;
      }
    }
  }
}
</style>
