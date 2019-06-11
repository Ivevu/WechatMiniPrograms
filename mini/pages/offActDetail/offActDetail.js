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
    uploadFileList: [ // 上传文件类型
      {
        desc: '征稿材料(Word版，不超过5M)',
      },
      {
        desc: '征稿材料(PDF版，不超过5M)'
      },
      {
        desc: '征稿材料(图片版)'
      }
    ],
    gender: ['男', '女'],
    formId: 0, // 报名表单索引
    userInfo: '', // 用户信息
    mode: 'widthFix',
    hasEnroll: 0,
    overstayed: false, // 活动已过期
    openId: '',
    type: 1, // 1 表示线下活动 2表示征稿活动
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

    this.checkAgain();
  },
  // 二次确认
  checkAgain() {
    wx.showModal({
      title: '请确认报名信息内容',
      content: '提交后不可更改',
      cancelText: '再次确认',
      confirmText: '提交',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          // 表单正确，请求上传
          wx.showLoading({
            title: '数据上传中...',
          });
          this.postForm();
        }
      }
    })
  },
  // 报名接口
  postForm() {
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
            title: '报名成功',
            duration: 1000,
            icon: "success"
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/offlineActivity/offlineActivity',
            });
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
            showRule: false
          });
        }
      }
    });
  },
  // 我要报名
  signUp() {
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
            showRule: false
          });
        } else {
          this.setData({
            showRule: false
          });
        }
      }
    });
  },
  // 我要投稿
  toContribute() {
    this.setData({
      showRule: false
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

  // 上传文件
  uploadFile(e) {
    const type = e.currentTarget.dataset.index;
    switch (type) {
      case 2: // image
        this.reloadImg();
        break;
      default:
        this.uploadPdfOrWord(type);
        break;
    }

  },
  uploadPdfOrWord(type) {
    let uploadFileList = this.data.uploadFileList;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: type == 1 ? ['pdf'] : ['doc', 'docx'],
      success: (res) => {
        const filename = res.tempFiles[0].name;
        const filesize = res.tempFiles[0].size;
        if (filesize >= 1024 * 5 * 1024) {
          this.showModal('请上传不超过5M的文件');
          return false;
        }
        if (type == 1) {
          Object.assign(uploadFileList[1], {
            filename: filename,
            fileType: '征稿材料(PDF)',
            type: 'pdf',
            isUpload: true
          })
        } else {
          Object.assign(uploadFileList[0], {
            filename: filename,
            fileType: '征稿材料(Word)',
            type: 'word',
            isUpload: true
          })
        }
        this.setData({
          uploadFileList: uploadFileList
        });
      },
      fail: (error) => {
        // 取消上传的时候会触发
        // this.showModal('网络出错');
      }
    });
  },

  // 重新上传文件
  reupload(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
      case 'pdf':
        this.uploadPdfOrWord(1);
        break;
      default:
        this.uploadPdfOrWord(0);
    }
  },

  // 重新上传照片
  reloadImg() {
    let uploadFileList = this.data.uploadFileList;
    let length = uploadFileList[2].tempFiles ? uploadFileList[2].tempFiles.length : 0;

    wx.chooseImage({
      count: 9 - (length ? length : 0),
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (uploadFileList[2].hasOwnProperty('tempFiles')) {
          let temp = uploadFileList[2].tempFiles;
          uploadFileList[2].tempFiles = uploadFileList[2].tempFiles.concat(res.tempFiles); // concat不会改变原有的数组
        } else {
          Object.assign(uploadFileList[2], {
            tempFiles: res.tempFiles,
            isUpload: true
          });
        }
        if (uploadFileList[2].tempFiles && uploadFileList[2].tempFiles.length > 0) {
          uploadFileList[2].isUpload = true;
        }
        this.setData({
          uploadFileList: uploadFileList
        });
      }
    })
  },
  // 预览某个图片
  previewImg(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.uploadFileList[2].tempFiles;
    let pathList = list.map(item => {
      return item.path
    });
    wx.previewImage({
      current: pathList[index], // 当前显示图片的http链接
      urls: pathList // 需要预览的图片http链接列表
    })
  },

  // 删除某个图片
  delImg(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      content: '确认删除？',
      success: (res) => {
        if (res.confirm) {
          let list = this.data.uploadFileList;
          list[2].tempFiles.splice(index, 1);
          if (list[2].tempFiles.length == 0) {
            list[2].isUpload = false;
          }
          this.setData({
            uploadFileList: list
          });
        }
      }
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
    this.setData({
      type: parseInt(type)
    });
    wx.request({
      url: api.activityDetail,
      data: {
        type: 1,
        id: 14,
      },
      success: res => {
        let detail = res.data.data;
        if (!detail) return;
        this.checkType(detail, type, res);
      }
    })
  },

  /**
   * 判断是线下活动 还是 征稿
   */
  checkType(detail, type, res) {
    switch (parseInt(type)) {
      case 1:
        this.setOffActivity(detail, res);
        break;
      case 2:
        this.setOffActivity(detail, res);
        break
    }
  },

  // 获取线下活动详情
  setOffActivity(detail, res) {
    const length = detail.likeNum ? parseInt(detail.likeNum) : 0;
    detail.deadline = detail.deadline ? detail.deadline.substring(0, 10) : '';
    detail.endTime = detail.endTime ? detail.endTime.substring(0, 10) : '';
    detail.startTime = detail.startTime ? detail.startTime.substring(0, 10) : '';
    detail.likeNum = new Array(length);
    if (this.data.hasEnroll && this.data.hasEnroll == 1) { // 已报名
      this.setData({
        showRule: false
      });
    };
    if (detail.activityState == 2) { // 活动已过期
      this.setData({
        overstayed: true,
        showRule: true
      });
    } else {
      this.setData({
        overstayed: false
      });
    };
    this.setData({
      detail: res.data.data
    });
  },


  // 获取征稿活动详情
  setRecActivity(detail, res) {
    const length = detail.likeNum ? parseInt(detail.likeNum) : 0;
    detail.deadline = detail.deadline ? detail.deadline.substring(0, 10) : '';
    detail.endTime = detail.endTime ? detail.endTime.substring(0, 10) : '';
    detail.startTime = detail.startTime ? detail.startTime.substring(0, 10) : '';
    detail.likeNum = new Array(length);
    if (this.data.hasEnroll && this.data.hasEnroll == 1) { // 已报名
      this.setData({
        showRule: false
      });
    };
    if (detail.activityState == 2) { // 活动已过期
      this.setData({
        overstayed: true,
        showRule: true
      });
    } else {
      this.setData({
        overstayed: false
      });
    };
    this.setData({
      detail: res.data.data
    });
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
                this.setData({
                  openId: data.data.data
                });
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
      hasEnroll: options.hasEnroll ? options.hasEnroll : null
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