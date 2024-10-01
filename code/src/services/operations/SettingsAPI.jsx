import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../api"
import { setUser } from "../../slice/profileSlice"
import { Navigate } from "react-router-dom"
import { logout } from "./authAPI"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            )
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE...", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Display Picture Updated Successfully")
            dispatch(setUser(response.data.data))
        } catch (err) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export const deleteProfile = (token, navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`,
            })
            console.log("DELETE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Profile Delete Successfully")
            dispatch(logout(navigate))

        } catch (err) {
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}

export const updateProfile = (token, formAData) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, null, {
                Authorization: `Bearer ${token}`
            })
            console.log("UPDATE PROFILE API API RESPONSE...", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const userImage = response.data.updatdedUserDetails.image ?
                response.data.updatdedUserDetails.image :
                `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`

            dispatch(setUser({ ...response.data.updatdedUserDetails, image: userImage }))
            toast.success("Profile Updated Successfully")
        } catch (err) {
            console.log("UPDATE PROFILE API API ERROR...", err)
            toast.error("Could not update Profile")
        }
        toast.dismiss(toastId)
    }
}

export const changePassword = async(token, formData) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
                Authorization: `Bearer ${token}`
            })
            toast.success("Password changed successfully")
        } catch (err) {
            console.log("CHANGE_PASSWORD_API API ERROR............", error)
            toast.error(error.response.data.message)
        }
        toast.dismiss(toastId)
    }
}