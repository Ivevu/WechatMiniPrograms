class Http {
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
            reject(error);
          }
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  }
  /**
   * @description 封装get请求
   * @params 请求参数
   */

}

export default Http;