<template>
  <div class="star-test" :class="{'nobg': loading}">
    <loading v-if="loading"></loading>
    <template v-else>
      <div class="share-box">
        <em class="share-icon"></em>
        <p>点击可转发<br>分享哦~</p>
      </div>
      <div class="header">
        <h4>STAR阅读测评报告<small>STAR Reading Report</small></h4>
        <span class="avater">
          <img :src="starReport.avatar" v-if="starReport.avatar"/>
          <img src="../../../assets/default-photo.png" v-else/>
        </span>
        <p>
          <span class="name">{{starReport.realname}}</span>
          <span class="level">{{starReport.grade}}</span>
        </p>
      </div>
      <div class="test-item test-infor">
        <p>测试账号：{{starReport.username}}</p>
        <p>测试时间：{{starReport.assessment_date | formatDate('YYYY.MM.DD HH:mm')}}</p>
        <p>答题时常：{{totalTime}}</p>
        <p>答题正确率：{{starReport.total_correct + '%'}}</p>
      </div>
      <div class="test-item test-part1">
        <h5><em>01</em><span class="line"></span>核心指标得分</h5>
        <div class="legend-box">
          <p><em></em><span>需大量练习</span></p>
          <p><em></em><span>需练习</span></p>
          <p><em></em><span>达到标准</span></p>
          <p><em></em><span>高于标准</span></p>
        </div>
        <div class="percentage-box" :class="{'right': starReport.ranking > 90, 'left': starReport.ranking < 10}">
          <div class="pointer" :style="{left: starReport.ranking + '%'}">
            <span>与VIPX校内基准线比较</span>
            <em></em>
          </div>
          <div class="percentage-bar">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="kpi-box">
          <div class="kpi-item">
            <h4>
              <em>SS:</em>
              <span>{{starReport.scaled_score}}</span>
              <small>(Scaled Score)</small>
            </h4>
            <p>测评得分{{starReport.scaled_score}}分</p>
          </div>
          <div class="kpi-item">
            <h4>
              <em>GE:</em>
              <span>{{starReport.grade_equivalent}}</span>
              <small>(Grade Equivalent)</small>
            </h4>
            <p v-html="geTxt"></p>
          </div>
          <div class="kpi-item">
            <h4>
              <em>PR:</em>
              <span>{{starReport.percentile_rank}}</span>
              <small>(Percentile Rank)</small>
            </h4>
            <p>得分高于{{starReport.percentile_rank + '%'}}美国<br>同龄学生</p>
          </div>
          <div class="kpi-item">
            <h4>
              <em>IRL:</em>
              <span>{{starReport.irl}}</span>
              <small>(Instructional Reading Level)</small>
            </h4>
            <p v-html="irlTxt"></p>
          </div>

        </div>
      </div>
      <div class="test-item test-part2" v-if="starReport.grade && starReport.grade.indexOf('GK') < 0">
        <h5><em>02</em><span class="line"></span>阅读单项得分</h5>
        <div class="legend-box">
          <p><em></em><span>分数</span></p>
        </div>
        <echarts v-if="radarOption" id="radar" class="radar-box" :data="radarOption"></echarts>
        <p class="tips">说明：单项能力得分每项得分均为百分数，指测试者在该年级某项能力的掌握程度。</p>
      </div>
      <div class="test-item test-part3">
        <h5>
          <em v-if="starReport.grade && starReport.grade.indexOf('GK') > -1">02</em>
          <em v-else>03</em>
          <span class="line"></span>阅读指导
        </h5>
        <ul>
          <li>估测<em>{{starReport.realname}}</em>每分钟能正确读出<em>{{starReport.orf}}</em>个单词</li>
          <li>阅读水平的蓝思值（Lexile）为<em>{{starReport.lexile}}</em></li>
          <li>推荐难度范围ZPD为<em>{{`${starReport.lower_zpd}-${starReport.upper_zpd}`}}</em>的英文读物</li>
        </ul>
      </div>
      <div class="vipcn-box">
        <a class="qrcode"><img src="../../../assets/vipcn-vipx.jpg" /></a>
        <p>微信扫一扫，关注“学而思VIPX”</p>
      </div>
      <a class="btn-share" @click="goBack">分享</a>
    </template>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import { getStarTestReport, getStarCollectData } from '@/api';
import { formatDate } from '@/filters';
import wechatMenu from '@/mixins/wechatMenu';
import Loading from '@/components/loading/Index';
import echarts from '@/components/circles/Echarts.vue';

