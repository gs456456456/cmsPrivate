let IP = '10.10.1.20';
const version = '1.0.2'
const config = {
	BASEURL: `http://${IP}`,
	WSUTCDURL: 'wss://stream2.binance.com:9443/ws/ethusdt@aggTrade.b10',
	BTCIntervalTime: 300000,
	symbolsIntervalTime: 60000,
	cnyCount: 4,
}
export default config