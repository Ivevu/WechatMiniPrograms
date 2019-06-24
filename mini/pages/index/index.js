import {
  api
} from '../../config/config.js';
import Http from '../../utils/http.js'
const util = require('../../utils/util.js')
const app = getApp();


Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: '#DCDCDC',
    indicatorActiveColor: '#FF646C',
    autoplay: false,
    interval: 5000,
    duration: 3000,
    // 热门活动列表
    hotActivityList: [],
    // 
    rightMargin: '750rpx',
    // 线下活动
    offlineActivityList: [],
    // 我要投稿
    recruitmentList: [],
    // 我要助力
    helpList: []
  },
  /**
   * 更多线下活动
   */
  toMoreOffAct() {
    wx.navigateTo({
      url: `../moreAct/moreAct`
    });
  },


  tapOffAct(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=1`
    });
  },

  tapRec(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=2`
    });
  },

  // 前往热门活动
  toHot(e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.hotActivityList[index].activityId;
    if (parseInt(id) !== 0) {
      const activityType = this.data.hotActivityList[index].activityType;
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=${activityType}`
      });
    }
  },

  // 前往轮播图
  toSwiper(e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.imgUrls[index].activityId;
    const link = this.data.imgUrls[index].link;
    if (link) {
      wx.navigateTo({
        url: `/pages/link/link?link=${link}`,
      });
    } else if (parseInt(id) !== 0) {
      const activityType = this.data.imgUrls[index].activityType;
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=${activityType}`
      });
    };
  },


  /**
   * 更多投稿
   */
  toMoreRec() {
    wx.navigateTo({
      url: `../recruitment/recruitment`
    });
  },

  // 获取首页轮播图
  getHomeSlideshow() {
    wx.request({
      url: api.slideshow,
      success: res => {
        this.setData({
          imgUrls: res.data.data
        })
      }
    })
  },

  // 获取热门活动
  getHotList() {
    wx.request({
      url: api.hot,
      success: res => {
        this.setData({
          hotActivityList: res.data.data
        })
      }
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
        this.setList(res, type);
      }
    });
  },
  // 根据类型获取列表
  setList(res, type) {
    let list = [];
    switch (type) {
      case 1: // 线下活动
        if (!res.data.data) return false;
        res.data.data.forEach(item => {
          // 首页优先显示的热门活动
          if (parseInt(item.isPri) === 0 && item.activityState == 1) {
            list.push(item);
          };
          item.deadline = item.deadline.substring(0, 10);
        });
        this.setData({
          offlineActivityList: list
        });
        break;
      case 2: // 我要投稿
        if (!res.data.data) return false;
        res.data.data.forEach(item => {
          // 首页优先显示的热门活动
          if (parseInt(item.isPri) === 0 && item.activityState == 1) {
            list.push(item);
          };
          item.deadline = '征稿截止时间：' + item.deadline.substring(0, 10);
        });
        this.setData({
          recruitmentList: list
        });
        break;
      default: // 我要助力
        if (!res.data.data) return false;
        this.setData({
          helpList: res.data.data
        })
        break;
    }
  },
  /**
   * @description 跳往外链
   */
  toWeb(e) {
    const index = e.currentTarget.dataset.index;
    new Http()
      ._get(api.vote, {
        openId: app.globalData.openId,
        activityId: this.data.helpList[index].id
      }).then(res => {

      });
    wx.navigateTo({
      url: `/pages/link/link?link=${this.data.helpList[index].link}`,
    });

  },
  // 页面加载
  onShow: function() {
    // const length = -(this.data.hotActivityList.length - 2) * 75 + 750
    // this.setData({
    //   rightMargin: length + 'rpx'
    // });

    this.getHomeSlideshow();
    this.getHotList();
    this.getActivityList(1);
    this.getActivityList(2);
    this.getActivityList(3);
  },
})