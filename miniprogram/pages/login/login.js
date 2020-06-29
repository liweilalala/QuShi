// miniprogram/pages/login/login.js
const app = getApp()
Page({
  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onLoad: function (options) {
    
  },
  onGetUserInfo: function(e) {  //获取用户信息
    if (!this.data.logged && e.detail.userInfo){
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      //console.log(e.detail.userInfo);
    }
    if(this.data.logged){
      app.globalData.userInfo=e.detail.userInfo;
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
  }
})