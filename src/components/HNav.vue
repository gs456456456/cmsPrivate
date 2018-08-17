<template>
    <div class="nav">
        <div 
            class="container-fluid navContainer"
            :class="isNavBg">
            <div class="container-fluid navBar" style="z-index:20000">
                <div class="row">
                    <div class="nav_logo">
                        <router-link to="/">
                            <img src='/static/img/logo1.png'>
                            <span>HOTBIT</span>
                        </router-link>
                        <ul class="nav_menuLogo">
                            <li class="icon_bar"></li>
                            <li class="icon_bar"></li>
                            <li class="icon_bar"></li>
                        </ul>
                    </div>

                    <ul class="nav_menu">
                        <template v-if="getIsLogin">
                            <li><router-link id="exchangePage" class="navMenu_title" to="/exchange">{{$t['nav_exchange']}}</router-link></li>
                            <!-- <li><a href="Javascript:;" class="navMenu_title" @click.stop="investLink()">{{$t['nav_invest']}}
                            <i class="fa fa-caret-down"></i></a>
                                <ol class="navMenu_content" v-show="investInfo">
                                    <li><router-link to="/invest/index">{{$t["nav_productlist"]}}</router-link></li>
                                    <li><router-link to="/invest/records/page">{{$t["nav_myproduct"]}}</router-link></li>
                                    <li><router-link to="/invest/collect/page">{{$t["nav_mycollect"]}}</router-link></li>
                                </ol>
                            </li> -->
                            
                            <li>
                                <a
                                    class="navMenu_title" 
                                    @click.stop="fundLink()"
                                    href="Javascript:;">
                                    {{$t['nav_funds']}}
                                    <i class="fa fa-caret-down"></i>
                                </a>
                                <ol 
                                    class="navMenu_content"
                                    v-show="fundInfoMenu">
                                    <li><router-link to="/dw">{{$t['nav_dandw']}}</router-link></li>
                                    <li><router-link to="/fund/history">{{$t['nav_history']}}</router-link></li>
                                </ol>
                            </li>
                            <li>
                                <router-link class="navMenu_title" to="/trade/history">{{$t['nav_orders']}}</router-link>
                            </li>
                        </template>
                        <template v-else>
                            <li class="c">
                                <router-link to="/">{{$t['nav_home']}}</router-link>
                            </li>
                            <li style="position:relative;" class="hoverOpen myexchangea">
                                <router-link id="exchangePage" to="/exchange">{{$t['nav_exchange']}}</router-link>
                            </li>
                            <!-- <li><router-link to="/invest/index">{{$t['nav_invest']}}</router-link></li> -->
                        </template>
                        

                        <li>
                            <a 
                                @click="blankLink(`brand_id=114094902134&locale_id=1&return_to=https%3A%2F%2Fhelp.hotbit.io%2Fhc%2F${getLanguageType=='en-US'?'en-us':'zh-cn'}%2Fsections%2F115001049054-News-and-Announcements&timestamp=1529042066`)"
                                href="Javascript:;">
                                {{$t['nav_news']}}
                            </a>
                        </li>
                        <li>
                            <a 
                                @click="blankLink(`brand_id=114094902134&locale_id=1&return_to=https%3A%2F%2Fhelp.hotbit.io%2Fhc%2F${getLanguageType=='en-US'?'en-us':'zh-cn'}%2Fsections%2F115001057013-FAQ-Frequently-Asked-Questions&timestamp=1529042107`)"
                                href="Javascript:;">
                                {{$t['nav_support']}}
                            </a>
                        </li>

                        
                        <template v-if="!getIsLogin">
                            <li>
                                <router-link  to="/login">  {{$t['nav_login']}} </router-link>
                            </li>
                            <li>
                                <router-link to="/register">{{$t['nav_register']}}</router-link>
                            </li>
                        </template>
                        <template v-else>
                            <li><router-link class="navMenu_title" to="/usercenter">{{$t['nav_account']}}</router-link></li>
                            <li>
                                <a 
                                    class="navMenu_title myhaslogin" 
                                    href="Javascript:;"
                                    @click="exitFn()">
                                <i class="fa fa-sign-out"></i>{{$t['nav_logout']}}
                                </a>
                            </li>
                        </template>
                        <li class="nav_moon" v-if="isShowMoon"></li>
                        <li>
                            <div class="nav_menu_last">
                                <img class="nav_language_img" 
                                    @click.stop="LangFn()"
                                    :src="getLanguageType == 'zh-CN' ? '/static/img/china.png' : '/static/img/United-Kingdom.png'">
                                <div 
                                    class="nav_language" 
                                    v-show="langInfo">
                                    <a class="english" href="Javascript:;" @click="changeLanguage('en-US')">English</a>
                                    <a class="chinese" href="Javascript:;" @click="changeLanguage('zh-CN')">简体中文</a>
                                </div>
                            </div>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import  "@/static/css/components/nav.less";
