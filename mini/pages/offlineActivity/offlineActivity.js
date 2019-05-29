import {
  api
} from '../../config/config.js';

Page({
  data: {
    // 线下活动
    offlineActivityList: [],
  },

  // 前往活动详情
  tapOffAct(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=1`
    });
  },
  
  // 获取线下活动列表
  getActivityList(type) {
    wx.request({
      url: api.list,
      data: {
        type: type
      },
      success: res => {
        this.setData({
          offlineActivityList: res.data.data
        });
      }
    });
  },
  onLoad: function(options) {
    this.getActivityList(1);
  },
})