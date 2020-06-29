// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'liwei-uh1ym',
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    if(event.boolpraise){
      return await db.collection('qushi').where({
        _id: event._id
      })
      .update({
        data: {
          praise: _.inc(-1)
        },
      })
    }
    else{
      return await db.collection('qushi').where({
        _id: event._id
      })
      .update({
        data: {
          praise: _.inc(1)
        },
      })
    }
  } catch(e) {
    console.error(e)
  }
}