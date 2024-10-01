import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
} = courseEndpoints

export async function fetchInstructorCourses(token) {
    let result = []
    const toastId = toast.loading("Loading...")
    try {

        const response = await apiConnector(
            "GET",
            GET_ALL_INSTRUCTOR_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        )
        console.log("Instructor Courses API response...", response)

        if (!response?.data?.success) {
            throw new Error("Could not Fetch Instructor Courses")
        }
        result = response?.data?.data

    } catch (err) {
        console.log("INSTRUCTOR COURSES API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseCategories = async () => {
    let result = []
    try {
        const response = await apiConnector(
            "GET",
            COURSE_CATEGORIES_API
        )
        console.log("COURSE CATEGORIES API Response...", response)

        if (!response?.data?.success) {
            throw new Error("Could not fetch course categories")
        }
        result = response?.data?.data
    } catch (err) {
        console.log("COURSE_CATEGORY_API API ERROR............", error)
        toast.error(err.message)
    }
    return result
}

export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            EDIT_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        )
        console.log("EDIT COURSE API Response...", response)
        if (!response.data.success) {
            throw new Error("Could not update course details")
        }
        toast.success("Course Details Updated Successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("EDIT COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const addCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = apiConnector(
            "POST",
            CREATE_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer: ${token}`
            }
        )
        console.log("CREATE RESPONSE API Reponse...", response)
        if (!response?.data?.success) {
            throw new Error("Could not add course details")
        }
        toast.success("Course Details Added Successfully")
        result = response?.data?.data
    } catch (err) {
        console.log("CREATE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            CREATE_SECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("CREATE SECTION API RESPONSE...", response)
        if (!response?.data?.success) {
            throw new Error("Could not Create Section")
        }
        toast.success("Course Section Created")
        result = response?.data?.data
    } catch (err) {
        console.log("CREATE SECTION API Error...", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            CREATE_SUBSECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("CREATE SUB-SECTION API RESPONSE...", response)
        if (!response?.data?.success) {
            throw new Error("Could not add lecture")
        }
        toast.success("Lecture Added")
        result = response?.data?.data
    } catch (err) {
        console.log("CREATE SUB-SECTION API ERROR...", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading... ")
    try {
        const response = await apiConnector(
            "POST",
            UPDATE_SECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("UPDATE SECTION API RESPONSE...", response)
        if (response?.data?.success) {
            throw new Error("Could not Update Section")
        }
        toast.success("Course Section Updated")
        result = response?.data?.data
    } catch (err) {
        console.log("UPDATE SECTION API ERROR...", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}


export const updateSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            UPDATE_SUBSECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("UPDATE SUB-SECTION API RESPONSE...", response)
        if (response?.data?.success) {
            throw new Error("Could not Update Lecture")
        }
        toast.success("Lecture Updated")
        result = response?.data?.data
    } catch (err) {
        console.log("UPDATE SUB-SECTION API ERROR...", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            DELETE_SECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("DELETE SECTION API Response...", response)
        if (!response?.data?.success) {
            throw new Error("Could not Delete Section")
        }
        toast.success("Course Section Deleted")
        result = response?.data?.data
    } catch (err) {
        console.log("DELETE SECTION API ERROR...", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE SUB-SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Delete Lecture")
        }
        toast.success("Lecture Deleted")
        result = response?.data?.data
    } catch (error) {
        console.log("DELETE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}
