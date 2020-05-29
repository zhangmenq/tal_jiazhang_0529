<template>
  <div class="send-back">
    <div v-if="!loadingData">
      <div v-if="bookOrder === 1 && sendbackStatus=== 1" class="refund-text">
      <i class="icon"></i>{{refundText}}</div>
      <div class="flow-path">
        <div class="flow-list first_list" :class="{'current': sendbackStatus >= 1}">
          <div class="flow-content">
            <span class="flow-state"></span>
            <div class="flow-title">填写申请</div>
          </div>
        </div>
        <div class="flow-list" :class="[{'current': sendbackStatus >= 2 && isImagePass},{'error-current':sendbackStatus >= 2 && !isImagePass}]">
          <div class="flow-line"></div>
          <div class="flow-content">
            <span class="flow-state"></span>
            <div class="flow-title">等待确认</div>
          </div>
        </div>
        <div class="flow-list" :class="{'current': sendbackStatus >= 3}">
          <div class="flow-line"></div>
          <div class="flow-content">
            <span class="flow-state"></span>
            <div class="flow-title">寄回商品</div>
          </div>
        </div>
        <div class="flow-list " :class="{'current': sendbackStatus === 4 && refundsStatus === 1}">
          <div class="flow-line"></div>
          <div class="flow-content">
            <span class="flow-state"></span>
            <div class="flow-title">签收确认</div>
          </div>
        </div>
      </div>
      <div class="basic-box" v-if="sendbackStatus == 1">
        <h3>上传凭证<span>（最多可上传3张）</span></h3>
        <div class="uploadFun">
          <ul>
            <li v-for="(item, index) in imageList" :key='index'>
              <span @click="imageDel(index, 1)">&nbsp;</span>
              <div class="overflow-img" @click="clickImg($event,index,item.file.src)">
                <img :src="item.file.src" alt="">
              </div>
              <Pre-view v-if="showImg[imgIndex]" @clickit="viewImg" :imgSrc="imgSrc"></Pre-view>
            </li>
            <div class="upload-button" :class="{'hide': imageList.length >= 3}">
              <label class="select-image" for="uploads"><i class="shizi">+</i></label>
              <input type="file" id="uploads" style="position: absolute;" @change="uploadImg($event)">
            </div>
          </ul>
        </div>
      </div>
      <div class="basic-box" v-if="sendbackStatus === 2">
        <div v-if="isImagePass">
          <div class="img-icon img-waite-icon"></div>
          <h4>您已成功发起申请换／退货申请，<br>请耐心等待</h4>
          <p>
            VIPX同意后，请按照给出的退货地址退货，并请记录退货运单号；<br>如VIPX拒绝，会告知拒绝原因；<br>如VIPX超时未处理，换货申请将达成，请按系统给出的退货地址退货；
          </p>
        </div>
        <div v-else>
          <h3>换／退货申请未通过，原因如下：</h3>
          <div class="gray-box" v-if="refundInfo.remarks">
            {{refundInfo.remarks}}
          </div>
          <div v-else class="gray-box">
            {{remarks}}
          </div>
        </div>
      </div>
      <div>
        <div v-if="sendbackStatus === 3">
          <div class="basic-box tips-box">
            <h4>换／退货申请已通过，请尽快提交物流信息</h4>
            <p>请提交物流信息，以便加快换退货进度（没有物流信息， 将会影响换退货进度）</p>
            <span class="time-icon"></span>
          </div>
          <div class="basic-box">
            <h3>换／退货寄回信息</h3>
            <div class="gray-box logistics-infor">
              <li class="infor-title">
                <em>退货地址：</em>
                <span>新乡市红旗区金穗大道（东）688号商会大厦B座11楼</span>
              </li>
              <li class="infor-title">
                <em>收件人：</em>
                <span>李澜洁（退货）</span>
              </li>
              <li class="infor-title">
                <em>电话：</em>
                <span>177 7809 5509</span>
              </li>
            </div>
            <h3>填写换／退货物流信息</h3>
            <div>
              <div class="shipped-bill">
                <label>物流单号 <span>*</span></label>
                <input type="text" placeholder="请填写寄回物流单号" v-model="waybillNum">
              </div>
              <div class="shipped-bill">
                <label>物流公司 <span>*</span></label>
                <input type="text" placeholder="请填写寄回物流公司" v-model="logisticsName">
              </div>
            </div>
          </div>
        </div>
        <div v-if="refundsStatus === 0 && sendbackStatus === 4">
          <div class="basic-box">
            <div class="img-icon"></div>
            <h4>物流信息提交成功，请耐心等待VIPX收货</h4>
          </div>
          <div class="basic-box">
            <h3>物流信息</h3>
            <ul class="logistics-infor">
              <li class="logistics-sendback">
                <em>物流单号：</em>
                <span>{{refundInfo.waybill_num}}</span>
              </li>
              <li class="logistics-sendback">
                <em>物流公司：</em>
                <span>{{refundInfo.logistics_name}}</span>
              </li>
              <li class="logistics-sendback">
                <em>寄回信息：</em>
                <span>新乡市红旗区金穗大道（东）688号商会大厦B 座11楼；</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="refundsStatus === 1 && sendbackStatus === 4">
        <div class="basic-box">
          <div class="img-icon"></div>
          <h4 v-if="refundInfo.type === 2">VIPX已签收，新的商品请到快递查询中查看</h4>
          <h4 v-if="refundInfo.type === 1 || refundInfo.type === 3 ">VIPX已签收，退款余额会原路返回，请注意查收</h4>
        </div>
      </div>
      <div class="submit" :class="{'gray': !isImageSubmit}" v-if="sendbackStatus === 1" @click="sumitBack">提交</div>
      <div class="submit" :class="{'gray': !isLogisticsSubmit}" v-if="sendbackStatus == 3" @click="RefoundSubmit">提交</div>
    </div>
    <loading v-else></loading>
  </div>
