import {
  api
} from '../../config/config.js';
const app = getApp();
import Http from '../../utils/http.js';
const http = new Http();

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
  // 获取已投征稿活动列表
  getActivityList(type, openId) {
    wx.request({
      url: api.enrolment,
      data: {
        type: type,
        openId
      },
      success: res => {
        this.setList(res);
      }
    });
  },
  /**
   * @description 获取所有的征稿列表
   */
  getRecList() {
    http
      ._get(api.list, {
        type: 2
      })
      .then(res => {
        this.setList(res);
      })
  },
  setList(res) {
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
  },
  onLoad(options) {
    if (!options.hasOwnProperty('path')) return;
    this.setData({
      path: options.path
    });
  },
  onShow: function(options) {
    console.log(this.data)
    if (!!this.data.path) {
      this.getActivityList(2, app.globalData.openId)
    } else {
      this.getRecList();
    }
  },
})