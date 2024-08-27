const User = require('../model/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        //generate token
        const token = crypto.randomUUID()

        //update user by adding token and expiration time
        const updatedDetails = User.findOneAndUpdate({ email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true }
        )
        //create url
        const url = `http://localhost:3000/update-password/${token}`

        //send mail containing the url
        const response = await mailSender(email, "Password Reset Link", url)

        //return response
        return res.status(200).json({
            success: true,
            message: "Link Sent successfully"
        })
    } catch (err) {
        console.log("error in resetting password ", err)
        res.status(500).json({
            success: false,
            message: "Error while sending mail for resetting password"
        })
    }

}

//resetPassword 
exports.resetPassword = async (req, res) => {
    try {
        const { token, newpassword, confirmpassword } = req

        if (newpassword !== confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "Password does not match"
            })
        }
        const findUser = await User.findOne({ token })
        if (!findUser) {
            return res.status(401).json({
                success: false,
                message: "User not found, please try again"
            })
        }

        if (findUser.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "token expired"
            })
        }

        // if (newpassword === findUser.password) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Please choose a different password"
        //     })
        // }

        const updatedPassword = await bcrypt.hash(newpassword, 10)

        const updatedUser = await User.findByIdAndUpdate(findUser._id, { password: updatedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (err) {
        console.log("password reset error: ", err)
        res.status(500).json({
            success: false,
            message: "Password reset unsuccessful"
        })
    }

}