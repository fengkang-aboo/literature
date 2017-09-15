import { Base } from '../../utils/base.js'

class My extends Base {
    constructor() {
        super()
    }

    // 得到用户微信信息
    getUserInfo(callBack) {
        var that = this;
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        typeof callBack == "function" && callBack(res.userInfo)
                    },
                    fail: function (res) {
                        typeof callBack == "function" && callBack({
                            avatarUrl: '../../images/icon/user@default.png',
                            nickName: 'Literature'
                        })
                    }
                })
            }
        })
    }

}
export { My }