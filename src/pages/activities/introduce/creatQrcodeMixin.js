const QRious = require('qrious');

export default {
  data() {
    return {
      qrcodeUrl: '',
      qrcodeSize: 150,
    };
  },
  methods: {
    createQrcode() { // 生成二维码
      const host = `http://${window.location.host}`;
      const introduceId = this.$store.state.userInfo.id;
      const qr = new QRious({
        element: 'canvas',
        size: this.qrcodeSize,
        value: `${host}/activity?id=7&channel=8&introduce_id=${introduceId}`,
      });
      this.qrcodeUrl = qr.toDataURL();
    },
  },
};
