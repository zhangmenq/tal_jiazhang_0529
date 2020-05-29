<template>
  <div class="evaluate">
    <div class="item">
      <h1><em class="evaluate-icon course-icon"></em>课程点评</h1>
      <div class="evaluate-cont">
        <span class="tit">有趣味</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.interest"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'interest'">
          </rater>
        </div>
      </div>
      <div class="evaluate-cont">
        <span class="tit">有收获</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.harvest"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'harvest'">
          </rater>
        </div>
      </div>
      <h1><em class="evaluate-icon network-icon"></em>网络质量</h1>
      <div class="evaluate-cont">
        <span class="tit">音频质量</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.audio"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'audio'">
          </rater>
        </div>
      </div>
      <div class="evaluate-cont">
        <span class="tit">视频质量</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.video"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'video'">
          </rater>
        </div>
      </div>
      <h1><em class="evaluate-icon teacher-icon"></em>点评老师</h1>
      <div class="evaluate-cont">
        <span class="tit">互动引导</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.interactive"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'interactive'">
          </rater>
        </div>
      </div>
      <div class="evaluate-cont">
        <span class="tit">认真负责</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.serious"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'serious'">
          </rater>
        </div>
      </div>

      <div class="evaluate-cont">
        <span class="tit">适度纠错</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.error_correction_score"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'error_correction_score'">
          </rater>
        </div>
      </div>
      <div class="evaluate-cont">
        <span class="tit">教法灵活</span>
        <div class="rater-box">
          <rater
            :max="5"
            :score="rating.teaching_method_score"
            @increment="getRater"
            :disabled="isDisabled"
            :val="'teaching_method_score'">
          </rater>
        </div>
      </div>

      <div class="mark">
        <checker
          v-model="tag_ids"
          type="checkbox"
          default-item-class="checkbox-item"
          selected-item-class="checkbox-item-selected">
          <checker-item
            v-for="(item, index) in markList"
            :key="index"
            :value="index"
            :disabled="isDisabled"
            >
            {{item}}
          </checker-item>
        </checker>
      </div>
      <group>
        <x-textarea
          name="detail"
          placeholder="你想对老师说的话"
          v-model="content"
          :show-counter="false"
          :readonly="isDisabled"
          :rows="4">
        </x-textarea>
      </group>
    </div>
    <div class="btn-fn">
      <p class="error-tips">{{error_msg}}</p>
      <x-button
        v-if="showBtn"
        class="btn-submit"
        :class="{
        'active':
        !isDisabled &&
        rating.interest &&
        rating.harvest &&
        rating.audio &&
        rating.video &&
        rating.interactive &&
        rating.serious &&
        rating.error_correction_score &&
        rating.teaching_method_score &&
        tag_ids.length > 0}"
        @click.native="submit">
        提交
      </x-button>
    </div>
  </div>
</template>
<script>
import { XTextarea, XButton, Group, Checker, CheckerItem } from 'vux';
import { setApilog, getUserInfo } from '@/api';
import Rater from '../../components/circles/Rater';

