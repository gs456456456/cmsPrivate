import Datafeeds from "../../static/js/plugins/charting_library/datafeed/udf/datafeed.js"
import config from '@/config/index.js'
import {clone,distinctArr,removeArr,formatKlineData} from '@/common/commonMethods.js'
import market from "@/common/market";
let trade = config.trade

/**
 * @description socket数据格式化
 * 
 * @param {Number} id
 * @param {Object} params 
 * @returns {String}
 */



let	socketData = (id, params) => {
	return JSON.stringify({
		"method": trade[id],
		"params": params || [],
		"id": id
	})
}
// 是否是
let marketFirst = true;

// marketlist 有没有完整
let isFirst = true;

// 暂时未用到
let fund = {
	isFirst: true
}
// 所有的交易对
let allMarketName = []
// websocket 有没有登录
let websocketIsLogin = false
// 记录order执行几次
let orderCount = 0
// 记录socket重连次数，当重连5次时  则弹窗 重连
let socketReloadCount = 0
// 定时器
let t = null
let log = ''

//标志位 查询资产的次数
let assetFlg = 0;
export default function(that) {
	this.marketFn = new market(that);
	this.init = function () {
		//datafeed
		let newdatafeed = new Datafeeds.UDFCompatibleDatafeed(config.BASEURL+"/public",10000,this);
		that.setDataFeed(newdatafeed)

		that.setSocket(that.config.WSURL);
		if (t) {
			clearInterval(t)
		}
		t = setInterval(() => {
			var data = {
				"method":"server.ping",
				"params": [],
				"id":104
			}
			that.getSocket.send(JSON.stringify(data));
		},5000)
		that.getSocket.socket.onopen = () => {
			log += 'open-'
			if (socketReloadCount > 0) {
				this.socketReload()
			}
		}

		that.getSocket.socket.onerror = (err) => {
			log += 'err-'
			that.getSocket.close()
			// setTimeout(()  => {
			// 	this.initSocket()
			// }, 5000)
		}
		
		that.getSocket.socket.onclose = (err) => {
			log += 'close-'
			if (t) {
				clearInterval(t)
			}
			setTimeout(()  => {
				socketReloadCount++
				this.init()
			}, 1000)
		}

		if (that.isEmptyObj(that.marketsList)) {
			this.initMarket()
		}

		that.getSocket.onmessage = (msg) => {
			let data = JSON.parse(msg);
			let id = data.id;
			if (data.error) {
				// that.$vux.toast.text(data.error.message, 'middle');
				return;
			}
			if (id == 104) {
				return;
			}
			this.initMarketSocketOnmessage(data);
			this.initTradeSocketOnmessage(data, id);
			this.initFundSocketOnmessage(data, id);
		}
	}


	this.socketReload = function () {
		assetFlg = 0;
		if (allMarketName.length) {
			that.getSocket.send(socketData(22, allMarketName))
		}
		that.getSocket.send(socketData(10));
	}





	// 初始化 fund
	this.initFund = async function () {
		if (!that.getIsLogin) {
			return;
		}
		if (!fund.isFirst) {
			return;
		}
		// 登录验证
		fund.isFirst = false;
	}


	this.initFundSocketOnmessage = function (data, id) {
		if (data.id == 300) {
			websocketIsLogin = true;
			// TODO: websocket 登录后  进行的操作
			this.initLoginSocket()
		}
		if (data.id == 23) {
			let tmp = that.getFundList;
			if (that.isEmptyObj(tmp)){
				return;
			}
			for (let key in data.result) {
				tmp[key].result = data.result[key];
			}
			that.setFundList(tmp);
			this.formatFoundList();
			if(assetFlg<1){
				that.getSocket.send(socketData(24, Object.keys(tmp)));
			}
			assetFlg += 1;
		}
		if (data.method == trade['204']) {
			let tmp = that.getFundList;
			for (let key in data.params[0]) {
				tmp[key].result = data.params[0][key];
			}
			that.setFundList(tmp);
			this.formatFoundList()
		}
	}

	this.initLoginSocket = function() {
		orderCount = 0
		// allMarketName.forEach((name) => {
		// 	that.getSocket.send(socketData(13, [name, 0, 100]))
		// })
		// new 5-16
		that.getSocket.send(socketData(13, [[], 0, 50]));
		let totalMarket = Object.keys(that.getMarketData.marketList);
		totalMarket.forEach((v,i,a)=>{
			that.getSocket.send(socketData(12, [v,that.getSocketData.systemtime - 86400, that.getSocketData.systemtime, 0, 100]));
		})

		// that.getSocket.send(socketData([], that.getSocketData.systemtime - 86400, that.getSocketData.systemtime, 0, 100))
		this.withdraw();
	}
	this.withdraw = async function () {
		let tmp = {};
		let unOpenList = [],
			openList = [];


		const coinsConfig = await that.coinsConfigFetch()
		if (coinsConfig.Code == 1100) {
			coinsConfig.Content.forEach((obj) => {
				tmp[obj.symbol] = obj.prec_show
			})
			
			that.setCinsConfig(tmp)
		}

		const res = await that.withdrawFetch();
		if (res.Code == 1100) {
			let resArr = Object.keys(res.Content);
			that.setFundList(res.Content);
			this.formatFoundList();
			unOpenList = this.getUnOpenPairCoin(resArr);
			openList = this.getOpenPairCoin(resArr,unOpenList);
			that.getSocket.send(socketData(23, openList));
			that.getSocket.send(socketData(23, unOpenList));
			return;
		}
		that.$alert(res.Msg)
	}

	this.getUnOpenPairCoin = function(data){
		return data.filter(el => !~that.getTradePairCoin.indexOf(el))
	}

	this.getOpenPairCoin = function(data,unOpenlist){
		return data.filter(el => !~unOpenlist.indexOf(el))
	}

	this.formatFoundList = function () {
		let tmp = {};
		let totalRMB = 0,totalBTC = 0,totalFreeze = 0,totalUSD=0;
		for (let key in that.getFundList) {
			let value = that.getFundList[key]
			if (that.isObject(value.result)) {
				tmp[key] = {
					total: this.total(value, key),
					rprice: this.rprice(value, key,"cny"),
					rpriceUsd:this.rprice(value, key,"usd"),
					btc: that.toFixed(this.btc(value, key, 'total'), that.getCinsConfig["BTC"]),
					use: that.toFixed(value.result.available, that.getCinsConfig[key]),
					freeze: that.toFixed(value.result.freeze, that.getCinsConfig[key]),
					freezeBtc: that.toFixed(this.btc(value, key, 'freeze'), that.getCinsConfig["BTC"]),
					name: key,
					deci: that.getCinsConfig[key],
					max_qty: value.max_qty,
					min_qty: value.min_qty,
					fee: value.fee,
					is_deposit: value.is_deposit,
					is_withdraw: value.is_withdraw,
					main_symbol: value.main_symbol,
					isShow: {
						deposit: false,
						withdraw: false
					}
				}
				if (tmp[key].btc != '--' && !isNaN(tmp[key].btc)) {
					totalBTC += parseFloat(tmp[key].btc);
				}
				if (tmp[key].freezeBtc != '--' && !isNaN(tmp[key].freezeBtc)) {
					totalFreeze += parseFloat(tmp[key].freezeBtc);
				}
			}
		}
		// that.exchangeRate['BTC/USDT']
		var cny = that.exchangeRate['BTC/CNY'],
			usd = that.exchangeRate['BTC/USDT'];
		totalRMB = that.toFixed(totalBTC*cny, that.config.cnyCount);
		totalUSD = that.toFixed(totalBTC*usd, that.config.cnyCount);
		totalBTC = that.toFixed(totalBTC, that.getCinsConfig['BTC']);
		totalFreeze = that.toFixed(totalFreeze, that.getCinsConfig['BTC'])
		let data = [tmp, totalRMB, totalBTC,totalFreeze,totalUSD];
		that.setAssetData(data)
	}
	this.btc = function (value, key, type) {
		if (key == 'BTC') {
			return this.total(value, key, type);
		}
		if (that.getMarketData.marketList && !that.getMarketData.marketList[key+'BTC']) {
			if (that.getMarketData.marketList[key+'ETH']) {
				return this.total(value, key, type)*that.getMarketData.marketList[key+'ETH'].result.last*that.getMarketData.marketList['ETHBTC'].result.last;
			}
			return 0
		}
		return this.total(value, key, type)*that.getMarketData.marketList[key+'BTC'].result.last;
	}
	this.rprice = function (value, key,usdOrRmb) {
		// var cny = that.getLanguageType === 'en-US' ? 1 : that.getUSDCNY
		var btc,eth;
		if(usdOrRmb=="cny"){
			btc = this.marketFn.getExchangeRate("cny")['btc']
			eth = this.marketFn.getExchangeRate("cny")['eth']
		}
		else if(usdOrRmb=="usd"){
			btc = this.marketFn.getExchangeRate("usdt")['btc']
			eth = this.marketFn.getExchangeRate("cny")['eth']
		}
		if (key == 'BTC') {
			return that.toFixed(this.total(value, key)*btc, that.config.cnyCount)
		}
		if (that.getMarketData.marketList && !that.getMarketData.marketList[key+'BTC']) {
			if (that.getMarketData.marketList[key+'ETH']) {
				return that.toFixed(this.total(value, key)*that.getMarketData.marketList[key+'ETH'].result.last*eth, that.config.cnyCount);
			}
			return '--'
		}
		return that.toFixed(this.total(value, key)*that.getMarketData.marketList[key+'BTC'].result.last*btc, that.config.cnyCount);
	},
	this.total = function (value, key, type) {
		if (type === 'freeze') {
			return that.toFixed(parseFloat(value.result.freeze), that.getCinsConfig[key])
		}
		return that.toFixed(parseFloat(value.result.available)+parseFloat(value.result.freeze), that.getCinsConfig[key])
	},
	
	this.initTrade = function () {
		if (that.isEmptyObj(that.getSocket)) return;
		that.getSocket.send(socketData(10));
	}

	this.initTradeSocketOnmessage = function(data, id) {
		// 获得服务器时间
		if (id == 10) {
			let tmp = that.getSocketData
			tmp.systemtime = data.result;
			if (tmp.systemtime != '') {
				if (!tmp.start) {
					let klinetmp = that.getDataFeed;
					if (klinetmp.onTimeCallback) {
						klinetmp.onTimeCallback(tmp.systemtime);
					}
				}
				this.sendTradeQuery()
			}
			// that.setSysTime(data.result);
			that.setSocketData(tmp);
		}
		if(id == 12){
			let tmp = that.getOrderHistoryData,
				tmpRecord=data.result.records;
			if(tmpRecord.length>0){
				tmpRecord.forEach((v,i,a)=>{
					tmp.push(v)
				})
			}
			that.setOrderHistoryData(tmp);
		}
		if (id == 13) {
			let tmp = that.getOpenOrderData;
			for (let key in data.result) {
				let obj = data.result[key];
				if (obj.records) {
					tmp = tmp.concat(obj.records)
				}
			}
			that.setOpenOrderData(tmp);
			// 订阅
			that.getSocket.send(socketData(14, allMarketName))
		}
		if (id == 17) {
			that.setHistoryList([])
			that.getSocket.send(socketData(18, [that.socketParamName]))
		}
		if (id == 19) {
			that.setOrderBookData(data.result);
			// that.getSocket.send(socketData(20, [that.socketParamName, 100, Math.pow(10, -that.getDepthPrec).toString()]));
		}
		if (id == 21) {
			let tmp = that.getCurrentMarketData;
			if (that.isEmptyObj(tmp)){
				let market = that.$route.query.market
				if (market) {
					let tmp = null
					if (market.indexOf('/') < 0) {
						tmp = this.getMarketData.marketList[market + 'BTC']
						if (!tmp) {
							tmp = this.getMarketData.marketList[market + 'ETH']
						}
					}else {
						tmp = this.getMarketData.marketList[market.replace('/', '')]
					}
				}else {
					if (that.getMarketData.marketList['ETHBTC']) {
						tmp = that.getMarketData.marketList['ETHBTC'];
					}else {
						tmp = {
							name1: '',
							name2: '',
							result: {}
						}
					}
				}
				
			}
			tmp.result = data.result;
			that.setCurrentMarketData(tmp);
			console.log("query之后")
			that.getSocket.send(socketData(22 ,[that.socketParamName]))
		}

		// 获得k线图数据查询
		if (id == 500) {
			if (data.result) {
				let res = data.result;
				// let res = formatKlineData(data.result);
				let klinetmp = that.getDataFeed;
				//TV klinedata处理
				if (!res.error) {
					//_this._isGettingBar = false;
					var data = res;
					var nodata = data.length === 0;
					var bars = [];
			
					//  data is JSON having format {s: "status" (ok, no_data, error),
					//  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
					var barsCount = nodata ? 0 : data.length;
					var volumePresent = true;
					var ohlPresent = true;
			
					for (var i = 0; i < barsCount; ++i) {
						var barValue = {
							time: data[i][0] * 1000,
							close: data[i][2] * 1
						};
			
						if (ohlPresent) {
							barValue.open = data[i][1] * 1;
							barValue.high = data[i][3] * 1;
							barValue.low = data[i][4] * 1;
						} else {
							barValue.open = barValue.high = barValue.low = barValue.close;
						}
			
						if (volumePresent) {
							barValue.volume = data[i][5] * 1;
						}
			
						bars.push(barValue);
					}
					//debugger
					if (klinetmp.onKlineHrCallback) {
						klinetmp.onKlineHrCallback(bars, {
							noData: nodata,
							nextTime: data.nb || data.nextTime
						});
					}
				} else {
					if (!!onErrorCallback) {
						onErrorCallback(res.error);
					}
					return;
				}

				// that.setKLineData(res)
			}
		}

		// 获得历史订阅数据
		if (data.method == trade['203']) {
			let tmp = that.getHistoryList;
			if (tmp.length == 0) {
				tmp = data.params[1];
			}else {
				// data.params[1].forEach((obj)=>{
				// 	tmp.unshift(obj);
				// })
				[].unshift.apply(tmp, data.params[1])
			}
			tmp = tmp.slice(0, 30);
			that.setHistoryList(tmp)
		}
		if (data.method == trade['200']) {
			let tmp = that.getOrderBookData;
			if (!data.params[0]) {
				if (data.params[1].bids) {
					data.params[1].bids.forEach((obj)=>{
						let isHas = false;
						tmp.bids.forEach((obj1) => {
							if (obj1[0] == obj[0]) {
								obj1[1] = obj[1];
								isHas = true;
							}
						})
						tmp.bids = tmp.bids.filter((obj1) => {
							return obj1[1] != 0
						})
						if (!isHas) {
							tmp.bids.unshift(obj);
						}
					})	
				}
				if (data.params[1].asks) {
					data.params[1].asks.forEach((obj) => {
						let isHas = false;
						tmp.asks.forEach((obj1) => {
							if (obj1[0] == obj[0]) {
								obj1[1] = obj[1];
								isHas = true;
							}
						})
						tmp.asks = tmp.asks.filter((obj1) => {
							return obj1[1] != 0
						})
						if (!isHas) {
							tmp.asks.unshift(obj);
						}
					})	
				}
				that.setOrderBookData(tmp);
			}
			else {
				that.setOrderBookData(data.params[1]);
			}
		}

		// 获取k线图订阅信息
		if (data.method == trade['503']) {
			if (data.params) {
				let res = formatKlineData(data.params);
				var tmp = that.getDataFeed._barsPulseUpdater;
				if (tmp.onKlineUpdateCallback) {
					tmp.onKlineUpdateCallback(data)
				}
				that.setKAddData(res);
				// that.setKLineData(res);
			}
		}
		if (data.method == trade['206']) {
			if (data.params) {
				let tmp = that.getOpenOrderData;
				let tmpHtr = that.getOrderHistoryData;
				// 1:put 2:update 3:finish

				if (data.params[0] == 1) {
					tmp.unshift(data.params[1])

				} else if (data.params[0] == 3) {
					tmp = tmp.filter((obj, index) => {
						return obj.id != data.params[1].id
					})
					tmpHtr.unshift(data.params[1]);

					//交易成功弹窗
					if( data.params[1].left <= 0 ) {
						let timeDeal = 2000;
						setTimeout(() => {
							$("#alert_orderDealSuc").show();
						}, timeDeal);
						setTimeout(() => {
							$("#alert_orderDealSuc").hide();
						}, timeDeal + 2000);
					}

				}else {
					tmp = tmp.map((obj, index) => {
						if (obj.id == data.params[1].id) {
							obj = data.params[1]
						}
						else{
							obj = obj
						}
						return obj;
					})
				}
				
				that.setOpenOrderData(tmp);
				that.setOrderHistoryData(tmpHtr);
			}
		}
	}

	//tradingview
	this.sendTvHt = function(symbol,start,end,type){
		let symbols = symbol.replace("/","")
		that.getSocket.send(socketData(500, [symbols, start, end, type]))
	}

	this.subscribeTv = function(type,symbol){
		let symbols = symbol.replace("/","")
		that.getSocket.send(socketData(501,[symbols,type]))
	}

	this.unsubscribeTv = function(){
		that.getSocket.send(socketData(502,[that.socketParamName]))
	},


	this.sendTradeQuery = function () {
		let tmp = that.getSocketData;
		if (tmp.start) {
			tmp.start = false
			// that.setSocketData(tmp);
			// that.getSocket.send(socketData(107, [that.socketParamName]))
			let resPrec;
			if(!that.getDepthPrec){
				resPrec = that.getCurrentMarketData.prec1
			}else{
				resPrec = that.getDepthPrec
			}
			that.getSocket.send(socketData(20, [that.socketParamName, 100, Math.pow(10, -resPrec).toString()]));
			that.getSocket.send(socketData(18, [that.socketParamName]))
			that.setDepthPrec(that.getCurrentMarketData.prec1)
			// that.getSocket.send(socketData(27, [that.socketParamName, that.getSocketData.systemtime-10800*that.getSocketData.timeType/60, that.getSocketData.systemtime, that.getSocketData.timeType]))
		}else {
			// that.getSocket.send(socketData(27, [that.socketParamName, that.getSocketData.systemtime-10800*that.getSocketData.timeType/60, that.getSocketData.systemtime, that.getSocketData.timeType]))
			// that.getSocket.send(socketData(21, [that.socketParamName, 86400]));
			// that.getSocket.send(socketData(17, [that.socketParamName, 5, 1]));
			// that.marketDealsFetch(that.socketParamName)
			// 	.then(res => {
			// 		if (res.Content) {
			// 			res.Content = res.Content.slice(0, 30);
						// that.setHistoryList(res.Content)
					// }
					
					// that.setOrderBookData(res.Content);
				// })

			// that.getSocket.send(socketData(18, [that.socketParamName]))
			// that.setDepthPrec(that.getCurrentMarketData.prec1)
			// that.orderDepthFetch({
			// 	market: that.socketParamName,
			// 	prec: Math.pow(10, -that.getDepthPrec).toString()
			// }).then(res => {
			// 	that.setOrderBookData(res.Content);
			// })
			// that.getSocket.send(socketData(20, [that.socketParamName, 30, Math.pow(10, -that.getDepthPrec).toString()]));
			// 深度订阅
			
			//that.getSocket.send(socketData(19, [that.socketParamName, 15, Math.pow(10, -that.getDepthPrec).toString()]))
			if (websocketIsLogin) {
				// that.getSocket.send(socketData(13, [that.socketParamName, 0, 100]))
			}
		}
	}

	//获取所有有交易对币种
	this.getTradePairCoin = function(){
		if(!that.isEmptyObj(that.getMarketData)){
			let all = new Set(Object.keys(that.getMarketData["marketList"])),
				tmpSet = new Set(),
				tmpArr = [];
			that.getTotalMarket.forEach((v1,i1,a1)=>{
				all.forEach((v2,i2,a2)=>{
					if(v2.indexOf(v1)>-1){
						let tmpStr = v2.replace(v1,"");
						tmpSet.add(tmpStr)
					}
				})    
			})
			tmpSet.forEach((v,i,a)=>{
				tmpArr.push(v)
			})
			return tmpArr
		}   
		return []
	}



	this.initMarket =  function () {
		
		that.getMarkets()
			.then(res => {
				let tmp = {},
					tmpArr = [];
				res.Content.forEach((obj) => {
					let objName = obj.name.replace('/', ''),
						objNameAfter = obj.name.split('/')[1];
					tmp[objName] = {
						name1: obj.name.split('/')[0],
						name2: '/' + obj.name.split('/')[1],
						name3: obj.name.split('/')[1],
						result: {},
						priceClass: '',
						...obj
					}
					allMarketName.push(objName);
					tmpArr.push(objNameAfter)
				})
				tmpArr = distinctArr(tmpArr);
				that.setTotalMarket(tmpArr);
				
		

				that.marketsList = tmp;
				if (that.$route.query.market) {
					that.setCurrentMarketData(tmp[that.$route.query.market.replace('/', '')]);
				}else {
					if(localStorage.getItem("nowMarket")){
						that.setCurrentMarketData(tmp[localStorage.getItem("nowMarket").replace("/","")]);
					}
					else{
						that.setCurrentMarketData(tmp['ETHBTC']);
					}
				}
				that.setMarketData(that.marketsList)
				//获取有交易对的coin
				that.setTradePairCoin(this.getTradePairCoin())

				// 发送state订阅
				// let total = allMarketName.length;
				// let divide = Math.ceil(total/50);
				// let sliceTmp = Math.ceil(total/divide);
				// console.log(divide)
				// console.log(sliceTmp)
				// console.log(allMarketName.slice(0,  sliceTmp))
				// console.log(allMarketName.slice(sliceTmp,  sliceTmp*2))
				// console.log(allMarketName.slice(sliceTmp*2,  allMarketName.length))

				that.getSocket.send(socketData(22, allMarketName));
				return tmp
			})
			.then(tmp => {
				return that.marketStatus24hFetch()
								.then(res => {
									if (res.Code == 1100) {
										for (const key in res.Content) {
											if (tmp[key]) {
												tmp[key].result = res.Content[key]
											}
										}
									}
									return tmp
								})
			})
			.then(tmp => {
				that.marketsList = tmp;
				if (that.$route.query.market) {
					that.setCurrentMarketData(tmp[that.$route.query.market.replace('/', '')]);
				}else {
					that.setCurrentMarketData(tmp['ETHBTC']);
				}
				that.setMarketData(that.marketsList);
				
				this.initTrade();
				// that.getSocketData.start= true;
				return tmp
			})

	}




	this.initMarketSocketOnmessage = function (data) {
		if (data.id >= 1000) {
			for (let key in that.marketsList) {
				let value = that.marketsList[key]
				if (value.id == data.id-1000) {
					if (key == 'BTCUSDT') {
						that.setBTCUSDT(data.result.last)
					}
					if (key == 'ETHUSDT') {
						that.setETHUSDT(data.result.last)
					}
					that.marketsList[key].result = data.result;
					break;
				}
			}
			that.setMarketData(that.marketsList)
		}

		if (data.method == trade['202']) {

			if (that.isEmptyObj(that.marketsList)) {
				return;
			}
			if (data.params[0] == 'BTCUSDT') {
				that.setBTCUSDT(data.params[1].last)
			}
			if (data.params[0] == 'ETHUSDT') {
				that.setETHUSDT(data.params[1].last)
			}
			
			//给现在的市场赋值
			if (data.params[0] == that.socketParamName) {
				let tmpPast = that.getCurrentMarketData,
					tmpLast = data.params;
			}


			
			if (that.marketsList[data.params[0]].result) {
				if (that.marketsList[data.params[0]].result.last < data.params[1].last) {
					that.marketsList[data.params[0]].priceClass = 'light-green'
				}else if (that.marketsList[data.params[0]].result.last > data.params[1].last){
					that.marketsList[data.params[0]].priceClass = 'light-red'
				}else {
					that.marketsList[data.params[0]].priceClass = ''
				}
			}
			that.marketsList[data.params[0]].result = data.params[1];
			that.setMarketData(that.marketsList);
		}
	}
	this.isCompletedMarketsList = function (data) {
		var isCompleted = true;
		var params = [];
		for (let key in data) {
			let value = data[key]
			if (!value.result.period) {
				// statement
				isCompleted = false;
				break;
			}
			params.push(key);
		}
		return [isCompleted,params];
	}
}
