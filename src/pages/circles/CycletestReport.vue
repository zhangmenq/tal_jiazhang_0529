<template>
  <div>
    <div class="cycle-test" v-if="!isLoading">
      <div class="header">
        <div class="bg-img" v-if="resData.student">
          <h2>测试报告</h2>
          <div class="avatar-img">
            <img :src="resData.student.avatar_url" alt="" v-if="resData.student.avatar_url">
            <img src="../../assets/default-photo.png" alt="" v-else>
          </div>
          <h3>{{resData.student.enname ? resData.student.enname : resData.student.realname}}</h3>
          <h4>
            <i>年级：{{resData.student.grade_names}}</i>
            <i>测评老师：{{resData.teacher.realname}}</i>
          </h4>
        </div>
      </div>
      <div class="content-box">
        <div class="analyze title">
          <h2><span class="marked" v-if="resData.student">{{resData.student.enname ? resData.student.enname : resData.student.realname}}</span>同学，你好！</h2>
          <p>首先，非常高兴你来参加本次循环测试，当然，考试成绩固然重要，但考试能给我们带来的远不止成绩和名次这么简单。考试也能反映出你在平时学习过程中的知识薄弱项以及你在临场发挥时可能出现的问题。考试过后，我们不应该把考试的试卷束之高阁，而应该珍惜这一次揭示我们弱点的大好机会，仔细分析我们在知识和临场发挥上的问题与不足。这样，才能让每一次考试在能给我们成绩之外，还能成为我们进步的阶梯。</p>
        </div>
        <div class="analyze score">
          <h2 class="headline">01 <span> | 成绩分析</span></h2>
          <table cellspacing="0">
            <tr>
              <td>项目</td>
              <td>词汇</td>
              <td>互动沟通</td>
              <td>发音</td>
              <td>流利度</td>
              <td>语法</td>
              <td>总分</td>
            </tr>
            <tr v-for="(item, index) in gradeTable" :key="index">
              <td>{{item.title}}</td>
              <td v-for="(score, num) in item.score" :key="num">{{score}}</td>
            </tr>
          </table>
          <echarts id="scoreBar"
            class="chart-bar"
            :data="scoreData"
            v-if="scoreData">
          </echarts>
        </div>
        <div class="analyze chart-image">
          <h2 class="headline">02 <span> | 能力模型分析</span></h2>
          <echarts id="abilityRadar"
            class="chart-radar"
            :data="abilityData"
            v-if="abilityData">
          </echarts>
          <p>
            此图表为能力雷达模型，展示的是个人能力与学员平均能力的比较。如图所示，途中的多边形每个顶点代表一个题型的满分。考生某项能力越接近顶点越说明考生该项能力越强，考生各题能力形状和外表多边形相似则说明能力均衡,反之则能力构成不平衡。
          </p>
        </div>
        <div class="analyze chart-image" v-if="resData.student.fce">
          <h2 class="headline">03 <span> | 和{{resData.student.fce}}考试的距离</span></h2>
          <echarts id="distanceRadar"
            class="chart-radar"
            :data="distanceData"
            v-if="distanceData">
          </echarts>
          <p>注：该图中的评判标准与{{resData.student.fce}}考试相同，可以看出学员在不同口语能力与{{resData.student.fce}}之间的差距。</p>
        </div>
        <div class="analyze learning-advice">
          <h2 class="headline">{{resData.student.fce ? '04' : '03'}} <span> | 学习建议</span></h2>
          <p v-if="gradeTable[1].score">
            在本次测试中，孩子的知识掌握程度达到了<span class="marked">{{gradeTable[1].score[5]}}%</span>，
            <font v-if="gradeTable[1].score[5] >= 80 && gradeTable[1].score[5] <= 100">孩子有较高的词汇水平，能够正确表达出日常所需的词汇，有较高的词汇认读水平，能够正确认读日常所需的词汇，加入较难英文原版故事，积累语境中多义词的用法。在日常对话的听力和表达方面都非常优秀，建议继续坚持目前的英语学习计划，家长可多为孩子创建英文对话场景，鼓励孩子积极进行英文表达，让孩子有机会学以致用并不断获得成就感，激励孩子取得更大的进步。孩子在特定话题的对话交流中，能够准确理解对方的问题和意图，并作出正确的回答，语言面貌也非常值得表扬，建议继续坚持目前的学习，同时家长可为孩子创建更多的英文对话场景，给孩子提供更多的英文展示和交流机会，鼓励孩子在英语学习上继续努力，希望你在英文综合表达能力方面能够有更大的进步哦！</font>
            <font v-else-if="gradeTable[1].score[5] >= 60 && gradeTable[1].score[5] < 80">孩子有一定的词汇理解基础，能够看图猜出日常基本词汇，有一定的词汇认读基础，能够正确认读日常所需的词汇，建议平时继续坚持常规英语学习计划外，加入更多英文故事的阅读积累语境中的词汇。在日常对话的听力和表达方面有一定的基础，能够听懂并回答常规生活问题。建议在之后的学习中，每天坚持英文听力训练，多创建英文对话的场景，让孩子将所学知识学以致用并不断巩固提高。在特定话题的对话交流中，孩子能够基本理解对方的问题，并作出恰当的回答，建议在打牢基础学习的同时，多注意问答的互动型表达，提高语音语调的精准度及词汇的高级用法，锻炼自己的理解和表达能力，希望你在英文综合表达能力方面能够有更大的进步哦！</font>
            <font v-else-if="gradeTable[1].score[5] >= 40 && gradeTable[1].score[5] < 60">孩子在词汇意思学习方面仍有很大进步空间，建议多积累基础词汇，每天建议抽出10分钟进行单词的学习和复习进行巩固。希望你能够在词汇记忆方面能够有更大的进步哦！在词汇理解方面仍有较大进步空间，建议多积累基础词汇，并放到日常语境中进行理解，每天建议抽出5分钟进行简单英文故事的阅读和理解。日常对话的听力和表达方面有很大进步空间，建议平时每天坚持至少10分钟英文听力训练，多说多练，打好表达基础，同时鼓励孩子能够将所学知识在相应的场景中进行表达。孩子在特定自由话题的交流中，交流表达能力尚有很大进步空间，建议平时从基础词汇、语音和句型表达学起，先打牢语言基础，同时家长需给予孩子更多的鼓励和帮助，多听多读原版绘本故事，多说多练，一步一个脚印，希望你在英文综合表达能力方面能够有更大的进步哦！</font>
            <font v-else-if="gradeTable[1].score[5] >= 20 && gradeTable[1].score[5] < 40">孩子在词汇认知方面有很大进步空间，建议平时加大词汇的记忆时间，可采取自然拼读或音标学习。每天建议抽出10分钟进行单词的学习和复习进行巩固。在词汇理解方面仍有较大进步空间，多积累基础词汇，并放到日常语境中进行理解，每天建议抽出5分钟进行简单英文故事的阅读和理解。日常对话的听力和表达方面，建议平时每天坚持至少10分钟英文听力训练，打好表达基础，同时鼓励孩子能够将所学知识在相应的场景中进行表达。孩子尚不能进行自由地交流表达。在平时的生活中多给孩子收听收看英文类节目，打牢语言基础，为之后的输出打好坚实的基础。</font>
            <font v-else>孩子在词汇认知方面有很大进步空间，建议平时加大词汇的记忆时间，可采取自然拼读或音标学习。每天建议抽出10分钟进行单词的学习和复习进行巩固。词汇理解方面仍有较大进步空间，建议多积累基础词汇，并放到日常语境中进行理解，每天建议抽出5分钟进行简单英文故事的阅读和理解。希望你能够在词汇方面取得更大进步！日常对话的听力和表达方面，建议孩子平时每天坚持至少10分钟英文听力训练，打好表达基础，同时鼓励他能够将所学知识在相应的场景中进行表达。孩子尚不能进行自由地交流表达。平时的生活中可多给孩子收听收看英文类节目，打牢语言基础，为之后的输出打好坚实的基础。</font>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from '@/components/circles/Echarts.vue';
