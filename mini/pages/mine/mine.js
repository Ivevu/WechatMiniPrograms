// pages/mine/mine.js
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
        break;
      case 2:
        wx.navigateTo({
          url: `../recruitment/recruitment`
        })
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

    }
  },
  /** 
   * 获取用户信息
   */
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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