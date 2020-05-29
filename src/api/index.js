import {
  isEmpty,
} from 'lodash';
import axios from '@/utils/http';
import apiConfig from '@/config';
import {
  getItem,
} from '@/utils/localStorage.js';
import getOrigin from '@/utils/origin';
import {
  isMidCourse,
} from '@/utils/index.js';
import store from '../store';

const host = apiConfig.host;
/**
 * 获取所有年纪
 */
export const getAllGrades = () => {
  const url = `${host}/classroom/classrooms/grades/all`;
  return axios.get(url);
};
/**
 * 培优用户登录
 */
export const getPyToken = (uid, cityCode, type) => {
  const url = `${host}peiyou/signin`;
  return axios.post(url, {
    uid: uid,
    city_code: cityCode,
    type: type,
    client_id: apiConfig.client_id,
  });
};
/**
 * 获取培优用户信息
 */
export const pyLogin = (uid) => {
  const url = `${host}peiyou/login?uid=${uid}`;
  return axios.get(url);
};

/**
 * 培优绑定手机号
 */
export const mobileBind = (uid, mobile, code) => {
  const url = `${host}/peiyou/mobile-bind`;
  return axios.post(url, {
    uid: uid,
    mobile: mobile,
    code: code,
  });
};
/**
 * 培优购买课程数
 */
export const classroomCnt = (uid, mobile) => {
  const url = `${host}/peiyou/classroom-cnt?uid=${uid}&mobile=${mobile}`;
  return axios.get(url);
};
/**
 * 培优修改手机号
 */
export const mobileModify = (mobile, code) => {
  const url = `${host}/student/mobile-modify`;
  return axios.put(url, {
    mobile: mobile,
    code: code,
  });
};
/**
 * 用户注册
 */
export const register = (data) => {
  const url = `${host}student/students`;
  return axios.post(url, data);
};
/**
 * 网校用户注册
 */
export const wxRegister = (data) => {
  const url = `${host}wangxiao/register`;
  return axios.post(url, data);
};
/**
 * 网校token转换
 */
export const getWxUserInfo = (channelId) => {
  const data = {
    channel_id: channelId,
    client_id: apiConfig.client_id,
    client_secret: apiConfig.client_secret,
  };
  const url = `${host}wangxiao/userInfo`;
  return axios.post(url, data);
};
/**
 * 用户登陆
 */
export const login = (data) => {
  const url = `${host}tal/login/password`;
  return axios.post(url, data);
};
/**
 * 获取用户的个人信息
 */
export const getUserInfo = () => {
  const url = `${host}/user/users/me`;
  return axios.get(url).then((res) => {
    if (res.data.mobile) {
      const ism = `${res.data.mobile.substr(0, 3)}****${res.data.mobile.substr(7)}`;
      res.data.ism = ism;
    }
    store.commit('UPDATE_USER_INFO', {
      userInfo: res.data,
    });
  });
};
/**
 * 发送验证码
 */
export const sendSmsCode = (phone, type) => {
  const url = `${host}tal/smscode`;
  const data = {
    phone: phone,
    code_type: type,
  };
  return axios.post(url, data);
};
/**
 * 更新学生信息
 */
export const updateStudent = (data) => {
  const url = `${host}student/students`;
  return axios.put(url, data);
};
/**
 * 获取首页banner图列表
 */
export const getBannerList = () => {
  // console.log('here', store.state.bannerList);
  if (isEmpty(store.state.bannerList)) {
    const url = `${host}advertisement/banners?position=banner_wechat`;
    return axios.get(url).then((res) => {
      if (res.error_code === 0) {
        store.commit('GET_BANNER_LIST', {
          bannerList: res.data,
        });
      }
    });
  }
  return Promise.resolve(store.state.bannerList);
};
/**
 * 教师详情
 */
export const getTeacherInfo = (teacherId) => {
  const url = `${host}/teacher/teachers/${teacherId}`;
  if (!isEmpty(store.state.teacherInfo) &&
    store.state.teacherInfo.id === teacherId) {
    return Promise.resolve();
  }
  return axios.get(url).then((res) => {
    store.commit('UPDATE_TEACHER_INFO', {
      teacherInfo: res.data,
    });
  });
};
/**
 * 课程详情
 */
