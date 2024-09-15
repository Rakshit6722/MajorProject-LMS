const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"]
    },
    dateOfBirth:{
        type:String
    },
    about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true
    }
})

module.exports = mogoose.model('Profile',ProfileSchema)