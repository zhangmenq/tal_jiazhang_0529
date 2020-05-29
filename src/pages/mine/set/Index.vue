<template>
  <div class="set_con">
    <group>
        <cell title="修改密码" link="/modify-password"></cell> 
    </group>
    <a href="javascript:;" class="common_btn layout_btn" @click="btnExit()" v-if="!pyUid">退出当前账户</a>
  </div>
</template>

<script>
import { Cell, Group, XButton } from 'vux';
import { setApilog } from '@/api';
import { clearLocalStorage, getItem, setItem } from '../../../utils/localStorage';
import { clearSessionStorage } from '../../../utils/sessionStorage';

export default {
  name: 'mine',
  components: {
    Cell,
    Group,
    XButton,
  },
  data() {
    return {
      resData: '',
      pyUid: '',
    };
  },
  methods: {
    btnExit() {
      const openId = getItem('openid') || '';
      const token = getItem('token');
      if (token.indexOf('tal') !== -1) {
        this.$http.get(`${this.apiConfig.host}tal/logout`).then(() => {
          this.logoutWithoutApi();
        }).catch(() => {
          this.logoutWithoutApi();
        });
      } else {
        this.$http.delete(`${this.apiConfig.host}/oauth2/token?open_id=${openId}`).then(() => {
          this.logoutWithoutApi();
        }).catch(() => {
          this.logoutWithoutApi();
        });
      }
    },
    //退出回调
    logoutCallback(res) {
      const bookPop = getItem('book_pop');
      if (res.error_code === 0) {
        clearLocalStorage();
        clearSessionStorage();
        if (bookPop) {
          setItem('book_pop', 1);
        }
        location.href = '/login';
      } else {
        this.$vux.toast.show({
          type: 'success',
          text: res.error_msg,
          position: 'middle',
          time: 1500,
          width: '15em',
        });
      }
    },
    //不调接口直接退出
    logoutWithoutApi() {
      const bookPop = getItem('book_pop');
      clearLocalStorage();
      clearSessionStorage();
      if (bookPop) {
        setItem('book_pop', 1);
      }
      location.href = '/login';
    },
  },
  mounted() {
    this.pyUid = getItem('peiyou-uid');
    setApilog({
      event_type: 70007,
      route: '/mine/set',
    });
  },
};
</script>
<style lang="less">
@import '../../../styles/basic.less';

body{
  background: #f8f8f8;
}
.set_con{
  min-height: 100%;
  position: relative;
  .weui-cells{
    margin-top: .2rem;
    line-height: 1rem;
    border-top: 1PX solid #ccc;
  }
  .weui-cell{
    padding: 0 .4rem 0 .48rem;
    border-bottom: 1PX solid #ccc;
  }
  .vux-label{
    font-size: .3rem;
    color: @new-col-title-dark;
  }
  .weui-cell_access .weui-cell__ft:after{
    width: .2rem;
    height: .2rem;
    border-width: .05rem .05rem 0 0;
    border-color: #999;
  }
  .layout_btn{
    position: absolute;
    width: 5.3rem;
    left: 50%;
    bottom: 1rem;
    transform: translate(-50%, 0);
  }
}
</style>
