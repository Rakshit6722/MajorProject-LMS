import { setToken, setLoading } from "../../slice/authSlice"
import { setUser } from "../../slice/profileSlice"
import { resetCart } from "../../slice/cartSlice"
import toast from "react-hot-toast"
import { endpoints } from "../api"
import { apiConnector } from "../apiconnector"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            console.log("inside sendotp")
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            })
            console.log("SENOTP API RESPONSE.....", response)
            console.log(response.data.success)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP sent successfully")
            navigate("/verify-email")

        } catch (err) {
            console.log("exited")
            console.log("SENDOTP API ERROR...", err)
            toast.error(err.message)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            })
            console.log("LOGIN API RESPONSE...", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Login Successful")
            dispatch(setToken(response.data.token))
            const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            
            dispatch(setUser({...response.data.user,image:userImage}))

            localStorage.setItem("token",JSON.stringify(response.data.token))
            localStorage.setItem("user",JSON.stringify(response.data.user))
            navigate("/dashboard/my-profile")
        }catch(err){
            console.log("LOGIN API ERROR...",err)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId   )
    }
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}

export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",RESETPASSTOKEN_API,{email})
            console.log("RESET PASSWORD TOKEN RESPONSE...",response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Reset Email Sent")
            setEmailSent(true)
        }catch(err){
            console.log("RESET PASSWORD TOKEN ERROR",err)
            toast.error("Failed to send email for resetting password")
        }

        dispatch(setLoading(false))
    }
}

export const resetPassword = (password,confirmPassword,token) => {
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token})

            console.log("RESET PASSWORD RESPONSE...",response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Password has been reset successfully")
        }catch(err){
            console.log("RESET PASSWORD TOKEN ERROR...",err)
            toast.error("Unable to reset password")
        }
        dispatch(setLoading(false))
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            console.log("inside signup api")
            const response = await apiConnector("POSt",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            console.log("SIGNUP API RESPONSE...",response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        }catch(err){
            console.log("exited signup api")
            console.log("SIGNUP API FAILED...",err)
            toast.error("Signup Failed")
            navigate("/signup")
        }

        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}