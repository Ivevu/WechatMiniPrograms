// pages/offActDetail/offActDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showRule: false,
    rightButton: "我要报名",
    detail: {
      cover: "./assets/title.png",
      title: "广东省卫生健康系统“广东医生家国情”系列主题活动",
      address: "广东省卫生健康所",
      host: "广东省健康卫生局",
      time: "2019年6至10月份",
      endTime: "2019年6至10月份",
      likes: [1, 2, 3, 4, 5],
      rule: "./assets/rules.png"
    },
    formList: [
      [{
          label: "姓名",
          placeholder: "请输入您的姓名"
        },
        {
          label: "性别",
          placeholder: "请选择您的性别"
        },
        {
          label: "单位",
          placeholder: "请输入您的单位名称"
        },
        {
          label: "职务",
          placeholder: "请输入您的职务名称"
        },
        {
          label: "电话",
          placeholder: "请输入您的电话号码"
        },
        {
          label: "地址",
          placeholder: "请输入您的地址"
        },
        {
          label: "备注",
          isTextArea: true
        }
      ]
    ]
  },
  signUp() {
    this.setData({
      showRule: false,
      rightButton: "提交"
    });
  },
  // 新增报名
  add() {
    this.data.formList.push([{
        label: "姓名",
        placeholder: "请输入您的姓名"
      },
      {
        label: "性别",
        placeholder: "请选择您的性别"
      },
      {
        label: "单位",
        placeholder: "请输入您的单位名称"
      },
      {
        label: "职务",
        placeholder: "请输入您的职务名称"
      },
      {
        label: "电话",
        placeholder: "请输入您的电话号码"
      },
      {
        label: "地址",
        placeholder: "请输入您的地址"
      },
      {
        label: "备注",
        isTextArea: true
      }
    ])
    this.setData({
      formList: this.data.formList
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const id = options.id;
    console.log(id);
    wx.showToast({
      title: '成功',
      icon: 'loading',
      duration: 2000
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});