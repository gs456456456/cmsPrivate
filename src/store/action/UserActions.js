import config from '@/config/index.js'
export default {
	//所有用户打包信息
	userFetch: async (ctx) => {
		let res = await ctx.dispatch('fetchAsync', {
			url: '/info',
			method: 'GET',
		})
		return res.data;
	},
    //登录
	userLoginFetch: async (ctx, param) => {
		let res = await ctx.dispatch('fetchAsync', {
			url: '/user/user_login',
			method: 'POST',
			body: param
		})
		if (res.data.Code == 1100) {
			ctx.dispatch('initLogin');
		}
		return res.data;
	},
	 //退出登录
	 userExitFetch: async (ctx) => {
		let res = await ctx.dispatch('fetchAsync', {
			url: '/user/exit',
			method: 'GET',
		})
		return res.data;
	},
    //TODO: 登录后 初始化数据
	async initLogin (ctx) {
		ctx.commit('setIsLogin', true);
	},
	//退出登录 删除数据
	exitLogin : async (ctx) =>  {
		let res = await ctx.dispatch("userExitFetch");
		localStorage.removeItem("islogin");
		if(res.Code == 1100) {
			ctx.commit('setIsLogin', false);
			ctx.commit('setPortfolios', []); //收藏
			ctx.commit('setUserData', {});
			ctx.commit('setUserState', {});
			ctx.commit('setOpenOrderData', [])
			ctx.commit('setOrderHistoryData', [])
			if (ctx.state.socket) {
				ctx.state.socket.send(JSON.stringify({
					id: 106,
					method: config.trade['106'],
					params: []
				}))
			}
			ctx.commit('setAssetData', []);
		}
		
	},
	//参数配置
	sysConfigFetch:async (ctx,param) => {
		let res = await ctx.dispatch('fetchAsync',{
			url: `/public/sys/config?key=${param}`,
			method: 'GET'
		})
		// if (res.data.Code == 1100) {
		// 	ctx.commit('setSysConfigData', res.data.Content)
		// }
		return res.data;
	},

    //个人信息
	userInfoFetch: async (ctx) => {
		let res = await ctx.dispatch('fetchAsync',{
			url: '/user/info',
			method: 'GET'
		})
		if (res.data.Code == 1100) {
			res.data.Content["limitTrade"] = true;
			let res2 = await ctx.dispatch("sysConfigFetch","ConfigTradeRange");
			if(res2.Code==1100){
				res.data.Content["max"] = res2.Content.max;
				res.data.Content["min"] = res2.Content.min;
				res2.Content.excepts.forEach(element => {
					if(element==res.data.Content.uid){
						res.data.Content["limitTrade"] = false
					}
				});
			}
			ctx.commit('setUserData', res.data.Content)
		}
		return res.data;
	},
}
