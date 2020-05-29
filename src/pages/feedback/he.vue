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
        <h4 v-if="heInfo.updated_at">{{heInfo.updated_at.slice(0,10)}}</h4>
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
              <h2><span>语言能力</span></h2>
            </div>
            <div class="star-rate heStar">
              <ul>
                <li>
                  <div class="label">发音</div>
                  <div class="star"><span :style="'width:'+heInfo.pronunciation*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">单词和句型</div>
                  <div class="star"><span :style="'width:'+heInfo.vocabulary_sentence*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">听力</div>
                  <div class="star"><span :style="'width:'+heInfo.listening*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">交流互动</div>
                  <div class="star"><span :style="'width:'+heInfo.communicative_interaction*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">语法</div>
                  <div class="star"><span :style="'width:'+heInfo.grammar*20+'%'"></span></div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>课堂表现</span></h2>
            </div>
            <div class="star-rate heStar">
              <ul>
                <li class="heInfo.engagement">
                  <div class="label">参与度</div>
                  <div class="star"><span :style="'width:'+heInfo.engagement*20+'%'"></span></div>
                </li>
                <li>
                  <div class="label">课堂表现</div>
                  <div class="star"><span :style="'width:'+heInfo.confidence_classroom*20+'%'"></span></div>
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
            <p class="original" v-if="heInfo.areas_growth">
              {{heInfo.areas_growth}}
              <span @click="translate(0)">我要翻译</span>
            </p>
            <p class="translate" v-show="isShow[0].translate">
              {{heInfo.areas_growth_cn}}
              <i>&nbsp;&nbsp;翻译来自百度</i>
            </p>
          </div>
          <div>
            <div class="record-tit">
              <h2><span>提升建议</span></h2>
            </div>
            <p class="original" v-if="heInfo.improvement">
              {{heInfo.improvement}}
              <span @click="translate(1)">我要翻译</span>
            </p>
            <p class="translate" v-show="isShow[1].translate">
              {{heInfo.improvement_cn}}
              <i>&nbsp;&nbsp;翻译来自百度</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getFeedback, getUserInfo, getSchedulesInfo } from '@/api';

export default {
  data() {
    return {
      tabShow: false,
      isShow: [
        { translate: false },
        { translate: false },
      ],
      heInfo: {},
      userInfo: {},
      schedulesInfo: {},
    };
  },
  computed: {
    scheduleId() {
      return this.$route.params.scheduleId;
    },
  },
  methods: {
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
        this.heInfo = res.data;
      }).then(() => {
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
