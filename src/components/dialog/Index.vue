<template>
  <div v-show="show">
    <div class="common-dialog" @click="cancel()"></div>
    <div class="dialog-box hintbutton-box">
      <em class="close" @click="cancel()">x</em>
      <div class="dialog-txt">
        <p>
          {{ tips }}
        </p>
      </div>
      <x-button
        @click.native="confirm()"
        mini
        :gradients="['#75008b', '#75008b']">
        {{ confirmText }}
      </x-button>
      <x-button
        mini
        class="gray"
        @click.native="cancel()">
        {{ cancelText }}
      </x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux';

export default {
  name: 'VxDialog',
  components: {
    XButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    tips: {
      type: String,
      default: '取消',
    },
  },
  data() {
    return {
      isDisabled: false,
    };
  },
  methods: {
    confirm() {
      if (this.isDisabled) {
        return false;
      }
      this.isDisabled = true;
      this.$emit('onConfirm');
    },
    cancel() {
      this.$emit('onCancel');
    },
  },
};
</script>
