<template>
  <nav aria-label="Page navigation" v-if="pages>0">
     <ul class="pagination">
         <li :class="{'disabled':curPage==1}">
             <a href="javascript:;" @click="goPage(curPage==1?1:curPage-1)" aria-label="Previous">
                 <span aria-hidden="true">{{$t['pageprev']}}</span>
             </a>
         </li>
         <li 
          v-for="(page, index) in showPageBtn"
          :key="index" 
          :class="{'active':page==curPage}">
             <a href="javascript:;" v-if="page" @click="goPage(page)">{{page}}</a>
               <a href="javascript:;" v-else>···</a>
         </li>
         <li :class="{'disabled':curPage==pages}">
             <a href="javascript:;" @click="goPage(curPage==pages?pages:curPage+1)" aria-label="Next">
                     <span aria-hidden="true">{{$t['pagenext']}}</span>
             </a>
         </li>
         <li :class="{'disabled':pages==pages}">
         </li>
     </ul>
 </nav>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    pages: {
      type: Number,
      default: 1
    },
    current: {
      type: Number,
      default: 1
    }
  },
  data: function() {
    return {
      curPage: 1
    };
  },
  computed: {
    // 显示分页按钮
    showPageBtn: function() {
      let pageNum = this.pages; // 总页数
      let index = this.curPage; // 当前页
      let arr = [];
      if (pageNum <= 6) {
        for (let i = 1; i <= pageNum; i++) {
          arr.push(i);
        }
        return arr;
      }
      // 对页码显示进行处理，动态展示
      if (index <= 3) return [1, 2, 3, 4, 0, pageNum];
      if (index >= pageNum - 1)
        return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum];
      if (index === 4) return [1, 2, 3, 4, 5, 0, pageNum];
      if (index === pageNum - 2)
        return [
          1,
          0,
          pageNum - 4,
          pageNum - 3,
          pageNum - 2,
          pageNum - 1,
          pageNum
        ];
      return [
        1,
        0,
        index - 2,
        index - 1,
        index,
        index + 1,
        index + 2,
        0,
        pageNum
      ];
    }
  },
  methods: {
    goPage: function(page) {
      if (page != this.curPage) {
        console.log(page);
        this.curPage = page;
        this.$emit("navpage", this.curPage);
      } else {
        console.log("Already in the current page");
      }
    }
  }
};
</script>

