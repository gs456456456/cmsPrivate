import includeJs from '../utils/includeJs'

window.NVC_Opt = {
    //无痕配置 && 滑动验证、刮刮卡通用配置
    appkey:'CF_APP_1',
    scene:'nvc_register',
    isH5:false,
    popUp:false,
    renderTo: 'nvcid',
    trans: {"key1": "code0","nvcCode":400},
    language: "cn",
    //滑动验证长度配置
    customWidth: 300,
    //刮刮卡配置项
    width: 300,
    height: 100,
    elements: [
        '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
        '//img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png'
    ], 
    bg_back_prepared: '//img.alicdn.com/tps/TB1skE5SFXXXXb3XXXXXXXXXXXX-100-80.png',
    bg_front: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
    obj_ok: '//img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
    bg_back_pass: '//img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
    obj_error: '//img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
    bg_back_fail: '//img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
    upLang:{"cn":{
        _ggk_guide: "请在屏幕上滑动，刮出两面盾牌",
        _ggk_success: "恭喜您成功刮出盾牌<br/>继续下一步操作吧",
        _ggk_loading: "加载中",
        _ggk_fail: ['呀，盾牌不见了<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "https://help.hotbit.io/hc/zh-cn/requests/new", '反馈问题'],
        _ggk_action_timeout: ['我等得太久啦<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "https://help.hotbit.io/hc/zh-cn/requests/new", '反馈问题'],
        _ggk_net_err: ['网络实在不给力<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "https://help.hotbit.io/hc/zh-cn/requests/new", '反馈问题'],
        _ggk_too_fast: ['您刮得太快啦<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "https://help.hotbit.io/hc/zh-cn/requests/new", '反馈问题']
        }
    },
    nvcCallback: function (res) {
        global.vm.$emit('nvc-callback', res)
    }
  }
includeJs('https://g.alicdn.com/sd/nvc/1.1.112/guide.js')

export function nc () {
    //唤醒滑动验证
    getNC().then(function(){
        NoCaptcha.upLang('cn', {
            'LOADING':"加载中...",//加载
            'SLIDER_LABEL': "请向右滑动验证",//等待滑动
            'CHECK_Y':"验证通过",//通过
            'ERROR_TITLE':"非常抱歉，这出错了...",//拦截
            'CHECK_N':"验证未通过", //准备唤醒二次验证
            'OVERLAY_INFORM':"经检测你当前操作环境存在风险，请输入验证码",//二次验证
            'TIPS_TITLE':"验证码错误，请重新输入"//验证码输错时的提示
        });
        _nvc_nc.reset();
    })
}
export function sc () {
    getSC().then(function(){})
}
export function nvcVal () {
    return getNVCVal()
}

/**
 *
 *
 * @export
 * @param {String} domId #id
 */
export function nacRenderTo (domId) {
    NVC_Opt.renderTo = domId;
    NVC_Opt.language = global.vm.getLanguageType == 'zh-CN'?'cn':'en'
}

export function registerRequest(url, params){
  var callbackName = ('jsonp_' + Math.random()).replace('.', '')
  params += '&callback=' + callbackName
  var o_scripts = document.getElementsByTagName("script")[0]
  var o_s = document.createElement('script')
  o_scripts.parentNode.insertBefore(o_s, o_scripts);
  //您注册请求的业务回调
  window[callbackName] = function(json) {
    console.log(json)
      if(json.result.code == 400) {
        nc()
      } else if (json.result.code == 600) {
          //唤醒刮刮卡
          getSC().then(function(){})
      } else if (json.result.code == 100 || json.result.code == 200) {
          //注册成功
          alert("register success!")
      } else if (json.result.code == 800 || json.result.code == 900) {
          //直接拦截
          alert("register failed!")
      }
  }
  o_s.src = url + '?' + params
  console.log(o_s.src)
  console.log(callbackName)

}