export default {
  data() {
    return {
      videoBtn: true,
      uploader: '',
      uploadInfo: [],
      videoCover: '',
      videoUrl: '',
      videoWidth: '',
      videoHeight: '',
    };
  },
  methods: {
    errorrMsg(msg) { // 错误提示信息
      this.$vux.toast.show({
        time: 3000,
        type: 'warn',
        isShowMask: true,
        position: 'middle',
        text: msg,
        width: '17.6em',
      });
    },
    getAuth() {
      return this.$http.get(`${this.apiConfig.host}system/aliyun-upload?fname=${this.options.fname}&title=${this.options.title}`).then((res) => {
        this.authOpt = res.data;
      });
    },
    startUploadVideo() {
      this.getAuth().then(() => {
        this.initUploader();
        const userData = {
          Vod: {
            UserData: {
              IsShowWaterMark: true,
              Priority: 5,
            },
          },
        };
        this.uploader.addFile(this.file, null, null, null, JSON.stringify(userData));
        this.uploader.startUpload();
      });
    },
    getPlayAuth(videoId) {
      const url = `${this.apiConfig.host}system/aliyun-play-info?video_id=${videoId}`;
      this.$http.get(url).then((res) => {
        if (res.error_code === 10208) {
          this.errorrMsg('视频正在转码中,请稍候');
          return false;
        } else if (res.error_code === 0) {
          const resData = res.data.PlayInfoList;
          this.videoBtn = false;
          this.videoCover = res.data.VideoBase.CoverURL;
          this.videoUrl = resData.PlayInfo[0].PlayURL;
          this.videoWidth = resData.PlayInfo[0].Width;
          this.videoHeight = resData.PlayInfo[0].Height;
          // const vid = document.getElementById('videoPlayer');
          // vid.play();
        }
      });
    },
    /* eslint-disable */
    initUploader() {
      this.uploader = new window.AliyunUpload.Vod({
        partSize: 1048576,
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        'onUploadstarted': (uploadInfo) => {
          console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
          //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          this.uploader.setUploadAuthAndAddress(uploadInfo, this.authOpt.UploadAuth, this.authOpt.UploadAddress, this.authOpt.VideoId);
          //上传方式2
          // uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret,secretToken);
        },
        'onUploadSucceed': (uploadInfo) => {
          console.log(uploadInfo)
          this.video_id = uploadInfo.videoId;
          this.videoLoading = false;
          this.videoBtn = true;
          this.videoCover = '';
        },
        // 文件上传失败
        'onUploadFailed': function (uploadInfo, code, message) {
          console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
        },
        // 文件上传进度，单位：字节
        'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
          console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
        },
        'onUploadEnd': (uploadInfo) => {
          console.log("onUploadEnd: uploaded all the files");
        },
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    const head = document.getElementsByTagName('head')[0];
    const script_01 = document.createElement('script');
    script_01.src = 'https://dist.vipx.com/libs/aliyun/aliyun-oss-sdk-5.2.0.min.js';
    head.appendChild(script_01);
    const script_02 = document.createElement('script');
    script_02.src = 'https://dist.vipx.com/libs/aliyun/aliyun-upload-sdk-1.4.0.min.js';
    head.appendChild(script_02);
    next();
  },
};
