<template>
	<div class="market-cell">
		<div class="flex-center cell-header" v-if="!nohead">
			<label class="cell-header-item" @click="sortClick(0)">
				{{$t['coins']}} 
				<i 
					class="fa"
					:class="sortClass(0)"></i>
			</label>
			<label class="cell-header-item" @click="sortClick(1)">
				{{$t['price']}} 
				<i 
					class="fa"
					:class="sortClass(1)"></i>
			</label>
			<label class="cell-header-item" @click="sortClick(2)">
				{{$t['change']}} 
				<i 
					class="fa"
					:class="sortClass(2)"></i>
			</label>
		</div>

	</div>
</template>

<script>
	import { mapActions , mapGetters, mapState} from 'vuex'

	export default {
		name: 'HMarketCell',
		data () {
			return {
				btcRate: '',
				keys: [],
				sort: [{
					isShow: false,
					up: false,
				}, {
					isShow: false,
					up: false,
				}, {
					isShow: false,
					up: false,
				}],
				lastIndex: null,
				topList: [], //置顶的数组
			}
		},
		props: {
			list: {},
			type: 0, 
			nohead: true, 
			sortKey: '',
			useSwipe: true,
			btnList: Array
		},
		computed: {
			...mapState([
				"exchangeRate"
			]),
			...mapGetters([
				"getBtcRate",
				"getUSDCNY",
				"getETHUSDT",
				"getPortfolios",
				"getIsLogin"
			]),
			tmpList () {
				if (this.type == 0) {
					tmp = this.topList.filter(obj => {
						return this.keys.indexOf(obj) > -1
					})
					let tmp = tmp.concat(this.keys)
					return Array.from(new Set(tmp));
				}
				return this.keys
			}
		},
		created () {
			if (localStorage.getItem('topList')) {
				// topList
				this.topList = JSON.parse(localStorage.getItem('topList'))
			}
		},
		mounted() {
			this.keys = Object.keys(this.list)
		},
		methods: {
			...mapActions([
				"addportfolioFetch",
				"delportfolioFetch",
				"userPortfoliosFetch"
			]),
			async menuButtonClick (item) {
				let res = null,
						text = this.collectionText(item) 
				switch (text) {
					case this.$t['added']: {
							res = await this.delportfolioFetch(item.name1 + item.name2)
							if (res.Code == 1100) {
								return await this.userPortfoliosFetch()
							}
						}
						break;
					case this.$t['addF']:
							res = await this.addportfolioFetch(item.name1 + item.name2)
							if (res.Code == 1100) {
								return await this.userPortfoliosFetch()
							}
						break;
					default:
						break;
				}
				this.$alert(res.Msg)
			},
			menuTopClick (item) {
				let text = this.topText(item)
				if (text == this.$t['pin']) {
					this.topList.unshift(item.name.replace('/', ''))
				}else {
					this.topList = this.topList.filter(obj => obj !== item.name.replace('/', ''))
				}
				localStorage.setItem('topList', JSON.stringify(this.topList))	
			},
			topText (item) {
				return  this.isTop(item) ? this.$t['unpin'] : this.$t['pin']
			},
			isTop (item) {
				return this.topList.indexOf(item.name.replace('/', '')) > -1
			},
			collectionText (item) {
				return this.isCollection(item) ? this.$t['added'] : this.$t['addF']
			},
			isCollection (item) {
				return this.getPortfolios.indexOf(item.name1+item.name2) > -1
			},
			sortClick (index, notChange) {
				if (this.lastIndex != index) {
					this.sort[this.lastIndex] = {
						isShow: false,
						up: false
					}
				}
				if (!notChange) {
					this.sort[index].up = !this.sort[index].up;
					this.sort[index].isShow = true;
					this.lastIndex = index;
				}
				if (!this.sort[index].up) {
					switch (index) {
						case 0:
							this.keys = this.keys.sort().reverse();
							break;
						case 1:
							this.keys = this.keys.sort((a, b) => {
							    return this.list[b].result.last - this.list[a].result.last;
							});
							break;
						case 2:
							this.keys = this.keys.sort((a, b) => {
							    return this.change(this.list[b].result) - this.change(this.list[a].result);
							});
							break;
						default:
							// statements_def
							break;
					}
				}else {
					switch (index) {
						case 0:
							this.keys = this.keys.sort();
							break;
						case 1:
							this.keys = this.keys.sort((a, b) => {
							    return this.list[a].result.last - this.list[b].result.last;
							});
							break;
						case 2:
							this.keys = this.keys.sort((a, b) => {
							    return this.change(this.list[a].result) - this.change(this.list[b].result);
							});
							break;
						default:
							// statements_def
							break;
					}
				}
				
			},
			sortfn (keys, key) {
				if (this.isEmptyObj(this.list[keys[0]].result)) {
					setTimeout(() => {
						this.sortfn(keys, key);
					},300)
					return
				}
				if (key == 'change') {
					this.keys = keys.sort((a, b) => {
						if (this.isEmptyObj(this.list[b].result) || this.isEmptyObj(this.list[a].result)) {
							return a;
						}
						return this.change(this.list[b].result) - this.change(this.list[a].result);
					});
					this.keys = this.keys.splice(0, 10);
				}else {
					this.keys = keys.sort((a,b) => {
						if (this.isEmptyObj(this.list[b].result) || this.isEmptyObj(this.list[a].result)) {
							return a;
						}
						return this.list[b].result[key] - this.list[a].result[key];
					})
				}
			},
			sortClass (i) {
				if (!this.sort[i].isShow) {
					return ''
				}
				return this.sort[i].up?'fa-sort-up':'fa-sort-down';
			},
			liClick (value) {
				this.$emit('liClick', value)
			}
		},
		watch: {
			list (obj) {
				if (obj) {
					if (this.sortKey) {
						this.sortfn(Object.keys(obj), this.sortKey);
						return;
					}
					this.keys = Object.keys(obj)
				}
			},
			type (obj) {
				// this.sort.forEach((obj)=>{
				// 	obj.isShow = false
				// })
				this.keys = Object.keys(this.list);
				if (!this.isEmpty(this.lastIndex, true)) {
					this.sortClick(this.lastIndex, true);
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.swipeout-active::before {
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		border: 6px solid;
		border-color: #1ab394 transparent transparent #1ab394;
		z-index: 2;
	}
</style>
