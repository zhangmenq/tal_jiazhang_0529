/* eslint-disable */
export default [
  {
    path: "/activity",
    name: "Activity",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Index")
  },
  {
    path: "/activity/thanks-giving",
    name: "thanksGiving",
    meta: {
      title: "你的感恩贺卡"
    },
    component: () => import("@/pages/activities/thanks-giving/Index")
  },
  {
    path: "/activity/thanks-giving/making",
    name: "thanksGivingMaking",
    meta: {
      title: "你的感恩贺卡"
    },
    component: () => import("@/pages/activities/thanks-giving/MakingPage")
  },
  {
    path: "/activity/thanks-giving/result",
    name: "thanksGivingResult",
    meta: {
      title: "你的感恩贺卡"
    },
    component: () => import("@/pages/activities/thanks-giving/Result")
  },
  {
    path: "/activity/introduce",
    name: "introduce",
    meta: {
      title: "个性化海报"
    },
    component: () => import("@/pages/activities/introduce/Index")
  },
  {
    path: "/activity/introduce/login",
    name: "introduceLogin",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/introduce/Login")
  },
  {
    path: "/activity/introduce/my-recommended",
    name: "introduceMyRecommended",
    meta: {
      title: "我的推荐"
    },
    component: () => import("@/pages/activities/introduce/MyRecommended")
  },
  {
    path: "/activity/introduce/recommended-price",
    name: "introduceRecommendedPrize",
    meta: {
      title: "推荐有奖"
    },
    component: () => import("@/pages/activities/introduce/RecommendedPrize")
  },
  {
    path: "/activity/introduce/bad-network",
    name: "badNetwork",
    meta: {
      title: "网络不好"
    },
    component: () => import("@/pages/activities/introduce/BadNetwork")
  },
  {
    path: "/activity/short-course",
    name: "shortCourse",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/short-course/Index.vue")
  },
  {
    path: "/activity/reading-course",
    name: "shortReadingCourse",
    meta: {
      title: "阅读短期班"
    },
    component: () => import("@/pages/activities/short-course/Reading.vue")
  },
  {
    path: "/activity/reading-report/:userId",
    name: "readingReport",
    meta: {
      title: "结业证书"
    },
    component: () => import("@/pages/activities/short-course/Report.vue")
  },
  {
    path: "/pay/success/short",
    name: "paySuccess",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/short-course/PaySuccess")
  },
  {
    path: "/activity/import-student",
    name: "importStudent",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Import-student")
  },
  {
    path: "/activity/import-student2",
    name: "importStudent2",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Import-student2")
  },
  {
    path: "/activity/import-presell",
    name: "importPresell",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Import-presell")
  },
  {
    path: "/activity/import-planc/:channel_id",
    name: "importPlanc",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Import-planc")
  },
  {
    path: "/activity/import-plane/:channel_id",
    name: "importPlane",
    meta: {
      title: "VIPX"
    },
    component: () => import("@/pages/activities/Import-plane")
  },
  {
    path: "/activity/import-success",
    name: "importSuccess",
    meta: {
      title: "预约成功"
    },
    component: () => import("@/pages/activities/Import-success")
  },
  {
    path: "/activity/reserve-success",
    name: "reserveSuccess",
    meta: {
      title: "预约成功"
    },
    component: () => import("@/pages/activities/reserve/Reserve-success")
  },
  {
    path: "/activity/new-introduce",
    name: "newIntroduce",
    meta: {
      title: "邀请有奖"
    },
    component: () => import("@/pages/activities/introduce/Introduce")
  }
];
