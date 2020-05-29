import Vue from 'vue';
import Router from 'vue-router';
import invitePeiyou from './invitePeiyou';
import activities from './activities';
import stageTest from './stageTest';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: () => import('@/pages/home/Home'),
      children: [{
        path: '/',
        name: 'home',
        meta: {
          showNav: true,
          title: '首页',
        },
        component: () => import('@/pages/home/Normal'),
      }],
    },
    {
      path: '/appoint-succeed',
      name: 'appointSucceed',
      meta: {
        title: '预约诊断课',
      },
      component: () => import('@/pages/home/AppointSucceed'),
    },
    {
      path: '/wtj/:order_id',
      name: 'waitTimeJump',
      meta: {
        title: '订单跳转',
      },
      component: () => import('@/pages/home/Wtj'),
    },
    {
      path: '/peiyou',
      name: 'peiyouIndex',
      component: () => import('@/pages/peiyou/Index'),
      meta: {
        title: 'VIPX',
      },
    },
    {
      path: '/peiyou/topic',
      name: 'peiyouTopic',
      component: () => import('@/pages/peiyou/Topic'),
      meta: {
        title: 'VIPX',
      },
    },
    {
      path: '/bind-mobile',
      name: 'bindMobile',
      component: () => import('@/pages/auth/BindMobile'),
      meta: {
        title: '绑定手机',
      },
    },
    {
      path: '/course-details/:id',
      name: 'courseDetails',
      component: () => import('@/pages/course/CourseDetails'),
      meta: {
        title: '课程详情',
      },
    },
    {
      path: '/package-details/:id',
      name: 'packageDetails',
      component: () => import('@/pages/course/PackageDetails'),
      meta: {
        title: '课程详情',
      },
    },
    {
      path: '/binding-details/:id',
      name: 'bindingDetails',
      component: () => import('@/pages/course/BindingDetails'),
      meta: {
        title: '课程详情',
      },
    },
    {
      path: '/course/list',
      name: 'courseLists',
      component: () => import('@/pages/course/List'),
      meta: {
        title: '课程清单',
      },
    },
    {
      path: '/material/:bookId',
      name: 'material',
      component: () => import('@/pages/material/Index'),
      meta: {
        title: '教材详情',
        keepAlive: true,
      },
    },
    {
      path: '/material/buy/:bookId',
      name: 'buyMaterial',
      component: () => import('@/pages/material/Buy'),
      meta: {
        title: '购买教材',
        keepAlive: true,
      },
    },
    {
      path: '/order/material',
      name: 'orderMaterial',
      component: () => import('@/pages/material/Order'),
    },
    {
      path: '/choose',
      component: () => import('@/pages/time/Index.vue'),
      children: [
        {
          path: 'time',
          name: 'time',
          component: () => import('@/pages/time/Time'),
          meta: {
            title: '选择上课日期',
            keepAlive: true,
          },
        },
        {
          path: 'sel-teacher',
          name: 'selTeacher',
          component: () => import('@/pages/time/Teacher'),
          meta: {
            title: '选择老师',
            keepAlive: true,
          },
        },
      ],
    },
    {
      path: '/exp-time',
      name: 'expTime',
      component: () => import('@/pages/time/ExpTime'),
      meta: {
        title: '选择上课日期',
      },
    },
    {
      path: '/turns',
      component: () => import('@/pages/turns/Index.vue'),
      children: [
        {
          path: 'time/:courseId/:classroomId',
          name: 'turnsTime',
          meta: {
            title: '选择上课日期',
            keepAlive: true,
          },
          component: () => import('@/pages/turns/Time'),
        },
        {
          path: 'teacher/:courseId/:classroomId',
          name: 'turnsTeacher',
          meta: {
            title: '选择老师',
            keepAlive: true,
          },
          component: () => import('@/pages/turns/Teacher'),
        },
      ],
    },
    {
      path: '/adjust',
      component: () => import('@/pages/adjust/index.vue'),
      children: [
        {
          path: 'teacher/:courseId/:scheduleId',
          name: 'adjustTeacher',
          meta: {
            title: '选择老师',
            keepAlive: true,
          },
          component: () => import('@/pages/adjust/ByTeacher'),
        },
        {
          path: 'time/:courseId/:scheduleId',
          name: 'adjustTime',
          meta: {
            title: '选择上课日期',
            keepAlive: true,
          },
          component: () => import('@/pages/adjust/ByTime'),
        },
      ],
    },
    // {
    //   path: '/adjust/time/:courseId/:scheduleId',
    //   name: 'adjustTime',
    //   component: () => import('@/pages/adjust/ByTime'),
    //   meta: {
    //     title: '选择上课日期',
    //   },
    // },
    // {
    //   path: '/adjust/teacher/:courseId/:scheduleId',
    //   name: 'adjustTeacher',
    //   component: () => import('@/pages/adjust/ByTeacher'),
    //   meta: {
    //     title: '选择老师',
    //   },
    // },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/Login'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/Register'),
      meta: {
        title: '注册',
      },
    },
    {
      path: '/find-password',
      name: 'findPassword',
      component: () => import('@/pages/auth/FindPassword'),
      meta: {
        title: '忘记密码',
      },
    },
    {
      path: '/modify-password',
      name: 'modifyPassword',
      component: () => import('@/pages/auth/ModifyPassword'),
      meta: {
        title: '修改密码',
      },
    },
    {
      path: '/complete-information',
      name: 'completeInformation',
      component: () => import('@/pages/auth/CompleteInformation'),
      meta: {
        title: '完善信息',
      },
    },
    {
      path: '/pay/reject',
      name: 'rejectOrder',
      meta: {
        title: '确认订单',
      },
      component: () => import('@/pages/pay/RejectOrder'),
    },
    {
      path: '/pay/success',
      name: 'successOrder',
      component: () => import('@/pages/pay/SuccessOrder'),
      meta: {
        title: '支付成功',
      },
    },
    {
      path: '/pay',
      name: 'confirmOrder',
      meta: {
        title: '确认订单',
        keepAlive: true,
      },
      component: () => import('@/pages/pay/PayTime'),
    },
    {
      path: '/pay/wait-pay',
      name: 'waitPay',
      meta: {
        title: '待付款',
      },
      component: () => import('@/pages/pay/PayWait'),
    },
    {
      path: '/mine',
      name: 'mine',
      meta: {
        showNav: true,
        title: '我的',
      },
      component: () => import('@/pages/mine/Index.vue'),
    },
    {
      path: '/about',
      name: 'aboutUs',
      meta: {
        title: '了解VIPX',
      },
      component: () => import('@/pages/mine/AboutUs.vue'),
    },
    {
      path: '/mine/profile',
      name: 'profile',
      component: () => import('@/pages/mine/profile/Index.vue'),
    },
    {
      path: '/mine/favorite',
      name: 'favorite',
      meta: {
        title: '我关注的老师',
      },
      component: () => import('@/pages/mine/favorite/Favorite.vue'),
    },
    {
      path: '/mine/report',
      name: 'report',
      meta: {
        title: '我的报告',
      },
      component: () => import('@/pages/mine/report/Index.vue'),
    },
    {
      path: '/mine/star-test',
      name: 'starTest',
      meta: {
        title: '我的报告',
      },
      component: () => import('@/pages/mine/report/TestStar.vue'),
    },
    {
      path: '/mine/logistics/goodsInfo',
      name: 'goodsInfo',
      meta: {
        title: '物流状态',
      },
      component: () => import('@/pages/mine/logistics/GoodsInfo.vue'),
    },
    {
      path: '/mine/logistics',
      meta: {
        title: '物流状态',
      },
      component: () => import('@/pages/mine/logistics/Index.vue'),
      children: [
        {
          path: '',
          name: 'notShipped',
          meta: {
            title: '未发货',
          },
          component: () => import('@/pages/mine/logistics/NotShipped.vue'),
        },
        {
          path: 'shipped',
          name: 'shipped',
          meta: {
            title: '已发货',
          },
          component: () => import('@/pages/mine/logistics/Shipped.vue'),
        },
        {
          path: 'signed',
          name: 'signed',
          meta: {
            title: '已签收',
          },
          component: () => import('@/pages/mine/logistics/Signed.vue'),
        },
      ],
    },
    {
      path: '/mine/logistics/details',
      name: 'logisticsDetails',
      meta: {
        title: '快递查询',
      },
      component: () => import('@/pages/mine/logistics/LogisticsDetails.vue'),
    },
    {
      path: '/mine/logistics/sendback',
      name: 'sendBack',
      meta: {
        title: '申请更换',
      },
      component: () => import('@/pages/mine/logistics/SendBack.vue'),
    },
    {
      path: '/mine/editeaddress/:id(\\d+)',
      name: 'editeAddress',
      meta: {
        title: '编辑地址',
      },
      component: () => import('@/pages/mine/logistics/editeAddress.vue'),
    },
    {
      path: '/mine/order',
      component: () => import('@/pages/mine/order/Order.vue'),
      children: [
        {
          path: '',
          name: 'unpayOrder',
          meta: {
            title: '未支付订单',
          },
          component: () => import('@/pages/mine/order/UnpayOrder.vue'),
        },
        {
          path: 'paid',
          name: 'paidOrder',
          meta: {
            title: '已支付订单',
          },
          component: () => import('@/pages/mine/order/PaidOrder.vue'),
        },
        {
          path: 'cancel',
          name: 'cancelOrder',
          meta: {
            title: '已取消订单',
          },
          component: () => import('@/pages/mine/order/CancelOrder.vue'),
        },
        {
          path: 'refund',
          name: 'refundOrder',
          meta: {
            title: '已退款订单',
          },
          component: () => import('@/pages/mine/order/RefundOrder.vue'),
        },
      ],
    },
    {
      path: '/mine/refund/:orderId(\\d+)',
      name: 'refund',
      meta: {
        title: '退款详情',
      },
      component: () => import('@/pages/mine/order/NewRefund.vue'),
    },
    {
      path: '/mine/refund/list',
      name: 'refundList',
      meta: {
        title: '退款',
      },
      component: () => import('@/pages/mine/order/RefundList.vue'),
    },
    {
      path: '/mine/set',
      name: 'setInfoIndex',
      meta: {
        title: '设置',
      },
      component: () => import('@/pages/mine/set/Index.vue'),
    },
    {
      path: '/mine/order-details/:orderId',
      name: 'orderDetails',
      meta: {
        title: '订单详情',
      },
      component: () => import('@/pages/mine/order/OrderDetails.vue'),
    },
    {
      path: '/mine/course',
      component: () => import('@/pages/mine/course/Index.vue'),
      children: [
        {
          path: '',
          name: 'learning',
          component: () => import('@/pages/mine/course/Learning.vue'),
          // component: () => import('@/components/course/MyCourseNew.vue'),
          meta: {
            title: '我的课程',
          },
        },
        {
          path: 'notyet',
          name: 'notyet',
          meta: {
            title: '未开课',
          },
          component: () => import('@/pages/mine/course/Notyet.vue'),
        },
        {
          path: 'finished',
          name: 'finished',
          meta: {
            title: '已结课',
          },
          component: () => import('@/pages/mine/course/Finished.vue'),
        },
      ],
    },
    {
      path: '/mine/teacher/:id',
      name: 'teacher',
      meta: {
        title: '老师详情',
      },
      component: () => import('@/pages/teacher/Index.vue'),
    },
    {
      path: '/teachers',
      name: 'teachers',
      meta: {
        title: '找老师',
      },
      component: () => import('@/pages/teachers/Index.vue'),
    },
    {
      path: '/teachers/search',
      name: 'teachersSearch',
      meta: {
        title: '搜索老师',
      },
      component: () => import('@/pages/teachers/Search.vue'),
    },
    {
      path: '/other-teacher',
      name: 'otherTeacher',
      meta: {
        title: '授课老师',
      },
      component: () => import('@/pages/teacher/OtherList.vue'),
    },
    {
      path: '/class-report/:teacherId/:scheduleId',
      name: 'classReport',
      meta: {
        title: '课堂报告',
      },
      component: () => import('@/pages/circles/classReport.vue'),
    },
    {
      path: '/evaluate/:teacherId/:scheduleId',
      name: 'evaluate',
      meta: {
        title: '评价老师',
      },
      component: () => import('@/pages/circles/Evaluate.vue'),
    },
    {
      path: '/learning-report/:minor_id',
      name: 'learningReport',
      meta: {
        title: '学习报告',
      },
      component: () => import('@/pages/circles/LearningReport.vue'),
    },
    {
      path: '/progress-test/:scheduleId',
      name: 'progressTest',
      meta: {
        title: '测试报告',
      },
      component: () => import('@/pages/circles/ProgressTest.vue'),
    },
    // 循环测测试报告
    {
      path: '/cycle-test/:scheduleId',
      name: 'cycleTest',
      meta: {
        title: '综合报告',
      },
      component: () => import('@/pages/circles/CycletestReport.vue'),
    },
    {
      path: '/mine/coupon',
      component: () => import('@/pages/mine/coupon/Index.vue'),
      children: [
        {
          path: '',
          name: 'usable',
          meta: {
            title: '可用优惠券',
          },
          component: () => import('@/pages/mine/coupon/Usable.vue'),
        },
        {
          path: 'disable',
          name: 'disable',
          meta: {
            title: '不可用优惠券',
          },
          component: () => import('@/pages/mine/coupon/Disable.vue'),
        },
      ],
    },
    {
      path: '/mine/address',
      name: 'address',
      meta: {
        title: '收货地址',
      },
      component: () => import('@/pages/mine/address/Index.vue'),
    },
    {
      path: '/mine/address/:id(\\d+)',
      name: 'addressDetails',
      meta: {
        title: '收货地址',
      },
      component: () => import('@/pages/mine/address/Details.vue'),
    },
    // {
    //   path: '/mine/wallet',
    //   name: 'Wallet',
    //   meta: {
    //     title: '钱包',
    //   },
    //   component: () => import('@/pages/mine/wallet/Index.vue'),
    // },
    {
      path: '/mine/record/classroom',
      name: 'classroomChange',
      meta: {
        title: '转班记录',
      },
      component: () => import('@/pages/mine/record/ClassroomChange.vue'),
    },
    {
      path: '/mine/record/classroom/:change_id',
      name: 'changeDetails',
      meta: {
        title: '转班详情',
      },
      component: () => import('@/pages/mine/record/ClassroomDetails.vue'),
    },
    {
      path: '/mine/record/classroomIntroduce',
      name: 'classroomIntroduce',
      meta: {
        title: '转班说明',
      },
      component: () => import('@/pages/mine/record/ClassroomIntroduce.vue'),
    },
    {
      path: '/mine/record/adjust',
      name: 'adjustRecord',
      meta: {
        title: '调课记录',
      },
      component: () => import('@/pages/mine/record/AdjustRecord.vue'),
    },
    {
      path: '/mine/record/adjust/:courseId',
      name: 'adjustDetails',
      meta: {
        title: '调课详情',
      },
      component: () => import('@/pages/mine/record/AdjustDetails.vue'),
    },
    {
      path: '/mine/record/adjustIntroduce',
      name: 'adjustIntroduce',
      meta: {
        title: '调课说明',
      },
      component: () => import('@/pages/mine/record/AdjustIntroduce.vue'),
    },
    {
      path: '/schedule/list/:classroomId',
      name: 'scheduleList',
      meta: {
        title: '课节列表',
      },
      component: () => import('@/pages/schedule/List.vue'),
    },
    {
      path: '/agreement',
      name: 'agreement',
      meta: {
        title: '服务说明',
      },
      component: () => import('@/pages/auth/Agreement'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      meta: {
        title: '隐私协议',
      },
      component: () => import('@/pages/auth/Privacy'),
    },
    {
      path: '/schedule',
      name: 'schedule',
      meta: {
        showNav: true,
        keepAlive: true,
        title: '课表',
      },
      component: () => import('@/pages/schedule/Index'),
    },
    {
      path: '/minor/more-time/:minor_id',
      name: 'moretime',
      meta: {
        title: '更多时间',
      },
      component: () => import('@/pages/schedule/MoreTime'),
    },
    {
      path: '/schedule/aims',
      name: 'aims',
      meta: {
        title: '学习指导',
      },
      component: () => import('@/pages/circles/ScheduleAims'),
    },
    {
      path: '/schedule/pdf-aims',
      name: 'aimsPdf',
      meta: {
        title: '学习指导',
      },
      component: () => import('@/pages/circles/AimsPdf'),
    },
    {
      path: '/level/test-record',
      name: 'testRecord',
      meta: {
        title: '测试记录',
      },
      component: () => import('@/pages/testlevel/Index.vue'),
    },
    {
      path: '/level/quiz-login',
      name: 'quizLogin',
      meta: {
        title: '入学测-登录',
      },
      component: () => import('@/pages/testlevel/QuizLogin.vue'),
    },
    {
      path: '/level/quiz-complete',
      name: 'quizComplete',
      meta: {
        title: '入学测-完善信息',
      },
      component: () => import('@/pages/testlevel/QuizComplete.vue'),
    },
    {
      path: '/guide',
      name: 'guide',
      meta: {
        title: '操作指南',
      },
      component: () => import('@/pages/guide/Index.vue'),
    },
    /* 课前操作 */
    {
      path: '/guide/pdf',
      name: 'guidePdf',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/preview',
      name: 'guidePreview',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/enter-class',
      name: 'guideEnterClass',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    /* 其他操作 */
    {
      path: '/guide/adjust-rules',
      name: 'adjustRules',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/turn-rules',
      name: 'turnRules',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/refund-rules',
      name: 'refundRules',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    /* 课后操作 */
    {
      path: '/guide/playback',
      name: 'guidePlayback',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/teacher-comment',
      name: 'guideTeacherComment',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/homework',
      name: 'guideHomework',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    /* 课中问题 */
    {
      path: '/guide/1v1-help',
      name: 'guide1v1Help',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/1vn-help',
      name: 'guide1vnHelp',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/video-stuck',
      name: 'guideVideoStuck',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/cant-see',
      name: 'guidecantSee',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/cant-hear-teacher',
      name: 'cantHearTeacher',
      meta: {
        title: 'VIPX',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/guide/teacher-cant-hear',
      name: 'teacherCantHear',
      meta: {
        title: '课中问题',
      },
      component: () => import('@/pages/guide/Fq.vue'),
    },
    {
      path: '/feedback/reach/:scheduleId',
      name: 'reportReach',
      meta: {
        title: '课堂报告',
      },
      component: () => import('@/pages/feedback/reach.vue'),
    },
    {
      path: '/feedback/he/:scheduleId',
      name: 'reportHe',
      meta: {
        title: '课堂报告',
      },
      component: () => import('@/pages/feedback/he.vue'),
    },
    {
      path: '/know-vipx',
      name: 'knowVipx',
      meta: {
        title: '了解VIPX',
      },
      component: () => import('@/pages/know-vipx/Index.vue'),
    },
    {
      path: '*',
      redirect: 'home',
    },
    ...invitePeiyou,
    ...activities,
    ...stageTest,
  ],
  /**
   * @description 监听页面的滚动行为
   * @param {*} to
   * @param {*} from
   * @param {*} savedPosition
   */
  scrollBehavior(to, from, savedPosition) {
    //从第二页返回首页时savePosition为undefined
    if (savedPosition || typeof savedPosition === 'undefined') {
      //只处理设置了路由元信息的组件
      from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : false;
      to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : true;
      if (savedPosition) {
        return savedPosition;
      }
    } else {
      from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : true;
      to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : false;
    }
  },
});
