<template>
  <li class="adjust-item">
    <h2>{{adjust.created_at}} 操作了调课
      <span>[{{adjust.type === 1?"自行操作":"班主任操作"}}]</span>
    </h2>
    <h3 v-if="adjust.circle">{{adjust.circle.title}}</h3>
    <ul>
      <li>
        <p class="old_time">
          {{adjust.start_at_old}}
        </p>
        <p class="teacher_box">
          <img :src="adjust.teacher_old.avatar_url" v-if="adjust.teacher_old.avatar_url"/>
          <img src="../../assets/default-photo-teacher.png" v-else/>
          {{adjust.teacher_old.realname}}
        </p>
      </li>
      <li>
        <!-- <img src="../../assets/adjust-details-img.png"> -->
        <span class="adjust-icon"></span>
      </li>
      <li>
        <p class="new_time">
          {{adjust.start_at}}
        </p>
        <p class="teacher_box">
          <img :src="adjust.teacher.avatar_url" v-if="adjust.teacher_old.avatar"/>
          <img src="../../assets/default-photo-teacher.png" v-else/>
          {{adjust.teacher.realname}}
        </p>
      </li>
    </ul>
  </li>
</template>
<script>

export default {
  name: 'adjustItem',
  props: {
    adjust: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.adjust-item{
  background: @new-col-white;
  margin-bottom: .4rem;
  border-radius: .1rem;
  padding: .1rem 0 .3rem;
  box-shadow:0 .04rem .2rem 0 rgba(0,0,0,0.1);
  h2{
    font-size: .26rem;
    color: #93909A;
    border-bottom: .01rem solid @col-gray;
    // height: .56rem;
    padding: .2rem .3rem;
    span{
      color: @new-col-purple;
    }
  }
  h3{
    color: @new-col-title-dark;
    margin: .16rem .3rem;
    font-size: .3rem;
    .blue{
      color: @new-col-purple;
    }
    .lightred{
      color: @new-col-purple;
    }
  }
  ul{
    display: flex;
    justify-content: space-between;
    align-items:center;
    margin: 0 .2rem;
    li{
      font-size: .2rem;
      color: @col-gray;
      .old_time{
        color: #524670;
        font-size: .24rem;
      }
      .new_time{
        color: @new-col-purple;
        font-size: .24rem;
      }
      .teacher_box{
        line-height: .6rem;
        color: #93909A;
        margin-top: .06rem;
        img{
          width: .6rem;
          height: .6rem;
          border-radius: 50%;
        }
      }
      i{
        .wh(.4rem,.2rem);
        display: inline-block;
        vertical-align: middle;
        margin:-.05rem .05rem 0 0;
        .bg-m('@{img-path}/course-details-icon.png',0,0,no-repeat);
        background-size: 100%;
        &.time{
          background-position: center -2.72rem;
        }
        &.figure{
          background-position: center -2.46rem;
        }
      }
      .adjust-icon{
        display: inline-block;
        vertical-align: middle;
        .wh(.31rem,.22rem);
        .bg-m('@{img-path}/ico2/change_classroom_arr.png');
        background-size: 100%;
      }
      img{
        .wh(.56rem,.56rem);
        vertical-align: middle;
        margin: 0 0 0 .1rem;
        border-radius: 100%;
      }
    }
  }
}
</style>
