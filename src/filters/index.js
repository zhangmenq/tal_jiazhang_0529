import moment from 'moment';

export const formatMoney = (money) => {
  const theMoney = Number(money);
  return (theMoney / 100).toFixed(2);
};

export const formatMoneyInt = (money) => {
  const theMoney = Number(money);
  return theMoney >= 100
    ? (theMoney / 100).toFixed(0)
    : (theMoney / 100).toFixed(2);
};

export const formatDate = (value, formatString) => {
  formatString = formatString || 'YYYY.MM.DD';
  return moment(value).format(formatString);
};

export const formatMobile = mobile => mobile.replace(/^(\d{3})(\d{4})(\d{4})$/g, '$1****$3');

export const format2CountDown = (leftTime) => {
  const d = parseInt(leftTime / (24 * 60 * 60), 10);
  const h = parseInt((leftTime / (60 * 60)) % 24, 10);
  let m = parseInt((leftTime / 60) % 60, 10);
  let s = parseInt(leftTime % 60, 10);
  m = m >= 10 ? m : `0${m}`;
  s = s >= 10 ? s : `0${s}`;
  if (d > 0) {
    return `${d}天${h}小时${m}分${s}秒`;
  }
  return `${h}小时${m}分${s}秒`;
};

export const formatWeek = (week) => {
  const weekData = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' };
  return weekData[`${week}`];
};
