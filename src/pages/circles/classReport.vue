<template>
  <div>
    <div class="report">
      <div class="cover">
        <img class="head-portrait" v-if="teacherInfo.avatar_url" :src="teacherInfo.avatar_url">
        <img class="head-portrait" v-else src="../../assets/default-photo-teacher.png">
        <h3>
          {{teacherInfo.realname}}
          <i>{{referatInfo.created_at}}</i>
        </h3>
      </div>
      <div class="write-border">
        <h2>Content Learning 学习目标</h2>
        <div class="star">
          <ul>
            <li >
              <em>主动参与</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.initiative*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.initiative-1]}}</span>
            </li>
            <li>
              <em>发音和流利度</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.pronunciation*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.pronunciation-1]}}</span>
            </li>
            <li>
              <em>整句表达</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.sentence*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.sentence-1]}}</span>
            </li>
            <li>
              <em>核心词汇</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.lexis*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.lexis-1]}}</span>
            </li>
            <li>
              <em>复述文章</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.repeat*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.repeat-1]}}</span>
            </li>
          </ul>
          <div class="notice">
            注：核心词汇（理解和应用核心词汇）<br/>
            复述文章（应用核心词汇和排序技巧，用所学到的语言复述整篇文章）
          </div>
        </div>
        <div v-if="referatInfo.correction">
          <h3 class="original_border">随堂订正</h3>
          <p class="original">{{referatInfo.correction}}
            <span @click="translate(0)">我要翻译</span></p>
          <p class="translate" v-show="isShow[0].translate">
            {{referatInfo.correction_cn}}<i>&nbsp;&nbsp;翻译来自百度</i>
          </p>
        </div>
      </div>
      <div class="write-border">
        <h2>Class Performance 课堂表现</h2>
        <div class="star">
          <ul>
            <li>
              <em>参与度</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.engagement*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.engagement-1]}}</span>
            </li>
            <li>
              <em>自信度</em>
              <div class="starshow">
                <i :style="'width:'+referatInfo.confidence*25+'%'" :class="{'empty': empty}">
                  &nbsp;
                </i>
              </div>
              <span>{{state[referatInfo.confidence-1]}}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 v-if="referatInfo.suggestion_part1" class="original_border">教师建议</h3>
          <p class="original" v-if="referatInfo.suggestion_part1">
          {{referatInfo.suggestion_part1}}
          <span @click="translate(1)">我要翻译</span></p>
          <p class="translate" v-if="isShow[1].translate">
            {{referatInfo.suggestion_part1_cn}}<i>&nbsp;&nbsp;翻译来自百度</i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
 <script>
import { getTeacherInfo } from '@/api';
import { isEmpty } from 'lodash';

export default {
  data() {
    return {
      empty: true,
      referatInfo: {},
      teacherInfo: {},
      isShow: [
        { translate: false },
        { translate: false },
      ],
      state: [
        '还需加油',
        '中',
        '好',
        '非常好',
      ],
    };
  },
  methods: {
    translate(index) {
      console.log(index);
      this.isShow[index].translate = !this.isShow[index].translate;
    },
    getReportInfo() {
      const scheduleId = this.$route.params.scheduleId;
      return this.$http.get(`${this.apiConfig.host}/classroom/schedules/${scheduleId}/feedback`).then((response) => {
        if (response.error_code !== 0) {
          return false;
        }
        if (!isEmpty(response.data)) {
          let contentType = 0;
          contentType = response.data.course.content_type;

          if (contentType === 1) {
            this.$router.replace({
              name: 'reportReach',
              params: {
                scheduleId: response.data.schedule_id,
              },
            });
          } else if (contentType === 3 || (contentType >= 6 && contentType < 10)) {
            this.$router.replace({
              name: 'reportHe',
              params: {
                scheduleId: response.data.schedule_id,
              },
            });
          }
          this.empty = true;
          return false;
        }
      });
    },
  },
  async mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    await getTeacherInfo(this.$route.params.teacherId);
    this.teacherInfo = this.$store.state.teacherInfo;
    await this.getReportInfo();
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.report{
  display: none;
  background: @col-bg;
  padding:0 0 .3rem 0;
  min-height: 100%;
  .cover{
    .bg-m('@{img-path}/teacher-details-img1.png',0,0,no-repeat);
    background-size: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 2.2rem;
    color: @col-white;
    & .head-portrait{
      .wh(1.6rem,1.6rem);
      border-radius: 100%;
      margin: 0 .26rem 0 .5rem;
    }
    & h3{
      font-size: .36rem;
      i{
        display: block;
        font-size: .26rem;
      }
    }
  }
  .write-border{
    background: @col-white;
    border-radius: .2rem;
    padding-bottom: .3rem;
    // min-height: 3rem;
    margin: .3rem .3rem 0 .3rem;
    em{
      color: @col-gray;
    }
  }
  h2{
    font-size: .36rem;
    color: @col-darkgray;
    text-align: center;
    padding: .3rem 0;
  }
  h3{
    font-size: .3rem;
    color: @col-gray;
    padding: 0 0 0 0.3rem;
    &.original_border{
      border-top: .01rem solid @col-gray;
      padding: .3rem 0 0 0.3rem;
    }
  }
  p{
    font-size: .3rem;
    color: @col-darkgray;
    word-break: break-all;
    padding: .2rem .3rem .3rem;
    &.translate{
      padding: .3rem;
      background: #f5f7fa;
      margin: 0 .3rem;
      position: relative;
      border-radius: .1rem;
      &::before{
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        .wh(.55rem,.55rem);
        display: block;
        .bg-m('../assets/translate-img1.png',0,0,no-repeat);
        background-size: 100%;
      }
      i{
        color: @col-gray;
      }
    }
    span{
      color: @col-blue;
    }
  }
  .star{
    padding: 0 .3rem .3rem;
    li{
      display: flex;
      font-size: .3rem;
      line-height: .4rem;
      margin: .3rem 0 0 0;
      em{
        width:2rem;
      }
      span{
        color: @col-yellow;
        padding-left: .4rem;
      }
      .starshow{
        .wh(2.52rem,.4rem);
        overflow: hidden;
        .bg-m('../assets/star-img1.png',0,0,no-repeat);
        background-size: 100% 100%;
        i{
          display: block;
          .bg-m('../assets/star-img2.png',0,0,no-repeat);
          background-size: auto 100%;
          &.empty{
            width: 0%;
          }
        }
      }
    }
  }
  .notice{
    color: @col-gray;
    margin: .2rem 0 0 0;
  }
}
</style>
