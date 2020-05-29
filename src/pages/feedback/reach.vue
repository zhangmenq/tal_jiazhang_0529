<template>
  <div class="feedBack">
    <div class="header-infor">
      <div class="head-portrait">
        <font v-if="userInfo.avatar">
          <img :src="userInfo.avatar_url">
        </font>
        <font v-else>
          <img src="../../assets/default-photo.png">
        </font>
      </div>
      <div class="showInfor">
        <h3 v-if="userInfo.enname && userInfo.realname">
          <font v-if="userInfo.enname">{{userInfo.enname}}</font>
          <font v-else>{{userInfo.realname}}</font>
        </h3>
        <p>{{schedulesInfo.circle && schedulesInfo.circle.circles ? schedulesInfo.circle.circles.title : ''}}</p>
        <h4 v-if="reachInfo.updated_at">{{reachInfo.updated_at.slice(0,10)}}</h4>
      </div>
    </div>
    <div class="feedBackCont">
      <div class="title-item">
        <a href="javascript:;" @click="tabFun" :class="{'active':!tabShow}">学习效果</a>
        <a href="javascript:;" @click="tabFun" :class="{'active':tabShow}">外教评语</a>
      </div>
      <div class="title-cont">
        <div class="learingCont" v-show="!tabShow">
          <div>
            <div class="record-tit">
              <h2><span>听力与表达</span></h2>
            </div>
            <div class="aim" v-if="aimsContent.express && aimsContent.express.length > 0">
              <div class="aimcont"
                :class="{
                'fold': !isExpandAims[0].tags && teachingAims(aimsContent.express),
                'unfold': isExpandAims[0].tags && teachingAims(aimsContent.express)}">
                <p v-for="(item,index) in aimsContent.express"
                :key="index" v-if="item.title || item.title_en">
                 {{item.title}}<br/>
                 {{item.title_en}}
                </p>
              </div>
              <i v-if="teachingAims(aimsContent.express)" @click="lookMore(0)">
                {{!isExpandAims[0].tags ? '查看更多' : '收起'}} &gt;&gt;
              </i>
            </div>
            <div class="star-rate rechStar">
              <ul>
                <li>
                  <div class="label">发音</div>
                  <div class="star"><span :style="'width:'+reachInfo.pronunciation*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">理解运用核心词汇和句型</div>
                  <div class="star"><span :style="'width:'+reachInfo.understanding_application*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">表达流利度和准确度</div>
                  <div class="star"><span :style="'width:'+reachInfo.speaking_accuracy*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">口语交流主动性</div>
                  <div class="star">
                    <span :style="'width:'+reachInfo.speaking_communication*20+'%'">
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>阅读能力</span></h2>
            </div>
            <div class="aim" v-if="aimsContent.read && aimsContent.read.length > 0">
              <div class="aimcont"
                :class="{
                'fold': !isExpandAims[1].tags && teachingAims(aimsContent.read),
                'unfold': isExpandAims[1].tags && teachingAims(aimsContent.read)}">
                <p v-for="(item,index) in aimsContent.read"
                :key="index" v-if="item.title || item.title_en">
                  {{item.title}}<br/>
                  {{item.title_en}}
                </p>
              </div>
              <i v-if="teachingAims(aimsContent.read)" @click="lookMore(1)">
                {{!isExpandAims[1].tags ? '查看更多' : '收起'}} &gt;&gt;
              </i>
            </div>
            <div class="star-rate rechStar">
              <ul>
                <li>
                  <div class="label">阅读策略的运用</div>
                  <div class="star"><span :style="'width:'+reachInfo.reading_strategy*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">篇章阅读理解</div>
                  <div class="star"><span :style="'width:'+reachInfo.reading_comprehension*20+'%'"></span></div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>思维能力</span></h2>
            </div>
            <div class="aim" v-if="aimsContent.think && aimsContent.think.length > 0">
              <div class="aimcont"
                :class="{
                'fold': !isExpandAims[1].tags && teachingAims(aimsContent.think),
                'unfold': isExpandAims[1].tags && teachingAims(aimsContent.think)}">
                <p v-for="(item,index) in aimsContent.think"
                :key="index" v-if="item.title || item.title_en">
                  {{item.title}}<br/>
                  {{item.title_en}}
                </p>
              </div>
              <i v-if="teachingAims(aimsContent.think)" @click="lookMore(1)">
                {{!isExpandAims[1].tags ? '查看更多' : '收起'}} &gt;&gt;
              </i>
            </div>
            <div class="star-rate rechStar">
              <ul>
                <li>
                  <div class="label">运用可视化思维工具</div>
                  <div class="star"><span :style="'width:'+reachInfo.thinking_tools*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">思维技能的运用</div>
                  <div class="star"><span :style="'width:'+reachInfo.thinking_skills*20+'%'"></span></div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>参与度</span></h2>
            </div>
            <div class="star-rate rechStar">
              <ul>
                <li>
                  <div class="label">课堂参与积极性</div>
                  <div class="star"><span :style="'width:'+reachInfo.active_activities*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">注意力</div>
                  <div class="star"><span :style="'width:'+reachInfo.attention_span*20+'%'"></span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="commentCont" v-show="tabShow">
          <div>
            <div class="record-tit">
              <h2><span>课堂记录</span></h2>
            </div>
            <p class="original" v-if="reachInfo.areas_growth">
              {{reachInfo.areas_growth}}
              <span @click="translate(0)">我要翻译</span>
            </p>
            <p class="translate" v-show="isShow[0].translate">
              {{reachInfo.areas_growth_cn}}
              <i>&nbsp;&nbsp;翻译来自百度</i>
            </p>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>提升建议</span></h2>
            </div>
            <p class="original" v-if="reachInfo.improvement">
              {{reachInfo.improvement}}
              <span @click="translate(1)">我要翻译</span>
            </p>
            <p class="translate" v-show="isShow[1].translate">
              {{reachInfo.improvement_cn}}
              <i>&nbsp;&nbsp;翻译来自百度</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getFeedback, getUserInfo, getAims, getSchedulesInfo } from '@/api';

