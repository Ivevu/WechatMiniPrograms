import {
  api
} from '../../config/config.js';
const app = getApp();

Page({
  data: {
    recruitmentList: [],
    path: ''
  },
  tapRec(e) {
    const id = e.detail.id;
    const index = e.detail.index;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=2`
    });
  },
  // 获取线下活动列表
  getActivityList(type, openId) {
    wx.request({
      url: api.enrolment,
      data: {
        type: type,
        openId
      },
      success: res => {
        if (!res.data.data) return;
        let list = res.data.data;
        let on = [];
        list.forEach(item => {
          if (item.deadline) {
            item.deadline = '征稿截止时间：' + item.deadline.substring(0, 10);
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
  onLoad(options) {
    this.setData({
      path: options.path
    });
  },
  onShow: function(options) {
    if (this.data.path) {
      this.getActivityList(2, app.globalData.openId)
    } else {
      this.getActivityList(2);
    }
  },
})