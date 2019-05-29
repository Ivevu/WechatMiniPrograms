// pages/offActDetail/offActDetail.js
import {
  api
} from '../../config/config.js';

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
    form: {
      name: '',
      gender: '',
      company: '',
      post: '',
      phone: '',
      address: '',
      remark: ''
    },
    gender: ['男', '女'],
    genderPlaceHolder: '请选择您的性别'
  },
  formSubmit(e) {
    const params = e.detail.value;
    let isError = true;
    // 保存表单
    this.setData({
      form: params
    });
    //校验表单
    Object.keys(params).forEach(item => {
      if (!params[item]) {
        isError = true;
      } else {
        isError = false;
      }
    });
    if (isError) {
      this.showModal('请完善表单');
    }
  },
  // 新增报名
  add() {

  },
  // 保存表单
  keepForm(e) {
    const name = e.currentTarget.dataset.index;
    let form = this.data.form;
    form[name] = e.detail.value;
    this.setData({
      form: form
    });
  },
  // 获取选择器性别类型
  getGenderType(e) {
    const index = e.detail.value;
    let form = this.data.form;
    form.gender = parseInt(e.detail.value) + 1;
    this.setData({
      form: form,
      genderPlaceHolder: this.data.gender[index]
    });
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },
  /**
   * 获取活动详情
   */
  getActDetail(id) {
    wx.request({
      url: api.activityDetail,
      // data:{
      //   type: ,
      //   id: ,
      // }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const id = options.id;
  },
});