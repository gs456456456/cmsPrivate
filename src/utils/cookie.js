
function getCookie(cookieName) {
    var strCookie = document.cookie,
        arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
            return arr[1];
        }
    }
    return "";
}
function setCookie(name,value){
    var Days = 30,
        exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);

    var domain = ".hotbit";
    if(document.location.href.indexOf(domain)>-1){
        if(document.location.href.indexOf("io")>-1){
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+`;path=/;domain=.hotbit.io;`;
        }
        else{
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+`;path=/;domain=.hotbit.pro;`;
        }

    }else {
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
    }
}
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

//Todo
export{ getCookie, setCookie, delCookie }
