export default function(that){
    //计算涨跌百分比
    this.percentCaculate = function(last,open){
        var tmpPercent = parseFloat(((Number(last)-Number(open))/Number(open))*100).toFixed(2);
        if(isNaN(tmpPercent)||tmpPercent==Infinity){
            tmpPercent =  "0.00"
        }
        return tmpPercent+"%"
    },
    this.percentCaculate2 = function(last,open){
        var tmpPercent = parseFloat(((Number(last)-Number(open))/Number(open))*100).toFixed(2);
        if(isNaN(tmpPercent)||tmpPercent==Infinity){
            tmpPercent =  "0.00"
        }
        return tmpPercent
    },
    this.replaceObjKey = function(obj,orgKey,replaceKey){
        obj[replaceKey] = obj[orgKey];
        // 删除原来的键
        delete obj[orgKey];
    },
    //去除"/“
    this.marketSlash = function(param){
        return param.replace("/","")
    },
    //加"/"
    this.addSlash = function(s1,s2){
        // if(s1==s2.replace("/"))
    }

    // 人民比 算法
    this.rprice = function(p, name) {
        // var cny = this.getLanguageType === 'en-US' ? 1 : this.getUSDCNY
        if (!that.exchangeRate) {
            return 0
        }
        // let usd_cny = this.exchangeRate['USDT/CNY']
        // if (usd_cny > 7) {
        //     usd_cny = this.getUSDCNY
        // }
        // let btc = this.getLanguageType === 'en-US' ? this.exchangeRate['BTC/USDT'] : this.exchangeRate['BTC/CNY']
        // let eth = this.getLanguageType === 'en-US' ? this.exchangeRate['ETH/USDT'] : this.exchangeRate['ETH/CNY']
        // let usd = this.getLanguageType === 'en-US' ? this.exchangeRate['USDT/USDT'] : usd_cny
        
        let rate = this.getExchangeRate()

        // console.log(this.getBTCUSDT)
        if (name == '/BTC') { 
            return that.toFixed(p*rate.btc, that.config.cnyCount);
        }else if(name == '/ETH') {
            return that.toFixed(p*rate.eth, that.config.cnyCount);
        }else if(name == '/USDT') {
            return that.toFixed(p*rate.usd, that.config.cnyCount);
        }
        return 0;
    }
    this.getExchangeRate = function (type) {
        if (!that.getUSDCNY) {
            console.warn('exchangeRate 为空')
        }
        // if (!that.getBTCUSDT) {
        //     console.warn('getBTCUSDT 为空')
        // }
        let btc,usd,eth = 0
        let usd_cny = that.getUSDCNY
        // if (usd_cny > 7) {
        //     usd_cny = that.getUSDCNY
        // }
        let cny = that.getLanguageType === 'en-US' ? 1 : usd_cny
        if (type) {
            if (type=="usdt") {
                cny = 1
            }
            if (type=="cny") {
                cny = usd_cny
            }
        }
    
        btc = that.getBTCUSDT * cny || that.exchangeRate['BTC/USDT'] * cny
        usd = 1 * cny
        eth = that.getETHUSDT * cny || that.exchangeRate['ETH/USDT'] * cny
        return {
            btc,
            usd,
            eth
        }
    }
    this.changeRpriceSymbol=function(){
        if(that.getLanguageType =="zh-CN"){
            return "¥"
        }
        else if(that.getLanguageType =="en-US"){
            return "$"
        }
    }
}


