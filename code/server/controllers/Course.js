const Course = require('../model/Course')
const User = require('../model/User')
const Category = require('../model/Category')
const {uploadImageToCloudinary} = require('../utils/fileUpload')
require('dotenv').config()
//create course
exports.createCourse = async (req,res) => {
    try{
        //fetch data
        const{courseName,courseDescription,whatYouWillLearn,price,category} = req.body

        //thumbnail
        const thumbnail = req.files.thumbnailImage

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category){
            return res.status(401).json({
                succes:false,
                message:"All fields are required"
            }) 
        }
        //check for instructor
        const id = req.user.id
        const instructor = await User.findById(id)
        console.log(instructor)

        if(!instructor){
            return res.status(401).json({
                success:false,
                message:"Instructor not found"
            })
        }

        //tag validation
        const categoryId = category
        const findCategory = await Category.findById(categoryId)
        if(!findCategory){
            return res.status(401).json({
                success:false,
                message:"Category not found"
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)


        //create entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            category,
            instructor:instructor._id,
            thumbnail:thumbnailImage.secure_url
        })

        //add new course to user schema of Instructor profile
        await User.findByIdAndUpdate({_id:instructor._id},{$push:{courses:newCourse._id}},{new:true})

        //update tag schema
        await Category.findByIdAndUpdate({_id:category},{$push:{course:newCourse._id}},{new:true})

        return res.status(200).json({
            success:true,
            message:"Course added successfully",
            data:newCourse
        })

    }catch(err){
        console.log("Error while creating course ",err)
        res.status(500).json({
            success:false,
            message:"Error while creating course, please try again"
        })
    }
}



//get course
exports.showAllCourses = async (req,res) => {
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            courseDescription:true,
            price:true,
            instructor:true,
            ratingAndReview:true,
            studentEnrolled:true
           
        }).populate("instructor").exec();
        console.log(allCourses)
        
        res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses
        })

    }catch(err){
        console.log("Error in fetching courses ",err)
        res.status(500).json({
            success:false,
            message:"Error in fetching courses"
        })
    }
}
