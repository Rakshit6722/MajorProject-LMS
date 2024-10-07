import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../api";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API } = profileEndpoints

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        console.log("Before calling backend API for enrolled courses")
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        )
        console.log("After calling backed API for enrolled courses")
        console.log("Response enrolled course",response.data.data)
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        result = response.data.data
        return result
    } catch (err) {
        console.log("Get user enrolled courses api error...", err)
        toast.error("Courld not get enrolled courses")
    }
    toast.dismiss(toastId)

}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
      {
        Authorization: `Bearer ${token}`,
      })
  
      console.log("GET_INSTRUCTOR_API_RESPONSE", response);
      result = response?.data?.courses
  
    }
    catch(error) {
      console.log("GET_INSTRUCTOR_API ERROR", error);
      toast.error("Could not Get Instructor Data")
    }
    toast.dismiss(toastId);
    return result;
  }