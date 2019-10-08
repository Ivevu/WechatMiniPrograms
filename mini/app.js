//app.js
import {
  api
} from '/config/config.js'
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.request({
                url: api.login,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: this.globalData.code,
                  gender: this.globalData.userInfo.gender,
                  nickName: this.globalData.userInfo.nickName,
                  headImg: this.globalData.userInfo.avatarUrl
                },
                success: data => {
                  if (data.data.code === 200) {
                    this.globalData.openId = data.data.data
                  }
                },
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取设备型号
    wx.getSystemInfo({
      success: (res) => {
        let {
          system
        } = res
        this.globalData.isIOS = system.indexOf("iOS") > -1
      }
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    openId: null,
    isIOS: false
  }
})