<template>
  <div class="my-wallet">
    <div class="wallet-money">
      钱包余额
      <strong>￥1200.98</strong>
    </div>
    <ul>
      <li v-for="(items,index) in 6" :key="index">
        <em>
          购买“A课程”
          <i>2017-06-14 12:07:55</i>
        </em>
        <span class="price">-10000</span>
      </li>
    </ul>
    <!-- 钱包为空 -->
    <div class="nocontent">
      <div class="inner nowallet">
        <span class="nocontent-img"></span>
        <p class="tips">钱包空了～</p>
      </div>
    </div>
  </div>
</template>
<style lang="less">
@import '../../../styles/basic.less';

.my-wallet{
  background: @col-bg;
  min-height: 100%;
  padding: 0.3rem 0;
  .wallet-money{
    .bg-m('../assets/success-order-img1.jpg',0,0,no-repeat);
    background-size: 100% 100%;
    margin: 0rem .3rem 0.3rem .3rem;
    border-radius: .2rem;
    height: 2.6rem;
    color: @col-white;
    padding:.65rem 0 0 1rem;
    strong{
      font-size: .42rem;
      font-weight: normal;
      display: block;
      margin: .3rem 0 0 0;
    }
  }
  ul{
    background: @col-white;
    border-radius: .2rem;
    margin: 0 .3rem;
    padding: .2rem 0; 
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .26rem;
      margin: 0 .3rem;
      padding: 0.053rem 0;
      border-bottom: .01rem solid @col-gray;
      color: @col-darkgray; 
      i{
        display: block;
        font-size: .24rem;
        color: @col-gray;        
      }
      .price{
        color: @col-lightred;
        font-size: .3rem;
      }
      &:last-child{
        border: none;
      }
    }
  }
}
.wakket-empty{
  text-align: center;
  font-size: .3rem;
  color: @col-darkgray;
  img{
    margin: 1.4rem 0 .55rem 0;
  }
}
</style>
