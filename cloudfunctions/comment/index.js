const cloud = require('wx-server-sdk')
cloud.init({
  env: 'liwei-uh1ym',
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('comment').where({
      article:event.article
    })
    .update({
      data: {
        comments: _.push(event.comment)
      },
    })
  } catch(e) {
    console.error(e)
  }
}