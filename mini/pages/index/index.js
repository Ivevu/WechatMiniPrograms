//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      './assets/swiper.png',
      './assets/swiper.png',
      './assets/swiper.png',
    ],
    indicatorDots: true,
    indicatorColor: '#DCDCDC',
    indicatorActiveColor: '#FF646C',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    // 热门活动列表
    hotActivityList: [
      './assets/swiper1.png',
      './assets/swiper2.png',
    ],
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
        img: './assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21',
        number: 1999
      },
      {
        img: './assets/swiper2.png',
        header: '这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
        date: '2019-05-21',
        number: 1999
      }, {
        img: './assets/swiper2.png',
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

  onLoad: function() {
    const length = -(this.data.hotActivityList.length - 2) * 75 + 750
    this.setData({
      rightMargin: length + 'rpx'
    })
  },

})