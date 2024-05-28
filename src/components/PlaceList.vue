<template>
  <div class="bsdtlist">
    <ul class="dt_list">
      <li
        class="dt_list_item"
        v-for="(item, index) in leftInfo"
        :key="index"
        @click="getBranchDetails(item)"
      >
        <img src="@/assets/images/dt_icon.png" alt="" srcset="" />
        <div class="dt_con">
          <div class="dt_name">{{ item.infoName }}</div>
          <div class="dt_adress">{{ item.address }}</div>
          <div class="dt_workTime">工作时间：{{ item.operatingHours }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { requestJPAAS } from "@/tools/request";

export default {
  name: "PlaceList",
  data() {
    return {};
  },
  props: {
    leftInfo: Array,
    isShowDetail: Boolean,
    tdtMap: Object,
  },

  mounted() {},
  methods: {
    async getBranchDetails(item) {
      let params = {
        app_id: "jmapnzyyagupv",
        interface_id: "yzzwbzwdtxxxx",
        params: {
          placeId: item.iid,
          placeType: item.infoType,
          lat: item.lat,
          lng: item.lng,
        },
      };
      let res = await requestJPAAS(params);
      let info = res.data;
      if (info.code == 200 && info.success) {
        this.branchDetails = JSON.parse(info.data).data.centerEntity;
      }
      this.$emit("getBranchDetails", this.branchDetails);
      var postion = new T.LngLat(item.lng, item.lat);
      this.tdtMap.panTo(postion, 15);
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.bsdtlist {
  .bsdt_title {
    margin-right: 20px;
    font-weight: 700;
    font-size: 20px;
    text-align: left;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bsdt_title_icon {
      width: 22px;
      height: 22px;
      background: url("../assets/images/dw_icon.png");
      margin-right: 10px;
    }
    /deep/ .el-card__body,
    .el-main {
      padding: 20px 0 0 20px;
    }
    .hyy {
      flex: 1;
    }
    .qyxz {
      font-weight: 400;
      font-size: 16px;
      text-align: right;
      color: #3875e1;
      cursor: pointer;
    }
  }
  .el-tabs {
    margin-top: 20px;
  }
  .dt_list::-webkit-scrollbar {
    width: 20px;
    height: 50px;
    background: #eee;
  }
  .dt_list::-webkit-scrollbar-thumb {
    width: 20px;
    height: 170px;
    background: #ccc;
  }
  .dt_list {
    overflow-y: auto;
    height: 580px;
    .dt_list_item {
      height: 133px;
      display: flex;
      border-bottom: 1px solid #e6e6e6;
      padding-top: 10px;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        position: relative;
        top: 10px;
      }
      .dt_con {
        margin-left: 20px;
        .dt_name {
          margin-top: 5px;
          font-weight: 700;
          font-size: 16px;
          text-align: left;
          color: #333;
        }
        .dt_adress {
          margin-top: 12px;
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          text-align: left;
          color: #999;
        }
        .dt_workTime {
          margin-top: 12px;
          font-family: "Microsoft YaHei";
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          text-align: left;
          color: #999;
        }
      }
    }
  }
}
</style>