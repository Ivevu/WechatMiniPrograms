class Http {
  /**
   * @description  异常处理
   * @error 请求参数
   */
  _handleError(error) {
    wx.showLoading({
      title: '网络异常',
    });
    setTimeout(()=>{
      wx.hideLoading();
    },1000);
  }
  /**
   * @description 封装get请求
   * @params 请求参数
   */
  _get(url, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: 'GET',
        data: {
          params
        },
        success: (result) => {
          if (result.statusCode == 200) {
            resolve(result);
          } else {
            this._handleError(error);
            reject(error);
          }
        },
        fail: (error) => {
          this._handleError(error);
          reject(error);
        },
      });
    });
  }
  /**
   * @description 封装get请求
   * @params 请求参数
   */
  _post(url, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: 'POST',
        data: {
          params
        },
        success: (result) => {
          if (result.statusCode == 200) {
            resolve(result);
          } else {
            this._handleError(error);
            reject(error);
          }
        },
        fail: (error) => {
          this._handleError(error);
          reject(error);
        },
      });
    });
  }
}

export default Http;