// const domain = 'https://wzhbg.gzmidai.com';
const domain = 'http://www.ivevu.cn:8080';

export const api = {
  domain: domain,
  login: `${domain}/api/we/login`, // 登陆接口
  slideshow: `${domain}/api/home/slideshow`, // 首页轮播图
  hot: `${domain}/api/home/hot`, // 热门活动列表

  list: `${domain}/api/activity/list`, // 线下活动列表
  activityDetail: `${domain}/api/activity`, // 线下活动详情
  
  signUp: `${domain}/api/participant`, //报名接口
  signUpList: `${domain}/api/participant/list`, //报名接口
  enrolment: `${domain}/api/activity/list/enrolment`,

  upload: `${domain}/api/we/upload`, // 文件上传接口
  userContribute: `${domain}/api/userContribute`, // 提交征稿 
  userContributeList: `${domain}/api/userContribute/list`, // 提交征稿 
  like: `${domain}/api/activity/like`, // 点赞 取消点赞接口

  vote: `${domain}/api/activity/vote`
}