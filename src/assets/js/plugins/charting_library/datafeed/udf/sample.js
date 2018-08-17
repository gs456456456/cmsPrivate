'use strict';
/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/

var Datafeeds = {};
var hash = {
	"W": 7 * 86400,
	"M": 30 * 86400,
	"D": 86400,
	"1": 60,
	"5": 300,
	"15": 15 * 60,
	"30": 30 * 60,
	"60": 60 * 60,
	"120": 120 * 60,
	"240": 240 * 60,
	"360": 360 * 60,
	"480": 480 * 60,
	"720": 720 * 60
}

Datafeeds.UDFCompatibleDatafeed = function (locale, updateFrequency) {
	this._locale = locale;
	this._configuration = undefined;

	this._symbolSearch = null;
	this._symbolsStorage = null;
	this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
	//this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

	this._enableLogging = false;
	this._initializationFinished = false;
	this._callbacks = {};
	this._currentSubscriptionRecord = null;
	this._socket = null;

	this._initialize();
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
	return {
		supports_search: false,
		supports_group_request: true,
		supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
		supports_marks: false,
		supports_timescale_marks: false
	};
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
	if (this._configuration.supports_time) {

		this._send({
			method: "server.time",
			params: []
		}, function (res) {
			if (!res.error) {
				callback(res.result);
			}
		})
		// this._send(this._datafeedURL + '/time', {})
		// 	.done(function(response) {
		// 		callback(+response);
		// 	})
		// 	.fail(function() {
		// 	});
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
	if (!this._callbacks.hasOwnProperty(event)) {
		this._callbacks[event] = [];
	}

	this._callbacks[event].push(callback);
	return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
	if (this._callbacks.hasOwnProperty(event)) {
		var callbacksChain = this._callbacks[event];
		for (var i = 0; i < callbacksChain.length; ++i) {
			callbacksChain[i](argument);
		}

		this._callbacks[event] = [];
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
	this._initializationFinished = true;
	this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
	if (this._enableLogging) {
		var now = new Date();
		console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function (params, callback, method) {

	if (window.top && window.top.quot && window.top.quot.socket.ready) {
		params.id = window.top.quot.generateId()
		if (params.id) {
			var chart = /chart=(.*?)($|&)/.exec(location.search)
			if (chart && chart.length) {
				chart = chart[1]
			}
			window.top.quot.subscribe(params.id, {
				namespace: "tradingview-" + chart,
				callback: callback
			})
			if (method) {
				window.top.quot.subscribe(method, {
					namespace: "tradingview-" + chart,
					callback: callback
				})
			}
			window.top.quot.socket.send(JSON.stringify(params))
		}
	}
};


Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
	var that = this;

	this._setupWithConfiguration({
		"supports_search": true,
		"supports_group_request": false,
		"supports_marks": true,
		"supports_timescale_marks": true,
		"supports_time": true,
		"exchanges": [{
			"value": "CoinEx",
			"name": "CoinEx",
			"desc": "CoinEx exchange"
		}],
		"symbolsTypes": [{
			"name": "bitcoin",
			"value": "bitcoin"
		}],
		"supportedResolutions": ["1", "5", "15", "30", "60", "120", "240", "360", "720", "D", "W", "M"]
	})

	// this._send(this._datafeedURL + '/config')
	// 	.done(function(response) {
	// 		var configurationData = JSON.parse(response);
	// 		that._setupWithConfiguration(configurationData);
	// 	})
	// 	.fail(function(reason) {
	// 		that._setupWithConfiguration(that.defaultConfiguration());
	// 	});
};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
	var that = this;
	if (this._configuration) {
		setTimeout(function () {
			callback(that._configuration);
		}, 0);
	} else {
		this.on('configuration_ready', function () {
			callback(that._configuration);
		});
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
	this._configuration = configurationData;

	if (!configurationData.exchanges) {
		configurationData.exchanges = [];
	}

	//	@obsolete; remove in 1.5
	var supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
	configurationData.supported_resolutions = supportedResolutions;

	//	@obsolete; remove in 1.5
	var symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
	configurationData.symbols_types = symbolsTypes;

	if (!configurationData.supports_search && !configurationData.supports_group_request) {
		throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
	}

	if (!configurationData.supports_search) {
		this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
	}

	if (configurationData.supports_group_request) {
		//	this component will call onInitialized() by itself
		this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
	} else {
		this.onInitialized();
	}

	this._fireEvent('configuration_ready');
	this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
	// if (this._configuration.supports_marks) {
	// 	this._send(this._datafeedURL + '/marks', {
	// 		symbol: symbolInfo.ticker.toUpperCase(),
	// 		from: rangeStart,
	// 		to: rangeEnd,
	// 		resolution: resolution
	// 	})
	// 		.done(function(response) {
	// 			onDataCallback(JSON.parse(response));
	// 		})
	// 		.fail(function() {
	// 			onDataCallback([]);
	// 		});
	// }
};

Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
	// if (this._configuration.supports_timescale_marks) {
	// 	this._send(this._datafeedURL + '/timescale_marks', {
	// 		symbol: symbolInfo.ticker.toUpperCase(),
	// 		from: rangeStart,
	// 		to: rangeEnd,
	// 		resolution: resolution
	// 	})
	// 		.done(function(response) {
	// 			onDataCallback(JSON.parse(response));
	// 		})
	// 		.fail(function() {
	// 			onDataCallback([]);
	// 		});
	// }
};

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
	var that = this;

	if (!this._initializationFinished) {
		this.on('initialized', function () {
			that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
		});

		return;
	}

	var resolveRequestStartTime = Date.now();
	that._logMessage('Resolve requested');

	function onResultReady(data) {
		var postProcessedData = data;
		if (that.postProcessSymbolInfo) {
			postProcessedData = that.postProcessSymbolInfo(postProcessedData);
		}

		that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));

		onSymbolResolvedCallback(postProcessedData);
	}

	if (!this._configuration.supports_group_request) {
		setTimeout(function () {
			var dest = /dest=(.*?)($|&)/.exec(location.search)
			if (dest && dest.length) {
				dest = dest[1]
			}
			var currency = /currency=(.*?)($|&)/.exec(location.search)
			if (currency && currency.length) {
				currency = currency[1]
			}

			onResultReady({
				name: dest,
				market: dest.toUpperCase() + currency.toUpperCase(),
				"exchange-traded": "",
				"exchange-listed": "",
				timezone: "Asia/Shanghai",
				minmov: 1,
				minmov2: 0,
				pricescale: /cny/i.test(currency) ? 100 : 100000000,
				pointvalue: 1,
				fractional: false,
				session: "24x7",
				has_intraday: true,
				has_no_volume: false,
				ticker: "BTC",
				description: extraLang[that._locale].descriptionTitle + " - " + dest.toUpperCase() + "/" + currency.toUpperCase(),
				type: "bitcoin",
				supported_resolutions: [
					"1",
					"5",
					"15",
					"30",
					"60",
					"120",
					"240",
					"360",
					"720",
					"D",
					"W",
					"M"
				]
			})
		}, 1)

		// this._send(this._datafeedURL + this._symbolResolveURL, {
		// 	symbol: symbolName ? symbolName.toUpperCase() : ''
		// })
		// 	.done(function(response) {
		// 		var data = JSON.parse(response);

		// 		if (data.s && data.s !== 'ok') {
		// 			onResolveErrorCallback('unknown_symbol');
		// 		} else {
		// 			onResultReady(data);
		// 		}
		// 	})
		// 	.fail(function(reason) {
		// 		that._logMessage('Error resolving symbol: ' + JSON.stringify([reason]));
		// 		onResolveErrorCallback('unknown_symbol');
		// 	});
	} else {
		if (this._initializationFinished) {
			this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
		} else {
			this.on('initialized', function () {
				that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
			});
		}
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';

Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
	//	timestamp sample: 1399939200
	//debugger
	if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
		throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
	}

	// this._send(this._datafeedURL + this._historyURL, {
	// 	symbol: symbolInfo.ticker.toUpperCase(),
	// 	resolution: resolution,
	// 	from: rangeStartDate,
	// 	to: rangeEndDate
	// })


	var _this = this
	if (!this._isGettingBar) {
		this._isGettingBar = true
		this._send({
			"method": "kline.query",
			"params": [symbolInfo.market, rangeStartDate, rangeEndDate, hash[resolution]]
		}, function (res) {
			if (!res.error) {

				_this._isGettingBar = false
				var data = res.result
				var nodata = data.length === 0;
				var bars = [];

				//	data is JSON having format {s: "status" (ok, no_data, error),
				//  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
				var barsCount = nodata ? 0 : data.length;

				if (!nodata) {
					_this.cachedKlines = data
				}

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
				onDataCallback(bars, {
					noData: nodata,
					nextTime: data.nb || data.nextTime
				});
			} else {
				if (!!onErrorCallback) {
					onErrorCallback(res.error);
				}
				return;
			}
		})
	}
};

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
	this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
	this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
