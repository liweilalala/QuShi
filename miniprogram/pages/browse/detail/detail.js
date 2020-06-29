// miniprogram/pages/browse/detail/detail.js
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: [],
    detail_data: {},
    boolcomments:false,
    comments:[],
    p_s: [],
    boolp_s: false,
    boolpraise: false,
    boolstar: false,
    praisep: "../../../images/praise.png",
    starp: "../../../images/star.png",
    a:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail_data: app.globalData.detail
    })
    db.collection('comment')
    .where({
      article:this.data.detail_data._id, // 填入当前用户 openid
    })
    .limit(100) // 限制返回数量为 10 条
    .get()
    .then(res => {
      console.log(res.data[0].comments)
      this.setData({
        comments:res.data[0].comments,
        boolcomments:true
      })
    })
    .catch(err => {
      console.error(err)
    })
    db.collection('p_s').where({
        article: this.data.detail_data._id,
        user:app.globalData.userInfo.nickName
      })
      .get()
      .then(res => {
        if (res.data[0]) {
          this.setData({
            boolpraise: res.data[0].praise,
            boolstar: res.data[0].star,
            boolp_s: true,
            p_s: res.data
          })
          if (this.data.boolpraise) {
            //console.log("赞变色")
            this.setData({
              praisep: "../../../images/selectedpraise.png",
            })
          }
          if (this.data.boolstar) {
            this.setData({
              starp: "../../../images/selectedstar.png",
            })
          }
        }
      })
      .catch(err => {})
  },
  praise: function () {
    const db = wx.cloud.database();
    if (!this.data.boolp_s) {  //如果该用户没有点赞或收藏的记录，添加一个新记录
      wx.cloud.callFunction({   //未点赞，调用云函数使点赞数+1
        // 要调用的云函数名称
        name: 'praise',
        // 传递给云函数的event参数
        data: {
          _id: this.data.detail_data._id,
          boolpraise: false
        }
      })
      db.collection('p_s').add({
        data: {
          article: this.data.detail_data._id,
          user: app.globalData.userInfo.nickName,
          praise: true,
          star: false
        }
      })
      .then(res => {
        //console.log(res)
        this.onLoad();
        this.data.detail_data.praise+=1;
        this.setData({
          detail_data:this.data.detail_data
        })
      })
      .catch(console.error)
    } else { //如果有记录，先判断是否点赞
      //console.log(this.data.p_s);
      if (this.data.boolpraise) {   //已经点赞，取消点赞
        wx.cloud.callFunction({     //使点赞数-1
          // 要调用的云函数名称
          name: 'praise',
          // 传递给云函数的event参数
          data: {
            _id: this.data.detail_data._id,
            boolpraise: true,
          }
        })
        //console.log("取消点赞");
        //console.log(this.data.p_s[0]._id);
        db.collection('p_s').doc(this.data.p_s[0]._id).update({
          // data 传入需要局部更新的数据
          data: {
            praise:false
          },
          success: function(res) {
            //console.log(res)
          }
        })
        this.data.detail_data.praise -= 1;
        this.setData({
          detail_data: this.data.detail_data,
          praisep: "../../../images/praise.png",
          boolpraise: false
        })
      } else {  //已经取消点赞。重新点赞
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'praise',
          // 传递给云函数的event参数
          data: {
            _id: this.data.detail_data._id,
            boolpraise: false
          }
        })
        db.collection('p_s').doc(this.data.p_s[0]._id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            praise:true
          },
          success: function(res) {
            //console.log(res)
          }
        })
        this.data.detail_data.praise += 1;
        this.setData({
          praisep: "../../../images/selectedpraise.png",
          detail_data: this.data.detail_data,
          boolpraise: true
        })
      }
    }
  },
  star: function () {
    const db = wx.cloud.database();
    if (!this.data.boolp_s) {   //无记录，新建记录
      wx.cloud.callFunction({     //收藏数+1
        // 要调用的云函数名称
        name: 'star',
        // 传递给云函数的event参数
        data: {
          _id: this.data.detail_data._id,
          boolstar: false
        }
      })
      db.collection('p_s').add({
        data: {
          article: this.data.detail_data._id,
          user: app.globalData.userInfo.nickName,
          praise: false,
          star: true
        }
      })
      .then(res => {
        //console.log(res)
        this.onLoad();
        this.data.detail_data.star+=1;
        this.setData({
          detail_data:this.data.detail_data
        })
      })
      .catch(console.error)
    } else {   //有记录，更新记录
      //console.log(this.data.p_s);
      if (this.data.boolstar) {   //已经收藏
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'star',
          // 传递给云函数的event参数
          data: {
            _id: this.data.detail_data._id,
            boolstar: true,
          }
        })
        //console.log("取消收藏");
        db.collection('p_s').doc(this.data.p_s[0]._id).update({
          // data 传入需要局部更新的数据
          data: {
            star:false
          },
          success: function(res) {
            //console.log(res)
          }
        })
        this.data.detail_data.star -= 1;
        this.setData({
          detail_data: this.data.detail_data,
          starp: "../../../images/star.png",
          boolstar: false
        })
      } else {  //已经取消收藏，重新收藏
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'star',
          // 传递给云函数的event参数
          data: {
            _id: this.data.detail_data._id,
            boolstar: false
          }
        })
        db.collection('p_s').doc(this.data.p_s[0]._id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            star:true
          },
          success: function(res) {
            //console.log(res)
          }
        })
        this.data.detail_data.star += 1;
        this.setData({
          starp: "../../../images/selectedstar.png",
          detail_data: this.data.detail_data,
          boolstar: true
        })
      }
    }return
  },
  Bindsubmit:function(e){
    if(!app.globalData.userInfo.nickName){
      wx.showToast({
        title: '请先登陆',
      })
      return
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'comment',
      // 传递给云函数的event参数
      data: {
        article: this.data.detail_data._id,
        comment: {
          avatar:app.globalData.userInfo.avatarUrl,
          name:app.globalData.userInfo.nickName,
          comment:e.detail.value.c
        }
      },
      success: function(res) {
      },
      fail: console.error
    })
    this.setData({
      a:""
    })
  },
  onReachBottom: function () {
    db.collection('comment')
    .where({
      article:this.data.detail_data._id, // 填入当前用户 openid
    })
    .limit(100) // 限制返回数量为 10 条
    .get()
    .then(res => {
      console.log(res.data[0].comments)
      this.setData({
        comments:res.data[0].comments,
        boolcomments:true
      })
    })
    .catch(err => {
      console.error(err)
    })
  },
  onPullDownRefresh: function () {
    this.onReachBottom();
    wx.stopPullDownRefresh()
  },
})