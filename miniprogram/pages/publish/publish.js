// miniprogram/pages/publish/publish.js
var util = require('../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tempFilePaths:"",
    imagename:"",
    articleinfo:{
      title:"",
      summary:"",
      content:"",
      image:"",
      time:"",
      authorname:"",
      authoravatarUrl:"",
      praise:0,
      star:0
    },
    a:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    this.data.articleinfo.time=time;
  },
  Bindsubmit:function(e){
    if(app.globalData.logined){
      if(!this.data.tempFilePaths[0]){
        wx.showToast({
          title: '请先选择图片',
        })
        return
      }
      this.submit(e);
    }else{
      wx.showToast({
        title: '请先登陆',
        icon: 'none',
        duration: 1000
      })
    }
  },
  submit:function(e){
    var time=util.time(new Date());
    //console.log(time);
    const filePath = this.data.tempFilePaths[0];
    const cloudPath = "images/"+this.data.userInfo.nickName+ time + filePath.match(/\.[^.]+?$/)[0];
    this.data.articleinfo.title=e.detail.value.title;
    this.data.articleinfo.summary=e.detail.value.summary;
    this.data.articleinfo.content=e.detail.value.content;
    if(!this.data.articleinfo.title){
      wx.showToast({
        title: '请先输入标题',
      })
      return
    }
    if(!this.data.articleinfo.summary){
      wx.showToast({
        title: '请先输入概要',
      })
      return
    }
    if(!this.data.articleinfo.content){
      wx.showToast({
        title: '请先输入内容',
      })
      return
    }
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        this.data.articleinfo.image=res.fileID;
      },
      fail: e => {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        //console.log(this.data.articleinfo);
        const db = wx.cloud.database()
        //向数据库添加一条记录
        db.collection('qushi').add({
          data: {
            title:this.data.articleinfo.title,
            summary:this.data.articleinfo.summary,
            content:this.data.articleinfo.content,
            image:this.data.articleinfo.image,
            time:this.data.articleinfo.time,
            authorname:app.globalData.userInfo.nickName,
            authoravatarUrl:app.globalData.userInfo.avatarUrl,
            praise:this.data.articleinfo.praise,
            star:this.data.articleinfo.star,
          },
          success: function(res) {
            console.log(res._id)
            db.collection('comment').add({
              data:{
                article:res._id,
                comments:[]
              }
            })
          }
        })
        this.setData({
          a:"",
          tempFilePaths: ""
        })
      }
    })
    wx.navigateTo({
      url: '../published/published'
    })
  },
  image:function(){
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
        })
        var imagename=that.data.tempFilePaths[0];
        that.setData({
          imagename:imagename.split('/')[3],
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  }
})