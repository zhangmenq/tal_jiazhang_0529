<template>
  <div class="selectedbox" v-if="weekTimes.length > 0">
    <span class="selected-item" v-for="(item, index) in weekTimes" :key="index">
      <span v-if="showDate">{{getMoment(item.week).format('MM-DD')}}</span>
      {{ selWeek == 0 ? '' : '周' }}{{weekList[item.week]}} {{item.timeV}}
      <em class="cus-close" @click="delWeekTimes(index)">
        <x-icon type="ios-close-empty" size="0.4rem"></x-icon>
      </em>
    </span>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: {
      weekTimes: {
        type: Array,
        default: [],
      },
      weekList: {
        type: Object,
        default: {},
      },
      selWeek: {
        type: String,
        default: '',
      },
      showDate: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    methods: {
      delWeekTimes(index) {
        this.$emit('delWeekTimes', {
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

