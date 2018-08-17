export default function(){
    Date.prototype.Format = function (fmt) {
        var o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                if (k == "y+") {
                    fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
                } else if (k == "S+") {
                    var lens = RegExp.$1.length;
                    lens = lens == 1 ? 3 : lens;
                    fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
                } else {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
        }
        return fmt;
    }
    //数组去重
    // Array.prototype.distinct = function(){
    //     var arr = this,
    //      result = [],
    //      i,
    //      j,
    //      len = arr.length;
    //     for(i = 0; i < len; i++){
    //      for(j = i + 1; j < len; j++){
    //       if(arr[i] === arr[j]){
    //        j = ++i;
    //       }
    //      }
    //      result.push(arr[i]);
    //     }
    //     return result;
    // },
    // Array.prototype.remove = function(val) {
    //     var index = this.indexOf(val);
    //     if (index > -1) {
    //     this.splice(index, 1);
    //     }
    // }
}
