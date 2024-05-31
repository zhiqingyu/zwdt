import { async } from "regenerator-runtime";
import { requestJPAAS } from "./request";

/**
 * 获取首次进入配置
 */

async function getFirstConfig() {
    let params = {
        app_id: "zwdtlzjmg",
        interface_id: "yzzwbzwdtcxpzsjjk",
        params: {},
    };
    let res = await requestJPAAS(params);
    let info = res.data;
    return info;
}
/***
 * 获取网点列表
 */
async function getBranchesList(options) {
    let params = {
        app_id: "zwdtlzjmg",
        interface_id: "yzzwbzwdtcsxxlb",
        params: {
            searchType: options.searchType,
            infoType: options.infoType,
            provinceCode: options.provinceCode,
            pageSize: "100",
            pageNo: "1",
            lng: options.lng,
            lat: options.lat,
            infoName: options.infoName,
            distance: options.distance,
        },
    };
    let res = await requestJPAAS(params);
    let info = res.data;
    return info;
}
/**
 * 获取行政区划
 */
async function getDistrictList() {
    let params = {
        app_id: "zwdtlzjmg",
        interface_id: "yzzwbzwdtcxqhsj",
        biz_content: {},
    };
    let res = await requestJPAAS(params);
    let info = res.data;
    return info;
}
/**
 * 获取网点详细信息
 */

async function getBranchDetail(branch) {
    let params = {
        app_id: "zwdtlzjmg",
        interface_id: "yzzwbzwdtxxxx",
        params: {
            placeId: branch.iid,
            placeType: branch.infoType,
            lat: branch.lat,
            lng: branch.lng,
        },
    };
    let res = await requestJPAAS(params);
    let info = res.data;
    return info;
}
export {
    getFirstConfig,
    getBranchesList,
    getDistrictList,
    getBranchDetail
}