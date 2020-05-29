<template>
  <div class="record-list-cont">
    <template>
      <h2>{{recorddetails.created_at}} 操作了转班<span>[{{recorddetails.type === 1?"自行操作":"班主任操作"}}]</span></h2>
      <h3>原课节
        <span class="blue">第{{recorddetails.start_no}}讲</span>
        至
        <span class="lightred">第{{recorddetails.end_no}}讲</span>
      </h3>
      <ul>
        <li>
          <p class="old_time">
            {{recorddetails.original_time}}
          </p>
          <p class="teacher_box">
            <img :src="recorddetails.original_avatar" v-if="recorddetails.original_avatar"/>
            <img src="../../assets/default-photo-teacher.png" v-else/>
            {{recorddetails.original_teacher_name}}
          </p>
        </li>
        <li>
          <!-- <img src="../../assets/record-img1.jpg" alt=""> -->
          <span class="adjust-icon"></span>
        </li>
        <li>
          <p class="new_time">{{recorddetails.time}}</p>
          <p class="teacher_box">
            <img :src="recorddetails.teacher_avatar" v-if="recorddetails.teacher_avatar"/>
            <img src="../../assets/default-photo-teacher.png" v-else/>
            {{recorddetails.teacher_name}}
          </p>
        </li>
      </ul>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    recorddetails: {
      type: Object,
      default: {},
    },
    courseType: {
      type: String,
      default: 'change',
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';

.record-list-cont{
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
        .wh(.4rem,.4rem);
        vertical-align: middle;
        margin: 0 0 0 .1rem;
      }
    }
  }
}

</style>
