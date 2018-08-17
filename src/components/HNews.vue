<template>
        <div class="news container-fluid">
            <div class="newsWrap container-fluid">
                <div class="row news_wrap">
                    <div class="marquee2_wrap marquee2_pr">
                        <div class="marquee2">
                            <ul>
                                <li v-for="(item, index) in noticeList1"
                                    :key="index">
                                    <span class="date">{{formatDate1(item.updated_at)}}</span>
                                    <a class="col-sm-10 col-xs-8 news_title" :href="item.html_url" target="_blank">
                                    {{item.title}}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="marquee2_wrap marquee2_pl">
                        <div class="marquee2">
                            <ul>
                                <li v-for="(item, index) in noticeList2"
                                    :key="index">
                                    <span class="date">{{formatDate1(item.updated_at)}}</span>
                                    <a class="col-sm-10 col-xs-8 news_title" :href="item.html_url" target="_blank">
                                    {{item.title}}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>


<script>
import Marquee from "@/static/js/plugins/Marquee";
import { mapActions, mapMutations, mapState ,mapGetters} from "vuex";
export default {
    name: 'HNews',
    data(){
        return {
            // noticeList1: [],
            // noticeList2: [],
        }
    },
    props:["marqueeConfig"]
    ,
    computed:{
        ...mapGetters(["getNews"]),
        noticeList1(){
            if(this.isEmptyObj(this.getNews)){
                return {}
            }
            return this.getNews.slice(0, this.getNews.length/2)
        },
        noticeList2(){
            if(this.isEmptyObj(this.getNews)){
                return {}
            }
            return this.getNews.slice(this.getNews.length/2,this.getNews.length)
        }
    },
    methods:{        
        ...mapActions([
            "noticeFetch",
        ]),
        ...mapMutations(["setNews"]),
        //公告函数调用
        MarqueeUse() {
            //轮播图
            $('.marquee2').kxbdSuperMarquee(this.marqueeConfig);
        },
    },
    created(){
        // 公告
        this.noticeFetch()
            .then((res) => {
                if (res.Code == 1100) {
                    this.setNews(res.Content);
                    this.$nextTick(function () {
                        this.MarqueeUse();
                    })
                }
            }).catch((e) => {
                //this.$alert(e)
                console.log(e);
            })
    }
}

</script>
