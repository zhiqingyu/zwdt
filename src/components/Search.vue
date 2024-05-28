<template>
  <div class="search">
    <span class="search_icon"></span>
    <input type="text" placeholder="请输入大厅/事项搜索" v-model="searchValue" />
    <button class="search_btn" @click="Search">搜索</button>
  </div>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {
      searchValue: "",
    };
  },
  methods: {
    Search(){
      this.$emit("search", this.searchValue);
    }
  },
};
</script>

<style scoped lang="less">
.search {
  display: flex;
  width: 440px;
  height: 40px;
  border-radius: 8px;
  background: #f4f4f4;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  .search_icon {
    width: 20px;
    height: 20px;
    background: transparent;
    background: url("../assets/images/search.png");
  }
  input {
    flex: 1;
    height: 40px;
    border: none;
    background: none;
    margin-left: 10px;
    outline: none;
    font-weight: 400;
    font-size: 14px;
  }

  .search_btn {
    width: 60px;
    height: 40px;
    border-radius: 0 8px 8px 0;
    background: #3875e1;
    border: none;
    color: #ffffff;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    font-size: 14px;
    color: #fff;
  }
}
</style>