export default {
  name: 'starTest',
  data() {
    return {
      loading: false,
      radarOption: {},
      starReport: {},
    };
  },
  components: {
    Loading,
    echarts,
  },
  computed: {
    totalTime() {
      const time = this.starReport.total_time;
      return time / 60 >= 1 ? `${Math.floor(time / 60)}分钟` : `${time}秒`;
    },
    geTxt() {
      let txt = '阅读水平相当于美国<br>小学';
      const pattern = /^[1-9][0-9]*$/;
      if (this.starReport.grade_equivalent > 0 && this.starReport.grade_equivalent < 1) {
        txt += `学前第${String(this.starReport.grade_equivalent).split('.')[1]}个月`;
      } else if (this.starReport.grade_equivalent === 0) {
        txt += '学前';
      } else if (pattern.test(this.starReport.grade_equivalent)) {
        txt += `${this.starReport.grade_equivalent}年级`;
      } else {
        txt += `${String(this.starReport.grade_equivalent).split('.')[0]}年级第${String(this.starReport.grade_equivalent).split('.')[1]}个月`;
      }
      return txt;
    },
    irlTxt() {
      let txt = '建议使用教材难度水平<br>';
      if (this.starReport.irl >= 0 && this.starReport.irl < 1) {
        txt += '学前教材';
      } else if (this.starReport.irl >= 1) {
        txt += `${Math.floor(this.starReport.irl)}年级教材`;
      } else {
        txt += '幼儿园大班教材';
      }
      return txt;
    },
    studentId() {
      return this.$route.query.student_id;
    },
    scoreList() {
      const scoreArr = [
        this.starReport.understanding_interpreting || 0,
        this.starReport.vocabulary || 0,
        this.starReport.engaging_responding || 0,
        this.starReport.word_recognition || 0,
      ];
      return scoreArr;
    },
  },
  mixins: [wechatMenu],
  filters: {
    formatDate,
  },
  mounted() {
    this.getStarTestReport();
  },
  methods: {
    goBack() {
      if (document.body.scrollTop) {
        document.body.scrollTop = 0;
      } else if (document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      }
      this.getStarCollectData();
    },
    statisticalData() {
      this.radarOption = {
        tooltip: {
          textStyle: {
            fontSize: 16,
          },
        },
        textStyle: { // legend
          color: '#1C223D',
          fontSize: this.getDpr(),
        },
        radar: {
          splitNumber: 4,
          name: {
            formatter: (text) => {
              text = text.replace(/-/g, '\n');
              return text;
            },
          },
          indicator: [
            { name: '文本字面理解-Understanding and Interpreting', max: 100 },
            { name: '词汇量-Vocabulary', max: 100 },
            { name: '文本内涵理解-Engaging and Responding', max: 100 },
            { name: '词汇认读-Word-Recognition', max: 100 },
          ],
          shape: 'circle',
          splitArea: { // 图表背景的颜色
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(171, 197, 228, 1)',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'rgba(171, 197, 228, 1)', // 设置网格的颜色
            },
          },
        },
        series: [{
          name: '',
          type: 'radar',
          data: [
            {
              value: this.scoreList,
              name: '分数',
              itemStyle: {
                normal: {
                  color: '#9A57C8',
                  lineStyle: {
                    width: 1,
                    color: '#9A57C8',
                  },
                },
              },
              areaStyle: {
                normal: {
                  width: 2,
                  color: 'rgba(154, 87, 200, 1)',
                },
              },
            },
          ],
        }],
      };
    },
    getDpr() {
      const dpr = window.devicePixelRatio;
      if (dpr === 1) {
        return 9;
      } else if (dpr === 2) {
        return 18;
      }
      return 27;
    },
    getStarCollectData() {
      const params = {
        type: 3,
        student_id: Number(Base64.decode(this.studentId)),
      };
      getStarCollectData(params).then(() => {});
    },
    getStarTestReport() {
      this.loading = true;
      getStarTestReport(this.studentId).then((res) => {
        if (res.error_code !== 0) {
          console.log(res.error_msg);
          return;
        }
        this.loading = false;
        this.starReport = res.data;
        this.statisticalData();
      });
    },
  },
};
</script>

