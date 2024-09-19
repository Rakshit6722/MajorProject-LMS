const User = require('../model/User')
const OTP = require('../model/OTP')
const Profile = require('../model/Profile')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const { json } = require('express')
require('config').config();
const mailSender = require('../utils/mailSender')
const {passwordUpdate} = require('../templates/passwordUpdate')



//sendOtp
exports.sendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        const checkUser = await User.findOne({ email })

        if (checkUser) {
            return res.status(401).json({ success: false, message: "User already exists" })
        }

        //otp generation
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        //check if otp is unique
        let result = await OTP.findOne({ otp })

        //bekar code 
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ otp })
        }

        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody)

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        })


    } catch (err) {
        console.log("Failure in sending OTP ", err)
        res.status(500).json({
            success: false,
            message: err.message
        })

    }


}

//signup
exports.signUp = async (req, res) => {

    try {
        const { firstname, lastname, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

        if (!firstname || !lastname || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword do not match"
            })
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(401).json({
                success: false,
                message: "user already exists"
            })
        }

        //find most recent otp
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOTP)

        //validate OTP
        if (recentOTP.length == 0) {
            return res.statu(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if (otp !== recentOTP.otp) {
            return res.statu(400).json({
                success: false,
                message: "OTP not matched"
            })
        }

        //hash password
        const hashpassword = await bcrypt.hash(password, 10)


        //additional details
        const additionalDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        //entry db
        const user = await User.create({
            firstname,
            lastname,
            email,
            contactNumber,
            password: hashpassword,
            accountType,
            additionalDetails: additionalDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`

        })

        res.status(200).json({
            success: true,
            message: 'user is registered successfully'
        })
    } catch (err) {
        console.log('Error in signing up ', err.message),
            res.status(500).json({
                success: false,
                message: "User cannot be registered, please try again..."
            })
            
    }


}


//login
exports.login = async (req, res) => {
    try {

        //fetch data
        const { email, password } = req.body

        //validate data
        if (!email || !password) {
            return res.status(401).json({
                message: "Enter all fields correctly"
            })
        }

        //find if user exists or not
        const user = await User.findOne({ email })
        if (!findUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        //if exists
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2hr"
            })

            user = user.toObject();
            user.token = token;
            user.password = undefined

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }


            res.cookie("cookie", token, options).status(200).json({
                success: true,
                user,
                token,
                message: "LogIn successful",

            })
        } else {

            return res.status(403).json({
                success: false,
                message: "Password do not match, please try again"
            })

        }
    } catch (err) {
        console.log("login failed: ", err),
            res.status(500).json({
                success: false,
                message: "LogIn failed, please try again"
            })
    }
}

//changePassword
exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id)

        const { oldPassword, newPassword } = req.body

        const passwordMatch = await bcrypt.compare(oldPassword, userDetails.password)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10)
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { password: hashpassword }, { new: true })

        try {
            const emailResponse = await mailSender(
                updatedUser.email,
                'Password Updated successfully',
                passwordUpdate(updatedUser.email, updatedUser.firstName)
            )
            console.log("email sent successfully ",emailResponse)
        } catch (err) {
            console.log("Error occured while sending password update mail ", err)
            return res.status(500).json({
                success: false,
                message: "Error occured while sending password update mail"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (err) {
        console.log("password updation failed ", err);
        res.status(500).json({
            success: false,
            message: "Password updation failed"
        })
    }
}