*/

Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
	//debugger
	this._datafeed = datafeed;
	this._subscribers = {};

	this._requestsPending = 0;
	var that = this;

	var update = function () {
		if (that._requestsPending > 0) {
			return;
		}

		//var hasSubscribe = false
		for (var listenerGUID in that._subscribers) {
			//hasSubscribe = true
			var subscriptionRecord = that._subscribers[listenerGUID];
			var resolution = subscriptionRecord.resolution;
			if (this._currentSubscriptionRecord != subscriptionRecord) {
				var a;
				this._currentSubscriptionRecord = a;
				a =subscriptionRecord;

				(function (_subscriptionRecord) { // eslint-disable-line
					that._requestsPending++;
					that._datafeed._send({
						method: "kline.subscribe",
						params: [_subscriptionRecord.symbolInfo.market, hash[resolution]]
					}, function (res) {
						if (!res.error) {

							that._requestsPending--;

							if (res.method) {
								var bars = res.params;
								//	means the subscription was cancelled while waiting for data
								if (!that._subscribers.hasOwnProperty(listenerGUID)) {
									return;
								}

								if (bars.length === 0) {
									return;
								}

								var data = bars[bars.length - 1];

								var lastBar = {
									time: data[0] * 1000,
									close: data[2] * 1
								};
								lastBar.open = data[1] * 1;
								lastBar.high = data[3] * 1;
								lastBar.low = data[4] * 1;
								lastBar.volume = data[5] * 1;


								if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
									return;
								}

								var subscribers = _subscriptionRecord.listeners;

								//	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
								//	_subscriptionRecord.lastBarTime = NaN
								var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;


								//	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
								//	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
								// if (isNewBar) {
								// 	if (bars.length < 2) {
								// 		throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
								// 	}

								// 	var previousBar = bars[bars.length - 2];
								// 	for (var i = 0; i < subscribers.length; ++i) {
								// 		subscribers[i](previousBar);
								// 	}
								// }

								_subscriptionRecord.lastBarTime = lastBar.time;

								for (var i = 0; i < subscribers.length; ++i) {
									subscribers[i](lastBar);
								}
							} else {
								//console.log("kline璁㈤槄鎴愬姛")
							}
						} else {
							console.error(res.error)
						}
					}, "kline.update")
				})(subscriptionRecord);
			} else {
				//宸茶闃咃紝涓嶉噸澶嶈闃�
			}
		}

		// if(hasSubscribe){
		// 	clearInterval(interval)
		// }
	};
	var interval = setInterval(update, updateFrequency);
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
	this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
	delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, newDataCallback, listenerGUID) {
	this._datafeed._logMessage('Subscribing ' + listenerGUID);

	if (!this._subscribers.hasOwnProperty(listenerGUID)) {
		this._subscribers[listenerGUID] = {
			symbolInfo: symbolInfo,
			resolution: resolution,
			lastBarTime: NaN,
			listeners: []
		};
	}

	this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {
	var daysCount = 0;

	if (resolution === 'D') {
		daysCount = requiredPeriodsCount;
	} else if (resolution === 'M') {
		daysCount = 31 * requiredPeriodsCount;
	} else if (resolution === 'W') {
		daysCount = 7 * requiredPeriodsCount;
	} else {
		daysCount = requiredPeriodsCount * resolution / (24 * 60);
	}

	return daysCount * 24 * 60 * 60;
};

if (typeof module !== 'undefined' && module && module.exports) {
	module.exports = {
		UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed,
	};
}