import {
  api
} from '../../config/config.js';
const app = getApp()

Page({
  data: {
    // 线下活动
    offlineActivityList: [],
    listOn: [],
    listout: [],
    nav: [{
        title: '活动进行中',
        isActive: true
      },
      {
        title: '活动已结束',
        isActive: false
      }
    ],
    isOff: false
  },

  // 前往活动详情
  tapOffAct(e) {
    const id = e.detail.id;
    const index = e.detail.index;
    // if (!this.data.isOff) { // 未过期
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=1&hasEnroll=1`
      });
    // }

  },

  // 获取线下活动列表
  getActivityList(type) {
    wx.request({
      url: api.enrolment,
      data: {
        openId: app.globalData.openId,
        type: 1
      },
      success: res => {
        if (!res.data.data) return;
        let list = res.data.data;
        let on = [];
        let out = [];
        list.forEach(item => {
          item.deadline = item.deadline.substring(0, 10);
          if (item.activityState == 1) {
            on.push(item);
          } else {
            out.push(item);
          }
        })
        this.setData({
          listOn: on,
          listout: out,
          offlineActivityList: on
        });
      }
    });
  },
  onLoad: function(options) {
    this.getActivityList(1);
  },
  ontap(e) {
    const index = e.currentTarget.dataset.index;
    let nav = this.data.nav;
    nav[index].isActive = true;
    nav[1 - index].isActive = false;
    this.setData({
      nav: nav
    });
    switch (index) {
      case 1:
        this.setData({
          offlineActivityList: this.data.listout,
          isOff: true
        });
        break;
      default:
        this.setData({
          offlineActivityList: this.data.listOn,
          isOff: false
        });
        break;
    }
  }
})