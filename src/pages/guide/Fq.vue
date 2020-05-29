<template>
  <div class="fq-body">
    <div class="container">
      <div class="title">
        <span class="icon"></span>
        <span class="text">{{title}}</span>
      </div>
      <div class="content" v-for="(item, index) in content" :key="index">
        <p class="text" v-html="item.text"></p>
        <div :class="{'image': !item.smallImage, 'small-image': item.smallImage}"
          v-if="item.images && item.images.length" v-for="(imgUrl, idx) in item.images" :key="idx">
          <img :src="imgUrl">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'guideFq',
  data() {
    return {
      pageTitle: '',
      title: '',
      content: [],
    };
  },
  computed: {
    type() {
      return this.$route.name;
    },
  },
  mounted() {
    switch (this.type) {
      case 'guidePdf':
        this.title = '如何查看讲义';
        this.pageTitle = '课前操作';
        this.content = [
          {
            text: '1、如果您使用的是iPad客户端，登录之后，在首页课表页中查看，也可进入全部课程里查看，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/pdf/pdf-1.jpg', '/static/imgs/fq/pdf/pdf-2.jpg'],
          },
          {
            text: '2、如果您使用的是PC（win）客户端，登录之后，选择上课的日期，可在首页课表页中查看讲义，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/pdf/pdf-3.jpg'],
          },
        ];
        break;
      case 'guidePreview':
        this.title = '如何探索新知';
        this.pageTitle = '课前操作';
        this.content = [
          {
            text: '1、如果您使用的是iPad客户端，登录之后，可在首页课表页中查看，也可进入全部课程里查看，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/preview/preview-1.jpg', '/static/imgs/fq/preview/preview-2.jpg'],
          },
          {
            text: '2、如果您使用的是PC（win）客户端，登录之后，选择上课的日期，可在首页课表页中查看，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/preview/preview-3.jpg'],
          },
        ];
        break;
      case 'guideEnterClass':
        this.title = '如何上课';
        this.pageTitle = '课前操作';
        this.content = [
          {
            text: '1、如果您使用的是iPad客户端，登录之后，在首页找到即将要上课的课表，可提前15分钟进入教室，等待老师上课；如果上课时间已到，老师还未出现，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/enter-class/enter-class-1.jpg'],
          },
          {
            text: '2、如果您使用的是PC（win）客户端，在首页找到即将上课的课表，可提前15分钟进入教室，等待老师上课；如果上课时间已到，老师尚未出现，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/enter-class/enter-class-2.jpg'],
          },
        ];
        break;
      case 'turnRules':
        this.title = '转班规则说明';
        this.pageTitle = '其他操作';
        this.content = [
          {
            text: '1、转班定义：可对剩下未开课的所有课节进行整体转班，允许换上课老师和上课时间点；',
            images: [],
          },
          {
            text: '2、每学段课程开课前，可以随时转班，不消耗转班机会；每学段课程开课后，学员有2次转班机会，当学段内使用。',
            images: [],
          },
          {
            text: '3、操作转班时，如距离最近一次课大于等于24h，剩余课节可进行转班，即时生效（以老师实际可授课时间为准）;如距离最近一次课小于24h，最近一次课无法变更。',
            images: [],
          },
          {
            text: '*备注：若转班前操作了某节课的调课，不可对调过的课节进行转班，该课节以调课的老师和时间为准；',
            images: [],
          },
        ];
        break;
      case 'adjustRules':
        this.title = '调课规则说明';
        this.pageTitle = '其他操作';
        this.content = [
          {
            text: '1、调课定义：只可对某节课进行单次调课，允许换上课老师和上课时间点；',
            images: [],
          },
          {
            text: '2、Reach课程和HE课程一学年课程分为第1、2、3、4四个学段。每学段可分别调课3次。',
            images: [],
          },
          {
            text: '3、调课可操作距上课时间大于等于24小时，小于等于14天内（含操作当天）的课程。可调入范围为大于等于24小时，小于等于14天内（含操作当天）的时间段。操作调课后，一周内最多允许上3节课',
            images: [],
          },
        ];
        break;
      case 'refundRules':
        this.title = '退费规则说明';
        this.pageTitle = '其他操作';
        this.content = [
          {
            text: `1.同一级别，学员享有一次全额退款的权利，且全额退款指学员上完第一节课且在第二节课开课24小时之前可以全额退费。<br/>
              2.学员在第二次课开课后退费（含第二次课）<br/>
              应退金额 = 实际缴费课程金额 - 课单价（见备注1） ✖️ 实际消耗课次<br/>
              备注：<br/>
              1.课单价 = ( 订单实际缴费金额 - 教材费 ) /  购买课节数<br/>
              2.如若订单中未购买教材，则该订单中的教材费为0元。<br/>
              3.学员在操作退费时，若最近一次课离上课时间小于24小时，该课节不予退费`,
            images: [],
          },
          {
            text: `Reach教材退费规则：<br/>
              若学员购买了教材，在发生退费时规则如下：<br/>
              1.以学员购买成功当天计算，30天内且教材未拆封，可操作退费。<br/>
              2.以学员购买成功当天计算，超过30天，则不可操作退费。<br/>
              3.若教材已拆封，则不可操作退费。`,
            images: [],
          },
        ];
        break;
      /* 课后操作 */
      case 'guideHomework':
        this.title = '如何蓄能巩固';
        this.pageTitle = '课后操作';
        this.content = [
          {
            text: '1.如果您使用的是iPad客户端，登录之后，可在首页课表页中查看，也可进入全部课程里查看，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9',
            images: ['/static/imgs/fq/homework/homework-1.jpg', '/static/imgs/fq/homework/homework-2.jpg'],
          },
          {
            text: '2.如果您使用的是PC（win）客户端，登录进入首页，选择上课的日期，可在首页课表页中查看找到课表，如果无法查看，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/homework/homework-3.jpg'],
          },
        ];
        break;
      case 'guideTeacherComment':
        this.title = '如何查看老师评价';
        this.pageTitle = '课后操作';
        this.content = [
          {
            text: '1.如果您使用的是iPad客户端，进入全部课程，点击课节查看，老师将会在课后24小时内提交反馈，如超过24小时看不到课堂报告，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/teacher-comment/1.jpg'],
          },
          {
            text: '2.如果您使用的是PC（win）客户端，选择上课的日期，在课表页中查看，老师将会在课后24小时内提交反馈，如超过24小时看不到课堂报告，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/teacher-comment/2.jpg'],
          },
        ];
        break;
      case 'guidePlayback':
        this.title = '如何查看回放';
        this.pageTitle = '课后操作';
        this.content = [
          {
            text: '1.如果您使用的是iPad端，进入全部课程中的课节详情页查看，课后3小时可查看回放，如果超过3小时还未看到回放，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/playback/1.jpg'],
          },
          {
            text: '2.如果您使用的是PC（win）客户端，进入首页课表页，根据日期找到想要查看课程回放的课节，课后3小时可查看回放，如果超过3小时还未看到回放，请联系班主任，或者拨打客服热线<a href="tel:4008002211">4008002211</a>转9；',
            images: ['/static/imgs/fq/playback/2.jpg'],
          },
        ];
        break;
      /* 课中问题 */
      case 'guide1v1Help':
        this.title = '1V1如何进行课中求助？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<span class="font-weight:bold;">第一步</span>：课中上课遇到任何问题，都可以点击“我要求助”进行求助哦~',
            images: ['/static/imgs/fq/help/1.jpg'],
          },
          {
            text: '<span class="font-weight:bold;">第二步</span>：至少要选择一项求助内容。',
            images: ['/static/imgs/fq/help/2.jpg'],
          },
          {
            text: '<span class="font-weight:bold;">第三步</span>：看到此弹窗代表求助成功哦，请您耐心等待，工作人员会迅速联系您，为您解决问题。',
            images: ['/static/imgs/fq/help/3.jpg'],
          },
        ];
        break;
      case 'guide1vnHelp':
        this.title = '1V多如何进行课中求助？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<span class="font-weight:medium;">第一步</span>：课中遇到卡顿、课程无法播放等问题，可点击“反馈”按钮查询解决办法哦~',
            images: ['/static/imgs/fq/help/n1.jpg'],
          },
          {
            text: '<span class="font-weight:bold;">第二步</span>：若您遇到以上问题，请先尝试通过推荐办法解决。若推荐办法解决了您的问题，请您点击“是”；若推荐办法未能解决您的问题，请您点击“否”；',
            images: ['/static/imgs/fq/help/n2.jpg'],
          },
          {
            text: '<span class="font-weight:bold;">第三步</span>：点击“否”之后，请您至少选择一项反馈问题提交。',
            images: ['/static/imgs/fq/help/n3.jpg'],
          },
          {
            text: '<span class="font-weight:bold;">第四步</span>：看到此弹窗代表求助成功哦，请您耐心等待，工作人员会在24h之内联系您，为您解决问题。',
            images: ['/static/imgs/fq/help/n4.jpg'],
          },
        ];
        break;
      case 'guideVideoStuck':
        this.title = '1V多视频播放很卡怎么办？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<span class="font-weight:bold;">tips</span>：如果家里有有线网络，最好是插网线上课呦，网络断开时，请重新插拔网线，上课期间暂时退出杀毒软件和不用的程序。',
            images: [],
          },
          {
            text: '<span class="font-weight:bold;">第一步</span>：网速是否被家人占用。在您上课时，问下家人是否正在其他上网设备看在线视频、下载东西，或者使用网络电视，如果有，请家人为了您更流畅上课暂停一段时间。',
            images: [],
          },
          {
            text: '<span class="font-weight:bold;">第二步</span>：WiFi离您是否太远。如果您连接WiFi上课，请您尽量靠近路由器上课，并且您和路由器之间没有障碍，这样网速会更快呦！',
            images: [],
          },
          {
            text: '<span class="font-weight:bold;">第三步</span>：退出教室并关闭客户端，重新打开VIPX。',
            images: [],
          },
          {
            text: '<span class="font-weight:bold;">第四步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
            images: [],
          },
        ];
        break;
      case 'guidecantSee':
        this.title = '1V1上课时看不见自己/老师看不见我怎么办？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<h3>PC端</h3>',
            images: [],
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：首先确认您的摄像头没有被老师禁用，老师端禁用标识如下。如禁用请联系老师打开。',
            images: ['/static/imgs/fq/cant-see/1.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：检查摄像头指示灯是否亮起。',
            images: [],
          },
          {
            text: '<span style="color: #666; font-size: .24rem;">未亮起，请按如下操作：<br>| 如果是外接摄像头，请您检查摄像头是否插好。<br>| 如果您是笔记本电脑，可能驱动存在问题，请直接联系我们的工作人员帮您解决。<br>若亮起，请按如下操作：</span>',
            images: [],
          },
          {
            text: '<span style="font-weight:bold;">第三步</span>：选择正确的摄像头设备。',
            images: [],
          },
          {
            text: '<span style="color: #666; font-size: .24rem;">您的电脑可能存在多个摄像头设备。在摄像头检测界面——点击“摄像头下拉选项”-选择切换设备选择可以看见视频的设备即可。</span>',
            images: ['/static/imgs/fq/cant-see/2.jpg'],
            smallImage: true,
          },
          {
            text: '<p style="color:#666;text-align:center;font-size:.24rem;">在教室上方找到此图标</p>',
            images: ['/static/imgs/fq/cant-see/3.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第四步</span>：摄像头被杀毒软件拦截。',
          },
          {
            text: '<span style="color:#666;font-size:.24rem;">上课期间请临时关闭杀毒软件，如：360安全卫士等，软件在桌面右下角，右击退出即可。（进入教室有拦截弹窗时请选择允许）。</span>',
          },
          {
            text: '<span style="font-weight:bold;">第五步</span>：退出客户端重进或者重启动电脑。',
          },
          {
            text: '<span style="color:#666;font-size:.24rem;">退出教室并关闭客户端，重新打开VIPX，进入教室后进行设备检测。</span>',
          },
          {
            text: '<span style="font-weight:bold;">第六步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },
          {
            text: '<h3>iPad端</h3>',
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：首先确认您的摄像头没有被外教禁用，老师端禁用标识如下。如禁用请联系老师打开。',
            images: ['/static/imgs/fq/cant-see/4.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：若外教未禁用您的摄像头，请按以下操作进行处理。',
            images: ['/static/imgs/fq/cant-see/5.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第三步</span>：退出教室/客户端重进或者重启动电脑。',
          },
          {
            text: '<span style="color:#666;font-size:.24rem;">退出教室/客户端重进或者重启动电脑，重新打开VIPX。</span>',
          },
          {
            text: '<span style="font-weight:bold;">第四步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },
        ];
        break;
      case 'cantHearTeacher':
        this.title = '1V1听不见老师说话怎么办？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<h3>PC端</h3>',
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：首先请您检查耳机或音响设备插口是否松动，可尝试重新插拔设备并调节设备自带的音量按钮至最大。',
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：在扬声器检测界面，首先确保下方的音量条是打开的（如下图），然后点击“当前扬声器”的下拉按钮 (如图所示），如有多个扬声器设备时，请切换选择可以听见的扬声器。',
            images: ['/static/imgs/fq/cant-hear-teacher/1.jpg'],
            smallImage: true,
          },
          {
            text: '<p style="color:#666;text-align:center;font-size:.24rem;">在教室上方找到此图标</p>',
            images: ['/static/imgs/fq/cant-hear-teacher/2.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第三步</span>：检查电脑系统中的音量混合器中VIPX音量是否正常。',
          },
          {
            text: '<span style="color:#666;font-size:.24rem;">右键点击桌面右下角小喇叭图标，打开音量合成器，找到VIPX将音量调高。</span>',
            images: ['/static/imgs/fq/cant-hear-teacher/3.jpg', '/static/imgs/fq/cant-hear-teacher/4.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第四步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },
          {
            text: '<h3>iPad端</h3>',
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：请按照以下步骤操作',
            images: ['/static/imgs/fq/cant-hear-teacher/5.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },

        ];
        break;

      case 'teacherCantHear':
        this.title = '1V1老师听不见我说话怎么办？';
        this.pageTitle = '课中问题';
        this.content = [
          {
            text: '<h3>PC端</h3>',
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：检查您的耳麦插口或连接线是否松动。使用笔记本电脑时，请尝试拔掉耳机对电脑麦克风讲话看音量条是否有波动。',
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：在麦克风检测界面，点击“当前麦克风”的下拉按钮（如下图），如有多个麦克风选项，请分别尝试每一个选项尝试对麦克风说话并观察音量条波动，选择有波动的麦克风上课。',
            images: ['/static/imgs/fq/teacher-cant-hear/1.jpg'],
            smallImage: true,
          },
          {
            text: '<p style="color:#666;text-align:center;font-size:.24rem;">在教室上方找到此图标</p>',
            images: ['/static/imgs/fq/teacher-cant-hear/2.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第三步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },
          {
            text: '<h3>iPad端</h3>',
          },
          {
            text: '<span style="font-weight:bold;">第一步</span>：请按照以下步骤操作',
            images: ['/static/imgs/fq/teacher-cant-hear/3.jpg'],
          },
          {
            text: '<span style="font-weight:bold;">第二步</span>：以上都没能解决您的问题，您可点击课中“我要求助”按钮进行求助或者拨打<a href="tel:4008002211">4008002211</a>转9 ，我们的工作人员会迅速与您联系，为您解决问题。',
          },
        ];
        break;
      default:
        break;
    }
    document.title = this.pageTitle;
  },
};
</script>

<style lang="less" scoped>
body {
  background: #f8f8f8;
}
.container {
  margin: .2rem .2rem;
  padding: .3rem .31rem .51rem;
  background: #fff;
  border-radius: .08rem;
  box-shadow: .06rem 0px .24rem rgba(0, 0, 0, .06);
}
.title {
  display: flex;
  margin-bottom: .28rem;
  align-items: center;
  .text {
    font-size: .3rem;
  }
  .icon {
    width: .06rem;
    height: .3rem;
    margin-right: .2rem;
    background-color: #75008B;
  }
}
.content {
  .text {
    margin-bottom: .22rem;
    font-size: .26rem;
    line-height: .36rem;
    color: #333;
  }
  .image {
    width: 6.41rem;
    height: auto;
    margin: 0 auto .16rem ;
    img {
      width: 6.41rem;
      height: auto;
    }
  }
  .small-image {
    width: 4.08rem;
    height: .39rem;
    margin: 0 auto .16rem ;
    img {
      width: 4.08rem;
      height: .39rem;
    }
  }
}
</style>