export const getCourseInfo = (courseId) => {
  const url = `${host}/course/courses/${courseId}`;
  if (!isEmpty(store.state.courseInfo) &&
    store.state.courseInfo.id === courseId) {
    return Promise.resolve();
  }
  return axios.get(url).then((res) => {
    const data = res.data;
    const isMid = isMidCourse(res.data.start_at, res.server_time);
    data.is_mid = isMid;
    store.commit('UPDATE_COURSE_INFO', {
      courseInfo: data,
    });
  });
};
// 课程包详情
export const getPackageInfo = (packageId) => {
  const url = `${host}/course/packages/${packageId}`;
  if (!isEmpty(store.state.packageInfo) &&
    store.state.packageInfo.id === packageId) {
    return Promise.resolve();
  }
  return axios.get(url).then((res) => {
    const data = res.data;
    data.is_mid = isMidCourse(res.data.start_at, res.server_time);
    store.commit('UPDATE_PACKAGE_INFO', {
      packageInfo: data,
    });
  });
};
//判断课程是否已经购买
export const isOrdered = (id, type = 'course') => {
  let url = '';
  if (type === 'course' || type === 'binding') {
    url = `${host}/course/courses/${id}/book-status`;
  } else if (type === 'package') {
    url = `${host}/course/packages/${id}/book-status`;
  }
  return axios.get(url);
};

//课程清单
export const getCourseLists = (data) => {
  let url = `${host}/course/courses/${data.id}/orderlist?`;
  if (data.order_id) {
    url += `order_id=${data.order_id}`;
  } else {
    url += `type=${data.type}&week=${data.week}&time=${data.time}&teacher_id=${data.teacher_id}`;
    if (data.date) {
      url += `&date=${data.date}`;
    }
  }
  return axios.get(url);
};

// 获取教材详情
export const getBookInfo = (bookId) => {
  const url = `${host}book/books/${bookId}`;
  if (!isEmpty(store.state.bookInfo) && store.state.bookInfo.id === bookId) {
    return Promise.resolve();
  }
  return axios.get(url).then((res) => {
    store.commit('UPDATE_BOOK_INFO', {
      bookInfo: res.data,
    });
  });
};

//获取插班报课程的具体节次和价格
export const getMidCourse = (courseId, week, time) => {
  const url = `${host}course/courses/${courseId}/price?week=${week}&time=${time}`;
  return axios.get(url);
};

/**
 * 下单部分
 */

//获取学生收货地址
export const getAddress = () => {
  const url = `${host}student/students/address`;
  return axios.get(url);
};

//保存学生收货地址
export const setAddress = (data) => {
  const url = `${host}student/students/address`;
  return axios.put(url, data);
};

//更新学生收货地址
export const updateAddress = (orderId, data) => {
  const url = `${host}student/logistics/${orderId}/update`;
  return axios.put(url, data);
};

//推荐老师
export const getSuggestTeacher = (id, type, week, time) => {
  let url = `${host}teacher/teacher-time/teacher?week=${week}&time=${time}&`;
  if (Number(type) === 2) {
    url += `package_id=${id}`;
  } else {
    url += `course_id=${id}`;
  }
  return axios.get(url);
};
//获取微信支付请求所需要的参数
export const getWxPayParams = (orderId) => {
  const url = `${host}order/orders/${orderId}/wxpay-public`;
  return axios.post(url, {
    openid: getItem('openid') || '',
  });
};
export const getAliPayParams = (orderId) => {
  const url = `${host}order/orders/${orderId}/alipay-h5`;
  return axios.post(url, {});
};

// 微信H5 支付
export const wxpayH5 = (orderId) => {
  const url = `${host}order/orders/${orderId}/wxpay-h5`;
  return axios.post(url, {});
};
//订单详情
export const orderDetail = (orderId) => {
  const url = `${host}/order/orders/${orderId}`;
  return axios.get(url);
};
//支付宝轮询状态
export const getOrderStatus = (orderId) => {
  const url = `${host}order/orders/${orderId}/status`;
  return axios.get(url);
};

// 发送验证码
export const smsCode = (mobile, type) => {
  const url = `${host}system/common/sms-code`;
  return axios.post(url, {
    mobile: mobile,
    type: type,
  });
};

//辅修课课表
export const minorLists = (minorId) => {
  const url = `${host}/classroom/schedules/${minorId}/minors`;
  return axios.get(url);
};
//辅修课课堂报告
export const getMinorReport = (minorId, isSingle, roomId) => {
  const url = `${host}/classroom/schedules/${minorId}/report?single_report=${isSingle}&room_id=${roomId}`;
  return axios.get(url);
};
//辅修课排名 /classroom/schedules/{id}/ranking
export const getMinorRanking = (scheduleId) => {
  const url = `${host}/classroom/schedules/ranking?room_id=${scheduleId}`;
  return axios.get(url);
};

