<template>
  <div class="home">
    <!--创建地图容器元素-->
    <div id="tdtMapDivID" class="divTdtMap"></div>
    <!-- 左侧nav导航栏card -->
    <transition name="fade">
      <el-card class="box-card left_card">
        <Search
          @search="handlesearch"
          @goBackHome="ongoHome"
          :isSearchPage="isSearchPage"
        />
        <div class="bsdtlist_header" v-show="!isSearchPage">
          <div class="bsdtList_top">
            <el-button
              style="width: 147px"
              type="primary"
              :plain="true"
              size="small "
              @click="openxzqhMc"
              >区域:<span v-show="activeQx.title">:</span
              >{{ activeQx.title ? activeQx.title : "绵阳市" }}</el-button
            >
            <el-button
              @click="openxzjlMc"
              type="primary"
              plain
              size="small "
              style="width: 147px"
              >距离:{{
                activeDistanceValue ? activeDistanceValue : "全部"
              }}</el-button
            >
            <el-button plain size="small" @click="init()">重置</el-button>
          </div>
          <div class="bsdt_title">
            <span class="bsdt_title_icon"></span
            ><span class="hyy">为您展示您所选点位附近的办事网点</span>
          </div>
          <div class="dqzz" v-show="branchDetails.centerName">
            <span>(当前定位：{{ branchDetails.centerName }})</span>
          </div>
          <!-- 左侧tab切换 -->
          <el-tabs
            type="card"
            v-model="activeName"
            @tab-click="handleChangeType"
          >
            <el-tab-pane
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.classificationName"
              :name="item.classificationName"
              :type="item.classFlag"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="bsdtlist_header2" v-show="isSearchPage">
          <div
            class="bsOrSx_item"
            :class="{ 'bsOrSx_item-active': ActivebsSxTabs === index }"
            v-for="(item, index) in bsSxTabs"
            :key="index"
            @click="changSearchType(item)"
          >
            {{ item.title }}
          </div>
        </div>
        <place-list
          :leftInfo="leftInfo"
          :tdtMap="tdtMap"
          @getBranchDetails="handeleBranchDetails"
        ></place-list>
      </el-card>
    </transition>
    <!-- 右侧大厅详情card -->
    <transition name="fade">
      <el-card class="dt_detail" v-if="isShowDetail">
        <!-- 右侧头部 -->
        <div class="dt_detail_title">
          <span class="dt_card_name">{{ branchDetails.centerName }}</span>
          <div class="dzlq" @click="goTdt">
            <span class="dzlq_icon"></span>
            <span>到这里去</span>
          </div>
          <span class="cloes" @click="cloesDetail"></span>
        </div>
        <div class="dt_detail_content">
          <!-- 右侧展示内容 -->
          <!-- 右侧轮播 -->
          <el-carousel height="220px">
            <el-carousel-item
              v-for="(item, index) in rightSwiperList"
              :key="index"
              v-show="item.placePicType === '1'"
            >
              <img
                class="dt_card_pic"
                :src="`https://218.89.178.237:6443${item.hosUrl}`"
              />
            </el-carousel-item>
          </el-carousel>
          <!-- 右侧网点介绍 -->
          <ul>
            <li>
              <span class="dt_detail_adress_icon"></span>
              <span
                >地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</span
              >
              <span> {{ branchDetails.address }} </span>
            </li>
            <li>
              <span class="dt_detail_work_icon"></span>
              <span>工作时间：</span>
              <span>{{ branchDetails.operatingHours }}</span>
            </li>
            <li>
              <span class="dt_detail_tel_icon"></span>
              <span>联系电话：</span>
              <span> {{ branchDetails.supportHotline }}</span>
            </li>
          </ul>
          <!--  材料预审及预约按钮 -->
          <div class="btns">
            <el-button type="primary" round disabled>材料预审</el-button>
            <el-button type="primary" round disabled>前往预约</el-button>
          </div>
          <!-- class="detail_item detail_item-active" -->
          <el-tabs>
            <el-tab-pane label="网点简介">
              <div class="dt_detail_item">
                <h2>大厅简介</h2>
                <p>
                  {{ branchDetails.centerBriefInfo }}
                </p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="网点服务">
              <div class="dt_detail_item">
                <h2>大厅服务</h2>
                <!-- 大厅服务 -->
                <div class="dtfw_boxs">
                  <div class="dtfw_item">
                    <span class="ck_icon"></span>
                    <div class="ckxq">
                      <div class="cksl">
                        <span>{{
                          branchDetails.windowMatter
                            ? branchDetails.windowMatter.length
                            : 0
                        }}</span
                        >个
                      </div>
                      <span>共设立窗口数</span>
                    </div>
                  </div>
                  <div class="dtfw_item">
                    <span class="zdj_icon"></span>
                    <div class="zdjxq">
                      <div class="zdjsl">
                        <span>{{
                          branchDetails.equipmentBeanList
                            ? branchDetails.equipmentBeanList.length
                            : 0
                        }}</span
                        >台
                      </div>
                      <span>共部署终端机</span>
                    </div>
                  </div>
                </div>
                <!-- <h2>其余服务</h2> -->
                <!-- 其余服务 -->
                <!-- <div class="qyfw_boxs">
                    <div class="qyfw_item">免费WI-FI</div>
                    <div class="qyfw_item">婴幼室</div>
                  </div> -->
                <h2>楼层平面图</h2>
                <div class="pmt" @click="showPlance">
                  <span>大厅平面图</span>
                  <span class="left_icon"></span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="网点事项">
              <div class="dt_detail_item">
                <h2>大厅事项</h2>
                <ul>
                  <li
                    v-for="(item, index) in branchDetails.matterList"
                    :key="index"
                  >
                    <span>{{ item.matterName }}</span>
                    <el-button type="primary" @click="goOnLine(item)" plain
                      >在线申报</el-button
                    >
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </transition>
    <!-- 右侧大厅平面图 -->
    <transition name="fade">
      <el-card class="dt_detail" v-if="isShowPlane">
        <!-- 右侧头部 -->
        <div class="dt_detail_title">
          <span class="goBack" @click="goBackDettails"></span>
          <span class="dt_card_name">{{ branchDetails.centerName }}</span>
          <span class="cloes" @click="cloesDetail"></span>
        </div>
        <el-image
          style="width: 440px; height: 513px; margin: 46px auto 100px"
          :src="`https://218.89.178.237:6443${rightPlaneList.hosUrl}`"
        ></el-image>
      </el-card>
    </transition>
    <transition name="fade">
      <div class="mc" v-show="isShowxzqhMc">
        <div class="zxqh">
          <div class="dqxz_title">
            <span>请选择地区</span>
            <span class="cloes" @click="cloesxzqhMc"></span>
          </div>
          <ul class="qxlist">
            <li
              :class="{ active: activeDistrict === index }"
              @click="xzqh(item, index)"
              v-for="(item, index) in qh"
              :key="index"
            >
              {{ item.title }}
            </li>
          </ul>
          <div class="xzqh"></div>
          <button class="qr" @click="changeQh">确认</button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mc" v-show="isShowxzjlMc">
        <div class="zxjl">
          <div class="dqxz_title">
            <span>请选择距离</span>
            <span class="cloes" @click="cloesxzjlMc"></span>
          </div>
          <ul class="jllist">
            <li
              :class="{ active: activeDisrance === index }"
              @click="xzjl(item, index)"
              v-for="(item, index) in distanceLists"
              :key="index"
            >
              {{ item.value }}
            </li>
          </ul>
          <div class="xzqh">
            <span @click="gbjl(item)">{{ activeQx.title }}</span>
          </div>
          <button class="qr" @click="changeJl">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Search from "@/components/Search";
