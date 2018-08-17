import {getCookie} from '@/common/cookie.js'

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

function formatKlineData(data){
    let formatobj = {"success":true,"data":{"lines":[]}};
    data.forEach((v,i,a)=>{
        let close=Number(v[2]);
        v[1] = Number(v[1]);
        v[3] = Number(v[3]);
        v[4] = Number(v[4]);
        v[5] = Number(v[5]);

        removeArr(v,v[2]);
        removeArr(v,v[5]);
        removeArr(v,v[5]);
        v.splice(4,0,close)
    })
    formatobj["data"]["lines"] = data
    return formatobj
}

//cn/us
function langJudeFn(fn1,fn2){
    if(getCookie("lang")=="en-US"){
        fn1();
    }else{
        fn2();
    }
}

module.exports={
    clone,distinctArr,removeArr,formatKlineData,langJudeFn,tabFilter
}
// export{ clone,distinctArr,removeArr,formatKlineData,langJudeFn,tabFilter }
