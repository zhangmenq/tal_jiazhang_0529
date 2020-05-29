<template>
    <div class="teachers-list">
        <div class="teachers-box">
            <div class="teachers-left" @click="goDetails">
                <div class="teacher-img">
                    <img :src="teachersList.avatar_url" v-if="teachersList.avatar_url">
                    <img src="../../assets/default-photo-teacher.png" v-else>
                </div>
            </div>
            <div class="teachers-mid">
                <div class="teachers-mid-box">
                    <p class="name-intro">
                        <span class="name">{{teachersList.realname}}</span>
                        <span class="age" v-if="teachersList.teaching_age_name">{{teachersList.teaching_age_name}}教龄</span>
                    </p>
                    <div v-if="labels.length > 0" class="lables-name">
                        <span
                            v-for="(item,index) in labels"
                            :key="index"
                            class="lables-box">
                            <span class="lables">{{item}}</span>
                        </span>
                    </div>
                    <p class="tag-original">
                      <span v-if="teachersList.orginal_teacher" class="old_teacher">原班老师</span>
                    </p>
                </div>
            </div>
            <div class="teachers-right">
                <div class="teachers-btn">
                    <a class="btn-attention" v-if="attiontion" @click="setFavorite(1)">关注</a>
                    <a class="btn-unattention" v-else @click="setFavorite(0)">已关注</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { setFavorite } from '@/api';

export default {
  props: {
    teachersList: {
      type: Object,
      default: {},
    },
  },

  data() {
    /* eslint-disable */
    return {
      labels: [],
      teams: this.teachersList.teams,
      attiontion: this.teachersList.is_attention === 0,
    };
  },
  mounted() {
    if (this.teams.length > 0) {
        for (let i = 0; i < this.teams.length; i += 1) {
           this.labels.push(this.teams[i].team_name);
        }
    }
  },
  methods: {
      setFavorite(params) {
        const data = {
            teacher_id: this.teachersList.id,
            tab: params,
        };
        setFavorite(data).then(() => {
            this.attiontion = !this.attiontion;
        });
    },
    // 跳转到教师详情页
    goDetails(){
      this.$router.push({
        name: 'teacher',
        params: { id:this.teachersList.id },
      });
    }
  },
};
</script>
<style lang="less">
@import '../../styles/basic.less';
.teachers-list{
    .teachers-box{
        min-height: 2.25rem;
        margin: 0.21rem 0.4rem 0 0.4rem;
        box-shadow: 0 .04rem .2rem 0 rgba(163,163,163,0.15);
        border-radius: 0.1rem;
        display: flex;
        padding: 0.35rem 0.2rem;
        .teachers-left{
            border-radius: 50%;
            width: 1.29rem;
            position: relative;
            .teacher-img{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            img{
                border-radius: 50%;
                width: 1.29rem;
                height: 1.29rem;
                display: inline-block;
            }
        }
        .teachers-mid{
            position: relative;
            width: 62%;
            .teachers-mid-box{
                padding: 0 0.2rem 0 0.17rem;
                position: absolute;
                top: 50%;
                -webkit-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
                .name-intro{
                    margin-bottom: 0.03rem;
                    .name{
                        font-size: 0.3rem;
                        font-family: PingFangSC-Medium;
                        font-weight: 500;
                        color: @new-col-black;
                        .wordbreak;
                        .wordbreak-en;
                    }
                    .age{
                        margin-left: 0.2rem;
                        font-size:0.24rem;
                        font-family:PingFangSC-Regular;
                        font-weight:400;
                        color:rgba(74,74,74,1);
                    }
                }
                .lables-box{
                    background:@new-col-bg-purple;
                    border-radius: 0.05rem;
                    padding: 0.01rem 0.09rem;
                    display: inline-block;
                    margin: 0 0.1rem 0.1rem 0;
                    .lables{
                        font-size: 0.22rem;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: @new-col-purple;
                        line-height: 0.3rem;
                        text-align: center;
                    }
                }

            }
        }
        .teachers-right{
            text-align: center;
            position: relative;
            width: 1.15rem;
            .teachers-btn{
                font-size: 0.28rem;
                font-family: PingFangSC-Medium;
                font-weight: 500;
                line-height: 0.54rem;
                transform: translateY(-50%);
                position: absolute;
                top: 50%;
            }
            .btn-attention{
                color: @new-col-white;
                background: linear-gradient(90deg,rgba(139,108,225,1) 0%,rgba(191,111,252,1) 100%);
                width: 1.15rem;
                display: inline-block;
                border-radius: 0.27rem;
            }
            .btn-unattention{
                background: @new-col-line-gray;
                color: @new-col-font-gray;
                width: 1.15rem;
                display: inline-block;
                border-radius: 0.27rem;
            }
        }
    }
}
</style>

