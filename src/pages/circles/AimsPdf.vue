<template>
  <div>
    <pdf
      v-if="!showLoading"
      v-for="i in numPages"
      :key="i"
      :src="pdfTask"
      :page="i"
    ></pdf>
    <div class="container"
      :style="{height: clientHeight+'px', width: clientWidth+'px'}"
      v-show="showLoading">
      <!-- <div class="loadingImg" >&nbsp;</div> -->
      <span id="loading-text">加载中......</span>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  name: 'aimsPdf',
  components: {
    pdf,
  },
  data() {
    return {
      showLoading: true,
      numPages: 0,
      pdfTask: undefined,
      clientHeight: 0,
      clientWidth: 0,
    };
  },
  computed: {
    pdfUrl() {
      return window.sessionStorage.getItem('aims-pdf-url') || '';
    },
  },
  beforeRouteEnter(to, from, next) {
    const fontSize = window.devicePixelRatio * 24;
    document.getElementsByTagName('html')[0].style.fontSize = `${fontSize}px`;
    next();
  },
  mounted() {
    // 此页面允许缩放
    const metaEl = document.querySelector('meta[name="viewport"]');
    metaEl.setAttribute('content', 'width=device-width,user-scalable=yes,initial-scale=1');
    document.getElementById('loading-text').style.fontSize = `12 * ${window.devicePixelRatio}px`;
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    this.pdfTask = pdf.createLoadingTask(this.pdfUrl);
    this.pdfTask.then((page) => {
      this.numPages = page.numPages;
      this.showLoading = false;
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
