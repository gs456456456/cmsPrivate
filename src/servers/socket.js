import pako from 'pako'

// import ReconnectingWebSocket from  '@/assets/js/reconnecting-websocket.js'

// import WebSocketA from 'ws'
if (typeof WebSocket == "undefined") {
	alert('您的浏览器不支持websocket')
}
if (typeof FileReader == "undefined") {
	alert('您的浏览器不支持FileReader')
}



let f = false

export default function () {
	var Socket = {
		socket: '',
		sendData: [],
		fileReader: null,
		blobList: [],
		initSocket (wsurl, type) {
			let options = type == 'gzip' ? ['chat', 'gzip'] : []
			this.socket = new WebSocket(wsurl, options);
			this.fileReader = new FileReader();
			
			// console.log(this.fileReader)
			this.fileReader.addEventListener("loadend", this.fileLoadend);
			this.fileReader.addEventListener("error", this.fileError)


			// this.socket = new ReconnectingWebSocket(wsurl, null, {
			// 	debug: true,
			// 	reconnectInterval: 3000
			// })
			this.socket.onopen = this.onopen;
			this.socket.onclose = this.onclose;
			this.socket.onerror = this.onerror;
			this.socket.onmessage = this._onmessage;
			return this;
		},
		fileLoadend (event) {
			Socket.blobList.shift()
			let text =  pako.inflate(event.target.result, {
				to: 'string'
			});
			Socket.onmessage && Socket.onmessage(text)

			if (Socket.blobList.length) {
				Socket.fileReader.readAsArrayBuffer(Socket.blobList[0])
			}
		},
		fileError (err) {
			console.log(err)
		},
		_onmessage (msg) {
			if (msg.data instanceof Blob) {
				if (!Socket.blobList.length) {
					Socket.blobList.push(msg.data)
					Socket.fileReader.readAsArrayBuffer(Socket.blobList[0])
				}else {
					Socket.blobList.push(msg.data)
				}
			}else {
				Socket.onmessage && Socket.onmessage(msg.data)
			}
			// this.fileReader = new FileReader();
		},
		onopen () {
			console.log('socket 开启')
			if (Socket.sendData) {
				console.log('缓存数据：' + Socket.sendData)
			}
		},
		onerror (err) {
			console.log(err)
		},
		onclose (err) {
			// setTimeout(() => {
			// 	console.log('尝试打开')
			// 	// this.socket.open()
			// }, 1000)
		},
		isExit (obj, obj1, param) {
			var tmp = false;
			for (var i = obj.length - 1; i >= 0; i--) {
				if (obj[param] == obj1[param]) {
					tmp = true
					break;
				}
			}
			return tmp;
		},
		send (data) {
			var dataObj = JSON.parse(data)
			if (dataObj.method != "server.ping") {
				if (!this.isExit(this.sendData, dataObj, 'id')) {
					// statement
					this.sendData.push(data);
				}
			}
			if (this.socket) {
				if (this.socket.readyState == WebSocket.OPEN) {
					// statement
					this.socket.send(data)
				}else if (this.socket.readyState == WebSocket.ERROR && this.socket.readyState == WebSocket.CLOSED) {
					// alert('socket出错')
				}else if (this.socket.readyState == WebSocket.CONNECTING) {
					// statement
					setTimeout(() => {
						this.send(data);
					}, 300)
				}else {
					// statement
					setTimeout(() => {
						this.send(data);
					}, 500)
				}


			}
		}
	}
	return Socket;
};