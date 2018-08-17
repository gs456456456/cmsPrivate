// import BigInt from 'BigInt'
import 'jsencrypt';

export class keySolve{
    constructor(vueObj) {
        this.vueObj = vueObj;
        this.aesKey = "";
    }
    static changeBase64(param){
        return window.btoa(param)
    }
    getAesKey(len) {　　
        len = len || 32;　　
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
        var maxPos = $chars.length;　　
        var keyStr = '';　　
        for(let i = 0; i < len; i++) {　　　　
            keyStr += $chars.charAt(Math.floor(Math.random() * maxPos));　　
        }　　
        this.aesKey = keyStr;
        return keyStr;
    }
    b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    main(){
        // this.getAesKey();
        // this.vueObj.rsaFetch().then((res)=>{
        //     if(res.Code==1100){
                var encrypt=new JSEncrypt();
                encrypt.setPublicKey(this.b64DecodeUnicode(this.vueObj.getInfo.pkey));

                // this.aesKey = keySolve.changeBase64(this.aesKey);
                this.vueObj.setRsaKey(encrypt)
        //     }
        // })

    }

}