import nav from "@/static/js/nav.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { setCookie,getCookie } from "@/common/cookie";
import userCenter from "@/static/js/userCenter.js";
import config from "@/config/index.js";
import {nacRenderTo} from '../common/nvc.js';

export default { 
    name: 'HNav',
    data() {
        return {
            isNight:false,
            fundInfoMenu:false,
            langInfo:false,
            investInfo:false,
        }
    },
	computed: {
        ...mapGetters([
            "getIsLogin",
            "getIsNight",
            "getLanguageType",
        ]),
        isShowMoon() {
            if ( this.$route.path.indexOf("/exchange") > -1 ) {
                return true;
            }
        },
        isNavBg() {
            if( this.$route.name && this.$route.name.indexOf("Index") == -1 ){
                return "active-navContainer"
            }
        },
        routeInfo() {
            return this.$route
        }
	},
    methods:{
        ...mapMutations([
            "setIsLogin",
            "setLanguageType",
            "setIsNight",
            "setNews",
            "setBanner1",
            "setSupportInfo"
        ]),
        ...mapActions([
            "exitLogin",
            "noticeFetch",
            "helpFetch",
            "bannersFetch",
            "siteMaintenance"
		]),
        async changeLanguage(lang){
            let that = this;
            if( lang == "en-US" ){
                setCookie("lang","en-US");
                nacRenderTo("nvcid1")
            }
            else{
                setCookie("lang","zh-CN");
                nacRenderTo("nvcid2")
            }
            this.setLanguageType(lang);
            //重新调用其他JS todo 切换中英文问题
            // const nextRoute = ['/usercenter'];
            // if(nextRoute.indexOf(this.routeInfo.path) > -1 ) {
            //     this.userCenterReload()
            // }
            
            //重发新闻
            this.noticeFetch()
                .then((res) => {
                    if (res.Code == 1100) {
                        that.setNews(res.Content)
                    }
                }).catch((e) => {
                    this.$alert(e)
                })
            //重发banner
            this.bannersFetch({
                terminal:1,
                type:1
            }).then(res => {
                if (res.Code == 1100) {
                    this.setBanner1(res.Content);
                } 
            });

            //重发support
            if(this.$route.name == "Support"){
                let res = await this.helpFetch('page='+this.$route.query.page);
                if(res.Code == 1100) {
                    that.setSupportInfo(res.Content);
                }
            }
        },
        LangFn() {
            if(this.langInfo){
                this.langInfo = false;
                return 
            }
            this.langInfo = true;
        },
        investLiClick(){
            this.investInfo = false
        },
        investLink(){
            this.investInfo = !this.investInfo;
            this.fundInfoMenu = false;
        },
        fundLink() {
            this.investInfo = false;
            if(this.fundInfoMenu){
                this.fundInfoMenu = false;
                return
            }
            this.fundInfoMenu = true;
        },
        documentFn() {
            document.addEventListener('click', ()=>{
                this.fundInfoMenu = false;
                this.langInfo = false;
                this.investInfo = false;
            })
        },
        exitFn() {
            this.exitLogin ();
            const nextRoute = ['/dw', '/fund/history', '/trade/history', '/usercenter'];
            if( nextRoute.indexOf(this.routeInfo.path) > -1 ) {
                this.$router.push("/login");
                return
            }
        },
        async blankLink(link) {
            let res = await this.helpFetch(link);
            if(res.Code == 1100) {
                if( res.Content['redirect'] ){
                    window.open(res.Content['redirect'])
                    //window.open (res.Content['redirect'],'newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')   
                }
           }
        },
        userCenterReload(){
            var pageCurrent = 1,
                pageNumInit = 20,
                testUrl = config.BASEURL,
                that = this;
                    //第一次请求Google验证
                $.ajax({
                    type: "get",
                    url: testUrl+"/google_auth",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (data) {
                        var googlepass;
                        var googleauth;
                        var img2;
                        var googlekey;
                        if (data.Code === 1100) {
                            img2 = data.Content['Image'];
                            googlekey = data.Content['GoogleKey'];
                            $("#googleimg").attr("src", "data:image/png;base64," + img2);
                            $("#googlekey").val(googlekey);
                            $("#enablevalue").val(that.$t["ucenable"]);
                            //第一次判断
                            $('#enablevalue').addClass("Enable");
                            $('#enablevalue').removeClass("Disable");
                            $("#enablevalue").removeClass("btn_enable");
                            firstenableordisable($("#enable"), $("#enablevalue"), $(".user_alertEnable"), $("#user_alertDisableGogo"), $(".user_alertChange_close"), googleComfirmFunc, googleunbindFunc, "Enable", "Disable");
                        } else if (data.Code === 1212) {
                            //resetnewpassDisableGogo
                            $('#enablevalue').val(that.$t["ucdisable"]);
                            //第一次判断
                            $('#enablevalue').addClass("Disable");
                            $("#enablevalue").addClass("btn_enable");
                            $('#enablevalue').removeClass("Enable");
                            firstenableordisable($("#enable"), $("#enablevalue"), $(".user_alertEnable"), $("#user_alertDisableGogo"), $(".user_alertChange_close"), googleComfirmFunc, googleunbindFunc, "Enable", "Disable");
                        } else {
                            // $("#tishi3").text(that.$t["tryagain"])
                        }
                    }
                })
            // //api_info
            // function apiInsertInfoFn(newid, creatnewinput, newkey, newsecret) {
            //     var apiInsertInfo = `
            //     <div class="api_info">
            //         <div class="api_id" style="display:none;">${newid}</div>
            //         <div class="title clearfix">
            //             <span class="pull-left api_info_name">${creatnewinput}</span>
            //             <span class="pull-right icons api_title_icons">
            //                 <span class="mainInfo_chevron">
            //                     <i class="fa fa-chevron-up"></i>
            //                 </span>
            //             <i class="glyphicon glyphicon-wrench edit_apInfo"></i>
            //             <i class="fa fa-close api_title_icons_deleteS"></i>
            //             </span>
            //         </div>
            //         <div class="mainInfo clearfix">
            //             <div class="col-sm-2 ewm">
            //                 <div class="lockImg"><i class="fa fa-lock"></i></div>
            //             </div>
            //             <div class="col-sm-10 mainInfo_content">
            //                 <p class="mainInfo_content_title">${ that.$t["user_apikey"] }: </p>
            //                 <p class="mainInfo_content_info">${newkey}</p>
            //                 <p class="mainInfo_content_title">${that.$t["user_secret"] }: </p>
            //                 <p class="mainInfo_content_info">${newsecret}</p>
            //                 <p  class="mainInfo_content_title">${that.$t["user_option"]}:</p>
            //                 <div class="clearfix">
            //                     <div class="pull-left mainInfo_switch">
            //                         <div class="mainInfo_switch_contanier">
            //                             <div class="switch_outbox switch_outbox1">
            //                                 <div class="switch_innerbox">
            //                                     <span class="switch_on">ON</span>
            //                                     <span class="switch_label">&emsp;</span>
            //                                     <span class="switch_off">OFF</span>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                         <span>${that.$t["user_readinfo"]}</span>
            //                     </div>
            
            //                     <div class="pull-left mainInfo_switch">
            //                         <div class="mainInfo_switch_contanier">
            //                             <div class="switch_outbox switch_outbox2">
            //                                 <div class="switch_innerbox">
            //                                     <span class="switch_on">ON</span>
            //                                     <span class="switch_label">&emsp;</span>
            //                                     <span class="switch_off">OFF</span>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                         <span>${that.$t["user_enabletra"]}</span>
            //                     </div>
            
            //                     <div class="pull-left mainInfo_switch mainInfo_switch_off">
            //                         <div class="mainInfo_switch_contanier">
            //                             <div class="switch_outbox switch_outbox3">
            //                                 <div class="switch_innerbox">
            //                                     <span class="switch_on">ON</span>
            //                                     <span class="switch_label">&emsp;</span>
            //                                     <span class="switch_off">OFF</span>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                         <span class="text">${that.$t["user_enablewit"]}</span>
            //                         <i class="glyphicon glyphicon-exclamation-sign">
            //                             <div class="mainInfo_switch_exclamation">${that.$t["user_reminds1"]}</div>
            //                         </i>
            //                     </div>
            //                 </div>
            
            //                 <p  class="mainInfo_content_title">${that.$t["user_white"]}:</p>
            //                 <div class="mainInfo_content_info_ip">
            //                     <input type="text" value="">
            //                     <button><i class="fa fa-save"></i>${that.$t["user_save"]}</button>
            //                 </div>
            //                 <div class="whiteIPRemind"></div>
            //                 <div class="mainInfo_show">
            //                     <button class="user-s2-authShow"><i class="fa fa-eye"></i>${that.$t["user_show"]}</button>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     `;
            
            //     return apiInsertInfo;
            // }
            // //switch初始状态
            // function switchInit(data) {
            //     var infos = data.Content;
            
            //     if (infos) {
            //         infos.forEach(function (info, i) {
            //             //判断开关的状态
            //             if (info.fisreadinfo != 1) {
            //                 switchInitSameChge($(".switch_outbox1").eq(i));
            //             } else {
            //                 switchInitSameInit($(".switch_outbox1").eq(i));
            //             }
            
            //             if (info.fistrade != 1) {
            //                 switchInitSameChge($(".switch_outbox2").eq(i));
            //             } else {
            //                 switchInitSameInit($(".switch_outbox2").eq(i));
            //             }
            
            //             if (info.fiswithdraw != 1) {
            //                 switchInitSameChge($(".switch_outbox3").eq(i));
            //             } else {
            //                 switchInitSameInit($(".switch_outbox3").eq(i));
            //             }
            
            //             //判断whiteIP的状态
            //             if (info.whiteips) {
            //                 var whiteIPArry = info.whiteips.split(",");
            
            //                 if (whiteIPArry.length) {
            //                     $(".mainInfo_content_info_ip input").eq(i).val("***");
            //                 } else {
            //                     $(".mainInfo_content_info_ip input").eq(i).val("");
            //                 }
            //             }
            //         });
            //     }
            // }
            // //编辑api
            // function editApInfoFn() {
            //     $(".api_info .edit_apInfo").click(function () {
            //         gaSmsJudeFn();
            
            //         var editLabelP = $(this).parents(".api_info"),
            //             inputEdit = editLabelP.find(".mainInfo_content_info_ip input"),
            //             thiSwitchOutbox = editLabelP.find(".switch_outbox"),
            //             editid = editLabelP.find(".api_id").text();
            
            //         $("#cancelone").off("click");
            //         $("#cancelone").click(function () {
            //             var thisP = $(this).parents("#user_alert_authShow"),
            //                 gaCode = thisP.find("#showgoogle").val(),
            //                 smsCode = thisP.find("#sms_code").val();
            
            //                 editApiAjaxFn(gaCode, smsCode, thiSwitchOutbox, editLabelP, inputEdit, thisP);
            //         });
            //     })
            // }

                
            // //显示api信息
            // function showApiFn(showThis, thisPShow, thisPAlert, gaCodeVal, smsCodeVal) {
            //     var thisid = thisPShow.find(".api_id").text(),
            //         whiteIpLabel = thisPShow.find(".mainInfo_content_info_ip input"),
            //         apikey = thisPShow.find(".mainInfo_content_info").eq(0),
            //         secretInfo = thisPShow.find(".mainInfo_content_info").eq(1),
            //         imgLabel = thisPShow.find(".lockImg");
            
            //     $.ajax({
            //         type: "post",
            //         url: testUrl+"/user/show_api",
            //         data: {
            //             id: thisid,
            //             gacode: gaCodeVal != undefined ? gaCodeVal : "",
            //             smscode: smsCodeVal != undefined ? smsCodeVal : ""
            //         },
            //         xhrFields: {
            //             withCredentials: true
            //         },
            //         crossDomain: true,
            //         success: function (data) {
            //             var remindsinfo,
            //                 langp = that.$t;
            
            //             switch (data.Code) {
            //                 case 1100:
            //                     thisPAlert.hide();
            //                     thisPAlert.find(".gaData_reminds").text("");
            //                     thisPAlert.find("#showgoogle").val("");
            
            //                     var showkey = data.Content['fkey'],
            //                         showsecret = data.Content['fsecret'],
            //                         showhiteip = data.Content['whiteips'];
            
            //                     apikey.text(showkey);
            //                     secretInfo.text(showsecret);
            //                     whiteIpLabel.val(showhiteip);
            //                     imgLabel.html(`<img class="imgRp" src="data:image/png;base64,${data.Content['image']}">`);
            //                     showThis.parents(".mainInfo_show").hide();
            //                     break;
            //                 case 1201:
            //                     remindsinfo = langp["exchange1201"];
            //                     break;
            //                 case 1301:
            //                     remindsinfo = langp["code1301"];
            //                     break;
            //                 case 1300:
            //                     remindsinfo = langp["rg1201"];
            //                     break;
            //                 case 1307:
            //                     remindsinfo = langp["code1307"];
            //                     break;
            //                 case 1208:
            //                     remindsinfo = langp["code1208"];
            //                     break;
            //                 case 1231:
            //                     remindsinfo = langp["code1231"];
            //                     break;
            //                 default:
            //                     remindsinfo = data.Msg;
            //             }
            //             thisPAlert.find(".reminds").text(remindsinfo);
            //         }
            //     })
            // }
            // /*save按钮点击*/
            // function whiteIPsavefn() {
            //     $(".mainInfo_content_info_ip button").click(function () {
            //         lang = getCookie("lang");
            
            //         var _this=$(this),
            //             thisIpP = _this.parents(".api_info"),
            //             thisIpId = thisIpP.find(".api_id").text(),
            //             inputVal = _this.prev().val(),
            //             inputValSp = inputVal.split(","),
            //             valR = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            
            //         function confirmval() {
            //             for (var temp1 = 0; temp1 < inputValSp.length; temp1++) {
            //                 if (!inputValSp[temp1].match(valR)) {
            //                     return false;
            //                 }
            //             }
            //         }
            
            //         if(inputVal.length>0){
            //             var res = confirmval();
            //             if (res === false) {
            //                 $(this).parent().siblings(".whiteIPRemind").text(that.$t["ip_1"]);
            
            //             } else {
            //                 whiteIpSendFn(inputVal, thisIpId,_this);
            //             }
            
            //         }else{
            //             whiteIpSendFn(inputVal, thisIpId,_this);
            //         }
            
            //         $(this).prev().css({width: "100%"});
            //         $(this).css({display: "none"});
            //     });
            // }
            
            // //添加api后调用的js函数
            // function afterApiAddFn() {
            //     $(".api_info .mainInfo:gt(0)").css({
            //         display: "none"
            //     });
            //     $(".api_title_icons .fa-chevron-up:gt(0)").attr("class", "fa fa-chevron-down");
            
            //     ssChangs("#user_alertDeleteAll", ".api_title_icons_deleteS", ".user_DeleteAll_close");
            //     ssChangs("#user_alertDeleteS", ".user-s2-deleteAll", ".user_DeleteS_close");
            //     delapi();
            // }
                
            // //删除api
            // function delapi() {
            //     $(".api_title_icons_deleteS").click(function () {
            //         var this1 = $(this);
            //         var delid = $(this).parents(".api_info").find(".api_id").text();
            //         $(".deleteAll_alert .text2").text($(this1).parent().siblings(".api_info_name").text());
            //         $("#user_alertDeleteAll").show();
            
            //         $('.delapi').click(function () {
            //             $(this).parents("#user_alertDeleteAll").hide();
            
            //             gaSmsJudeFn();
            //             submitSmsGaFn(delid, this1, "notall");
            
            //         })
            //     });
            // }

            // $.ajax({
            //     url:testUrl + '/user/api_list?page=' + pageCurrent + "&size=" + pageNumInit,
            //     type: 'GET',
            //     dataType: 'JSON',
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     crossDomain: true,
            //     success: function (data) {
            //         if (data.Code == 1100) {
            //             var apiInsert;
            //             var dataCont = data.Content;
            //             var totalHtml = '';
            //             $('.api_info_contain').html("")
            //             $.each(dataCont, function (k, v) {
            //                 var newid = v.fid,
            //                     creatnewinput = v.label,
            //                     newkey = "***",
            //                     newsecret = "***";
            //                     totalHtml+= `${apiInsert=apiInsertInfoFn(newid,creatnewinput,newkey,newsecret)}`
            //             })
            //             $('.api_info_contain').append(totalHtml);
            //                 afterApiAddFn(); //add 后js函数调用
            //                 switchInit(data); //开关状态
            //                 editApInfoFn();
            //                 $(".mainInfo_content_info_ip input").prop("readonly", "true");
            //                 showapi();
            //                 whiteIPsavefn();
            //         }
            //     }
            // })
            
        }

    },
    mounted(){
        this.documentFn();
        nav(this);
    },
    
}
</script>


<style>

</style>