import { isEmpty } from 'lodash';

export default {
  data() {
    return {
      gradeTable: [
        { title: '满分', score: [20, 20, 20, 20, 20, 100] },
        { title: '你的得分', score: [] },
        { title: '同级别最高分', score: [] },
        { title: '同级别最低分', score: [] },
        { title: '同级别平均分', score: [] },
      ],
      scoreData: {},
      abilityData: {},
      distanceData: {},
      resData: {},
      isLoading: true,
    };
  },
  components: {
    echarts,
  },
  methods: {
    getCycleInfo() {
      const id = this.$route.params.scheduleId;
      this.$http.get(`${this.apiConfig.host}/classroom/schedule/${id}/cycle-test-report`).then((res) => {
        this.isLoading = false;
        if (res.error_code !== 0) {
          return false;
        }
        if (!isEmpty(res.data)) {
          this.resData = res.data;
          this.resData.score.map((item) => {
            this.gradeTable[1].score.push(item.user_score);
            this.gradeTable[2].score.push(item.highest_score);
            this.gradeTable[3].score.push(item.lowest_score);
            this.gradeTable[4].score.push(item.equal_score);
            return this.gradeTable;
          });
          this.statisticalData();
        }
      });
    },
    // 统计图
    statisticalData() {
      const removesTotalScore = {
        user_score: this.gradeTable[1].score.slice(0, 5),
        equal_score: this.gradeTable[4].score.slice(0, 5),
      };
      const radar = { // radar公共部分
        splitNumber: 4,
        name: {
          formatter: (text) => {
            text = text.replace(/-/g, '\n');
            return text;
          },
        },
        indicator: [
          {
            name: 'Lexis词汇',
            max: 20,
            axisLabel: {
              show: true,
              fontSize: this.getDpr(),
              color: '#878787',
              showMinLabel: true, //显示最小数字，即中心点显示0
              // showMaxLabel: false, //不显示最大值
            },
          },
          { name: 'Interactive-Communication-互动沟通', max: 20 },
          { name: 'Pronunciation发音', max: 20 },
          { name: 'Fluency流利度', max: 20 },
          { name: 'Grammar语法', max: 20 },
        ],
        splitArea: { // 图表背景的颜色
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: 'rgba(171,197,228,.5)', // 设置网格的颜色
          },
        },
      };
      this.scoreData = {
        color: ['#9A57C8'],
        tooltip: {},
        xAxis: {
          data: ['词汇', '互动沟通', '发音', '流利度', '语法'],
          axisLabel: {
            textStyle: {
              color: '#1C223D',
              fontSize: this.getDpr(),
            },
          },
        },
        yAxis: {
          max: 20,
          axisLabel: {
            textStyle: {
              color: '#1C223D',
              fontSize: this.getDpr(),
            },
          },
        },
        series: [{
          name: '',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            normal: {
              color: (params) => {
                const colorList = ['#6E49D7', '#4CB3D3', '#87AA66', '#ECA539', '#CD5557'];
                return colorList[params.dataIndex];
              },
            },
          },
          data: removesTotalScore.user_score,
        }],
      };
      this.abilityData = {
        // tooltip: {},
        textStyle: { // legend
          color: '#1C223D',
          fontSize: this.getDpr(),
        },
        legend: {
          data: ['平均', '学员'],
          orient: 'vertical',
          left: 'right',
          selectedMode: false, //取消图例上的点击事件
        },
        radar: radar,
        series: [{
          name: '',
          type: 'radar',
          areaStyle: {
            normal: {
              width: 2,
              opacity: 0,
            },
          },
          data: [
            {
              value: removesTotalScore.equal_score,
              name: '平均',
              symbol: 'rect',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: '#9A57C8',
                  lineStyle: {
                    width: 1,
                    color: '#9A57C8',
                  },
                },
              },
            },
            {
              value: removesTotalScore.user_score,
              name: '学员',
              symbol: 'rect',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: '#FA7260',
                  lineStyle: {
                    width: 1,
                    color: '#FA7260',
                  },
                },
              },
            },
          ],
        }],
      };
      this.distanceData = {
        // tooltip: {},
        textStyle: {
          color: '#1C223D',
          fontSize: this.getDpr(),
        },
        legend: {
          data: ['通过', '优秀', '学员得分'],
          orient: 'vertical',
          left: 'right',
          selectedMode: false,
        },
        radar: radar,
        series: [{
          name: '',
          type: 'radar',
          areaStyle: {
            normal: {
              width: 2,
              opacity: 0,
            },
          },
          data: [
            {
              value: [12, 12, 12, 12, 12],
              name: '通过',
              symbol: 'rect',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: '#9A57C8',
                  lineStyle: {
                    width: 1,
                    color: '#9A57C8',
                  },
                },
              },
            },
            {
              value: [17, 17, 17, 17, 17],
              name: '优秀',
              symbol: 'rect',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: '#42D6CA',
                  lineStyle: {
                    width: 1,
                    color: '#42D6CA',
                  },
                },
              },
            },
            {
              value: removesTotalScore.user_score,
              name: '学员得分',
              symbol: 'rect',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: '#FA7260',
                  lineStyle: {
                    width: 1,
                    color: '#FA7260',
                  },
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
  },
  mounted() {
    this.getCycleInfo();
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.cycle-test{
  font-size: .3rem;
  .header{
    text-align: center;
    position: relative;
    height: 5.67rem;
    color: @col-white;
    .l-gradient(0deg,rgba(192,117,255,1),rgba(81,37,194,1));
    .bg-img{
      position: absolute;
      left: 0;
      top: 0;
      padding-top: .5rem;
      .wh(100%,100%);
      .bg-m('@{img-path}/cycle-test-bg.png',0,0,no-repeat);
      background-size: 100% 100%;
      h2{
        font-size: .34rem;
      }
      .avatar-img{
        .wh(1.25rem,1.25rem);
        margin: .1rem auto;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      h3{
        font-size: .27rem;
        margin: 0 0 .1rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      h4{
        i{
          font-size: .27rem;
          padding: 0 .2rem;
        }
      }
    }
  }
  .content-box{
    position: relative;
    width: 6.95rem;
    background: @col-white;
    margin: -2rem auto 1.12rem;
    border-radius: .06rem;
    .analyze{
      background: @col-white;
      box-shadow: 0 .07rem .19rem .04rem rgba(189,216,252,0.75);
      border-radius: .06rem;
      padding: .3rem;
      .headline{
        color: #9A57C8;
        font-size: .41rem;
        margin-bottom: .3rem;
        span{
          display: inline-block;
          vertical-align: middle;
          margin: -.11rem 0 0 0;
          font-size: .3rem;
        }
      }
      span{
        &.marked{
          color: #9A57C8;
        }
      }
    }
    .title{
      color: #1C223D;
      padding: .3rem;
      font-size: .24rem;
      h2{
        font-size: .3rem;
      }
    }
    .score{
      table {
        width: 100%;
        border-collapse: collapse;
        th, td{
          font-size: .23rem;
          border: .01rem solid #CCC;
          line-height: .29rem;
          text-align: center;
        }
        td{
          padding: .16rem 0;
        }
      }
      .chart-bar{
        margin-top: .2rem;
        width: 100%;
        height: 5rem;
      }
    }
    .chart-image{
      // margin-top: -.48rem;
      .chart-radar{
        width: 100%;
        height: 5rem;
      }
      p{
        color: #878787;
        font-size: .28rem;
      }
    }
    .learning-advice{
      p{
        color: #1C223D;
        font-size: .28rem;
      }
    }
  }
}
</style>
