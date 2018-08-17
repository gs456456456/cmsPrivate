<template>
   <div class="user_alerts" id="user_alert_authShow" v-if="show">
      <div class="pwdChange_alert text-center deleteAll_alert authShow_alert">
          <div class="exclamation">
              <i class="fa fa-shield"></i>
          </div>
          <p class="text1">{{$t['user_google']}}</p>
          <div class="authShow_input" v-if="type == 'google'">
              <input 
                type="text" 
                id="showgoogle" 
                :placeholder="$t['user_phinsert']"
                v-model="code">
          </div>

          <div class="authShow_input"  v-else>
              <div class="accountInfo_right_sms auth_sms_right2">
              <input 
                id="sms_code" 
                type="text" 
                :placeholder="$t['placehsms']"
                v-model="code">
              <button id="send_smsCode" @click="smsClick" :disabled="captcha.disabled">{{captcha.text}}</button>
          </div></div>
          <div class="alert_choose">
              <div class="btn_box">
                  <button class="btn1 user_authShow_close" @click="cancelClick">{{$t['exchange_cancel']}}</button>
                  <button class="btn2" @click="authClick">
                      <i class="fa fa-check"></i>{{$t['exchange_confirm']}}
                  </button>
              </div>
          </div>
          <div class="reminds" style="color: red;">{{reminds}}</div>
          <div 
              class="user_alertDeleteAll_close user_authShow_close"
              @click="cancelClick">
              <i class="fa fa-close"></i>
          </div>
      </div>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import utils from '@/assets/js/utils'
export default {
  data () {
    return {
      code: '',
      show: false,
      captcha: {
        loding: false,
        text: "发送",
        disabled: false
      },
    }
  },
  props: ['type', 'value', 'reminds'],
  activated () {
    this.captcha.text = this.$t['send']
  },
  created () {
    
  },
  methods: {
    ...mapActions([
      'phoneCaptchaFetch'
    ]),
    authClick () {
      this.$emit('on-click', this.code)
    },
    cancelClick () {
      this.$emit('input', false)
      this.$emit('on-close')
    },
    async smsClick () {
      this.captcha.disabled = true;
      let res = await this.phoneCaptchaFetch({
        phoneNo: ""
      });
      if (res.Code == 1100) {
        utils.timingCallback({
          duration: 120,
          onUpdate: t => {
            this.captcha.text = Math.ceil(t / 1000) + this.$t['timerseconds'];
          },
          onEnd: () => {
            this.captcha.loding = false;
            this.captcha.disabled = false;
            this.captcha.text = this.$t["resend"];
          }
        });
        this.$emit('on-error', '')
        return ;
      } 

      let msgReminds = ''
      this.captcha.disabled = false;
      switch (res.Code) {
        case 1204: msgReminds = this.$t["code1204"];
        break;
        case 1225: msgReminds = this.$t["code1201"];
        break;
        case 1226: msgReminds = this.$t["sms1226"];
        break;
        case 1234: msgReminds = this.$t["code1234"];
        break;
        case 1306: msgReminds = this.$t["rg1201"];
        break;
        case 1300: msgReminds = this.$t["code1300"];
        break;
        default: msgReminds=data.Msg;
        break;
      }
      this.$emit('on-error', msgReminds)

    }
  },
  watch: {
    value (val) {
      if(!val){
        this.code=''
      }
      this.show = val
    }
  }
}
</script>