import PlaceList from "@/components/PlaceList";
import {
  getFirstConfig,
  getBranchesList,
  getDistrictList,
  getBranchDetail,
} from "@/tools/zwdt";

export default {
  name: "TdtMap",
  components: {
    Search,
    PlaceList,
  },
  data() {
    return {
      //  初始化map
      tdtMap: {},
      // 经度
      jd: "104.74",
      // 纬度
      wd: "31.47",
      // 区划列表
      qh: [],
      // 场所列表
      typeList: [],
      // 搜索关键字
      searchValue: "",
      // 当前选中分类
      activeName: "政务大厅",
      //左侧列表数据
      leftInfo: [],
      // 大厅地图列表
      jwdArr: [],
      // 是否显右侧详情
      isShowDetail: false,
      // 是否显示平面图
      isShowPlane: false,
      //  右侧录播图list
      rightSwiperList: [],
      // 右侧详情
      branchDetails: {},
      // 网点平面详情详情
      rightPlaneList: {},
      //查询字段
      infoName: "",
      // 是否查询页
      isSearchPage: false,
      // 网点详情tabs
      // 办事or事项tabs
      bsSxTabs: [
        {
          title: "办事",
          type: "place",
        },
        {
          title: "事项",
          type: "item",
        },
      ],
      ActivebsSxTabs: 0,
      // 事项列表
      itemList: [],
      // 选中区县
      activeQx: "",
      // 是否展示选择区划蒙层
      isShowxzqhMc: false,
      /*是否暂时选择距离蒙层 */
      isShowxzjlMc: false,
      activeDistanceValue: "",
      /**
       * 请求相关
       */
      options: {
        searchType: "place",
        infoType: "",
        provinceCode: "510700000000",
        lng: "104.74",
        lat: "31.47",
        infoName: "",
        distance: "",
      },
      /**选中地区 */
      activeDistrict: 0,
      /**选中距离 */
      activeDisrance: 0,
      //选中地点
      //距离lists
      distanceLists: [
        {
          value: "全部",
          distance: "",
        },
        {
          value: "3km",
          distance: "3000",
        },
        {
          value: "5km",
          distance: "5000",
        },
        {
          value: "10km",
          distance: "10000",
        },
      ],
    };
  },
  created() {},
  mounted() {
    // 初始化天地图
    this.getPZ();
    this.getquhua();
    this.initMap(this.jd, this.wd);
  },
  watch: {},
  methods: {
    //  初始化地图
    initMap(jd, wd) {
      let zoom = 8;
      this.tdtMap = new T.Map("tdtMapDivID");
      this.tdtMap.centerAndZoom(new T.LngLat(jd, wd), zoom);
      var position = new T.LngLat(jd, wd);
      var marker = new T.Marker(position);
      this.tdtMap.addOverLay(marker);
    },
    /**
     * 首次进入获取配置
     */
    async getPZ() {
      let info = await getFirstConfig();
      if (info.code == 200 && info.success) {
        let siteInfo = JSON.parse(info.data).data.serviceNavigation;
        siteInfo.forEach((item, index) => {
          item.index = index;
        });
        this.typeList = siteInfo;
        this.options.infoType = siteInfo[0].classFlag;
      }
      this.getInfoList();
    },
    /**
     * 获取服务场所信息
     */
    async getInfoList() {
      this.tdtMap.clearOverLays();
      if (this.options.searchType == "place") {
        let info = await getBranchesList(this.options);
        if (info.code == 200 && info.success) {
          this.leftInfo = JSON.parse(info.data).data.pageData.infoBeanList;
          this.addLables();
        }
      } else if (this.options.searchType == "item") {
        this.$message("功能正在开发中");
        this.options.searchType = "place";
      }
    },
    /**
     * 切换服务类型
     */
    handleChangeType(tab) {
      this.typeList.forEach((item) => {
        if (item.classificationName === this.activeName) {
          this.options.infoType = item.classFlag;
        }
      });
      this.getInfoList();
      // this.initMap(this.jd, this.wd);
    },
    /**
     * 获取区划
     */
    async getquhua() {
      let res = await getDistrictList();
      let info = JSON.parse(res.data);
      if (info.code == 200 && info.success) {
        this.qh = [
          info.data[0].children[0],
          ...info.data[0].children[0].children,
        ];
      }
    },
    /**
     * 关闭网点详情
     */
    cloesDetail() {
      this.isShowDetail = false;
      this.isShowPlane = false;
    },
    /**
     * 返回网点详情
     */
    goBackDettails() {
      this.isShowDetail = true;
      this.isShowPlane = false;
    },
    /**
     * 在线办理
     */
    goOnLine(item) {
      window.open(item.mobileGuideUrl);
    },
    /**
     * 展示平面图
     */
    showPlance() {
      if (this.rightPlaneList.hosUrl) {
        (this.isShowPlane = true), (this.isShowDetail = false);
      } else {
        this.$message("暂无大厅平面图");
      }
    },
    /**
     * 点击查询
     */
    async handlesearch(searchValue) {
      if (!this.isSearchPage) {
        this.options.infoName = searchValue;
        this.options.infoType = "";
        this.isSearchPage = !this.isSearchPage;
        this.getInfoList();
      } else {
        this.options.infoName = searchValue;
        this.getInfoList();
      }
    },
    /**
     * 点击查看网点详情
     */
    handeleBranchDetails(details) {
      this.branchDetails = details;
      this.isShowDetail = true;
      this.isShowPlane = false;
      this.rightSwiperList = [];
      this.rightPlaneList = {};
      if (this.branchDetails.attachmentEntities.length > 0) {
        let swiperlist = [];
        let rightPlaneList = [];
        this.branchDetails.attachmentEntities.forEach((item) => {
          if (item.placePicType == 1) {
            swiperlist.push(item);
            this.rightSwiperList = swiperlist;
          } else if (item.placePicType == 2) {
            rightPlaneList = item;
            this.rightPlaneList = rightPlaneList;
          }
        });
      }
    },
    /**
     * 改变查询type
     */
    async changSearchType(item) {
      this.options.searchType = item.type;
      this.getInfoList();
    },
    /**
     * 选择区划
     */
    async xzqh(item, index) {
      this.activeDistrict = index;
      this.activeQx = item;
      this.options.provinceCode = item.key;
    },
    /**
     * 关闭蒙层
     */
    cloesxzqhMc() {
      this.isShowxzqhMc = false;
    },

    cloesxzjlMc() {
      this.isShowxzjlMc = false;
    },
    /**
     * 打开蒙层
     */
    openxzqhMc() {
      this.options.distance = "";
      this.activeDisrance = 0;
      this.activeDistanceValue = "";
      this.isShowxzqhMc = true;
    },
    openxzjlMc() {
      if (!this.branchDetails.centerName) {
        this.$message("请先选中点位");
        return;
      }
      this.isShowxzjlMc = true;
    },
    /**
     * 修改行政区划
     */
    changeQh() {
      this.isShowMc = false;
      this.cloesxzqhMc();
      this.getInfoList();
    },

    /**从搜索页返回 */
    ongoHome() {
      this.options.infoName = "";
      this.isSearchPage = false;
      this.getInfoList();
    },
    /**
     * 添加标注
     */
    addLables() {
      if (this.leftInfo != null && this.leftInfo.length > 0) {
        let jwdArr = [];
        this.leftInfo.forEach((item) => {
          let jwdObj = {
            lng: item.lng,
            lat: item.lat,
            title: item.infoName,
            iid: item.iid,
            infoType: item.infoType,
          };
          jwdArr.push(jwdObj);
        });
        this.jwdArr = jwdArr;
        this.jwdArr.forEach((item, index) => {
          var marker = new T.Marker(new T.LngLat(item.lng, item.lat));
          var content = item.title;
          var placeId = item.iid;
          var placeType = item.infoType;
          this.tdtMap.addOverLay(marker);
          this.addLablesClick(marker, content, item);
        });
      }
    },
    /**
     * 监听标注点点击事件
     */
    addLablesClick(marker, content, item) {
      var that = this;
      marker.addEventListener("click", function (e) {
        that.openLablesInfo(content, e, item);
      });
    },
    /**
     * 打开标注点详情
     */
    async openLablesInfo(content, e, item) {
      var point = e.lnglat;
      var marker = new T.Marker(point); // 创建标注
      var markerInfoWin = new T.InfoWindow(content, {
        offset: new T.Point(0, -30),
      }); // 创建信息窗口对象
      this.tdtMap.openInfoWindow(markerInfoWin, point); //开启信息窗口
      let res = await getBranchDetail(item);
      if (res.code == 200 && res.success) {
        let info = JSON.parse(res.data).data.centerEntity;
        this.handeleBranchDetails(info);
      }
    },
    /**
     * 修改距离
     */
    xzjl(item, index) {
      this.options.distance = item.distance;
      this.options.lng = this.branchDetails.lngAndLat.split(",")[0];
      this.options.lat = this.branchDetails.lngAndLat.split(",")[1];
      this.activeDisrance = index;
      this.activeDistanceValue = item.value;
    },
    /**
     * 修改距离
     */
    changeJl() {
      this.isShowxzjlMc = false;
      this.getInfoList();
      let lng = this.branchDetails.lngAndLat.split(",")[0];
      let lat = this.branchDetails.lngAndLat.split(",")[1];
      var postion = new T.LngLat(lng, lat);
      if (this.activeDistanceValue === "3km") {
        this.tdtMap.panTo(postion, 15);
      } else if (this.activeDistanceValue === "5km") {
        this.tdtMap.panTo(postion, 12);
      } else if (this.activeDistanceValue === "10km") {
        this.tdtMap.panTo(postion, 11);
      } else {
        this.tdtMap.panTo(postion, 11);
      }
    },
    /**
     * 重置
     */
    async init() {
      (this.activeName = "政务大厅"),
        (this.activeDistanceValue = ""),
        (this.activeQx = ""),
        (this.activeDistrict = 0),
        (this.activeDisrance = 0),
        (this.branchDetails = ""),
        (this.isShowDetail = false),
        (this.isShowPlane = false),
        (this.options = {
          searchType: "place",
          infoType: "",
          provinceCode: "510700000000",
          lng: "104.74",
          lat: "31.47",
          infoName: "",
          distance: "",
        });
      this.getInfoList();
      var postion = new T.LngLat(this.jd, this.wd);
      this.tdtMap.panTo(postion, 8);
    },
    /**
     * 去天地图
     */
    goTdt() {
      window.open("https://map.tianditu.gov.cn/");
    },
  },
};
</script>
<style lang="less" scoped>
.divTdtMap {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 800px;
  z-index: 0;
}

