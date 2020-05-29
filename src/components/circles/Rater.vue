<template>
  <div class="rater">
    <span
      v-for="(itemclass, index) in itemClasses"
      :class="itemclass"
      class="item-rater"
      :key="index"
      @click="selectRater(index)">
        {{index}}
      </span>
  </div>
</template>
<script>
  const CLS_ON = 'on';
  const CLS_OFF = 'off';

  export default{
    props: {
      max: {
        type: Number,
      },
      score: {
        type: Number,
      },
      val: {
        type: String,
      },
      disabled: {
        type: Boolean,
      },
    },
    computed: {
      itemClasses() {
        const result = [];
        const score = Math.floor(this.score);
        for (let i = 0; i < score; i += 1) {
          result.push(CLS_ON);
        }
        while (result.length < this.max) {
          result.push(CLS_OFF);
        }
        return result;
      },
    },
    methods: {
      selectRater(index) {
        if (this.disabled) {
          return;
        }
        const param = {
          num: index + 1,
          val: this.val,
        };
        this.$emit('increment', param);
      },
    },
  };
</script>
<style lang="less">
@import '../../styles/basic.less';

.rater{
  .item-rater{
    position: relative;
    display: inline-block;
    margin-right: .3rem;
    .wh(.44rem,.44rem);
    text-indent: -9999px;
    &:after{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      .wh(.44rem,.44rem);
      .bg-m('@{img-path}/star-active.png');
      background-size: .44rem .44rem;
      transform: scale(1.3);
      opacity: 0;
      transition: transform 1s,opacity .6s;
    }
    &.on{
      &:after{
        transform: scale(1);
        opacity: 1;
      }
    }
    &.off{
      .bg-m('@{img-path}/star.png');
      background-size: .44rem .44rem;
    }
    &:last-of-type{
      margin-right: 0;
    }
  }
}
</style>

