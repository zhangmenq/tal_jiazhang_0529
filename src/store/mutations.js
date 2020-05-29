import moment from 'moment';
import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.UPDATE_DIRECTION](state, payload) {
    state.direction = payload.direction;
  },
  [types.UPDATE_LOADING](state, payload) {
    state.loading = payload.loading;
  },
  [types.UPDATE_USER_INFO](state, payload) {
    state.userInfo = payload.userInfo;
  },
  [types.UPDATE_DATE_TIME](state, payload) {
    state.dateTime = moment(payload.dateTime * 1000).format('YYYY.MM.DD HH:mm:ss');
  },
  [types.UPDATE_TEACHER_INFO](state, payload) {
    state.teacherInfo = payload.teacherInfo;
  },
  [types.UPDATE_COURSE_INFO](state, payload) {
    state.courseInfo = payload.courseInfo;
  },
  [types.UPDATE_PACKAGE_INFO](state, payload) {
    state.packageInfo = payload.packageInfo;
  },
  [types.UPDATE_BOOK_INFO](state, payload) {
    state.bookInfo = payload.bookInfo;
  },
  [types.GET_BANNER_LIST](state, payload) {
    Vue.set(state, 'bannerList', payload.bannerList);
    // state.bannerList = payload.bannerList;
  },
};