.box-card {
  position: absolute;
  top: 140px;
  left: 20px;
  width: 480px;
  height: 760px;
  background: #fff;
  box-shadow: 0 3px 12px #00000029;
  .leftgoback {
    width: 100px;
    height: 30px;
    margin-bottom: 10px;
  }
  .bsdtlist_header {
    .bsdtList_top {
      margin: 20px 0 20px 0;
      display: flex;
      justify-content: space-around;
      .bsdtList_top_tbas {
        min-width: 150px;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        border: 1px solid #3472e9;
        border-radius: 5px;
        cursor: pointer;
        color: #3875e1;
        padding: 0 10px;
      }
    }
    .bsdt_title {
      margin-right: 20px;
      font-weight: 700;
      font-size: 20px;
      text-align: left;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header_top {
        height: 40px;
      }
      .bsdt_title_icon {
        width: 22px;
        height: 22px;
        background: url("../assets/images/dw_icon.png");
        margin-right: 10px;
      }
      /deep/.el-popover {
        position: absolute;
        top: 110px !important;
      }
      /deep/ .el-card__body,
      .el-main {
        padding: 20px 0 0 20px;
      }
      .hyy {
        flex: 1;
      }
      .qyxz {
        display: inline-block;
        position: relative;
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
    .dqzz {
      padding-left: 30px;
      text-align: left;
      margin-top: 10px;
      font-size: 14px;
      color: #3472e9;
    }
  }
}
.dt_detail {
  position: absolute;
  top: 140px;
  right: 20px;
  width: 480px;
  height: auto;
  background: #fff;
  box-shadow: 0 3px 12px #00000029;
  .dt_detail_title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 20px;
    .dzlq {
      display: flex;
      color: #3472e9;
      font-size: 16px;
      align-items: center;
      margin-right: 10px;
      cursor: pointer;
      .dzlq_icon {
        margin-right: 5px;
        width: 19px;
        height: 19px;
        background: url("../assets/images/dzlq.png");
        background-size: 100%;
      }
    }
    .dt_card_name {
      width: 270px;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      text-align: left;
    }
  }
  .dt_detail_content {
    margin-top: 20px;
    .dt_detail_pic {
      width: 440px;
      height: 220px;
    }
    img {
      width: 100%;
      height: 100%;
    }
    ul {
      margin-top: 20px;
      li {
        display: flex;
        font-size: 16px;
        line-height: 32px;
        text-align: left;
        color: #333;
        align-items: flex-start;
        .dt_detail_adress_icon {
          width: 14px;
          height: 18px;
          background: url("../assets/images/adress.png");
        }
        .dt_detail_work_icon {
          width: 16px;
          height: 16px;
          background: url("../assets/images/time.png") no-repeat;
        }
        .dt_detail_tel_icon {
          width: 16px;
          height: 16px;
          background: url("../assets/images/phone.png") no-repeat;
        }
        span:nth-child(1) {
          position: relative;
          top: 6px;
        }
        span:nth-child(2) {
          width: 80px;
          margin-left: 10px;
        }
        span:nth-child(3) {
          width: 280px;
          margin-left: 10px;
        }
      }
    }

    .btns {
      text-align: right;
      margin-top: 20px;
      /deep/.el-button {
        width: 88px;
        height: 27px;
        border-radius: 13.5px;
        background: #3875e1;
        padding: 0;
        // line-height: 27px;
      }
    }

    .dt_detail_tabs {
      margin-top: 20px;
    }
    .dt_detail_item {
      h2 {
        font-weight: 700;
        font-size: 16px;
        line-height: 21px;
        text-align: left;
        margin-top: 20px;
      }
      p {
        margin-top: 20px;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        text-align: left;
        color: #333;
        margin-bottom: 40px;
      }

      .dtfw_boxs {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .dtfw_item {
          width: 210px;
          height: 80px;
          border-radius: 8px;
          background: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          .ck_icon {
            width: 40px;
            height: 33px;
            background: url("../assets/images/ck.png");
          }

          .zdj_icon {
            width: 33px;
            height: 33px;
            background: url("../assets/images/zdj.png");
          }
          .zdjxq,
          .ckxq {
            margin-left: 20px;
          }
          .zdjsl,
          .cksl {
            text-align: left;
            span {
              font-size: 20px;
              line-height: 28px;
              text-align: left;
              color: #3875e1;
            }
          }
          .zdjsl {
            span {
              font-size: 20px;
              line-height: 28px;
              text-align: left;
              color: #42c068;
            }
          }
          span {
            font-weight: 400;
            font-size: 14px;
            line-height: 28px;
            text-align: left;
            color: #999;
          }
        }
      }
      .qyfw_boxs {
        display: flex;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .qyfw_item {
          width: 210px;
          height: 40px;
          line-height: 40px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #36b6ff;
        }
      }
      .pmt {
        margin-top: 20px;
        width: 440px;
        height: 40px;
        border-radius: 8px;
        background: #fff;
        border: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        .left_icon {
          width: 9px;
          height: 15px;
          background: url("../assets/images/left.png");
        }
      }
      ul {
        margin-top: 20px;
        height: 240px;
        overflow: auto;
        li {
          height: 60px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-button {
            width: 88px;
            height: 27px;
            border-radius: 13.5px;
            background: none;
            border: 1px solid #3472e9;
            padding: 0;
            color: #3472e9;
            margin-right: 10px;
          }
          .el-button:hover {
            color: #3472e9;
          }
        }
      }
      ul::-webkit-scrollbar {
        width: 10px;
        height: 50px;
        background: #eee;
      }
      ul::-webkit-scrollbar-thumb {
        width: 10px;
        height: 50px;
        background: #ccc;
        border-radius: 8px;
      }
    }
    .dt_detail_tabs {
      .dt_detail_navs {
        display: flex;
        justify-content: space-between;
        height: 30px;
      }
      .detail_item {
        position: relative;
        flex: 1;
        cursor: pointer;
        .item-active_icon {
          position: absolute;
          bottom: -6px;
          right: 40%;
          width: 31px;
          height: 3px;
          border-radius: 1.5px;
          background: #3875e1;
        }
      }

      .detail_item-active {
        color: #3875e1;
      }
    }
  }
}
.cloes {
  width: 20px;
  height: 20px;
  background: url("../assets/images/close.png");
}
.bsdtlist_header2 {
  width: 200px;
  height: 40px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #e9edf7;
  .bsOrSx_item {
    flex: 1;
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
  }
  .bsOrSx_item:first-child {
    border-radius: 20px 0 0 20px;
  }

  .bsOrSx_item:last-child {
    border-radius: 0 20px 20px 0;
  }
  .bsOrSx_item-active {
    background: #3875e1;
    color: #fff;
  }
}
/deep/ .el-tabs__header {
  margin: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
// /deep/

.goBack {
  width: 12px;
  height: 20px;
  margin-right: 20px;
  background: url("../assets/images/prev.png") no-repeat center;
  background-size: 100% 100%;
}
.mc {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .zxjl,
  .zxqh {
    display: flex;
    flex-wrap: wrap;
    width: 800px;
    background: #fff;
    z-index: 1000;
    margin: 200px auto;
    border-radius: 5px;
    padding: 20px;
    position: relative;
    .jllist,
    .qxlist {
      display: flex;
      flex-wrap: wrap;
      width: 800px;
      margin: 20px auto 0;
      li {
        cursor: pointer;
        text-align: left;
        font-size: 14px;
        margin-right: 15px;
        border: 1px solid #eee;
        margin-bottom: 10px;
        padding: 5px 10px;
        border-radius: 5px;
      }
    }
    .xzqh {
      width: 100%;
      display: flex;
      margin: 10px 0;
      font-size: 16px;
      line-height: 16px;
      .xzqh_qxz {
        font-weight: 400;
        font-size: 16px;
      }
      span {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        cursor: pointer;
      }
    }
    .qr {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: #3472e9;
      color: #fff;
      border: none;
      width: 75px;
      height: 32px;
      line-height: 32px;
      border-radius: 8px;
      cursor: pointer;
    }
    .active {
      background: #2b82f0;
      color: #fff;
    }
  }
  .dqxz_title {
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
  }
  // .qr {
  //   position: absolute;
  //   right: 0;
  // }
}
</style>