</template>
<script>
import PreView from '@/components/logistics/preViewImg';
import Loading from '@/components/loading/Index';
import { getRefundInfoDetails, setRefundImage, setRefundInfo } from '@/api';

export default {
  components: {
    PreView,
    Loading,
  },
  data() {
    return {
      loadingData: true,
      isCanSubmit: true, // 提交保護
      remarks: '收回教材存在破损、污渍、折痕等，不予调换/退费；', // 默认退会理由
      isImageFlag: false, // 是否图片是否审核通过
      isLogisticsFlage: false, // 是否提交物流信息
      refundsStatus: 0, // 是否表示签收
      refundId: '', // 退回物流id
      refundInfo: {}, // 退回详细
      logisticsName: '', // 物流名称
      waybillNum: '', // 物流单号
      imgIndex: '', // 当前图片下标
      showImg: [], //图片放大控制
      reviewStatus: '', // 审核状态，0是待审核，1是通过，2是退回,3审核中，4提交物流号 refunds_status = =1 已签收
      imageList: [],
      imageData: [],
      refundText: '因教材已发货，请先将教材邮寄回来~',
      bookOrder: 0,
    };
  },
  created() {
    this.refundId = this.$route.query.id;
    this.bookOrder = Number(this.$route.query.bookOrder) || 0;
    this.getRefundDetails(this.refundId);
  },
  computed: {
    isImageSubmit() {
      return this.imageList.length > 0;
    },
    isLogisticsSubmit() {
      return this.logisticsName.length > 0 && this.waybillNum.length > 0;
    },
    // 1上传凭证 2等待确认 3寄回商品 4签收确认
    sendbackStatus() {
      return this.switchStep(this.reviewStatus);
    },
    // 0表示上传图片未通过，1表示通过
    isImagePass() {
      return this.reviewStatus !== 2;
    },
  },
  methods: {
    uploadImg(e) {
      const file = e.target.files[0];
      if (
        !/\.(gif|jpg|jpeg|png|bmp|BMP|JPEG|JPG|GIF|PNG)$/.test(e.target.value)
      ) {
        return false;
      }
      if (file.size > 1024 * 1024 * 5) {
        this.errorMsg = true;
        return false;
      }
      this.fileAdd(file);
    },
    fileAdd(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        file.src = e.target.result;
        this.imageList.push({
          file,
        });
      };
    },
    imageDel(i) {
      this.imageList.splice(i, 1);
    },
    imageSave() {
      this.imageData = [];
      let num = 0;
      if (this.imageList.length > 0) {
        this.imageList.map((photo) => {
          const formdata = new FormData();
          formdata.append('input_name', photo.file);
          this.$http
            .post(`${this.apiConfig.host}system/upload`, formdata, {
              headers: { 'content-type': 'multipart/form-data' },
            })
            .then((res) => {
              if (res.error_code === 0) {
                num += 1;
                this.imageData.push(res.data);
                if (num === this.imageList.length) {
                  this.upLoadSubmit(this.imageData);
                }
              }
            });
          return true;
        });
      }
    },
    // 提示消息
    showImgTips(type, text) {
      this.$vux.toast.show({
        time: 3000,
        type: type,
        position: 'middle',
        text: text,
        width: '17.6em',
      });
    },
    // 提交图片上传
    sumitBack() {
      if (!this.isCanSubmit) return false;
      this.isCanSubmit = false;
      if (this.imageList.length < 1) {
        this.showImgTips('text', '请上传凭证');
        return false;
      }
      this.imageSave();
    },
    // 图片提交
    upLoadSubmit(imageData) {
      const data = { images: imageData };
      setRefundImage(this.refundId, data).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.showImgTips('success', '上传成功');
        this.getRefundDetails(this.refundId);
      });
      this.isCanSubmit = true;
    },
    // 物流信息提交
    RefoundSubmit() {
      if (!this.isCanSubmit) return false;
      this.isCanSubmit = false;
      if (this.logisticsName === '') {
        this.showImgTips('warn', '物流公司不能为空');
        return false;
      }
      if (this.waybillNum === '') {
        this.showImgTips('warn', '运单号不能为空');
        return false;
      }
      const data = {
        logistics_name: this.logisticsName,
        waybill_num: this.waybillNum,
      };
      setRefundInfo(this.refundId, data).then((res) => {
        if (res.error_code !== 0) {
          return false;
        }
        this.showImgTips('success', '提交成功');
        this.getRefundDetails(this.refundId);
      });
      this.isCanSubmit = true;
    },
    // 获取退回详细信息
    getRefundDetails(refundId) {
      getRefundInfoDetails(refundId).then((res) => {
        this.loadingData = false;
        if (res.error_code !== 0) {
          return false;
        }
        this.refundInfo = res.data;
        this.refundId = res.data.id;
        this.reviewStatus = res.data.review_status;
        this.refundsStatus = res.data.refunds_status;
      });
    },
    // 判断显示步骤
    switchStep(reviewStatus) {
      switch (reviewStatus) {
        case 0:
          return 1;
        case 3:
          return 2;
        case 2:
          return 2;
        case 1:
          return 3;
        case 4:
          return 4;
        default:
          break;
      }
    },
    // 放大图片
    clickImg(e, index, img) {
      this.imgIndex = index;
      this.imgSrc = img || e.target.currentSrc;
      this.$set(this.showImg, index, true);
    },
    // 关闭图片
    viewImg() {
      this.$set(this.showImg, this.imgIndex, false);
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../../../styles/basic.less";

  .send-back {
    position: relative;
    width: 100%;
    min-height: 100%;
    background: @col-bg;
      .refund-text {
      width: 100%;
      background: rgba(255, 248, 233, 1);
      text-align: left;
      height: 0.7rem;
      line-height: 0.7rem;
      font-size: 0.26rem;
      color: #ffa000;
      padding: 0 0.5rem;
      .icon {
        margin-right: 0.1rem;
        margin-top: .2rem;
        display: inline-block;
        vertical-align: top;
        width: 0.3rem;
        height: 0.3rem;
        background: url(/static/imgs/Combined_Shape.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .flow-path {
      width: 100%;
      height: 1.63rem;
      background: @col-white;
      display: flex;
      padding: 0.43rem 0rem 0.3rem 0.6rem;
      &::after {
        content: "";
        display: block;
        clear: both;
      }
      .flow-list {
        &::after {
          content: "";
          display: block;
          clear: both;
        }
        position: relative;
        flex: 1;
        justify-content: flex-end;
        min-width: 1.2rem;
        .flow-line {
          position: absolute;
          left: -74%;
          // margin-left: 0.4rem;
          margin-top: 0.14rem;
          z-index: 3;
          .wh(100%, 0.04rem);
          background: @col-gray;
        }
        .flow-content {
          position: absolute;
          top: 0;
          left: 0rem;
          text-align: center;
          z-index: 5;
          .flow-state {
            display: inline-block;
            .wh(0.22rem, 0.22rem);
            border-radius: 100%;
            background-color: @col-gray;
            z-index: 2;
          }
          .flow-title {
            margin: 0.2rem 0 0 0;
            .wh(1rem, 0.36rem);
            color: @col-gray;
          }
        }

        &.current {
          .flow-line {
            background: @col-purple;
          }
          .flow-content {
            .flow-state {
              .wh(0.3rem, 0.3rem);
              background: #d49ff8;
              border: 0.04rem solid @col-purple;
              z-index: 2;
            }
            .flow-title {
              color: @col-darkgray;
            }
          }
        }
        &.error-current {
          .flow-content {
            .flow-state {
              .wh(0.28rem, 0.28rem);
              .bg-m("@{img-path}no-pass.png");
              z-index: 2;
              background-size: 100% 100%;
            }
            .flow-title {
              color: @col-price;
            }
          }
          & + .current {
            .flow-line {
              background: @col-gray;
              .wh(100%, 0.02rem);
            }
          }
        }
        &.first_list {
          // width: 1.2rem !important;
        }
      }
    }
    .basic-box {
      margin: 0.25rem auto;
      padding: 0.2rem 0.2rem 0.3rem 0.2rem;
      width: 94%;
      background: #fff;
      border-radius: 0.1rem;
      font-size: 0.3rem;
      h3 {
        padding-left: 0.2rem;
        margin-bottom: 0.25rem;
        font-size: 0.36rem;
        line-height: 0.3rem;
        border-left: 0.06rem solid @col-purple;
        span {
          font-size: 0.24rem;
          color: @col-gray;
        }
      }
      .shipped-bill {
        margin: 0 0.2rem;
        height: 0.9rem;
        border-bottom: 1px solid rgba(236, 232, 231, 1);
        label {
          font-size: 0.3rem;
          margin-right: 0.2rem;
          line-height: 0.9rem;
          span {
            color: @col-price;
          }
        }
        input {
          width: 66%;
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: 0.26rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .uploadFun {
        ul {
          display: flex;
          li {
            position: relative;
            .wh(1.44rem, 1.44rem);
            background: @col-gray;
            border-radius: 0.1rem;
            margin: 0.2rem 0.15rem;
            span {
              position: absolute;
              right: -0.1rem;
              top: -0.1rem;
              display: block;
              .wh(0.28rem, 0.28rem);
              .bg-m("@{img-path}dialog-close-icon.png");
              background-size: 100% 100%;
            }
            .overflow-img {
              display: flex;
              align-items: center;
              .wh(100%, 100%);
              overflow: hidden;
              img {
                width: 100%;
              }
            }
          }
        }
        .upload-button {
          position: relative;
          .wh(1.44rem, 1.44rem);
          margin: 0.2rem 0 0 0.15rem;
          input {
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 10;
            top: 0;
          }
        }
        .select-image {
          display: inline-block;
          border-radius: 0.08rem;
          .wh(1.44rem, 1.44rem);
          text-align: center;
          border: 0.02rem solid @col-purple;
          i.shizi {
            // height: 100%;
            display: block;
            color: @col-purple;
            font-size: 0.8rem;
            font-weight: 400;
          }
        }
      }
      .img-icon {
        margin: 0.27rem auto 0.3rem;
        .wh(0.88rem, 0.88rem);
        border-radius: 100%;
        .bg-m("@{img-path}iconcorrect.png");
        background-size: 100% 100%;
        &.img-waite-icon {
          .bg-m("@{img-path}send-back-time.png");
          background-size: 100% 100%;
        }
      }
      h4 {
        // padding: 0 1rem .3rem;
        padding-bottom: 0.3rem;
        font-size: 0.3rem;
        font-weight: 500;
        line-height: 0.42rem;
        text-align: center;
        color: #1b223f;
      }
      p {
        font-size: 0.24rem;
        color: #9b9b9b;
        line-height: 0.33rem;
      }
      .gray-box {
        width: 100%;
        padding: 0.2rem;
        background: #f4f4f4;
        border-radius: 0.1rem;
        margin-bottom: 0.3rem;
        font-size: 0.28rem;
      }
      .logistics-infor {
        li {
          padding-left: 0.25rem;
          display: flex;
          font-size: 0.24rem;
          color: #4a4a4a;
          line-height: 0.32rem;
          em {
            display: block;
            width: 1.2rem;
            color: @col-gray;
          }
          span {
            display: block;
            flex: 1;
          }
          &.infor-title {
            padding-left: 0;
            em {
              width: 1.3rem;
              color: #1c223d;
            }
          }
        }
        .logistics-sendback {
          font-size: 0.3rem;
          line-height: 0.48rem;
          em {
            width: 1.6rem;
          }
        }
      }
    }
    .tips-box {
      position: relative;
      padding: 0.3rem 0.2rem 0.3rem 0.8rem;
      h4 {
        text-align: left;
      }
      .time-icon {
        position: absolute;
        left: 0.3rem;
        top: 0.34rem;
        .wh(0.34rem, 0.34rem);
        .bg-m("@{img-path}time-active.png");
        background-size: 100% 100%;
      }
    }
    .submit {
      position: fixed;
      left: 0;
      bottom: 0;
      .wh(100%, 1.1rem);
      text-align: center;
      line-height: 1.1rem;
      font-size: 0.36rem;
      color: @col-white;
      background: @col-purple;
      &.gray {
        background: @col-gray;
      }
    }
  }
</style>
