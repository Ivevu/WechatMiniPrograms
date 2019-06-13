import Http from '../../utils/http.js';
import {
  api
} from '../../config/config.js';
const http = new Http();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteList: []
  },
  toWeb(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/link/link?link=${this.data.voteList[index].link}`,
    })
  },
  getList() {
    const param = {
      type: 3
    };
    http
      ._get(api.list, param)
      .then(res => {
        this.setData({
          voteList: res.data.data
        });
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
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