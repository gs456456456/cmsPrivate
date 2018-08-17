<!-- 溢价弹窗&&撤单弹窗 -->
<template>
    <div class="user_alerts" id="user_alertOverPrice" v-show="val">
        <div class="pwdChange_alert text-center deleteAll_alert deleteS_alert pwdChange_alert2">
            <div class="exclamation">
                <i 
                    class="fa fa-exclamation-triangle"
                    :class="getIconType()">
                </i>
            </div>

            <slot name="alertContent"></slot>

            <div class="alert_choose">
                <div class="btn_box">
                    <button 
                        class="btn1 OverPrice_cancel OverPrice_close"
                        @click="closeAlert()">
                        {{$t['exchange_cancel']}}
                    </button>

                    <slot name="confirmBtn"></slot>
                </div>
            </div>
            <div class="user_alertDeleteAll_close OverPrice_close" @click="closeAlert()">
                <i class="fa fa-close"></i>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'HAlertOverCancel',
    props: ['isShow', 'contentText', 'iconType', 'value'],
    data () {
        return {
            val: false
        }
    },
   methods: {
        getIconType () {
           switch (this.iconType) {
                case 'default':
                    return ' OverPrice_logo'
                break;
                case 'warn' :
                    return ''
                break;
                default:
                break;
           }
        },
        closeAlert () {
            this.val = false
            this.$emit('input', this.val)
        }
   },
   watch: {
       value (val) {
           this.val = val
       }
   }
}
</script>



<style>

</style>
