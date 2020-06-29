// miniprogram/pages/user/mystar/mystar.js
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleid: [],
    stararticle: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('p_s').where({
        star: true,
        user: app.globalData.userInfo.nickName
      })
      .get()
      .then(res => {
        var length = res.data.length;
        //console.log(length)
        for (let key in res.data) {
          console.log("收藏文章",key);
          console.log("文章数据",res.data[key])
          db.collection('qushi').doc(res.data[key].article).get()
            .then(res => {
              // res.data 包含该记录的数据
              console.log(res.data);
              this.data.stararticle.push(res.data);
              //console.log(this.data.stararticle.length);
              //console.log(key);
              if(this.data.stararticle.length == length){
                console.log(this.data.stararticle);
                this.setData({
                  stararticle: this.data.stararticle
                })
              }
            })
            .catch(err => {})
        }
      })
      .catch(err => {})
    //console.log(this.data.stararticle.length);
  },
  godetail:function(event){
    //console.log(event.currentTarget.dataset.id);
    app.globalData.detail=this.data.stararticle[event.currentTarget.dataset.index]
    //console.log(this.data.article[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../../browse/detail/detail'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})