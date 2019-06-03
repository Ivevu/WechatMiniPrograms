import {
  api
} from '../../config/config.js';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '未登陆',
    userInfo: {}, // 用户信息
    list: [{
        icon: './assets/voice.png',
        value: '线下活动',
      },
      {
        icon: './assets/list.png',
        value: '我的作品',
      },
      {
        icon: './assets/chat.png',
        value: '参与投票',
      }
    ]
  },
  clickIt(e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case 1:
        wx.showModal({
          title: '',
          content: '功能暂未开放',
          showCancel: false,
          confirmText: '好的'
        })
        break;
      case 2:
        wx.showModal({
          title: '',
          content: '功能暂未开放',
          showCancel: false,
          confirmText: '好的'
        })
        // wx.navigateTo({
        //   url: `../recruitment/recruitment`
        // })
        break;
      default:
        wx.navigateTo({
          url: `../offlineActivity/offlineActivity`
        })
        break;
    }
  },
  /**
   * 判断用户是否授权
   */
  checkAuth() {
    // 用户已授权
    if (app.globalData.userInfo) {
      let userInfo = app.globalData.userInfo;
      if (userInfo && userInfo.nickName.length > 6) {
        userInfo.nickName = userInfo.nickName.substring(0, 6) + '...'
      }
      this.setData({
        userInfo: userInfo
      });
    } else {
      this.setData({
        userInfo: null
      });
    }
  },
  /** 
   * 获取用户信息
   */
  getUserInfo(e) {
    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo;
        if (userInfo.nickName.length > 6) {
          userInfo.nickName = userInfo.nickName.substring(0, 6) + '...'
        }
        this.setData({
          userInfo: userInfo
        });
        wx.login({
          success: result => {
            wx.request({
              url: api.login,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: result.code,
                gender: res.userInfo.gender,
                nickName: res.userInfo.nickName,
                headImg: res.userInfo.avatarUrl
              },
              success: data => {
                app.globalData.userInfo = res.userInfo;
                app.globalData.openId = data.data.data;
              },
            })
          }
        });
      }
    });
    // 登录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkAuth();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})