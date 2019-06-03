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
    duration: 3000,
    // 热门活动列表
    hotActivityList: [],
    // 
    rightMargin: '750rpx',
    // 线下活动
    offlineActivityList: [],
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
      url: `../moreAct/moreAct`
    });
  },
  tapOffAct(e) {
    const id = e.detail.id;
    wx.navigateTo({
      url: `../offActDetail/offActDetail?id=${id}&type=1`
    });
  },

  // 前往热门活动
  toHot(e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.hotActivityList[index].activityId;
    if (parseInt(id) !== 0) {
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=1`
      });
    }
  },

  // 前往轮播图
  toSwiper(e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.imgUrls[index].activityId;
    if (parseInt(id) !== 0) {
      wx.navigateTo({
        url: `../offActDetail/offActDetail?id=${id}&type=1`
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
        let list = [];
        res.data.data.forEach(item => {
          // 首页优先显示的热门活动
          if (parseInt(item.isPri) === 0 && item.activityState == 1) {
            list.push(item);
          };
          item.endTime = item.endTime.substring(0,10);
        });
        this.setData({
          offlineActivityList: list
        });
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