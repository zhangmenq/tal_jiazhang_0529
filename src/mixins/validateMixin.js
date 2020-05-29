export default {
  data() {
    return {
      validMobile(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入手机号',
          };
        }
        if (value) {
          return {
            valid: /^(1)[0-9]{10}$/.test(value.trim()),
            msg: '请输入正确的手机号',
          };
        }
        return {
          valid: true,
          msg: '',
        };
      },
      validCode(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入验证码',
          };
        }
        return {
          valid: value.trim().length > 3 && value.trim().length < 7,
          msg: '请输入4-6位的验证码',
        };
      },
      validPassword(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入密码',
          };
        }
        return {
          valid: value.trim().length > 5 && value.trim().length < 19,
          msg: '请输入6-18位的密码',
        };
      },
      validEnglish(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入孩子的英文名',
          };
        }
        return {
          valid: /^[A-Za-z]{0,20}$/.test(value.trim()),
          msg: '英文名格式不正确 ',
        };
      },
      validChinese(value) {
        if (value.trim() === '') {
          return {
            valid: false,
            msg: '请输入孩子的中文名',
          };
        }
        return {
          valid: /^[\u4E00-\u9FA5]{0,6}$/.test(value.trim()),
          msg: '中文名格式不正确',
        };
      },
    };
  },
};
