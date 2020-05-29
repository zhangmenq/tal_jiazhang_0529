import * as types from './mutation-types';

export default {
  updateDirection({ state, commit }, data) {
    commit(types.UPDATE_DIRECTION, data);
  },
  updateLoading({ state, commit }, data) {
    commit(types.UPDATE_LOADING, data);
  },
  updateUserInfo({ state, commit }, data) {
    commit(types.UPDATE_USER_INFO, data);
  },
  updateDateTime({ state, commit }, data) {
    commit(types.UPDATE_DATE_TIME, data);
  },
  updateTeacherInfo({ state, commit }, data) {
    commit(types.UPDATE_TEACHER_INFO, data);
  },
  updateCourseInfo({ state, commit }, data) {
    commit(types.UPDATE_COURSE_INFO, data);
  },
  updatePackageInfo({ state, commit }, data) {
    commit(types.UPDATE_PACKAGE_INFO, data);
  },
  updateBookInfo({ state, commit }, data) {
    commit(types.UPDATE_BOOK_INFO, data);
  },
};
