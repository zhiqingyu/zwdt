<template>
    <div class="home">
      <!--创建地图容器元素-->
      <div id="tdtMapDivID" class="divTdtMap"></div>
      <!-- 左侧nav导航栏 -->
      <transition name="fade">
        <el-card class="box-card left_card" v-show="false">
          <!-- 搜索 -->
          <!-- <div class="search">
          <span class="search_icon"></span>
          <input type="text" placeholder="请输入大厅/事项搜索" />
          <button class="search_btn">搜索</button>
        </div> -->
          <Search />
          <div class="bsdtlist">
            <div class="bsdt_title">
              <span class="bsdt_title_icon"></span
              ><span class="hyy">为您展示附近的办事大厅</span>
              <span class="qyxz">区域选择</span>
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
                  <div class="dt_workTime">
                    工作时间：{{ item.operatingHours }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </transition>
      <!-- 左侧搜索页面 -->
      <transition name="fade">
        <el-card class="box-card left_card" v-show="true">
          <!-- 搜索 -->
          <!-- <div class="search">
          <span class="search_icon"></span>
          <input type="text" placeholder="请输入大厅/事项搜索" />
          <button class="search_btn">搜索</button>
        </div> -->
          <Search />
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
                  <div class="dt_workTime">
                    工作时间：{{ item.operatingHours }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </transition>
      <!-- 右侧大厅详情 -->
      <transition name="fade">
        <el-card class="dt_detail" v-if="isShowDetail">
          <!-- 右侧头部 -->
          <div class="dt_detail_title">
            <span class="dt_card_name">{{ branchDetails.centerName }}</span>
            <span class="cloes" @click="cloesDetail"></span>
          </div>
          <div class="dt_detail_content">
            <!-- 右侧展示内容 -->
            <!-- 右侧轮播 -->
            <el-carousel height="220px">
              <el-carousel-item
                v-for="(item, index) in branchDetails.attachmentEntities"
                :key="index"
                v-show="item.placePicType === '1'"
              >
                <img
                  class="dt_card_pic"
                  :src="`http://218.89.178.237:280${item.hosUrl}`"
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
                  <div class="pmt">
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
    </div>
  </template>
  <script>
  import { Jpaas, requestJPAAS } from "@/tools/request";
  import Search from "@/components/Search";
  
  export default {
    name: "TdtMap",
    components: {
      Search,
    },
    data() {
      return {
        /**
         * 地图相关
         */
        //  初始化map
        tdtMap: {},
        // 经度
        jd: "104.74",
        // 纬度
        wd: "31.47",
        // 区划列表
        qh: [],
        // 搜索关键字
        searchValue: "",
        // 当前选中分类
        activeName: "政务大厅",
        //左侧列表数据
        leftInfo: [],
        // 类型list
        typeList: [],
        //  场所类型
        infoType: "",
        // 地区编码
        provinceCode: "510700000000",
        // 大厅列表
        jwdArr: [],
        // 是否显右侧详情
        isShowDetail: false,
        // 是否显示平面图
        isShowPlane: false,
        // 网点详情
        branchDetails: {},
        branchDetailTabs: ["网点简介", "网点服务", "网点事项"],
        ActivebranchDetailTab: 0,
      };
    },
    created() {},
    mounted() {
      // 初始化天地图
      this.initMap(this.jd, this.wd);
      this.getPZ();
      // this.getqh();
    },
    watch: {},
    methods: {
      //  初始化地图
      initMap(jd, wd) {
        let zoom = 8;
        this.tdtMap = new T.Map("tdtMapDivID");
        this.tdtMap.centerAndZoom(new T.LngLat(jd, wd), zoom);
        //  中心点打点
        let lc = new T.LocalCity();
        lc.location(this.handleLocation(jd, wd));
        //  添加地图类型控件
        if (this.info != null && this.info.length > 0) {
          for (var i = 0; i < this.jwdArr.length; i++) {
            var point = new T.LngLat(this.jwdArr[i].lng, this.jwdArr[i].lat);
            console.log(point);
            var marker = new T.Marker(point); // 创建标注
            this.tdtMap.addOverLay(marker);
          }
        }
      },
      /**
       * 打点函数
       */
      handleLocation(j, w) {
        let lnglat = {
          lng: j,
          lat: w,
        };
        let marker = new T.Marker(lnglat);
        this.tdtMap.addOverLay(marker);
      },
      /**
       * 首次进入获取配置
       */
      async getPZ() {
        let params = {
          app_id: "jmapnzyyagupv",
          interface_id: "yzzwbzwdtcxpzsjjk",
          params: {},
        };
        let res = await requestJPAAS(params);
        let info = res.data;
        if (info.code == 200 && info.success) {
          let siteInfo = JSON.parse(info.data).data.serviceNavigation;
          siteInfo.forEach((item, index) => {
            item.index = index;
          });
          this.typeList = siteInfo;
          this.infoType = siteInfo[0].classFlag;
        }
        this.getInfoList();
      },
  
      /**
       * 获取服务场所信息
       */
      async getInfoList() {
        let params = {
          app_id: "jmapnzyyagupv",
          interface_id: "yzzwbzwdtcsxxlb",
          params: {
            searchType: "place",
            infoType: this.infoType,
            provinceCode: this.provinceCode,
            pageSize: "100",
            pageNo: "1",
            lng: "104.74",
            lat: "31.47",
          },
        };
        let res = await requestJPAAS(params);
        let info = res.data;
        if (info.code == 200 && info.success) {
          let jwdArr = [];
          this.leftInfo = JSON.parse(info.data).data.pageData.infoBeanList;
          if (this.leftInfo != null && this.leftInfo.length > 0) {
            this.leftInfo.forEach((item, index) => {
              let jwdObj = {
                lng: item.lng,
                lat: item.lat,
              };
              jwdArr.push(jwdObj);
            });
            this.jwdArr = jwdArr;
          }
        }
        this.initMap();
      },
      /**
       * 切换服务类型
       */
      handleChangeType(tab) {
        this.activeName = tab.label;
        this.typeList.forEach((item) => {
          if (item.classificationName === this.activeName) {
            this.infoType = item.classFlag;
          }
        });
        this.getInfoList();
      },
      /**
       * 获取区划
       */
  
      // async getquhua() {
      //   let params = {
      //     app_id: "jmapnzyyagupv",
      //     interface_id: "yzzwbzwdtcxqhsj",
      //     version: "1.0",
      //     header: {},
      //     biz_content: JSON.stringify({}),
      //     charset: "UTF-8",
      //     origin: "1",
      //     sign: "",
      //   };
      //   let info = await requestJPAAS(params);
  
      //   if (info.code == 200 && info.success) {
      //     this.qh = JSON.parse(info.data).data[0].children[0].children;
      //   }
      // },
      /**
       * 获取网点信息
       */
      async getBranchDetails(item) {
        this.isShowDetail = false;
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
        this.isShowDetail = true;
        console.log(this.branchDetails);
      },
      /**
       * 关闭网点详情
       */
      cloesDetail() {
        this.isShowDetail = false;
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
    top: 20px;
    left: 20px;
    width: 480px;
    height: 760px;
    background: #fff;
    box-shadow: 0 3px 12px #00000029;
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
    .bsdtlist {
      margin-top: 30px;
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
  }
  .dt_detail {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 480px;
    height: auto;
    background: #fff;
    box-shadow: 0 3px 12px #00000029;
    .dt_detail_title {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      .dt_card_name {
        width: 300px;
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
  </style>
  