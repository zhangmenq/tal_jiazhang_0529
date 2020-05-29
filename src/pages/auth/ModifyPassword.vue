<template>
  <div class="login-reg">
    <div class="loginreg-cont login">
      <div>
        <group>
          <x-input type="password"
            v-model="oldPassword"
            placeholder="请输入当前密码"
            :max="18"
            :is-type="validPassword"
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabled"
            novalidate>
            <span slot="label" class="inputicon password"></span>
          </x-input>
        </group>
        <group>
          <x-input type="password"
            v-model="newPassword"
            placeholder="请输入新的密码"
            :max="18"
            :is-type="validPassword"
            @on-focus="getErrorFlag(false)"
            @on-blur="getErrorFlag(true)"
            :disabled="isDisabled"
            novalidate>
            <span slot="label" class="inputicon password"></span>
          </x-input>
        </group>
        <group>
          <x-input type="password"
            placeholder="请再次输入新密码"
            :max="18"
            v-model="confirmPassword"
            :equal-with="newPassword"
            @on-change="getValidconfirm"
            :disabled="isDisabled"
            novalidate>
            <span slot="label" class="inputicon password"></span>
          </x-input>
        </group>
        <!-- combutton-active 激活按钮状态 -->
        <div class="execute-button ">
          <p class="wrong" v-if="errorTips && !validPassword(oldPassword).valid">
            {{validPassword(oldPassword).msg}}
          </p>
          <p class="wrong" v-else-if="errorTips && !validPassword(newPassword).valid">
            {{validPassword(newPassword).msg}}
          </p>
          <p class="wrong" v-else-if="errorTips && confirm">
            {{errorMsg}}
          </p>
          <p class="wrong" v-else-if="errorMsg">{{errorMsg}}</p>
          <x-button
            class="com-button"
            @click.native="savePassword()"
            :class="{'combutton-active':
            validPassword(oldPassword).valid &&
            validPassword(newPassword).valid &&
            !confirm}">
            保存
          </x-button>
        </div>
        <div class="warm-prompt">
          <h3>请注意：</h3>
          <p>1.密码为8-16位字母和数字组合<br/>
             2.请勿使用生日或是易于被猜中的连续数字<br/>
             3.请牢记您变更的密码
          </p>
        </div>
      </div>
      <!-- <div class="bottom-img">
          <img src="../../assets/login-reg-img1.png" alt="">
      </div> -->
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux';
import validateMixin from '@/mixins/validateMixin';

export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
  },
  mixins: [validateMixin],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMsg: '',
      errorTips: false,
      confirm: true,
      isDisabled: false,
    };
  },
  methods: {
    getValidconfirm() {
      if (this.confirmPassword !== this.newPassword) {
        this.errorMsg = '新密码两次输入不一致';
        this.confirm = true;
      } else {
        this.errorMsg = '';
        this.confirm = false;
      }
    },
    getErrorFlag(val) {
      if (this.errorMsg !== '') {
        this.errorMsg = '';
      }
      this.errorTips = val;
    },
    savePassword() {
      if (
        this.oldPassword === '' ||
        this.newPassword === '' ||
        this.confirmPassword === '' ||
        !this.errorTips ||
        this.errorMsg
      ) {
        return false;
      }
      this.isDisabled = true;
      const data = {
        old_password: this.oldPassword,
        password: this.newPassword,
        password_confirmation: this.confirmPassword,
      };
      this.$http.put(`${this.apiConfig.host}/user/users/password-modify`, data).then((response) => {
        this.isDisabled = false;
        if (response.error_code !== 0) {
          this.errorMsg = response.error_msg;
          return false;
        }
        this.$vux.toast.show({
          type: 'success',
          text: '保存成功',
          position: 'middle',
          time: 1500,
          width: '15em',
        });
        setTimeout(() => {
          this.$router.push({
            name: 'mine',
          });
        }, 2000);
      });
    },
  },
};
</script>