// 微信jssdk的验证
export const validJssdk = (uri) => {
  const url = `${host}/wechat/jssdk`;
  return axios.post(url, {
    local_uri: uri,
  });
};

/** 入学测试记录 */
export const getTestRecord = () => {
  const url = `${host}/student/placement-tests`;
  return axios.get(url);
};
/**
 * 通过手机号判断用户是否存在
 */
export const checkUserExists = (mobile, realname = '') => {
  const url = `${host}/student/exist`;
  return axios.post(url, {
    mobile: mobile,
    realname: realname,
  });
};

/**
 * 数据埋点
 */
export const collectData = (type) => {
  const url = `${host}/system/bury-point`;
  return axios.post(url, {
    type: type,
    from: 1,
  });
};
// 获取老师反馈
export const getFeedback = (scheduleId) => {
  const url = `${host}/classroom/schedules/${scheduleId}/feedback`;
  return axios.get(url);
};
// 课节详情
export const getSchedulesInfo = (scheduleId) => {
  const url = `${host}/classroom/schedules/${scheduleId}`;
  return axios.get(url);
};
// 课程目标
export const getAims = (scheduleId) => {
  const url = `${host}/classroom/schedule/${scheduleId}/target`;
  return axios.get(url);
};
// 循环测报告
export const getProgressTest = (scheduleId, type) => {
  const url = `${host}/classroom/schedule/${scheduleId}/he-report?type=${type}`;
  return axios.get(url);
};

// 培优用户信息
export const getPyInfo = (stuId) => {
  const url = `${host}/peiyou/user-info?stuId=${stuId}`;
  return axios.get(url);
};

// 获取续报订单
export const getReorder = () => {
  const url = `${host}order/orders/reorder`;
  return axios.get(url);
};

// 老师详情新
export const getTeacherDetails = (teacherId) => {
  const url = `${host}teacher/teacher/detail/${teacherId}`;
  return axios.get(url);
};

// 找老师
export const getTeachers = (page, sex, teachingAge, teams, name) => {
  const url = `${host}teacher/teachers?page=${page}&sex=${sex}&teaching_age=${teachingAge}&teams=${teams}&name=${name}`;
  return axios.get(url);
};

// 关注/取消关注老师
export const setFavorite = (data) => {
  const url = `${host}student/attention`;
  return axios.post(url, data);
};

// 关注的所有老师
export const getFavorite = (page) => {
  const url = `${host}student/attention-teachers?page=${page}`;
  return axios.get(url);
};

// 查看物流
export const getLogistics = (orderId, bookId) => {
  const url = `${host}logistics/info-lists?order_book_id=${orderId}&book_id=${bookId}`;
  return axios.get(url);
};
// 查看物流详细
export const getLogisticsDetails = (orderId) => {
  const url = `${host}logistics/info/${orderId}/context`;
  return axios.get(url);
};
// 物流退回上传图片
export const setRefundImage = (orderId, data) => {
  const url = `${host}logistics/refund/${orderId}/image`;
  return axios.post(url, data);
};
// 物流退回信息提交
export const setRefundInfo = (orderId, data) => {
  const url = `${host}logistics/refund/${orderId}/no`;
  return axios.post(url, data);
};
// 获取订单回退详细
export const getRefundInfoDetails = (refundId) => {
  const url = `${host}logistics/info/${refundId}/refund`;
  return axios.get(url);
};
// 获取收货地址
export const getLogisticsAddress = (id) => {
  const url = `${host}logistics/info/${id}/address`;
  return axios.get(url);
};
// 保存收货地址
export const saveLogisticsAddress = (data) => {
  const url = `${host}logistics/students/address`;
  return axios.post(url, data);
};
// 保存单条收货地址
export const saveSingleLogisticsAddress = (data, logisticsId) => {
  const url = `${host}logistics/students/${logisticsId}/address-info`;
  return axios.post(url, data);
};
// 查看是否有报告
export const getReport = (stuId, type) => {
  let url = '';
  if (type === 1) { // 获取个人测试报告
    url = `${host}/stage-tests/private?student_id=${stuId}`;
  } else {
    url = `${host}/stage-tests/composite?student_id=${stuId}`;
  }
  return axios.get(url);
};
// 我的报告
export const getMyReport = () => {
  const url = `${host}student/reports`;
  return axios.get(url);
};

// 我的报告 春季阶段测报告
export const getSpringReport = (activity) => {
  const url = `${host}/stage-tests?activity=${activity}`;
  return axios.get(url);
};
// 我的报告-star测评报告
export const getStarTestReport = (studentId) => {
  const url = `${host}star-test/star-result?student_id=${studentId}`;
  return axios.get(url);
};

