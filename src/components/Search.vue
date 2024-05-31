<template>
  <div class="search_box">
    <span class="goback" @click="goBackHome" v-show="isSearchPage"></span>
    <div class="search">
      <span class="search_icon"></span>
      <input
        type="text"
        placeholder="请输入大厅/事项搜索"
        v-model="searchValue"
      />
      <button class="search_btn" @click="Search">搜索</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {
      searchValue: "",
      isShow: false,
    };
  },
  props: {
    isSearchPage: Boolean,
  },
  methods: {
    Search() {
      if (this.searchValue) {
        this.$emit("search", this.searchValue);
      } else {
        this.$message("请输入搜索内容");
      }
    },
    goBackHome() {
      this.searchValue=""
      this.$emit("goBackHome", this.isShow);
    },
  },
};
</script>

<style scoped lang="less">
.search_box {
  width: 440px;
  display: flex;
  align-items: center;
  .goback {
    width: 12px;
    height: 20px;
    margin-right: 20px;
    background: url("../assets/images/prev.png") no-repeat center;
    background-size: 100% 100%;
  }
  .search {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 8px;
    background: #f4f4f4;
    align-items: center;
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
}
</style>
