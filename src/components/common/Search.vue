<template>
  <div class="search">
    <div class="searchstart">
      <div class="cont">
        <input class="text" type="text" placeholder="按姓名查找老师" v-model="searchValue">
        <input type="submit" class="submit" @click="search()" value="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchValue: '',
    };
  },
  methods: {
    search() {
      this.$emit('search', {
        searchValue: this.searchValue,
      });
    },
  },
};
</script>

<style lang="less">
 @import '../../styles/basic.less';
 .search{
  background: @col-bg;
  // background: #f60;
  height: 100%;
  .searchstart{
    background: @col-white;
    font-size: .3rem;
    padding: .3rem;
    box-shadow: 0 .1rem .1rem #f0f0f0;
    .cont{
      border: .01rem solid @col-gray;
      height: .7rem;
      // line-height: .7rem;
      border-radius: .1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .3rem;
      position: relative;
      p{
        position: absolute;
        .wh(100%,100%);
        left: 0;
        top: 0;
        text-align: center;
        color: @col-gray;
        line-height: .7rem;
      }
      .text{
        font-size: .3rem;
        width: 90%;
      }
      .submit{
        .wh(.3rem,.3rem);
        background-size: 100% 100%;
        .bg-m('../assets/search-img1.png',0,0,no-repeat);
      }
    }
  }
}
</style>
