import {getCookie} from '@/common/cookie.js'

//密码正则
function passwordVerify(pass){
    let tepReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%\^&*?]{8,20}$/
    return tepReg.test(pass)
}

//数组去重
function distinctArr(parm){
    var arr = parm,
    result = [],
    i,
    j,
    len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
        if(arr[i] === arr[j]){
        j = ++i;
        }
    }
     result.push(arr[i]);
}
return result;
}

function removeArr(arr,parm){
    var index = arr.indexOf(parm);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr
}


//对象深拷贝
function clone(obj){
    var ret, k, b;
    if((b = (obj instanceof Array))|| obj instanceof Object){
        ret = b?[]: {};
        for(k in obj){
            if(obj[k] instanceof Array || obj[k] instanceof Object){ret[k] = clone(obj[k]);}else{
                ret[k] = obj[k];
            }

        }
    }

    return ret;
}


function tabFilter(dom) {
    $(dom).click(function () {
        $(this).css({
            "background": "#1ab394",
            "color": "#fff"
        }).siblings().css({
            "background": "#fff",
            "color": "#999999"
        })
    })

}


module.exports={
    passwordVerify
}
// export{ clone,distinctArr,removeArr,formatKlineData,langJudeFn,tabFilter }
