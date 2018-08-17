<template>
    <div class="footers">
        <div class="container-fluid">
            <div class="container-fluid f_contanier">
                <div class="row">
                    <dl class="col-md-2 col-sm-6 col-xs-12 text-left dl_links">
                        <dt>{{$t['footer_title1']}}</dt>
                        <dd><router-link to="/support?page=aboutUs">{{$t['footer_text_a1']}}</router-link></dd>
                        <dd><router-link to="/support?page=referralProgram">{{$t['footer_text_a2']}}</router-link></dd>
                        <dd><router-link to="/support?page=eliteProgram">{{$t['footer_text_a3']}}</router-link></dd>
                        <dd><router-link to="/support?page=privacyPolicy">{{$t['footer_text_a4']}}</router-link></dd>
                        <dd><router-link to="/support?page=serviceTerm">{{$t['footer_text_a5']}}</router-link></dd>
                    </dl>
                    <dl class="col-md-2 col-sm-6 col-xs-12 text-left dl_links">
                        <dt>{{$t['footer_title2']}}</dt>
                        <dd><router-link to="/support?page=fees">{{$t['footer_text_b1']}}</router-link></dd>
                        <dd>
                            <a  
                                @click="blankLink(`return_to=https%3A%2F%2Fhelp.hotbit.io%2Fhc%2F${getLanguageType=='en-US'?'en-us':'zh-cn'}%2Farticles%2F${getLanguageType=='en-US'?'115005055073':'115004860653'}&timestamp=1529051161`)"
                                href="Javascript:;">
                            {{$t['footer_text_b2']}}
                            </a>
                        </dd>
                    </dl>

                    <!-- todo -下面两个链接中间的zh-CN需要转成小写 -->
                    <dl class="col-md-2 col-sm-6 col-xs-12 text-left dl_links">
                        <dt>{{$t['footer_title3']}}</dt>
                        <dd><router-link to="/support?page=quickStart">{{$t['footer_text_c1']}}</router-link></dd>
                        <dd><router-link to="/support?page=api">{{$t['footer_text_c2']}}</router-link></dd>
                        
                        <dd>
                            <a 
                                @click="blankLink(`brand_id=114094902134&locale_id=1&return_to=https%3A%2F%2Fhelp.hotbit.io%2Fhc%2F${getLanguageType=='en-US'?'en-us':'zh-cn'}%2Fsections%2F115001057013-%25E5%25B8%25B8%25E8%25A7%2581%25E9%2597%25AE%25E9%25A2%2598&timestamp=1529041813`)"
                                href="Javascript:;">
                            {{$t['footer_text_c3']}}
                            </a>
                        </dd>
                    </dl>   
                    <dl class="col-md-2 col-sm-6 col-xs-12 text-left dl_links">
                        <dt>{{$t['footer_title4']}}</dt>
                        <dd>
                            <a
                                @click="blankLink(`brand_id=114094902134&locale_id=1&return_to=https%3A%2F%2Fhelp.hotbit.io%2Fhc%2F${getLanguageType=='en-US'?'en-us':'zh-cn'}%2Frequests%2Fnew&timestamp=1529041912`)"
                                href="Javascript:;">
                            {{$t['footer_text_d1']}}
                            </a>
                        </dd>
                    </dl>

                    <!-- <dl class="col-md-1 col-sm-6 col-xs-12 text-left dl_links">
                        <dt>{{$t['footer_title5']}}</dt>
                        <dd><router-link to="Javascript:;"><span>BTC: </span><span class="exchangeVal footerval1">0</span></router-link></dd>
                        <dd><router-link to="Javascript:;"><span>ETH: </span><span class="exchangeVal footercal3">0</span></router-link></dd>
                    </dl> -->
                    <div class="col-md-4 col-sm-12 col-xs-12 f_info">
                        <div class="f_logo">
                           <img src='/static/img/logo1.png'>
                            <span>HOTBIT</span>
                        </div>
                        <div class="f_links">
                            <a href="https://www.weibo.com/hotbitio" target="_blank"><i class="fa fa-weibo" ></i></a>
                            <a href="https://twitter.com/Hotbit_io" target="_blank"><i class="fa fa-twitter"></i></a>
                            <a href="https://facebook.com/Hotbit.io" target="_blank" ><i class="fa fa-facebook"></i></a>
                            <a :href="getLanguageType=='zh-CN' ? 'https://t.me/Hotbit_Chinese' : 'https://t.me/Hotbit_English'" target="_blank" class="tlgrm_links"><i class="fa fa-paper-plane"></i></a>
                            <a href="Javascript:;" class="shares_wechat">
                                <i class="fa fa-wechat"></i>
                                <span class="shares_wechat_img">
                                    <img src="/static/img/footer-wechat.jpg">
                                </span>
                            </a>
                        </div>
                        <p class="f_state">Copyright © 2017-2018 hotbit.io. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: 'HFooter',
    data(){
        return {
            
        }
    },
    computed: {
        ...mapGetters([
            "getLanguageType",
        ]),
    },
    methods:{
        ...mapActions([
            "helpFetch",
            "siteMaintenance"
        ]),
        async blankLink(link) {
            let res = await this.helpFetch(link);
            if(res.Code == 1100) {
                if( res.Content['redirect'] ){
                    window.open(res.Content['redirect'])
                    //window.open (res.Content['redirect'],'newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')   
                }
           }
        },
        
    },
    mounted(){

    },
}
</script>
