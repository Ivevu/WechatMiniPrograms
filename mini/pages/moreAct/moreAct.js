import {
  api
} from '../../config/config.js';

Page({
  data: {
    // 线下活动
    offlineActivityList: [],
    listOn: [],
    listout: [],
    isOff: false
  },

  // 前往活动详情
  tapOffAct(e) {
    const id = e.detail.id;
    const index = e.detail.index;
    if (!this.data.isOff) { // 未过期
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=1`
      });
    }
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
        let out = [];
        console.log(list)
        list.forEach(item => {
          if (item.deadline) {
            item.deadline = item.deadline.substring(0, 10);
          }
          // if (item.activityState == 1) {
            on.push(item);
          // } else {
          //   out.push(item);
          // }
        })
        this.setData({
          listOn: on,
          listout: out,
          offlineActivityList: on
        });
      }
    });
  },
  onLoad: function (options) {
    this.getActivityList(1);
  },
})