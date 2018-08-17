import active from './active.js'
import countdown from './countdown.js'
// import error from './error.js'
import dandw from './dandw.js'
import exchange from './exchange.js'
import footer from './footer'
import forgot from './forgot'
import fund from './fund'
import indexbody from './indexbody'
import login from './login.js'
import nav from './nav.js'
import pageName from './pageName.js'
import register from './register.js'
import reset from './reset'
import usercenter from './usercenter.js'
import tradingHistory from './tradingHistory'
import indexmain from './indexmain'
import languagechange from './languagechange'
import invest from './invest'
import activity from './activity'


export default {
	"zh-CN": {
		...active['zh-CN'],
		// 活动
		...activity['zh-CN'],

		...countdown['zh-CN'],
		...dandw['zh-CN'],
		...exchange['zh-CN'],
		...footer['zh-CN'],
		...forgot['zh-CN'],
		...fund['zh-CN'],
		...indexbody['zh-CN'],
		...login['zh-CN'],
		...nav['zh-CN'],
		...pageName['zh-CN'],
		...register['zh-CN'],
		...reset['zh-CN'],
		...usercenter['zh-CN'],
		...tradingHistory['zh-CN'],
		...indexmain['zh-CN'],
		...languagechange['zh-CN'],
		...invest["zh-CN"]
	},
	"en-US": {
		...active['en-US'],
		// 活动
		...activity['en-US'],

		...countdown['en-US'],
		...dandw['en-US'],
		...exchange['en-US'],
		...footer['en-US'],
		...forgot['en-US'],
		...fund['en-US'],
		...indexbody['en-US'],
		...login['en-US'],
		...nav['en-US'],
		...pageName['en-US'],
		...register['en-US'],
		...reset['en-US'],
		...usercenter['en-US'],
		...tradingHistory['en-US'],
		...indexmain['en-US'],
		...languagechange['en-US'],
		...invest["en-US"]
	}

}