/**
 * 全局使用的工具方法
 */
// import apiConfig from '@/config';
import { getQuizUrl } from '@/api';

//秒数转化为时间
export const second2time = (time) => {
  const h = Math.floor(time / 3600);
  const min = Math.floor((time % 3600) / 60);
  const m = min >= 10 ? min : `0${min}`;
  return `${h}:${m}`;
};

//检测用户是否完善资料
export const isComplete = userInfo => userInfo.realname && userInfo.enname && userInfo.grade_id;

//检测课程是否为插班报
export const isMidCourse = (startAt, serverTime) => {
  const start = (new Date(startAt.replace(/-/g, '/'))).getTime();
  return start < serverTime * 1000;
};
//object转为字符串
/* eslint-disable */
export const obj2str = (obj) => {
  if(typeof obj === 'string' ) {
    return obj;
  }
  let str = '';
  for (const i in obj) {
    str += `&${i}=${obj[i]}`;
  }
  return str.substring(1);
};
//
export const validMobile = (mobile) => {
  const str = Number(mobile.trim());
  return /1\d{10}/.test(str);
};
//入学测试
export const goTest = (grade_id, level_id) => {
  getQuizUrl(grade_id, level_id).then((res) => {
    if (res.error_code === 0) {
      location.href = res.data.placementTestUrl;
    } else {
      this.$vux.toast.show({
        type: 'text',
        text: res.error_message,
        time: 1500,
        width: '13rem',
      });
    }
  })
};
/** 判断文件类型 图片or视频 */
export const getFileType = (fileName) => {
  if (!/\./.test(fileName)) {
    return false;
  }
  // const videoExt = ['3gp', 'asf', 'avi', 'dat', 'dv', 'flv', 'f4v', 'm2t', 'm3u8', 'm4v', 'mj2',
  //   'mjpeg', 'mkv', 'mov', 'mp4', 'mpe', 'mpg', 'mpeg', 'mts', 'ogg', 'qt', 'rm', 'rmvb', 'swf',
  //   'ts', 'vob', 'wmv', 'webm'];
  const videoExt = ['MP4', 'AVI', '3GP', 'WMV', 'FLV', 'MOV'];
  const imgExt = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
  const audioExt = ['aac', 'ac3', 'acm', 'amr', 'ape', 'caf', 'flac', 'm4a', 'mp3', 'ra', 'wav', 'wma'];
  const ext = fileName.split('.')[fileName.split('.').length - 1];
  if (videoExt.indexOf(ext.toUpperCase()) > -1) {
    return 'video';
  } else if (audioExt.indexOf(ext) > -1) {
    return 'audio';
  } else if (imgExt.indexOf(ext) > -1) {
    return 'image';
  }
  return false;
};
