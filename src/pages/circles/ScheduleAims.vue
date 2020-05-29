<template>
  <div>
    <div class="schedule-aims" v-if="hasTarget">
      <h1>第1讲 {{ title }}</h1>
      <div class="aims-content">
        <div class="aims-intro">
          <h2 v-if="topic">课节主题</h2>
          <p v-if="topic" class="txt"><strong>{{ topic }}</strong></p>
          <h2 v-if="genre">课节体裁</h2>
          <p v-if="genre" class="txt"><strong>{{ genre }}</strong></p>
          <h2 v-if="target">教学目标</h2>
          <div class="txt" v-if="target">
            <strong class="margin-b" v-if="target.read && target.read.length">
              阅读策略与能力（Reading Strategies and Skills）
            </strong>
            <div v-if="target.read && target.read.length" v-for="item in target.read" :key="item.id">
              {{ item.title ? item.title : '' }}
              <br>
              {{ item.title_en ? item.title_en : '' }}
              <img :src="item.image_url" v-if="item.image_url"/>
            </div>
            <strong class="margin-b" v-if="target.think && target.think.length">
              思维能力（Thinking Skills）
            </strong>
            <div v-if="target.think && target.think.length" v-for="item in target.think" :key="item.id">
              {{ item.title ? item.title : '' }}
              <br>
              {{ item.title_en ? item.title_en : '' }}
              <img :src="item.image_url" v-if="item.image_url"/>
            </div>
            <strong class="margin-b" v-if="target.express && target.express.length">
              词汇与表达（Vocabulary and Expressions）
            </strong>
            <div v-if="target.express && target.express.length" v-for="item in target.express" :key="item.id">
              {{ item.title ? item.title : '' }}
              <br>
              {{ item.title_en ? item.title_en : '' }}
              <img :src="item.image_url" v-if="item.image_url"/>
            </div>
          </div>
        </div>
        <div class="core-word" v-if="target.words.length">
          <h2>核心单词</h2>
          <ul>
            <li v-for="item in target.words" :key="item.id">
              <strong>{{ item.word }}</strong>
              {{item.describe}} &nbsp;&nbsp;  {{ item.translate_zh }}
              <br>
              {{ !item.translate_en ? '' : item.translate_en }}
              <br>
              {{ !item.example ? '' : 'E.g: ' + item.example }}
              <br>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <no-content tips="暂无课程目标" v-if="!hasTarget && !fetching"></no-content>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import NoContent from '@/components/common/NoContent';

export default {
  name: 'scheudleAims',
  data() {
    return {
      hasTarget: false,
      info: {
        circle: {
          circles: {},
        },
        target: '',
      },
      fetching: true,
    };
  },
  components: {
    NoContent,
  },
  computed: {
    scheduleId() {
      if (this.$route.query.schedule_id) {
        return this.$route.query.schedule_id;
      }
    },
    title() {
      if (!isEmpty(this.info.circle.circles)) {
        return this.info.circle.circles.title;
      }
      return '';
    },
    topic() {
      if (!isEmpty(this.info.circle.circles)) {
        return this.info.circle.circles.topic;
      }
      return '';
    },
    genre() {
      if (!isEmpty(this.info.circle.circles)) {
        return this.info.circle.circles.genre;
      }
      return '';
    },
    target() {
      if (!isEmpty(this.info.target)) {
        return this.info.target;
      }
      return {
        read: [],
        express: [],
        think: [],
        words: [],
      };
    },
  },
  methods: {
    getAims() {
      const url = `${this.apiConfig.host}/classroom/schedule/${this.scheduleId}/target`;
      return this.$http.get(url).then((res) => {
        if (res.error_code === 0) {
          this.info = res.data;
          if (this.info.circle.circles && this.info.circle.circles.learning_guide_url) {
            window.sessionStorage.setItem('aims-pdf-url', this.info.circle.circles.learning_guide_url);
            this.$router.replace({
              name: 'aimsPdf',
            });
          } else {
            this.fetching = false;
            this.hasTarget = !isEmpty(this.info.target);
          }
        }
      });
    },
  },
  mounted() {
    this.$store.dispatch('updateLoading', {
      loading: true,
    });
    this.getAims().then(() => {
      this.$store.dispatch('updateLoading', {
        loading: false,
      });
    });
  },
};
</script>


<style lang="less">
@import '../../styles/basic.less';

.schedule-aims{
  min-height: 100%;
  .bg-m('@{img-path}/mine-bg.jpg');
  background-color: @col-bg;
  background-size: 100% auto;
  h1{
    font-size: .34rem;
    // .l-h(1.3rem);
    padding: .3rem;
    line-height: .5rem;
    color: @col-white;
    text-align: center;
  }
  .aims-content{
    background: @col-white;
    margin: 0 .2rem;
    border-radius: .06rem;
    .aims-intro{
      padding: .05rem .3rem .3rem;
      h2{
        font-size: .3rem;
        color: @col-gray;
        border-left: .06rem solid @col-purple;
        line-height: .3rem;
        margin: .3rem 0 .22rem;
        padding-left: .1rem;
      }
      .txt{
        font-size: .3rem;
        line-height: .48rem;
        word-break: break-all;
        strong{
          display: block;
          font-size: .3rem;
          color: @col-darkgray;
          &.margin-b{
            margin-bottom: .12rem;
          }
        }
        img{
          display: block;
          width: 100%;
          margin: 0.3rem 0;
        }
      }
    }
  }
  .core-word{
    h2{
      background: @col-purple;
      color: @col-white;
      font-size: .3rem;
      .l-h(.8rem);
      border-radius: .06rem .06rem 0 0;
      text-align: center;
    }
    ul{
      padding: .3rem;
      li{
        font-size: .3rem;
        line-height: .48rem;
        color: @col-darkgray;
        strong{
          color: @col-purple;
          display: block;
        }
      }
    }
  }
}
</style>
