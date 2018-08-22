import {getCookie,setCookie} from '@/utils/cookie.js'
// import { cookie } from 'vux'

export default {
	setUserRouterBefore(state,v){
		state.user.userRouterBefore = v
	},
	setUserInfoCache(state,v){
		state.user.userInfoCache = v
	},
	setIsLogin (state, v) {
		state.user.isLogin = v;
	},
	setLanguageType (state, v) {
		try {
			if (v == 'zh-CN' || v == 'en-US') {
				setCookie('lang', v);
				localStorage.setItem('lang', v)
				state.languageType = v;
			}else {
				localStorage.setItem('lang', 'en-US')
				state.languageType = 'en-US'
			}
			console.log(state.languageType)
		} catch (error) {
			localStorage.setItem('lang', 'en-US')
			state.languageType = 'en-US'
		}
	},
}