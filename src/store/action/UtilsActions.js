import axios from 'axios'
import config from '@/config'
import utils from '@/assets/js/utils.js'
// var msgpack = require("msgpack-lite");

export default {
  fetchAsync: async (ctx, param) => {
    
    let requestUrl =  (param.BASEURL || config.BASEURL) + param.url

    let requestMethod = param.method || 'GET'
    let requestHeaders = {
      // "Content-type": "text/plain;charset=UTF-8",
      // "Content-type": "application/x-www-form-urlencoded",
      // "Accept": "application/json",
      //"Access-Control-Allow-Origin": "*",
      // "authorization": sessionStorage.getItem("jwt"),
      ...param.headers
    }

    param.body = utils.clearNullParams(param.body)
    axios.defaults.withCredentials =  true //设置是否使用cookie，
    if (param.withCredentials === false) {
      axios.defaults.withCredentials = param.withCredentials;
    }



    //JSON or FormData
    if (param.type === 'payload') {
      param.body = JSON.stringify(param.body)

    }else {
      // data数据转换成formdata
      axios.defaults.transformRequest =[function(data){
        if (data !== null && typeof data === 'object') {
          let newData =''
          for(let k in data){
            newData +=encodeURIComponent(k)+'='+encodeURIComponent(data[k])+'&'
          }
          newData = newData.slice(0, -1)
          return newData
        }
        return data
      }]
    }
    let res = null;
    if(requestMethod=="POST"){
      // res = msgpack.decode(Buffer(await axios({
        res = await axios({
          method: requestMethod,
          url: requestUrl,
          headers: requestHeaders,
          // params: param.body,
          data: param.body
        })
      // ))
    }
    else {
      // res = msgpack.decode(Buffer(await axios({
        res = await axios({
          method: requestMethod,
          url: requestUrl,
          headers: requestHeaders,
          params: param.body
          // data: param.body
        })
      // ))
    }

    // if (res.data.Code == 1206) {
    //   ctx.dispatch('exitLogin');
    // }
    return res;



  },
}
