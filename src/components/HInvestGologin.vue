<template>
        <div class="user_alerts user_alertChange" id="goLogin" :class="{disappear:!showGologin}" v-cloak>
            <div class="pwdChange_alert ">
                <div class="alert_title">
                    <div class="alert_title_wrap">
                        <span>
                            <i class="fa fa-exclamation-triangle"></i>
                            <span>{{$t["a10"]}}</span>
                        </span>
                        <i class="fa fa-close user_alertChange_close" @click="closeWindow">

                        </i>
                    </div>
                </div>
                <div class="alert_content" style="padding: 17px 0px 0px 0px">
                    <div class="alert_content_inter">
                        <div class="go_to_login_msg" style="text-align: center;
                        padding-top: 63px;
                        padding-bottom: 67px;"><span>{{$t["a11"]}}</span><span><a href="/login" style="color: #52b190;margin-left:3px;">{{$t["a12"]}}</a></span><span>!</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {}
    },
    computed: {

    },
    created: function () {

    },
    props: {
        showGologin: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        closeWindow: function () {
            this.$parent.closeWindow()
        //     this.showGologin = false
        }   
    }
}
</script>