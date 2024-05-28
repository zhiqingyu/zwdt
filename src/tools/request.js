import axios from 'axios'
import qs from 'qs'
let createsignurl = 'https://tftb.sczwfw.gov.cn:8085/jags-server/interface/createsign.do'
let gatewayurl = 'https://tftb.sczwfw.gov.cn:8085/jags-server/interface/gateway.do'

function Jpaas(param) {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().valueOf();
        param.timestamp = timestamp;
        $.ajax({
            type: "post",
            url: createsignurl,
            data: param,
            success: res => {
                if (res.success) {
                    let sign = res.data.sign;
                    param.sign = sign;
                    $.ajax({
                        type: "post",
                        url: gatewayurl,
                        data: param,
                        success: res => {
                            resolve(res)
                        },
                        err: err => {
                            reject(err)
                        }
                    })
                } else {
                    console.log('输入参数错误')
                }
            },
            err: err => {
                console.log(err, "err")
            }
        })

    })
}

function requestJPAAS({
    interface_id,
    app_id,
    params = {}
}) {
    return new Promise((resolve, reject) => {
        const baseParams = {
            version: '1.0',
            charset: 'UTF-8',
            origin: '1', //来源
            timestamp: new Date().getTime(),
            interface_id,
            app_id,
            biz_content: JSON.stringify(params)
        }
        axios({
            url: createsignurl,
            method: 'POST',
            data: qs.stringify(baseParams),
        }).then(res => {
            const sign = res.data.data.sign
            axios({
                url: gatewayurl,
                method: 'POST',
                data: qs.stringify({
                    sign,
                    ...baseParams
                }),
            }).then(res => {
                resolve(res)
            }).catch(res => {
                reject(res)
            })
        })
    })
}
export {
    Jpaas,
    requestJPAAS
}