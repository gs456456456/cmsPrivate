<template>
    <div class="banner-page banner">
      <div class="container-fluid bannerContainer">
        <div class="row bannerInner" @mouseover.stop="mouseoverFn()" @mouseout.stop="mouseoutFn()">
          <ul class="bannerImg">
            <li 
                v-for="(item,index) in getBanner1" 
                :class="bannerIndex==index?'active-opacity':''">
                <!-- v-show="bannerIndex==index"-->
              <div 
                class="bg1" 
                :style="{'background-image':'url('+item.img_addr+')'}">
                <div class="content content1">
                  <p class="title">
                    <br>{{item.title1}}
                    <br>
                  </p>
                  <p class="text1">{{item.title2}}</p>
                  <div class="more">
                    <a 
                        class="more_btn" 
                        id="banner6Btn" 
                        target="_blank" 
                        v-if="bannerIndex==index"
                        :href="item.href">
                        {{$t['more_btn']}}
                    </a>
                  </div>
                </div>
              </div>
            </li>

          </ul>


          <ol class="bannerCircle carousel-indicators">
            <li 
                v-for="(item,index) in getBanner1"
                :class="bannerIndex==index?circleActive:''"
                @click="circleClick(index)">
            </li>
          </ol>

          <div 
            class="arrow left carousel-control arrow_left" 
            v-show="getBanner1.length>1"
            @click="leftClick()">
            <i class="glyphicon glyphicon-chevron-left"></i>
          </div>
          <div 
            class="arrow right carousel-control arrow_right" 
            v-show="getBanner1.length>1"
            @click="rightClick()">
            <i class="glyphicon glyphicon-chevron-right"></i>
          </div>

          <h-news :marqueeConfig="marqueeConfig" v-if="hasNews"></h-news>
        </div>
      </div>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import HNews from "@/components/HNews";
import "@/static/css/components/banner.less";
import { setInterval, clearInterval } from 'timers';

export default {
    data(){
        return {
            bannerIndex:0,
            circleActive:'bannerActive',
            timer:'',
        }
    },
    props:["marqueeConfig","hasNews","sowingParm"],
    components: {
        HNews: HNews
    },
    computed:{
        ...mapGetters([
            "getBanner1"
        ])
    },
    methods:{
        ...mapActions([
            "bannersFetch"
        ]),
        ...mapMutations([
            "setBanner1"
        ]),
        leftClick() {
            this.bannerIndex--;
            if( this.bannerIndex < 0 ) {
                this.bannerIndex = this.getBanner1.length-1;
            }
        },
        rightClick() {
            this.bannerIndex++;
            if( this.bannerIndex > this.getBanner1.length-1 ) {
                this.bannerIndex = 0;
            }
        },
        circleClick(index) {
            this.bannerIndex = index;
        },
        intervalInit() {
            this.timer = setInterval(()=>{
                this.rightClick()
            },4000)
        },
        mouseoverFn() {
            clearInterval(this.timer);
        },
        mouseoutFn() {
            this.intervalInit();
        }
    },
    created(){
        // banner图
        this.bannersFetch(
            this.sowingParm
        ).then(res => {
            if (res.Code == 1100) {
              this.setBanner1(res.Content);
            }
        });
    },
    mounted() {
        this.intervalInit()
    }

}
</script>

