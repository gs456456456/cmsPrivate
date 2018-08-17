<template>
    <div id="kline_container"></div>
</template>
<script>
import Kline from 'kline'
import { mapState, mapGetters, mapActions,mapMutations } from "vuex";
import "jquery.mousewheel/jquery.mousewheel.js"
// import ”“

export default {
    name:"HTestkline",
    data () {
        return {
            klineTimeCache:300,
            kline:null,
            screenWidth: document.body.clientWidth
        }
    },
    props:['nowMarket'],
    computed: {
        ...mapGetters(["getKLineData","getSocket"]),
    },
    components: {
        // Spinner
    },
    methods:{
        ...mapMutations(["setSocketData"]),
         typeClick (index) {
            let tmp = this.getSocketData
            if(index == "line"){
                this.klineTimeCache = 60
            }
            else{
                let type = index.substring(index.length-1,index.length),
                    typeNum = index.substring(0,index.length-1);
                switch(type){
                    case "w":
                    this.klineTimeCache = Number(typeNum)*86400*7
                    break
                    case "d":
                    this.klineTimeCache = Number(typeNum)*86400
                    break
                    case "m":
                    this.klineTimeCache = Number(typeNum)*60
                    break
                }
            }
                this.setSocketData({
					systemtime: parseInt(new Date().getTime()/1000),
					timeType: this.klineTimeCache,
					type: 0,
					start: true
				})
				this.getSocket.send(JSON.stringify({
					id: 10,
					method: this.config.trade['10'],
					params: []
				}));
        },
        changeSymbol(){
            
        },
        watchKlineData(){
            if(this.kline){
                this.kline.successCallback(this.getKLineData)
            }
        },
        watchNowMarket(){

        }
    },
    created(){
    },
    watch: {
        screenWidth (val) {
            if (!this.timer) {
                this.screenWidth = val
                this.timer = true
                let that = this
                setTimeout(function () {

                    // that.screenWidth = that.$store.state.canvasWidth
                    console.log($('#tv_chart_container').width())
                    that.kline.resize($('#tv_chart_container').width(),400)
                    that.timer = false
                }, 400)
            }
        }
    },
    mounted(){
        var that = this;
        this.kline = new Kline({
            element: "#kline_container",
            symbol: "BTC",
            symbolName: "比特币",
            type: "hotbit", // poll/stomp
            // url: '/static/test.json',
            height:400,
            width:$('#tv_chart_container').width(),
            debug:true,
            showTrade: false,  
        });
        this.kline.draw();
        this.kline.successCallback(this.getKLineData);
        this.$watch('getKLineData', this.watchKlineData);
        this.$watch('nowMarket', this.watchNowMarket);

        //宽度resize
        window.onresize = () => {
            console.log(window.screenWidth)
            return (() => {
                window.screenWidth = document.body.clientWidth
                if(window.screenWidth>=768){
                    
                    that.screenWidth = 0.71*window.screenWidth
                }else{
                    that.screenWidth = 1.5*window.screenWidth
                }
            })()
        }
        //切换订阅
        $(".chart_container .chart_toolbar_tabgroup a").click(function () {
            that.typeClick($(this).parent().attr('name'))
            });
        $("#chart_toolbar_periods_vert ul a").click(function () {
            that.typeClick($(this).parent().attr('name'))
        });
    }
}
</script>

