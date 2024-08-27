const Section = require('../model/Section')
const Course = require('../model/Course')

exports.createSection = async (req,res) =>{
    try{
        const {sectionName,courseId} = req.body
        if(!sectionName || !courseId){
            return res.status(401).json({
                success:false,
                message:"Enter all details"
            })
        }

        const savedSection = await Section.create({sectionName})

        const updatedCourse = await Course.findByIdAndUpdate(courseId,{$push:{whatYouWillLearn:savedSection._id}},{new:true}).populate("whatYouWillLearn").exec()

        return res.status(200).json({
            success:true,
            message:"Section creation successfull"
        })
        
    }catch(err){
        console.log("Error in section creation ",err)
        return res.status(500).json({
            success:false,
            message:"Section creation failed"
        })
    }
}

exports.updateSection = async (req,res) => {
    try{

        const{updateName,sectionId} = req.body

        if(!updateName || !sectionId){
            return res.status(401).json({
                success:false,
                message:"all fields are required"
            })
        }

        const section = Section.findByIdAndUpdate(sectionId,{sectionName:updateName},{new:true})

        res.status(200).json({
            success:true,
            message:"Section updated successfully"
        })



    }catch(err){
        console.log("Error in section updation ",err)
        return res.status(500).json({
            success:false,
            message:"Section updation failed"
        })
    }
}

exports.deleteSection = async (req,res) => {
    try{

        const{sectionId,courseId} = req.body

        if(!sectionId || !courseId){
            return res.status(401).json({
                success:false,
                message:"all fields are required"
            })
        }

        // const findCourse = await Course.findByIdAndUpdate(courseId,{$pull:{whatYouWillLearn:sectionId}},{new:true})

        const section = Section.findByIdAndDelete(sectionId)

        res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })



    }catch(err){
        console.log("Error in section deletion ",err)
        return res.status(500).json({
            success:false,
            message:"Section deletion failed"
        })
    }
}
