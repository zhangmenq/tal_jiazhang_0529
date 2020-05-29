<template>
  <div class="dialog">
      <div class="dialog-tip-box">
        <div class="dialog-tip" v-if="showPreferToast" :class="{'showBottom': isShowBottom, 'unshowBottom': !isShowBottom}">
            <p @click="PreferDialog">为帮您选到满意的老师，<span>建议完善孩子对外教老师的偏好信息哦～</span></p>
            <div class="dialog-tip-close" @click="closeToast"></div>
        </div>
      </div>
      <div v-show="showPreferDialog" class="dialog-prefer">
        <div class="dialog-mask" @click="maskClose"></div>
        <div class="img-box">
          <p class="dia-title">请完善孩子偏爱老师特点</p>
          <div  @click="closeToast" class="dialog-close"></div>
          <div class="group">
              <p>性别</p>
              <span
                class="pop-span"
                v-for="(item,index) in sexList"
                :class="{'pop-span-slected': index==sexIdx}"
                :key="index"
                @click="chooseSex(index)">
                <span class="pop-text" :class="{'pop-text-slected': index==sexIdx}">{{item}}</span>
              </span>
          </div>
          <div class="group">
              <p>教学特点</p>
              <span
                class="pop-span"
                v-for="(item,index) in characterList"
                :class="{'pop-span-slected': teams.indexOf(index+1) > -1}"
                :key="index"
                @click="chooseCharacter(item,index+1)">
                <span class="pop-text" :class="{'pop-text-slected': teams.indexOf(index+1) > -1}">{{item}}</span>
              </span>
          </div>
          <div :class="{'btn': isChoose, 'unlight-btn': !isChoose}" @click="clickBtn"><span :class="{'btn-text': isChoose, 'unlight-btn-text': !isChoose}">保存</span></div>
        </div>
      </div>
  </div>
</template>

<script>
import { XDialog } from 'vux';

export default {
  components: {
    XDialog,
  },
  props: {
    isShowBottom: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showPreferToast: true,
      showPreferDialog: false,
      characterList: ['耐心亲和', '活泼开朗', '经验丰富', '善于引导', '善于纠错', '善于拓展'],
      sexList: ['不限', '男', '女'],
      sex: '',
      teams: [],
      sexIdx: -1,
      isChoose: false,
    };
  },
  methods: {
    closeToast() {
      this.showPreferToast = false;
      this.showPreferDialog = false;
    },
    PreferDialog() {
      this.showPreferDialog = true;
      this.showPreferToast = false;
    },
    maskClose() {
      this.showPreferDialog = false;
    },
    chooseSex(index) {
      this.sexIdx = index;
      this.sex = index;
      // eslint-disable-next-line
      this.isChoose = (this.sex !== '' && this.teams.length !== 0) ? true : false;
    },
    chooseCharacter(item, index) {
      if (this.teams.indexOf(index) > -1) {
        this.teams.splice(this.teams.indexOf(index), 1);
      } else {
        this.teams.push(index);
      }
      // eslint-disable-next-line
      this.isChoose = (this.sex !== '' && this.teams.length !== 0) ? true : false;
    },
    clickBtn() {
      if (!this.isChoose) {
        return false;
      }
      const data = {
        prefer_sex: this.sex,
        prefer_teaching: JSON.stringify(this.teams),
      };
      this.$http.put(`${this.apiConfig.host}student/students`, data).then((res) => {
        if (res.error_code !== 0) {
          this.errorMsg = res.error_msg;
          return false;
        }
        this.$vux.toast.show({
          type: 'success',
          text: '保存成功',
          position: 'middle',
          time: 2000,
          width: '15em',
        });
        this.showPreferDialog = false;
      });
    },
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.dialog{
  .dialog-tip-box{
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .dialog-tip{
    height: 1.25rem;
    background: #fff8e0;
    border-radius: 0.1rem;
    position: fixed;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 501;
    p{
      padding: 0.25rem 0.69rem 0.26rem 0.32rem;
      font-size: 0.26rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @new-col-title-dark;
      span{
        color: @new-col-orange;
      }
    }
    .dialog-tip-close{
      .wh(0.22rem, 0.22rem);
      .bg-m('@{img-path}/close-dark.png');
      background-size: 100% 100%;
      position: absolute;
      right: 0.27rem;
      bottom: 0.28rem;
    }
  }
  .showBottom{
    bottom: 1rem;
  }
  .unshowBottom{
    bottom: 0;
  }
  .dialog-prefer{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 502;
  }
  .dialog-prefer{
    .dialog-mask{
      position: fixed;
      z-index: 503;
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      top: 0rem;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .img-box{
      position: absolute;
      top: 50%;
      background: @new-col-white;
      width: 90%;
      left: 50%;
      transform: translate(-50%, -61%);
      z-index: 504;
      padding: 0.31rem 0.3rem 0.27rem;
      .dia-title{
        height: 0.5rem;
        font-size: 0.36rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: @new-col-title-dark;
        line-height: 0.5rem;
        text-align: center;
        margin-bottom: 0.47rem;
      }
      .dialog-close{
        .wh(0.22rem, 0.22rem);
        .bg-m('@{img-path}/close-dark.png');
        background-size: 100% 100%;
        position: absolute;
        top: 0.45rem;
        right: 0.3rem;
      }
      .group{
        margin-bottom: 0.36rem;
        p{
          height: 0.5rem;
          font-size: 0.36rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: @new-col-title-dark;
          line-height: 0.5rem;
          margin-bottom: 0.23rem;
        }
        .pop-span{
          margin: 0 0.21rem 0.3rem 0;
          min-width: 1.5rem;
          padding: 0.2rem 0.3rem;
          height: 0.79rem;
          background: @new-col-bg-gray;
          border-radius: 0.1rem;
          display: inline-block;
          text-align: center;
          .pop-text{
            height: 0.42rem;
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: @new-col-title-dark;
            line-height: 0.42rem;
          }
        }
        .pop-span-slected{
          background: @new-col-purple;
          .pop-text-slected{
            color: @new-col-white;
          }
        }
      }
      .unlight-btn{
        height: 0.7rem;
        background: @new-col-bg-gray;
        border-radius: 10px;
        width: 1.8rem;
        margin: 0 auto;
        text-align: center;
        .unlight-btn-text{
          font-size: 0.3rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: @new-col-title-dark;
          line-height: 0.7rem;
        }
      }   
      .btn{
        height: 0.7rem;
        background: @new-col-purple;
        border-radius: 10px;
        width: 1.8rem;
        margin: 0 auto;
        text-align: center;
        .btn-text{
          font-size: 0.3rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: @new-col-white;
          line-height: 0.7rem;
        }
      }   
    }
  }  
}
</style>