import {
    baseUrl
} from "./HTTP"
import requestJpaas from "./jpaas_request";
import Vue from 'vue';
import {
    Toast
} from 'vant';
Vue.use(Toast);

const jssdk = {
        // 获取用户信息
        onGetUserTicket() {
            return new Promise((resolve, reject) => {
                let that = this;
                lightAppJssdk.user.getTicketNew({
                    success: function(data) {
                        //成功回调
                        console.log("jssdk", data)
                        if (data == "未登录") {
                            that.onLoginApp();
                        } else {
                            let userInfo = JSON.parse(data);
                            sessionStorage.setItem("username", userInfo.username)
                            resolve(that.getUser('userInfo.username', userInfo.jwtToken, userInfo.socialCreditCode))
                        }
                    },
                    fail: function() {
                        //错误返回
                        that.oncloseWindow();
                    }
                });
            })
        },
        getUser(username, jwtToken, socialCreditCode = '') {
            return new Promise(async(resolve, reject) => {
                let param = {
                    interface_id: "hqyhxxaqcs",
                    app_id: "aqcsjkts",
                    params: {
                        username: username,
                        jwtToken: jwtToken,
                        socialCreditCode: socialCreditCode
                    },
                };
                const res = await Jpaas(param)
                if (socialCreditCode == '') {
                    let zrr = res.data
                    console.log(zrr);
                    let info = zrr.real
                    let user = {
                        // userName: info.realName,
                        userNameMask: info.realNameMaskShow,
                        idCardMask: info.idNumberMaskShow,
                        // idCard: info.idNumber,
                        // tel: zrr.base.employeeMobile,
                        telMask: zrr.base.usernameMaskShow,
                        type: "20"
                    }
                    resolve(user)
                } else {
                    let fr = res.data
                    console.log(fr);
                    let info = fr.base;
                    let user = {
                        // userName: info.deptPerson,
                        userNameMask: info.deptPersonMaskShow,
                        idCardMask: info.deptPersonCodeMaskShow,
                        // idCard: info.deptPersonCode,
                        // tel: info.employeeMobile,
                        telMask: info.usernameMaskShow,
                        socialCreditCode: info.socialCreditCode,
                        type: "10"
                    }
                    resolve(user)
                }
            })
        },
        // 登陆
        onLoginApp() {
            const that = this;
            lightAppJssdk.user.loginapp({
                success: function(data) {
                    //成功回调
                    if (data == "未登录") {
                        that.oncloseWindow();
                    } else {
                        window.location.reload()
                        let userInfo = JSON.parse(data);
                        that.getUser(userInfo.userName, userInfo.jwtToken, userInfo.socialCreditCode)
                    }
                },
                fail: function() {
                    that.oncloseWindow();
                }
            });
        },
        // 关闭
        oncloseWindow() {
            lightAppJssdk.navigation.close({
                success: function(data) {
                    //成功回调
                },
                fail: function(data) {
                    //错误返回
                }
            });
        }
    }
    // 涉及sm4加密的请求
function getInfo(
    val,
    encryptKey = 'sNOxqjEBxNhsKKjr',
    decryptKey = "EG7zzJzE7n9l3y6s"
) {
    let sm4en = new SM4Util();
    sm4en.secretKey = encryptKey;
    let dataA = sm4en.encryptData_ECB(JSON.stringify(val));
    // console.log(dataA);
    return new Promise(async(resolve, reject) => {
        let timestamp = new Date().valueOf();
        let that = this;
        lightAppJssdk.user.getTicketNew({
            success: async function(data) {
                //成功回调
                if (data == "未登录") {
                    that.onLoginApp();
                } else {
                    let userInfo = JSON.parse(data);
                    let param = {
                        interface_id: "turnInterface",
                        // interface_id: "turnInterfaceCS",
                        app_id: "aqcsjkts",
                        params: {
                            data: dataA,
                            type: "sm4",
                            groupId: "tftb",
                        },
                        header: {
                            jwtToken: userInfo.jwtToken
                        },
                    };
                    const res = await Jpaas(param)
                    console.log(res, 'getInfo');
                    if (res.code == 200 && res.data) {
                        let sm4de = new SM4Util();
                        sm4de.secretKey = decryptKey;
                        let data = sm4de.decryptData_ECB(res.data);
                        console.log(JSON.parse(JSON.parse(data)), 'datda');
                        resolve(JSON.parse(JSON.parse(data)))
                    } else {
                        resolve()
                    }
                }
            },
            fail: function() {
                //错误返回
                that.oncloseWindow();
            }
        });



    })
}
// 普通网关接口调用
function Jpaas(param) {
    return new Promise(async(resolve, reject) => {
        console.log('来了吗？？');
        dataMonitoringBurialPoint()
        requestJpaas.getData(param).then((res) => {
            console.log(res, '获取用户信息');
            resolve(res)
        }).catch((err) => {
            console.log(err, 'err');
            reject(err)
        })
    })
}

// 数据监测埋点
async function dataMonitoringBurialPoint() {
    console.log("调用埋点接口");
    let param = {
        // interface_id: "kp_zhengcerili",
        // app_id: "zcrl",
        params: {
            // year: "2024",
            // addressCode: "510000",
        },
    };
    // let res = await requestJpaas.getData(param);
    // console.log(res, '调用埋点接口');
}

function JpaasMy(param) {
    var toast1 = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: '0',
        transition: 'slide-fade',
    });
    return new Promise((resolve, reject) => {
        const timestamp = new Date().valueOf();
        param.timestamp = timestamp;
        $.ajax({
            type: "post",
            url: "http://218.89.178.237:280/jpaas-jags-server/interface/createsign.do",
            data: param,
            success: res => {
                if (res.success) {
                    let sign = res.data.sign;
                    param.sign = sign;
                    $.ajax({
                        type: "post",
                        url: "http://218.89.178.237:280/jpaas-jags-server/interface/gateway.do",
                        data: param,
                        success: res => {
                            resolve(res)
                            toast1.clear();
                        },
                        err: err => {
                            reject(err)
                            toast1.clear();
                        }
                    })
                } else {
                    console.log('输入参数错误')
                    toast1.clear();
                }
            },
            err: err => {
                console.log(err, "err")
            }
        })

    })
}

export {
    jssdk,
    Jpaas,
    getInfo,
    JpaasMy
}