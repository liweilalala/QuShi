// miniprogram/pages/user/user.js
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    userInfo: {},
    logined:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.globalData.logined);
    this.setData({
      logined:app.globalData.logined
    })
    if(this.data.logined){
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  onShow:function(){
    this.onLoad();
  },
  mypl:function(){
    if(this.data.logined){
      wx.navigateTo({
        url: 'mypl/mypl'
      })
    }else{
      wx.showToast({
        title: '请先登陆',
        icon: 'none',
        duration: 1000
      })
    }
  },
  mystar:function(){
    if(this.data.logined){
      wx.navigateTo({
        url: 'mystar/mystar',
      })
    }else{
      wx.showToast({
        title: '请先登陆',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onGetUserInfo:function(e){
    if (!this.data.logined && e.detail.userInfo){
      this.setData({
        logined: true,
        userInfo: e.detail.userInfo
      })
      //console.log(e.detail.userInfo);
    }
    if(this.data.logined){
      app.globalData.userInfo=e.detail.userInfo;
      app.globalData.logined = true;
      wx.showToast({
        title: '成功',
        icon: 'none',
        duration: 1000,
        mask:true,
        success:function(){
          setTimeout(
            function(){
              wx.switchTab({
                url: '../browse/browse',
              })
            }
            ,1000)  //延迟1s
        }
      })
    }
    var time = util.formatTime(new Date());
    wx.request({
      url: 'http://121.36.64.222',
      data: {
        time: time,
        name: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    })
  }
})