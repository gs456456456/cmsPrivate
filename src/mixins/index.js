/*
 * @Author: liukun 
 * @Date: 2018-03-27 11:30:37 
 * @Last Modified by: liukun
 * @Last Modified time: 2018-05-18 13:06:39
 * @Last Modified time: 2018-06-01 10:47:32
 */
import Vue from 'vue'

Vue.mixin({
	data () {
		return {
		}
	},
	methods:{
		// 判断是否为空对象
		isEmptyObj: function(obj){
			var t
			for(t in obj)
				return false
			return true
		},
		// 判断是否为对象
		isObject: function(obj) {
			return obj !== null && typeof obj === 'object'
		},
	}
})