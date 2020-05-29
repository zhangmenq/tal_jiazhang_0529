<template>
  <div class="teacher-filtrate">
    <div class="filtrate-box">
      <span>
        <!-- 共推荐<em>{{teacherCounts}}</em>位 -->
        推荐老师
      </span>
      <span class="filtrate" @click="showFiltrate">
        外教筛选
      </span>
    </div>
    <div class="dialog-filtrate" v-if="isFiltrate">
      <a class="btn-close" @click="closeDialog"></a>
      <div class="filtrate-item">
        <p class="title">只看</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': where.attention}"
            @click="where.attention = !where.attention">关注的</a>
        </div>
      </div>
      <div class="filtrate-item">
        <p class="title">性别</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': where.teacher_sex === index}"
            v-for="(val, index) in sex" :key="index"
            @click="where.teacher_sex = index">{{val}}</a>
        </div>
      </div>
      <div class="filtrate-item">
        <p class="title">教龄</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': where.teaching_age === index}"
            v-for="(val, index) in teachingAges" :key="index"
            @click="selectAges(index)">{{val}}</a>
        </div>
      </div>
      <div class="filtrate-item">
        <p class="title">教学特点</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': selectTeamsArr.indexOf(index) > -1}"
            v-for="(val, index) in teams" :key="index"
            @click="selectTeams(index)">{{val}}</a>
        </div>
      </div>
      <div class="nav-next" @click="submit">
        <x-button class="btn-disable-white btn-purple">
          确定
        </x-button>
      </div>
    </div>
    <!-- {{teacherFiltrate}} - {{where}} -->
  </div>
</template>

<script>
import { XButton } from 'vux';
import { mapState } from 'vuex';
import { getUserInfo, setApilog } from '@/api';

export default {
  components: {
    XButton,
  },
  props: {
    teacherCounts: {
      type: Number,
      default: 0,
    },
    teacherFiltrate: {
      type: Object,
      default: {
        attention: false,
        teacher_sex: 0,
        teams: '',
        teaching_age: 0,
      },
    },
  },
  watch: {
    teacherFiltrate() {
      this.where = Object.assign({}, this.teacherFiltrate);
    },
  },
  data() {
    return {
      isFiltrate: false,
      sex: ['不限', '男', '女'],
      teams: [], //教学特点，传给后台的时候传索引值字符串，多个以“ , ”分开
      teachingAges: [], //教龄，传给后台的时候传索引值
      where: {
        attention: false,  // 是否关注
        teacher_sex: 0,  // 教师性别
        teams: '',    // 教学特点
        teaching_age: 0,  // 教龄
      },
      selectTeamsArr: [],
    };
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
  },
  methods: {
    showFiltrate() {
      this.isFiltrate = true;
      setApilog({
        event_type: 20019,
        route: this.$route.name,
      });
    },
    selectTeams(value) {
      if (this.selectTeamsArr.indexOf(value) > -1) {
        this.selectTeamsArr.splice(this.selectTeamsArr.indexOf(value), 1);
      } else {
        this.selectTeamsArr.push(value);
      }
      this.where.teams = this.selectTeamsArr.join(',');
    },
    selectAges(value) {
      if (this.where.teaching_age === value) {
        this.where.teaching_age = 0;
        return false;
      }
      this.where.teaching_age = value;
    },
    closeDialog() {
      if (JSON.stringify(this.teacherFiltrate) !== '{}') {
        this.where = Object.assign({}, this.teacherFiltrate);
      }
      this.isFiltrate = false;
    },
    submit() {
      if (this.where.attention) {
        this.where.attention = 1;
      } else {
        this.where.attention = 0;
      }
      this.$set(this.where, 'attention', this.where.attention);
      this.isFiltrate = false;
      this.$emit('filtrate', this.where);
    },
  },
  mounted() {
    if (this.userInfo) {
      this.teams = this.userInfo.teacher_teams;
      this.teachingAges = this.userInfo.teacher_ages;
    } else {
      getUserInfo().then(() => {
        const userInfo = this.$store.state.userInfo;
        this.teams = userInfo.teacher_teams;
        this.teachingAges = userInfo.teacher_ages;
      });
    }
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.teacher-filtrate{
  .filtrate-box{
    .filtrate-box;
    font-size: .32rem;
    padding: 0 0 .22rem 0;
    em{
      color: @new-col-purple;
    }
    .filtrate{
      height:.5rem;
      line-height: .5rem;
      width: 1.8rem;
      border: .02rem solid #B2B7CE;
      border-radius: .1rem;
      padding: 0 .3rem 0 0;
      text-align: center;
      font-size: .3rem;
      margin-bottom: 0;
      color:@new-col-title-dark;
      &:before{
        background: none;
      }
      &:after{
        content: " ";
        display: inline-block;
        height: .16rem;
        width: .16rem;
        border-width: .03rem .03rem 0 0;
        border-color: new-col-black;
        border-style: solid;
        transform: matrix(0.71, 0.71, 0.71, -0.71, 0, 0);
        position: relative;
        top: -.03rem;
        position: absolute;
        top: 50%;
        margin-top: -.12rem;
        right: .1rem; 
      }
    }
  }
  .dialog-filtrate{
    .dialog-filtrate
  }
}
</style>