export default {
  data() {
    return {
      tabShow: false,
      isShow: [
        { translate: false },
        { translate: false },
      ],
      reachInfo: {},
      userInfo: {},
      aimsContent: {},
      schedulesInfo: {},
      isExpandAims: [
        { tags: false },
        { tags: false },
      ],
    };
  },
  computed: {
    scheduleId() {
      return this.$route.params.scheduleId;
    },
  },
  methods: {
    teachingAims(content) {
      const title = [];
      let str = '';
      content.forEach((item) => {
        title.push(item.title);
        title.push(item.title_en);
      });
      str = title.join(',');
      if (str.length > 155) {
        return true;
      }
      return false;
    },
    lookMore(index) {
      this.isExpandAims[index].tags = !this.isExpandAims[index].tags;
    },
    tabFun() {
      this.tabShow = !this.tabShow;
    },
    translate(index) {
      this.isShow[index].translate = !this.isShow[index].translate;
    },
    FeedbackInfo() {
      getFeedback(this.scheduleId).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.reachInfo = res.data;
      }).then(() => {
        this.getTeachingAims();
      });
    },
    getTeachingAims() {
      getAims(this.scheduleId).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.aimsContent = res.data.target;
      });
    },
    getSchedulesInfo() {
      getSchedulesInfo(this.scheduleId).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.schedulesInfo = res.data;
      });
    },
  },
  async mounted() {
    await getUserInfo();
    this.userInfo = this.$store.state.userInfo;
    await this.FeedbackInfo();
    await this.getSchedulesInfo();
  },
};
</script>

<style lang="less">

  @import '../../styles/basic.less';
  @import '../../styles/feedBack.less';

</style>
