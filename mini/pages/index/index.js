//index.js
//获取应用实例
import {
  api
} from '../../config/config.js';
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
    duration: 1000,
    // 热门活动列表
    hotActivityList: [],
    // 
    rightMargin: '750rpx',
    // 线下活动
    offlineActivityList: [{
        img: './assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21'
      },
      {
        img: './assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21'
      }, {
        img: './assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21'
      }
    ],
    // 我要投稿
    recruitmentList: [{
        img: '/pages/index/assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21',
        number: 1999
      },
      {
        img: '/pages/index/assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21',
        number: 1999
      }, {
        img: '/pages/index/assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21',
        number: 1999
      }
    ],
    // 我要助力
    helpList: [{
        img: './assets/swiper2.png',
      },
      {
        img: './assets/swiper2.png',
      },
      {
        img: './assets/swiper2.png',
      },
      {
        img: './assets/swiper2.png',
      },
    ]
  },
  /**
   * 更多线下活动
   */
  toMoreOffAct() {
    wx.navigateTo({
      url: `../offlineActivity/offlineActivity`
    })
  },
  tapOffAct(e) {
    const index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset)
  },
  /**
   * 更多投稿
   */
  toMoreRec() {
    wx.navigateTo({
      url: `../recruitment/recruitment`
    })
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
        this.setData({
          offlineActivityList: res.data.data
        })
      }
    });
  },
  // 页面加载
  onLoad: function() {
    const length = -(this.data.hotActivityList.length - 2) * 75 + 750
    this.setData({
      rightMargin: length + 'rpx'
    });

    this.getHomeSlideshow();
    this.getHotList();
    this.getActivityList(1);
  },
})