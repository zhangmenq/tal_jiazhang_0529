<template>
  <div class="teacher-filtrate">
    <div class="filtrate-box">
      <span>
        共推荐老师<em>{{teacherCounts}}</em>位
      </span>
      <span class="filtrate" @click="isFiltrate = true">
        筛选
      </span>
    </div>

    <div class="dialog-filtrate" v-if="isFiltrate">
      <div class="filtrate-item">
        <p class="title">只看</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': attention}"
            @click="attention = !attention">关注的</a>
        </div>
      </div>
      <div class="filtrate-item">
        <p class="title">性别</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': selSex === index}"
            v-for="(val, index) in sex" :key="index"
            @click="selSex = index">{{val}}</a>
        </div>
      </div>
      <div class="filtrate-item">
        <p class="title">教学特点</p>
        <div class="checker-box">
          <a class="checker-item"
            :class="{'checkbox-item-conform': selTeams.indexOf(index) > -1}"
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
  </div>
</template>

<script>
import { XButton } from 'vux';
import { mapState } from 'vuex';
import { getUserInfo } from '@/api';

export default {
  components: {
    XButton,
  },
  props: {
    teacherCounts: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isFiltrate: false,
      sex: ['不限', '男', '女'],
      teams: [],
      attention: false,
      selSex: 0,
      selTeams: [],
    };
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
  },
  methods: {
    selectTeams(value) {
      const key = this.selTeams.indexOf(value);
      if (key > -1) {
        this.selTeams.splice(key, 1);
      } else {
        if (this.selTeams.length > 0) {
          this.selTeams = [];
        }
        this.selTeams.push(value);
      }
    },
    submit() {
      let teams = '';
      if (this.selTeams.length > 0) {
        teams = this.selTeams.join(',');
      }
      const where = {
        attention: this.attention ? 1 : 0,
        teacher_sex: this.selSex,
        teams,
      };
      this.isFiltrate = false;
      this.$emit('filtrate', where);
    },
  },
  mounted() {
    if (this.userInfo) {
      this.teams = this.userInfo.teacher_teams;
    } else {
      getUserInfo().then(() => {
        const userInfo = this.$store.state.userInfo;
        this.teams = userInfo.teacher_teams;
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
  }
  .dialog-filtrate{
    .dialog-filtrate
  }
}

</style>


