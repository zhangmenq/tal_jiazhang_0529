/**
 * XesJSBridge v0.0.1
 * (c)  2018-01 tanqichao
 */
/* eslint-disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.XesJSBridge = factory());
}(this, (function () { 'use strict'
  var XesJSBridge = {
    init() {
      this.messageHandlers = {};
      this.ready(function() {
        XesJSBridge.handleRegister();
      });
    },
    ready(callback) {
      console.log('XesJSBridge Loaded');
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      } else {
        //register
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
          callback(WebViewJavascriptBridge)
        }, false);
        //register ios
        if (window.WVJBCallbacks) {
          return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        const WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
          document.documentElement.removeChild(WVJBIframe)
        }, 0);
      }
    },
    /**
     * @param registerHandler
     * @param h5注册native回调方法
     */
    registerHandler(handlerName, handler) {
      this.messageHandlers[handlerName] = handler;
    },
    callHandler(handName = null, param = null, callback = null) {
      console.log(handName, param, callback);
      window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler(handName, param, callback);
    },
    /**
     * @method handleRegister
     * @description 全局注册native调用js方法
     */
    handleRegister() {
      window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.registerHandler('h5RegisterHandler', (data, response) => {
        const result = (typeof data) === 'string' ? JSON.parse(data) : data;
        const handler = this.messageHandlers[result.handlerName];
        if (handler) {
          handler(result, response);
        } else {
          console.error('当前方法未注册！');
        }
      });
    },
    /**
     * @method getUserToken
     * @description 获取token
     * @param null
     * @return string
     */
    getUserToken(callback) {
      this.callHandler('getUserToken', null, (response) => { callback && callback(response); });
    },
    /**
     * @method getUserInfo
     * @description 获取User info
     * @param null
     * @return Object
     */
    getUserInfo(callback) {
      this.callHandler('getUserInfo', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method getUserDeviceInfo
     * @description 获取User device info
     * @param null
     * @return
     *  {
     *    hardware： "硬件",
     *    OS："操作系统" ,
     *    network："网络"
     *    other："版本号"
     *  }
     */
    getUserDeviceInfo(callback) {
      this.callHandler('getUserDeviceInfo', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method reportFeedback
     * @description 上报顶/踩
     * @param {state： 0踩 1顶 -1无}
     * @return null
     */
    reportFeedback(param) {
      this.callHandler('reportFeedback', param);
    },
    /**
     * @method reportArticleSuc
     * @description 上报文章加载成功
     * @param {state： 1 成功加载}
     * @return null
     */
    reportArticleSuc(param) {
      this.callHandler('reportArticleSuc', param);
    },
    /**
     * @method pushWindow
     * @description 打开新页面
     * @param
     *   title 设置页面标题
     *   name 设置跳转页面标识（来自服务端约定值）
     *   url 设置跳转页面URL
     *   data 设置额外参数（来自服务端约定）
     * @return null
     */
    pushWindow(param) {
      this.callHandler('openNativeView', param, () => {});
    },
    /**
     * @method closeWindow
     * @description 关闭当前页面
     * @param null-
     * @return null
     */
    closeWindow() {
      this.callHandler('closeWindow', null, () => {});
    },
    /**
     * @method getHomeworkDetail
     * @description 获取双师作业详情
     * @param null
     * @return { Object }
     */
    getHomeworkDetail(callback) {
      this.callHandler('getDTHomeworkDetail', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method selectAnswer
     * @description 单选题选择答案
     * @param
     *   answer: { string }
     * @return null
     */
    selectAnswer(param) {
      this.callHandler('selectAnswer', param, () => {});
    },
    /**
     * @method takePhoto
     * @description 拍照
     * @param null
     * @return 图片base64
     */
    takePhoto(callback) {
      this.callHandler('openTakepicture', null, (response) => {
        callback && callback(response);
      });
    },
    /**
     * @method getAnswerSheetData
     * @description 获取答题卡信息 - 双师/在线公用
     * @param null
     * @return { Object }
     */
    getAnswerSheetData(callback) {
      this.callHandler('getAnswerSheetData', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method getRoundNum
     * @description 在线刷题获取轮数
     * @param null
     * @return { Object }
     */
    getRoundNum(callback) {
      this.callHandler('getRoundNum', null, (response) => {
        callback && callback((Number(response) !== NaN && Number(response) > 0) ? Number(response) : 0);
      });
    },
    /**
     * @method uploadAnswer
     * @description 提交双师作业 - 双师/在线公用
     * @param
     *   url： 提交成功后跳转的url
     * @return { Object }
     */
    uploadAnswer(param) {
      this.callHandler('uploadAnswer', param, () => {});
    },
    /**
     * @method uploadBrushAnswer
     * @description 在线提交答案
     * @param
     *   url： 提交成功后跳转的url
     * @return { Object }
     */
    uploadBrushAnswer(param) {
      this.callHandler('uploadBrushAnswer', param, () => {});
    },
    /**
     * @method showConfirm
     * @description alert提示对话框
     * @param
     *   content： { string }
     *   buttonText: { string }
     * @return null
     */
    showConfirm(param) {
      this.callHandler('showAlert', param);
    },
    /**
     * @method checkAnswer
     * @description 双师 - 查看答案
     * @param null
     * @return null
     */
    checkAnswer() {
      this.callHandler('checkAnswer');
    },
    /**
     * @method showToastshowToast
     * @description toast提示
     * @param
     *   content： { string }
     * @return null
     */
    showToast(param) {
      this.callHandler('showToast', param);
    },
    /**
     * @method knownSelect
     * @description 双师做题 - 是否看懂
     * @param { string }
     * @return { Object }
     */
    knownSelect(str, callback) {
      this.callHandler('knownSelect', str, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      })
    },
    /**
     * @method openPictureBroswer
     * @description 点击图片查看
     * @param
     *   '' base64格式 传空
     *   url 如果是网络图片 传url
     * @return {str} 取消/重拍回调
     */
    openPictureBroswer(imgUrl, callback) {
      this.callHandler('openPictureBroswer', imgUrl, (response) => {
        callback && callback(response);
      })
    },
    /**
     * @method showLoading
     * @description loading show
     * @param
     *   show 1 显示 0 关闭
     *   msg { string }
     * @return null
     */
    showLoading(param, callback) {
      this.callHandler('showLoadingView', Object.assign({
        show: 1,
        msg: '',
      }, param), (response) => {
        callback && callback(response);
      })
    },
    /**
     * @method hideLoading
     * @description loading close
     * @param
     *   show 1 显示 0 关闭
     *   msg { string }
     * @return null
     */
    hideLoading(param, response, callback) {
      this.callHandler('showLoadingView', Object.assign({
        show: 0,
        msg: '',
      }, param), (response) => {
        callback && callback(response);
      })
    },
    /**
     * @method getSubmitResult
     * @description 在线作业提交成功页获取数据
     * @param null
     * @return { Object }
     */
    getSubmitResult(callback) {
      this.callHandler('getSubmitResult', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      })
    },
    /**
     * @method selectItemInDatika
     * @description 点击序号跳转答题详情 - 答题卡公用
     * @param
     *   pos: 题目的index
     * @return null
     */
    selectItemInDatika(param) {
      this.callHandler('selectItemInDatika', param, () => {});
    },
    /**
     * @method toNextRound
     * @description 继续下一轮
     * @param
     * @return null
     */
    toNextRound(param) {
      this.callHandler('toNextRound', param, () => {})
    },
    /**
     * @method selectItemInDatika
     * @description 点击序号跳转答题详情 - 在线待查阅、待订正、已完成
     *   pos: 题目的index
     * @return null
     */
    selectItemInDaichayue(value) {
      const param = value || '';
      this.callHandler('selectItemInDaichayue', param, () => {});
    },
    /**
     * @method playAudio
     * @description 语音播放开始、暂停
     *   play: 0/1
     *   url:
     * @return null
     */
    playAudio(param, callback) {
      this.callHandler('playAudio', param, () => { callback && callback(); });
    },
    /**
     * @method tokeninvalid
     * @description token失效
     */
    tokeninvalid() {
      this.callHandler('tokeninvalid');
    },
    /**
     * @method setTitle
     * @description 设置标题
     *   title: must string
     */
    setTitle(title) {
      this.callHandler('setTitle', title);
    },
    /**
     * @method isNetAvailable
     * @description 判断网络状况
     * @return true/false
     */
    isNetAvailable(callback) {
      this.callHandler('isNetAvailable', null, (responsed) => {
        if ((typeof responsed) === 'string' && responsed === 'true') {
          callback && callback(true);
        } else if ((typeof responsed) === 'string' && responsed === 'false') {
          callback && callback(false);
        } else {
          callback && callback(responsed);
        }
      });
    },
    /**
     * @method Monitor
     * @description 客户端埋点
     * @param
     * {
     *   id: '', 事件ID
     *   event: '', 事件类型
     *   describe: '', 事件描述
     * }
     */
    Monitor(param) {
      // console.log('神策打点：', param);
      this.callHandler('Monitor', param);
    },
    /**
     * @method getVersion
     * @description 获取客户端版本号
     */
    getVersion(callback) {
      this.callHandler('getVersion', null, (response) => { callback && callback(response); });
    },
    /**
     * @method fetchData
     * @description 获取培优课程详情
     */
    fetchData(callback) {
      this.callHandler('fetchData', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method networkType
     * @description 检测网络类型
     */
    networkType(callback) {
      this.callHandler('networkType', null, (response) => { callback && callback(response); });
    },
    /**
     * @method dialog
     * @description 对话框
     */
    dialog(config) {
      this.callHandler('dialog', config);
    },
    /**
     * @method  loudspeaker
     * @description
     *   play: 0开启扬声器/1开启听筒
     * @return null
     */
    loudspeaker(param) {
      this.callHandler('loudspeaker', param);
    },
    /**
     * @method cannotGoBack
     * @description 跳转原生页面不在返回H5
     * @return null
     */
    cannotGoBack() {
      this.callHandler('cannotGoBack');
    },
    /**
     * @method postNotification
     * @description 入学测试完成
     * @param
     *    name 设置跳转页面标识
     *    data{} 设置额外参数
     * @return null
     */
    postNotification(param) {
      this.callHandler('postNotification', param, () => {});
    },
    /**
     * @method setShareContent
     * @description  分享通用按钮
     * @param
      {
        state: 0 不显示 1显示  必传
        shareTitle: 标题
        shareImage: 图片
        shareContent: 描述
        shareURL: 分享链接
        shareTypes: [0,1,2,3]
          0：QQ
          1：微信
          2：微信朋友圈
          3：复制
        }
     * @return null
     */
    setShareContent(param) {
      this.callHandler('setShareContent', param);
    },
    /**
     * @method setHandoutShareContent
     * @description  讲义下载
     * @param
     {
         state: 0 不显示 1显示  是否显示下载按钮 可选
         fileName:  文件名  可选
         fileURL: 文件下载URL 必传
         fileType:  文件类型 可选
         fileSize:  文件大小 可选
         }
     * @return null
     */
    setHandoutShareContent(param) {
      this.callHandler('setHandoutShareContent', param);
    },
    /**
     * @method guestMode
     * @description  游客登录
     * @param
      {
         state: 0 游客 1 正常
       }
     * @return null
     */
    getGuestMode(callback) {
      this.callHandler('getGuestMode', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method openLoginVCOnGuestMode
     * @description  游客登录调用登录页方法
     * @param
      {
         state: 0 游客 1 正常
       }
     * @return null
     */
    openLoginVCOnGuestMode(callback) {
      this.callHandler('openLoginVCOnGuestMode', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method autoGoBack
     * @description 是否关闭
     * @param
      {
        state 0 表示不显示关闭按钮   1 表示显示关闭按钮
       }
     * @return null
     */
    autoGoBack(callback) {
      this.callHandler('autoGoBack', param);
    },
    /**
     * @method getHaveBindCellphoneIntent
     * @description 是否绑定手机，并自动跳转到绑定手机页面
     * @param
      {
        state 0 未绑定   1 已绑定
       }
     * @return null
     */
    getHaveBindCellphoneIntent(callback){
      this.callHandler('getHaveBindCellphoneIntent', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @method getHaveBindCellphone
     * @description 是否绑定手机
     * @param
      {
        state 0 未绑定   1 已绑定
       }
     * @return null
     */
    getHaveBindCellphone(callback){
      this.callHandler('getHaveBindCellphone',null,  (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
    /**
     * @description 预览图片
     * @param
      {
        state 0 未绑定   1 已绑定
       }
     */
    scannerImg(param){
      this.callHandler('scannerImg',param);
    },
     /**
     * @method getUserLanguage
     * @description  获取语言方式
     * @param
      {
         state: 0 系统默认 1简体中文 2 繁体
       }
     * @return null
     */
    getUserLanguage(callback) {
      this.callHandler('getUserLanguage', null, (response) => {
        callback && callback((typeof response) === 'string' ? JSON.parse(response) : response);
      });
    },
  };
  XesJSBridge.init();
  return XesJSBridge;
})));
