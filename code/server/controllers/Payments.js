const { instance } = require('../config/razorpay')
const Course = require('../model/Course')
const User = require('../model/User')
const mailSender = require('../utils/mailSender')
const { courseEnrollmentEmail } = require('../templates/courseEnrollmentEmail')
const mongoose = require('mongoose')
const crypto = require('crypto')

//computer the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id

        if (!courseId) {
            return res.status(401).json({
                success: false,
                message: "please provide valid coures ID"
            })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(401).json({
                success: false,
                message: "Course with the following course ID does not exist"
            })
        }

        const uid = mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(401).json({
                success: false,
                message: "Student is already enrolled in this course"
            })
        }


        //order create
        const amount = course.price
        const currency = "INR"

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course._id, userId
            }
        }

        try {
            //intiate the payment sing razorpay
            const paymentResponse = await instance.orders.create(options)
            console.log(paymentResponse)

            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            })

        } catch (err) {
            console.log("Error while creating razorpay order ", err)
            return res.status(500).json({
                success: false,
                message: "Error while creating razorpay order",

            })
        }

    } catch (err) {
        console.log('Error in capturing payment ', err)
        return res.status(500).json({
            success: false,
            message: "Error in capturing payment"
        })
    }

}


//verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
    try {
        const webhooksecret = ""

        const signature = req.headers("x-razorpay-signature")

        const shasum = crypto.createHmac("sha256", webhooksecret)//create an Hmac object of webhook secret string
        shasum.update(JSON.stringify(req.body))//updates or add hmac with string version of data present in req.body
        const digest = shasum.digest("hex")//finalize the hmac computation and encoding it hexadecimal format

        if (signature === digest) {
            console.log('Payment authorized')

            const { courseId, userId } = req.body.payload.payment.entity.notes;

            try {
                //student enrollment
                const enrolledCourse = await Course.findOneAndUpdate({ _id: courseId }, { $push: { studentsEnrolled: userId } }, { new: true })
                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        message: "Course not found"
                    })
                }

                console.log(enrolledCourse)


                //course added in student db entry
                const enrolledStudent = await User.findOneAndUpdate({ _id: userId }, { $push: { courses: courseId } }, { new: true })

                //confirmation email send
                const emailResponse = await mailSender(enrolledStudent.email, "Course Enrollment Successfull", courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName))
                console.log(emailResponse)

                return res.status(200).json({
                    success: true,
                    message: "Signature Verified and Course and Student Enrolled"
                })


            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                })
            }

        }

        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Request"
            })
        }


    } catch (err) {
        conole.log(err.message)
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}