export default {
  components: {
    XTextarea,
    Group,
    XButton,
    Checker,
    CheckerItem,
    Rater,
  },
  data() {
    return {
      rating: {
        interest: 0,
        harvest: 0,
        audio: 0,
        video: 0,
        interactive: 0,
        serious: 0,
        error_correction_score: 0,
        teaching_method_score: 0,
      },
      tag_ids: [],
      content: '',
      error_msg: '',
      showError: false,
      isDisabled: false,
      showBtn: false,
      markList: ['活泼热情', '经验丰富', '思维拓展', '发音纯正', '耐心亲和', '善于引导'],
    };
  },
  methods: {
    getRater(params) {
      this.$set(this.rating, params.val, params.num);
    },
    submit() {
      if (!(this.rating.interest &&
        this.rating.harvest &&
        this.rating.audio &&
        this.rating.video &&
        this.rating.interactive &&
        this.rating.serious &&
        this.rating.error_correction_score &&
        this.rating.teaching_method_score &&
        this.tag_ids.length)) {
        return false;
      }
      // 禁止修改
      this.isDisabled = true;
      const data = {
        course_interest_score: this.rating.interest,
        course_harvest_score: this.rating.harvest,
        network_audio_score: this.rating.audio,
        network_video_score: this.rating.video,
        interactive_score: this.rating.interactive,
        serious_score: this.rating.serious,
        error_correction_score: this.rating.error_correction_score,
        teaching_method_score: this.rating.teaching_method_score,
        content: this.content,
        tag_ids: this.tag_ids.join(','),
        teacher_id: this.$route.params.teacherId,
      };
      const scheduleId = this.$route.params.scheduleId;
      this.$http.post(`${this.apiConfig.host}/classroom/schedules/${scheduleId}/comments`, data).then((response) => {
        if (response.error_code !== 0) {
          this.isDisabled = false;
          this.showError = true;
          this.error_msg = '提交失败，请重试！';
          return false;
        }
        this.error_msg = '';
        this.$vux.toast.show({
          type: 'text',
          text: '点评成功',
          time: 2000,
          width: '50%',
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 3000);
      });
      setApilog({
        event_type: 68000,
        ext1: this.$route.params.scheduleId,
        ext2: 'course_1v1',
        ext3: 'submit',
        ext4: Number(this.$route.query.contenttype) === 1 ? 1 : 2,
        ext5: this.$store.state.userInfo.id || 0,
      });
    },
    getComment() {
      const scheduleId = this.$route.params.scheduleId;
      this.$http.get(`${this.apiConfig.host}/classroom/schedules/${scheduleId}/comments`).then((response) => {
        if (response.error_code !== 0 || response.data === null) {
          this.showBtn = true;
          return false;
        }
        const commentInfo = response.data;
        this.rating = {
          interest: commentInfo.course_interest_score,
          harvest: commentInfo.course_harvest_score,
          audio: commentInfo.network_audio_score,
          video: commentInfo.network_video_score,
          interactive: commentInfo.interactive_score,
          serious: commentInfo.serious_score,
          teaching_method_score: commentInfo.teaching_method_score,
          error_correction_score: commentInfo.error_correction_score,
        };
        this.content = commentInfo.content;
        this.tag_ids = commentInfo.tag_ids.map(value => parseInt(value, 10));
        this.isDisabled = true;
      });
    },
  },
  mounted() {
    getUserInfo();
    this.getComment();
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';

.evaluate{
  min-height: 100%;
  padding: .2rem;
  background-color: @col-bg;
  .item{
    padding: .2rem .3rem .3rem;
    background: #fff;
    border: .01rem solid .08rem;
  }
  h1{
    margin-bottom: .2rem;
    font-size: .36rem;
    .evaluate-icon{
      display: inline-block;
      vertical-align: middle;
      margin-right: .16rem;
      .wh(.44rem,.44rem);
      .bg-m('@{img-path}/evaluate-icon.png');
      background-size: .44rem 1.32rem;
      &.network-icon{
        background-position: 0 -.44rem;
      }
      &.teacher-icon{
        background-position: 0 -.88rem;
      }
    }
  }
  .evaluate-cont{
    display: flex;
    line-height: .44rem;
    margin-bottom: .2rem;
    .tit{
      width: 1.8rem;
      font-size: .3rem;
      color: @col-gray;
    }
    .txt{
      font-size: .26rem;
      color: @col-wrong;
    }
  }
  .mark{
    .vux-checker-box{
      margin: 0 -.14rem;
    }
    .checkbox-item{
      margin: .15rem .14rem;
      .wh(1.6rem,.6rem);
      border-radius: .3rem;
      line-height: .6rem;
      background: #fff;
      .box-shadow(0 .1rem .38rem rgba(0,0,0,.06));
      text-align: center;
      font-size: .26rem;
      color: @col-purple;
      .transitionMob(background .6s);
      &.checkbox-item-selected{
        background: @col-purple;
        // .box-shadow(0 .08rem .32rem rgba(106,161,248,.6));
        color: #fff;
      }
    }
  }
  .weui-cells{
    border: .02rem solid @col-gray;
    border-radius: .08rem;
    font-size: .26rem;
    color: @col-darkgray;
    .placeholder-c(@col-gray);
    &:before{
      border: none;
    }
  }
  .btn-fn{
    position: relative;
    .error-tips{
      position: absolute;
      left: 0;
      bottom: .9rem;
      width: 100%;
      padding: 0 .2rem;
      text-align: center;
      color: @col-wrong;
    }
  }
  .btn-submit{
    margin: .6rem auto .2rem;
    width: 76.8%;
    border-radius: .08rem;
    background: @col-gray;
    font-size: .36rem;
    color: #fff;
    &.active{
      .btn-purple;
    }
  }
}
</style>

