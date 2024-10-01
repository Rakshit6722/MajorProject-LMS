import toast from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import {setpaymentLoading} from '../../slice/courseSlice'
import { resetCart } from "../../slice/cartSlice";
 
const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script);
    })

}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...")
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load")
            return;
        }

        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            {courses},
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        console.log("Printing orderResponse",orderResponse)

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill:{
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response) {
                sendPaymentSuccessfulEmail(response,orderResponse.data.message.amount,token)
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed")
            console.log(response.error)
        })

    } catch (err) {
        console.log("Payment API error...",err);
        toast.error("Could not make Payment.")
    }
}


async function sendPaymentSuccessfulEmail(response, amount, token){
    try{
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`
            }
        )
    }catch(err){
        console.log("Payment success email error...",err)
    }
}


async function verifyPayment(bodyData, token, navigate, dispatch){
    const toastId = toast.loading("Loading...")
    dispatch(setpaymentLoading(true))
    try{
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Payment Successful, you are added to the course")
        navigate("/dashboard/enrolled-course")
        dispatch(resetCart())

    }catch(err){
        console.log("Payment verify error...",err)
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId)
    dispatch(setpaymentLoading(false))
}