<template>
	<div class="market-cell-footer">
		<button 
			v-for="(item,index) in buttonList"
			:class="index==selectIndex?'active':''" 
			@click="footClick(index)"
			:key="index">
			<div class="text-box">
				<i class="fa"
					:class="faClass(item)"
					v-if="faClass(item)"></i>
				{{item}}
				<i 
					class="fa fa-pencil-alt" 
					style="margin-left: .05rem;" 
					v-if="selectIndex==1&&item==$t['orderBook']">
				</i>
				<p>
					{{pList && pList[index]}}
					<!-- History -->
				</p>
			</div>
		</button>
		
	</div>
</template>
<script>
	export default {
		data () {
			return {
				selectIndex: 0
			}
		},
		props: ['buttonList', 'pList', 'rightIcon', 'i'],
		methods: {
			footClick (index) {
				this.selectIndex = index;
				this.$emit('footClick', index)
			},
			faClass (item) {
				return item == this.$t['favor']?'fa-star':'';
			}
		},
		watch: {
			i (val) {
				this.selectIndex = val;
			}
		}
	}
</script>