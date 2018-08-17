<!-- 右下角文本提醒弹窗 -->
<template>
    <div 
        class="alert_ordersOSuc" 
        :class="getBg()"
        v-show="isShow">
        <div class="icons_left">
            <i 
                class="fa"
                :class="getIconType()">
            </i>
        </div>
        <div>
            <div class="ordersOSuc_title">
                {{contentIndex}}
            </div>

            <slot name="msgContent"></slot>
        </div>
        <slot name="closeBtn"></slot>
    </div>
</template>


<script>
export default {
    name: 'HAlertMessage',
    props: ['title', 'isShow', 'contentIndex', 'iconType'],
    data () {
        return {
            
        }
    },
   methods: {
        getIconType () {
           switch (this.iconType) {
                case 'star':
                    return 'fa-star'
                break;
                case 'check' :
                    return 'fa-check'
                break;
                default:
                break;
           }
        },
        getBg () {
            switch (this.title) {
                case 'cancelS':
                    return 'alert_orderCal';
                break;
                default:
                break;
            }
        }
   }
}
</script>


<style>
    .alert_ordersOSuc {
        position: fixed;
        z-index: 2000;
        right: 10px;
        bottom: 30px;
        color: #fff;
        padding: 12px 42px 12px 42px;
        border-radius: 4px;
        font-size: 12px;
    }
    .alert_ordersOSuc .icons_left {
        font-size: 18px;
        position: absolute;
        left: 15px;
        top: 12px;
    }
    .alert_ordersOSuc .icons_close {
        font-size: 14px;
        position: absolute;
        right: 15px;
        top: 12px;
        cursor: pointer;
    }
    .alert_ordersOSuc .ordersOSuc_title {
        font-size: 14px;
        line-height: 2em;
    }
</style>