// star测评数据统计
export const getStarCollectData = (data) => {
  const url = `${host}/star-test/collect-data`;
  return axios.post(url, data);
};

// 保存学生收货地址
export const saveAddress = (data, addressId = 0) => {
  let url = `${host}/student/students/address-store`;
  if (addressId > 0) {
    url = `${host}/student/students/${addressId}/address`;
  }
  return axios.put(url, data);
};

// 获取收货地址列表
export const getAddressList = () => {
  const url = `${host}/student/students/address-list`;
  return axios.get(url);
};

// 获取收获地址详情
export const getAddressInfo = (id) => {
  const url = `${host}/student/students/${id}/address-info`;
  return axios.get(url);
};
/**
 * 获取单独购买的书本信息
 */
export const getBook = (orderid) => {
  const url = `${host}/order/orders/book?order_id=${orderid}`;
  return axios.get(url);
};
//单独购买教材提交订单
export const setBookOrder = (data) => {
  const url = `${host}order/orders/book/store`;
  return axios.post(url, data);
};
//续报数据埋点
export const setPointLog = (eventType, pageRouter, dataSource, msgType = '') => {
  const url = `${host}order/reorder/point/log`;
  let dataOrigin = 4; //手机默认浏览器
  if (getOrigin() === 'peiyou') {
    dataOrigin = 3;
  } else if (getOrigin() === 'wechat') {
    dataOrigin = 2;
  }
  const data = {
    event_type: eventType,
    data_origin: dataOrigin,
    router: pageRouter,
    data_source: dataSource,
    msg_type: msgType,
  };
  return axios.post(url, data);
};
//通用数据埋点
export const setApilog = (data) => {
  const url = `${host}statistics/apilog/save`;
  let dataOrigin = 4; //手机默认浏览器
  if (getOrigin() === 'peiyou') {
    dataOrigin = 3;
  } else if (getOrigin() === 'wechat') {
    dataOrigin = 2;
  }
  data.data_origin = dataOrigin;
  return axios.post(url, data);
};
//推送埋点
export const setMsgType = (msgType, scheduleId) => {
  const url = `${host}statistics/visit/save`;
  const data = {
    msg_type: msgType,
    schedule_id: scheduleId,
  };
  return axios.post(url, data);
};
// 确认是否有需要购买的教材
export const checkBook = () => {
  const url = `${host}order/orders/check-book`;
  return axios.get(url);
};
// 微信自动登录接口
export const iswxlogin = (data) => {
  const url = `${host}wechat/iswxlogin`;
  return axios.post(url, data);
};
/**
 * tal注册
 * data:{
 *  phone 手机号
 *  password 密码
 *  sms_code 验证码
 * }
 */
export const talRegister = (data) => {
  const url = `${host}tal/register`;
  return axios.post(url, data);
};
/**
 * 新转介绍注册、登录
 * data:{
 *  mobile 手机号
 *  code 验证码
 *  name 密码
 * }
 */
export const introduceRegister = (data) => {
  const url = `${host}new-introduce/create-student`;
  return axios.post(url, data);
};
/**
 * 领取奖学金
 * data:{
 *  activity_id 活动id
 *  version_id 活动版本id
 *  invite_student_id 邀请人ID
 * }
 */
export const getMoney = (data) => {
  const url = `${host}new-introduce`;
  return axios.post(url, data);
};
/**
 * 获取领取列表
 * data:{
 *  activity_id 活动id
 *  version_id 活动版本id
 * }
 */
export const getMoneyList = (data) => {
  const url = `${host}new-introduce?activity_id=${data.activity_id}&version_id=${data.version_id}`;
  return axios.get(url);
};
/**
 * 确认是否可以领取
 * data:{
 *  activity_id 活动id
 *  version_id 活动版本id
 * }
 */
export const checkIntroduceAuth = (data) => {
  const url = `${host}new-introduce/check-auth?activity_id=${data.activity_id}&version_id=${data.version_id}`;
  return axios.get(url);
};
/**
 * 获取转介绍个人海报
 * data:{
 *  activity_id 活动id
 *  version_id 活动版本id
 * }
 */
export const getPoster = (data) => {
  const url = `${host}new-introduce/poster?activity_id=${data.activity_id}&version_id=${data.version_id}`;
  return axios.get(url);
};
/**
 * 获取入学测地址
 */
export const getQuizUrl = (gradeId, levelId) => {
  const data = {
    grade_id: gradeId,
    level_id: levelId,
  };
  const url = `${host}content/papers/get-placement-test-url`;
  return axios.post(url, data);
};
