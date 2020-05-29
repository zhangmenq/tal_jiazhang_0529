<template>
  <div v-transfer-dom class="cus-dialog">
      <popup v-model="showPop" @on-hide="hidePop" height="70%">
        <div class="teacher-box">
          <template v-if="teacherInfo.intro_cn || teacherInfo.video_id">
            <p class="intro" v-show="teacherInfo.intro_cn">{{teacherInfo.intro_cn}}</p>
            <div class="cus-responsive video" v-show="teacherInfo.video_id">
              <div class="cus-responsive-item" id="video"></div>
            </div>
          </template>
          <no-content
            v-else
            :tips="'暂无内容~'"
            :vertical="false">
          </no-content>
        </div>
      </popup>
    </div>
</template>

<script>
  import { TransferDom, Popup } from 'vux';
  import NoContent from '@/components/common/NoContent';

  export default {
    directives: { TransferDom },
    components: {
      Popup,
      NoContent
    },
    props: {
      teacherInfo: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        showPop: true,
      };
    },
  }
</script>
