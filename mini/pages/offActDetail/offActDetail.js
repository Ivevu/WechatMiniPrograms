import {
  api
} from '../../config/config.js';
const app = getApp();

Page({
  data: {
    activityId: '', // 活动id
    hasSignUp: true, // false表示未参加报名
    showRule: true, // true表示显示详情
    rightButton: "我要报名",
    detail: {},
    formList: [{
      name: '',
      gender: '',
      company: '',
      post: '',
      phone: '',
      address: '',
      remark: '',
      genderPlaceHolder: '请选择您的性别',
      isActive: false,
    }],
    gender: ['男', '女'],
    formId: 0, // 报名表单索引
    userInfo: '', // 用户信息
    mode: 'widthFix',
    hasEnroll: 0
  },

  // 提交表单
  formSubmit(e) {
    const params = e.detail.value;
    let isError = true;
    let isErrPhone = true;
    //校验表单
    Object.keys(params).forEach(item => {
      if (!params[item] && item.replace(/[0-9]/g, '') !== 'remark' && item.replace(/[0-9]/g, '') !== 'address') {
        isError = true;
      } else {
        isError = false;
      }
    });

    // 表单不完整
    if (isError) {
      this.showModal('请完善表单');
      return false;
    };

    this.data.formList.forEach(item => {
      const phoneRegxp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!phoneRegxp.test(item.phone)) {

        isErrPhone = true;
      } else {
        isErrPhone = false;
      };
    });
    if (isErrPhone) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      });
      return false;
    }

    // 表单正确，请求上传
    wx.showLoading({
      title: '数据上传中...',
    });
    wx.request({
      url: api.signUp,
      method: "post",
      data: {
        openId: app.globalData.openId,
        activityId: this.data.activityId,
        userOfflines: this.data.formList
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({
            title: '上传成功',
            duration: 1000,
            icon: "success"
          });
          // this.getSignUpList();
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 1000,
            icon: "none"
          });
        }
      },
      fail: error => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          duration: 1000,
          icon: "none"
        });
      }
    });
  },

  // 获取报名信息
  getSignUpList() {
    wx.request({
      url: api.signUpList,
      data: {
        openId: app.globalData.openId,
        activityId: this.data.activityId,
      },
      success: res => {
        if (!!res.data.data) {
          let formList = res.data.data;
          formList.forEach(item => {
            item.isActive = true;
            if (parseInt(item.gender) === 1) {
              item.genderPlaceHolder = '男';
            } else {
              item.genderPlaceHolder = '女';
            }
          });
          this.setData({
            formList: formList,
            hasSignUp: false,
          });
        }
      }
    });
  },

  // 我要报名
  signUp() {
    this.setData({
      showRule: false,
    });
  },

  // 新增报名
  add() {
    const form = {
      name: '',
      gender: '',
      company: '',
      post: '',
      phone: '',
      address: '',
      remark: '',
      genderPlaceHolder: '请选择您的性别',
      isActive: false,
    };
    let newList = this.data.formList;
    newList.push(form);
    this.setData({
      formList: newList
    });
  },

  // 获取报名表单索引
  getFormId(e) {
    this.setData({
      formId: e.currentTarget.dataset.formid
    });
  },

  // 保存表单
  keepForm(e) {
    const formId = this.data.formId;
    const name = e.currentTarget.dataset.index.replace(/[0-9]/g, ''); // 清除数字

    let formList = this.data.formList;
    formList[formId][name] = e.detail.value;

    this.setData({
      formList: formList
    });
  },

  // 获取选择器性别类型
  getGenderType(e) {
    const formId = this.data.formId;
    const index = e.detail.value;

    let formList = this.data.formList;
    formList[formId].gender = (parseInt(e.detail.value) + 1) + '';
    formList[formId].genderPlaceHolder = this.data.gender[index];
    formList[formId].isActive = true;

    this.setData({
      formList: formList,
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

  getActDetail(id, type) {
    wx.request({
      url: api.activityDetail,
      data: {
        type: type,
        id: id,
      },
      success: res => {
        let detail = res.data.data;
        const length = detail.likeNum ? parseInt(detail.likeNum) : 0;
        detail.endTime = detail.endTime.substring(0, 10);
        detail.startTime = detail.startTime.substring(0, 10);
        detail.likeNum = new Array(length);
        if (this.data.hasEnroll == 1) {
          this.setData({
            showRule: false
          })
        }
        this.setData({
          detail: res.data.data
        });
      }
    })
  },

  /** 
   * 获取用户信息
   */
  getUserInfo(e) {
    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo;
        this.setData({
          userInfo: userInfo
        });
        app.globalData.userInfo = userInfo;
        wx.login({
          success: result => {
            wx.request({
              url: api.login,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: result.code,
                gender: res.userInfo.gender,
                nickName: res.userInfo.nickName,
                headImg: res.userInfo.avatarUrl
              },
              success: data => {
                app.globalData.openId = data.data.data;
                this.signUp();
              },
            })
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activityId: options.id,
      hasEnroll: options.hasEnroll
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
    this.getActDetail(options.id, options.type);
    this.getSignUpList();
  },
});