import {
  api
} from '../../config/config.js';
import Http from '../../utils/http.js';
const app = getApp();
const http = new Http();

Page({
  preventTouchMove() {},
  data: {
    activityId: '', // 活动id
    hasSignUp: true, // false表示未参加报名
    showRule: true, // true表示显示详情
    rightButton: "我要报名",
    detail: {},
    formList: [],
    gender: ['男', '女'],
    userInfo: '', // 用户信息
    mode: 'widthFix',
    hasEnroll: 0,
    overstayed: false, // 活动已过期
    openId: '',
    type: 1, // 1 表示线下活动 2表示征稿活动
    uploading: false,
    uploadPercent: 0,
    uploadDone: false,
    timer: 0,
    isPost: false,
    recList: [],
    currentPage: 1,
    likeStatus: './assets/like.png'
  },

  // 提交表单
  formSubmit(e) {
    if (!this.vertifyForm(e)) {
      return false;
    } else {
      this.data.type == 1 ? this.beforePostOffForm() : this.checkRecForm(e);
    }
  },

  /**
   * 检验表单
   */
  vertifyForm(e) {
    const params = e.detail.value;
    let isError = true;
    let isErrPhone = true;
    //校验表单
    Object.keys(params).forEach(item => {
      if (item.replace(/[0-9]/g, '') !== 'remark' && item.replace(/[0-9]/g, '') !== 'address') { // 不为 备注  地址
        if (!params[item]) {
          isError = true;
        } else {
          isError = false;
        }
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
    return true;
  },

  /**
   * @description 提交报名信息前提示
   */
  beforePostOffForm() {
    let formList = this.getFormList();
    formList.forEach(form => {
      form.openId = app.globalData.openId;
      form.activityId = this.data.activityId;
    });
    this.checkOffForm(formList);
  },
  /**
   * @description 二次确认表单信息
   */
  checkOffForm(form) {
    console.log('提交表单', form)
    wx.showModal({
      title: '请确认报名信息内容',
      content: '提交时请确认个人基本信息及附件内容',
      cancelText: '再次确认',
      confirmText: '提交',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          // 表单正确，请求上传
          wx.showLoading({
            title: '数据上传中...',
          });
          this.postForm(form);
        }
      }
    });
  },
  /**
   * @description 重新编辑报名
   */
  edit() {
    let _formList = this.data.formList;
    _formList.map(form => {
      this.mixObj(this.data.type, form);
      form.orDocumentList.map(file => {
        switch (file.fileType) {
          case 0: // doc
            Object.assign(form.uploadFileList[0], {
              filename: file.filename,
              fileType: '征稿材料(Word)',
              type: 'word',
              path: file.path,
              isLocalUploaded: true,
            });
            break;
          case 1: // pdf
            Object.assign(form.uploadFileList[1], {
              filename: file.filename,
              fileType: '征稿材料(PDF)',
              type: 'pdf',
              path: file.path,
              isLocalUploaded: true
            });
            break;
          case 2: // 图片
            form.uploadFileList[2].tempFiles.push({
              path: file.path
            });
            form.uploadFileList[2].isLocalUploaded = true;
            form.uploadFileList[2].isEdit = true
            break;
        }
      });
    });
    this.setData({
      hasSignUp: true,
      formList: _formList,
    });
  },
  // 报名接口
  postForm(form) {
    wx.request({
      url: api.signUp,
      method: "post",
      data: form,
      success: res => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({
            title: '报名成功',
            duration: 1000,
            icon: "success"
          });
          wx.redirectTo({
            url: '/pages/offlineActivity/offlineActivity',
          });
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
          formList = this.tranlateGenderType(formList);
          this.setData({
            formList: formList,
            hasSignUp: false,
            showRule: true
          });
        }
      }
    });
  },
  tranlateGenderType(formList) {
    formList.forEach(item => {
      item.isActive = true;
      if (parseInt(item.gender) === 1) {
        item.genderPlaceHolder = '男';
      } else {
        item.genderPlaceHolder = '女';
      }
    });

    return formList;
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
          formList = this.tranlateGenderType(formList);
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
    if (this.data.showRule && this.data.hasSignUp) {
      this.setData({
        showRule: false
      });
    } else {
      this.setData({
        showRule: false
      });
      this.edit();
    }
  },
  /**
   * @description 提取表单信息
   */
  getFormList() {
    let _formList = this.data.formList;
    _formList.forEach(form => {
      if (form.hasOwnProperty('orDocumentList') && form.orDocumentList[0]) { // 修改

      } else {
        form.orDocumentList = [];
      }
      form.uploadFileList.forEach((item, index) => {
        if (index !== 2) {
          if (!item.finalName) return;
          form.orDocumentList.push({
            filename: item.finalName,
            path: item.finalPath,
            fileType: index,
          });
        } else {
          form.uploadFileList[2].tempFiles.forEach(file => {
            if (file.finalName) {
              form.orDocumentList.push({
                filename: file.finalName,
                path: file.finalPath,
                fileType: index,
              });
            }
          });
        }
      });
    });
    return _formList;
  },
  /**
   * @description 提交征稿表单
   */
  checkRecForm(e) {
    let form = this.getFormList()[0];
    form.openId = app.globalData.openId;
    form.activityId = this.data.activityId;
    if (form.orDocumentList.length < 1) { // 没附件
      wx.showModal({
        title: '您未上传文件材料，是否上传？',
        content: '提交时请确认个人基本信息及附件内容',
        cancelText: '去上传',
        confirmText: '提交',
        confirmColor: '#F44336',
        success: (res) => {
          if (res.confirm) {
            // 表单正确，请求上传
            wx.showLoading({
              title: '数据上传中...',
            });
            this.postRecForm(form);
          }
        }
      });
    }
    //  else if (form.uploadFileList[2].tempFiles.length > 0) {
    //   // if (!form.uploadFileList[2].hasUploadImg) {
    //   //   this.showModal('请先确认上传图片');
    //   //   return false;
    //   // }
    //   this.checkRecAgain(form);
    // } 
    else {
      this.checkRecAgain(form);
    }
  },
  checkRecAgain(form) {
    wx.showModal({
      title: '请确认征稿信息内容',
      content: '提交时请确认个人基本信息及附件内容',
      cancelText: '再次确认',
      confirmText: '提交',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          // 表单正确，请求上传
          wx.showLoading({
            title: '数据上传中...',
          });
          this.postRecForm(form);
        }
      }
    });
  },
  /**
   * @description 提交征稿信息
   */
  postRecForm(form) {
    const header = {
      'content-type': 'application/json'
    };
    console.log(form)
    http
      ._post(api.userContribute, form, header)
      .then(res => {
        if (res.data.code == 200) {
          wx.hideLoading();
          this.setData({
            uploading: true,
            uploadDone: true,
            isPost: true
          })
        } else {
          wx.showToast({
            title: '网络错误',
            duration: 1000,
            icon: "none"
          });
        }
      }).catch(error => {
        wx.showToast({
          title: '网络错误',
          duration: 1000,
          icon: "none"
        });
      });
  },
  /**
   * @description 判断是征稿还是报名初始化formList类型
   * @return [formList] 初始化formList
   */
  checkPageType(type) {
    const common = {
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
    return this.mixObj(type, common);
  },

  // 混合对象
  mixObj(type, common) {
    return type == 1 ? [Object.assign(common, {
      uploadFileList: [{
          desc: '报名材料(Word版，不超过5M)',
        },
        {
          desc: '报名材料(PDF版，不超过5M)'
        },
        {
          desc: '报名材料(图片版)',
          tempFiles: []
        }
      ]
    })] : [Object.assign(common, {
      uploadFileList: [{
          desc: '征稿材料(Word版，不超过5M)',
        },
        {
          desc: '征稿材料(PDF版，不超过5M)'
        },
        {
          desc: '征稿材料(图片版)',
          tempFiles: []
        }
      ]
    })];
  },

  /**
   * @descripition 新增报名信息表格
   */
  add() {
    let form = this.checkPageType(this.data.type);
    let newList = this.data.formList;
    newList.push(form[0]);
    this.setData({
      formList: newList
    });
  },

  /**
   * @description 隐藏弹窗
   */
  hidePop() {
    if (this.data.isPost) {
      wx.navigateTo({
        url: `/pages/recruitment/recruitment?path="my"`,
      });
    } else {
      this.setData({
        uploading: false,
        uploadDone: false
      });
    }
  },

  /**
   * @description 显示弹窗
   */
  showPop() {
    this.setData({
      uploading: true,
      uploadDone: false
    });
  },

  /**
   * @description 微信自带toast组件
   */
  showToast(title, icon = "none", duration = 1000) {
    wx.showToast({
      title: title,
      duration: duration,
      icon: icon,
    });
  },
  /**
   * @description 上传文件到服务器
   * @params {fileType} 1图片 2文档
   * @params {fileName} 图片/文档名称
   * @params {filePath} 图片/文档临时路径
   * @params {type} 1 PDF 2 word
   */
  uploadToServer(fileType, fileName, filePath, type, formId) {
    this.showPop();
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: api.upload,
        filePath: filePath,
        name: "file",
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          file: 'file',
          fileType: fileType,
          fileName: fileName
        },
        success: (res) => {
          console.log(res.data)
          console.log(typeof res.data)
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (data.code == 200) { //文件上传成功
            let _formList = this.data.formList;
            let list = _formList[formId].uploadFileList;

            if (fileType == 1) { // 上传的是图片

            } else { //pdf word
              if (type == 0 || type == 1) {
                list[type].finalName = data.data.name;
                list[type].finalPath = data.data.path;
              }
            }
            this.setData({
              uploadPercent: 100
            });

            if (this.data.timer) {
              clearTimeout(this.data.timer)
            }
            let timer = setTimeout(() => {
              this.setData({
                uploadDone: true
              });
            }, 500);
            this.setData({
              timer: timer
            });
            resolve(data);
          } else { // 文件上传失败
            this.hidePop();
            this.showToast('上传失败');
            reject(data);
          }
        },
        fail: error => {
          this.hidePop();
          this.showToast('网络异常');
          reject(error);
        }
      });
    });
  },

  /**
   * @description 当图片上传完成后设置本地微信的预览
   * params {type} 1表示pdf 0是显示word
   */
  setLocalFilePath(filename, path, type, formId) {
    let _formList = this.data.formList;
    let uploadFileList = _formList[formId].uploadFileList;
    if (type == 1) {
      Object.assign(uploadFileList[1], {
        filename: filename,
        fileType: '征稿材料(PDF)',
        type: 'pdf',
        path: path,
        isLocalUploaded: true
      })
    } else {
      Object.assign(uploadFileList[0], {
        filename: filename,
        fileType: '征稿材料(Word)',
        type: 'word',
        path: path,
        isLocalUploaded: true
      })
    }
    this.setData({
      formList: _formList
    });
  },
  /**
   * @description 文件上传按钮
   * pramas {e} 事件，由它获取当前点击事件类型索引，type0,1是上传文档，2是上传图片
   */
  uploadFile(e) {
    const type = e.currentTarget.dataset.optionid;
    let formId = e.currentTarget.dataset.formid;
    switch (parseInt(type)) {
      case 2: // 上传图片
        this.uploadImg(e);
        break;
      default: // 上传pdf或word
        this.uploadPdfOrWord(type, formId);
        break;
    }
  },

  /**
   * @description Word、pdf文件上传
   * pramas {type} 上传文档类型，0是word,1是PDF
   * pramas {formId} 表单索引
   */
  uploadPdfOrWord(type, formId) {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: type == 1 ? ['pdf'] : ['doc', 'docx'],
      success: (res) => {
        const filename = res.tempFiles[0].name;
        console.log(filename)
        const filesize = res.tempFiles[0].size;
        const path = res.tempFiles[0].path;

        if (filesize >= 1024 * 5 * 1024) {
          this.showModal('请上传不超过5M的文件');
          return false;
        }
        this.uploadToServer(2, filename, path, type, formId)
          .then(res => {
            this.setLocalFilePath(filename, path, type, formId);
          });
      },
    });
  },

  // 重新上传文件
  reupload(e) {
    const type = e.currentTarget.dataset.type;
    const formId = e.currentTarget.dataset.formid;
    switch (type) {
      case 'pdf':
        this.delLocalFile(1);
        this.uploadPdfOrWord(1, formId);
        break;
      default:
        this.delLocalFile(0);
        this.uploadPdfOrWord(0, formId);
    }
  },
  delLocalFile(type) {
    let _formList = this.data.formList;
    _formList.map((form, id) => {
      if (!form.orDocumentList) return;
      form.orDocumentList.map((file, fileId) => {
        if (file.fileType == type) {
          form.orDocumentList.splice(fileId, 1);
        }
      });
    });
  },
  /**
   * @description 上传图片
   */
  uploadImg(e) {
    const formId = e.currentTarget.dataset.formid; // 多人报名表单 索引
    let _formList = this.data.formList;
    let uploadFileList = _formList[formId].uploadFileList;
    let tempFiles = uploadFileList[2].tempFiles;
    wx.chooseImage({
      count: 9 - tempFiles.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let isBiggerList = []; // 超过5M的图片索引数组
        let normalFiles = []; // 符合大小的图片数组
        res.tempFiles.map((file, index) => {
          if (file.size < 5 * 1024 * 1024) {
            tempFiles.push(file);
          } else {
            isBiggerList.push(index);
          }
        });
        if (isBiggerList.length > 0) {
          this.showModal('您刚选择的第' + isBiggerList.join('、') + '张图片超过5M限制，请压缩后上传');
        }
        uploadFileList[2].tempFiles = tempFiles.concat(normalFiles); // 新增图片
        if (uploadFileList[2].tempFiles.length > 0) {
          uploadFileList[2].isLocalUploaded = true;
        }
        this.setData({
          formList: _formList
        });
        this.doUploadImg(e);
      }
    });
  },

  /**
   * @description 确认上传图片
   */
  doUploadImg(e) {
    const formId = e.currentTarget.dataset.formid;
    let _formList = this.data.formList;
    let imgList = _formList[formId].uploadFileList[2].tempFiles;
    let _uploadFileList = _formList[formId].uploadFileList;
    imgList.forEach((imgInfo, index) => {
      const fileType = `.${imgInfo.path.split('.').pop()}`;
      if (!imgInfo.size) return false;
      this.uploadToServer(1, `${index}${fileType}`, imgInfo.path, 'image', formId)
        .then(data => { // 成功上传图片后
          let imgList = _formList[formId].uploadFileList[2].tempFiles;
          imgList[index].finalName = data.data.name;
          imgList[index].finalPath = data.data.path;
          this.setData({
            formList: _formList,
          });
          // _uploadFileList[2].hasUploadImg = true;
        });
    });
  },
  // 预览某个图片
  previewImg(e) {
    const index = e.currentTarget.dataset.index;
    const formId = e.currentTarget.dataset.formid;
    const online = e.currentTarget.dataset.online;
    let list = [];
    if (online == 'online') { // 已经上传了
      list = this.data.formList[formId].orDocumentList;
    } else {
      list = this.data.formList[formId].uploadFileList[2].tempFiles;
    }
    let pathList = list.map(item => {
      return item.path
    });
    wx.previewImage({
      current: pathList[index], // 当前显示图片的http链接
      urls: pathList // 需要预览的图片http链接列表
    })
  },

  /**
   * @description 删除图片
   */
  delImg(e) {
    const index = e.currentTarget.dataset.index;
    const formId = e.currentTarget.dataset.formid;
    wx.showModal({
      content: '确认删除？',
      success: (res) => {
        if (res.confirm) {
          let _formList = this.data.formList;
          let list = _formList[formId].uploadFileList;
          let fileId = 0;
          if (_formList[formId].hasOwnProperty('orDocumentList')) {
            _formList[formId].orDocumentList.forEach((file, id) => {
              let path = _formList[formId].uploadFileList[2].tempFiles[index].path;
              if (file.path === path) {
                fileId = id
              }
            });
            _formList[formId].orDocumentList.splice(fileId, 1);
            list[2].tempFiles.splice(index, 1);
            if (list[2].tempFiles.length == 0) {
              list[2].isLocalUploaded = false;
            }
          } else {
            list[2].tempFiles.splice(index, 1);
            if (list[2].tempFiles.length == 0) {
              list[2].isLocalUploaded = false;
            }
          }
          this.setData({
            formList: _formList
          });
        }
      }
    });
  },

  // 保存表单
  keepForm(e) {
    const name = e.currentTarget.dataset.index.replace(/[0-9]/g, ''); // 清除数字
    const formid = e.currentTarget.dataset.formid;
    let formList = this.data.formList;
    formList[formid][name] = e.detail.value;
    this.setData({
      formList: formList
    });
  },

  // 获取选择器性别类型
  getGenderType(e) {
    const formId = e.currentTarget.dataset.formid;
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
    let form = this.checkPageType(type);
    this.setData({
      type: parseInt(type),
      formList: form
    });
    wx.request({
      url: api.activityDetail,
      data: {
        type: type,
        id: id,
      },
      success: res => {
        let detail = res.data.data;
        if (!detail) return;
        detail.detailImg = detail.detailImg.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
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
   * @description 判断用户是否报名征稿活动
   */
  getConStatus() {
    const params = {
      openId: app.globalData.openId,
      activityId: this.data.activityId
    }
    return new Promise((resolve, reject) => {
      http
        ._get(api.userContribute, params)
        .then(res => {
          const data = res.data.data;
          if (data) { // 已报名
            let _formList = this.data.formList;
            _formList = [];
            _formList.push(data);
            _formList = this.tranlateGenderType(_formList);
            this.setData({
              hasSignUp: false,
              formList: _formList
            });
          }
          resolve(data);
        });
    });
  },
  /** 
   * @description 点赞或取消点赞
   */
  doLike() {
    const params = {
      openId: app.globalData.openId,
      activityId: parseInt(this.data.activityId),
      type: this.data.likeStatus == './assets/like-active.png' ? 2 : 1
    }
    http
      ._post(api.like, params)
      .then(res => {
        if (res.data.code == 200) {
          if (res.data.data == 2) { // 取消点赞成功
            this.setData({
              likeStatus: './assets/like.png'
            });
          } else if (res.data.data == 1) {
            this.setData({
              likeStatus: './assets/like-active.png'
            });
          }
          this.getActDetail(this.data.activityId, this.data.type);
        };
      });
  },
  /** 
   * @description 当前点赞状态
   */
  getLikeStatus() {
    return new Promise((resolve, reject) => {
      const params = {
        openId: app.globalData.openId,
        activityId: parseInt(this.data.activityId),
      }
      http
        ._get(api.like, params)
        .then(res => {
          resolve(res);
        });
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

    if (options.type == 1) {
      this.getSignUpList();
    } else {
      this.getConStatus().then(res => {
        let params = {
          activityId: this.data.activityId,
          pageSize: 10,
          pageNum: 1
        }
        http
          ._get(api.userContributeList, params)
          .then(res => {
            if (res.data.code !== 200) return false;
            return res.data.data.pages
          })
          .then((pages) => {
            params.pageNum = pages;
            http._get(api.userContributeList, params).then(res => {
              let data = res.data.data.list;
              data.forEach(item => {
                const temp = item.contributeTime.substring(0, 10).split('-');
                if (item.nickName && item.nickName.length > 6) {
                  item.nickName = item.nickName.substring(0, 6) + '...'
                }
                item.time = temp[0] + '年' + temp[1] + '月' + temp[2] + '号';
              });
              this.setData({
                recList: data
              });
            })
          })
      });
      this.getLikeStatus().then(res => {
        this.setData({
          likeStatus: res.data.data == 2 ? './assets/like.png' : './assets/like-active.png'
        });
      })
    }
  },
});