// import  "@/assets/js/ali-verify";
// import "https://g.alicdn.com/sd/nch5/index.js?t=2015052012"
/**
 * @description [阿里云滑动验证]
 * @param {any} options [options.scene]
 * @param {any} vm [vue实例对象]
 * @returns {Promise} [Promise 实例对象]
 */


let captchaInit = (options, vm) => {
    return new Promise((resolve, reject) => {
        // if (typeof noCaptcha === "undefined") {
        //     setTimeout(() => {
        //         return captchaInit(options, vm)
        //     }, 300)
        //     return;
        // }

        
        var nc_token = [options.appkey || "FFFF00000000017A5AA7", (new Date()).getTime(), Math.random()].join(':');
        var NC_Opt = {
            // renderTo: "#your-dom-id",
            // appkey: "FFFF00000000017A5AA7",
            // scene: sc,
            // token: nc_token,
            // customWidth: 347,
            // trans: { "key1": "code0" },
            // elementID: ["usernameID"],
            // is_Opt: 0,
            // language: huaLang,
            // isEnabled: true,
            // timeout: 3000,
            // times: 5,
            renderTo: options.id || '#your-dom-id',
            appkey: options.appkey || "FFFF00000000017A5AA7", 
            scene: options.scene || 'login',
            token: nc_token,
            is_Opt: 0,
            trans: {
                key1: "code0"
            },
            language: vm.getLanguageType == 'zh-CN'?'cn':'en',
            timeout: options.timeout || 10000,
            retryTimes: 5,
            errorTimes: 5,
            inline:false,
            bannerHidden:false,
            initHidden:false,
            callback: function (data) {
                let res = {
                    data: {
                        sessionid: data.csessionid,
                        sig: data.sig,
                        token: nc_token,
                        scene: options.scene
                    },
                    nc: nc
                }
                resolve(res); 
            },
            error: function (s) {
                reject(s, nc);
            }
        };
        var nc = new noCaptcha(NC_Opt);
        // nc.setEnabled(true);
        nc.reset();//请务必确保这里调用一次reset()方法
        nc.upLang('cn', {
            'LOADING':"加载中...",//加载
            'SLIDER_LABEL': "请向右滑动验证",//等待滑动
            'CHECK_Y':"验证通过",//通过
            'ERROR_TITLE':"非常抱歉，这出错了...",//拦截
            'CHECK_N':"验证未通过", //准备唤醒二次验证
            'OVERLAY_INFORM':"经检测你当前操作环境存在风险，请输入验证码",//二次验证
            'TIPS_TITLE':"验证码错误，请重新输入"//验证码输错时的提示
        });
        $("#your-dom-id").children().css("width","auto")
    })
}

export default captchaInit;