<style lang="less">
@import '../../../styles/basic.less';
.star-test {
  @col-red: #cd5557;
  @col-orange: #eca539;
  @col-darkpurple: #6e49d7;
  @col-green: #87aa66;
  @col-purple: #5700a1;
  padding-bottom: 1.2rem;
  min-height: 100%;
  .bg-m('@{img-path}/star-test-banner.png');
  background-size: 100% 7.59rem;
  background-color: #fff;
  &.nobg {
    background: transparent;
  }
  .share-box {
    position: absolute;
    right: .3rem;
    top: .25rem;
    .share-icon {
      display: block;
      margin: 0 auto;
      .wh(.58rem,.58rem);
      .bg-m('@{img-path}/share-arrow.png');
      background-size: 100% 100%;
    }
    p {
      margin-top: .1rem;
      line-height: .3rem;
      color: #fff;
    }
  }
  .header {
    padding: 1.7rem 0 .8rem;
    text-align: center;
    color: #fff;
    h4 {
      font-size: .34rem;
      small {
        display: block;
        margin-top: .16rem;
        font-size: .24rem;
      }
    }
    .avater {
      display: block;
      margin: .35rem auto 0;
      .wh(1.25rem,1.25rem);
      img {
        .wh-img;
        border-radius: 100%;
      }
    }
    p{
      margin-top: .16rem;
      font-size: .27rem;
    }
  }
  .test-item {
    position: relative;
    border-radius: .06rem;
    margin: 0 .25rem;
    padding: .4rem .3rem .5rem;
    background: #fff;
    box-shadow: 0 -.07rem .19rem .04rem rgba(189,216,252,0.75);
    h5 {
      display: flex;
      font-size: .3rem;
      line-height: .3rem;
      color: @col-light-purple;
      em{
        position: relative;
        padding-right: .2rem;
        font-size: .41rem;
      }
      span {
        margin-right: .1rem;
        .wh(.01rem,.31rem);
        background: @col-light-purple;
      }
    }
    .legend-box{
      p {
        display: flex;
        justify-content: flex-end;
        font-size: .18rem;
        line-height: .3rem;
      }
      em {
        margin-top: .1rem;
        height: .13rem;
        flex: 0 0 .36rem;
      }
      span {
        flex: 0 0 1.1rem;
        padding-left: .1rem;
      }
    }
  }
  .test-infor {
    p{
      line-height: .4rem;
      font-size: .27rem;
    }
  }
  .test-part1 {
    .legend-box{
      margin-top: .3rem;
      p {
        &:nth-child(1) {
          em{
            background: @col-red;
          }
        }
        &:nth-child(2) {
          em {
            background: @col-orange;
          }
        }
        &:nth-child(3) {
          em {
            background: @col-darkpurple;
          }
        }
        &:nth-child(4) {
          em {
            background: @col-green;
          }
        }
      }
    }
    .percentage-box {
      position: relative;
      &.left {
        .pointer {
          span {
            left: 0;
            margin-left: -.12rem;
          }
        }
      }
      &.right {
        .pointer {
          span {
            left: auto;
            margin-left: 0;
            right: 0;
            margin-right: -.12rem;
          }
        }
      }
      .pointer {
        position: absolute;
        top: -.6rem;
        left: 0%;
        margin-left: -.12rem;
        padding-bottom: .6rem;
        width: .24rem;
        font-size: .18rem;
        color: @col-purple;
        span {
          position: absolute;
          bottom: .3rem;
          width: 1.9rem;
          left: 50%;
          margin-left: -1.9rem/2;
        }
        em {
          .wh(0,0);
          position: absolute;
          bottom: 0;
          left: 0;
          overflow: hidden;
          border: .12rem solid transparent;
          border-top-color: @col-purple;
        }
      }
    }
    .percentage-bar{
      display: flex;
      height: .4rem;
      margin-top: .6rem;
      span {
        &:nth-child(1) {
          width: 10%;
          background: @col-red;
        }
        &:nth-child(2) {
          width: 14%;
          background: @col-orange;
        }
        &:nth-child(3) {
          width: 16%;
          background: @col-darkpurple;
        }
        &:nth-child(4) {
          width: 60%;
          background: @col-green;
        }
      }
    }
    .kpi-box {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      // align-content: center;
      padding: .15rem 0;
      text-align: center;
      h4 {
        font-size: .36rem;
        line-height: .3rem;
        em {
          color: #333;
        }
        span {
          font-size: .48rem;
          color: @col-light-purple;
        }
        small {
          display: block;
          font-size: .2rem;
        }
      }
      .kpi-item {
        flex: 0 0 2.7rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: .5rem 0;
        margin: .15rem;
        background: #f4f4f4;
      }
    }
  }
  .test-part2 {
    .legend-box {
      margin-top: .3rem;
      p {
        span {
          flex: 0 0 .6rem;
          padding-left: .1rem;
        }
        &:nth-child(1) {
          color: @col-light-purple;
          em{
            background: @col-light-purple;
          }
        }
      }
    }
    .radar-box {
      width: 100%;
      height: 5rem;
    }
    .tips {
      margin-top: .2rem;
      font-size: .24rem;
      line-height: .34rem;
      color: #878787;
    }
  }
  .test-part3 {
    ul {
      margin-top: .25rem;
      color: #878787;
      li {
        position: relative;
        padding-left: .3rem;
        line-height: .5rem;
        &:before {
          content: '';
          .pos-box-hc(.11rem,.11rem);
          left: 0;
          border-radius: 100%;
          background: @col-light-purple;
        }
        em {
          color: @col-light-purple;
        }
      }
    }
  }
  .vipcn-box {
    padding-bottom: 1rem;
    .qrcode {
      display: block;
      margin: 1rem auto 0;
      .wh(1.82rem,1.82rem);
      img {
        .wh-img;
      }
    }
    p {
      margin-top: .1rem;
      line-height: .34rem;
      text-align: center;
    }
  }
  .btn-share {
    position: fixed;
    left: 0;
    bottom: 0;
    .wh(100%,1.1rem);
    line-height: 1.1rem;
    font-size: .36rem;
    text-align: center;
    .btn-purple;
  }
}
</style>

