var app = getApp()
Page({
  data: {
    article: [],
  },
  refresh: function () {
    //console.log("hahaha");
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getarticles',
      // 传给云函数的参数
      data: {
      },
      success: function(res) {
        //console.log(res.result.data) 
        that.setData({
          article:res.result.data
        })
        app.globalData.article=res.result.data
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },
  onPullDownRefresh: function () {
    this.refresh(); 
  },
  onShow: function () {
    this.refresh(); 
    //console.log("onshow");
    //console.log("显示浏览页");
  },
  godetail:function(event){
    //console.log(event.currentTarget.dataset.id);
    app.globalData.detail=this.data.article[event.currentTarget.dataset.index]
    //console.log(this.data.article[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: 'detail/detail'
    })

  },
  onReachBottom: function () {
    this.onLoad(); 
    //console.log("到底了")
  }
})
