import { validJssdk } from '@/api';

export default {
  computed: {
    currentUrl() {
      return location.href;
    },
    host() {
      return location.origin;
    },
    currentRouteName() {
      return this.$route.name === 'thanksGivingResult' ? `thanksGivingResult${this.$route.query.type}` : this.$route.name;
    },
  },
  methods: {
    //分享
    share(data) {
      this.$wechat.onMenuShareTimeline(data);
      this.$wechat.onMenuShareAppMessage(data);
    },
    //隐藏
    hide() {
      this.$wechat.hideOptionMenu();
    },
    // 隐藏按钮
    hideItems() {
      this.$wechat.hideMenuItems({
        menuList: [
          'menuItem:share:qq',
          'menuItem:share:weiboApp',
          'menuItem:favorite',
          'menuItem:share:facebook',
          'menuItem:share:QZone',
          'menuItem:editTag',
          'menuItem:delete',
          'menuItem:copyUrl',
          'menuItem:originPage',
          'menuItem:readMode',
          'menuItem:openWithQQBrowser',
          'menuItem:openWithSafari',
          'menuItem:share:email',
          'menuItem:share:brand',
        ],
      });
    },
  },
  mounted() {
    validJssdk(this.currentUrl).then((res) => {
      // console.log(res.data);
      this.$wechat.config({
        debug: false,
        appId: res.data.appId,
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'hideOptionMenu',
          'hideMenuItems',
          'showMenuItems',
        ],
      });
      this.$wechat.ready((() => {
        switch (this.currentRouteName) {
          case 'poster':
          case 'share':
          case 'introducePoster':
          case 'Tranning':
          case 'pvmPdf':
          case 'weekDirectory':
          case 'thanksGivingResult1':
          case 'thanksGivingMaking':
          case 'introduce':
          case 'introduceLogin':
          case 'introduceMyRecommended':
          case 'introduceRecommendedPrize':
            this.hide();
            break;
          case 'stageTest':
            this.hideItems();
            console.log('123');
            this.share({
              title: '我的报告',
              desc: '我在VIPX完成了阶段测试。一分耕耘 一分收获，快来看看吧',
              link: location.href,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          case 'Activity':
            this.hideItems();
            this.share({
              title: '学而思VIPX邀您体验外教一对一诊断课',
              desc: '邀您体验北美外教在线一对一口语+阅读诊断课，跟北美外教学英语，不只是口语。',
              link: location.href,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          case 'thanksGivingResult0':
            this.hideItems();
            this.share({
              title: '我做了一个感恩节视频贺卡，你也来试试？',
              desc: '点击get你的感恩专属通道',
              link: `${location.href}&isShare=1`,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          case 'thanksGiving':
            this.hideItems();
            this.share({
              title: '感恩节不只火鸡，还有惊喜给你～',
              desc: '嘘，外教唱给你听！',
              link: location.href,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          case 'starTest':
            this.hideItems();
            this.share({
              title: '我在VIPX参加的STAR英文阅读能力测评出结果啦！',
              desc: '一分耕耘，一份收获，继续加油。',
              link: location.href,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          case 'readingReport':
            this.hideItems();
            this.share({
              title: '结业证书',
              desc: '我在学而思国际VIPX学到了超超超有趣的阅读策略，你想加入吗？',
              link: location.href,
              imgUrl: `${this.host}/static/imgs/logo.jpg`,
              type: 'link',
              dataUrl: '',
              success: () => {},
              fail: () => {},
            });
            break;
          // case 'newIntroduce':
          //   if (this.status === 1) {
          //     this.$wechat.hideMenuItems({
          //       menuList: [
          //         'menuItem:share:appMessage',
          //         'menuItem:share:timeline',
          //         'menuItem:share:qq',
          //         'menuItem:share:weiboApp',
          //         'menuItem:favorite',
          //         'menuItem:share:facebook',
          //         'menuItem:share:QZone',
          //         'menuItem:editTag',
          //         'menuItem:delete',
          //         'menuItem:copyUrl',
          //         'menuItem:originPage',
          //         'menuItem:readMode',
          //         'menuItem:openWithQQBrowser',
          //         'menuItem:openWithSafari',
          //         'menuItem:share:email',
          //         'menuItem:share:brand',
          //       ],
          //     });
          //   } else {
          //     this.$wechat.showMenuItems({
          //       menuList: [
          //         'menuItem:share:appMessage',
          //         'menuItem:share:timeline',
          //         'menuItem:copyUrl',
          //       ],
          //     });
          //   }
          //   this.share({
          //     title: '邀请有奖',
          //     desc: '我在学而思国际VIPX学到了超超超有趣的阅读策略，你想加入吗？',
          //     link: location.href,
          //     imgUrl: `${this.host}/static/imgs/logo.jpg`,
          //     type: 'link',
          //     dataUrl: '',
          //     success: () => {},
          //     fail: () => {},
          //   });
          //   break;
          default:
            break;
        }
      }));
    });
  },
};
