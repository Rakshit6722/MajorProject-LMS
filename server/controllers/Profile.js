const Profile = require('../model/Profile')
const User = require('../model/User')

//update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body
        const id = req.user.id

        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All field are required'
            })
        }

        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully"
        })

    } catch (err) {
        console.log("Error in profile updation ",err)
        return res.status(500).json({
            success:false,
            message:"Profile updation failed"
        })
    }   
}

//delete handler
exports.deleteAccount = async (req,res) => {
    try{
        const id = req.user.id

        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"User does not exists"
            })
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //TODO: unenroll user from all enrolled courses
        await User.findByIdAndDelete({_id:id})

        return res.json(200).json({
            success:true,
            message:"User deleted Successfully"
        })


    }catch(err){
        console.log("User deletion unsuccessfull ",err)
        return res.json(500).json({
            success:true,
            message:"User deletion unsuccessfull"
        })
    }
}

exports.getAllInfo = async (req,res) => {
    try{
        const id = req.user.id
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
        // const additionalInfo = await Profile.findById({_id:userDetails.additionalDetails})

        return res.status(200).json({
            success:true,
            message:"all info fetched successfully",
            data:userDetails
        })
    }catch(err){
        console.log("User info fetched unsuccessfull ",err)
        return res.json(500).json({
            success:true,
            message:"User info fetched unsuccessfull"
        })
    }
}