const mongoose = require('mongoose')

const CourseProgress = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    compeletedVideos:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
        }
    ]
})

module.exports = mogoose.model('ProfileSchema',CourseProgress)