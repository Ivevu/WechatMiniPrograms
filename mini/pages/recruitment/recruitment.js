import {
  api
} from '../../config/config.js';

Page({
  data: {
    recruitmentList: [],
  },
  tapRec(e) {
    const id = e.detail.id;
    const index = e.detail.index;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=2`
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
        if (!res.data.data) return;
        let list = res.data.data;
        let on = [];
        list.forEach(item => {
          if (item.endTime) {
            item.deadline = item.deadline.substring(0, 10);
          }
          if (item.activityState == 1) {
            on.push(item);
          }
        })
        this.setData({
          recruitmentList: on
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getActivityList(2);
  },
})