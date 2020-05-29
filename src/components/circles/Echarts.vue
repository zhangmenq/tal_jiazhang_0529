<template>
  <div :id="id" :data="data"></div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入柱状图和雷达图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/radar');
// 引入其他组件
require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
require('echarts/lib/component/legend');

export default {
  name: 'echarts',
  data() {
    return {
      chartLineGraph: null,
    };
  },
  watch: {
    data: {
      handler(newVal) {
        this.drawChart(this.id, newVal);
      },
      deep: true,
    },
  },
  props: ['id', 'data'],
  methods: {
    drawChart(id, data) {
      const myChart = document.getElementById(id);
      this.chartLineGraph = echarts.init(myChart);
      this.chartLineGraph.setOption(data);
      window.addEventListener('resize', () => {
        this.chartLineGraph.resize();
      });
    },
  },
  mounted() {
    this.drawChart(this.id, this.data);
  },
  // beforeDestroy() {
  //   if (this.chartLineGraph) {
  //     this.chartLineGraph.clear();
  //   }
  // },
};
</script>
