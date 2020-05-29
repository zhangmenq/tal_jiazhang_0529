export default [
  {
    path: '/stage/test-report',
    name: 'stageTest',
    meta: {
      title: '我的报告',
    },
    component: () => import('@/pages/mine/stage/TestReport'),
  },
];
