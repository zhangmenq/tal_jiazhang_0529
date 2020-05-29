<template>
  <div class="selectedbox" v-if="dateTimes.length > 0">
    <span class="selected-item" v-for="(item, index) in dateTimes" :key="index">
      <span>{{getMoment(item.date).format('MM-DD')}}</span>
      周{{item.week}} {{item.timeV}}
      <em class="cus-close" @click="delDateTimes(index)">
        <x-icon type="ios-close-empty" size="0.4rem"></x-icon>
      </em>
    </span>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: {
      dateTimes: {
        type: Array,
        default: [],
      },
      dateList: {
        type: Array,
        default: [],
      },
      selDate: {
        type: String,
        default: '',
      },
    },
    methods: {
      delDateTimes(index) {
        this.$emit('delDateTimes', {
          key: index,
        });
      },
      getMoment(date) {
        return moment(date);
      },
    },
  };
</script>

<style lang="less">
  @import '../../styles/basic.less';
  .selectedbox{
    display: flex;
    justify-content: center;
    margin-top: .3rem;
    border-top: .01rem solid @col-border;
    .selected-item{
      position: relative;
      display: inline-block;
      margin: .3rem .15rem 0;
      padding: 0 .6rem 0 .2rem;
      min-width: 2.2rem;
      .l-h(.6rem);
      border: .01rem solid @col-purple;
      border-radius: .08rem;
      background: #fff;
      color: @col-purple;
      .cus-close{
        .pos-box-hc(.4rem,.4rem);
        right: .1rem;
        .vux-x-icon {
          fill: #cb9ed3;
        }
      }
    }
  }
</style>

