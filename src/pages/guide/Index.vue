<template>
  <div>
    <div class="guide-header">
      <div class="avatar">
        <img class="avatar-img" src="../../assets/default-photo.png"/>
      </div>
      <div class="tips-box">
        <span class="tips">Hi~所有问题都可以在这里找到哦～</span>
      </div>
    </div>
    <div class="guide-box">
      <div class="item">
        <div class="item-title">
          <div class="before-title"></div>
          <h3 class="title">课前操作</h3>
          <div class="after-title"></div>
        </div>
        <group>
          <cell title="如何查看讲义" link="/guide/pdf">
          </cell>
          <cell title="如何探索新知" link="/guide/preview">
          </cell>
          <cell title="如何上课" link="/guide/enter-class">
          </cell>
        </group>
      </div>

      <div class="item">
        <div class="item-title">
          <div class="before-title"></div>
          <h3 class="title">课中问题</h3>
          <div class="after-title"></div>
        </div>
        <group>
          <cell title="1v1上课时看不见自己怎么办？" link="/guide/cant-see">
          </cell>
          <cell title="1v1上课时听不见老师声音怎么办？" link="/guide/cant-hear-teacher">
          </cell>
          <cell title="1v1老师听不见我说话怎么办？" link="/guide/teacher-cant-hear">
          </cell>
          <cell title="1v1如何进行课中求助？" link="/guide/1v1-help">
          </cell>
          <cell title="1v多视频播放很卡怎么办？" link="/guide/video-stuck">
          </cell>
          <cell title="1v多如何进行课中求助？" link="/guide/1vn-help">
          </cell>
        </group>
      </div>

      <div class="item">
        <div class="item-title">
          <div class="before-title"></div>
          <h3 class="title">课后操作</h3>
          <div class="after-title"></div>
        </div>
        <group>
          <cell title="如何查看回放？" link="/guide/playback">
          </cell>
          <cell title="如何查看老师评价？" link="/guide/teacher-comment">
          </cell>
          <cell title="如何蓄能巩固？" link="/guide/homework">
          </cell>
        </group>
      </div>

      <div class="item">
        <div class="item-title">
          <div class="before-title"></div>
          <h3 class="title">其他操作</h3>
          <div class="after-title"></div>
        </div>
        <group>
          <cell title="调课规则说明" link="/guide/adjust-rules">
          </cell>
          <cell title="转班规则说明" link="/guide/turn-rules">
          </cell>
          <cell title="退费规则说明" link="/guide/refund-rules">
          </cell>
        </group>
      </div>
    </div>
    <div class="footer">
      <h3 class="footer-title">学而思VIPX</h3>
      <div class="footer-sub-title">
        <div class="before-title"></div>
        <h3 class="title">纯正美式课堂，把世界带进我家</h3>
        <div class="after-title"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, Cell } from 'vux';
import { setApilog } from '@/api';

export default {
  name: 'guide',
  components: { Group, Cell },
  mounted() {
    setApilog({
      event_type: 70016,
      route: '/guide',
    });
  },
};
</script>

<style lang="less">
@import '../../styles/basic.less';
.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2.3rem;
  padding-left: 16.7%;
  padding-right: 16.7%;
  .bg-m('../assets/mine-bg.jpg', 0, 0, no-repeat);
  background-size: 100% 2.3rem;
  .avatar {
    height: .64rem;
    width: .64rem;
    border-radius: .64rem;
    .avatar-img {
      height: .64rem;
      width: .64rem;
      border-radius: .64rem;
    }
  }
  .tips-box {
      width: 4.16rem;
      height: .54rem;
      padding-left: .15rem;
      margin-left: .15rem;
      background: #fff;
      border-radius: .25rem .25rem .25rem 0;
      box-shadow: .04rem 0 .06rem rgba(94, 82, 212, 0.2);
  }
  .tips {
    line-height: .54rem;
    font-size: .24rem;
    font-family: PingFangSC-Regular;
    color: rgba(89,98,219,1);
  }
}
.guide-box {
  width: 100%;
  padding: 0 .22rem 0 .18rem;
  background: #f6f6f6;
  .item {
    padding: .25rem 0;
    font-size: .26rem;
    .vux-cells {
      border-radius: .3rem;
      opacity: .9;
    }
    .vux-label {
      padding: .06rem 0 0 .1rem;
      font-size: .26rem;
    }
    .weui-cell_access .weui-cell__ft:after {
      width: .18rem;
      height: .18rem;
    }
  }
  .weui-cells {
    border-radius: .1rem;
    .weui-cell {
      margin-bottom: 0 .3rem;
    }
  }
  .weui-cells:before {
    display: none;
  }
  .weui-cell:before {
    left: .3rem;
    right: .3rem;
  }

  .item-title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .before-title, .after-title {
      width: 1rem;
      height: .01rem;
      background: #b1b7d0;
    }
    .before-title {
      margin-left: 1.4rem;
    }
    .after-title {
      margin-right: 1.4rem;
    }
    .title {
      font-size: .3rem;
    }
  }
}
.footer {
  width: 100%;
  padding: 1rem 0 .52rem;
  background: #f6f6f6;
  color: rgba(178,183,206,1);
  .footer-title {
    margin-bottom: .2rem;
    text-align: center;
  }
  .footer-sub-title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .before-title, .after-title {
      width: 1rem;
      height: .01rem;
      background: #b1b7d0;
    }
    .before-title {
      margin-left: .8rem;
    }
    .after-title {
      margin-right: .8rem;
    }
    .title {
      font-size: .24rem;

    }
  }
}
</style>
