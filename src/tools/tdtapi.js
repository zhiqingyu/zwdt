import axios from 'axios'
/**
 * @param {根据行政区划获取行政区划经纬度} parmas 
 * @returns { 返回查询结果} returns
 */
function tdtSearch(parmas) {
    return new Promise((resolve, reject) => {
        const baseParams = JSON.stringify(parmas)
        axios({
            url: `https://api.tianditu.gov.cn/v2/search?postStr=${baseParams}&type=query&tk=b3fd4379c2bda38a28a2a0037529fa4b`,
            method: 'get',
        }).then(res => {
            resolve(res)
        }).catch(res => {
            reject(res)
        })
    })
};
/**
 * 
 */

export {
    tdtSearch,
}