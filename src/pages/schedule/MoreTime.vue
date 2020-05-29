<template>
  <div class="more-time">
    <loading v-if="loading"></loading>
    <div v-else-if="!noContent">
      <div class="item-box">
        <p class="h4">第{{no}}讲 {{title}}</p>
      </div>
      <div class="item-box" v-for="(dateItem, date) in info" :key="date">
        <div class="date">
          {{ date }}  周{{weeks[moment(date).day()]}}
        </div>
        <div class="infor" >
            <span class="time" v-for="item in dateItem" :key="item.id">
              {{ moment(item.start_at).format('HH:mm') }} - {{ moment(item.end_at).format('HH:mm') }}
            </span>
        </div>
      </div>
    </div>
    <no-content v-else :tips="tips"></no-content>
  </div>
</template>
<script>
  import { isEmpty, groupBy } from 'lodash';
  import moment from 'moment';
  import { minorLists } from '@/api';
  import NoContent from '@/components/common/NoContent';
  import Loading from '@/components/loading/Index';
  /* eslint-disable */
  export default {
    data() {
      return {
        currentInfo: {
          circle: {},
        },
        info: [],
        no: 0,
        title: '',
        infoKeys: [],
        noContent: true,
        tips: '暂无时间显示～',
        weeks: ['日', '一', '二', '三', '四', '五','六'],
        loading: false,
      };
    },
    components: {
      NoContent,
      Loading,
    },
    computed: {
      minorId() {
        return this.$route.params.minor_id;
      },
    },
    methods: {
      moment(date) {
        return moment(date);
      },
      getInfo() {
        this.loading = true;
        minorLists(this.minorId).then((res) => {
          this.loading = false;
          if (isEmpty(res.data)) {
            return false;
          }
          if (res.data['minor_data'].length === 0) {
            return false;
          }
          this.noContent = false;
          this.no = res.data['no'];
          this.title = res.data['circle']['title'];
          this.info = res.data['minor_data'];
          this.info.map(item => item.date = moment(item.start_at).format('YYYY-MM-DD'));
          this.info = groupBy(this.info, 'date');
        });
      },
      teacher(teacherId) {
        this.$router.push({
          name: 'teacher',
          params: {
            id: teacherId,
          },
        });
      },
    },
    mounted() {
      this.getInfo();
    },
  };
</script>
<style lang="less">
  @import "../../styles/basic.less";

  .more-time{
    padding: .2rem 0 .3rem;
    min-height: 100%;
    background: @col-bg;
    color: @col-darkgray;
    .item-box{
      .item-box;
      padding: .3rem .2rem;
      display: flex;
      justify-content: center;
      font-size: .3rem;
      .date{
        display: block;
        float: left;
        width: 3rem;
        color: @col-purple;
      }
      .infor{
        width: 4.5rem;
        float: right;
        .name{
          .ellipsis-b;
        }
        .time{
          display: block;
          float: left;
          width: 50%;
          text-align: center;
        }
      }
    }
    .h4{
      line-height: .4rem;
      text-align: center;
      font-size: .36rem;
    }
    .objective-box{
      margin-top: .2rem;
      line-height: .36rem;
      dd{
        margin-top: .1rem;
      }
    }
    .time-box{
      li{
        position: relative;
        padding: .2rem 0 .2rem 2.4rem;
        min-height: .6rem;
        border-top: .01rem solid @col-border;
        &:first-of-type{
          padding-top: 0;
          border-top: none;
          .date{
            top: 0;
          }
        }
        &:last-of-type{
          padding-bottom: 0;
        }

        p{
          display: flex;
          line-height: .4rem;
          & + p{
            margin-top: .1rem;
          }
        }

      }
    }
  }
</style>
