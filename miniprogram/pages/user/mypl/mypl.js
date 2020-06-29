// miniprogram/pages/user/mypl/mypl.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myarticle:[],
    article:[],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.article=app.globalData.article;
    this.data.userInfo=app.globalData.userInfo;
    for (var key in this.data.article) {
      　var data=this.data.article[key];
        if(data.authorname==this.data.userInfo.nickName){
          this.data.myarticle.push(data);
        }
    }
    this.setData({
      myarticle:this.data.myarticle
    })
  },
  godetail:function(event){
    //console.log(event.currentTarget.dataset.id);
    app.globalData.detail=this.data.myarticle[event.currentTarget.dataset.index]
    //console.log(this.data.article[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../../browse/detail/detail'
    })
  }
})