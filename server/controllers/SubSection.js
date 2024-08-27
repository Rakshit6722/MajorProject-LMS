const Section = require('../model/Section')
const SubSection = require('../model/SubSection')
const {uploadImageToCloudinary} = require('../utils/fileUpload')
require('dotenv').config()

exports.createSubSection = async (req,res) => {
    try{
        const{sectionId,title,timeDuration,description} = req.body
        const video = req.files.video

        if(!title || !timeDuration || !description || !video){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        // const findSection = await Section.findById(sectionId)
        // if(!findSection){
        //     return res.status(401).json({
        //         success:false,
        //         message:"Section do not exist"
        //     })
        // }

        const uploadedVideo = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        const subSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl:uploadedVideo.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$push:{subSection:subSection._id}},{new:true})

        res.status(200).json({
            success:true,
            message:"Sub Section created successfully"
        })


    }catch(err){
        console.log("Error in sub section creation ",err);
        res.status(500).json({
            success:false,
            message:"Error in sub section creation"
        })
    }
}

exports.updateSubSection = async (req,res) => {
    
}